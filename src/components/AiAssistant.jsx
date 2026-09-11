import { lazy, Suspense, useRef, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import Logo from './Logo';

const ChatPanel = lazy(() => import('./chat/ChatPanel'));

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const launcher = useRef(null);
  const close = () => { setIsOpen(false); launcher.current?.focus(); };

  return (
    <>
      <div className="fixed right-4 sm:right-6 z-50 flex items-center gap-3 pointer-events-auto" style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
        {!isOpen && <div className="hidden rounded-2xl border border-red-100 bg-white px-3.5 py-2 text-right shadow-lg sm:block">
          <p className="text-xs font-extrabold text-red-600">Ask MakeASite AI</p>
          <p className="mt-0.5 text-[10px] text-slate-500">Let&apos;s build something great</p>
        </div>}
        <button ref={launcher} type="button" onClick={() => { setHasOpened(true); setIsOpen(value => !value); }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-100 bg-white text-red-600 shadow-[0_12px_28px_rgba(220,38,38,0.38)] transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label={isOpen ? 'Close MakeASite AI Assistant' : 'Open MakeASite AI Assistant'} aria-expanded={isOpen} aria-controls={hasOpened ? 'makeasite-assistant' : undefined}>
          {isOpen ? <X size={24} /> : <><Logo size={52} showText={false} /><span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-red-700 bg-white" /></>}
        </button>
      </div>
      {hasOpened && <Suspense fallback={isOpen ? <div role="status" className="fixed bottom-24 right-6 z-50 rounded-2xl bg-white p-5 text-red-600 shadow-lg"><Loader2 className="animate-spin" aria-label="Opening chat" /></div> : null}>
        <ChatPanel isOpen={isOpen} onClose={close} />
      </Suspense>}
    </>
  );
}
