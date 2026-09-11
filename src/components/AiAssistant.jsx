import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, RotateCcw, Sparkles } from 'lucide-react';

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

// Fallback smart responder if Gemini API key is not yet set by user
const smartFallbackReply = (text) => {
  const q = text.toLowerCase();

  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('kitna') || q.includes('paise') || q.includes('pese') || q.includes('charges') || q.includes('kharcha')) {
    return `Haanji! MakeASite par hum best quality websites bahut hi genuine aur pocket-friendly rates me deliver karte hain. 🚀\n\n• Static Website: ~₹3,000 se ₹5,000 tak (7-8 pages included)\n• Dynamic Website: ~₹5,000 se ₹10,000 tak (Database & Login included)\n• Custom Web App / Dashboard: ₹15,000+\n\n*Yeh ek base estimate hai.* Agar aapko extra pages ya specific features chahiye toh hum direct baat karke final budget fix kar lenge! Arvind ji se direct WhatsApp (+91 8894810531) par bhi baat kar sakte hain.`;
  }

  if (q.includes('deliver') || q.includes('time') || q.includes('din') || q.includes('kab tak') || q.includes('fast') || q.includes('urg')) {
    return `Hum standard projects 3 se 7 dino ke andar complete karke live kar dete hain! ⚡\nAgar urgent chahiye, toh express fast-track delivery option bhi available hai. Hamare saath 1000+ projects ab tak successfully deliver ho chuke hain!`;
  }

  if (q.includes('whatsapp') || q.includes('phone') || q.includes('number') || q.includes('call') || q.includes('contact') || q.includes('arvind') || q.includes('baat')) {
    return `Aap direct Arvind ji se WhatsApp par connect kar sakte hain:\n\n📱 WhatsApp: +91 8894810531\n✉️ Email: arvind889481@gmail.com\n\nAap WhatsApp par message karke direct chat start kar sakte hain!`;
  }

  if (q.includes('form') || q.includes('inquiry') || q.includes('quote') || q.includes('message')) {
    return `Aap hamari website ke Contact Page par jakar form fill kar sakte hain. Form fill karte hi aapka message Arvind ji ke WhatsApp aur Email dono par turant pahunch jayega!`;
  }

  return `Haanji bilkul! MakeASite par humne 1000+ websites deliver ki hain. Aapki requirement ke according hum modern, ultra-fast aur mobile responsive website create kar denge.\n\nAgar aapko custom feature chahiye ya specific requirements discuss karni hain, toh aap Contact Form fill kar dein ya Arvind ji ko direct WhatsApp (+91 8894810531) par message karein! 🙏`;
};

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const apiKey = localStorage.getItem('makeasite_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
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

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: 'Hello! How can I help you today?'
      }
    ]);
  };

  return (
    <>
      {/* Floating AI assistant */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pointer-events-auto">
        {!isOpen && (
          <div className="hidden rounded-2xl border border-red-100 bg-white px-3.5 py-2 text-right shadow-lg sm:block">
            <p className="text-xs font-extrabold text-red-600">Ask MakeASite AI</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Let&apos;s build something great</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_12px_28px_rgba(220,38,38,0.38)] transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Toggle MakeASite AI Assistant"
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <>
              <Sparkles size={25} strokeWidth={2.4} />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-red-700 bg-white"></span>
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
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] h-[520px] max-h-[80vh] rounded-[28px] border shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-strong)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
            }}
          >
            {/* Clean Header */}
            <div
              className="px-5 py-3.5 border-b flex items-center justify-between"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg-card-inner)'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-600 text-white shadow-sm">
                  <Sparkles size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">MakeASite AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Reset conversation"
                  onClick={handleClearChat}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  title="Close"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 space-y-3.5 overflow-y-auto" style={{ background: 'var(--bg-card)' }}>
              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAssistant && (
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-600 text-white shadow">
                        <Sparkles size={14} strokeWidth={2.4} />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
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
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-600 text-white shadow">
                    <Sparkles size={14} strokeWidth={2.4} />
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

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Searchbar / Message Input (App Chat Style) */}
            <div className="p-3 border-t bg-[var(--bg-card)]" style={{ borderColor: 'var(--border)' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 rounded-2xl border px-3.5 py-2 bg-[var(--bg-card-inner)] shadow-sm focus-within:border-red-500/60 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 flex-shrink-0 shadow"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
