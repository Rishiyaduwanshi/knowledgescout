import express from 'express';
import appResponse from '../utils/appResponse.js';
import { config } from '../../config/index.js';
import Doc from '../models/doc.model.js';
import { QdrantClient } from '@qdrant/js-client-rest';

const router = express.Router();

const qdrant = new QdrantClient({
  url: config.QDRANT_URL,
  apiKey: config.QDRANT_API_KEY,
});

router.get('/health', async (req, res) => {
  try {
    const dbStatus = await Doc.countDocuments({}).then(() => 'healthy').catch(() => 'unhealthy');
    
    let qdrantStatus = 'unhealthy';
    try {
      await qdrant.getCollections();
      qdrantStatus = 'healthy';
    } catch (error) {
      qdrantStatus = 'unhealthy';
    }

    const isHealthy = dbStatus === 'healthy' && qdrantStatus === 'healthy';

    return appResponse(res, {
      message: isHealthy ? 'All systems operational' : 'Some systems down',
      data: {
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          database: dbStatus,
          vectorStore: qdrantStatus,
          api: 'healthy'
        }
      }
    }, isHealthy ? 200 : 503);
  } catch (error) {
    return appResponse(res, {
      message: 'Health check failed',
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      }
    }, 503);
  }
});

router.get('/_meta', (req, res) => {
  return appResponse(res, {
    message: 'API metadata',
    data: {
      name: config.APP_NAME,
      version: config.VERSION,
      environment: config.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      frontend : config.ALLOWED_ORIGINS,
      endpoints: {
        docs: {
          'POST /api/v1/docs': 'Upload document (multipart)',
          'GET /api/v1/docs': 'List documents with pagination',
          'GET /api/v1/docs/:docId': 'Get specific document',
          'DELETE /api/v1/docs/:docId': 'Delete specific document',
          'DELETE /api/v1/docs': 'Delete all user documents'
        },
        query: {
          'POST /api/v1/ask': 'Ask questions about documents'
        },
        index: {
          'POST /api/v1/index/rebuild': 'Rebuild search index',
          'GET /api/v1/index/stats': 'Get index statistics'
        },
        auth: {
          'POST /api/v1/auth/signup': 'Signup new user',
          'POST /api/v1/auth/signin': 'Signin user',
          'POST /api/v1/auth/signout': 'Signout user',
        },
        system: {
          'GET /api/v1/health': 'Health check',
          'GET /api/v1/_meta': 'API metadata',
          'GET /.well-known/hackathon.json': 'Hackathon info'
        }
      },
      features: {
        authentication: true,
        fileUpload: true,
        vectorSearch: true,
        caching: true,
        pagination: true,
        privateDocuments: true
      }
    }
  });
});

export default router;