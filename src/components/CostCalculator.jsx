/**
 * CostCalculator.jsx
 *
 * All pricing data imported from src/config/pricing.js — the single
 * source of truth. The estimator base price tiers EXACTLY match the
 * pricing cards:
 *
 *   1–4  pages  →  Basic tier     = 3,000 SAR
 *   5–10 pages  →  Standard tier  = 9,000 SAR
 *  11–20 pages  →  Premium tier   = 40,000 SAR
 *
 * Add-ons and delivery speed multipliers stack on top.
 */
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, LogIn, BookOpen, Search,
    Zap, Clock, Flame, ArrowRight, Calculator,
    Paintbrush, LayoutDashboard,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import {
    PACKAGES, ADDONS, SPEEDS,
    getBasePrice, getTier, fmt,
} from '../config/pricing';

/* ── Icon map ─────────────────────────────────────── */
const ICONS = {
    loginSystem: LogIn,
    userPortal: LayoutDashboard,
    paymentGateway: CreditCard,
    blogSystem: BookOpen,
    seoOptimization: Search,
    customDesign: Paintbrush,
};

/* ── Speed icon map ───────────────────────────────── */
const SPEED_ICONS = { standard: Clock, fast: Zap, urgent: Flame };

/* ── Checkmark SVG ─────────────────────────────────── */
const CheckMark = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}
        strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/* ════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════ */
