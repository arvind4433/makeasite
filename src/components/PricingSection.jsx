import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import { PRICING_SLIDER_CARDS, formatInr } from '../config/pricing';

const handleOrderStart = (user, openOrderModal, setPendingPlan, preset) => {
  if (user) {
    openOrderModal(preset);
    return;
  }

  setPendingPlan(preset);
  window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { context: 'plan' } }));
};

const PricingSection = () => {
  const { user } = useContext(AuthContext);
  const { openOrderModal, setPendingPlan } = useContext(OrderContext);
  const [page, setPage] = useState(0);

  const maxPage = Math.max(0, Math.ceil(PRICING_SLIDER_CARDS.length / 3) - 1);
  const visibleCards = useMemo(
    () => PRICING_SLIDER_CARDS.slice(page * 3, page * 3 + 3),
    [page]
  );

  return (
    <section id="pricing" className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: 'radial-gradient(circle at top, rgba(239,68,68,0.1), transparent 42%)' }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-10 max-w-3xl text-center">
          <span className="badge-red mb-4">Pricing</span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Six focused plans in a <span className="gradient-text">clean project slider</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Start with the first three plans, then move to the remaining three. Every card opens the matching order draft without changing your existing flow.
          </p>
        </motion.div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>
            {page === 0 ? 'Website Packages' : 'Dashboard Development'}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={page === 0}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              aria-label="Previous pricing cards"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {page + 1} / {maxPage + 1}
            </div>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(maxPage, current + 1))}
              disabled={page === maxPage}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              aria-label="Next pricing cards"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleCards.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.06 }}
              className={`rounded-[28px] border p-6 ${plan.popular ? 'ring-2 ring-red-500/50' : ''}`}
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${plan.popular ? 'bg-red-600 text-white' : ''}`}
                  style={!plan.popular ? { background: 'var(--bg-card-inner)', color: 'var(--text-secondary)' } : {}}
                >
                  {plan.section}
                </span>
                {plan.popular ? <Sparkles className="h-4 w-4 text-red-500" /> : null}
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white">{plan.title}</h3>
              <p className="mt-3 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{plan.subtitle}</p>

              <div className="mt-6 border-y py-5" style={{ borderColor: 'var(--border)' }}>
                <div className="text-3xl font-black">{plan.rangeLabel || `${formatInr(plan.price)}+`}</div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
                  Connected to the same order logic
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleOrderStart(user, openOrderModal, setPendingPlan, plan.preset)}
                className="primary-btn mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold"
              >
                Select Plan <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
