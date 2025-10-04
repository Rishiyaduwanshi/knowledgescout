import express from 'express';
import multer from 'multer';
import {
  uploadDocs,
//   retriveDocuments,
//   deleteAllDocuments,
} from '../controllers/doc.controller.js';

const router = express.Router();
const upload = multer({ dest: 'temp/' });

router
  .route('/')
//   .get(retriveDocuments)
  .post(upload.single('file'), uploadDocs)
//   .delete(deleteAllDocuments);

export default router;
