import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import OTPModal from '../components/OTPModal';
import { AuthLayout, AuthHeader, AuthCard } from '../components/AuthComponents';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config/api.js';
const FB_ENABLED = !!import.meta.env.VITE_FACEBOOK_APP_ID;

const Login = () => {
    const { user, login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');

    // After login — go to homepage (not dashboard); admin goes to admin panel
    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin-dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    /* ── Social redirects ── */
    const handleGoogle = () => {
        const plan = new URLSearchParams(location.search).get('plan');
        if (plan) {
            sessionStorage.setItem('oauth_post_login', JSON.stringify({ action: 'openOrder', plan }));
        }
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    };

    const handleFacebook = () => {
        if (!FB_ENABLED) { setError('Facebook sign-in is coming soon. Stay tuned!'); return; }
        const plan = new URLSearchParams(location.search).get('plan');
        if (plan) {
            sessionStorage.setItem('oauth_post_login', JSON.stringify({ action: 'openOrder', plan }));
        }
        window.location.href = `${API_BASE_URL}/api/auth/facebook`;
    };

    /* ── Email / password ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            setPendingEmail(form.email);
            setShowOTP(true);
        } catch (_) {
            // Error shown by AuthContext toast
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (email, otp) => {
        setLoading(true);
        try {
            const data = await verifyOTP(email, otp);
            setShowOTP(false);
            // Navigation happens via useEffect above
        } catch (_) {
        } finally { setLoading(false); }
    };

    const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setError(''); };

    return (
        <AuthLayout>
            <OTPModal isOpen={showOTP} onClose={() => setShowOTP(false)}
                email={pendingEmail} onVerify={handleVerify} loading={loading} />

            <AuthHeader title="Welcome back" subtitle="Sign in to manage your projects and orders." />

            <AuthCard>

                {/* Social Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-7">
                    <SocialBtn onClick={handleGoogle} icon={<GoogleIcon />} label="Google" />
                    <SocialBtn onClick={handleFacebook} icon={<FacebookIcon />} label="Facebook" comingSoon={!FB_ENABLED} />
                </div>

                {/* Error banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-4 text-sm font-medium text-red-600 dark:text-red-400"
                            style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)' }}>
                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Divider */}
                <Divider text="Or continue with email" />

                {/* Email/password form */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-1">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                        <input type="email" required placeholder="you@company.com"
                            className="input-base" value={form.email} onChange={set('email')} />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                            <Link to="/forgot-password" className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input type={showPw ? 'text' : 'password'} required placeholder="••••••••"
                                className="input-base pr-10" value={form.password} onChange={set('password')} />
                            <PwToggle show={showPw} toggle={() => setShowPw(!showPw)} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="primary-btn w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 group disabled:opacity-60">
                        {loading
                            ? <><Spinner /> Signing in…</>
                            : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to={`/register${location.search}`} className="font-semibold text-red-600 dark:text-red-400 hover:underline">
                        Create account
                    </Link>
                </p>
            </AuthCard>
        </AuthLayout>
    );
};

/* ═══════════════════ Shared primitives ════════════════ */

const Spinner = () => (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

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
            <span className="px-4 text-slate-400 dark:text-slate-600" style={{ backgroundColor: 'var(--bg-card)' }}>
                {text}
            </span>
        </div>
    </div>
);

const SocialBtn = ({ onClick, icon, label, comingSoon }) => (
    <button
        onClick={onClick}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}
    >
        {icon}
        <span>{label}</span>
        {comingSoon && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-2"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
                Soon
            </span>
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

export default Login;
