import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../services/orderApi';
import { formatInr } from '../config/pricing';

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-strong)',
  boxShadow: 'var(--shadow-card)'
};

const innerStyle = {
  background: 'var(--bg-card-inner)',
  border: '1px solid var(--border)'
};

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrderByIdQuery(id);

  if (isLoading) {
    return <div className="min-h-screen pt-28 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 pb-12 pt-24 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[28px] p-6 sm:p-8" style={cardStyle}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Order Details</div>
              <h1 className="mt-3 text-3xl font-black">{order.title}</h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{order.description}</p>
            </div>
            <button type="button" onClick={() => navigate(-1)} className="secondary-btn inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Back</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] p-6" style={cardStyle}>
              <h2 className="text-xl font-black">Project Information</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ['Selected service', order.projectConfig?.planName || order.packageType],
                  ['Package type', order.packageType],
                  ['Website type', order.projectConfig?.websiteType || 'Custom'],
                  ['Site kind', order.projectConfig?.siteKind || 'static'],
                  ['Pages', order.projectConfig?.pages || 1],
                  ['Authentication', order.projectConfig?.authTier || 'none'],
                  ['Payment integration', order.projectConfig?.paymentIntegration ? 'Included' : 'No'],
                  ['Delivery option', order.projectConfig?.deliveryOption || 'normal'],
                  ['Design style', order.projectConfig?.designStyle || 'Not specified'],
                  ['Business category', order.projectConfig?.businessCategory || 'Not specified'],
                  ['Reference websites', order.projectConfig?.referenceWebsites || 'None'],
                  ['Deadline', order.deadline ? new Date(order.deadline).toLocaleDateString() : 'Flexible']
                ].map(([label, value]) => <div key={label} className="rounded-2xl p-4" style={innerStyle}><div className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>{label}</div><div className="mt-2 text-sm font-semibold">{String(value)}</div></div>)}
              </div>
            </div>

            <div className="rounded-[28px] p-6" style={cardStyle}>
              <h2 className="text-xl font-black">Selected Features</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {order.selectedFeatures?.length ? order.selectedFeatures.map((feature) => <div key={feature.id} className="rounded-2xl p-4 flex items-start gap-3" style={innerStyle}><CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" /><div><div className="font-bold">{feature.label}</div><div className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatInr(feature.price)}</div></div></div>) : <div className="rounded-2xl p-4 text-sm" style={innerStyle}>No extra features selected.</div>}
              </div>
            </div>

            <div className="rounded-[28px] p-6" style={cardStyle}>
              <h2 className="text-xl font-black">User Notes</h2>
              <div className="mt-4 rounded-2xl p-5 text-sm leading-7" style={innerStyle}>{order.description}</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] p-6" style={cardStyle}>
              <h2 className="text-xl font-black">Price Breakdown</h2>
              <div className="mt-5 space-y-3">
                {order.priceBreakdown?.map((item) => <div key={item.key} className="flex items-start justify-between gap-3 text-sm"><span style={{ color: 'var(--text-secondary)' }}>{item.label}</span><span className="font-bold">{formatInr(item.amount)}</span></div>)}
              </div>
              <div className="mt-5 border-t pt-4 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}><span className="font-bold">Total</span><span className="text-2xl font-black">{formatInr(order.price)}</span></div>
            </div>

            <div className="rounded-[28px] p-6" style={cardStyle}>
              <h2 className="text-xl font-black">Status</h2>
              <div className="mt-4 rounded-2xl p-5" style={innerStyle}><div className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>Current status</div><div className="mt-2 text-lg font-black capitalize">{String(order.status).replace('_', ' ')}</div></div>
            </div>

            <div className="rounded-[28px] p-6" style={cardStyle}>
              <h2 className="text-xl font-black">Contact Snapshot</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl p-4" style={innerStyle}><div className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>Email</div><div className="mt-2 text-sm font-semibold">{order.projectConfig?.contactEmail || order.client?.email || 'Not provided'}</div></div>
                <div className="rounded-2xl p-4" style={innerStyle}><div className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>Phone</div><div className="mt-2 text-sm font-semibold">{order.projectConfig?.phoneNumber || order.client?.phone || 'Not provided'}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
