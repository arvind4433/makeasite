import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import { LoadingContext } from './LoadingContext';
import { useDispatch } from 'react-redux';
import { setCredentials, clearCredentials } from '../features/auth/authSlice.js';
import { apiClient } from '../config/api.js';
import {
    useLoginMutation,
    useVerifyOtpMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} from '../services/authApi.js';

export const AuthContext = createContext();

/* ── Persist helper ─────────────────────────────────── */
const persist = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useContext(LoadingContext);
    const dispatch = useDispatch();
    const [loginMutation] = useLoginMutation();
    const [verifyOtpMutation] = useVerifyOtpMutation();
    const [registerMutation] = useRegisterMutation();
    const [forgotPasswordMutation] = useForgotPasswordMutation();
    const [resetPasswordMutation] = useResetPasswordMutation();

    /* Restore session from localStorage */
    useEffect(() => {
        const stored = localStorage.getItem('userInfo');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('userInfo');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    /* ── Hydrate user session (used by OAuth callback) ── */
    const hydrateUser = (data) => {
        if (!data?.token) return;
        setUser(data);
        persist(data);
        dispatch(setCredentials(data));
    };

    /* ── Step 1: Email/password → sends OTP, returns { message, email } ── */
    const login = async (email, password) => {
        startLoading();
        try {
            const data = await loginMutation({ email, password }).unwrap();
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            throw err;
        } finally { stopLoading(); }
    };

    /* ── Step 2: Verify OTP → returns full user+token ── */
    const verifyOTP = async (email, otp) => {
        startLoading();
        try {
            const data = await verifyOtpMutation({ email, otp }).unwrap();
            hydrateUser(data);
            toast.success(`Welcome${data.name ? ', ' + data.name.split(' ')[0] : ''}! You are now signed in.`);
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired OTP');
            throw err;
        } finally { stopLoading(); }
    };

    /* ── Register ─────────────────────────────────── */
    const register = async (userData) => {
        startLoading();
        try {
            const data = await registerMutation(userData).unwrap();
            toast.success(data.message || 'Registration successful. OTP sent to your email.');
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            throw err;
        } finally { stopLoading(); }
    };

    /* ── Forgot / Reset Password ─────────────────── */
    const forgotPassword = async (email) => {
        startLoading();
        try {
            const data = await forgotPasswordMutation({ email }).unwrap();
            toast.success(data.message);
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset email');
            throw err;
        } finally { stopLoading(); }
    };

    const resetPassword = async (email, otp, newPassword) => {
        startLoading();
        try {
            const data = await resetPasswordMutation({ email, otp, newPassword }).unwrap();
            toast.success(data.message || 'Password reset successfully!');
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password');
            throw err;
        } finally { stopLoading(); }
    };

    /* ── Social OAuth (redirect-based) ─────────────── */
    const googleLogin = async (credential) => {
        startLoading();
        try {
            const { data } = await apiClient.post('/auth/google', { credential });
            hydrateUser(data);
            toast.success(`Welcome${data.name ? ', ' + data.name.split(' ')[0] : ''}! Signed in with Google.`);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Google sign-in failed. Please try again.';
            toast.error(msg);
            throw err;
        } finally { stopLoading(); }
    };

    const facebookLogin = async (accessToken, userID) => {
        startLoading();
        try {
            const { data } = await apiClient.post('/auth/facebook', { accessToken, userID });
            hydrateUser(data);
            toast.success(`Welcome${data.name ? ', ' + data.name.split(' ')[0] : ''}! Signed in with Facebook.`);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Facebook sign-in failed. Please try again.';
            toast.error(msg);
            throw err;
        } finally { stopLoading(); }
    };

    /* ── Logout ─────────────────────────────────────── */
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        dispatch(clearCredentials());
        toast.info('Signed out successfully.');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            hydrateUser,
            login,
            register,
            verifyOTP,
            forgotPassword,
            resetPassword,
            googleLogin,
            facebookLogin,
            logout,
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
