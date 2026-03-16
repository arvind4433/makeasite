import { useState, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    X, ArrowRight, ArrowLeft, Eye, EyeOff,
    AlertCircle, CheckCircle2, Loader2, Mail,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import OTPModal from './OTPModal';
import { API_BASE_URL } from '../config/api.js';
import Logo from './Logo.jsx';

/* ─────────────────────────────────────────────────────────
   Sub-components defined FIRST so they're always in scope
   ───────────────────────────────────────────────────────── */

function GoogleIcon() {
    return (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

function GoogleBtn({ onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'var(--bg-card-inner)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
            }}
        >
            <GoogleIcon />
            {label}
        </button>
    );
}

function Divider() {
    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{
                padding: '0 14px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                background: 'var(--bg-card)',
                whiteSpace: 'nowrap',
            }}>
                or continue with email
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
    );
}

function FieldError({ error }) {
    if (!error) return null;
    return (
        <p style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px', fontWeight: 500, color: '#ef4444' }}>
            <AlertCircle size={12} style={{ flexShrink: 0 }} />
            {error}
        </p>
    );
}

function Field({ label, error, children, labelRight }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</label>
                {labelRight}
            </div>
            {children}
            <FieldError error={error} />
        </div>
    );
}

const inputStyle = (hasError) => ({
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    outline: 'none',
    background: 'var(--bg-card-inner)',
    border: hasError ? '2px solid #ef4444' : '1px solid var(--border-strong)',
    color: 'var(--text-primary)',
});

function PwInput({ value, show, toggle, hasError, onChange, placeholder = '••••••••' }) {
    return (
        <div style={{ position: 'relative' }}>
            <input
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                style={{ ...inputStyle(hasError), paddingRight: '40px' }}
                value={value}
                onChange={onChange}
            />
            <button
                type="button"
                onClick={toggle}
                style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px',
                }}
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
}

function SubmitBtn({ loading, label }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="primary-btn"
            style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.65 : 1,
            }}
        >
            {loading
                ? <><Loader2 size={16} className="animate-spin" /> Please wait…</>
                : <>{label} <ArrowRight size={16} /></>}
        </button>
    );
}

/* ─────────────────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────────────────── */

