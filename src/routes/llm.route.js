import express from 'express';
import { answerQuery } from '../controllers/ansQuery.controller.js';
import { authenticate } from '../middlewares/auth.mid.js';


const router = express.Router();

router.post("/", authenticate, answerQuery)

export default router;
