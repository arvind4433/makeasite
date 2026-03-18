import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import LoginModal from './auth/Login';
import RegisterModal from './auth/Register';
import ForgotPasswordModal from './auth/ForgetPassword';
import NewPasswordModal from './auth/NewPassword';
import SocialAuth from "./pages/SocialAuth"
import AboutPage from './pages/AboutPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsPage from './pages/TermsPage';
import RefundPolicy from './pages/RefundPolicy';
import Dashboard from './pages/Dashboard';
import PricingPage from './pages/PricingPage';
import AdminDashboard from './pages/AdminDashboard';
import OrderDetailsPage from './pages/OrderDetailsPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { OrderProvider, useOrder } from './context/OrderContext';
import PageLoader from './components/PageLoader';
import CookieConsent from './components/CookieConsent';
import OrderModal from './components/OrderModal';
import CartDrawer from './components/CartDrawer';

import { useEffect, useState, useContext } from 'react';

/* ── Scroll to top on every route change ─────────────── */
const ScrollToTop = () => {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, search]);
  return null;
};

/* ── Auth pages hide the global Footer ── */
const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/auth/callback'];
const isAuthPath = (path) =>
  AUTH_PATHS.includes(path) || path.startsWith('/reset-password');

/* ── Main app shell ──────────────────────────────────── */
const AppInner = () => {
  const { isLoading } = useLoading();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const hideFooter = isAuthPath(location.pathname);
  const { openOrderModal } = useOrder();

  // Auth modal states
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginContext, setLoginContext] = useState('general');
  const [loginInitialView, setLoginInitialView] = useState('login');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [newPasswordOpen, setNewPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Handle plan-select → login → order flow from OAuth callback query param
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const openOrder = searchParams.get('openOrder');
    if (openOrder && user) {
      // Clear param
      setSearchParams(prev => { const n = new URLSearchParams(prev); n.delete('openOrder'); return n; }, { replace: true });
      setTimeout(() => openOrderModal(openOrder), 400);
    }
  }, [searchParams, user, openOrderModal, setSearchParams]);

  // Listen for custom event from PricingSection / CostCalculator
  useEffect(() => {
    const handler = (e) => {
      const ctx = e.detail?.context || 'general';
      const view = e.detail?.view || 'login';
      if (user) {
        // User is already logged in — open order modal directly
        if (ctx === 'plan') openOrderModal();
      } else {
        setLoginContext(ctx);
        setLoginInitialView(view);
        setLoginModalOpen(true);
      }
    };
    window.addEventListener('open-login-modal', handler);
    return () => window.removeEventListener('open-login-modal', handler);
  }, [user, openOrderModal]);

  const handleOpenLogin = (view = 'login') => {
    setLoginContext('general');
    setLoginInitialView(view);
    setLoginModalOpen(true);
  };


  return (
    <>
      <PageLoader visible={isLoading} />
      <ScrollToTop />

      {/* Global Auth Modals */}
      {loginModalOpen && (
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          loginContext={loginContext}
          initialView={loginInitialView}
          openRegister={() => { setLoginModalOpen(false); setRegisterModalOpen(true); }}
          openForgotPassword={() => { setLoginModalOpen(false); setForgotPasswordOpen(true); }}
        />
      )}
      {registerModalOpen && (
        <RegisterModal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          openLogin={() => { setRegisterModalOpen(false); setLoginModalOpen(true); }}
        />
      )}
      {forgotPasswordOpen && (
        <ForgotPasswordModal
          isOpen={forgotPasswordOpen}
          onClose={() => setForgotPasswordOpen(false)}
          onSuccess={(email) => {
            setForgotEmail(email);
            setForgotPasswordOpen(false);
            setNewPasswordOpen(true);
          }}
        />
      )}
      {newPasswordOpen && (
        <NewPasswordModal
          isOpen={newPasswordOpen}
          onClose={() => setNewPasswordOpen(false)}
          email={forgotEmail}
        />
      )}
      <OrderModal />
      <CartDrawer />

      <div className="flex flex-col min-h-screen transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <Navbar onOpenLogin={handleOpenLogin} />
        <main className="flex-grow">
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth pages */}
            <Route path="/login" element={<LoginModal isOpen={true} onClose={() => {}} openRegister={() => window.location.assign('/register')} openForgotPassword={() => window.location.assign('/forgot-password')} />} />
            <Route path="/register" element={<RegisterModal isOpen={true} onClose={() => {}} openLogin={() => window.location.assign('/login')} />} />
            <Route path="/forgot-password" element={<ForgotPasswordModal isOpen={true} onClose={() => window.location.assign('/login')} />} />
            <Route path="/reset-password/:token" element={<NewPasswordModal isOpen={true} onClose={() => {}} />} />
            <Route path="/social-auth" element={<SocialAuth />} />

            {/* Footer / legal pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refund" element={<RefundPolicy />} />

            {/* Protected app pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        {!hideFooter && <Footer />}
        <CookieConsent />
        <Toaster position="top-center" richColors closeButton />
      </div>
    </>
  );
};

/* ── Root component ──────────────────────────────────── */
function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show a brief branded loader until the first paint.
    // Avoid artificial delays: hide as soon as the app is ready to render.
    const raf = requestAnimationFrame(() => setInitialLoading(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <LoadingProvider>
          <AuthProvider>
            <OrderProvider>
              {initialLoading
                ? <PageLoader visible={true} />
                : <AppInner />
              }
            </OrderProvider>
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
