import { motion } from 'framer-motion';
import { Users, Code2, Target, Award, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'WebDevPro';

const values = [
    { icon: Code2, title: 'Clean Code', desc: 'We write well-structured, maintainable code — following best practices and modern standards on every project.' },
    { icon: Target, title: 'Results-Driven', desc: 'Every decision we make is focused on helping your business grow — more traffic, more leads, more conversions.' },
    { icon: Zap, title: 'Fast Delivery', desc: 'We move quickly without cutting corners. Most websites are delivered on time or ahead of schedule.' },
    { icon: Heart, title: 'Client-First', desc: 'Your satisfaction is our priority. We communicate openly, respond fast, and iterate until you\'re thrilled.' },
    { icon: Award, title: 'Premium Quality', desc: 'We hold ourselves to a high standard — every project we ship looks and performs like a premium product.' },
    { icon: Users, title: 'Long-Term Support', desc: 'We don\'t disappear after delivery. We offer ongoing support, maintenance, and feature additions as you scale.' },
];

const stats = [
    { value: '120+', label: 'Projects Delivered' },
    { value: '80+', label: 'Happy Clients' },
    { value: '5+', label: 'Years Experience' },
    { value: '98%', label: 'Satisfaction Rate' },
];

const PageHeader = ({ badge, title, subtitle }) => (
    <div className="relative py-24 sm:py-32 text-center overflow-hidden section-surface section-sep">
        <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(220,38,38,0.06) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
            <span className="badge-red mb-4">{badge}</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5">{title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{subtitle}</p>
        </div>
    </div>
);

const AboutPage = () => (
    <div className="pt-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>

        <PageHeader
            badge="About Us"
            title={<>We build websites that <span className="gradient-text">grow businesses</span></>}
            subtitle={`${APP_NAME} is a professional web development service specialising in high-performance, modern websites and web applications for businesses worldwide.`}
        />

        {/* Story */}
        <section className="py-20 section-light section-sep">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <span className="badge-red mb-4">Our Story</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                            Started with a mission to make{' '}
                            <span className="gradient-text">premium web development</span> accessible
                        </h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                            <p>
                                {APP_NAME} was founded with a simple belief: every great business deserves a great website — one that looks professional, loads fast, and converts visitors into customers.
                            </p>
                            <p>
                                We noticed that most small and growing businesses either couldn't afford premium web development or were forced to settle for low-quality templates that didn't represent their brand.
                            </p>
                            <p>
                                So we built a service that delivers <strong className="text-slate-800 dark:text-slate-200">enterprise-grade quality</strong> at prices that work for real businesses — starting from just ₹3,000.
                            </p>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link to="/pricing" className="primary-btn px-7 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2">
                                View Pricing
                            </Link>
                            <Link to="/contact" className="secondary-btn px-7 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                                Get in Touch
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid grid-cols-2 gap-5">
                        {stats.map((s) => (
                            <div key={s.label} className="card p-7 text-center">
                                <div className="text-4xl font-black gradient-text mb-2">{s.value}</div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Values */}
        <section className="py-20 section-surface section-sep">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="badge-red mb-4">Our Values</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        What drives everything we do
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((v, i) => (
                        <motion.div key={v.title}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                            className="card p-7 group">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                                style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
                                <v.icon className="w-5 h-5 text-red-600 dark:text-red-400" strokeWidth={2} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{v.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="py-20 section-light section-sep">
            <div className="mx-auto max-w-3xl px-4 text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                    Ready to work together?
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Let's build something great. View our pricing or send us a message.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/pricing" className="primary-btn px-8 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2">Order a Website</Link>
                    <Link to="/contact" className="secondary-btn px-8 py-3.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2">Contact Us</Link>
                </div>
            </div>
        </section>

    </div>
);

export default AboutPage;
