import fs from 'fs';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from './config/index.js';
import { getLogger } from './src/utils/errorLogger.js';
import embeddingModel from './src/services/embedding.service.js';
const logger = getLogger('logs/worker.log');

const qdrant = new QdrantClient({
  url: config.QDRANT_URL,
  apiKey: config.QDRANT_API_KEY,
});

// Load document (PDF/DOCX)
const loadDocument = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  let loader;
  if (ext === '.pdf') loader = new PDFLoader(filePath);
  else if (ext === '.docx') loader = new DocxLoader(filePath);
  else throw new Error('Unsupported file type: ' + ext);
  return loader.load();
};

// Process queue
export const processQueue = async () => {
  if (!fs.existsSync(config.QUEUE_FILE)) return;

  const queueData = JSON.parse(fs.readFileSync(config.QUEUE_FILE, 'utf-8'));
  if (!queueData.length) return;

  for (let i = 0; i < 1; i++) {
    const item = queueData[i];
    const { userID, filePath, fileName, timestamp } = item;

    try {
      logger.info(`Processing: ${fileName}`);

      // Absolute path
      const normalizedPath = path.resolve(filePath);

      console.log("normalizedPath-------------------", normalizedPath)
      if (!fs.existsSync(normalizedPath)) {
        throw new Error(`File not found at path: ${normalizedPath}`);
      }

      // Load document
      const docs = await loadDocument(normalizedPath);

      // Split into chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      console.log("docs-------", docs)
      const textChunks = await splitter.splitDocuments(docs);

      console.log("textChunks1------------",textChunks)

      // Generate embeddings & insert into Qdrant
      const points = [];
      for (const chunk of textChunks) {
        const vector = await embeddingModel.embedQuery(chunk.pageContent);
        points.push({
          id: timestamp,
          vector,
          payload: { userID, fileName, timestamp },
        });
      }

      console.log("------------------> ",config.QDRANT_COLLECTION_NAME)
      console.log(points)
      const opeartionInfo = await qdrant.upsert(config.QDRANT_COLLECTION_NAME,{
        wait: true,
        points : points,
      });

      console.log(opeartionInfo)

      logger.info(
        `Processed ${fileName} for user ${userID} (${textChunks.length} chunks)`
      );

      // Remove processed item from queue
      queueData.splice(i, 1);
      fs.writeFileSync(config.QUEUE_FILE, JSON.stringify(queueData, null, 2));
      i--;
    } catch (err) {
      logger.error(`Error processing file: ${fileName} - ${err.stack}`);
      console.error(err.stack);
    }
  }
};

// Worker interval
let isProcessing = false;

const startWorker = async () => {
  // Note: collection is already created via migration
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

// startWorker();
processQueue()
