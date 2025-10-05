import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from './config/index.js';
import { getLogger } from './src/utils/errorLogger.js';
import embeddingModel from './src/services/embedding.service.js';
import Doc from './src/models/doc.model.js';
import { AppError } from './src/utils/appError.js';

const logger = getLogger('logs/worker.log');

await mongoose.connect(config.MONGO_URI);
logger.info('Connected to MongoDB (worker)');

const qdrant = new QdrantClient({
  url: config.QDRANT_URL,
  apiKey: config.QDRANT_API_KEY,
});

const loadDocument = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  let loader;
  if (ext === '.pdf') loader = new PDFLoader(filePath);
  else if (ext === '.docx') loader = new DocxLoader(filePath);
  else throw new Error('Unsupported file type: ' + ext);
  return loader.load();
};

export const processQueue = async () => {
  if (!fs.existsSync(config.QUEUE_FILE)) return;

  let queueData = JSON.parse(fs.readFileSync(config.QUEUE_FILE, 'utf-8'));
  if (!queueData.length) return;

  for (let i = 0; i < queueData.length; i++) {
    const item = queueData[i];
    const { docId, userId, filePath, fileName, timestamp } = item;

    try {
      const docRecord = await Doc.findById(docId);
      if (!docRecord) throw new Error('Doc record not found in DB');

      logger.info(`Processing: ${fileName}`);
      await Doc.findByIdAndUpdate(docId, { status: 'processing' });

      const normalizedPath = path.resolve(filePath);
      if (!fs.existsSync(normalizedPath)) {
        throw new Error(`File not found at path: ${normalizedPath}`);
      }

      const docs = await loadDocument(normalizedPath);

      if (!docs || !docs.length || !docs[0].pageContent?.trim()) {
        throw new AppError({
          message:
            'Document contains no readable text. Possibly image-based PDF.',
        });
      }

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const textChunks = await splitter.splitDocuments(docs);

      const points = [];
      let metadata = null;
      for (const chunk of textChunks) {

        const vector = await embeddingModel.embedQuery(chunk.pageContent);
        metadata = {
          totalPages: chunk.metadata.pdf.totalPages,
          pageNo: chunk.metadata.loc.pageNumber,
          from: chunk.metadata.loc.lines.from,
          to: chunk.metadata.loc.lines.to,
        };
        points.push({
          id: Date.now(),
          vector, 
          payload: {
            userId,
            fileName,
            filePath: normalizedPath,
            docId,
            metadata,
            pageContent : chunk.pageContent,
          },
        });
      }

      await qdrant.upsert(config.QDRANT_COLLECTION_NAME, {
        wait: true,
        points,
      });

      await Doc.findByIdAndUpdate(docId, { status: 'completed', error: null, metadata });

      logger.info(
        `✅ Processed ${fileName} for user ${userId} (${textChunks.length} chunks)`
      );

      queueData.splice(i, 1);
      i--;
      fs.writeFileSync(config.QUEUE_FILE, JSON.stringify(queueData, null, 2));
    } catch (err) {
      logger.error(`❌ Error processing ${fileName}: ${err.message}`);
      console.error(err);

      await Doc.findByIdAndUpdate(item.docId, {
        status: 'failed',
        error: err.message,
      });
    }
  }
};

let isProcessing = false;

const startWorker = async () => {
  setInterval(async () => {
    if (isProcessing) return;
    isProcessing = true;
    try {
      await processQueue();
    } finally {
      isProcessing = false;
    }
  }, 3000);
};

await processQueue();
