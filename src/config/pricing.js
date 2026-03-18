export const PRICING_RULES = {
  staticPageMin: 200,
  staticPageMax: 250,
  staticPageDefault: 250,
  dynamicPageMin: 500,
  dynamicPageDefault: 500,
  auth: {
    none: 0,
    basic: 1000,
    premium: 2000
  },
  paymentIntegration: 1200
};

export const EXTRA_FEATURES = {
  adminPanel: { id: 'adminPanel', label: 'Admin Panel', price: 1800 },
  cms: { id: 'cms', label: 'CMS / Blog', price: 1500 },
  seo: { id: 'seo', label: 'SEO Setup', price: 800 },
  animations: { id: 'animations', label: 'Animations / Effects', price: 2000 },
  dashboard: { id: 'dashboard', label: 'User Dashboard', price: 6000 },
  emails: { id: 'emails', label: 'Email Notifications', price: 700 },
  chat: { id: 'chat', label: 'Live Chat', price: 2000 },
  analytics: { id: 'analytics', label: 'Analytics Integration', price: 900 },
  multilingual: { id: 'multilingual', label: 'Multi-language', price: 1500 },
  darkMode: { id: 'darkMode', label: 'Dark Mode', price: 600 },
  premiumUi: { id: 'premiumUi', label: 'Premium UI System', price: 4300 },
  enterpriseIntegrations: { id: 'enterpriseIntegrations', label: 'Enterprise Integrations', price: 11800 }
};

export const AUTH_OPTIONS = [
  { id: 'none', label: 'No Login System' },
  { id: 'basic', label: 'Basic Login System' },
  { id: 'premium', label: 'Premium Auth System' }
];

export const SITE_KIND_OPTIONS = [
  { id: 'static', label: 'Static Website' },
  { id: 'dynamic', label: 'Dynamic Website' }
];

export const WEBSITE_TYPES = [
  'Business Website',
  'Portfolio',
  'E-commerce',
  'Landing Page',
  'SaaS Platform',
  'Blog / News',
  'Educational',
  'Custom'
];

export const DESIGN_STYLES = [
  'Modern & Minimal',
  'Bold & Colorful',
  'Corporate & Professional',
  'Creative & Artistic',
  'Dark / Neon',
  'Elegant & Luxury'
];

export const FEATURE_OPTIONS = [
  EXTRA_FEATURES.adminPanel,
  EXTRA_FEATURES.cms,
  EXTRA_FEATURES.seo,
  EXTRA_FEATURES.animations,
  EXTRA_FEATURES.dashboard,
  EXTRA_FEATURES.emails,
  EXTRA_FEATURES.chat,
  EXTRA_FEATURES.analytics,
  EXTRA_FEATURES.multilingual,
  EXTRA_FEATURES.darkMode
];

export const DELIVERY_OPTIONS = [
  { value: 'normal', label: 'Standard', extra: 0 },
  { value: 'fast', label: '2x Faster', extra: 1500 },
  { value: 'urgent', label: '3x Urgent', extra: 3000 }
];

export const PLAN_PRESETS = {
  static: {
    presetId: 'static',
    packageType: 'basic',
    planName: 'Static Website',
    siteKind: 'static',
    pages: 8,
    authTier: 'none',
    paymentIntegration: false,
    featureIds: ['seo']
  },
  dynamic: {
    presetId: 'dynamic',
    packageType: 'standard',
    planName: 'Dynamic Website',
    siteKind: 'dynamic',
    pages: 10,
    authTier: 'basic',
    paymentIntegration: false,
    featureIds: []
  },
  advanced: {
    presetId: 'advanced',
    packageType: 'premium',
    planName: 'Advanced Website',
    siteKind: 'dynamic',
    pages: 12,
    authTier: 'premium',
    paymentIntegration: true,
    featureIds: ['animations']
  },
  premium: {
    presetId: 'premium',
    packageType: 'premium',
    planName: 'Premium Website',
    siteKind: 'dynamic',
    pages: 15,
    authTier: 'premium',
    paymentIntegration: true,
    featureIds: ['animations', 'premiumUi']
  },
  enterprise: {
    presetId: 'enterprise',
    packageType: 'custom',
    planName: 'Enterprise Website',
    siteKind: 'dynamic',
    pages: 40,
    authTier: 'premium',
    paymentIntegration: true,
    featureIds: ['animations', 'premiumUi', 'enterpriseIntegrations']
  },
  dashboardSimple: {
    presetId: 'dashboardSimple',
    packageType: 'custom',
    planName: 'Simple Dashboard',
    siteKind: 'dynamic',
    pages: 26,
    authTier: 'basic',
    paymentIntegration: false,
    featureIds: ['dashboard', 'analytics']
  },
  dashboardMedium: {
    presetId: 'dashboardMedium',
    packageType: 'custom',
    planName: 'Medium Dashboard',
    siteKind: 'dynamic',
    pages: 61,
    authTier: 'premium',
    paymentIntegration: false,
    featureIds: ['dashboard', 'analytics', 'emails', 'chat']
  },
  dashboardPremium: {
    presetId: 'dashboardPremium',
    packageType: 'custom',
    planName: 'Premium Dashboard',
    siteKind: 'dynamic',
    pages: 176,
    authTier: 'premium',
    paymentIntegration: true,
    featureIds: ['dashboard', 'analytics', 'emails', 'chat', 'premiumUi', 'enterpriseIntegrations']
  }
};

