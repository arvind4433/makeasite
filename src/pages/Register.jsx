import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import OTPModal from '../components/OTPModal';
import { AuthLayout, AuthHeader, AuthCard } from '../components/AuthComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config/api.js';
const FB_ENABLED = !!import.meta.env.VITE_FACEBOOK_APP_ID;

const Register = () => {
    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ name: '', email: '', password: '', country: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Ensure we have a return target for this auth flow
        const existing = sessionStorage.getItem('auth_return_to');
        if (!existing) {
            sessionStorage.setItem('auth_return_to', location.state?.returnTo || '/');
        }
    }, [location.state, location.pathname]);

    const handleGoogle = () => {
        const plan = new URLSearchParams(location.search).get('plan');
        if (plan) {
            sessionStorage.setItem('oauth_post_login', JSON.stringify({ action: 'openOrder', plan }));
        }
        sessionStorage.setItem('auth_return_to', sessionStorage.getItem('auth_return_to') || '/');
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    };

    const handleFacebook = () => {
        if (!FB_ENABLED) { setError('Facebook sign-in is coming soon!'); return; }
        const plan = new URLSearchParams(location.search).get('plan');
        if (plan) {
            sessionStorage.setItem('oauth_post_login', JSON.stringify({ action: 'openOrder', plan }));
        }
        sessionStorage.setItem('auth_return_to', sessionStorage.getItem('auth_return_to') || '/');
        window.location.href = `${API_BASE_URL}/api/auth/facebook`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try { await register(form); setShowOTP(true); }
        catch { /* toast shown by AuthContext */ } finally { setLoading(false); }
    };

    const handleVerify = async (email, otp) => {
        setLoading(true);
        try {
            await verifyOTP(email, otp);
            setShowOTP(false);
            const plan = new URLSearchParams(location.search).get('plan');
            let target = sessionStorage.getItem('auth_return_to') || '/';
            sessionStorage.removeItem('auth_return_to');
            if (plan) {
                try {
                    const url = new URL(target, window.location.origin);
                    url.searchParams.set('openOrder', plan);
                    target = url.pathname + url.search + url.hash;
                } catch {
                    target = `/?openOrder=${encodeURIComponent(plan)}`;
                }
            }
            navigate(target, { replace: true });
        } catch { /* toast shown by AuthContext */ } finally { setLoading(false); }
    };

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    return (
        <AuthLayout>
            <OTPModal isOpen={showOTP} onClose={() => setShowOTP(false)}
                email={form.email} onVerify={handleVerify} loading={loading} />

            <AuthHeader title="Create your account" subtitle="Sign up to start ordering high-performance websites." />

            <AuthCard>

                {/* Social buttons */}
                <div className="space-y-3 mb-6">
                    <SocialBtn onClick={handleGoogle} icon={<GoogleIcon />} label="Sign up with Google" />
                    <SocialBtn onClick={handleFacebook} icon={<FacebookIcon />} label="Sign up with Facebook"
                        comingSoon={!FB_ENABLED} />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-4 text-sm font-medium text-red-600 dark:text-red-400"
                            style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)' }}>
                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Divider text="Or register with email" />

                <form onSubmit={handleSubmit} className="space-y-4 mt-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <input type="text" required placeholder="John Doe" className="input-base" value={form.name} onChange={set('name')} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Country</label>
                            <input type="text" required placeholder="India" className="input-base" value={form.country} onChange={set('country')} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
                        <input type="tel" required placeholder="+91 98765 43210" className="input-base" value={form.phone} onChange={set('phone')} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                        <input type="email" required placeholder="you@company.com" className="input-base" value={form.email} onChange={set('email')} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                        <div className="relative">
                            <input type={showPw ? 'text' : 'password'} required placeholder="Min. 8 characters"
                                className="input-base pr-10" value={form.password} onChange={set('password')} />
                            <PwToggle show={showPw} toggle={() => setShowPw(!showPw)} />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                        By creating an account you agree to our{' '}
                        <Link to="/terms" className="text-red-600 dark:text-red-400 hover:underline">Terms</Link>{' '}and{' '}
                        <Link to="/privacy" className="text-red-600 dark:text-red-400 hover:underline">Privacy Policy</Link>.
                    </p>
                    <button type="submit" disabled={loading}
                        className="primary-btn w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 group disabled:opacity-60">
                        {loading
                            ? <><Spinner /> Creating account…</>
                            : <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to={`/login${location.search}`} className="font-semibold text-red-600 dark:text-red-400 hover:underline">
                        Sign in
                    </Link>
                </p>
            </AuthCard>
        </AuthLayout>
    );
};

/* ── primitives ─────────────────────────────────────── */
const Spinner = () => <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
const PwToggle = ({ show, toggle }) => (
    <button type="button" onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
);
const Divider = ({ text }) => (
    <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="relative flex justify-center text-xs font-semibold">
            <span className="px-4 text-slate-400 dark:text-slate-600" style={{ backgroundColor: 'var(--bg-card)' }}>{text}</span>
        </div>
    </div>
);
const SocialBtn = ({ onClick, icon, label, comingSoon }) => (
    <button onClick={onClick}
        className="relative w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
        style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}>
        {icon}{label}
        {comingSoon && (
            <span className="absolute right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>Soon</span>
        )}
    </button>
);
const GoogleIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);
const FacebookIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

export default Register;
