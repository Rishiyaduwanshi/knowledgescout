import { Router } from 'express';
import {
  register as signup,
  login as signin,
  refreshToken,
  logout as signout,
  getProfile,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.mid.js';

const router = Router();

// Auth routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh-token', refreshToken);
router.post('/signout', signout);
router.get('/profile', authenticate, getProfile);

export default router;