import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{children}</div>
  </section>
);

const TermsPage = () => (
  <div className="pt-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>
    <div className="section-surface section-sep relative overflow-hidden py-20 text-center">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(220,38,38,0.05) 0%, transparent 70%)' }} />
      <div className="relative z-10 mx-auto max-w-2xl px-4">
        <span className="badge-red mb-4">Legal</span>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Terms of Use</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: March 18, 2026</p>
      </div>
    </div>

    <section className="section-light section-sep py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
      >
        <div className="card p-8 sm:p-12">
          <p className="mb-10 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            These Terms of Use govern access to and use of the MakeASite platform and services. By placing an order, creating an account, or using the platform, the user agrees to these terms.
          </p>

          <Section title="1. Accurate Information Requirement">
            <p>Users must provide correct and complete information when creating an account, requesting support, or placing an order. This includes contact details, project information, payment details where applicable, and any required documents or files.</p>
          </Section>

          <Section title="2. Service Delivery Based on Selected Package">
            <p>All services are delivered according to the selected pricing package, approved custom quote, and agreed project scope.</p>
            <p>If the user selects a lower package but later requests additional pages, advanced systems, premium features, or enterprise-level functionality, those items are outside the original agreement and may require extra charges before work continues.</p>
          </Section>

          <Section title="3. Additional Features and Extra Charges">
            <p>Features beyond the selected package or quote are not automatically included. The platform owner may provide an additional estimate, revised delivery timeline, or updated payment request before starting out-of-scope work.</p>
          </Section>

          <Section title="4. Acceptable Use and Fraud Prevention">
            <p>Users agree not to misuse the platform, submit fraudulent orders, impersonate another person, abuse communication tools, attempt unauthorized access, or use the service for unlawful purposes.</p>
          </Section>

          <Section title="5. Payments and Refund Position">
            <p>Payments are made for development services, planning, execution time, and related project work. If work has already started, payments may not always be fully refundable and refund decisions may depend on project progress, completed milestones, preparation work, and service time already invested.</p>
          </Section>

          <Section title="6. Scope Limits and Owner Rights">
            <p>The platform owner reserves the right to refuse, pause, or cancel service requests that violate policy, contain abusive or fraudulent behavior, request prohibited content, or become impractical due to non-cooperation, non-payment, or material changes in project scope.</p>
          </Section>

          <Section title="7. Reasonable Service Commitment">
            <p>The website owner will make reasonable and professional efforts to deliver the work promised in the selected package or custom agreement. However, the owner is not responsible for unrealistic expectations, third-party failures, or requests beyond the approved project scope unless a revised agreement is accepted.</p>
          </Section>

          <Section title="8. Non-Editable Order Understanding">
            <p>Order details, selected features, pricing breakdowns, and service scope are recorded to help confirm the agreed work. These records may be used to resolve misunderstandings about what was or was not included in the purchased package.</p>
          </Section>

          <Section title="9. Contact">
            <p>For questions about these Terms of Use, users should contact the platform owner through the website contact channels.</p>
          </Section>
        </div>
      </motion.div>
    </section>
  </div>
);

export default TermsPage;
