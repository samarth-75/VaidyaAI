import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { analyzeReport, getHistory, upload } from '../controllers/reportController.js';

const router = express.Router();

// POST /api/report/analyze
// Protected route — requires JWT token
// Accepts a single file upload (field name: "file")
router.post('/analyze', protect, upload.single('file'), analyzeReport);

// GET /api/report/history
// Protected route — fetches user's past analyzed reports
router.get('/history', protect, getHistory);

export default router;
