import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, RotateCcw, Bot, User } from 'lucide-react';
import { UI, CHIPS, RESPONSES, KEYWORD_MAP, CHIP_ORDER, PAGE_CHIPS, CATEGORIES } from './chatbotData';



// ─── Simple markdown-ish renderer (bold, newlines) ───────────────────────────
function formatMessage(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

// ─── Component ───────────────────────────────────────────────────────────────
const VaidyaGuideChatbot = ({ currentLang = 'en', currentPage = 'dashboard', isLoggedIn = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedIntent, setSelectedIntent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const ui = UI[currentLang] || UI.en;
  const chips = CHIPS[currentLang] || CHIPS.en;
  const responses = RESPONSES[currentLang] || RESPONSES.en;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus select when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Send welcome message on first open
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      setMessages([{ role: 'bot', text: ui.welcome, time: new Date() }]);
    }
  }, [hasOpened, ui.welcome]);

  // Add bot response with typing delay
  const addBotMessage = useCallback((text) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text, time: new Date() }]);
    }, 600 + Math.random() * 400);
  }, []);

  // Handle chip click
  const handleChip = useCallback((intentKey) => {
    const chipLabel = chips[intentKey] || intentKey;
    setMessages(prev => [...prev, { role: 'user', text: chipLabel, time: new Date() }]);
    const response = responses[intentKey] || responses.about;
    addBotMessage(response);
  }, [chips, responses, addBotMessage]);

  // Handle selected input
  const handleSend = useCallback(() => {
    if (!selectedIntent) return;

    const chipLabel = chips[selectedIntent] || selectedIntent;
    setMessages(prev => [...prev, { role: 'user', text: chipLabel, time: new Date() }]);
    setSelectedIntent('');

    const response = responses[selectedIntent] || responses.about;
    addBotMessage(response);
  }, [selectedIntent, chips, responses, addBotMessage]);

  const handleSelectChange = (e) => {
    setSelectedIntent(e.target.value);
  };

  // Restart chat
  const handleRestart = () => {
    setMessages([{ role: 'bot', text: ui.welcome, time: new Date() }]);
  };

  // Get context-aware chips
  const contextChips = PAGE_CHIPS[currentPage] || CHIP_ORDER;
  const displayChips = contextChips.slice(0, 6);

  // Time formatter
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-emerald-300/50 transition-all duration-300 group"
          aria-label="Open guide chatbot"
        >
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden"
          style={{ height: 'min(580px, calc(100vh - 3rem))', animation: 'chatSlideUp 0.3s ease-out' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm truncate">{ui.title}</h3>
              <p className="text-emerald-100 text-xs truncate">{ui.poweredBy}</p>
            </div>
            <button onClick={handleRestart} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title={ui.restart}>
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title={ui.close}>
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-emerald-50/50 to-white" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
                    : 'bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-md'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                  <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {formatTime(msg.time)}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Chips (show after welcome or fallback) */}
            {messages.length > 0 && !isTyping && (
              <div className="pt-2">
                <p className="text-xs text-gray-400 mb-2 font-medium">{ui.suggestedTitle}</p>
                <div className="flex flex-wrap gap-1.5">
                  {displayChips.map(key => (
                    <button
                      key={key}
                      onClick={() => handleChip(key)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200 hover:border-emerald-300 transition-all duration-200 hover:scale-105"
                    >
                      {chips[key]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <select
                ref={inputRef}
                value={selectedIntent}
                onChange={handleSelectChange}
                className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all cursor-pointer"
                style={{ appearance: 'none', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")` }}
              >
                <option value="" disabled>{ui.placeholder || "Select a question..."}</option>
                {(CATEGORIES[currentLang] || CATEGORIES.en).map((category, idx) => (
                  <optgroup key={idx} label={category.label}>
                    {category.intents.map(intent => (
                      <option key={intent} value={intent}>
                        {chips[intent]}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <button
                onClick={handleSend}
                disabled={!selectedIntent}
                className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:hover:scale-100 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default VaidyaGuideChatbot;
