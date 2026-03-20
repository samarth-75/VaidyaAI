import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { analyzeReport, getHistory, deleteReport, upload } from '../controllers/reportController.js';

const router = express.Router();

// POST /api/report/analyze
// Protected route — requires JWT token
// Accepts a single file upload (field name: "file")
router.post('/analyze', protect, upload.single('file'), analyzeReport);

// GET /api/report/history
// Protected route — fetches user's past analyzed reports
router.get('/history', protect, getHistory);

// DELETE /api/report/history/:id
// Protected route — deletes a specific report from history
router.delete('/history/:id', protect, deleteReport);

export default router;
