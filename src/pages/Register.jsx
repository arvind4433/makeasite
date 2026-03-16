import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * /register — standalone page.
 * Redirects to home and fires the open-login-modal event so the modal
 * opens on the register view. Keeps the route working for external links / bookmarks.
 */
const Register = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/', { replace: true });
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { context: 'general', view: 'register' } }));
        }, 50);
    }, [navigate]);
    return null;
};

export default Register;
