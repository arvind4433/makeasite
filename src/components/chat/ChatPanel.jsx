import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { X, Send, RotateCcw, Loader2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import ChatMessage from './ChatMessage';
import useChat from './useChat';
import { MAX_MESSAGE } from './chatUtils';
import { CONTACT, whatsappLink } from '../../data/contact';

const starters = ['Build a website', 'Website pricing', 'E-commerce website', 'Redesign my website'];

export default function ChatPanel({ isOpen, onClose }) {
  const chat = useChat();
  const [input, setInput] = useState('');
  const scroll = useRef(null);
  const field = useRef(null);
  useEffect(() => {
    if (isOpen && scroll.current) scroll.current.scrollTo({ top: scroll.current.scrollHeight, behavior: 'smooth' });
  }, [chat.messages, chat.loading, chat.error, isOpen]);
  useEffect(() => {
    if (isOpen && window.matchMedia('(min-width: 640px)').matches) field.current?.focus();
  }, [isOpen]);
  const submit = (text = input) => {
    if (!text.trim() || text.length > MAX_MESSAGE || chat.loading || chat.error) return;
    setInput('');
    void chat.send(text);
  };

  return <AnimatePresence>{isOpen && <Motion.section id="makeasite-assistant" role="dialog" aria-label="MakeASite AI assistant"
    initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.94 }}
    transition={{ type: 'spring', damping: 25, stiffness: 280 }}
    onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}
    className="fixed right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] rounded-[28px] border shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
    style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))', height: 'min(560px, calc(100dvh - 7rem - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px)))', background: 'var(--bg-card)', borderColor: 'var(--border-strong)' }}>
    <div className="px-5 py-3.5 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-card-inner)' }}>
      <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-red-200 bg-white"><Logo size={34} showText={false} /></div>
        <div><h3 className="font-extrabold text-sm">MakeASite AI</h3><p className="text-[11px] text-slate-500 dark:text-slate-400">Website & project assistant</p></div>
      </div>
      <div className="flex items-center"><button type="button" onClick={() => { chat.reset(); setInput(''); field.current?.focus(); }} aria-label="Reset conversation" className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"><RotateCcw size={16} /></button>
        <button type="button" onClick={onClose} aria-label="Close chat" className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"><X size={18} /></button></div>
    </div>
    <div ref={scroll} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3.5">
      <div role="log" aria-live="polite" aria-relevant="additions" className="space-y-3.5">
        {chat.messages.map((message, index) => <ChatMessage key={index} message={message} />)}
      </div>
      {chat.messages.length === 1 && <div className="flex flex-wrap gap-2">{starters.map(text => <button key={text} type="button" onClick={() => submit(text)} className="rounded-xl border border-red-200 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/5">{text}</button>)}</div>}
      {chat.loading && <div role="status" className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={16} className="animate-spin" />Thinking…</div>}
      {chat.error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-500/5 p-3 text-sm"><p>{chat.error}</p><button type="button" onClick={chat.retry} disabled={chat.loading} className="mt-2 font-bold text-red-600 disabled:opacity-50">Retry reply</button><button type="button" onClick={chat.reset} className="ml-4 text-xs underline">Start again</button></div>}
      {chat.handoff && <div className="rounded-2xl border p-3 space-y-2" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-bold">Discuss your project with the team</p>
        {chat.summary && <><label htmlFor="chat-summary" className="block text-xs text-slate-500">Review or edit your project summary before sharing</label><textarea id="chat-summary" value={chat.summary} onChange={e => chat.setSummary(e.target.value)} maxLength={1000} rows={4} className="w-full rounded-lg border p-2 text-sm bg-transparent [overflow-wrap:anywhere]" /></>}
        <a href={whatsappLink(chat.summary)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-red-600"><MessageCircle size={16} />Continue on WhatsApp</a>
      </div>}
    </div>
    <div className="shrink-0 border-t p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      <form onSubmit={e => { e.preventDefault(); submit(); }} className="flex items-end gap-2 rounded-2xl border px-3 py-2" style={{ borderColor: 'var(--border)', background: 'var(--bg-card-inner)' }}>
        <textarea ref={field} value={input} onChange={e => setInput(e.target.value)} rows={2} maxLength={MAX_MESSAGE} aria-label="Your message" placeholder="Type your message…" disabled={chat.loading || Boolean(chat.error)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }}
          className="min-w-0 flex-1 resize-none bg-transparent text-base sm:text-sm outline-none disabled:opacity-50" />
        <button type="submit" disabled={!input.trim() || chat.loading || Boolean(chat.error)} aria-label="Send message" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white disabled:opacity-40"><Send size={16} /></button>
      </form>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500"><span>{input.length}/{MAX_MESSAGE}</span><div className="flex gap-3"><Link to={CONTACT.path} onClick={onClose} className="underline">Contact team</Link><a href={whatsappLink(chat.summary)} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a></div></div>
      <p className="mt-1.5 text-[10px] leading-tight text-slate-500">AI replies can be mistaken. Recent chat is sent to Google to answer; it clears on reload. Please avoid sharing passwords or payment details.</p>
    </div>
  </Motion.section>}</AnimatePresence>;
}
