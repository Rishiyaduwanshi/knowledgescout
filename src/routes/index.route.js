import express from 'express';
import { rebuildIndex, getIndexStats } from '../controllers/index.controller.js';
import { authenticate } from '../middlewares/auth.mid.js';

const router = express.Router();

router.post('/rebuild', authenticate, rebuildIndex);
router.get('/stats', authenticate, getIndexStats);

export default router;