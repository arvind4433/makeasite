import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion, Link } from 'lucide-react';

const faqs = [
    {
        q: 'How long does it take to build a website?',
        a: 'Timelines depend on the package and complexity. A Basic Website (1–3 pages) typically takes 3–7 days. Standard Websites take 1–2 weeks. Premium or Enterprise-level projects are discussed individually. You can also choose a 2× or 3× faster delivery option when placing your order.',
    },
    {
        q: 'What technologies do you use?',
        a: 'We specialise in the MERN stack — MongoDB, Express.js, React.js, and Node.js. We also work with Next.js, TypeScript, PostgreSQL, Firebase, Tailwind CSS, Stripe, Razorpay, and more. The technology chosen depends on your project requirements.',
    },
    {
        q: 'Can I request custom features?',
        a: 'Absolutely. If your requirements go beyond a standard package, we\'ll discuss the scope and provide a custom quote. Features like payment gateways, user login systems, admin dashboards, booking systems, and AI integrations can all be added.',
    },
    {
        q: 'Do you provide support after delivery?',
        a: 'Yes. Every project includes 14 days of free post-delivery support to fix bugs and make minor adjustments. For ongoing maintenance, feature additions, or long-term support, we offer flexible monthly packages.',
    },
    {
        q: 'How do I place an order?',
        a: 'Simply go to the Pricing section, choose a plan that suits you, and click "Get Started". You\'ll be taken to a registration and order form where you can fill in your project details, select features, and complete a secure payment via Razorpay or Stripe.',
    },
    {
        q: 'Is the source code included?',
        a: '100% yes. Once the full payment is made, you receive complete ownership of all source code, design assets, and deployment files. There are no ongoing licensing fees or lock-ins.',
    },
    {
        q: 'Do I need to host the website myself?',
        a: 'No — we handle deployment for you on platforms like Vercel, Render, or your preferred cloud provider. We can also help you set up a custom domain and SSL certificate as part of the delivery.',
    },
    {
        q: 'Can I see a demo before ordering?',
        a: 'Yes. Our Portfolio section showcases examples of the types of websites we build. You can also reach out via the Contact form to request a call or discuss your specific requirements before committing.',
    },
];

const FAQItem = ({ faq, isOpen, onToggle, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={`card overflow-hidden transition-all duration-200 ${isOpen ? 'ring-2 ring-red-500/20' : 'hover:border-red-400/20'}`}>

        <button
            onClick={onToggle}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            aria-expanded={isOpen}>

            <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${isOpen ? 'bg-red-600 text-white' : 'text-red-600 dark:text-red-400'}`}
                    style={!isOpen ? { background: 'var(--accent-light)', border: '1px solid var(--accent-border)' } : {}}>
                    <MessageCircleQuestion className="w-4 h-4" strokeWidth={2} />
                </div>
                <span className={`text-base font-semibold leading-snug transition-colors ${isOpen ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                    {faq.q}
                </span>
            </div>

            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen
                ? 'bg-red-600 border-red-600 text-white rotate-180'
                : 'border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400'
                }`}>
                <ChevronDown className="w-4 h-4" />
            </div>
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="px-6 pb-6 pt-0 pl-[4.25rem]">
                        <div className="h-px mb-4" style={{ background: 'var(--border)' }} />
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {faq.a}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="py-24 sm:py-32 section-light section-sep relative overflow-hidden transition-colors duration-300">

            <div className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-100"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(220,38,38,0.04) 0%, transparent 70%)' }} />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-14">
                    <span className="badge-red mb-4">FAQ</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                        Common questions{' '}
                        <span className="gradient-text">answered</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Everything you need to know before placing your order. Can't find an answer?{' '}
                        <a href="/contact" className="font-semibold text-red-600 dark:text-red-400 hover:underline">Reach out to us.</a>
                    </p>
                </motion.div>

                {/* Two-column layout on large screens */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {faqs.map((faq, i) => (
                        <FAQItem
                            key={i}
                            faq={faq}
                            index={i}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    ))}
                </div>

                {/* CTA */}
                <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center mt-14">
                    <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Still have a question?</p>
                    <a href="/contact"
                        className="primary-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm">
                        Contact Us
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
