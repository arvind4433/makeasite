import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const cases = [
    {
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bg: 'rgba(34,197,94,0.08)',
        border: 'rgba(34,197,94,0.2)',
        title: 'Eligible for Full Refund',
        items: [
            'We are unable to deliver the project within the agreed timeline (and you have not caused the delay).',
            'The final delivery significantly deviates from what was agreed in writing before work started.',
            'You cancel within 24 hours of payment and no work has begun.',
        ],
    },
    {
        icon: RefreshCw,
        color: 'text-yellow-500',
        bg: 'rgba(234,179,8,0.08)',
        border: 'rgba(234,179,8,0.2)',
        title: 'Eligible for Partial Refund',
        items: [
            'You cancel after work has partially begun — a refund will be issued for the unworked portion.',
            'Significant project scope changes that make completion impossible without additional cost.',
        ],
    },
    {
        icon: XCircle,
        color: 'text-red-500',
        bg: 'rgba(220,38,38,0.08)',
        border: 'rgba(220,38,38,0.2)',
        title: 'Not Eligible for Refund',
        items: [
            'Project has been fully delivered and accepted by the client.',
            'Client changes their mind about needing the website after substantial work is done.',
            'Delays caused by client failing to provide required content or feedback.',
            'Request for refund based on personal preference for a different design style (revisions are available).',
            'Third-party issues (hosting, domain registrars, payment gateways) outside our control.',
        ],
    },
];

const RefundPolicy = () => (
    <div className="pt-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>

        <div className="section-surface section-sep py-20 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(220,38,38,0.05) 0%, transparent 70%)' }} />
            <div className="relative z-10 max-w-2xl mx-auto px-4">
                <span className="badge-red mb-4">Legal</span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">Refund Policy</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: March 2025</p>
            </div>
        </div>

        <section className="py-20 section-light section-sep">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

                <div className="card p-6 sm:p-8 flex items-start gap-4 border-l-4 border-red-500">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        We take refund requests seriously and aim to resolve all disputes fairly. Please read this policy carefully before placing an order. By paying for our services, you agree to this refund policy.
                    </p>
                </div>

                {cases.map((c, i) => (
                    <motion.div key={c.title}
                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="card p-7">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                                <c.icon className={`w-5 h-5 ${c.color}`} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{c.title}</h2>
                        </div>
                        <ul className="space-y-3">
                            {c.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <c.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${c.color}`} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}

                <div className="card p-7">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">How to Request a Refund</h2>
                    <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                        {['Email us at arvind889481@gmail.com with your order ID and reason for the refund request within 30 days of payment.',
                            'We\'ll review your request within 3 business days and respond with our decision.',
                            'Approved refunds are processed within 7–10 business days, depending on your payment provider.',
                            'Refunds are returned to the original payment method.',
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                                    style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>{i + 1}</span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
            </motion.div>
        </section>
    </div>
);

export default RefundPolicy;