export const formatInr = (value) => `INR ${Number(value || 0).toLocaleString('en-IN')}`;

export const featureById = (id) => EXTRA_FEATURES[id];

export const calculateProjectPricing = ({
  siteKind = 'static',
  pages = 1,
  authTier = 'none',
  paymentIntegration = false,
  featureIds = [],
  deliveryOption = 'normal'
}) => {
  const normalizedPages = Math.max(1, Number(pages) || 1);
  const pageRate = siteKind === 'dynamic' ? PRICING_RULES.dynamicPageDefault : PRICING_RULES.staticPageDefault;
  const pagesCost = normalizedPages * pageRate;
  const authCost = PRICING_RULES.auth[authTier] ?? 0;
  const paymentCost = paymentIntegration ? PRICING_RULES.paymentIntegration : 0;
  const featuresCost = featureIds.reduce((sum, id) => sum + (featureById(id)?.price || 0), 0);
  const deliveryCost = DELIVERY_OPTIONS.find((item) => item.value === deliveryOption)?.extra || 0;

  const breakdown = [
    { key: 'pages', label: `${normalizedPages} ${siteKind} page${normalizedPages === 1 ? '' : 's'}`, amount: pagesCost },
    ...(authCost ? [{ key: 'auth', label: authTier === 'premium' ? 'Premium Auth System' : 'Basic Login System', amount: authCost }] : []),
    ...(paymentCost ? [{ key: 'payment', label: 'Payment Integration', amount: paymentCost }] : []),
    ...featureIds
      .map((id) => featureById(id))
      .filter(Boolean)
      .map((feature) => ({ key: feature.id, label: feature.label, amount: feature.price })),
    ...(deliveryCost ? [{ key: 'delivery', label: `Delivery Upgrade (${deliveryOption})`, amount: deliveryCost }] : [])
  ];

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return {
    pageRate,
    total,
    breakdown,
    selectedFeatures: featureIds.map((id) => featureById(id)).filter(Boolean)
  };
};

export const WEBSITE_PLANS = [
  {
    id: 'static',
    title: 'Static Website',
    subtitle: '7-8 pages, no login system',
    preset: PLAN_PRESETS.static,
    features: ['7-8 pages', 'Responsive design', 'Contact form', 'Basic SEO setup']
  },
  {
    id: 'dynamic',
    title: 'Dynamic Website',
    subtitle: 'Database + login system',
    preset: PLAN_PRESETS.dynamic,
    features: ['Database-ready pages', 'Basic login system', 'API-driven content', 'Scalable structure'],
    rangeLabel: 'INR 5,000 - 10,000',
    popular: true
  },
  {
    id: 'advanced',
    title: 'Advanced Website',
    subtitle: 'Animations, integrations, advanced UI',
    preset: PLAN_PRESETS.advanced,
    features: ['Premium auth flow', 'Payment integration', 'Motion effects', 'Advanced interactions']
  },
  {
    id: 'premium',
    title: 'Premium Website',
    subtitle: 'High-quality design and advanced features',
    preset: PLAN_PRESETS.premium,
    features: ['Premium UI system', 'Branded interactions', 'Higher polish', 'Feature-rich build']
  },
  {
    id: 'enterprise',
    title: 'Enterprise Website',
    subtitle: 'Complex system or large projects',
    preset: PLAN_PRESETS.enterprise,
    features: ['Large scope', 'Advanced integrations', 'Complex workflows', 'Enterprise planning']
  }
].map((plan) => ({
  ...plan,
  price: calculateProjectPricing(plan.preset).total
}));

