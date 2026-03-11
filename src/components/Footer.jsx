import { Hexagon, Github, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'WebDevPro';

const socials = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Instagram, href: '#', label: 'Instagram' },
];

const links = {
    Services: [
        { label: 'Website Development', to: '/services' },
        { label: 'E-Commerce Stores', to: '/services' },
        { label: 'Admin Dashboards', to: '/services' },
        { label: 'Performance Fixes', to: '/services' },
    ],
    Company: [
        { label: 'Pricing', to: '/pricing' },
        { label: 'Portfolio', to: '/portfolio' },
        { label: 'Contact', to: '/contact' },
        { label: 'Order Now', to: '/register' },
    ],
    Legal: [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Refund Policy', to: '/refund' },
        { label: 'About Us', to: '/about' },
    ],
};

const Footer = () => (
    <footer className="bg-gray-50 dark:bg-[#020409] border-t border-gray-200 dark:border-white/[0.06] transition-colors duration-300">

        {/* Red accent top line */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4), transparent)' }} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                {/* Brand */}
                <div className="lg:col-span-4 space-y-6">
                    <Link to="/" className="flex items-center gap-2.5 w-fit group">
                        <div className="p-1.5 rounded-lg text-white group-hover:shadow-[0_0_16px_rgba(220,38,38,0.4)] transition-shadow"
                            style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                            <Hexagon className="h-5 w-5 fill-current" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                            {APP_NAME.replace('Pro', '')}<span className="text-red-600 dark:text-red-500">Pro</span>
                        </span>
                    </Link>

                    <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                        We design and ship high-performance websites and SaaS platforms for modern businesses worldwide. Starting from 3,000 SAR.
                    </p>

                    <Link to="/pricing"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-red-700 dark:text-red-400 group transition-all border border-red-200 dark:border-red-500/25 bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10">
                        Order Your Website
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex gap-3">
                        {socials.map(({ icon: Icon, href, label }) => (
                            <a key={label} href={href} aria-label={label}
                                className="h-9 w-9 rounded-full flex items-center justify-center text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:-translate-y-0.5 transition-all bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.07]">
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-8 lg:pl-10">
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-5 uppercase tracking-widest">{section}</h3>
                            <ul className="space-y-3.5">
                                {items.map(({ label, to, href }) => (
                                    <li key={label}>
                                        {to ? (
                                            <Link to={to} className="text-sm text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                                                {label}
                                            </Link>
                                        ) : (
                                            <a href={href} className="text-sm text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                                                {label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-200 dark:border-white/[0.05] mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    All systems operational
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
