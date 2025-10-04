import express from 'express';
import multer from 'multer';
import {
  uploadDocs,
  //   retriveDocuments,
  //   deleteAllDocuments,
} from '../controllers/doc.controller.js';
import {authenticate} from '../middlewares/auth.mid.js';

const router = express.Router();
const upload = multer({ dest: 'temp/' });

router
  .route('/')
  //   .get(retriveDocuments)
  .post(authenticate, upload.single('file'), uploadDocs);
//   .delete(deleteAllDocuments);

export default router;