export const DASHBOARD_PLANS = [
  {
    id: 'dashboardSimple',
    title: 'Simple Dashboard',
    preset: PLAN_PRESETS.dashboardSimple,
    features: ['Core dashboard pages', 'Secure user login', 'Analytics widgets', 'Structured reporting views']
  },
  {
    id: 'dashboardMedium',
    title: 'Medium Dashboard',
    preset: PLAN_PRESETS.dashboardMedium,
    features: ['Team workflows', 'Analytics + alerts', 'Messaging-ready modules', 'Scalable dashboard architecture']
  },
  {
    id: 'dashboardPremium',
    title: 'Premium Dashboard',
    preset: PLAN_PRESETS.dashboardPremium,
    features: ['Premium UI system', 'Realtime-ready experience', 'Enterprise integrations', 'Large-scale product scope']
  }
].map((plan) => ({
  ...plan,
  price: calculateProjectPricing(plan.preset).total
}));

export const PRICING_SLIDER_CARDS = [
  {
    id: 'static',
    title: 'Static Website',
    subtitle: '7-8 pages, no login system',
    preset: PLAN_PRESETS.static,
    section: 'Website',
    features: ['7-8 pages', 'Responsive design', 'Contact form', 'Basic SEO setup']
  },
  {
    id: 'dynamic',
    title: 'Dynamic Website',
    subtitle: 'Database + login system',
    preset: PLAN_PRESETS.dynamic,
    section: 'Website',
    features: ['Database-ready pages', 'Basic login system', 'API-driven content', 'Scalable structure'],
    rangeLabel: 'INR 5,000 - 10,000',
    popular: true
  },
  {
    id: 'advanced',
    title: 'Advanced Website',
    subtitle: 'Animations, integrations, advanced UI',
    preset: PLAN_PRESETS.advanced,
    section: 'Website',
    features: ['Premium auth flow', 'Payment integration', 'Motion effects', 'Advanced interactions']
  },
  {
    id: 'dashboardSimple',
    title: 'Simple Dashboard',
    subtitle: 'Clean internal tools and user-facing dashboards',
    preset: PLAN_PRESETS.dashboardSimple,
    section: 'Dashboard Development',
    features: ['Core dashboard pages', 'Secure user login', 'Analytics widgets', 'Structured reporting views']
  },
  {
    id: 'dashboardMedium',
    title: 'Medium Dashboard',
    subtitle: 'Multi-module dashboards for growing products',
    preset: PLAN_PRESETS.dashboardMedium,
    section: 'Dashboard Development',
    features: ['Team workflows', 'Analytics + alerts', 'Messaging-ready modules', 'Scalable dashboard architecture']
  },
  {
    id: 'dashboardPremium',
    title: 'Premium Dashboard',
    subtitle: 'High-capability portals for larger systems',
    preset: PLAN_PRESETS.dashboardPremium,
    section: 'Dashboard Development',
    features: ['Premium UI system', 'Realtime-ready experience', 'Enterprise integrations', 'Large-scale product scope']
  }
].map((plan) => ({
  ...plan,
  price: calculateProjectPricing(plan.preset).total
}));

export const createOrderDraftFromPreset = (preset) => {
  const selectedPreset = typeof preset === 'string' ? PLAN_PRESETS[preset] : preset;
  const resolvedPreset = selectedPreset || PLAN_PRESETS.static;
  const pricing = calculateProjectPricing(resolvedPreset);

  return {
    presetId: resolvedPreset.presetId,
    plan: resolvedPreset.packageType,
    planName: resolvedPreset.planName,
    siteKind: resolvedPreset.siteKind,
    pages: resolvedPreset.pages,
    authTier: resolvedPreset.authTier,
    paymentIntegration: resolvedPreset.paymentIntegration,
    featureIds: [...resolvedPreset.featureIds],
    budget: pricing.total,
    priceBreakdown: pricing.breakdown
  };
};
