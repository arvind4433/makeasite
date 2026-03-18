import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Bell, Camera, CheckCircle2, CreditCard, FileText, Loader2, Mail, MessageSquare, Moon, Package, Phone, Save, Send, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { API_BASE_URL, apiClient } from '../config/api';
import { useUpdateProfileMutation, useUploadAvatarMutation } from '../services/authApi';

const SECTIONS = {
  profile: { title: 'Profile', description: 'Manage your personal details and profile photo.' },
  payments: { title: 'Payments', description: 'Track successful and pending payments in one place.' },
  orders: { title: 'Orders', description: 'Monitor newly created, pending, and completed orders.' },
  messages: { title: 'Messages', description: 'Messages stay in the top navbar and also open here when needed.' },
  settings: { title: 'Settings', description: 'Control notification and appearance preferences.' }
};

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-strong)',
  boxShadow: 'var(--shadow-card)'
};

const innerCardStyle = {
  background: 'var(--bg-card-inner)',
  border: '1px solid var(--border)'
};

const getTabFromSearch = (search) => {
  const params = new URLSearchParams(search);
  const tab = params.get('tab');
  return SECTIONS[tab] ? tab : 'orders';
};

const formatOrderStatus = (status) => ({
  pending: 'Pending',
  in_progress: 'In Progress',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled'
}[status] || 'Newly Created');

const formatPaymentStatus = (status) => ({
  pending: 'Pending',
  paid: 'Successful',
  failed: 'Failed',
  refunded: 'Refunded'
}[status] || status);

const getTone = (status, type = 'order') => {
  const tones = {
    order: {
      pending: ['rgba(245,158,11,0.12)', '#d97706', 'rgba(245,158,11,0.28)'],
      in_progress: ['rgba(59,130,246,0.12)', '#2563eb', 'rgba(59,130,246,0.28)'],
      delivered: ['rgba(139,92,246,0.12)', '#7c3aed', 'rgba(139,92,246,0.28)'],
      completed: ['rgba(16,185,129,0.12)', '#059669', 'rgba(16,185,129,0.28)'],
      cancelled: ['rgba(239,68,68,0.12)', '#dc2626', 'rgba(239,68,68,0.28)']
    },
    payment: {
      pending: ['rgba(245,158,11,0.12)', '#d97706', 'rgba(245,158,11,0.28)'],
      paid: ['rgba(16,185,129,0.12)', '#059669', 'rgba(16,185,129,0.28)'],
      failed: ['rgba(239,68,68,0.12)', '#dc2626', 'rgba(239,68,68,0.28)'],
      refunded: ['rgba(99,102,241,0.12)', '#4f46e5', 'rgba(99,102,241,0.28)']
    }
  };

  const [bg, color, border] = tones[type][status] || ['var(--bg-card-inner)', 'var(--text-secondary)', 'var(--border)'];
  return { bg, color, border };
};

