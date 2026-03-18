import { useContext, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import { AUTH_OPTIONS, DELIVERY_OPTIONS, FEATURE_OPTIONS, calculateProjectPricing, formatInr } from '../config/pricing';

const CostCalculator = () => {
  const { user } = useContext(AuthContext);
  const { openOrderModal, setPendingPlan } = useContext(OrderContext);
  const [siteKind, setSiteKind] = useState('static');
  const [pages, setPages] = useState(8);
  const [authTier, setAuthTier] = useState('none');
  const [paymentIntegration, setPaymentIntegration] = useState(false);
  const [featureIds, setFeatureIds] = useState([]);
  const [deliveryOption, setDeliveryOption] = useState('normal');

  const pricing = useMemo(() => calculateProjectPricing({ siteKind, pages, authTier, paymentIntegration, featureIds, deliveryOption }), [siteKind, pages, authTier, paymentIntegration, featureIds, deliveryOption]);

  const toggleFeature = (id) => {
    setFeatureIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const handleStart = () => {
    const preset = {
      presetId: 'calculator',
      packageType: pricing.total >= 35000 ? 'custom' : pricing.total >= 10000 ? 'premium' : pricing.total >= 5000 ? 'standard' : 'basic',
      planName: 'Custom Quote',
      siteKind,
      pages,
      authTier,
      paymentIntegration,
      featureIds
    };

    if (user) {
      openOrderModal(preset);
      return;
    }

    setPendingPlan(preset);
    window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { context: 'plan' } }));
  };

  return (
    <section id="cost-calculator" className="relative overflow-hidden py-24 sm:py-28" style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg-card) 45%, white 55%), var(--bg-base))' }}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-3xl text-center">
          <span className="badge-red mb-4">Quick Estimate</span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">Estimate your project with the <span className="gradient-text">same live pricing engine</span></h2>
          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">Static pages are calculated at INR 200-250 each, dynamic pages start at INR 500 each, and auth/payment modules use the exact same values as the order form.</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="rounded-[30px] border p-6 sm:p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <button type="button" onClick={() => { setSiteKind('static'); setPages(Math.max(pages, 8)); setAuthTier('none'); setPaymentIntegration(false); }} className={`rounded-[22px] border px-5 py-4 text-left ${siteKind === 'static' ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}`} style={siteKind !== 'static' ? { background: 'var(--bg-card-inner)', borderColor: 'var(--border)' } : {}}><div className="font-bold">Static Website</div><div className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>INR 200-250 per page</div></button>
                <button type="button" onClick={() => { setSiteKind('dynamic'); setPages(Math.max(pages, 10)); setAuthTier(authTier === 'none' ? 'basic' : authTier); }} className={`rounded-[22px] border px-5 py-4 text-left ${siteKind === 'dynamic' ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}`} style={siteKind !== 'dynamic' ? { background: 'var(--bg-card-inner)', borderColor: 'var(--border)' } : {}}><div className="font-bold">Dynamic Website</div><div className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Minimum INR 500 per page</div></button>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between"><span className="text-sm font-bold">Pages</span><span className="text-sm font-bold">{pages}</span></div>
                <input type="range" min={1} max={40} value={pages} onChange={(event) => setPages(Number(event.target.value))} className="w-full accent-red-600" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm font-bold">Authentication</span><select value={authTier} onChange={(event) => setAuthTier(event.target.value)} className="w-full rounded-xl border px-4 py-3" style={{ background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}>{AUTH_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
                <label className="block space-y-2"><span className="text-sm font-bold">Delivery</span><select value={deliveryOption} onChange={(event) => setDeliveryOption(event.target.value)} className="w-full rounded-xl border px-4 py-3" style={{ background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}>{DELIVERY_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label} {item.extra ? `(+${formatInr(item.extra)})` : '(Included)'}</option>)}</select></label>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border px-4 py-4" style={{ background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}><input type="checkbox" checked={paymentIntegration} onChange={(event) => setPaymentIntegration(event.target.checked)} /><span className="text-sm font-semibold">Include payment gateway integration (INR 1,200)</span></label>

              <div>
                <div className="mb-3 text-sm font-bold">Additional features</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {FEATURE_OPTIONS.map((feature) => {
                    const active = featureIds.includes(feature.id);
                    return <button key={feature.id} type="button" onClick={() => toggleFeature(feature.id)} className={`rounded-2xl border px-4 py-4 text-left ${active ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}`} style={active ? {} : { background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}><div className="font-bold">{feature.label}</div><div className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatInr(feature.price)}</div></button>;
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border p-6 sm:p-8" style={{ background: 'linear-gradient(180deg, var(--bg-card), var(--bg-card-inner))', borderColor: 'var(--border)' }}>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}><Calculator className="h-3.5 w-3.5" /> Estimate Summary</div>
            <div className="mt-6 text-5xl font-black">{formatInr(pricing.total)}</div>
            <div className="mt-6 space-y-3">
              {pricing.breakdown.map((item) => <div key={item.key} className="flex items-start justify-between gap-3 text-sm"><span style={{ color: 'var(--text-secondary)' }}>{item.label}</span><span className="font-bold">{formatInr(item.amount)}</span></div>)}
            </div>
            <button type="button" onClick={handleStart} className="primary-btn mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold">Use This Estimate <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;
