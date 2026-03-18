import { motion } from 'framer-motion';
import { MousePointerClick, CheckSquare, FileText, CreditCard, Code2, PackageCheck } from 'lucide-react';

const steps = [
    { id: 1, icon: MousePointerClick, title: 'Choose Plan', desc: 'Pick a website package that fits your budget and goals.' },
    { id: 2, icon: CheckSquare, title: 'Select Features', desc: 'Customize functionality — forms, dashboards, payments, and more.' },
    { id: 3, icon: FileText, title: 'Submit Details', desc: 'Tell us about your brand, content, style preferences, and deadline.' },
    { id: 4, icon: CreditCard, title: 'Secure Payment', desc: 'Pay safely via Razorpay or Stripe.' },
    { id: 5, icon: Code2, title: 'Development', desc: 'Our team builds your website — clean code, modern design, on time.' },
    { id: 6, icon: PackageCheck, title: 'Delivery', desc: 'Receive a fully deployed website ready for your visitors.' },
];

const HowItWorks = () => (
    <section id="how-it-works" className="py-24 sm:py-32 section-light section-sep relative overflow-hidden transition-colors duration-300">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                <span className="badge-red mb-4">How It Works</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                    From idea to{' '}
                    <span className="gradient-text">live website</span>
                    {' '}in 6 steps
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    A transparent process from plan selection to final deployment.
                </p>
            </motion.div>

            <div className="relative">
                {/* Connector */}
                <div className="hidden lg:block absolute top-10 left-[9.5%] right-[9.5%] h-px"
                    style={{ background: 'red' }} />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
                    {steps.map((step, i) => (
                        <motion.div key={step.id}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="relative flex flex-col items-center text-center group">

                            <div className="relative mb-6 z-10">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/[0.08] shadow-sm group-hover:border-red-500/30 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]">
                                    <step.icon className="w-7 h-7 text-red-500" strokeWidth={1.8} />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md"
                                    style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', border: '2px solid var(--bg-base)' }}>
                                    {step.id}
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed px-1">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default HowItWorks;
