import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, CheckCircle2, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ═══════════════════ Static data ═══════════════════ */
const stats = [{ value: '120+', label: 'Projects' }, { value: '98%', label: 'Satisfaction' }, { value: '5+', label: 'Years' }];
const trusts = [{ icon: CheckCircle2, text: 'Full-Stack' }, { icon: Zap, text: 'Fast Turnaround' }, { icon: Shield, text: 'Secure & Scalable' }];
const chartBars = [38, 52, 44, 70, 58, 88, 72, 60, 82, 95, 68, 76];
const navItems = ['Dashboard', 'Analytics', 'Orders', 'Settings'];

/* ═══════════════════ Rotating words ═══════════════ */
/**
 * All phrases are short (2–3 words) — always ONE line.
 * The clip container has height:1.06em matching the h1 leading,
 * so the layout never shifts when phrases change.
 */
const ROTATING_PHRASES = [
    'That Convert',
    'That Sell',
    'That Perform',
    'That Scale',
    'That Impress',
];

const RotatingWord = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setIndex(i => (i + 1) % ROTATING_PHRASES.length), 2800);
        return () => clearInterval(id);
    }, []);

    return (
        /*
         * Clip box: fixed to exactly one line of the h1 (leading-[1.06]).
         * overflow:hidden hides the sliding-in / sliding-out phrase.
         * Inner span is position:absolute + whitespace:nowrap → never wraps.
         */
        <span
            style={{
                display: 'block',
                position: 'relative',
                height: '1.06em',
                overflow: 'hidden',
                lineHeight: '1.06',
            }}
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    className="gradient-text"
                    style={{
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        whiteSpace: 'nowrap',
                        lineHeight: '1.06',
                    }}
                    initial={{ opacity: 0, y: '110%', filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: '-110%', filter: 'blur(4px)' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    {ROTATING_PHRASES[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
};

/* ═══════════════════ Motion presets ════════════════ */
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ═══════════════════ Component ═════════════════════ */
const HeroSection = () => (
    <section
        className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-base)' }}>

        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full opacity-30 dark:opacity-80"
                style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 65%)' }} />
            <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-60"
                style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 65%)' }} />
            {/* grid overlay */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.03 }}>
                <defs>
                    <pattern id="hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                        <path d="M 56 0 L 0 0 0 56" fill="none" stroke="currentColor" strokeWidth="0.7" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* ── LEFT: Copy ─────────────────────────────── */}
                <motion.div variants={container} initial="hidden" animate="show">

                    {/* Label badge */}
                    <motion.div variants={item} className="mb-8">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 border text-xs font-bold uppercase tracking-wide"
                            style={{ background: 'var(--accent-light)', borderColor: 'var(--accent-border)', color: '#dc2626' }}>
                            <Star className="w-3.5 h-3.5 fill-current" /> Professional Web Development
                        </span>
                    </motion.div>

                    {/* ── Headline: line 1 static, line 2 animated at fixed height ── */}
                    <motion.h1 variants={item}
                        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.06] mb-6">
                        We Build Websites
                        <RotatingWord />
                    </motion.h1>

                    <motion.p variants={item}
                        className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
                        From landing pages to full-stack SaaS — we design, develop, and deploy high-performance websites that grow your business.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mb-12">
                        <Link to="/pricing"
                            className="primary-btn px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 group">
                            Order Your Website <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/portfolio"
                            className="secondary-btn px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2">
                            View Portfolio
                        </Link>
                    </motion.div>

                    {/* Trust pills */}
                    <motion.div variants={item} className="flex flex-wrap gap-5 mb-12">
                        {trusts.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <Icon className="w-4 h-4 text-red-500" /> {text}
                            </div>
                        ))}
                    </motion.div>

                    {/* Stats row */}
                    <motion.div variants={item} className="flex flex-wrap gap-10 pt-8 border-t border-gray-200 dark:border-white/[0.07]">
                        {stats.map(({ value, label }) => (
                            <div key={label}>
                                <div className="text-3xl font-black gradient-text mb-0.5">{value}</div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* ── RIGHT: Dashboard Mockup ──────────────── */}
                <motion.div
                    initial={{ opacity: 0, x: 40, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden lg:block relative">

                    {/* Glow */}
                    <div className="absolute -inset-4 rounded-3xl blur-2xl"
                        style={{ background: 'radial-gradient(ellipse, rgba(220,38,38,0.1) 0%, transparent 70%)' }} />

                    {/* Dashboard shell */}
                    <div className="relative rounded-2xl overflow-hidden border shadow-2xl"
                        style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-raised)' }}>

                        {/* Top bar */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-b"
                            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card-inner)' }}>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-red-400/80" />
                                    <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                    <span className="w-3 h-3 rounded-full bg-green-400/80" />
                                </div>
                                <div className="flex gap-1 ml-2">
                                    {navItems.map((n, i) => (
                                        <span key={n} className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${i === 0 ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                            }`}>{n}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500" />
                        </div>

                        {/* Dashboard body */}
                        <div className="p-5 space-y-4">

                            {/* KPI row */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Revenue', value: 'INR 2.4K', delta: '+18%', up: true },
                                    { label: 'Orders', value: '342', delta: '+7%', up: true },
                                    { label: 'Traffic', value: '18.2K', delta: '+32%', up: true },
                                ].map((k) => (
                                    <div key={k.label} className="rounded-xl p-3.5"
                                        style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card-inner)' }}>
                                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 mb-1.5 uppercase tracking-wide">{k.label}</div>
                                        <div className="text-lg font-extrabold text-slate-900 dark:text-white leading-none mb-1">{k.value}</div>
                                        <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${k.up ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-500'
                                            }`}>{k.up ? '↑' : '↓'} {k.delta}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Chart */}
                            <div className="rounded-xl p-4"
                                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card-inner)' }}>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Revenue Overview</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-red-600 dark:text-red-400"
                                        style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>2025</span>
                                </div>
                                <div className="flex items-end gap-1.5 h-20">
                                    {chartBars.map((h, i) => (
                                        <motion.div key={i}
                                            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                                            transition={{ delay: 0.7 + i * 0.04, duration: 0.35, ease: 'easeOut' }}
                                            className="flex-1 rounded-t-sm origin-bottom"
                                            style={{
                                                height: `${h}%`,
                                                background: i === 9 || i === 10
                                                    ? 'linear-gradient(to top, #dc2626, #f97316)'
                                                    : 'linear-gradient(to top, rgba(220,38,38,0.25), rgba(220,38,38,0.1))'
                                            }} />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-1.5">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                        <span key={m} className="text-[8px] text-slate-400 flex-1 text-center">{m}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom row */}
                            <div className="grid grid-cols-5 gap-3">
                                <div className="col-span-3 rounded-xl p-3.5 space-y-2.5"
                                    style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card-inner)' }}>
                                    <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">Recent Projects</div>
                                    {[
                                        { name: 'E-Commerce Site', status: 'Live', color: 'bg-emerald-500' },
                                        { name: 'SaaS Dashboard', status: 'In Progress', color: 'bg-yellow-500' },
                                        { name: 'Real Estate Portal', status: 'Review', color: 'bg-blue-500' },
                                    ].map(p => (
                                        <div key={p.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
                                                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-500">{p.status}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="col-span-2 rounded-xl p-3.5 flex flex-col items-center justify-center"
                                    style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card-inner)' }}>
                                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                                        <circle cx="18" cy="18" r="14" fill="none" strokeWidth="4" style={{ stroke: 'var(--bg-muted)' }} />
                                        <circle cx="18" cy="18" r="14" fill="none" strokeWidth="4" stroke="#dc2626" strokeDasharray="62 88" strokeLinecap="round" />
                                        <circle cx="18" cy="18" r="14" fill="none" strokeWidth="4" stroke="#f97316" strokeDasharray="22 88" strokeDashoffset="-62" strokeLinecap="round" />
                                    </svg>
                                    <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center mt-1 leading-tight">70% Complete</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating badges */}
                    <motion.div animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                        className="absolute -top-4 -right-4 rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-raised)', color: 'var(--text-primary)' }}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live &amp; Deployed
                    </motion.div>

                    <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1.2 }}
                        className="absolute -bottom-4 -left-4 rounded-xl px-4 py-2.5 shadow-xl text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                        Starting INR 2,000
                    </motion.div>
                </motion.div>

            </div>
        </div>
    </section>
);

export default HeroSection;
