import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageCircle, 
  RotateCcw, 
  Key, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const SYSTEM_PROMPT = `
You are a warm, humble, and friendly human team consultant at MakeASite, working directly alongside Arvind Singh (the founder).
Tone & Personality:
- Speak completely like a real, polite, and caring human being talking on WhatsApp or over a friendly call.
- NEVER say "As an AI" or give robotic, formal corporate replies.
- Talk naturally in conversational Hinglish (or English if the user types in English). Use natural, respectful Indian conversational phrases like "Namaste ji!", "Haanji bilkul!", "Aap bilkul fikar na karein", "Hum aapke project ko best banayenge".
- Keep your answers concise, clear, and helpful.

MakeASite Key Details:
- Experience: 1000+ successful projects delivered with high client satisfaction.
- Services: Portfolio & business websites, responsive landing pages, e-commerce stores, custom dynamic web apps with database & login, admin dashboards, and SEO optimization.
- Pricing Estimates (Important):
  * Static Websites: ~₹3,000 - ₹5,000 (usually includes 7-8 pages base).
  * Dynamic Websites: ~₹5,000 - ₹10,000+ (includes database & user login).
  * Custom Web Apps & Dashboards: ₹15,000+.
  * Clarify politely that these are estimates; if they need more pages or custom integrations, final price will be finalized during personal discussion.
- Delivery Time: Fast delivery in 3 to 7 days. Urgent express delivery is also available.
- Contact Details:
  * Founder: Arvind Singh
  * WhatsApp: +91 8894810531
  * Email: arvind889481@gmail.com

Human Escalation & Unknown Questions:
- If a user asks something very specific, asks for negotiation, custom integration, or something you don't have exact details for, warmly and politely guide them:
  "Is cheez ke baare me aap hamara Contact Form bhar dein ya seedhe Arvind ji ko WhatsApp (+91 8894810531) par message kar lijiye, hum aapse direct call ya chat par baat karke deal aur requirements finalize kar lenge!"
`;

const DEFAULT_SUGGESTIONS = [
  "💰 Website ka estimate price kitna hoga?",
  "⚡ Delivery kitne dino me ho jayegi?",
  "💬 Arvind ji se direct WhatsApp par baat karni hai",
  "📝 Contact form kaise submit karein?"
];

