import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * /forgot-password — standalone page.
 * Redirects to home and fires open-login-modal on the forgot view.
 */
const ForgotPassword = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/', { replace: true });
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { context: 'general', view: 'forgot' } }));
        }, 50);
    }, [navigate]);
    return null;
};

export default ForgotPassword;
