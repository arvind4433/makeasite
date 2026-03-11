import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { AuthLayout, AuthHeader, AuthCard } from '../components/AuthComponents';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong');
            setSent(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthHeader
                title="Forgot password?"
                subtitle="Enter your email and we'll send a reset link." />

            <AuthCard>
                {sent ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                            style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)' }}>
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Check your inbox</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                            We sent a password reset link to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>.
                            Check your spam folder if you don't see it.
                        </p>
                        <button onClick={() => setSent(false)}
                            className="text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">
                            Try a different email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="email" required placeholder="you@company.com"
                                    className="input-base pl-10"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                        </div>

                        <button type="submit" disabled={loading}
                            className="primary-btn w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 group disabled:opacity-60">
                            {loading
                                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                                : <>Send Reset Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link to="/login"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                    </Link>
                </div>
            </AuthCard>
        </AuthLayout>
    );
};

export default ForgotPassword;
