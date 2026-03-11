import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { LoadingContext } from './LoadingContext';

export const AuthContext = createContext();

const API = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : '/api';

/* ── Persist helper ─────────────────────────────────── */
const persist = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useContext(LoadingContext);

    /* Restore session from localStorage */
    useEffect(() => {
        const stored = localStorage.getItem('userInfo');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch (_) { }
        }
        setLoading(false);
    }, []);

    /* ── Step 1: Email/password → sends OTP, returns { message, email } ── */
    const login = async (email, password) => {
        startLoading();
        try {
            const { data } = await axios.post(`${API}/auth/login`, { email, password });
            // Success: OTP was sent. Return data so caller can show OTP modal.
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
            const { data } = await axios.post(`${API}/auth/verify-otp`, { email, otp });
            setUser(data);
            persist(data);
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
            const { data } = await axios.post(`${API}/auth/register`, userData);
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
            const { data } = await axios.post(`${API}/auth/forgot-password`, { email });
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
            const { data } = await axios.post(`${API}/auth/reset-password`, { email, otp, newPassword });
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
            const { data } = await axios.post(`${API}/auth/google`, { credential });
            setUser(data); persist(data);
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
            const { data } = await axios.post(`${API}/auth/facebook`, { accessToken, userID });
            setUser(data); persist(data);
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
        toast.info('Signed out successfully.');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
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
