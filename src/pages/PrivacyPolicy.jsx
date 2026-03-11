import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{children}</div>
    </div>
);

const PrivacyPolicy = () => (
    <div className="pt-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>

        {/* Hero */}
        <div className="section-surface section-sep py-20 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(220,38,38,0.05) 0%, transparent 70%)' }} />
            <div className="relative z-10 max-w-2xl mx-auto px-4">
                <span className="badge-red mb-4">Legal</span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: March 2025</p>
            </div>
        </div>

        <section className="py-20 section-light section-sep">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="card p-8 sm:p-12">

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-10">
                        At WebDevPro, we are committed to protecting your personal information and your right to privacy. This policy describes how we collect, use, and protect the information you provide when using our website and services.
                    </p>

                    <Section title="1. Information We Collect">
                        <p>We collect information you voluntarily provide when registering, placing orders, or contacting us. This includes:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Full name, email address, and phone number</li>
                            <li>Country of residence</li>
                            <li>Project requirements and messages</li>
                            <li>Payment information (processed securely via Razorpay or Stripe — we do not store card details)</li>
                        </ul>
                        <p>We also automatically collect technical data such as IP address, browser type, and pages visited for analytics purposes.</p>
                    </Section>

                    <Section title="2. How We Use Your Information">
                        <p>Your information is used to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Create and manage your account</li>
                            <li>Process orders and deliver services</li>
                            <li>Send you project updates and receipts</li>
                            <li>Respond to inquiries and support requests</li>
                            <li>Improve our website and services</li>
                        </ul>
                        <p>We do not sell, rent, or trade your personal data to third parties.</p>
                    </Section>

                    <Section title="3. Data Security">
                        <p>We implement industry-standard security measures including HTTPS encryption, secure password hashing, and regular security audits. All payment processing is handled by certified third-party providers (Stripe/Razorpay).</p>
                    </Section>

                    <Section title="4. Cookies">
                        <p>We use essential cookies to keep you signed in and remember your preferences. We also use analytics cookies (Google Analytics) to understand how visitors use our site. You can disable cookies in your browser settings.</p>
                    </Section>

                    <Section title="5. Third-Party Services">
                        <p>We use trusted third-party services including: Stripe/Razorpay for payments, Google Analytics for website analytics, and Vercel/Render for hosting. Each of these services has their own privacy policies.</p>
                    </Section>

                    <Section title="6. Your Rights">
                        <p>You have the right to: access the data we hold about you, request correction of inaccurate data, request deletion of your account and data, and opt out of marketing communications at any time. Contact us at <a href="mailto:arvind889481@gmail.com" className="text-red-600 dark:text-red-400 hover:underline">arvind889481@gmail.com</a> to exercise your rights.</p>
                    </Section>

                    <Section title="7. Contact">
                        <p>If you have questions about this policy, please email us at <a href="mailto:arvind889481@gmail.com" className="text-red-600 dark:text-red-400 hover:underline">arvind889481@gmail.com</a>.</p>
                    </Section>
                </div>
            </motion.div>
        </section>
    </div>
);

export default PrivacyPolicy;
