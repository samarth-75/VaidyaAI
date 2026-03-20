import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Volume2, Pause, Play, Square, VolumeX } from 'lucide-react';

// ─── Language code mapping (app code → BCP 47 tag) ─────────────────────────
const LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
};

// ─── UI label translations ──────────────────────────────────────────────────
const ttsTranslations = {
  en: { listen: 'Listen', pause: 'Pause', resume: 'Resume', stop: 'Stop', speaking: 'Speaking…', paused: 'Paused', noSupport: 'Your browser does not support text-to-speech' },
  hi: { listen: 'सुनें', pause: 'रोकें', resume: 'जारी रखें', stop: 'बंद करें', speaking: 'बोल रहा है…', paused: 'रुका हुआ', noSupport: 'आपका ब्राउज़र टेक्स्ट-टू-स्पीच समर्थन नहीं करता' },
  mr: { listen: 'ऐका', pause: 'थांबवा', resume: 'पुन्हा सुरू', stop: 'बंद करा', speaking: 'बोलत आहे…', paused: 'थांबलेले', noSupport: 'तुमचा ब्राउझर टेक्स्ट-टू-स्पीच समर्थन करत नाही' },
  ta: { listen: 'கேளுங்கள்', pause: 'இடைநிறுத்து', resume: 'தொடர்', stop: 'நிறுத்து', speaking: 'பேசுகிறது…', paused: 'இடைநிறுத்தப்பட்டது', noSupport: 'உங்கள் உலாவி உரையிலிருந்து பேச்சை ஆதரிக்கவில்லை' },
  te: { listen: 'వినండి', pause: 'ఆపు', resume: 'కొనసాగించు', stop: 'ఆపివేయి', speaking: 'మాట్లాడుతోంది…', paused: 'ఆపివేయబడింది', noSupport: 'మీ బ్రౌజర్ టెక్స్ట్-టు-స్పీచ్ మద్దతు ఇవ్వదు' },
  bn: { listen: 'শুনুন', pause: 'থামান', resume: 'আবার শুরু', stop: 'বন্ধ করুন', speaking: 'বলছে…', paused: 'থামানো হয়েছে', noSupport: 'আপনার ব্রাউজার টেক্সট-টু-স্পিচ সমর্থন করে না' },
  gu: { listen: 'સાંભળો', pause: 'થોભો', resume: 'ચાલુ રાખો', stop: 'બંધ કરો', speaking: 'બોલી રહ્યું છે…', paused: 'થોભેલું', noSupport: 'તમારું બ્રાઉઝર ટેક્સ્ટ-ટુ-સ્પીચ સપોર્ટ કરતું નથી' },
  kn: { listen: 'ಕೇಳಿ', pause: 'ವಿರಾಮ', resume: 'ಮುಂದುವರಿಸಿ', stop: 'ನಿಲ್ಲಿಸಿ', speaking: 'ಮಾತನಾಡುತ್ತಿದೆ…', paused: 'ವಿರಾಮಗೊಂಡಿದೆ', noSupport: 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಪಠ್ಯ-ಗೆ-ಮಾತು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ' },
};

// ─── Chunk long text at sentence boundaries (~200 chars) ─────────────────────
function chunkText(text, maxLen = 200) {
  if (!text) return [];
  const sentences = text.match(/[^.!?।।\n]+[.!?।।\n]?/g) || [text];
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// ─── Find best voice for a language ──────────────────────────────────────────
function findBestVoice(langTag) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // 1. Exact match (e.g. hi-IN)
  let voice = voices.find(v => v.lang === langTag);
  if (voice) return voice;

  // 2. Prefix match (e.g. hi)
  const prefix = langTag.split('-')[0];
  voice = voices.find(v => v.lang.startsWith(prefix));
  if (voice) return voice;

  // 3. Fallback to en-IN or any English
  voice = voices.find(v => v.lang === 'en-IN');
  if (voice) return voice;

  voice = voices.find(v => v.lang.startsWith('en'));
  return voice || voices[0];
}

// ─── Component ───────────────────────────────────────────────────────────────
const TextToSpeech = ({ text, currentLang = 'en' }) => {
  const [status, setStatus] = useState('idle'); // idle | speaking | paused
  const chunkIndexRef = useRef(0);
  const chunksRef = useRef([]);
  const utteranceRef = useRef(null);

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const t = ttsTranslations[currentLang] || ttsTranslations.en;
  const langTag = LANG_MAP[currentLang] || 'en-IN';

  // Ensure voices are loaded (some browsers load them asynchronously)
  useEffect(() => {
    if (!supported) return;
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [supported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  // Speak a single chunk, then recursively speak the next
  const speakChunk = useCallback((index) => {
    if (index >= chunksRef.current.length) {
      setStatus('idle');
      return;
    }
    chunkIndexRef.current = index;

    const utterance = new SpeechSynthesisUtterance(chunksRef.current[index]);
    utterance.lang = langTag;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voice = findBestVoice(langTag);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      speakChunk(index + 1);
    };
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('TTS error:', e.error);
      }
      setStatus('idle');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [langTag]);

  const handlePlay = useCallback(() => {
    if (!supported || !text) return;

    // Cancel anything currently playing
    window.speechSynthesis.cancel();

    const chunks = chunkText(text);
    chunksRef.current = chunks;
    chunkIndexRef.current = 0;
    setStatus('speaking');

    // Small delay to let cancel() finish
    setTimeout(() => {
      speakChunk(0);
    }, 50);
  }, [supported, text, speakChunk]);

  const handlePause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setStatus('paused');
  }, [supported]);

  const handleResume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setStatus('speaking');
  }, [supported]);

  const handleStop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setStatus('idle');
  }, [supported]);

  if (!supported) {
    return (
      <div className="flex items-center gap-2 text-amber-600 text-sm mt-3">
        <VolumeX className="w-4 h-4" />
        <span>{t.noSupport}</span>
      </div>
    );
  }

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
