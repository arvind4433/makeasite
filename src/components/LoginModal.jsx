import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import OTPModal from './OTPModal';
import { API_BASE_URL } from '../config/api.js';
import Logo from './Logo.jsx';

/**
 * LoginModal — displayed inline over any page when:
 *   1. User clicks a plan CTA while logged out (loginModalOpen = true)
 *   2. The Navbar login button on mobile triggers this modal
 *
 * After successful login, it either:
 *   - Opens the order modal for the pending plan (if loginContext === 'plan')
 *   - Simply closes (stays on current page) if loginContext === 'general'
 */

const LoginModal = ({ isOpen, onClose, loginContext = 'general' }) => {
    const { login, verifyOTP, googleLogin } = useContext(AuthContext);
    const { pendingPlan, openOrderModal } = useContext(OrderContext);

    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');

    const set = (k) => (e) => { setForm(prev => ({ ...prev, [k]: e.target.value })); setError(''); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) { setError('Please enter email and password.'); return; }
        setLoading(true);
        setError('');
        try {
            const data = await login(form.email, form.password);
            setPendingEmail(form.email);
            setShowOTP(true);
        } catch (_) {
            // Error toast already shown by AuthContext
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (email, otp) => {
        setLoading(true);
        try {
            await verifyOTP(email, otp);
            setShowOTP(false);
            onClose();
            // If user clicked a plan, open the order modal
            if (loginContext === 'plan' && pendingPlan) {
                setTimeout(() => openOrderModal(pendingPlan), 300);
            }
        } catch (_) {
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Save context so callback knows what to do after OAuth
        if (loginContext === 'plan' && pendingPlan) {
            sessionStorage.setItem('oauth_post_login', JSON.stringify({ action: 'openOrder', plan: pendingPlan }));
        }
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div key="lm-backdrop"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm"
                        onClick={onClose} />

                    <motion.div key="lm-panel"
                        initial={{ opacity: 0, scale: 0.94, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 20 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="fixed inset-0 z-[251] flex items-center justify-center p-4 pointer-events-none">

                        <div className="pointer-events-auto w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}>

                            {/* OTP overlay */}
                            <OTPModal
                                isOpen={showOTP}
                                onClose={() => setShowOTP(false)}
                                email={pendingEmail}
                                onVerify={handleVerify}
                                loading={loading}
                            />

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Logo showText={false} size={26} />
                                    </div>
                                    <div className="ml-1">
                                        <h2 className="font-extrabold text-lg leading-none" style={{ color: 'var(--text-primary)' }}>Sign in</h2>
                                        {loginContext === 'plan' && (
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                                Sign in to continue ordering your plan
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button onClick={onClose}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="px-6 pb-6 space-y-4">
                                {/* Google */}
                                <button onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                                    style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>
                                    <GoogleIcon />  Continue with Google
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full h-px" style={{ background: 'var(--border)' }} />
                                    </div>
                                    <div className="relative flex justify-center text-xs font-semibold">
                                        <span className="px-4" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>or continue with email</span>
                                    </div>
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400"
                                            style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)' }}>
                                            <AlertCircle className="w-4 h-4" /> {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Email</label>
                                        <input type="email" placeholder="you@company.com"
                                            className="input-base" value={form.email} onChange={set('email')} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
                                        <div className="relative">
                                            <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                                                className="input-base pr-10" value={form.password} onChange={set('password')} />
                                            <button type="button" onClick={() => setShowPw(!showPw)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="primary-btn w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-60">
                                        {loading
                                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                                            : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </form>

                                <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                                    Don't have an account?{' '}
                                    <a href="/register" className="font-semibold text-red-600 dark:text-red-400 hover:underline">
                                        Create account
                                    </a>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const GoogleIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default LoginModal;
