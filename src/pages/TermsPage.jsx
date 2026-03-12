import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{children}</div>
    </div>
);

const TermsPage = () => (
    <div className="pt-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>

        <div className="section-surface section-sep py-20 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(220,38,38,0.05) 0%, transparent 70%)' }} />
            <div className="relative z-10 max-w-2xl mx-auto px-4">
                <span className="badge-red mb-4">Legal</span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">Terms of Service</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: March 2025</p>
            </div>
        </div>

        <section className="py-20 section-light section-sep">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="card p-8 sm:p-12">

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-10">
                        By placing an order or using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.
                    </p>

                    <Section title="1. Services">
                        <p>MakeASite provides custom website and web application development services. The specific deliverables, timeline, and price are agreed upon before work begins and documented in the order.</p>
                    </Section>

                    <Section title="2. Ordering & Payment">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>All orders must be placed through our platform with full payment at the time of ordering.</li>
                            <li>Payments are processed securely via Razorpay or Stripe.</li>
                            <li>Work begins only after payment is confirmed.</li>
                            <li>Prices displayed are in Indian Rupees (₹) unless otherwise stated.</li>
                        </ul>
                    </Section>

                    <Section title="3. Scope of Work">
                        <p>The scope of work is defined by the selected plan and any custom requirements discussed before ordering. Any features or pages requested beyond the agreed scope may incur additional charges, which will always be discussed and agreed upon before implementation.</p>
                    </Section>

                    <Section title="4. Revisions">
                        <p>Each plan includes a reasonable number of revisions as discussed during onboarding. Revisions must be requested within 14 days of delivery. Requests for changes to the original requirements may be treated as additional work.</p>
                    </Section>

                    <Section title="5. Intellectual Property">
                        <p>Upon full payment, you receive complete ownership of the custom source code, design assets, and all deliverables created for your project. We retain the right to display the work in our portfolio unless you request otherwise.</p>
                    </Section>

                    <Section title="6. Client Responsibilities">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide required content (text, images, logo) in a timely manner.</li>
                            <li>Provide timely feedback during development.</li>
                            <li>Ensure all content provided does not infringe on third-party rights.</li>
                        </ul>
                    </Section>

                    <Section title="7. Post-Delivery Support">
                        <p>We provide 14 days of free bug-fix support after delivery. This covers bugs in the code we wrote — not issues caused by client-side changes or third-party service problems.</p>
                    </Section>

                    <Section title="8. Limitation of Liability">
                        <p>MakeASite shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our liability is limited to the amount paid for the specific project.</p>
                    </Section>

                    <Section title="9. Governing Law">
                        <p>These terms are governed by the laws of India. Any disputes shall be resolved through good-faith negotiation first, and then through appropriate legal channels if necessary.</p>
                    </Section>

                    <Section title="10. Contact">
                        <p>For any questions, contact us at <a href="mailto:arvind889481@gmail.com" className="text-red-600 dark:text-red-400 hover:underline">arvind889481@gmail.com</a>.</p>
                    </Section>
                </div>
            </motion.div>
        </section>
    </div>
);

export default TermsPage;
