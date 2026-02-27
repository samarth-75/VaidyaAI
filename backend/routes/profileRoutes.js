import express from 'express';
import { getProfile, saveProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All profile routes are protected
router.get('/', protect, getProfile);
router.put('/', protect, saveProfile);

export default router;
