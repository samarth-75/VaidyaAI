import express from 'express';
import googleTTS from 'google-tts-api';

const router = express.Router();

// POST /api/tts - Get TTS audio as base64
// Body: { text: string, lang: string }
router.post('/', async (req, res) => {
  try {
    const { text, lang = 'en' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    // google-tts-api supports up to ~200 chars per call,
    // so use getAllAudioBase64 for longer texts
    const results = await googleTTS.getAllAudioBase64(text, {
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
      message: error.message || 'Failed to generate speech',
    });
  }
});

export default router;
