import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronRight, ArrowRight, ChevronDown, LayoutDashboard, Settings, LogOut, ShoppingCart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { OrderContext } from '../context/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo.jsx';
import { useSelector } from 'react-redux';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'MakeASite';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
];

/* ── Avatar fallback ────────────────────────────────── */
const Avatar = ({ user, size = 8 }) => {
    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';
    return user?.avatar ? (
        <img src={user.avatar} alt={user.name} className={`w-${size} h-${size} rounded-full object-cover`} />
    ) : (
        <div className={`w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold text-white`}
            style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
            {initials}
        </div>
    );
};

/* ── Profile dropdown ────────────────────────────────── */
const ProfileDropdown = ({ user, logout, onClose }) => {
    const dashPath = user?.role === 'admin' ? '/admin-dashboard' : '/dashboard';
    const menuItems = [
        { icon: LayoutDashboard, label: user?.role === 'admin' ? 'Admin Panel' : 'My Orders', to: dashPath },
        { icon: Settings, label: 'Profile Settings', to: '/dashboard?tab=settings' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-60 rounded-2xl overflow-hidden z-50 shadow-2xl"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}>

            {/* User info */}
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                    <Avatar user={user} size={10} />
                    <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
                    </div>
                </div>
            </div>

            {/* Menu items */}
            <div className="py-2 px-2">
                {menuItems.map(({ icon: Icon, label, to }) => (
                    <Link key={label} to={to} onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all">
                        <Icon className="w-4 h-4" strokeWidth={2} />
                        {label}
                    </Link>
                ))}
            </div>

            {/* Logout */}
            <div className="px-2 pb-2 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
                <button onClick={() => { logout(); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    Sign Out
                </button>
            </div>
        </motion.div>
    );
};

/* ── Cart Button ─────────────────────────────────────── */
const CartButton = ({ count, onClick }) => (
    <button onClick={onClick}
        className="relative p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
        aria-label="Shopping cart">
        <ShoppingCart size={19} />
        {count > 0 && (
            <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-black text-white flex items-center justify-center"
                style={{ background: '#dc2626' }}>
                {count > 9 ? '9+' : count}
            </motion.span>
        )}
    </button>
);

/* ── Navbar ──────────────────────────────────────────── */
const Navbar = ({ onOpenLogin }) => {
    const { logout } = useContext(AuthContext);
    const user = useSelector((state) => state.auth.user);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { cartBadge, openCart } = useContext(OrderContext);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setIsOpen(false); setDropOpen(false); }, [location.pathname]);

    useEffect(() => {
        const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const active = (p) => location.pathname === p;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled
            ? 'py-3 shadow-sm backdrop-blur-xl border-b'
            : 'py-4 bg-transparent'
            }`}
            style={scrolled ? { backgroundColor: 'rgba(var(--bg-card-rgb,255,255,255),0.92)', borderColor: 'var(--border)' } : {}}>

            <style>{`
        .navbar-glass { background: rgba(255,255,255,0.92); }
        .dark .navbar-glass { background: rgba(5,9,20,0.92); }
      `}</style>

            <div className={`w-full ${scrolled ? 'navbar-glass' : ''}`} style={{ position: 'absolute', inset: 0, zIndex: -1, ...(!scrolled ? { background: 'transparent' } : {}) }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <Logo />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 flex-1 justify-center px-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.path}
                                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active(link.path)
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}>
                                {active(link.path) && (
                                    <motion.span layoutId="nav-pill"
                                        className="absolute inset-0 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
                                        transition={{ type: 'spring', bounce: 0.25, duration: 0.35 }} />
                                )}
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">

                        {/* Theme toggle */}
                        <button onClick={toggleTheme} aria-label="Toggle Theme"
                            className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all hidden sm:block">
                            <AnimatePresence mode="wait">
                                <motion.div key={theme}
                                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                                </motion.div>
                            </AnimatePresence>
                        </button>

                        {/* Cart icon — always visible when logged in */}
                        {user && <CartButton count={cartBadge} onClick={openCart} />}

                        {/* --- Logged in: Avatar Dropdown --- */}
                        {user ? (
                            <div className="hidden md:block relative" ref={dropRef}>
                                <button onClick={() => setDropOpen(!dropOpen)}
                                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-white/5 border"
                                    style={{ borderColor: 'var(--border)' }}>
                                    <Avatar user={user} size={8} />
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {dropOpen && <ProfileDropdown user={user} logout={logout} onClose={() => setDropOpen(false)} />}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* --- Logged out: Login + CTA --- */
                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    onClick={onOpenLogin}
                                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2">
                                    Login
                                </button>
                                <Link to="/register" className="primary-btn px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
                                    Order Now <ArrowRight size={13} />
                                </Link>
                            </div>
                        )}

                        {/* Hamburger */}
                        <button className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsOpen(!isOpen)}>
                            <AnimatePresence mode="wait">
                                <motion.div key={isOpen ? 'x' : 'm'}
                                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="md:hidden overflow-hidden border-t"
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
                        <div className="px-4 pt-4 pb-6 space-y-1">

                            {/* Mobile user info */}
                            {user && (
                                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl"
                                    style={{ backgroundColor: 'var(--bg-card-inner)', border: '1px solid var(--border)' }}>
                                    <Avatar user={user} size={10} />
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                    </div>
                                </div>
                            )}

                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${active(link.path)
                                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/15'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}>
                                    {link.name}
                                    {active(link.path) && <ChevronRight size={14} />}
                                </Link>
                            ))}

                            <div className="h-px my-2" style={{ background: 'var(--border)' }} />

                            <button onClick={toggleTheme}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5">
                                <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            </button>

                            {user ? (
                                <>
                                    <button onClick={openCart}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5">
                                        <ShoppingCart className="w-4 h-4" /> My Cart {cartBadge > 0 && <span className="ml-auto text-xs font-black text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">{cartBadge}</span>}
                                    </button>
                                    <Link to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5">
                                        <LayoutDashboard className="w-4 h-4" /> {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                                    </Link>
                                    <button onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 pt-2">
                                    <button onClick={onOpenLogin}
                                        className="w-full text-center py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 border"
                                        style={{ borderColor: 'var(--border-strong)' }}>
                                        Sign In
                                    </button>
                                    <Link to="/register" className="w-full text-center primary-btn py-3 rounded-xl text-sm font-bold">
                                        Order Now 🚀
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
