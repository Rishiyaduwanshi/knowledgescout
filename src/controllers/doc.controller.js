import fs from 'fs';
import path from 'path';
import { AppError, BadRequestError, NotFoundError } from '../utils/appError.js';
import appResponse from '../utils/appResponse.js';
import { config } from '../../config/index.js';
import Doc from '../models/doc.model.js';
import qdrant from '../../db/connectQdrant.js';
import logger from '../utils/errorLogger.js';

export const uploadDocs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) throw new BadRequestError('User Id is required');
    if (!req.file) throw new BadRequestError('File is required');

    const timestamp = Date.now();
    const userDir = path.join(config.UPLOAD_DIR, userId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const newFileName = `${timestamp}_${req.file.originalname}`;
    const destPath = path.join(userDir, newFileName);

    fs.renameSync(req.file.path, destPath);

    const newDoc = await Doc.create({
      userId: req?.user?.id,
      fileName: req?.file?.originalname,
      filePath: destPath,
      status: 'pending',
    });

    const queueFile = config.QUEUE_FILE;

    let queue = [];
    if (fs.existsSync(queueFile)) {
      try {
        const data = fs.readFileSync(queueFile, 'utf-8') || [];
        queue = data ? JSON.parse(data) : [];
      } catch (e) {
        console.error('Queue file corrupted, resetting...', e);
        queue = [];
      }
    }

    queue.push({
      docId: newDoc._id,
      userId: req?.user?.id,
      filePath: destPath,
      fileName: req.file.originalname,
      timestamp,
      status: 'pending',
    });

    fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2));

    return appResponse(res, {
      message: `${req.file.originalname} uploaded and queued for processing.`,
      data: newDoc,
    });
  } catch (err) {
    next(err);
  }
};

export const RetrieveDocs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = parseInt(req.query.offset, 10) || 0;

    const totalDocs = await Doc.countDocuments({ userId });

    const docs = await Doc.find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    return appResponse(res, {
      message: 'Documents retrieved successfully',
      data: {
        total: totalDocs,
        limit,
        offset,
        docs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDoc = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const docId = req.params.docId;

    const doc = await Doc.findOne({ userId, _id: docId });

    if (!doc) {
      throw new NotFoundError('No document found with this id');
    }

    return appResponse(res, {
      message: 'Document retrieved successfully',
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDoc = async (req, res, next) => {
  console.log("ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
  try {
    console.log("i am here--------")
    const userId = req.user.id;
    const docId = req.params.docId;

    console.log(userId, docId)

    const doc = await Doc.findOne({ _id: docId, userId });
    if (!doc) throw new NotFoundError('Document not found');

    await Doc.deleteOne({ _id: docId, userId });

    try {
      await qdrant.deletePoints(config.QDRANT_COLLECTION_NAME, {
        points: [doc._id.toString()],
      });
    } catch (err) {
      logger.error(`Qdrant delete failed: ${err}`);
    }

    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    return appResponse(res, {
      message: 'Document deleted successfully',
      data: { docId },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAllDocs = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const docs = await Doc.find({ userId });
    if (!docs.length) throw new NotFoundError('No documents found');

    const docIds = docs.map((d) => d._id.toString());

    await Promise.all([
      Doc.deleteMany({ userId }),

      (async () => {
        try {
          const client = await qdrant();
          console.log(client);

          const deleted = client.delete(config.QDRANT_COLLECTION_NAME, {
            filter: {
              must: [
                {
                  key: 'userId',

                  match: {
                    value: `${userId}`,
                  },
                },
              ],
            },
          });

          console.log(deleted);
          console.log(deleted.status);
        } catch (err) {
          logger.error(`Qdrant delete failed: ${err}`);
        }
      })(),

      (async () => {
        await Promise.all(
          docs.map(async (doc) => {
            if (fs.existsSync(doc.filePath)) {
              fs.unlinkSync(doc.filePath);
            }
          })
        );
      })(),
    ]);

    return appResponse(res, {
      message: 'All documents deleted successfully',
      data: { deletedCount: docs.length },
    });
  } catch (err) {
    next(err);
  }
};
