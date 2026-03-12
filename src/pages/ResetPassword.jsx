import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthLayout, AuthHeader, AuthCard } from '../components/AuthComponents';
import { useResetPasswordMutation } from '../services/authApi.js';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [resetPasswordMutation] = useResetPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
        if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
        setLoading(true);
        try {
            await resetPasswordMutation({ token, password: form.password }).unwrap();
            setDone(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err?.data?.message || err?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    return (
        <AuthLayout>
            <AuthHeader title="Set new password" subtitle="Choose a strong password for your account." />

            <AuthCard>
                {done ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                            style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)' }}>
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Password updated!</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Redirecting you to sign in…
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {['password', 'confirm'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    {field === 'password' ? 'New Password' : 'Confirm Password'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        required
                                        placeholder={field === 'password' ? 'Min. 8 characters' : 'Repeat password'}
                                        className="input-base pr-10"
                                        value={form[field]}
                                        onChange={set(field)} />
                                    {field === 'password' && (
                                        <button type="button" onClick={() => setShowPw(!showPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {error && (
                            <div className="rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium"
                                style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="primary-btn w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 group disabled:opacity-60">
                            {loading
                                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
                                : <>Update Password <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>
                )}

                {!done && (
                    <div className="mt-8 text-center">
                        <Link to="/login"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                        </Link>
                    </div>
                )}
            </AuthCard>
        </AuthLayout>
    );
};

export default ResetPassword;
