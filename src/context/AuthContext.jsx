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
    useVerifyContactOtpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useSendProfileOtpMutation,
    useVerifyProfileOtpMutation,
} from '../services/authApi.js';

export const AuthContext = createContext();

const persist = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
};

const getErrorMessage = (error, fallback = 'Something went wrong') => {
    const message = error?.data?.message || error?.response?.data?.message || error?.message;

    if (Array.isArray(message)) {
        return message[0] || fallback;
    }

    if (typeof message === 'string' && message.trim()) {
        return message;
    }

    if (
        error?.status === 'FETCH_ERROR' ||
        error?.code === 'ERR_NETWORK' ||
        error?.message === 'Network Error' ||
        String(error?.error || '').toLowerCase().includes('failed to fetch')
    ) {
        return 'Network error, please try again';
    }

    return fallback;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useContext(LoadingContext);
    const dispatch = useDispatch();
    const [loginMutation] = useLoginMutation();
    const [verifyOtpMutation] = useVerifyOtpMutation();
    const [registerMutation] = useRegisterMutation();
    const [verifyContactOtpMutation] = useVerifyContactOtpMutation();
    const [forgotPasswordMutation] = useForgotPasswordMutation();
    const [resetPasswordMutation] = useResetPasswordMutation();
    const [sendProfileOtpMutation] = useSendProfileOtpMutation();
    const [verifyProfileOtpMutation] = useVerifyProfileOtpMutation();

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

    const hydrateUser = (data) => {
        if (!data?.token) return;
        setUser(data);
        persist(data);
        dispatch(setCredentials(data));
    };

    const login = async (credentials) => {
        startLoading();
        try {
            return await loginMutation(credentials).unwrap();
        } catch (error) {
            toast.error(getErrorMessage(error, 'Login failed'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const verifyOTP = async (identifier, otp) => {
        startLoading();
        try {
            const isEmail = identifier?.includes('@');
            const body = isEmail ? { email: identifier, otp } : { phone: identifier, otp };
            const data = await verifyOtpMutation(body).unwrap();
            hydrateUser(data);
            return data;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Invalid OTP'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const verifyContactOTP = async ({ channel, otp, email, phone }) => {
        startLoading();
        try {
            return await verifyContactOtpMutation({ channel, otp, email, phone }).unwrap();
        } catch (error) {
            toast.error(getErrorMessage(error, 'Invalid OTP'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const register = async (userData) => {
        startLoading();
        try {
            const data = await registerMutation(userData).unwrap();
            toast.success(data.message || 'Verification OTPs sent');
            return data;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Registration failed'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const sendProfileOTP = async (channel) => {
        startLoading();
        try {
            const data = await sendProfileOtpMutation({ channel }).unwrap();
            toast.success(data.message || `${channel} OTP sent`);
            return data;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to send OTP'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const verifyProfileOTP = async (channel, otp) => {
        startLoading();
        try {
            const data = await verifyProfileOtpMutation({ channel, otp }).unwrap();
            const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const merged = { ...stored, ...data.user };
            hydrateUser(merged);
            toast.success(data.message || `${channel} verified successfully`);
            return data;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Invalid OTP'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const forgotPassword = async (email) => {
        startLoading();
        try {
            const data = await forgotPasswordMutation({ email }).unwrap();
            toast.success(data.message || 'Reset OTP sent to email');
            return data;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to send reset email'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const resetPassword = async (email, otp, newPassword) => {
        startLoading();
        try {
            const data = await resetPasswordMutation({ email, otp, password: newPassword }).unwrap();
            toast.success(data.message || 'Password reset successful');
            return data;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to reset password'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const googleLogin = async (credential) => {
        startLoading();
        try {
            const { data } = await apiClient.post('/auth/google', { credential });
            hydrateUser(data);
            toast.success('Login Successful');
            return data;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Google sign-in failed. Please try again.'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const facebookLogin = async (accessToken, userID) => {
        startLoading();
        try {
            const { data } = await apiClient.post('/auth/facebook', { accessToken, userID });
            hydrateUser(data);
            toast.success('Login Successful');
            return data;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Facebook sign-in failed. Please try again.'));
            throw error;
        } finally {
            stopLoading();
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
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
            verifyContactOTP,
            forgotPassword,
            resetPassword,
            sendProfileOTP,
            verifyProfileOTP,
            googleLogin,
            facebookLogin,
            logout,
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
