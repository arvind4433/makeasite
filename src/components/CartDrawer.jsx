import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ShoppingCart, Trash2, Eye, CreditCard, MessageSquare,
    CheckCircle, Loader2, AlertCircle, AlertTriangle,
} from 'lucide-react';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import { useGetMyOrdersQuery, useDeleteOrderMutation } from '../services/orderApi.js';

/* ── Helpers ─────────────────────────────────────────── */
const PLAN_COLORS = {
    basic: '#64748b', standard: '#ef4444', premium: '#8b5cf6', custom: '#f59e0b',
};

const StatusBadge = ({ status }) => {
    const MAP = {
        Pending:      { bg: 'rgba(234,179,8,0.1)',   color: '#ca8a04', border: 'rgba(234,179,8,0.3)' },
        Viewed:       { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
        Accepted:     { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1', border: 'rgba(99,102,241,0.3)' },
        Rejected:     { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
        'In Progress':{ bg: 'rgba(168,85,247,0.1)',  color: '#a855f7', border: 'rgba(168,85,247,0.3)' },
        Completed:    { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', border: 'rgba(16,185,129,0.3)' },
    };
    const s = MAP[status] || MAP.Pending;
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {status}
        </span>
    );
};

/* ═══════════════════════════════════════════════════════
   CONFIRM DIALOG — replaces window.confirm()
   ═══════════════════════════════════════════════════════ */
const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'Delete', loading = false }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div key="cd-bg"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm"
                    onClick={onCancel} />
                <motion.div key="cd-box"
                    initial={{ opacity: 0, scale: 0.9, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 16 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="fixed inset-0 z-[501] flex items-center justify-center p-4 pointer-events-none">
                    <div className="pointer-events-auto w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}>
                        <div className="p-6 flex flex-col items-center text-center gap-4">
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                                <AlertTriangle className="w-7 h-7 text-red-500" />
                            </div>
                            {/* Text */}
                            <div>
                                <h3 className="text-base font-extrabold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                                    {title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    {message}
                                </p>
                            </div>
                            {/* Buttons */}
                            <div className="flex gap-3 w-full mt-1">
                                <button onClick={onCancel} disabled={loading}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                                    style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-secondary)' }}>
                                    Cancel
                                </button>
                                <button onClick={onConfirm} disabled={loading}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
                                    style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                                    {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…</> : confirmLabel}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

/* ═══════════════════════════════════════════════════════
   ORDER DETAIL MODAL
   ═══════════════════════════════════════════════════════ */
const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
    const fields = [
        ['Project', order.projectName],
        ['Plan', order.plan],
        ['Website Type', order.websiteType],
        ['Pages', order.pages],
        ['Business Category', order.businessCategory || order.businessType],
        ['Design Style', order.designStyle],
        ['Features', order.features?.join(', ') || 'None'],
        ['Deadline', order.preferredDeadline || 'Flexible'],
        ['Delivery', order.deliveryOption],
        ['Contact Email', order.contactEmail],
        ['Phone', order.phoneNumber],
        ['References', order.referenceWebsites],
        ['Description', order.description],
    ].filter(([, v]) => v);

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}>
                <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93 }}
                    className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}
                    onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
                        style={{ borderColor: 'var(--border)' }}>
                        <div>
                            <h3 className="font-extrabold text-lg" style={{ color: 'var(--text-primary)' }}>{order.projectName}</h3>
                            <StatusBadge status={order.status} />
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                        {fields.map(([k, v]) => (
                            <div key={k} className="flex gap-4 text-sm">
                                <span className="font-semibold flex-shrink-0 w-28" style={{ color: 'var(--text-muted)' }}>{k}</span>
                                <span className="font-medium break-words" style={{ color: 'var(--text-primary)' }}>{v}</span>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-4 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Estimated Budget</span>
                            <span className="text-xl font-black gradient-text">
                                {order.budget > 0 ? `SAR ${order.budget.toLocaleString()}` : 'Custom'}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ═══════════════════════════════════════════════════════
   PAYMENT MODAL — Real Razorpay
   ═══════════════════════════════════════════════════════ */
const PaymentModal = ({ order, onClose, onSuccess }) => {
    const { user } = useContext(AuthContext);
    const [processing, setProcessing] = useState(false);
    const [paid, setPaid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handlePay = async () => {
        setProcessing(true);
        setErrorMsg('');

        // 1. Create Razorpay order on backend
        let rzpData;
        try {
            const { data } = await axios.post(`${API}/payments/razorpay`,
                { orderId: order._id },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            rzpData = data;
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Could not initiate payment. Please try again.');
            setProcessing(false);
            return;
        }

        // 2. Check Razorpay SDK loaded
        if (typeof window.Razorpay === 'undefined') {
            setErrorMsg('Payment gateway script failed to load. Please refresh the page and try again.');
            setProcessing(false);
            return;
        }

        // 3. Open Razorpay checkout
        const options = {
            key: rzpData.key,
            amount: rzpData.amount,
            currency: rzpData.currency,
            name: 'MakeASite',
            description: `${rzpData.projectName} — ${rzpData.plan} Plan`,
            order_id: rzpData.id,
            prefill: {
                name: user.name || '',
                email: user.email || '',
                contact: order.phoneNumber || '',
            },
            theme: { color: '#dc2626' },
            modal: {
                ondismiss: () => {
                    setProcessing(false);
                    toast.info('Payment cancelled. You can try again anytime.');
                },
            },
            handler: async (response) => {
                // 4. Verify signature on backend
                try {
                    await axios.post(`${API}/payments/verify`, {
                        orderId: order._id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    }, { headers: { Authorization: `Bearer ${user.token}` } });

                    setPaid(true);
                    onSuccess(order._id);
                    toast.success('Payment successful! Your project is now active.');
                } catch (verifyErr) {
                    setErrorMsg(verifyErr.response?.data?.message || 'Payment verification failed. Contact support.');
                    setProcessing(false);
                }
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (resp) => {
            setErrorMsg(`Payment failed: ${resp.error?.description || 'Unknown error'}. Please try again.`);
            setProcessing(false);
        });
        rzp.open();
        // Note: setProcessing stays true until handler/ondismiss fires
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={!processing && !paid ? onClose : undefined}>
                <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-center"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}
                    onClick={e => e.stopPropagation()}>

                    {/* ── SUCCESS STATE ── */}
                    {paid ? (
                        <div className="p-10 flex flex-col items-center gap-5">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="w-20 h-20 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)' }}>
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Payment Successful! 🎉
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    Your project <strong style={{ color: 'var(--text-primary)' }}>{order.projectName}</strong> has been confirmed. We'll reach out shortly to start development.
                                </p>
                            </div>
                            <div className="flex gap-3 flex-wrap justify-center">
                                <button onClick={onClose}
                                    className="secondary-btn px-5 py-2.5 rounded-xl font-bold text-sm">
                                    View Orders
                                </button>
                                <button onClick={onClose}
                                    className="primary-btn px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Message Developer
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ── PAYMENT STATE ── */
                        <div className="p-8 flex flex-col items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)' }}>
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>

                            <div>
                                <h3 className="text-xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
                                    Secure Payment
                                </h3>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    {order.projectName} — {order.plan} Plan
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="w-full p-5 rounded-xl text-center"
                                style={{
                                    background: 'linear-gradient(135deg,rgba(220,38,38,0.08),rgba(220,38,38,0.02))',
                                    border: '1px solid rgba(220,38,38,0.2)',
                                }}>
                                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                                    Amount Due
                                </p>
                                <p className="text-3xl font-black gradient-text">
                                    {order.budget > 0 ? `SAR ${order.budget.toLocaleString()}` : 'Custom'}
                                </p>
                                <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                                    Converted to INR at checkout
                                </p>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {errorMsg && (
                                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="w-full flex items-start gap-2.5 p-3 rounded-xl text-sm text-red-600 dark:text-red-400"
                                        style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)' }}>
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        {errorMsg}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Buttons */}
                            <div className="flex gap-3 w-full">
                                <button onClick={onClose} disabled={processing}
                                    className="flex-1 secondary-btn py-3 rounded-xl font-bold text-sm">
                                    Cancel
                                </button>
                                <button onClick={handlePay} disabled={processing}
                                    className="flex-1 primary-btn py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                                    {processing
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening…</>
                                        : <><CreditCard className="w-4 h-4" /> Pay Now</>}
                                </button>
                            </div>

                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                🔒 Payments are secured via <strong>Razorpay</strong>. Your card details never touch our servers.
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ═══════════════════════════════════════════════════════
   CART DRAWER
   ═══════════════════════════════════════════════════════ */
const CartDrawer = () => {
    const { user } = useContext(AuthContext);
    const { cartOpen, closeCart, cartItems, setCartItemsFromServer, removeCartItem } = useContext(OrderContext);

    const [loading, setLoading] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [payOrder, setPayOrder] = useState(null);

    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = useState({ open: false, orderId: null, deleting: false });

    const { data: serverOrders, isFetching } = useGetMyOrdersQuery(undefined, {
        skip: !cartOpen || !user,
    });
    const [deleteOrder] = useDeleteOrderMutation();

    // Load orders from server when drawer opens
    useEffect(() => {
        if (cartOpen && user) {
            setLoading(isFetching);
            if (serverOrders) {
                setCartItemsFromServer(serverOrders);
            }
        }
    }, [cartOpen, user, serverOrders, isFetching, setCartItemsFromServer]);

    /* ── Delete flow ── */
    const askDelete = (orderId) => setConfirmDialog({ open: true, orderId, deleting: false });
    const cancelDelete = () => setConfirmDialog({ open: false, orderId: null, deleting: false });

    const confirmDelete = async () => {
        setConfirmDialog(prev => ({ ...prev, deleting: true }));
        try {
            await deleteOrder(confirmDialog.orderId).unwrap();
            removeCartItem(confirmDialog.orderId);
            toast.success('Order removed successfully.');
            setConfirmDialog({ open: false, orderId: null, deleting: false });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete order.');
            setConfirmDialog(prev => ({ ...prev, deleting: false }));
        }
    };

    /* ── Payment success ── */
    const handlePaymentSuccess = (orderId) => {
        setPayOrder(null);
        setCartItemsFromServer(
            cartItems.map(o => o._id === orderId
                ? { ...o, paymentStatus: 'Completed', status: 'Accepted' }
                : o
            )
        );
    };

    return (
        <>
            {/* Modals rendered outside the drawer so they're not clipped */}
            {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
            {payOrder && (
                <PaymentModal
                    order={payOrder}
                    onClose={() => setPayOrder(null)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
            <ConfirmDialog
                isOpen={confirmDialog.open}
                loading={confirmDialog.deleting}
                title="Delete this order?"
                message="This will permanently remove the order from your cart. This action cannot be undone."
                confirmLabel="Yes, Delete"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <AnimatePresence>
                {cartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div key="cart-bd"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeCart}
                            className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm" />

                        {/* Drawer */}
                        <motion.div key="cart-drawer"
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 z-[301] w-full max-w-md flex flex-col shadow-2xl"
                            style={{ background: 'var(--bg-card)', borderLeft: '1px solid var(--border-strong)' }}>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
                                style={{ borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg,#dc2626,#991b1b)' }}>
                                        <ShoppingCart className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-extrabold text-lg" style={{ color: 'var(--text-primary)' }}>My Orders</h2>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            {cartItems.length} order{cartItems.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={closeCart}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                                {loading ? (
                                    <div className="flex items-center justify-center py-20">
                                        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                                    </div>
                                ) : cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                        <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                        <div>
                                            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Your cart is empty</p>
                                            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                                                Select a plan to create your first order
                                            </p>
                                        </div>
                                        <button onClick={closeCart} className="primary-btn px-5 py-2.5 rounded-xl font-bold text-sm">
                                            Browse Plans
                                        </button>
                                    </div>
                                ) : cartItems.map(order => (
                                    <motion.div key={order._id}
                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        layout
                                        className="rounded-2xl p-4 space-y-3"
                                        style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)' }}>

                                        {/* Order header */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                                                        style={{
                                                            background: `${PLAN_COLORS[order.plan] || '#64748b'}18`,
                                                            color: PLAN_COLORS[order.plan] || '#64748b',
                                                        }}>
                                                        {order.plan}
                                                    </span>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                                <p className="font-extrabold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                                                    {order.projectName}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-black text-base gradient-text">
                                                    {order.budget > 0 ? `SAR ${order.budget.toLocaleString()}` : 'Custom'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                                            <span>{order.pages} pages</span>
                                            <span>·</span>
                                            <span>{order.websiteType || 'Website'}</span>
                                            <span>·</span>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        {/* Payment paid badge */}
                                        {order.paymentStatus === 'Completed' && (
                                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle className="w-3.5 h-3.5" /> Payment confirmed
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-1">
                                            <button onClick={() => setViewOrder(order)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                                                style={{
                                                    background: 'var(--bg-card)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-secondary)',
                                                }}>
                                                <Eye className="w-3.5 h-3.5" /> View
                                            </button>

                                            {order.paymentStatus !== 'Completed' && (
                                                <button onClick={() => setPayOrder(order)}
                                                    className="flex-1 primary-btn flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold">
                                                    <CreditCard className="w-3.5 h-3.5" /> Pay Now
                                                </button>
                                            )}

                                            <button onClick={() => askDelete(order._id)}
                                                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                                style={{ border: '1px solid var(--border)' }}
                                                title="Delete order">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer */}
                            {cartItems.length > 0 && (
                                <div className="px-5 py-4 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />
                                        Click <strong>Pay Now</strong> to open secure Razorpay checkout. After payment, message the developer for updates.
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default CartDrawer;
