import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../../config/index.js';
import appResponse from '../utils/appResponse.js';
import Doc from '../models/doc.model.js';
import fs from 'fs';
// import { processQueue } from '../../worker.js';

const qdrant = new QdrantClient({
  url: config.QDRANT_URL,
  apiKey: config.QDRANT_API_KEY,
});

export const rebuildIndex = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    try {
      await qdrant.delete(config.QDRANT_COLLECTION_NAME, {
        filter: {
          must: [{ key: 'userId', match: { value: userId.toString() } }]
        }
      });
    } catch (error) {
      console.log('Error clearing existing index:', error.message);
    }

    await Doc.updateMany(
      { userId }, 
      { status: 'pending', error: null }
    );

    const docs = await Doc.find({ userId, status: 'pending' });
    const queueFile = config.QUEUE_FILE;
    
    let queue = [];
    if (fs.existsSync(queueFile)) {
      try {
        const data = fs.readFileSync(queueFile, 'utf-8');
        queue = data ? JSON.parse(data) : [];
      } catch (e) {
        queue = [];
      }
    }

    docs.forEach(doc => {
      queue.push({
        docId: doc._id,
        userId: doc.userId,
        filePath: doc.filePath,
        fileName: doc.fileName,
        timestamp: Date.now(),
        status: 'pending',
      });
    });

    fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2));

    setImmediate(() => {
      processQueue().catch(err => console.error('Queue processing error:', err));
    });

    return appResponse(res, {
      message: 'Index rebuild initiated successfully',
      data: { 
        documentsQueued: docs.length,
        status: 'processing'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getIndexStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalDocs = await Doc.countDocuments({ userId });
    const pendingDocs = await Doc.countDocuments({ userId, status: 'pending' });
    const processingDocs = await Doc.countDocuments({ userId, status: 'processing' });
    const completedDocs = await Doc.countDocuments({ userId, status: 'completed' });
    const failedDocs = await Doc.countDocuments({ userId, status: 'failed' });

    let qdrantStats = null;
    try {
      const collectionInfo = await qdrant.getCollection(config.QDRANT_COLLECTION_NAME);
      qdrantStats = {
        totalPoints: collectionInfo.points_count,
        indexedVectors: collectionInfo.indexed_vectors_count,
        status: collectionInfo.status
      };
    } catch (error) {
      qdrantStats = { error: 'Unable to fetch Qdrant stats' };
    }

    let userPointCount = 0;
    try {
      const scrollResult = await qdrant.scroll(config.QDRANT_COLLECTION_NAME, {
        filter: { must: [{ key: 'userId', match: { value: userId.toString() } }] },
        limit: 1,
        with_payload: false,
        with_vectors: false
      });
      userPointCount = scrollResult.points.length > 0 ? 'Available' : 0;
    } catch (error) {
      userPointCount = 'Unknown';
    }

    return appResponse(res, {
      message: 'Index statistics retrieved successfully',
      data: {
        documents: {
          total: totalDocs,
          pending: pendingDocs,
          processing: processingDocs,
          completed: completedDocs,
          failed: failedDocs
        },
        index: {
          userVectors: userPointCount,
          ...qdrantStats
        },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};