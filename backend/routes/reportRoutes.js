import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { analyzeReport, upload } from '../controllers/reportController.js';

const router = express.Router();

// POST /api/report/analyze
// Protected route — requires JWT token
// Accepts a single file upload (field name: "file")
router.post('/analyze', protect, upload.single('file'), analyzeReport);

export default router;
