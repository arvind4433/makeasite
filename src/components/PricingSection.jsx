import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Info } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import { PACKAGE_LIST } from '../config/pricing';

/* ── Feature row ──────────────────────────────────── */
const FeatureItem = ({ text, note, popular }) => (
    <li className="flex items-start gap-3 text-sm">
        <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${popular
            ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400'
            : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
            }`}>
            <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
        </div>
        <div className="flex-grow leading-snug">
            <span className="text-slate-700 dark:text-slate-300 font-medium">{text}</span>
            {note && (
                <span className="ml-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 italic">
                    ({note})
                </span>
            )}
        </div>
    </li>
);

/* ── Suitable-for pill ─────────────────────────────── */
const SuitablePill = ({ label }) => (
    <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full"
        style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        {label}
    </span>
);

/* ── Plan card ─────────────────────────────────────── */
const PlanCard = ({ plan, index, onSelect }) => (
    <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`relative flex flex-col rounded-2xl transition-all duration-300 ${plan.popular
            ? 'ring-2 ring-red-500/60 shadow-[0_0_60px_rgba(220,38,38,0.12)]'
            : 'card'
            }`}
        style={plan.popular ? { backgroundColor: 'var(--bg-card)', border: 'none' } : {}}
    >
        {/* Most Popular badge */}
        {plan.popular && (
            <div className="absolute -top-4 inset-x-0 flex justify-center">
                <span className="primary-btn inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    <Sparkles className="w-3 h-3" /> {plan.badge}
                </span>
            </div>
        )}

        {/* Advanced badge for Premium */}
        {plan.badge && !plan.popular && (
            <div className="absolute -top-4 inset-x-0 flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-secondary)' }}>
                    {plan.badge}
                </span>
            </div>
        )}

        <div className="p-7 flex flex-col flex-grow">

            {/* Plan header */}
            <div className="mb-5 mt-1">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                    {plan.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">{plan.tagline}</p>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className={`text-4xl font-black tracking-tight ${plan.popular ? 'gradient-text' : 'text-slate-900 dark:text-white'}`}>
                        {plan.priceLabel}
                    </span>
                    <span className="text-base font-bold text-slate-500 dark:text-slate-400">{plan.currency}</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">One-time project price</p>
            </div>

            {/* Features */}
            <ul className="space-y-3.5 mb-7 flex-grow">
                {plan.features.map((f) => (
                    <FeatureItem key={f.text} {...f} popular={plan.popular} />
                ))}
            </ul>

            {/* Best for */}
            <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-2.5">
                    Best for
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {plan.suitableFor.map((l) => <SuitablePill key={l} label={l} />)}
                </div>
            </div>

            {/* CTA — now a button, not a link */}
            <button
                onClick={() => onSelect(plan.id)}
                className={`w-full py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 group transition-all duration-200 ${plan.popular ? 'primary-btn' : 'secondary-btn'
                    }`}>
                {plan.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    </motion.div>
);

/* ════════════════════════════════════════════════════
   MAIN SECTION
   ════════════════════════════════════════════════════ */
const PricingSection = () => {
    const { user } = useContext(AuthContext);
    const { openOrderModal, setPendingPlan } = useContext(OrderContext);

    // loginModalOpen & loginContext are managed by App.jsx via context
    // We import the setter from App via a small bridge export
    const handlePlanSelect = (planId) => {
        if (user) {
            openOrderModal(planId);
        } else {
            // Save plan and trigger login modal via a custom event
            setPendingPlan(planId);
            window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { context: 'plan' } }));
        }
    };

    return (
        <section id="pricing" className="py-24 sm:py-32 section-light section-sep relative overflow-hidden transition-colors duration-300">

            <div className="pointer-events-none absolute inset-0 opacity-50"
                style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(220,38,38,0.05) 0%, transparent 70%)' }} />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-20">
                    <span className="badge-red mb-4">Pricing</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                        Transparent pricing,{' '}
                        <span className="gradient-text">zero surprises</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Choose a package that fits your project. All prices are in{' '}
                        <strong className="text-slate-700 dark:text-slate-300">Saudi Riyal (SAR)</strong> and include full source code ownership.
                    </p>
                </motion.div>

                {/* Plan cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-6">
                    {PACKAGE_LIST.map((plan, i) => (
                        <PlanCard key={plan.id} plan={plan} index={i} onSelect={handlePlanSelect} />
                    ))}
                </div>

                {/* Note */}
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10 max-w-3xl mx-auto">
                    <div className="flex items-start gap-4 rounded-2xl px-6 py-5"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
                            <Info className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Note on Features</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Listed features are standard inclusions for each package. Final scope may vary based on your specific requirements — all customisations are discussed and agreed transparently before development begins.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }}
                    className="mt-14 text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-5 text-base">
                        Not sure which plan fits your project?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/contact" className="secondary-btn px-8 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2">
                            Talk to Us First
                        </a>
                        <button onClick={() => handlePlanSelect('custom')}
                            className="primary-btn px-8 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 group">
                            Get Custom Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-5">
                        Want a custom estimate?{' '}
                        <a href="#cost-calculator" className="text-red-600 dark:text-red-400 font-semibold hover:underline">
                            Use the Cost Estimator below ↓
                        </a>
                    </p>
                </motion.div>

            </div>
        </section>
    );
};

export default PricingSection;
