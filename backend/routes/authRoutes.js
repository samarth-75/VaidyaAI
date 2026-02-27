import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { changeEmail, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Change email and password
router.put('/change-email', protect, changeEmail);
router.put('/change-password', protect, changePassword);

export default router;
