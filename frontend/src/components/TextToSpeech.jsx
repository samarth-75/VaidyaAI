import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Pause, Play, Square, VolumeX } from 'lucide-react';

// ─── Language code mapping (app code → Google TTS language tag) ──────────────
const LANG_MAP = {
  en: 'en',
  hi: 'hi',
  mr: 'mr',
  ta: 'ta',
  te: 'te',
  bn: 'bn',
  gu: 'gu',
  kn: 'kn',
};

// ─── UI label translations ──────────────────────────────────────────────────
const ttsTranslations = {
  en: { listen: 'Listen', pause: 'Pause', resume: 'Resume', stop: 'Stop', speaking: 'Speaking…', paused: 'Paused', loading: 'Loading audio…' },
  hi: { listen: 'सुनें', pause: 'रोकें', resume: 'जारी रखें', stop: 'बंद करें', speaking: 'बोल रहा है…', paused: 'रुका हुआ', loading: 'ऑडियो लोड हो रहा है…' },
  mr: { listen: 'ऐका', pause: 'थांबवा', resume: 'पुन्हा सुरू', stop: 'बंद करा', speaking: 'बोलत आहे…', paused: 'थांबलेले', loading: 'ऑडिओ लोड होत आहे…' },
  ta: { listen: 'கேளுங்கள்', pause: 'இடைநிறுத்து', resume: 'தொடர்', stop: 'நிறுத்து', speaking: 'பேசுகிறது…', paused: 'இடைநிறுத்தப்பட்டது', loading: 'ஆடியோ ஏற்றப்படுகிறது…' },
  te: { listen: 'వినండి', pause: 'ఆపు', resume: 'కొనసాగించు', stop: 'ఆపివేయి', speaking: 'మాట్లాడుతోంది…', paused: 'ఆపివేయబడింది', loading: 'ఆడియో లోడ్ అవుతోంది…' },
  bn: { listen: 'শুনুন', pause: 'থামান', resume: 'আবার শুরু', stop: 'বন্ধ করুন', speaking: 'বলছে…', paused: 'থামানো হয়েছে', loading: 'অডিও লোড হচ্ছে…' },
  gu: { listen: 'સાંભળો', pause: 'થોભો', resume: 'ચાલુ રાખો', stop: 'બંધ કરો', speaking: 'બોલી રહ્યું છે…', paused: 'થોભેલું', loading: 'ઑડિયો લોડ થઈ રહ્યું છે…' },
  kn: { listen: 'ಕೇಳಿ', pause: 'ವಿರಾಮ', resume: 'ಮುಂದುವರಿಸಿ', stop: 'ನಿಲ್ಲಿಸಿ', speaking: 'ಮಾತನಾಡುತ್ತಿದೆ…', paused: 'ವಿರಾಮಗೊಂಡಿದೆ', loading: 'ಆಡಿಯೋ ಲೋಡ್ ಆಗುತ್ತಿದೆ…' },
};

// ─── Component ───────────────────────────────────────────────────────────────
const TextToSpeech = ({ text, currentLang = 'en' }) => {
  const [status, setStatus] = useState('idle'); // idle | loading | speaking | paused
  const audioRef = useRef(null);
  const chunkIndexRef = useRef(0);
  const audioChunksRef = useRef([]);  // base64 chunks from backend

  const t = ttsTranslations[currentLang] || ttsTranslations.en;
  const langTag = LANG_MAP[currentLang] || 'en';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Play a single chunk, then recursively play the next
  const playChunk = useCallback((index) => {
    if (index >= audioChunksRef.current.length) {
      setStatus('idle');
      audioRef.current = null;
      return;
    }
    chunkIndexRef.current = index;

    const dataUri = `data:audio/mpeg;base64,${audioChunksRef.current[index]}`;
    const audio = new Audio(dataUri);
    audioRef.current = audio;

    audio.onended = () => {
      playChunk(index + 1);
    };

    audio.onerror = (e) => {
      console.warn('TTS audio error on chunk', index, e);
      playChunk(index + 1); // skip to next chunk
    };

    audio.play().catch((err) => {
      console.warn('TTS play failed:', err);
      setStatus('idle');
    });
  }, []);

  const handlePlay = useCallback(async () => {
    if (!text) return;

    // Stop anything currently playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    setStatus('loading');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang: langTag }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'TTS request failed');
      }

      audioChunksRef.current = data.audioChunks;
      chunkIndexRef.current = 0;
      setStatus('speaking');
      playChunk(0);
    } catch (err) {
      console.error('TTS fetch error:', err);
      setStatus('idle');
    }
  }, [text, langTag, playChunk]);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus('paused');
    }
  }, []);

  const handleResume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setStatus('speaking');
    }
  }, []);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    audioChunksRef.current = [];
    setStatus('idle');
  }, []);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Play / Listen */}
        {status === 'idle' && (
          <button
            onClick={handlePlay}
            disabled={!text}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Volume2 className="w-4 h-4" />
            {t.listen}
          </button>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-semibold text-sm cursor-wait"
          >
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t.loading}
          </button>
        )}

        {/* Pause */}
        {status === 'speaking' && (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Pause className="w-4 h-4" />
            {t.pause}
          </button>
        )}

        {/* Resume */}
        {status === 'paused' && (
          <button
            onClick={handleResume}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Play className="w-4 h-4" />
            {t.resume}
          </button>
        )}

        {/* Stop */}
        {(status === 'speaking' || status === 'paused') && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Square className="w-4 h-4" />
            {t.stop}
          </button>
        )}

        {/* Status indicator */}
        {status === 'speaking' && (
          <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium ml-2">
            <span className="flex gap-0.5">
              <span className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
              <span className="w-1 h-5 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></span>
              <span className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></span>
            </span>
            {t.speaking}
          </span>
        )}

        {status === 'paused' && (
          <span className="text-amber-600 text-sm font-medium ml-2">
            ⏸ {t.paused}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;
