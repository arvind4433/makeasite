import { motion } from 'framer-motion';
import { ExternalLink, Globe, Utensils, Hotel, ShoppingCart, Briefcase, Rocket } from 'lucide-react';

const projects = [
    {
        type: 'Business Website',
        icon: Globe,
        title: 'Corporate Business Site',
        desc: 'Professional multi-page business website with contact forms, service listings, team section, and SEO-optimised landing pages.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=900',
        tech: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
        color: 'from-blue-500 to-indigo-600',
        link: '#',
    },
    {
        type: 'Restaurant Website',
        icon: Utensils,
        title: 'Restaurant & Food Ordering',
        desc: 'Stylish restaurant website with online menu, table booking, and food ordering with Razorpay payment integration.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=900',
        tech: ['React.js', 'Node.js', 'MongoDB', 'Razorpay'],
        color: 'from-orange-500 to-red-500',
        link: '#',
    },
    {
        type: 'Hotel Website',
        icon: Hotel,
        title: 'Hotel Booking Platform',
        desc: 'Full hotel management system with room listings, availability calendar, online booking, and admin dashboard.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=900',
        tech: ['React.js', 'Express.js', 'MongoDB', 'JWT Auth'],
        color: 'from-amber-500 to-yellow-400',
        link: '#',
    },
    {
        type: 'E-Commerce Store',
        icon: ShoppingCart,
        title: 'Full-Stack E-Commerce',
        desc: 'Feature-rich online store with product catalog, cart, Stripe checkout, order tracking, and seller admin panel.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=900',
        tech: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
        color: 'from-emerald-500 to-teal-500',
        link: '#',
    },
    {
        type: 'Portfolio Website',
        icon: Briefcase,
        title: 'Creative Portfolio',
        desc: 'Stunning portfolio website for freelancers and creatives — animations, project showcase, testimonials, and contact.',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=900',
        tech: ['React.js', 'Tailwind CSS', 'Framer Motion', 'Node.js'],
        color: 'from-purple-500 to-pink-500',
        link: '#',
    },
    {
        type: 'SaaS Platform',
        icon: Rocket,
        title: 'Startup / SaaS Web App',
        desc: 'Scalable SaaS platform with subscription billing, role-based access, analytics dashboard, and REST API backend.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900',
        tech: ['React.js', 'Node.js', 'PostgreSQL', 'Stripe'],
        color: 'from-red-500 to-orange-500',
        link: '#',
    },
];

const Portfolio = () => (
    <section id="portfolio" className="py-24 sm:py-32 section-surface section-sep relative overflow-hidden transition-colors duration-300">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
                <span className="badge-red mb-4">Portfolio</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                    Websites built for{' '}
                    <span className="gradient-text">real clients</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    From local businesses to SaaS platforms — here are the types of websites we build.
                    Primarily using the MERN stack for maximum performance and scalability.
                </p>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                        className="card group overflow-hidden flex flex-col">

                        {/* Image */}
                        <div className="relative h-48 overflow-hidden flex-shrink-0">
                            <img src={p.image} alt={p.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 saturate-75 group-hover:saturate-100" />

                            {/* Dark overlay on hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
                                <a href={p.link}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white border border-white/30 hover:bg-white/10 transition-colors">
                                    View Example <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Type badge */}
                            <div className="absolute top-3 left-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${p.color} shadow-md`}>
                                    <p.icon className="w-3 h-3" strokeWidth={2.5} />
                                    {p.type}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                {p.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed flex-grow">
                                {p.desc}
                            </p>

                            {/* Tech stack */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                                {p.tech.map((t) => (
                                    <span key={t}
                                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 rounded-lg"
                                        style={{ backgroundColor: 'var(--bg-card-inner)', border: '1px solid var(--border)' }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* MERN note */}
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-14 max-w-2xl mx-auto">
                <div className="card-inner rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
                        🔧
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Flexible Tech Choices</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            While we specialise in the <strong className="text-red-600 dark:text-red-400">MERN stack</strong> (MongoDB, Express.js, React.js, Node.js),
                            we can also build websites using other technologies — PHP, Python, Next.js, Firebase, SQL, and more —
                            depending on your project requirements.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

export default Portfolio;