// Fallback smart responder if Gemini API key is not yet set by user
const smartFallbackReply = (text) => {
  const q = text.toLowerCase();

  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('kitna') || q.includes('paise') || q.includes('pese') || q.includes('charges') || q.includes('kharcha')) {
    return `Haanji! MakeASite par hum best quality websites bahut hi genuine aur pocket-friendly rates me deliver karte hain. 🚀\n\n• **Static Website:** ~₹3,000 se ₹5,000 tak (7-8 pages included)\n• **Dynamic Website:** ~₹5,000 se ₹10,000 tak (Database & Login system included)\n• **Custom Web App / Dashboard:** ₹15,000+\n\n*Yeh ek base estimate hai.* Agar aapko extra pages ya specific custom features chahiye toh hum direct baat karke final budget fix kar lenge! Aap chahein toh niche diye button se Arvind ji ko WhatsApp (+91 8894810531) par ping kar sakte hain.`;
  }

  if (q.includes('deliver') || q.includes('time') || q.includes('din') || q.includes('kab tak') || q.includes('fast') || q.includes('urg')) {
    return `Hum standard projects **3 se 7 dino** ke andar complete karke live kar dete hain! ⚡\nAgar aapko emergency ya jaldi chahiye, toh express fast-track delivery option bhi available hai. Hamare saath 1000+ projects ab tak successfully deliver ho chuke hain!`;
  }

  if (q.includes('whatsapp') || q.includes('phone') || q.includes('number') || q.includes('call') || q.includes('contact') || q.includes('arvind') || q.includes('baat')) {
    return `Aap direct Arvind ji se connect kar sakte hain, hum turant reply karte hain:\n\n📱 **WhatsApp:** +91 8894810531\n✉️ **Email:** arvind889481@gmail.com\n\nNiche WhatsApp button par click karke aap direct chat shuru kar sakte hain!`;
  }

  if (q.includes('form') || q.includes('inquiry') || q.includes('quote') || q.includes('message')) {
    return `Aap hamari website ke **Contact Page** par jakar form fill kar sakte hain. Form fill karte hi aapka message Arvind ji ke WhatsApp aur Email dono par turant pahunch jayega aur hum aapse jaldi hi rabta karenge!`;
  }

  return `Haanji bilkul! MakeASite par humne 1000+ websites deliver ki hain. Aapki requirement ke according hum modern, ultra-fast aur mobile responsive website create kar denge.\n\nAgar aapko custom feature chahiye ya specific requirements discuss karni hain, toh aap **Contact Form** fill kar dein ya Arvind ji ko direct **WhatsApp (+91 8894810531)** par message karein, hum milkar sab kuch finalize kar lenge! 🙏`;
};

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Namaste! 🙏 Welcome to MakeASite. Main MakeASite AI Assistant hoon. Main aapki website ideas, pricing estimates, delivery timeline aur custom requirements me help kar sakta hoon. Aap mujhse kuch bhi pooch sakte hain!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('makeasite_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const activeKey = apiKey.trim();

    if (activeKey) {
      try {
        const historyPayload = messages.slice(-6).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: SYSTEM_PROMPT }]
                },
                ...historyPayload,
                {
                  role: 'user',
                  parts: [{ text: query }]
                }
              ]
            })
          }
        );

        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText) {
          setMessages((prev) => [...prev, { role: 'assistant', text: candidateText }]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart responder:', err);
      }
    }

    // Smart Fallback responder
    setTimeout(() => {
      const reply = smartFallbackReply(query);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setLoading(false);
    }, 600);
  };

  const handleSaveKey = () => {
    if (keyInput.trim()) {
      setApiKey(keyInput.trim());
      localStorage.setItem('makeasite_gemini_key', keyInput.trim());
    }
    setShowKeyModal(false);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: 'Namaste! 🙏 Welcome to MakeASite. Main MakeASite AI Assistant hoon. Main aapki website ideas, pricing estimates aur requirements me help kar sakta hoon. Poochiye aapka sawaal!'
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 hidden sm:flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md"
            style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
          >
            <Sparkles size={13} className="animate-spin" style={{ animationDuration: '3s' }} />
            Need help? Chat with AI
          </motion.div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white"
          style={{ background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)' }}
          aria-label="Toggle MakeASite AI Assistant"
        >
          {isOpen ? (
            <X size={26} />
          ) : (
            <>
              <Bot size={28} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[560px] max-h-[82vh] rounded-[28px] border shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-strong)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{
                borderColor: 'var(--border)',
                background: 'linear-gradient(135deg, rgba(220,38,38,0.08), rgba(249,115,22,0.05))'
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)' }}
                >
                  <Bot size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm sm:text-base leading-none">MakeASite AI</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                      Assistant
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Always Online & Ready</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Configure Gemini API Key"
                  onClick={() => {
                    setKeyInput(apiKey);
                    setShowKeyModal(true);
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Key size={16} />
                </button>
                <button
                  type="button"
                  title="Reset conversation"
                  onClick={handleClearChat}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  title="Minimize"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div
              className="px-4 py-2 border-b overflow-x-auto flex items-center gap-2 text-xs no-scrollbar"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card-inner)' }}
            >
              <a
                href="https://wa.me/918894810531"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-white whitespace-nowrap shadow-sm hover:opacity-90"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
              <a
                href="/contact"
                className="flex items-center gap-1 px-3 py-1 rounded-full font-semibold border whitespace-nowrap hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border)' }}
              >
                Contact Form <ExternalLink size={11} />
              </a>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ background: 'var(--bg-card)' }}>
              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAssistant && (
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5 text-xs font-bold shadow"
                        style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)' }}
                      >
                        AI
                      </div>
                    )}
                    <div
                      className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                        isAssistant
                          ? 'border'
                          : 'text-white'
                      }`}
                      style={
                        isAssistant
                          ? { background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }
                          : { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5 text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)' }}
                  >
                    AI
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3 border flex items-center gap-1.5"
                    style={{ background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Suggestions Chips (shown when few messages) */}
              {messages.length <= 2 && !loading && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                    Suggested Questions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {DEFAULT_SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(s)}
                        className="text-xs font-medium text-left px-3 py-1.5 rounded-xl border hover:border-red-500/40 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        style={{ background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t flex items-center gap-2"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card-inner)' }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about website, pricing, features..."
                className="flex-1 rounded-2xl px-4 py-2.5 text-sm outline-none border focus:border-red-500 transition-colors"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-10 w-10 rounded-2xl flex items-center justify-center text-white disabled:opacity-40 transition-opacity shadow-md flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)' }}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-strong)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="text-red-500" size={20} />
                <h3 className="font-extrabold text-lg">Google Gemini API Key</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Aap apni Google Gemini API key yahan paste kar sakte hain. Key browser me save ho jayegi aur Assistant live Gemini 1.5 Flash se direct connect ho jayega!
            </p>
            <input
              type="password"
              placeholder="Paste AIzaSy... key here"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none mb-4"
              style={{ background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white shadow"
                style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)' }}
              >
                Save Key
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