const Dashboard = () => {
  const { user, hydrateUser, sendProfileOTP, verifyProfileOTP } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(getTabFromSearch(location.search));
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState('general');
  const [messageDraft, setMessageDraft] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [messageSending, setMessageSending] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', notificationsEnabled: user?.preferences?.notificationsEnabled ?? true });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [profileOtp, setProfileOtp] = useState({ email: '', phone: '' });
  const [sendingOtpChannel, setSendingOtpChannel] = useState('');
  const [verifyingOtpChannel, setVerifyingOtpChannel] = useState('');
  const [updateProfile] = useUpdateProfileMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const supportThread = useMemo(() => ({ id: 'general', label: 'Live Support', kind: 'support', lastMessage: 'Need help? Start a conversation with the team.', unreadCount: 0, orderId: null }), []);
  const selectedThread = useMemo(() => selectedThreadId === 'general' ? supportThread : threads.find((thread) => thread.id === selectedThreadId) || supportThread, [selectedThreadId, supportThread, threads]);
  const unreadMessageCount = useMemo(() => threads.reduce((sum, thread) => sum + (thread.unreadCount || 0), 0), [threads]);
  const orderStats = useMemo(() => ({ total: orders.length, completed: orders.filter((o) => o.status === 'completed').length, pending: orders.filter((o) => ['pending', 'in_progress', 'delivered'].includes(o.status)).length, newlyCreated: orders.filter((o) => o.status === 'pending').length }), [orders]);
  const paymentStats = useMemo(() => ({ successful: payments.filter((p) => p.status === 'paid').length, pending: payments.filter((p) => p.status === 'pending').length, total: payments.length }), [payments]);

  const fetchOrders = useCallback(async () => { const { data } = await apiClient.get('/orders/myorders'); setOrders(data); return data; }, []);
  const fetchPayments = useCallback(async () => { const { data } = await apiClient.get('/payments/my'); setPayments(data); return data; }, []);
  const fetchThreads = useCallback(async () => { const { data } = await apiClient.get('/messages/threads'); setThreads(data); return data; }, []);
  const fetchMessages = useCallback(async (thread) => {
    const id = thread?.orderId || 'general';
    const { data } = await apiClient.get(`/messages/${id}`);
    setMessages(data);
    await apiClient.patch(`/messages/${id}/read`);
    return data;
  }, []);

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    if (user.role === 'admin') { navigate('/admin-dashboard'); return; }
    setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', notificationsEnabled: user.preferences?.notificationsEnabled ?? true });
    setAvatarPreview(user.avatar || '');
  }, [navigate, user]);

  useEffect(() => { setActiveTab(getTabFromSearch(location.search)); }, [location.search]);

  useEffect(() => {
    if (!user || user.role === 'admin') return undefined;
    const load = async () => {
      try {
        setPageLoading(true);
        const [, , fetchedThreads] = await Promise.all([fetchOrders(), fetchPayments(), fetchThreads()]);
        const orderId = new URLSearchParams(location.search).get('orderId');
        if (orderId) {
          setSelectedThreadId(`order:${orderId}`);
        } else if (fetchedThreads.length > 0) {
          setSelectedThreadId((current) => fetchedThreads.some((thread) => thread.id === current) ? current : fetchedThreads[0].id);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [fetchOrders, fetchPayments, fetchThreads, location.search, user]);

  useEffect(() => {
    if (!user || user.role === 'admin' || activeTab !== 'messages') return undefined;
    let cancelled = false;
    const loadThreadMessages = async () => {
      try {
        setSectionLoading(true);
        const currentThread = selectedThreadId === 'general' ? supportThread : threads.find((thread) => thread.id === selectedThreadId) || supportThread;
        await fetchMessages(currentThread);
        if (!cancelled) await fetchThreads();
      } catch (error) {
        if (!cancelled) toast.error(error.response?.data?.message || 'Failed to load messages');
      } finally {
        if (!cancelled) setSectionLoading(false);
      }
    };
    loadThreadMessages();
    return () => { cancelled = true; };
  }, [activeTab, fetchMessages, fetchThreads, selectedThreadId, supportThread, threads, user]);

  useEffect(() => {
    if (!user || user.role === 'admin' || activeTab !== 'messages') return undefined;
    const interval = window.setInterval(async () => {
      try {
        const updatedThreads = await fetchThreads();
        const currentThread = selectedThreadId === 'general' ? supportThread : updatedThreads.find((thread) => thread.id === selectedThreadId) || supportThread;
        await fetchMessages(currentThread);
      } catch {
        // silent refresh
      }
    }, 30000);
    return () => window.clearInterval(interval);
  }, [activeTab, fetchMessages, fetchThreads, selectedThreadId, supportThread, user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!messageDraft.trim()) return;
    setMessageSending(true);
    try {
      await apiClient.post('/messages', { orderId: selectedThread.orderId || undefined, message: messageDraft });
      setMessageDraft('');
      await fetchThreads();
      await fetchMessages(selectedThread);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setMessageSending(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      event.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const response = await uploadAvatar(formData).unwrap();
      const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const avatarWithVersion = `${response.avatar}?v=${Date.now()}`;
      hydrateUser({ ...stored, avatar: avatarWithVersion });
      setAvatarPreview(avatarWithVersion);
      toast.success('Profile photo updated');
    } catch (error) {
      setAvatarPreview(user?.avatar || '');
      toast.error(error?.data?.message || 'Avatar upload failed');
    } finally {
      URL.revokeObjectURL(previewUrl);
      event.target.value = '';
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        notificationsEnabled: profileForm.notificationsEnabled
      }).unwrap();
      hydrateUser(response);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSendProfileOtp = async (channel) => {
    setSendingOtpChannel(channel);
    try {
      await sendProfileOTP(channel);
    } finally {
      setSendingOtpChannel('');
    }
  };

  const handleVerifyProfileOtp = async (channel) => {
    if (profileOtp[channel].length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyingOtpChannel(channel);
    try {
      const response = await verifyProfileOTP(channel, profileOtp[channel]);
      setProfileOtp((current) => ({ ...current, [channel]: '' }));
      setProfileForm((current) => ({
        ...current,
        email: response.user?.email || current.email,
        phone: response.user?.phone || current.phone
      }));
    } finally {
      setVerifyingOtpChannel('');
    }
  };

  const avatarSrc = avatarPreview ? ((avatarPreview.startsWith('blob:') || avatarPreview.startsWith('http')) ? avatarPreview : `${API_BASE_URL}${avatarPreview}`) : null;

  if (!user || user.role === 'admin') return null;

  const sectionMeta = SECTIONS[activeTab] || SECTIONS.orders;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-[30px] p-6 sm:p-8" style={cardStyle}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.28em] mb-3" style={{ color: 'var(--text-muted)' }}>Dashboard</div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{sectionMeta.title}</h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>{sectionMeta.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-2xl px-4 py-3" style={innerCardStyle}><div className="text-xs uppercase font-bold tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Orders</div><div className="text-2xl font-black mt-1">{orderStats.total}</div></div>
              <div className="rounded-2xl px-4 py-3" style={innerCardStyle}><div className="text-xs uppercase font-bold tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Messages</div><div className="text-2xl font-black mt-1">{unreadMessageCount}</div></div>
            </div>
          </div>
        </div>

        {pageLoading ? <div className="rounded-[28px] p-16 flex justify-center" style={cardStyle}><Loader2 className="animate-spin" size={32} style={{ color: 'var(--text-secondary)' }} /></div> : null}

        {!pageLoading && activeTab === 'orders' ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[{ label: 'Completed orders', value: orderStats.completed, icon: CheckCircle2 }, { label: 'Pending orders', value: orderStats.pending, icon: Package }, { label: 'Newly created orders', value: orderStats.newlyCreated, icon: FileText }].map((item) => {
                const Icon = item.icon;
                return <div key={item.label} className="rounded-[24px] p-5" style={cardStyle}><div className="flex items-center justify-between"><div><div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{item.label}</div><div className="text-3xl font-black mt-3">{item.value}</div></div><div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626' }}><Icon size={22} /></div></div></div>;
              })}
            </div>
            <div className="rounded-[28px] p-6" style={cardStyle}>
              <h2 className="text-xl font-black mb-5">Orders</h2>
              <div className="grid gap-4">
                {orders.length === 0 ? <div className="rounded-2xl p-6 text-sm" style={innerCardStyle}>No orders yet.</div> : orders.map((order) => {
                  const tone = getTone(order.status, 'order');
                  return (
                    <div key={order._id} className="rounded-[24px] p-5" style={innerCardStyle}>
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div><div className="text-xs uppercase font-bold tracking-[0.25em] mb-2" style={{ color: 'var(--text-muted)' }}>{order.packageType} plan</div><div className="text-xl font-black">{order.title}</div><p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{order.description}</p></div>
                        <span className="px-3 py-1.5 rounded-full text-sm font-bold w-fit" style={{ background: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}>{formatOrderStatus(order.status)}</span>
                      </div>
                      <div className="grid gap-3 mt-5 sm:grid-cols-3 text-sm"><div><div style={{ color: 'var(--text-muted)' }}>Price</div><div className="font-bold mt-1">INR {order.price?.toLocaleString?.() || order.price}</div></div><div><div style={{ color: 'var(--text-muted)' }}>Created</div><div className="font-bold mt-1">{new Date(order.createdAt).toLocaleDateString()}</div></div><div><div style={{ color: 'var(--text-muted)' }}>Deadline</div><div className="font-bold mt-1">{order.deadline ? new Date(order.deadline).toLocaleDateString() : 'Flexible'}</div></div></div>
                      <button type="button" onClick={() => navigate(`/orders/${order._id}`)} className="mt-5 rounded-2xl px-4 py-2 text-sm font-bold" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>View Details</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {!pageLoading && activeTab === 'payments' ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[{ label: 'Successful payments', value: paymentStats.successful }, { label: 'Pending payments', value: paymentStats.pending }, { label: 'Total payments', value: paymentStats.total }].map((item) => <div key={item.label} className="rounded-[24px] p-5" style={cardStyle}><div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{item.label}</div><div className="text-3xl font-black mt-3">{item.value}</div></div>)}
            </div>
            <div className="rounded-[28px] p-6" style={cardStyle}>
              <h2 className="text-xl font-black mb-5">Payment history</h2>
              <div className="grid gap-4">
                {payments.length === 0 ? <div className="rounded-2xl p-6 text-sm" style={innerCardStyle}>No payments found yet.</div> : payments.map((payment) => {
                  const tone = getTone(payment.status, 'payment');
                  return (
                    <div key={payment._id} className="rounded-[24px] p-5" style={innerCardStyle}>
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div><div className="text-lg font-black">{payment.order?.title || 'Project payment'}</div><div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{payment.order?.packageType ? `${payment.order.packageType} plan` : 'General payment'}</div></div>
                        <span className="px-3 py-1.5 rounded-full text-sm font-bold w-fit" style={{ background: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}>{formatPaymentStatus(payment.status)}</span>
                      </div>
                      <div className="grid gap-3 mt-5 sm:grid-cols-4 text-sm"><div><div style={{ color: 'var(--text-muted)' }}>Amount</div><div className="font-bold mt-1">{payment.currency} {payment.amount}</div></div><div><div style={{ color: 'var(--text-muted)' }}>Method</div><div className="font-bold mt-1 capitalize">{payment.method || 'Unknown'}</div></div><div><div style={{ color: 'var(--text-muted)' }}>Transaction</div><div className="font-bold mt-1 break-all">{payment.transactionId || 'Pending assignment'}</div></div><div><div style={{ color: 'var(--text-muted)' }}>Date</div><div className="font-bold mt-1">{new Date(payment.createdAt).toLocaleDateString()}</div></div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {!pageLoading && activeTab === 'messages' ? (
          <div className="rounded-[28px] overflow-hidden" style={cardStyle}>
            <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] min-h-[640px]">
              <div className="p-5 border-r" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-black">Messages</h2><span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{unreadMessageCount} unread</span></div>
                <div className="space-y-3">
                  {[supportThread, ...threads].map((thread) => {
                    const active = selectedThread.id === thread.id;
                    return (
                      <button key={thread.id} type="button" onClick={() => setSelectedThreadId(thread.id)} className="w-full text-left rounded-[22px] p-4 transition-all" style={active ? { background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))', border: '1px solid rgba(59,130,246,0.2)' } : innerCardStyle}>
                        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="font-bold truncate">{thread.label}</div><div className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>{thread.lastMessage}</div></div>{thread.unreadCount ? <span className="min-w-6 h-6 px-2 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626' }}>{thread.unreadCount}</span> : null}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col min-h-[640px]">
                <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}><div className="flex items-center justify-between gap-4"><div><div className="text-lg font-black">{selectedThread.label}</div><div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{selectedThread.kind === 'order' ? 'Order conversation' : 'General support conversation'}</div></div>{sectionLoading ? <Loader2 className="animate-spin" size={18} style={{ color: 'var(--text-secondary)' }} /> : null}</div></div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto" style={{ background: 'linear-gradient(180deg, var(--bg-card), var(--bg-card-inner))' }}>
                  {messages.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center px-6"><MessageSquare size={34} style={{ color: 'var(--text-muted)' }} /><p className="mt-4 text-lg font-bold">Start the conversation</p><p className="mt-2 text-sm max-w-md" style={{ color: 'var(--text-secondary)' }}>Ask about your project, delivery, revisions, or payments. Admin replies will appear here after login.</p></div> : messages.map((message) => {
                    const isMine = String(message.sender?._id || message.sender) === String(user.id || user._id);
                    return <div key={message._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}><div className="max-w-[80%] rounded-[22px] px-4 py-3" style={isMine ? { background: 'linear-gradient(135deg, #dc2626, #f97316)', color: '#fff' } : { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}><p className="text-sm leading-6">{message.message}</p><div className="mt-2 text-[11px] font-semibold opacity-70">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></div></div>;
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-5 border-t" style={{ borderColor: 'var(--border)' }}><div className="flex items-center gap-3"><input type="text" value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="Type your message here..." className="flex-1 rounded-2xl px-4 py-3 outline-none" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} /><button type="submit" disabled={!messageDraft.trim() || messageSending} className="h-12 w-12 rounded-2xl flex items-center justify-center disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)', color: '#fff' }}>{messageSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}</button></div></form>
              </div>
            </div>
          </div>
        ) : null}

        {!pageLoading && activeTab === 'profile' ? (
          <div className="rounded-[28px] p-6 sm:p-8 space-y-8" style={cardStyle}>
            <div><h2 className="text-2xl font-black">Profile</h2><p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Update your profile details, verification status, and picture.</p></div>
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="relative h-24 w-24 rounded-[28px] overflow-hidden flex items-center justify-center text-2xl font-black" style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)', color: '#fff' }}>
                {avatarSrc ? <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" /> : user.name?.charAt(0)?.toUpperCase()}
                <span className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><Camera size={22} /></span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <div><div className="font-bold text-lg">Profile Photo</div><div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Upload a clean square image for the best result.</div></div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2"><span className="text-sm font-semibold">Full name</span><input type="text" value={profileForm.name} onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))} className="w-full rounded-2xl px-4 py-3 outline-none" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} /></label>
              <label className="space-y-2"><span className="text-sm font-semibold">Phone</span><input type="text" value={profileForm.phone} onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))} className="w-full rounded-2xl px-4 py-3 outline-none" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} /></label>
              <label className="space-y-2 md:col-span-2"><span className="text-sm font-semibold">Email</span><input type="email" value={profileForm.email} onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))} className="w-full rounded-2xl px-4 py-3 outline-none" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} /></label>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {[
                { channel: 'email', label: 'Email verification', value: profileForm.email, verified: user.emailVerified, icon: Mail },
                { channel: 'phone', label: 'Phone verification', value: profileForm.phone, verified: user.phoneVerified, icon: Phone }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.channel} className="rounded-[24px] p-5" style={innerCardStyle}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-black"><Icon size={18} /> {item.label}</div>
                        <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {item.verified ? `Your ${item.channel} is verified.` : `Add your ${item.channel} and save profile first.`}
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.verified ? 'Verified ✔' : 'Not Verified'}
                      </span>
                    </div>
                    {!item.verified ? (
                      <div className="mt-5 space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <button type="button" onClick={() => handleSendProfileOtp(item.channel)} disabled={savingProfile || sendingOtpChannel === item.channel || !item.value} className="rounded-2xl px-4 py-3 text-sm font-bold text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)' }}>
                            {sendingOtpChannel === item.channel ? 'Sending OTP...' : `Verify ${item.channel}`}
                          </button>
                          <input type="text" inputMode="numeric" maxLength={6} value={profileOtp[item.channel]} onChange={(event) => setProfileOtp((current) => ({ ...current, [item.channel]: event.target.value.replace(/\D/g, '').slice(0, 6) }))} placeholder="Enter OTP" className="flex-1 rounded-2xl px-4 py-3 outline-none" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                        <button type="button" onClick={() => handleVerifyProfileOtp(item.channel)} disabled={verifyingOtpChannel === item.channel || profileOtp[item.channel].length !== 6} className="rounded-2xl px-4 py-3 text-sm font-bold disabled:opacity-60" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                          {verifyingOtpChannel === item.channel ? 'Verifying...' : 'Submit OTP'}
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <button type="button" onClick={handleSaveProfile} disabled={savingProfile} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-bold disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)', color: '#fff' }}>{savingProfile ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}Save Profile</button>
          </div>
        ) : null}

        {!pageLoading && activeTab === 'settings' ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[28px] p-6" style={cardStyle}>
              <div className="flex items-center justify-between gap-4"><div><div className="text-lg font-black">Notifications</div><p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Receive message-related updates and inbox activity.</p></div><button type="button" onClick={() => setProfileForm((prev) => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }))} className="w-16 h-9 rounded-full relative transition-colors" style={{ background: profileForm.notificationsEnabled ? 'linear-gradient(135deg, #16a34a, #22c55e)' : 'var(--bg-card-inner)' }}><span className="absolute top-1 left-1 h-7 w-7 rounded-full bg-white transition-transform" style={{ transform: profileForm.notificationsEnabled ? 'translateX(28px)' : 'translateX(0)' }} /></button></div>
              <button type="button" onClick={handleSaveProfile} disabled={savingProfile} className="mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-bold disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)', color: '#fff' }}>{savingProfile ? <Loader2 className="animate-spin" size={18} /> : <Bell size={18} />}Save Notification Preference</button>
            </div>
            <div className="rounded-[28px] p-6" style={cardStyle}>
              <div className="flex items-center justify-between gap-4"><div><div className="text-lg font-black">Appearance</div><p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>The dashboard follows your chosen theme automatically.</p></div><button type="button" onClick={toggleTheme} className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)' }}>{theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}</button></div>
              <div className="mt-6 rounded-[24px] p-5" style={innerCardStyle}><div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Current theme</div><div className="text-2xl font-black mt-2">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
