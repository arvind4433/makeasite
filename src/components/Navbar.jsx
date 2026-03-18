import { useState, useContext, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown, LogOut, ShoppingCart, MessageSquare, User, CreditCard, Package, Settings, Send, Loader2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { OrderContext } from "../context/OrderContext";
import { API_BASE_URL, apiClient } from "../config/api";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import LogoutModal from "./LogoutModal";
import { toast } from "sonner";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" }
];

const supportThread = { id: 'general', label: 'Live Support', orderId: null, unreadCount: 0, lastMessage: 'Need help? Start a conversation.' };

const Avatar = ({ user }) => {
  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";
  const avatarSrc = user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}${user.avatar}`) : null;

  return user?.avatar ? (
    <img src={avatarSrc} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
  ) : (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-red-600">{initials}</div>
  );
};

const ProfileDropdown = ({ user, close, onRequestLogout }) => {
  const items = [
    { to: "/dashboard?tab=profile", label: "Profile", icon: User },
    { to: "/dashboard?tab=payments", label: "Payments", icon: CreditCard },
    { to: "/dashboard?tab=orders", label: "Orders", icon: Package },
    { to: "/dashboard?tab=settings", label: "Settings", icon: Settings }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 mt-2 w-64 rounded-2xl shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}>
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{user?.name}</div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{user?.email}</div>
      </div>
      <div className="p-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} to={item.to} onClick={close} className="flex items-center gap-2 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5">
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="border-t p-2" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => { close(); onRequestLogout(); }} className="flex items-center gap-2 p-3 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </motion.div>
  );
};

const MessagesDropdown = ({ user, onClose }) => {
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState('general');
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const selectedThread = useMemo(() => selectedThreadId === 'general' ? supportThread : threads.find((thread) => thread.id === selectedThreadId) || supportThread, [selectedThreadId, threads]);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const { data } = await apiClient.get('/messages/threads');
        setThreads(data);
      } catch {
        // ignore dropdown fetch failure
      }
    };
    loadThreads();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const id = selectedThread.orderId || 'general';
        const { data } = await apiClient.get(`/messages/${id}`);
        setMessages(data);
        await apiClient.patch(`/messages/${id}/read`);
      } catch {
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [selectedThread]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    try {
      await apiClient.post('/messages', { orderId: selectedThread.orderId || undefined, message: draft });
      setDraft('');
      const id = selectedThread.orderId || 'general';
      const { data } = await apiClient.get(`/messages/${id}`);
      setMessages(data);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 mt-2 w-[min(92vw,26rem)] overflow-hidden rounded-3xl shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}>
      <div className="border-b px-4 py-4" style={{ borderColor: 'var(--border)' }}>
        <div className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>Messages</div>
        <div className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Chat opens here from the top of the screen.</div>
      </div>
      <div className="grid max-h-[32rem] grid-cols-[10rem_minmax(0,1fr)]">
        <div className="border-r p-3" style={{ borderColor: 'var(--border)' }}>
          {[supportThread, ...threads].slice(0, 6).map((thread) => (
            <button key={thread.id} type="button" onClick={() => setSelectedThreadId(thread.id)} className="mb-2 w-full rounded-2xl p-3 text-left" style={selectedThreadId === thread.id ? { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' } : { background: 'var(--bg-card-inner)', border: '1px solid var(--border)' }}>
              <div className="text-sm font-bold truncate">{thread.label}</div>
              <div className="mt-1 text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{thread.lastMessage || 'Open chat'}</div>
            </button>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
            <div className="font-bold">{selectedThread.label}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{selectedThread.orderId ? 'Order conversation' : 'General support chat'}</div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ background: 'linear-gradient(180deg, var(--bg-card), var(--bg-card-inner))' }}>
            {loading ? <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div> : messages.length === 0 ? <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>No messages yet.</div> : messages.map((message) => {
              const mine = String(message.sender?._id || message.sender) === String(user.id || user._id);
              return <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className="max-w-[80%] rounded-2xl px-3 py-2 text-sm" style={mine ? { background: 'linear-gradient(135deg,#dc2626,#f97316)', color: '#fff' } : { background: 'var(--bg-card)', border: '1px solid var(--border)' }}>{message.message}</div></div>;
            })}
          </div>
          <form onSubmit={handleSend} className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type your message..." className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              <button type="submit" disabled={!draft.trim() || sending} className="flex h-11 w-11 items-center justify-center rounded-2xl text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#dc2626,#f97316)' }}>{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

const CartButton = ({ count, openCart }) => (
  <button onClick={openCart} className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl">
    <ShoppingCart size={18} />
    {count > 0 ? <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center">{count > 9 ? "9+" : count}</span> : null}
  </button>
);

const Navbar = ({ onOpenLogin }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { cartBadge, openCart } = useContext(OrderContext);
  const location = useLocation();
  const [mobile, setMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const profileRef = useRef();
  const messageRef = useRef();

  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (messageRef.current && !messageRef.current.contains(e.target)) setMessageOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!user) {
      setUnreadMessages(0);
      return undefined;
    }

    const loadUnread = async () => {
      try {
        const { data } = await apiClient.get('/messages/threads');
        setUnreadMessages(data.reduce((sum, thread) => sum + (thread.unreadCount || 0), 0));
      } catch {
        // ignore navbar fetch failures
      }
    };

    loadUnread();
  }, [user, location.pathname, messageOpen]);

  const active = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/"><Logo /></Link>

          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`text-sm ${active(link.path) ? 'text-red-600' : 'hover:text-black dark:hover:text-white'}`} style={!active(link.path) ? { color: 'var(--text-secondary)' } : {}}>{link.name}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
            {user ? <CartButton count={cartBadge} openCart={openCart} /> : null}
            {user ? (
              <div ref={messageRef} className="relative">
                <button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMessageOpen((value) => !value); setProfileOpen(false); }} className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl" aria-label="Messages">
                  <MessageSquare size={18} />
                  {unreadMessages ? <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center">{unreadMessages > 9 ? '9+' : unreadMessages}</span> : null}
                </button>
                <AnimatePresence>{messageOpen ? <MessagesDropdown user={user} onClose={() => setMessageOpen(false)} /> : null}</AnimatePresence>
              </div>
            ) : null}

            {user ? (
              <div ref={profileRef} className="relative">
                <button onClick={() => { setProfileOpen((value) => !value); setMessageOpen(false); }} className="flex items-center gap-2">
                  <Avatar user={user} />
                  <ChevronDown size={14} />
                </button>
                <AnimatePresence>{profileOpen ? <ProfileDropdown user={user} close={() => setProfileOpen(false)} onRequestLogout={() => setShowLogout(true)} /> : null}</AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex gap-4 items-center">
                <button onClick={() => onOpenLogin("login")}>Login</button>
                <button onClick={() => onOpenLogin("register")} className="primary-btn px-3 py-2 rounded-xl font-bold text-base flex items-center justify-center gap-2 group">Order Now</button>
              </div>
            )}

            <button className="md:hidden" onClick={() => setMobile(!mobile)}>{mobile ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>

        <AnimatePresence>
          {mobile ? (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="md:hidden px-6 pb-4 space-y-3" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
              {navLinks.map((link) => <Link key={link.name} to={link.path} onClick={() => setMobile(false)} className="block py-2" style={{ color: 'var(--text-secondary)' }}>{link.name}</Link>)}
              {!user ? (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setMobile(false); onOpenLogin('login'); }} className="flex-1 py-2 rounded-xl" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)' }}>Login</button>
                  <button onClick={() => { setMobile(false); onOpenLogin('register'); }} className="flex-1 py-2 rounded-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)' }}>Order Now</button>
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>

      <LogoutModal isOpen={showLogout} onClose={() => setShowLogout(false)} onConfirm={() => { logout(); setShowLogout(false); }} />
    </>
  );
};

export default Navbar;
