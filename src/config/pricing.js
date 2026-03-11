/**
 * pricing.js — Single source of truth for all pricing across the website.
 *
 * PricingSection.jsx  ──┐
 * CostCalculator.jsx  ──┴── all import from here
 *
 * NEVER hardcode prices in individual components.
 * Change a number here and it propagates everywhere automatically.
 */

/* ══════════════════════════════════════════════════════
   PACKAGE TIERS
   ══════════════════════════════════════════════════════ */
export const PACKAGES = {
    basic: {
        id: 'basic',
        name: 'Basic Website',
        price: 3_000,          // SAR, fixed
        priceLabel: '3,000',
        currency: 'SAR',
        href: '/register?plan=basic',
        pageRange: { min: 1, max: 4 },
        tagline: 'Simple, clean, and professional — perfect for getting online fast.',
        popular: false,
        badge: null,
        cta: 'Order Basic',
        suitableFor: ['Small business websites', 'Simple portfolio websites', 'Landing pages'],
        features: [
            { text: '3–4 Pages Static Website', note: null },
            { text: 'Fully Responsive Design (Mobile Friendly)', note: null },
            { text: 'Modern UI Design', note: null },
            { text: 'Contact Form', note: null },
            { text: 'Basic SEO Setup', note: null },
            { text: 'Fast Loading Website', note: null },
            { text: 'Login System', note: 'Optional — can be added if required' },
        ],
    },

    standard: {
        id: 'standard',
        name: 'Standard Website',
        price: 9_000,         // SAR lower bound
        priceMax: 10_000,        // SAR upper bound
        priceLabel: '9,000 – 10,000',
        currency: 'SAR',
        href: '/register?plan=standard',
        pageRange: { min: 5, max: 10 },
        tagline: 'A complete website with modern functionality for growing businesses.',
        popular: true,
        badge: 'Most Popular',
        cta: 'Order Standard',
        suitableFor: ['Business websites', 'Service websites', 'Growing startups'],
        features: [
            { text: '7–10 Pages Website', note: null },
            { text: 'Modern & Professional UI/UX', note: null },
            { text: 'Fully Responsive Design', note: null },
            { text: 'User Authentication (Login & Signup)', note: null },
            { text: 'Contact Forms', note: null },
            { text: 'Basic Database Integration', note: null },
            { text: 'Payment Method Integration', note: 'Optional — included if required' },
            { text: 'Smooth Animations & Interactivity', note: null },
        ],
    },

    premium: {
        id: 'premium',
        name: 'Premium Website',
        price: 40_000,         // SAR, fixed
        priceLabel: '40,000',
        currency: 'SAR',
        href: '/register?plan=premium',
        pageRange: { min: 11, max: 20 },
        tagline: 'Advanced, fully-featured platform built for scale and performance.',
        popular: false,
        badge: 'Advanced',
        cta: 'Order Premium',
        suitableFor: ['Large business websites', 'Startup platforms', 'Advanced web applications'],
        features: [
            { text: '18–20 Pages Website', note: null },
            { text: 'Fully Professional UI/UX Design', note: null },
            { text: 'Advanced Interactive Features', note: null },
            { text: 'User Authentication System', note: null },
            { text: 'Full Database Integration', note: null },
            { text: 'Payment System Integration', note: null },
            { text: 'Advanced Animations & Modern Effects', note: null },
            { text: 'High Performance Optimization', note: null },
        ],
    },
};

export const PACKAGE_LIST = [PACKAGES.basic, PACKAGES.standard, PACKAGES.premium];

/* ══════════════════════════════════════════════════════
   ESTIMATOR — TIER-BASED BASE PRICE
   Mirrors the package tiers exactly so the estimator
   always agrees with the pricing cards.
   ══════════════════════════════════════════════════════ */

/**
 * Returns the package tier that covers `pages`.
 *  1–4  pages → Basic   (3,000 SAR)
 *  5–10 pages → Standard (9,000 SAR)
 * 11–20 pages → Premium (40,000 SAR)
 */
export const getTier = (pages) => {
    if (pages <= PACKAGES.basic.pageRange.max) return PACKAGES.basic;
    if (pages <= PACKAGES.standard.pageRange.max) return PACKAGES.standard;
    return PACKAGES.premium;
};

export const getBasePrice = (pages) => getTier(pages).price;

/* ══════════════════════════════════════════════════════
   ESTIMATOR ADD-ONS (SAR)
   These stack on top of the tier base price.
   ══════════════════════════════════════════════════════ */
export const ADDONS = [
    {
        key: 'loginSystem',
        label: 'User Login System',
        price: 1_500,
        desc: 'User registration, login, JWT sessions',
        note: 'Included free in Standard & Premium',
        // In Standard/Premium this is already in the package price — the
        // estimator notes this to the user but still adds it if selected
        // from Basic tier so the total remains correct.
    },
    {
        key: 'userPortal',
        label: 'User Dashboard / Portal',
        price: 3_500,
        desc: 'Client-facing dashboard: orders, profile, history',
        note: null,
    },
    {
        key: 'paymentGateway',
        label: 'Payment Gateway',
        price: 2_000,
        desc: 'Stripe or local gateway integration',
        note: 'Optional in Standard, included in Premium',
    },
    {
        key: 'blogSystem',
        label: 'Blog / CMS System',
        price: 2_500,
        desc: 'Full content management with rich editor',
        note: null,
    },
    {
        key: 'seoOptimization',
        label: 'Advanced SEO',
        price: 2_000,
        desc: 'Structured data, sitemap, on-page optimisation',
        note: null,
    },
    {
        key: 'customDesign',
        label: 'Custom UI Design Pack',
        price: 3_000,
        desc: 'Bespoke illustrations, icons & brand system',
        note: null,
    },
];

/* ══════════════════════════════════════════════════════
   DELIVERY SPEED SURCHARGES (SAR)
   ══════════════════════════════════════════════════════ */
export const SPEEDS = [
    { value: 'standard', label: 'Standard', tagLabel: 'Included', extra: 0 },
    { value: 'fast', label: '2× Faster', tagLabel: '+1,500 SAR', extra: 1_500 },
    { value: 'urgent', label: '3× Urgent', tagLabel: '+3,000 SAR', extra: 3_000 },
];

/* ══════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════ */
/** Locale-formatted number, e.g.  9000 → "9,000" */
export const fmt = (n) => n.toLocaleString('en-US');

