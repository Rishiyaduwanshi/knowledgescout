import { QdrantClient } from '@qdrant/js-client-rest';
import embeddingModel from '../services/embedding.service.js';
import { config } from '../../config/index.js';
import { AppError, BadRequestError } from '../utils/appError.js';
import { loadQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import llm from '../services/llm.service.js';
import appResponse from '../utils/appResponse.js';

const qdrant = new QdrantClient({
  url: config.QDRANT_URL,
  apiKey: config.QDRANT_API_KEY,
});

export const answerQuery = async (req, res, next) => {
  try {
    const { query, topK } = req.body;
    console.table(req.user);
    console.table(req.user.id);
    const userId = req.user.id;
    if (!query)
      throw new BadRequestError('query is required');

    // 1️⃣ Embed query
    const queryVector = await embeddingModel.embedQuery(query);

    console.log("i am here 1-------")
    
    // 2️⃣ Retrieve top-k chunks from Qdrant
    const searchResult = await qdrant.query(config.QDRANT_COLLECTION_NAME, {
      query: queryVector,
      limit: topK,
      with_payload : true,
      filter: { must: [{ key: 'userId', match: { value: userId } }] },
    });
    console.log("i am here 2-------")

    console.log("searchResult=====>", searchResult)

    if (!searchResult.length) {
      return appResponse(res, {
        message: 'No relevant answer found',
        data: { answer: 'No relevant documents found.', sources: [] },
      });
    }

    console.table("searchResult---------------", JSON.stringify(searchResult, null, 2))

    const docs = searchResult.points.map(
      (hit) =>
        new Document({
          pageContent: hit.payload.pageContent || hit.payload.text,
          metadata: {
            fileName: hit.payload.fileName,
            docId: hit.payload.docId,
            filePath: hit.payload.filePath,
            totalPages : hit.payload.metadata.totalPages, 
            pageNo : hit.payload.metadata.pageNo,
            from : hit.payload.metadata.from,
            to : hit.payload.metadata.to
          },
        })
    );

    console.log(docs)

    // 4️⃣ LLM chain
    const chain = loadQAChain(llm);
    const answer = await chain.call({ input_documents: docs, question: query });

    appResponse(res, {
      data: {
        answer: answer.text,
        sources: docs.map((d) => ({
          fileName: d.metadata.fileName,
          docId: d.metadata.docId,
          filePath: d.metadata.filePath,
          totalPages : d.metadata.totalPages, 
          pageNo : d.metadata.pageNo
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};
