import { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ERROR_MESSAGES = {
    google_failed: 'Google sign-in failed. Please try again.',
    facebook_failed: 'Facebook sign-in failed. Please try again.',
    oauth_failed: 'Authentication failed. Please try again.',
    server_error: 'A server error occurred. Please try again.',
    default: 'Sign-in failed. Please return to the login page.',
};

import Logo from '../components/Logo.jsx';

/**
 * /auth/callback
 *
 * Backend redirects here after Google / Facebook OAuth with:
 *   ?data=<url-encoded JSON user+token>   — on success
 *   ?error=<error_code>                   — on failure
 * 
 * Post-login behaviour:
 *   - Reads sessionStorage 'oauth_post_login' to determine where to go next
 *   - If action === 'openOrder', opens order modal for the saved plan
 *   - Otherwise: stays on homepage (no redirect to dashboard)
 */
const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, hydrateUser } = useContext(AuthContext);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Already logged in — just go home
        if (user) {
            const returnTo = sessionStorage.getItem('auth_return_to');
            sessionStorage.removeItem('auth_return_to');
            navigate(returnTo || '/', { replace: true });
            return;
        }

        const error = searchParams.get('error');
        const data = searchParams.get('data');

        if (error) {
            const msg = ERROR_MESSAGES[error] || ERROR_MESSAGES.default;
            setErrorMsg(msg);
            toast.error(msg);
            return;
        }

        if (data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(data));
                if (!parsed.token) throw new Error('No token in response');

                // Hydrate session (AuthContext + RTK auth slice + localStorage)
                hydrateUser(parsed);

                // Read post-login action from sessionStorage
                const postLoginRaw = sessionStorage.getItem('oauth_post_login');
                sessionStorage.removeItem('oauth_post_login');
                const returnTo = sessionStorage.getItem('auth_return_to');
                sessionStorage.removeItem('auth_return_to');

                let target = returnTo || '/';
                let planToOpen = null;
                if (postLoginRaw) {
                    try {
                        const postLogin = JSON.parse(postLoginRaw);
                        if (postLogin.action === 'openOrder' && postLogin.plan) {
                            planToOpen = postLogin.plan;
                        }
                    } catch (_) { }
                }

                if (planToOpen) {
                    try {
                        const url = new URL(target, window.location.origin);
                        url.searchParams.set('openOrder', planToOpen);
                        target = url.pathname + url.search + url.hash;
                    } catch (_) {
                        target = `/?openOrder=${encodeURIComponent(planToOpen)}`;
                    }
                }

                toast.success(`Welcome${parsed.name ? ', ' + parsed.name.split(' ')[0] : ''}! Signed in.`);
                navigate(target, { replace: true });
            } catch (err) {
                console.error('OAuth callback parse error:', err);
                setErrorMsg('Something went wrong processing your login. Please try again.');
            }
            return;
        }

        // No data and no error — redirect to login
        navigate('/login', { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Loading spinner while processing */
    if (!errorMsg) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center"
                style={{ backgroundColor: 'var(--bg-base)' }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6">
                    <div className="relative w-16 h-16">
                        <div className="w-16 h-16 rounded-full border-4 border-red-200 dark:border-red-900 border-t-red-600 dark:border-t-red-500 animate-spin absolute inset-0" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Logo showText={false} size={32} />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-slate-700 dark:text-slate-300 text-base">Signing you in…</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Please wait a moment</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: 'var(--bg-base)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="card w-full max-w-md p-10 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
                    <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sign-in Failed</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">{errorMsg}</p>
                <button onClick={() => navigate('/')}
                    className="primary-btn w-full py-3 rounded-xl font-bold text-sm">
                    Back to Home
                </button>
            </motion.div>
        </div>
    );
};

export default AuthCallback;
