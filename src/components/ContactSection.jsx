import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { apiClient } from '../config/api';

const projectTypes = ['Basic Website (₹3,000)', 'Standard Website (₹7,000)', 'Premium / Enterprise (₹50,000+)', 'Landing Page', 'E-Commerce Store', 'Admin Dashboard', 'Bug Fix / Support', 'Other / Custom'];
const budgets = ['Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000+'];

const contactInfo = [
    { icon: Mail, label: 'Email Us', value: 'arvind889481@gmail.com', href: 'mailto:arvind889481@gmail.com' },
    { icon: Phone, label: 'WhatsApp', value: '+91 8894810531', href: 'https://wa.me/918894810531' },
    { icon: MapPin, label: 'Location', value: 'India — Remote Worldwide', href: '#' },
];

const ContactSection = () => {
    const [form, setForm] = useState({ name: '', email: '', projectType: '', budget: '', message: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.projectType) e.projectType = 'Select a project type';
        if (!form.message.trim()) e.message = 'Message is required';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);

        const waText = encodeURIComponent(
            `*MakeASite Inquiry*\n\n*Name:* ${form.name.trim()}\n*Email:* ${form.email.trim()}\n*Project Type:* ${form.projectType}\n*Budget:* ${form.budget || 'Not specified'}\n\n*Project Details:*\n${form.message.trim()}`
        );
        const waUrl = `https://wa.me/918894810531?text=${waText}`;

        try {
            await apiClient.post('/contact', {
                name: form.name.trim(),
                email: form.email.trim(),
                projectType: form.projectType,
                budget: form.budget,
                message: form.message.trim()
            });
        } catch {
            // Even if backend fails, WhatsApp will deliver the message
        } finally {
            setLoading(false);
            setSubmitted(true);
            toast.success("Message sent! Opening WhatsApp chat with Arvind...");
            window.open(waUrl, '_blank');
        }
    };

    const inputClass = (id) =>
        `input-base ${errors[id] ? '!border-red-400 !ring-2 !ring-red-400/20 placeholder:text-red-400/50' : ''}`;

    return (
        <section id="contact" className="py-24 sm:py-32 section-surface section-sep relative overflow-hidden transition-colors duration-300">

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-16">
                    <span className="badge-red mb-4">Contact</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                        Ready to build{' '}
                        <span className="gradient-text">your website?</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Tell us about your project. We'll respond within 24 hours with a plan and quote.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">

                    {/* Left */}
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="lg:col-span-2 space-y-5">

                        {contactInfo.map(({ icon: Icon, label, value, href }) => (
                            <a key={label} href={href}
                                className="card flex items-start gap-4 p-5 hover:border-red-500/20 group">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                    style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
                                    <Icon className="w-4 h-4 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{label}</div>
                                    <div className="text-sm font-semibold text-slate-800 dark:text-white">{value}</div>
                                </div>
                            </a>
                        ))}

                        <div className="card p-6" style={{ borderColor: 'rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.03)' }}>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Ready to order now?</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Skip the form — go straight to ordering.</p>
                            <Link to="/pricing" className="primary-btn w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 group">
                                View Pricing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="card lg:col-span-3 p-8">

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                                    style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)' }}>
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                                    Your message has been emailed to Arvind (<span className="font-semibold text-slate-700 dark:text-slate-200">arvind889481@gmail.com</span>) and sent to WhatsApp.
                                </p>
                                <a
                                    href={`https://wa.me/918894810531?text=${encodeURIComponent(`Hello Arvind, I just submitted the contact form for ${form.projectType}.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-95 transition-opacity"
                                    style={{ background: '#25D366' }}
                                >
                                    <MessageCircle className="w-4 h-4" /> Open WhatsApp Chat (+91 8894810531)
                                </a>
                                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', projectType: '', budget: '', message: '' }); }}
                                    className="mt-6 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 transition-colors">
                                    Send another message →
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tell us about your project</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={`block text-sm font-semibold mb-2 ${errors.name ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>Full Name *</label>
                                        <input type="text" value={form.name} placeholder="John Doe"
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className={inputClass('name')} />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-semibold mb-2 ${errors.email ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>Email Address *</label>
                                        <input type="email" value={form.email} placeholder="you@company.com"
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className={inputClass('email')} />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${errors.projectType ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>Project Type *</label>
                                    <select value={form.projectType}
                                        onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                                        className={inputClass('projectType')}>
                                        <option value="">Select project type…</option>
                                        {projectTypes.map((t) => <option key={t}>{t}</option>)}
                                    </select>
                                    {errors.projectType && <p className="mt-1 text-xs text-red-500">{errors.projectType}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Budget (optional)</label>
                                    <select value={form.budget}
                                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                        className="input-base">
                                        <option value="">Select budget…</option>
                                        {budgets.map((b) => <option key={b}>{b}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${errors.message ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>Project Details *</label>
                                    <textarea rows={4} value={form.message}
                                        placeholder="Describe your project, features you need, timeline, etc."
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className={`${inputClass('message')} resize-none`} />
                                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                                </div>

                                <button type="submit" disabled={loading}
                                    className="primary-btn w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 group">
                                    {loading ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                                    ) : (
                                        <>Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