const CostCalculator = () => {
    const { user } = useContext(AuthContext);
    const { openOrderModal, setPendingPlan } = useContext(OrderContext);
    const [pages, setPages] = useState(PACKAGES.basic.pageRange.min + 2);  // 3 pages default
    const [features, setFeatures] = useState(
        Object.fromEntries(ADDONS.map((a) => [a.key, false]))
    );
    const [speed, setSpeed] = useState('standard');
    const [totalCost, setTotalCost] = useState(0);

    const currentTier = getTier(pages);
    const basePrice = getBasePrice(pages);

    const handleOrderNow = () => {
        const planId = currentTier?.id || 'custom';
        if (user) {
            openOrderModal(planId);
        } else {
            setPendingPlan(planId);
            window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { context: 'plan' } }));
        }
    };

    /**
     * Add-ons that are already bundled in the current tier should NOT
     * add extra cost — they show as "Included in plan" instead.
     * Keys bundled per tier (matches pricing cards):
     *   Standard+: loginSystem
     *   Premium:   loginSystem, paymentGateway
     */
    const INCLUDED_IN_TIER = {
        basic: [],
        standard: ['loginSystem'],
        premium: ['loginSystem', 'paymentGateway'],
    };
    const includedKeys = INCLUDED_IN_TIER[currentTier.id] ?? [];
    const isIncluded = (key) => includedKeys.includes(key);

    /* Real-time calculation — skip add-ons already in the tier price */
    useEffect(() => {
        let cost = basePrice;
        ADDONS.forEach(({ key, price }) => {
            if (features[key] && !isIncluded(key)) cost += price;
        });
        cost += SPEEDS.find((s) => s.value === speed)?.extra ?? 0;
        setTotalCost(cost);
    }, [pages, features, speed, basePrice, currentTier.id]);

    const toggle = (key) => {
        if (isIncluded(key)) return;   // already in tier, not toggleable
        setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    /* Breakdown rows */
    const breakdown = [
        { label: `${currentTier.name} base price (${currentTier.priceLabel} SAR · ${pages} pages)`, value: basePrice },
        ...ADDONS
            .filter((a) => features[a.key] && !isIncluded(a.key))
            .map((a) => ({ label: a.label, value: a.price })),
        ...(speed !== 'standard'
            ? [{ label: `Delivery: ${SPEEDS.find((s) => s.value === speed)?.label}`, value: SPEEDS.find((s) => s.value === speed)?.extra }]
            : []),
    ];

    /* ── Slider fill % ──────────────────────────────── */
    const sliderFill = ((pages - 1) / 19) * 100;

    return (
        <section id="cost-calculator"
            className="py-24 sm:py-32 section-surface section-sep transition-colors duration-300 relative overflow-hidden">

            <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-100"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(220,38,38,0.04) 0%, transparent 70%)' }} />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-14">
                    <span className="badge-red mb-4">Custom Estimate</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                        Build your own{' '}
                        <span className="gradient-text">custom quote</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Need something outside the standard packages? Configure it here.
                        Prices are <strong className="text-slate-700 dark:text-slate-300">instantly</strong> calculated
                        using the same SAR pricing as the cards above — no surprises.
                    </p>
                </motion.div>

                {/* ── Active tier indicator — updates live as slider moves ── */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {[PACKAGES.basic, PACKAGES.standard, PACKAGES.premium].map((pkg) => {
                        const active = currentTier.id === pkg.id;
                        return (
                            <motion.div key={pkg.id}
                                animate={active
                                    ? { background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: '#fff', scale: 1.06 }
                                    : { background: 'var(--bg-card-inner)', color: 'var(--text-muted)', scale: 1 }
                                }
                                transition={{ duration: 0.25 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                                style={!active ? { border: '1px solid var(--border)' } : {}}>
                                <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white/70' : 'bg-slate-400'}`} />
                                {pkg.name}
                                <span className="font-extrabold opacity-80">{pkg.priceLabel} SAR</span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Main card */}
                <div className="card max-w-6xl mx-auto overflow-hidden">
                    <div className="grid lg:grid-cols-[1fr_380px]">

                        {/* ── Left: Controls ─────────────────────── */}
                        <div className="p-8 lg:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-[var(--border)]">

                            {/* Pages */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Number of Pages</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                                            1–4 → Basic (3,000 SAR) · 5–10 → Standard (9,000 SAR) · 11–20 → Premium (40,000 SAR)
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 card-inner px-4 py-2 rounded-xl flex-shrink-0">
                                        <button onClick={() => setPages((p) => Math.max(1, p - 1))}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all leading-none">−</button>
                                        <span className="text-xl font-extrabold text-slate-900 dark:text-white w-6 text-center tabular-nums">{pages}</span>
                                        <button onClick={() => setPages((p) => Math.min(20, p + 1))}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all leading-none">+</button>
                                    </div>
                                </div>

                                {/* Slider with tier zones */}
                                <div className="relative">
                                    <input type="range" min={1} max={20} value={pages}
                                        onChange={(e) => setPages(Number(e.target.value))}
                                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${sliderFill}%, var(--bg-muted) ${sliderFill}%, var(--bg-muted) 100%)`
                                        }} />
                                    <style>{`input[type="range"]::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:#dc2626;cursor:pointer;box-shadow:0 0 0 3px rgba(220,38,38,0.2);}input[type="range"]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#dc2626;cursor:pointer;border:none;}`}</style>
                                </div>

                                {/* Tier zone labels */}
                                <div className="flex mt-2 text-[10px] font-semibold select-none">
                                    <div className="w-[20%] text-left" style={{ color: currentTier.id === 'basic' ? '#dc2626' : 'var(--text-muted)' }}>
                                        1–4<br /><span className="font-bold">Basic</span>
                                    </div>
                                    <div className="w-[30%] text-center" style={{ color: currentTier.id === 'standard' ? '#dc2626' : 'var(--text-muted)' }}>
                                        5–10<br /><span className="font-bold">Standard</span>
                                    </div>
                                    <div className="w-[50%] text-right" style={{ color: currentTier.id === 'premium' ? '#dc2626' : 'var(--text-muted)' }}>
                                        11–20<br /><span className="font-bold">Premium</span>
                                    </div>
                                </div>
                            </div>

                            <div className="divider-gradient" />

                            {/* Add-ons */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Optional Add-ons</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">Each add-on is stacked on top of the base tier price.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {ADDONS.map(({ key, label, price }) => {
                                        const Icon = ICONS[key] || Search;
                                        const on = features[key];
                                        const included = isIncluded(key);
                                        return (
                                            <button key={key} onClick={() => toggle(key)}
                                                disabled={included}
                                                className={`group flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all duration-200 ${included
                                                        ? 'border-emerald-300/40 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-500/5 cursor-default opacity-80'
                                                        : on
                                                            ? 'border-red-500/50 bg-red-50 dark:bg-red-500/8 shadow-[0_0_0_1px_rgba(220,38,38,0.2)]'
                                                            : 'border-[var(--border)] hover:border-red-400/40 hover:bg-red-50/50 dark:hover:bg-red-500/5 card-inner'
                                                    }`}>
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${included
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        : on
                                                            ? 'bg-red-600 text-white'
                                                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-red-100 dark:group-hover:bg-red-500/10 group-hover:text-red-600 dark:group-hover:text-red-400'
                                                    }`}>
                                                    <Icon className="w-4 h-4" strokeWidth={2} />
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className={`text-sm font-semibold truncate ${included ? 'text-emerald-700 dark:text-emerald-400' : on ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'
                                                        }`}>{label}</div>
                                                    <div className={`text-xs font-semibold mt-0.5 ${included ? 'text-emerald-600 dark:text-emerald-500' : on ? 'text-red-500 dark:text-red-400' : 'text-slate-500'
                                                        }`}>
                                                        {included ? '✓ Included in this plan' : `+${fmt(price)} SAR`}
                                                    </div>
                                                </div>
                                                {!included && (
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${on ? 'bg-red-600 text-white' : 'border-2 border-gray-300 dark:border-slate-600'
                                                        }`}>
                                                        {on && <CheckMark />}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="divider-gradient" />

                            {/* Delivery speed */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Delivery Timeline</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {SPEEDS.map(({ value, label, tagLabel }) => {
                                        const Icon = SPEED_ICONS[value] || Clock;
                                        const on = speed === value;
                                        return (
                                            <button key={value} onClick={() => setSpeed(value)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-200 ${on
                                                    ? 'border-red-500/50 bg-red-50 dark:bg-red-500/8 shadow-[0_0_0_1px_rgba(220,38,38,0.2)]'
                                                    : 'border-[var(--border)] card-inner hover:border-red-400/40'
                                                    }`}>
                                                <Icon className={`w-5 h-5 ${on ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`} strokeWidth={2} />
                                                <div className={`text-sm font-bold ${on ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>{label}</div>
                                                <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${on ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                                                    {tagLabel}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Price summary ──────────────────── */}
                        <div className="p-8 lg:p-10 flex flex-col" style={{ background: 'var(--bg-card-inner)' }}>

                            {/* Title */}
                            <div className="flex items-center gap-2.5 mb-6">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
                                    <Calculator className="w-4 h-4 text-red-600 dark:text-red-400" />
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">Your Estimate</span>
                            </div>

                            {/* Current tier badge */}
                            <div className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold self-start"
                                style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: '#dc2626' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                {currentTier.name} tier · {currentTier.priceLabel} SAR base
                            </div>

                            {/* Animated total */}
                            <AnimatePresence mode="wait">
                                <motion.div key={totalCost}
                                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                    className="mb-7">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                                            {fmt(totalCost)}
                                        </div>
                                        <div className="text-xl font-bold text-slate-400 dark:text-slate-500">SAR</div>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1.5 font-medium">One-time project price (excl. taxes)</div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Breakdown */}
                            <div className="flex-grow mb-7 space-y-2">
                                <div className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-3">
                                    Breakdown
                                </div>
                                {breakdown.map((row, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex justify-between items-start gap-3 text-sm">
                                        <span className="text-slate-600 dark:text-slate-400 font-medium leading-snug flex-grow">{row.label}</span>
                                        <span className="font-bold text-slate-900 dark:text-white tabular-nums flex-shrink-0">{fmt(row.value)} SAR</span>
                                    </motion.div>
                                ))}
                                {/* Total line */}
                                <div className="pt-3 mt-2 border-t border-[var(--border)] flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
                                    <span className="text-base font-extrabold gradient-text">{fmt(totalCost)} SAR</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={handleOrderNow}
                                className="primary-btn w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group mb-3">
                                Order This Project
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-center text-xs text-slate-500 dark:text-slate-600">
                                Full IP rights &amp; source code included
                            </p>
                        </div>
                    </div>
                </div>

                {/* Consistency note */}
                <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8 max-w-lg mx-auto">
                    💡 The base prices shown here are the same as the pricing cards above — no hidden differences.
                    Add-ons and delivery speed stack on top of the tier base price.
                </p>

            </div>
        </section>
    );
};

export default CostCalculator;
