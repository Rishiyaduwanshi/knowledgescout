import express from 'express';
import multer from 'multer';
import {
  uploadDocs,
  RetrieveDocs,
  getDoc,
  deleteDoc,
  deleteAllDocs,
  getWorkerStatus,
} from '../controllers/doc.controller.js';
import { authenticate } from '../middlewares/auth.mid.js';
import { validateObjectId } from '../middlewares/validateId.mid.js';

const router = express.Router();
const upload = multer({ dest: 'temp/' });

router.get('/', authenticate, RetrieveDocs);

router.get('/:docId', authenticate, validateObjectId, getDoc);

router.post('/', authenticate, upload.single('file'), uploadDocs);

router.delete('/', authenticate, deleteAllDocs);

router.delete('/:docId', authenticate, validateObjectId, deleteDoc);

router.get('/worker/status', authenticate, getWorkerStatus);

export default router;
