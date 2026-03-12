import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ChevronRight, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import { toast } from 'sonner';
import { useCreateOrderMutation } from '../services/orderApi.js';

const PLAN_DEFAULTS = {
    basic: { budget: 3000, pages: 3, label: 'Basic Website (3,000 SAR)' },
    standard: { budget: 9000, pages: 7, label: 'Standard Website (9,000 SAR)' },
    premium: { budget: 40000, pages: 18, label: 'Premium Website (40,000 SAR)' },
    custom: { budget: 0, pages: 5, label: 'Custom Quote' },
};

const WEBSITE_TYPES = [
    'Business Website', 'Portfolio', 'E-commerce', 'Landing Page',
    'SaaS Platform', 'Blog / News', 'Educational', 'Custom',
];

const FEATURE_OPTIONS = [
    'Login / Auth System', 'Payment Gateway', 'CMS / Blog', 'Admin Panel',
    'SEO Setup', 'Animations / Effects', 'User Dashboard', 'Email Notifications',
    'Live Chat', 'Analytics Integration', 'Multi-language', 'Dark Mode',
];

const DESIGN_STYLES = [
    'Modern & Minimal', 'Bold & Colorful', 'Corporate & Professional',
    'Creative & Artistic', 'Dark / Neon', 'Elegant & Luxury',
];

const INITIAL_FORM = {
    projectName: '',
    websiteType: '',
    pages: 3,
    businessCategory: '',
    features: [],
    designStyle: '',
    referenceWebsites: '',
    description: '',
    preferredDeadline: '',
    contactEmail: '',
    phoneNumber: '',
    plan: 'basic',
    budget: 3000,
    deliveryOption: 'normal',
};

const fieldClasses = (err) =>
    `w-full px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none focus:ring-2 ${err
        ? 'border-2 border-red-500 focus:ring-red-400/30 bg-red-50/5'
        : 'focus:ring-red-500/20'
    }`;

const inputStyle = (err) => ({
    background: 'var(--bg-card-inner)',
    border: err ? '2px solid #ef4444' : '1px solid var(--border-strong)',
    color: 'var(--text-primary)',
});

const STEPS = ['Project Info', 'Features', 'Description', 'Confirm'];

