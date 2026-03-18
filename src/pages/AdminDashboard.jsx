import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Database, Loader2, MessageSquare, Package, Save, Send } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { apiClient } from '../config/api';
import Logo from '../components/Logo';

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-strong)',
  boxShadow: 'var(--shadow-card)'
};

const statusOptions = ['pending', 'in_progress', 'delivered', 'completed', 'cancelled'];
const labelStatus = (status) => ({ pending: 'Pending', in_progress: 'In Progress', delivered: 'Delivered', completed: 'Completed', cancelled: 'Cancelled' }[status] || status);

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState('general');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const endRef = useRef(null);

  const supportThread = useMemo(() => ({ id: 'general', label: 'General Support', orderId: null, lastMessage: 'General support inbox', unreadCount: 0 }), []);
  const selectedThread = useMemo(() => selectedThreadId === 'general' ? supportThread : threads.find((thread) => thread.id === selectedThreadId) || supportThread, [selectedThreadId, supportThread, threads]);
  const selectedOrder = useMemo(() => selectedThread.orderId ? orders.find((order) => String(order._id) === String(selectedThread.orderId)) : null, [orders, selectedThread]);

  const fetchOrders = useCallback(async () => {
    const { data } = await apiClient.get('/orders');
    setOrders(data);
    return data;
  }, []);

  const fetchThreads = useCallback(async () => {
    const { data } = await apiClient.get('/messages/threads');
    setThreads(data);
    return data;
  }, []);

  const fetchMessages = useCallback(async (thread) => {
    const id = thread?.orderId || 'general';
    const { data } = await apiClient.get(`/messages/${id}`);
    setMessages(data);
    return data;
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const [orderData, threadData] = await Promise.all([fetchOrders(), fetchThreads()]);
        if (threadData.length > 0) {
          setSelectedThreadId(threadData[0].id);
        } else if (orderData.length > 0) {
          setSelectedThreadId('general');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchOrders, fetchThreads, navigate, user]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return undefined;
    const loadCurrent = async () => {
      try {
        const currentThread = selectedThreadId === 'general' ? supportThread : threads.find((thread) => thread.id === selectedThreadId) || supportThread;
        await fetchMessages(currentThread);
        if (currentThread.orderId) {
          const order = orders.find((item) => String(item._id) === String(currentThread.orderId));
          if (order) setSelectedStatus(order.status);
        }
      } catch {
        // ignore
      }
    };
    loadCurrent();
  }, [fetchMessages, orders, selectedThreadId, supportThread, threads, user]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return undefined;
    const interval = window.setInterval(async () => {
      try {
        await fetchOrders();
        const updatedThreads = await fetchThreads();
        const currentThread = selectedThreadId === 'general' ? supportThread : updatedThreads.find((thread) => thread.id === selectedThreadId) || supportThread;
        await fetchMessages(currentThread);
      } catch {
        // ignore
      }
    }, 30000);
    return () => window.clearInterval(interval);
  }, [fetchMessages, fetchOrders, fetchThreads, selectedThreadId, supportThread, user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    try {
      await apiClient.post('/messages', {
        orderId: selectedThread.orderId || undefined,
        receiverId: selectedThread.otherParty?._id,
        message: draft
      });
      setDraft('');
      await fetchThreads();
      await fetchMessages(selectedThread);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleStatusSave = async () => {
    if (!selectedOrder) return;
    setSavingStatus(true);
    try {
      const { data } = await apiClient.put(`/orders/${selectedOrder._id}/status`, { status: selectedStatus });
      setOrders((prev) => prev.map((order) => order._id === data._id ? data : order));
      toast.success('Order status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between" style={cardStyle}>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--text-muted)' }}>Admin Panel</div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Orders, support, and live replies</h1>
            <p className="mt-3 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>Monitor client orders, respond in the inbox, and keep project status updated.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/"><Logo /></Link>
            <button onClick={() => { logout(); navigate('/'); }} className="rounded-2xl px-4 py-3 font-semibold" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)' }}>Logout</button>
          </div>
        </div>

        {loading ? <div className="rounded-[28px] p-16 flex justify-center" style={cardStyle}><Loader2 className="animate-spin" size={32} /></div> : (
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="rounded-[28px] p-5" style={cardStyle}>
              <div className="flex items-center gap-3 mb-5"><Database size={18} /><h2 className="text-xl font-black">Inbox</h2></div>
              <div className="space-y-3">
                {[supportThread, ...threads].map((thread) => (
                  <button key={thread.id} onClick={() => setSelectedThreadId(thread.id)} className="w-full text-left rounded-[22px] p-4" style={selectedThread.id === thread.id ? { background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))', border: '1px solid rgba(59,130,246,0.2)' } : { background: 'var(--bg-card-inner)', border: '1px solid var(--border)' }}>
                    <div className="font-bold truncate">{thread.label}</div>
                    <div className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>{thread.lastMessage}</div>
                  </button>
                ))}
              </div>
            </aside>

            <section className="rounded-[28px] overflow-hidden" style={cardStyle}>
              <div className="grid xl:grid-cols-[320px_minmax(0,1fr)] min-h-[680px]">
                <div className="p-6 border-r" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3 mb-5"><Package size={18} /><h2 className="text-xl font-black">Order Details</h2></div>
                  {selectedOrder ? (
                    <div className="space-y-5 text-sm">
                      <div><div style={{ color: 'var(--text-muted)' }}>Client</div><div className="font-bold mt-1">{selectedOrder.client?.name || 'Unknown client'}</div><div className="mt-1" style={{ color: 'var(--text-secondary)' }}>{selectedOrder.client?.email}</div></div>
                      <div><div style={{ color: 'var(--text-muted)' }}>Project</div><div className="font-bold mt-1">{selectedOrder.title}</div></div>
                      <div><div style={{ color: 'var(--text-muted)' }}>Plan</div><div className="font-bold mt-1 capitalize">{selectedOrder.packageType}</div></div>
                      <div><div style={{ color: 'var(--text-muted)' }}>Price</div><div className="font-bold mt-1">INR {selectedOrder.price?.toLocaleString?.() || selectedOrder.price}</div></div>
                      <div><div style={{ color: 'var(--text-muted)' }}>Description</div><div className="mt-1 leading-6" style={{ color: 'var(--text-secondary)' }}>{selectedOrder.description}</div></div>
                      <div className="space-y-2"><div style={{ color: 'var(--text-muted)' }}>Status</div><select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full rounded-2xl px-4 py-3" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>{statusOptions.map((status) => <option key={status} value={status}>{labelStatus(status)}</option>)}</select></div>
                      <button onClick={handleStatusSave} disabled={savingStatus} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-bold text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)' }}>{savingStatus ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}Save Status</button>
                    </div>
                  ) : <div style={{ color: 'var(--text-secondary)' }}>Select a conversation to see order details.</div>}
                </div>

                <div className="flex flex-col min-h-[680px]">
                  <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}><div className="flex items-center gap-3"><MessageSquare size={18} /><h2 className="text-xl font-black">Conversation</h2></div></div>
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto" style={{ background: 'linear-gradient(180deg, var(--bg-card), var(--bg-card-inner))' }}>
                    {messages.length === 0 ? <div className="h-full flex items-center justify-center text-center" style={{ color: 'var(--text-secondary)' }}>No messages yet.</div> : messages.map((message) => {
                      const isAdmin = String(message.sender?._id || message.sender) === String(user.id || user._id);
                      return <div key={message._id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}><div className="max-w-[80%] rounded-[22px] px-4 py-3" style={isAdmin ? { background: 'linear-gradient(135deg, #dc2626, #f97316)', color: '#fff' } : { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}><p className="text-sm leading-6">{message.message}</p><div className="mt-2 text-[11px] opacity-70">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></div></div>;
                    })}
                    <div ref={endRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="p-5 border-t" style={{ borderColor: 'var(--border)' }}><div className="flex items-center gap-3"><input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Reply to the client..." className="flex-1 rounded-2xl px-4 py-3 outline-none" style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} /><button type="submit" disabled={!draft.trim() || sending} className="h-12 w-12 rounded-2xl flex items-center justify-center disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #dc2626, #f97316)', color: '#fff' }}>{sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}</button></div></form>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
