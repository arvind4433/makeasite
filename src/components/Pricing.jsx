import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
    {
        name: 'Basic',
        id: 'plan-basic',
        href: '/register?plan=basic',
        price: '₹3000',
        description: 'Perfect for small businesses starting online.',
        features: [
            '1–3 pages website',
            'Responsive design',
            'Contact form',
            'Basic UI design',
            '3 days delivery',
        ],
        mostPopular: false,
    },
    {
        name: 'Standard',
        id: 'plan-standard',
        href: '/register?plan=standard',
        price: '₹7000',
        description: 'Ideal for established businesses looking to scale.',
        features: [
            'Up to 7 pages',
            'Custom UI design',
            'Responsive design',
            'Contact forms',
            'Basic SEO setup',
            'Admin panel (basic)',
            '7 days delivery',
        ],
        mostPopular: true,
    },
    {
        name: 'Premium',
        id: 'plan-premium',
        href: '/register?plan=premium',
        price: '₹50000',
        description: 'Comprehensive solution with all advanced features.',
        features: [
            'Unlimited pages',
            'Advanced UI/UX design',
            'Full admin dashboard',
            'User authentication',
            'Database integration',
            'Payment gateway integration',
            'SEO optimization',
            'Analytics integration',
        ],
        mostPopular: false,
    },
];

const Pricing = () => {
    return (
        <div id="pricing" className="py-24 sm:py-32 bg-white relative">
            <div className="absolute inset-0 max-w-7xl mx-auto h-[600px] bg-gradient-to-tr from-indigo-100 to-cyan-50 blur-[100px] -z-10 rounded-full"></div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Pricing plans for professional websites
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                    Choose an affordable plan that's packed with the best features for engaging your audience.
                </p>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 gap-x-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white ${plan.mostPopular ? 'ring-2 ring-indigo-600 bg-gray-900 shadow-xl' : 'bg-white shadow-lg shadow-gray-100'
                                }`}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3
                                        id={plan.id}
                                        className={`text-lg font-semibold leading-8 ${plan.mostPopular ? 'text-white' : 'text-gray-900'
                                            }`}
                                    >
                                        {plan.name}
                                    </h3>
                                    {plan.mostPopular ? (
                                        <p className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-400">
                                            Most popular
                                        </p>
                                    ) : null}
                                </div>
                                <p className={`mt-4 text-sm leading-6 ${plan.mostPopular ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {plan.description}
                                </p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className={`text-5xl font-bold tracking-tight ${plan.mostPopular ? 'text-white' : 'text-gray-900'}`}>
                                        {plan.price}
                                    </span>
                                </p>
                                <ul
                                    role="list"
                                    className={`mt-8 space-y-3 text-sm leading-6 ${plan.mostPopular ? 'text-gray-300' : 'text-gray-600'
                                        }`}
                                >
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <Check
                                                className={`h-6 w-5 flex-none ${plan.mostPopular ? 'text-indigo-400' : 'text-indigo-600'}`}
                                                aria-hidden="true"
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link
                                to={plan.href}
                                className={`mt-8 block rounded-md px-3 py-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${plan.mostPopular
                                        ? 'bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500'
                                        : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 hover:bg-indigo-50 flex-grow-0'
                                    }`}
                            >
                                Order this plan
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pricing;
