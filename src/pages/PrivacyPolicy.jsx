import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{children}</div>
  </section>
);

const PrivacyPolicy = () => (
  <div className="pt-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>
    <div className="section-surface section-sep relative overflow-hidden py-20 text-center">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(220,38,38,0.05) 0%, transparent 70%)' }} />
      <div className="relative z-10 mx-auto max-w-2xl px-4">
        <span className="badge-red mb-4">Legal</span>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Privacy Policy</h1>
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
            This Privacy Policy explains how MakeASite collects, uses, stores, and protects information when users browse the website, create an account, communicate with us, or place an order for website development or related digital services.
          </p>

          <Section title="1. Information We Collect">
            <p>We may collect the following information when you use the platform:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Name, email address, and phone number</li>
              <li>Order details, selected package or plan, requested features, notes, and project requirements</li>
              <li>Messages exchanged through the platform</li>
              <li>Uploaded files such as profile images, reference images, or project documents</li>
              <li>Technical information such as IP address, browser details, login activity, and device data for security and service improvement</li>
            </ul>
          </Section>

          <Section title="2. How We Use Information">
            <p>Collected information is used to operate and improve the service, including:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Communicating with users about orders, revisions, support, verification, or service updates</li>
              <li>Planning, developing, and delivering the website or digital product requested by the user</li>
              <li>Managing authentication, account security, and login verification</li>
              <li>Processing payments through supported payment providers</li>
              <li>Maintaining records of selected plans, features, and project scope</li>
            </ul>
          </Section>

          <Section title="3. Data Sharing and Third Parties">
            <p>We do not sell user data and we do not share personal information with third parties for advertising resale purposes.</p>
            <p>Information may be shared only where necessary to complete services properly, such as payment processing, email delivery, hosting, file storage, analytics, or legal compliance.</p>
          </Section>

          <Section title="4. Service Scope and Package Responsibility">
            <p>The platform provides development services based on the selected package, pricing plan, or approved custom quote chosen by the user.</p>
            <p>If a user purchases a basic or lower-tier package and later requests higher-tier features, advanced integrations, larger-scale workflows, or additional pages beyond the original agreement, those items are not included automatically and may require additional payment.</p>
            <p>The website owner will make reasonable and professional efforts to complete all work promised in the agreed package, but is not responsible for demands outside the confirmed scope unless both parties agree to updated pricing and deliverables.</p>
          </Section>

          <Section title="5. Reasonable Effort and Platform Misuse">
            <p>MakeASite is a service platform for development work, not a guarantee of unlimited revisions, unlimited features, or unrealistic outcomes beyond the purchased service.</p>
            <p>Reasonable effort will always be made to deliver the agreed work professionally and in good faith. However, misuse of the platform, unclear or fraudulent requests, or expectations beyond the purchased service are not the responsibility of the website owner.</p>
          </Section>

          <Section title="6. Storage and Security">
            <p>We use reasonable administrative and technical safeguards to protect stored information, including authentication controls, secure password handling, and controlled backend access. No internet-based system can guarantee absolute security, but we take practical steps to reduce risk and protect project data.</p>
          </Section>

          <Section title="7. User Rights and Corrections">
            <p>Users may request corrections to account information or contact us about privacy concerns related to data used for service delivery. Requests may be limited where retention is necessary for payment records, legal compliance, fraud prevention, or active service obligations.</p>
          </Section>

          <Section title="8. Contact">
            <p>For privacy-related questions, please contact the website owner through the official contact methods provided on the platform.</p>
          </Section>
        </div>
      </motion.div>
    </section>
  </div>
);

export default PrivacyPolicy;