export default function LoginModal({ isOpen, onClose, loginContext = 'general', initialView = 'login' }) {
    const { login, register, verifyOTP, forgotPassword, resetPassword } = useContext(AuthContext);
    const { pendingPlan, openOrderModal } = useContext(OrderContext);

    const [view, setView] = useState(initialView);
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [pendingEmail, setPendingEmail] = useState('');

    /* Login */
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPw, setLoginPw] = useState('');
    const [loginErrors, setLoginErrors] = useState({});
    const [showLoginPw, setShowLoginPw] = useState(false);

    /* Register */
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPw, setRegPw] = useState('');
    const [regCountry, setRegCountry] = useState('');
    const [regErrors, setRegErrors] = useState({});
    const [showRegPw, setShowRegPw] = useState(false);

    /* Forgot */
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotSent, setForgotSent] = useState(false);

    /* Reset */
    const [resetOtp, setResetOtp] = useState('');
    const [resetPw, setResetPw] = useState('');
    const [resetConfirm, setResetConfirm] = useState('');
    const [resetErrors, setResetErrors] = useState({});
    const [showResetPw, setShowResetPw] = useState(false);

    /* ── Handlers ── */
    const handleLogin = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!loginEmail.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) errs.email = 'Enter a valid email';
        if (!loginPw) errs.password = 'Password is required';
        if (Object.keys(errs).length) { setLoginErrors(errs); return; }
        setLoginErrors({});
        setLoading(true);
        try {
            await login(loginEmail, loginPw);
            setPendingEmail(loginEmail);
            setShowOTP(true);
        } catch (_) { } finally { setLoading(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!regName.trim()) errs.name = 'Full name is required';
        if (!regEmail.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = 'Enter a valid email';
        if (!regPw) errs.password = 'Password is required';
        else if (regPw.length < 8) errs.password = 'Min. 8 characters';
        if (!regCountry.trim()) errs.country = 'Country is required';
        if (Object.keys(errs).length) { setRegErrors(errs); return; }
        setRegErrors({});
        setLoading(true);
        try {
            await register({ name: regName, email: regEmail, password: regPw, country: regCountry });
            setPendingEmail(regEmail);
            setShowOTP(true);
        } catch (_) { } finally { setLoading(false); }
    };

    const handleVerifyOTP = async (email, otp) => {
        setLoading(true);
        try {
            await verifyOTP(email, otp);
            setShowOTP(false);
            onClose();
            if (loginContext === 'plan' && pendingPlan) {
                setTimeout(() => openOrderModal(pendingPlan), 300);
            }
        } catch (_) { } finally { setLoading(false); }
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        if (!forgotEmail.trim()) { setForgotError('Email is required'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) { setForgotError('Enter a valid email'); return; }
        setForgotError('');
        setLoading(true);
        try {
            await forgotPassword(forgotEmail);
            setForgotSent(true);
            setPendingEmail(forgotEmail);
        } catch (_) { } finally { setLoading(false); }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!resetOtp.trim()) errs.otp = 'OTP is required';
        if (!resetPw) errs.password = 'New password is required';
        else if (resetPw.length < 8) errs.password = 'Min. 8 characters';
        if (resetPw !== resetConfirm) errs.confirm = 'Passwords do not match';
        if (Object.keys(errs).length) { setResetErrors(errs); return; }
        setResetErrors({});
        setLoading(true);
        try {
            await resetPassword(pendingEmail || forgotEmail, resetOtp, resetPw);
            setView('login');
            setForgotSent(false);
        } catch (_) { } finally { setLoading(false); }
    };

    const handleGoogleLogin = () => {
        if (loginContext === 'plan' && pendingPlan) {
            sessionStorage.setItem('oauth_post_login', JSON.stringify({ action: 'openOrder', plan: pendingPlan }));
        }
        sessionStorage.setItem('auth_return_to', window.location.pathname);
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    };

    /* ── View titles ── */
    const titles = { login: 'Sign In', register: 'Create Account', forgot: 'Forgot Password', reset: 'Reset Password' };

    /* ── Shared link style ── */
    const linkBtn = { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#dc2626', textDecoration: 'underline', fontSize: '14px', padding: 0 };
    const backBtn = { background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', padding: 0 };

    return (
        <>
            {/* OTP overlay */}
            <OTPModal isOpen={showOTP} onClose={() => setShowOTP(false)} email={pendingEmail} onVerify={handleVerifyOTP} loading={loading} />

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="lm-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
                            onClick={onClose}
                        />

                        {/* Centering shell */}
                        <div style={{ position: 'fixed', inset: 0, zIndex: 251, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                            {/* Card */}
                            <motion.div
                                key="lm-card"
                                initial={{ opacity: 0, scale: 0.93, y: 24 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.93, y: 24 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                                onClick={e => e.stopPropagation()}
                                style={{
                                    width: '100%',
                                    maxWidth: '440px',
                                    borderRadius: '18px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-strong)',
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.18)',
                                }}
                            >
                                {/* ── Header ── */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Logo showText={false} size={26} />
                                        <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Poppins', sans-serif" }}>
                                            {titles[view] || 'Sign In'}
                                        </span>
                                    </div>
                                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: '#94a3b8' }}>
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* ── Body ── */}
                                <div style={{ padding: '0 24px 24px', maxHeight: '70vh', overflowY: 'auto' }}>

                                    {/* ════ LOGIN ════ */}
                                    {view === 'login' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <GoogleBtn onClick={handleGoogleLogin} label="Continue with Google" />
                                            <Divider />
                                            <form onSubmit={handleLogin} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                <Field label="Email" error={loginErrors.email}>
                                                    <input type="email" placeholder="you@email.com"
                                                        style={inputStyle(!!loginErrors.email)}
                                                        value={loginEmail}
                                                        onChange={e => { setLoginEmail(e.target.value); setLoginErrors(p => ({ ...p, email: '' })); }} />
                                                </Field>
                                                <Field label="Password" error={loginErrors.password}
                                                    labelRight={
                                                        <button type="button" style={linkBtn} onClick={() => setView('forgot')}>
                                                            Forgot password?
                                                        </button>
                                                    }>
                                                    <PwInput value={loginPw} show={showLoginPw} toggle={() => setShowLoginPw(p => !p)}
                                                        hasError={!!loginErrors.password}
                                                        onChange={e => { setLoginPw(e.target.value); setLoginErrors(p => ({ ...p, password: '' })); }} />
                                                </Field>
                                                <SubmitBtn loading={loading} label="Sign In" />
                                            </form>
                                            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                                                Don't have an account?{' '}
                                                <button style={linkBtn} onClick={() => setView('register')}>Create account</button>
                                            </p>
                                        </div>
                                    )}

                                    {/* ════ REGISTER ════ */}
                                    {view === 'register' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <GoogleBtn onClick={handleGoogleLogin} label="Sign up with Google" />
                                            <Divider />
                                            <form onSubmit={handleRegister} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    <Field label="Full Name" error={regErrors.name}>
                                                        <input type="text" placeholder="John Doe"
                                                            style={inputStyle(!!regErrors.name)}
                                                            value={regName}
                                                            onChange={e => { setRegName(e.target.value); setRegErrors(p => ({ ...p, name: '' })); }} />
                                                    </Field>
                                                    <Field label="Country" error={regErrors.country}>
                                                        <input type="text" placeholder="India"
                                                            style={inputStyle(!!regErrors.country)}
                                                            value={regCountry}
                                                            onChange={e => { setRegCountry(e.target.value); setRegErrors(p => ({ ...p, country: '' })); }} />
                                                    </Field>
                                                </div>
                                                <Field label="Email" error={regErrors.email}>
                                                    <input type="email" placeholder="you@email.com"
                                                        style={inputStyle(!!regErrors.email)}
                                                        value={regEmail}
                                                        onChange={e => { setRegEmail(e.target.value); setRegErrors(p => ({ ...p, email: '' })); }} />
                                                </Field>
                                                <Field label="Password" error={regErrors.password}>
                                                    <PwInput value={regPw} show={showRegPw} toggle={() => setShowRegPw(p => !p)}
                                                        placeholder="Min. 8 characters" hasError={!!regErrors.password}
                                                        onChange={e => { setRegPw(e.target.value); setRegErrors(p => ({ ...p, password: '' })); }} />
                                                </Field>
                                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                                                    By creating an account you agree to our{' '}
                                                    <a href="/terms" style={{ color: '#dc2626' }}>Terms</a> and{' '}
                                                    <a href="/privacy" style={{ color: '#dc2626' }}>Privacy Policy</a>.
                                                </p>
                                                <SubmitBtn loading={loading} label="Create Account" />
                                            </form>
                                            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                                                Already have an account?{' '}
                                                <button style={linkBtn} onClick={() => setView('login')}>Sign in</button>
                                            </p>
                                        </div>
                                    )}

                                    {/* ════ FORGOT PASSWORD ════ */}
                                    {view === 'forgot' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {forgotSent ? (
                                                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                                                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                                        <CheckCircle2 size={26} color="#10b981" />
                                                    </div>
                                                    <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 6px' }}>Check your inbox</p>
                                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 18px' }}>
                                                        We sent a reset code to <strong>{forgotEmail}</strong>.
                                                    </p>
                                                    <button onClick={() => setView('reset')} className="primary-btn"
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                                                        Enter Reset Code <ArrowRight size={15} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleForgot} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                                        Enter your email and we'll send you an OTP to reset your password.
                                                    </p>
                                                    <Field label="Email address" error={forgotError}>
                                                        <div style={{ position: 'relative' }}>
                                                            <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                                            <input type="email" placeholder="you@email.com"
                                                                style={{ ...inputStyle(!!forgotError), paddingLeft: '38px' }}
                                                                value={forgotEmail}
                                                                onChange={e => { setForgotEmail(e.target.value); setForgotError(''); }} />
                                                        </div>
                                                    </Field>
                                                    <SubmitBtn loading={loading} label="Send Reset Code" />
                                                </form>
                                            )}
                                            <div style={{ textAlign: 'center' }}>
                                                <button style={backBtn} onClick={() => setView('login')}>
                                                    <ArrowLeft size={14} /> Back to Sign In
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* ════ RESET PASSWORD ════ */}
                                    {view === 'reset' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                                Enter the OTP sent to <strong style={{ color: 'var(--text-primary)' }}>{pendingEmail || forgotEmail}</strong> and choose a new password.
                                            </p>
                                            <form onSubmit={handleReset} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                <Field label="OTP Code" error={resetErrors.otp}>
                                                    <input type="text" placeholder="6-digit code" maxLength={6}
                                                        style={{ ...inputStyle(!!resetErrors.otp), textAlign: 'center', letterSpacing: '8px', fontSize: '18px', fontWeight: 700 }}
                                                        value={resetOtp}
                                                        onChange={e => { setResetOtp(e.target.value.replace(/\D/g, '')); setResetErrors(p => ({ ...p, otp: '' })); }} />
                                                </Field>
                                                <Field label="New Password" error={resetErrors.password}>
                                                    <PwInput value={resetPw} show={showResetPw} toggle={() => setShowResetPw(p => !p)}
                                                        placeholder="Min. 8 characters" hasError={!!resetErrors.password}
                                                        onChange={e => { setResetPw(e.target.value); setResetErrors(p => ({ ...p, password: '' })); }} />
                                                </Field>
                                                <Field label="Confirm Password" error={resetErrors.confirm}>
                                                    <input type="password" placeholder="Repeat new password"
                                                        style={inputStyle(!!resetErrors.confirm)}
                                                        value={resetConfirm}
                                                        onChange={e => { setResetConfirm(e.target.value); setResetErrors(p => ({ ...p, confirm: '' })); }} />
                                                </Field>
                                                <SubmitBtn loading={loading} label="Reset Password" />
                                            </form>
                                            <div style={{ textAlign: 'center' }}>
                                                <button style={backBtn} onClick={() => { setForgotSent(false); setView('forgot'); }}>
                                                    <ArrowLeft size={14} /> Resend code
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
