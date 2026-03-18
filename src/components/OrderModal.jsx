import { useState, useEffect, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import { toast } from 'sonner';
import { useCreateOrderMutation } from '../services/orderApi.js';
import {
  AUTH_OPTIONS,
  DELIVERY_OPTIONS,
  DESIGN_STYLES,
  FEATURE_OPTIONS,
  WEBSITE_TYPES,
  calculateProjectPricing,
  createOrderDraftFromPreset,
  formatInr
} from '../config/pricing';

const INITIAL_FORM = {
  title: '',
  description: '',
  websiteType: '',
  businessCategory: '',
  designStyle: '',
  referenceWebsites: '',
  contactEmail: '',
  phoneNumber: '',
  preferredDeadline: '',
  siteKind: 'static',
  pages: 1,
  authTier: 'none',
  paymentIntegration: false,
  featureIds: [],
  deliveryOption: 'normal',
  packageType: 'basic',
  planName: 'Static Website',
  presetId: 'static',
  acceptedLegal: false
};

const STEPS = ['Project', 'Features', 'Notes', 'Confirm'];

const fieldClasses = (error) => `w-full rounded-xl px-4 py-3 text-sm outline-none ${error ? 'border-2 border-red-500' : 'border'}`;
const inputStyle = (error) => ({
  background: 'var(--bg-card-inner)',
  borderColor: error ? '#ef4444' : 'var(--border)',
  color: 'var(--text-primary)'
});

const OrderModal = () => {
  const { user } = useContext(AuthContext);
  const { orderModalOpen, closeOrderModal, pendingPlan, addCartItem, openCart } = useContext(OrderContext);
  const [createOrder] = useCreateOrderMutation();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!orderModalOpen) return;
    const draft = createOrderDraftFromPreset(pendingPlan || 'static');
    setForm({
      ...INITIAL_FORM,
      title: draft.planName,
      websiteType: 'Business Website',
      contactEmail: user?.email || '',
      phoneNumber: user?.phone || '',
      packageType: draft.plan,
      planName: draft.planName,
      presetId: draft.presetId,
      siteKind: draft.siteKind,
      pages: draft.pages,
      authTier: draft.authTier,
      paymentIntegration: draft.paymentIntegration,
      featureIds: draft.featureIds
    });
    setStep(0);
    setErrors({});
    setDone(false);
  }, [orderModalOpen, pendingPlan, user]);

  const pricing = useMemo(() => calculateProjectPricing({
    siteKind: form.siteKind,
    pages: form.pages,
    authTier: form.authTier,
    paymentIntegration: form.paymentIntegration,
    featureIds: form.featureIds,
    deliveryOption: form.deliveryOption
  }), [form]);

  useEffect(() => {
    setForm((current) => ({ ...current, packageType: pricing.total >= 35000 ? 'custom' : pricing.total >= 10000 ? 'premium' : pricing.total >= 5000 ? 'standard' : 'basic' }));
  }, [pricing.total]);

  const setField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: '' }));
  };

  const toggleFeature = (id) => {
    setForm((current) => ({
      ...current,
      featureIds: current.featureIds.includes(id)
        ? current.featureIds.filter((item) => item !== id)
        : [...current.featureIds, id]
    }));
  };

  const validateStep = () => {
    const nextErrors = {};
    if (step === 0) {
      if (!form.title.trim()) nextErrors.title = 'Project title is required';
      if (!form.websiteType) nextErrors.websiteType = 'Please select a website type';
      if (!form.businessCategory.trim()) nextErrors.businessCategory = 'Business category is required';
      if (!form.pages || form.pages < 1) nextErrors.pages = 'At least one page is required';
    }
    if (step === 2) {
      if (!form.description.trim() || form.description.trim().length < 20) nextErrors.description = 'Please add at least 20 characters';
      if (!form.contactEmail.trim()) nextErrors.contactEmail = 'Contact email is required';
    }
    if (step === 3 && !form.acceptedLegal) {
      nextErrors.acceptedLegal = 'You must agree to the Privacy Policy and Terms of Use';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((current) => current + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (!user?.emailVerified || !user?.phoneVerified) {
      toast.error('Please verify your email and phone in your profile before creating an order.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        packageType: form.packageType,
        presetId: form.presetId,
        planName: form.planName,
        siteKind: form.siteKind,
        websiteType: form.websiteType,
        pages: form.pages,
        businessCategory: form.businessCategory,
        designStyle: form.designStyle,
        authTier: form.authTier,
        paymentIntegration: form.paymentIntegration,
        featureIds: form.featureIds,
        deliveryOption: form.deliveryOption,
        referenceWebsites: form.referenceWebsites,
        contactEmail: form.contactEmail,
        phoneNumber: form.phoneNumber,
        deadline: form.preferredDeadline || null
      };

      const order = await createOrder(payload).unwrap();
      addCartItem(order);
      setDone(true);
      toast.success('Order created successfully. Please continue to payment from the cart.');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" onClick={closeOrderModal} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }} className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-strong)' }}>
          <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>{done ? 'Order Created' : 'Create Your Project Order'}</h2>
              {!done ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>{form.planName}</p> : null}
            </div>
            <button type="button" onClick={closeOrderModal} className="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/5"><X size={18} /></button>
          </div>

          {!done ? (
            <div className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                {STEPS.map((item, index) => (
                  <div key={item} className="flex flex-1 items-center gap-2 last:flex-none">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${index <= step ? 'bg-red-600 text-white' : 'text-slate-400'}`} style={index > step ? { border: '1px solid var(--border)' } : {}}>{index + 1}</div>
                    <span className="hidden text-xs font-semibold sm:block" style={{ color: index === step ? 'var(--text-primary)' : 'var(--text-muted)' }}>{item}</span>
                    {index < STEPS.length - 1 ? <div className="h-px flex-1" style={{ background: index < step ? '#dc2626' : 'var(--border)' }} /> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="max-h-[calc(92vh-132px)] overflow-y-auto px-6 py-6">
            {done ? (
              <div className="flex flex-col items-center justify-center gap-5 py-10 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.24)' }}>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Order placed successfully</h3>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Your configured project has been added to your orders and cart.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={() => { closeOrderModal(); setTimeout(() => openCart(), 300); }} className="primary-btn rounded-2xl px-6 py-3 text-sm font-bold">View Cart & Pay</button>
                  <button type="button" onClick={closeOrderModal} className="secondary-btn rounded-2xl px-6 py-3 text-sm font-bold">Close</button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
                <div className="space-y-5">
                  {step === 0 ? (
                    <>
                      <label className="block space-y-2"><span className="text-sm font-bold">Project title</span><input value={form.title} onChange={setField('title')} className={fieldClasses(errors.title)} style={inputStyle(errors.title)} /></label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block space-y-2"><span className="text-sm font-bold">Website type</span><select value={form.websiteType} onChange={setField('websiteType')} className={fieldClasses(errors.websiteType)} style={inputStyle(errors.websiteType)}><option value="">Select type</option>{WEBSITE_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                        <label className="block space-y-2"><span className="text-sm font-bold">Pages</span><input type="number" min="1" value={form.pages} onChange={setField('pages')} className={fieldClasses(errors.pages)} style={inputStyle(errors.pages)} /></label>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block space-y-2"><span className="text-sm font-bold">Project category</span><input value={form.businessCategory} onChange={setField('businessCategory')} className={fieldClasses(errors.businessCategory)} style={inputStyle(errors.businessCategory)} /></label>
                        <label className="block space-y-2"><span className="text-sm font-bold">Design style</span><select value={form.designStyle} onChange={setField('designStyle')} className={fieldClasses(false)} style={inputStyle(false)}><option value="">Select style</option>{DESIGN_STYLES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                      </div>
                    </>
                  ) : null}

                  {step === 1 ? (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block space-y-2"><span className="text-sm font-bold">Site type</span><select value={form.siteKind} onChange={setField('siteKind')} className={fieldClasses(false)} style={inputStyle(false)}><option value="static">Static Website</option><option value="dynamic">Dynamic Website</option></select></label>
                        <label className="block space-y-2"><span className="text-sm font-bold">Authentication</span><select value={form.authTier} onChange={setField('authTier')} className={fieldClasses(false)} style={inputStyle(false)}>{AUTH_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
                      </div>
                      <label className="flex items-center gap-3 rounded-2xl border px-4 py-4" style={{ background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}><input type="checkbox" checked={form.paymentIntegration} onChange={setField('paymentIntegration')} /><span className="text-sm font-semibold">Include payment gateway integration</span></label>
                      <div>
                        <div className="mb-3 text-sm font-bold">Additional features</div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {FEATURE_OPTIONS.map((feature) => {
                            const active = form.featureIds.includes(feature.id);
                            return <button key={feature.id} type="button" onClick={() => toggleFeature(feature.id)} className={`rounded-2xl border px-4 py-4 text-left ${active ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}`} style={active ? {} : { background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}><div className="font-bold">{feature.label}</div><div className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatInr(feature.price)}</div></button>;
                          })}
                        </div>
                      </div>
                      <label className="block space-y-2"><span className="text-sm font-bold">Delivery preference</span><select value={form.deliveryOption} onChange={setField('deliveryOption')} className={fieldClasses(false)} style={inputStyle(false)}>{DELIVERY_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label} {item.extra ? `(+${formatInr(item.extra)})` : '(Included)'}</option>)}</select></label>
                    </>
                  ) : null}

                  {step === 2 ? (
                    <>
                      <label className="block space-y-2"><span className="text-sm font-bold">Project notes</span><textarea rows={5} value={form.description} onChange={setField('description')} className={fieldClasses(errors.description)} style={inputStyle(errors.description)} /></label>
                      <label className="block space-y-2"><span className="text-sm font-bold">Reference websites</span><textarea rows={3} value={form.referenceWebsites} onChange={setField('referenceWebsites')} className={fieldClasses(false)} style={inputStyle(false)} /></label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block space-y-2"><span className="text-sm font-bold">Contact email</span><input type="email" value={form.contactEmail} onChange={setField('contactEmail')} className={fieldClasses(errors.contactEmail)} style={inputStyle(errors.contactEmail)} /></label>
                        <label className="block space-y-2"><span className="text-sm font-bold">Phone</span><input value={form.phoneNumber} onChange={setField('phoneNumber')} className={fieldClasses(false)} style={inputStyle(false)} /></label>
                      </div>
                      <label className="block space-y-2"><span className="text-sm font-bold">Preferred deadline</span><input type="date" value={form.preferredDeadline} onChange={setField('preferredDeadline')} className={fieldClasses(false)} style={inputStyle(false)} /></label>
                    </>
                  ) : null}

                  {step === 3 ? (
                    <div className="space-y-4 rounded-[24px] border p-5" style={{ background: 'var(--bg-card-inner)', borderColor: 'var(--border)' }}>
                      <div className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Order summary</div>
                      {[
                        ['Plan', form.planName],
                        ['Website type', form.websiteType],
                        ['Site kind', form.siteKind],
                        ['Pages', form.pages],
                        ['Authentication', form.authTier],
                        ['Payment integration', form.paymentIntegration ? 'Included' : 'No'],
                        ['Features', pricing.selectedFeatures.length ? pricing.selectedFeatures.map((item) => item.label).join(', ') : 'No extra features'],
                        ['Notes', form.description || 'None'],
                        ['Reference websites', form.referenceWebsites || 'None'],
                        ['Status', 'Pending']
                      ].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4 text-sm"><span style={{ color: 'var(--text-muted)' }}>{label}</span><span className="text-right font-bold">{value}</span></div>)}

                      <label className="mt-4 flex items-start gap-3 rounded-2xl border px-4 py-4" style={{ background: 'var(--bg-card)', borderColor: errors.acceptedLegal ? '#ef4444' : 'var(--border)' }}>
                        <input type="checkbox" checked={form.acceptedLegal} onChange={setField('acceptedLegal')} className="mt-1" />
                        <span className="text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                          I agree to the <a href="/privacy" target="_blank" rel="noreferrer" className="font-semibold text-red-600 hover:underline">Privacy Policy</a> and <a href="/terms" target="_blank" rel="noreferrer" className="font-semibold text-red-600 hover:underline">Terms of Use</a>.
                        </span>
                      </label>
                      {errors.acceptedLegal ? <div className="flex items-center gap-2 text-xs font-semibold text-red-500"><AlertCircle className="h-3.5 w-3.5" /> {errors.acceptedLegal}</div> : null}
                    </div>
                  ) : null}

                  <div className="flex gap-3 pt-2">
                    {step > 0 ? <button type="button" onClick={() => setStep((current) => current - 1)} className="secondary-btn rounded-2xl px-5 py-3 text-sm font-bold">Back</button> : null}
                    <div className="flex-1" />
                    {step < STEPS.length - 1 ? <button type="button" onClick={handleNext} className="primary-btn inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold">Next <ChevronRight size={16} /></button> : <button type="button" onClick={handleSubmit} disabled={submitting} className="primary-btn inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold disabled:opacity-60">{submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving</> : 'Create Order'}</button>}
                  </div>
                </div>

                <div className="rounded-[26px] border p-5 h-fit" style={{ background: 'linear-gradient(180deg, var(--bg-card), var(--bg-card-inner))', borderColor: 'var(--border)' }}>
                  <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Live pricing</div>
                  <div className="mt-3 text-4xl font-black">{formatInr(pricing.total)}</div>
                  <div className="mt-5 space-y-3">
                    {pricing.breakdown.map((item) => <div key={item.key} className="flex items-start justify-between gap-3 text-sm"><span style={{ color: 'var(--text-secondary)' }}>{item.label}</span><span className="font-bold">{formatInr(item.amount)}</span></div>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderModal;