const OrderModal = () => {
    const { user } = useContext(AuthContext);
    const { orderModalOpen, closeOrderModal, pendingPlan, addCartItem, openCart } = useContext(OrderContext);
    const [createOrder] = useCreateOrderMutation();

    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const fileRef = useRef(null);
    const scrollRef = useRef(null);

    // Prefill plan when modal opens
    useEffect(() => {
        if (orderModalOpen && pendingPlan) {
            const defaults = PLAN_DEFAULTS[pendingPlan] || PLAN_DEFAULTS.basic;
            setForm(prev => ({
                ...INITIAL_FORM,
                plan: pendingPlan,
                budget: defaults.budget,
                pages: defaults.pages,
                contactEmail: user?.email || '',
            }));
            setStep(0);
            setErrors({});
            setDone(false);
        }
    }, [orderModalOpen, pendingPlan, user]);

    // Scroll to top on step change
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const set = (k) => (e) => {
        setForm(prev => ({ ...prev, [k]: e.target.value }));
        if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }));
    };

    const toggleFeature = (f) => {
        setForm(prev => ({
            ...prev,
            features: prev.features.includes(f)
                ? prev.features.filter(x => x !== f)
                : [...prev.features, f],
        }));
    };

    // ── Step validation ──────────────────────────────────
    const validateStep = () => {
        const errs = {};
        if (step === 0) {
            if (!form.projectName.trim()) errs.projectName = 'Project name is required';
            if (!form.websiteType) errs.websiteType = 'Please select a website type';
            if (!form.pages || form.pages < 1) errs.pages = 'Enter at least 1 page';
            if (!form.businessCategory.trim()) errs.businessCategory = 'Business category is required';
        }
        if (step === 2) {
            if (!form.description.trim() || form.description.trim().length < 20)
                errs.description = 'Please describe your project (at least 20 characters)';
            if (!form.contactEmail.trim() || !/\S+@\S+\.\S+/.test(form.contactEmail))
                errs.contactEmail = 'Valid email is required';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const nextStep = () => {
        if (!validateStep()) return;
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setSubmitting(true);
        try {
            const data = await createOrder(form).unwrap();
            addCartItem(data);
            setDone(true);
            toast.success('Order created successfully. Please proceed to payment from the cart.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewCart = () => {
        closeOrderModal();
        setTimeout(() => openCart(), 320);
    };

    if (!orderModalOpen) return null;

    return (
        <AnimatePresence>
            {orderModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="order-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeOrderModal}
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        key="order-modal"
                        initial={{ opacity: 0, scale: 0.94, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 24 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
                                style={{ borderColor: 'var(--border)' }}>
                                <div>
                                    <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
                                        {done ? '🎉 Order Created!' : 'Create Your Project Order'}
                                    </h2>
                                    {!done && (
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                            {PLAN_DEFAULTS[form.plan]?.label}
                                        </p>
                                    )}
                                </div>
                                <button onClick={closeOrderModal}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-red-50 dark:hover:bg-red-500/10">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Progress */}
                            {!done && (
                                <div className="px-6 pt-4 pb-3 flex-shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        {STEPS.map((s, i) => (
                                            <div key={s} className="flex items-center gap-1.5 flex-1 last:flex-none">
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${i < step ? 'bg-emerald-500 text-white'
                                                        : i === step ? 'bg-red-600 text-white'
                                                            : 'text-slate-400 border'}`}
                                                    style={i > step ? { borderColor: 'var(--border)' } : {}}>
                                                    {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                                                </div>
                                                <span className={`text-xs font-semibold hidden sm:block ${i === step ? 'text-red-600 dark:text-red-400' : 'text-slate-400'
                                                    }`}>{s}</span>
                                                {i < STEPS.length - 1 && (
                                                    <div className="flex-1 h-px mx-1" style={{ background: i < step ? '#10b981' : 'var(--border)' }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Body */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

                                {/* ── SUCCESS ── */}
                                {done && (
                                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center text-center py-8 gap-5">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center"
                                            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                                                Order Placed Successfully!
                                            </h3>
                                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                                Your project <strong style={{ color: 'var(--text-primary)' }}>{form.projectName}</strong> has been added to your cart.
                                                Order created successfully. Please proceed to payment from the cart.
                                            </p>
                                        </div>
                                        <div className="flex gap-3 pt-2 flex-wrap justify-center">
                                            <button onClick={handleViewCart}
                                                className="primary-btn px-6 py-3 rounded-xl font-bold text-sm">
                                                View Cart & Pay
                                            </button>
                                            <button onClick={closeOrderModal}
                                                className="secondary-btn px-6 py-3 rounded-xl font-bold text-sm">
                                                Continue Browsing
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── STEP 0: Project Info ── */}
                                {!done && step === 0 && (
                                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                        <FormField label="Project Name" required error={errors.projectName}>
                                            <input
                                                className={fieldClasses(errors.projectName)}
                                                style={inputStyle(errors.projectName)}
                                                placeholder="e.g. My Business Website"
                                                value={form.projectName}
                                                onChange={set('projectName')}
                                            />
                                        </FormField>

                                        <FormField label="Plan" required>
                                            <select className={fieldClasses(false)} style={inputStyle(false)}
                                                value={form.plan}
                                                onChange={(e) => {
                                                    const p = e.target.value;
                                                    const d = PLAN_DEFAULTS[p];
                                                    setForm(prev => ({ ...prev, plan: p, budget: d.budget, pages: d.pages }));
                                                }}>
                                                {Object.entries(PLAN_DEFAULTS).map(([k, v]) => (
                                                    <option key={k} value={k}>{v.label}</option>
                                                ))}
                                            </select>
                                        </FormField>

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField label="Website Type" required error={errors.websiteType}>
                                                <select className={fieldClasses(errors.websiteType)} style={inputStyle(errors.websiteType)}
                                                    value={form.websiteType} onChange={set('websiteType')}>
                                                    <option value="">Select type</option>
                                                    {WEBSITE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </FormField>
                                            <FormField label="Number of Pages" required error={errors.pages}>
                                                <input type="number" min="1" max="100"
                                                    className={fieldClasses(errors.pages)}
                                                    style={inputStyle(errors.pages)}
                                                    value={form.pages}
                                                    onChange={(e) => { setForm(p => ({ ...p, pages: parseInt(e.target.value) || 1 })); if (errors.pages) setErrors(p => ({ ...p, pages: '' })); }}
                                                />
                                            </FormField>
                                        </div>

                                        <FormField label="Business Category / Industry" required error={errors.businessCategory}>
                                            <input
                                                className={fieldClasses(errors.businessCategory)}
                                                style={inputStyle(errors.businessCategory)}
                                                placeholder="e.g. Retail, Healthcare, Technology..."
                                                value={form.businessCategory}
                                                onChange={set('businessCategory')}
                                            />
                                        </FormField>

                                        <FormField label="Design Style Preference">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {DESIGN_STYLES.map(style => (
                                                    <button key={style} type="button"
                                                        onClick={() => setForm(p => ({ ...p, designStyle: style === p.designStyle ? '' : style }))}
                                                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${form.designStyle === style
                                                                ? 'bg-red-600 text-white'
                                                                : 'hover:border-red-300'
                                                            }`}
                                                        style={form.designStyle !== style ? { background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-secondary)' } : {}}>
                                                        {style}
                                                    </button>
                                                ))}
                                            </div>
                                        </FormField>
                                    </motion.div>
                                )}

                                {/* ── STEP 1: Features ── */}
                                {!done && step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                        <FormField label="Required Features" hint="Select all that apply to your project">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {FEATURE_OPTIONS.map(f => (
                                                    <label key={f} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all select-none ${form.features.includes(f) ? 'bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30' : ''
                                                        }`}
                                                        style={!form.features.includes(f) ? { background: 'var(--bg-card-inner)', border: '1px solid var(--border)' } : {}}>
                                                        <input type="checkbox" className="sr-only" checked={form.features.includes(f)} onChange={() => toggleFeature(f)} />
                                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${form.features.includes(f) ? 'bg-red-600 border-red-600' : 'border-slate-400'
                                                            }`}>
                                                            {form.features.includes(f) && <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} />}
                                                        </div>
                                                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </FormField>

                                        <FormField label="Preferred Deadline">
                                            <input type="date"
                                                className={fieldClasses(false)}
                                                style={inputStyle(false)}
                                                value={form.preferredDeadline}
                                                onChange={set('preferredDeadline')}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </FormField>

                                        <FormField label="Delivery Speed">
                                            <div className="flex gap-3 flex-wrap">
                                                {[
                                                    { value: 'normal', label: 'Standard', note: 'Included' },
                                                    { value: 'fast', label: '2× Faster', note: '+1,500 SAR' },
                                                    { value: 'urgent', label: '3× Urgent', note: '+3,000 SAR' },
                                                ].map(opt => (
                                                    <button key={opt.value} type="button"
                                                        onClick={() => setForm(p => ({ ...p, deliveryOption: opt.value }))}
                                                        className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl text-sm font-bold transition-all ${form.deliveryOption === opt.value ? 'bg-red-600 text-white' : 'hover:border-red-300'
                                                            }`}
                                                        style={form.deliveryOption !== opt.value ? { background: 'var(--bg-card-inner)', border: '1px solid var(--border)', color: 'var(--text-secondary)' } : {}}>
                                                        <div>{opt.label}</div>
                                                        <div className={`text-[11px] font-medium mt-0.5 ${form.deliveryOption === opt.value ? 'text-red-100' : 'text-slate-400'}`}>{opt.note}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </FormField>
                                    </motion.div>
                                )}

                                {/* ── STEP 2: Description ── */}
                                {!done && step === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                        <FormField label="Project Description" required error={errors.description}
                                            hint="Explain what the website is about, your goals, and any important requirements.">
                                            <textarea rows={5}
                                                className={fieldClasses(errors.description)}
                                                style={inputStyle(errors.description)}
                                                placeholder="Tell us about your business, what the website should do, who the target audience is, and any specific requirements you have..."
                                                value={form.description}
                                                onChange={set('description')}
                                            />
                                        </FormField>

                                        <FormField label="Reference Websites / Inspiration Links"
                                            hint="Share URLs of websites you like the look or functionality of (optional)">
                                            <textarea rows={3}
                                                className={fieldClasses(false)}
                                                style={inputStyle(false)}
                                                placeholder="https://example.com, https://another.com..."
                                                value={form.referenceWebsites}
                                                onChange={set('referenceWebsites')}
                                            />
                                        </FormField>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField label="Contact Email" required error={errors.contactEmail}>
                                                <input type="email"
                                                    className={fieldClasses(errors.contactEmail)}
                                                    style={inputStyle(errors.contactEmail)}
                                                    placeholder="your@email.com"
                                                    value={form.contactEmail}
                                                    onChange={set('contactEmail')}
                                                />
                                            </FormField>
                                            <FormField label="Phone Number (Optional)">
                                                <input type="tel"
                                                    className={fieldClasses(false)}
                                                    style={inputStyle(false)}
                                                    placeholder="+966 50 000 0000"
                                                    value={form.phoneNumber}
                                                    onChange={set('phoneNumber')}
                                                />
                                            </FormField>
                                        </div>

                                        {/* File upload hint */}
                                        <div className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:border-red-300 transition-colors"
                                            style={{ background: 'var(--bg-card-inner)', border: '1px dashed var(--border-strong)' }}
                                            onClick={() => fileRef.current?.click()}>
                                            <Upload className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Upload Reference Files (Optional)</p>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Logos, wireframes, brand guidelines — PNG, JPG, PDF</p>
                                            </div>
                                            <input ref={fileRef} type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf" multiple />
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── STEP 3: Confirm ── */}
                                {!done && step === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                        <div className="rounded-2xl p-5 space-y-3"
                                            style={{ background: 'var(--bg-card-inner)', border: '1px solid var(--border)' }}>
                                            <h4 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Order Summary</h4>
                                            {[
                                                ['Project', form.projectName],
                                                ['Plan', PLAN_DEFAULTS[form.plan]?.label],
                                                ['Website Type', form.websiteType],
                                                ['Pages', form.pages],
                                                ['Category', form.businessCategory],
                                                ['Design Style', form.designStyle || 'Not specified'],
                                                ['Delivery', form.deliveryOption],
                                                ['Deadline', form.preferredDeadline || 'Flexible'],
                                                ['Features', form.features.length > 0 ? form.features.join(', ') : 'None selected'],
                                            ].map(([k, v]) => (
                                                <div key={k} className="flex justify-between items-start text-sm gap-4">
                                                    <span className="font-semibold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{k}</span>
                                                    <span className="font-bold text-right" style={{ color: 'var(--text-primary)' }}>{v}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center p-5 rounded-2xl"
                                            style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.02))', border: '1px solid rgba(220,38,38,0.2)' }}>
                                            <span className="font-extrabold text-sm uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Estimated Total</span>
                                            <span className="text-2xl font-black gradient-text">
                                                {form.budget > 0 ? `SAR ${form.budget.toLocaleString()}` : 'Custom Quote'}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 rounded-xl"
                                            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                                            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                                After submission, your order will be added to cart. You can then proceed to payment. Final pricing may be adjusted based on your specific requirements.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            {!done && (
                                <div className="flex gap-3 px-6 py-4 border-t flex-shrink-0"
                                    style={{ borderColor: 'var(--border)' }}>
                                    {step > 0 && (
                                        <button onClick={prevStep}
                                            className="secondary-btn px-5 py-3 rounded-xl font-bold text-sm">
                                            ← Back
                                        </button>
                                    )}
                                    <div className="flex-1" />
                                    {step < STEPS.length - 1 ? (
                                        <button onClick={nextStep}
                                            className="primary-btn px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
                                            Next <ChevronRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button onClick={handleSubmit} disabled={submitting}
                                            className="primary-btn px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Create Order & Add to Cart'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ── Helpers ──────────────────────────────────────────────
const FormField = ({ label, required, error, hint, children }) => (
    <div>
        <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
        {children}
        <AnimatePresence>
            {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
);

export default OrderModal;
