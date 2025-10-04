import fs from 'fs';
import path from 'path';
import { BadRequestError } from '../utils/appError.js';
import appResponse from '../utils/appResponse.js';
import { config } from '../../config/index.js';
import Doc from '../models/doc.model.js';

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
      userId : req?.user?.id,
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
      docId : newDoc._id,
      userId : req?.user?.id,
      filePath: destPath,
      fileName: req.file.originalname,
      timestamp,
      status: 'pending',
    });

    fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2));

    return appResponse(res, {
      message: `${req.file.originalname} uploaded and queued for processing.`,
      data : newDoc
    });
  } catch (err) {
    next(err);
  }
};
