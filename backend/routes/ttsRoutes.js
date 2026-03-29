import express from 'express';
import rateLimit from 'express-rate-limit';
import googleTTS from 'google-tts-api';

const router = express.Router();

// ─── Rate limiter: max 10 TTS requests per minute per IP ────────────────────
const ttsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'Too many TTS requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/tts - Get TTS audio as base64
// Body: { text: string, lang: string }
router.post('/', ttsLimiter, async (req, res) => {
  try {
    const { text, lang = 'en' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    // Cap text length to prevent abuse (5000 chars max)
    const safeText = text.slice(0, 5000);

    // google-tts-api supports up to ~200 chars per call,
    // so use getAllAudioBase64 for longer texts
    const results = await googleTTS.getAllAudioBase64(safeText, {
      lang,
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.!?;:।',
    });

    // Concatenate all base64 chunks into a single array
    const audioChunks = results.map(r => r.base64);

    res.json({ success: true, audioChunks });
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate speech',
    });
  }
});

export default router;
