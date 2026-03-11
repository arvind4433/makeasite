import { motion } from 'framer-motion';
import { Globe, LayoutDashboard, ShoppingCart, Paintbrush, Bug, Gauge, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
    { icon: Globe, title: 'Website Development', desc: 'Custom-built, responsive websites tailored to your brand — from informational sites to full-stack web apps.' },
    { icon: LayoutDashboard, title: 'Admin Dashboard Systems', desc: 'Powerful backend dashboards to manage users, orders, content, and analytics in real time.' },
    { icon: ShoppingCart, title: 'E-Commerce Stores', desc: 'Full-featured online stores with Stripe & Razorpay, product management, and optimized checkout.' },
    { icon: Paintbrush, title: 'UI/UX Design & Redesign', desc: 'Transform outdated websites into modern, high-converting interfaces with professional design principles.' },
    { icon: Bug, title: 'Bug Fixing & Support', desc: 'Rapid debugging, security patching, and ongoing technical support to keep your site running flawlessly.' },
    { icon: Gauge, title: 'Performance Optimization', desc: 'Sub-2-second load times with code splitting, asset optimization, and advanced caching strategies.' },
];

const ServicesSection = () => (
    <section id="services" className="py-24 sm:py-32 section-surface section-sep relative overflow-hidden transition-colors duration-300">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                <span className="badge-red mb-4">Our Services</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                    Everything your business needs
                    <br />
                    <span className="gradient-text">online, done right</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Comprehensive web development services — from concept to deployment, built with clean code and your goals in mind.
                </p>
            </motion.div>

            <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s, i) => (
                    <motion.div key={i}
                        variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                        className="card group p-7 flex flex-col cursor-pointer">

                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
                            <s.icon className="w-5 h-5 text-red-600 dark:text-red-400" strokeWidth={2} />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                            {s.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                            {s.desc}
                        </p>

                        <Link to="/contact"
                            className="inline-flex items-center text-sm font-semibold text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0">
                            Get Quote <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center mt-14">
                <Link to="/pricing" className="primary-btn px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 group">
                    View Pricing Plans <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        </div>
    </section>
);

export default ServicesSection;
