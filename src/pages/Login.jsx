import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * /login — standalone page.
 * Redirects to home and fires the open-login-modal event so the modal
 * opens on the login view. Keeps the route working for external links / bookmarks.
 */
const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/', { replace: true });
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { context: 'general', view: 'login' } }));
        }, 50);
    }, [navigate]);
    return null;
};

export default Login;
