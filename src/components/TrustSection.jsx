import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    Trophy, Users, CalendarCheck, ThumbsUp,
} from 'lucide-react';

/* ── Counter hook ─────────────────────────────────── */
const useCounter = (target, duration = 1800) => {
    const [count, setCount] = useState(0);
    const started = useRef(false);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    useEffect(() => {
        if (!inView || started.current) return;
        started.current = true;
        const end = parseInt(target.replace(/\D/g, ''));
        const suffix = target.replace(/[\d,]/g, '');
        const start = Date.now();
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(ease * end) + suffix);
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
        };
        requestAnimationFrame(tick);
    }, [inView, target, duration]);
    return { ref, count };
};

const stats = [
    { icon: Trophy, value: '120+', label: 'Projects Delivered' },
    { icon: Users, value: '80+', label: 'Happy Clients' },
    { icon: CalendarCheck, value: '5+', label: 'Years Experience' },
    { icon: ThumbsUp, value: '98%', label: 'Client Satisfaction' },
];

/* ── Tech data ────────────────────────────────────── */
const techCategories = [
    {
        title: 'Languages',
        items: [
            { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
            { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
            { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
            { name: 'PHP', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
            { name: 'SQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        ],
    },
    {
        title: 'Frameworks & Libraries',
        items: [
            { name: 'React.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
            { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
            { name: 'Express.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
            { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        ],
    },
    {
        title: 'Databases',
        items: [
            { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
            { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
            { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
            { name: 'Firebase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
        ],
    },
    {
        title: 'Tools & Deployment',
        items: [
            { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
            { name: 'Tailwind', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
            { name: 'Bootstrap', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
            { name: 'Vercel', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
            { name: 'REST APIs', logo: null, emoji: '🔌' },
        ],
    },
];

const CounterCard = ({ icon: Icon, value, label }) => {
    const { ref, count } = useCounter(value);
    return (
        <div ref={ref} className="card p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)' }}>
                <Icon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-4xl font-black gradient-text mb-2">{count}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
        </div>
    );
};

const TrustSection = () => (
    <section className="py-24 sm:py-32 section-surface section-sep relative overflow-hidden transition-colors duration-300">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Stats header */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-16">
                <span className="badge-red mb-4">Why Choose Us</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5">
                    Numbers that speak{' '}
                    <span className="gradient-text">for themselves</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Results we've delivered for businesses across industries.
                </p>
            </motion.div>

            {/* Counter cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
                {stats.map((s) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <CounterCard {...s} />
                    </motion.div>
                ))}
            </div>

            {/* ─── Technologies section ─────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-14">
                <span className="badge-red mb-4">Tech Stack</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                    Technologies we work with
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-400">
                    We specialise in the MERN stack and modern web technologies to build fast, scalable, and reliable applications.
                </p>
            </motion.div>

            {/* Category groups */}
            <div className="space-y-10">
                {techCategories.map((cat, ci) => (
                    <motion.div key={cat.title}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.45, delay: ci * 0.07 }}>

                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">{cat.title}</span>
                            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {cat.items.map((tech, ti) => (
                                <motion.div key={tech.name}
                                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }} transition={{ duration: 0.3, delay: ti * 0.05 }}
                                    whileHover={{ y: -4, scale: 1.04 }}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl cursor-default border hover:border-red-400/40 dark:hover:border-red-500/30 hover:shadow-md transition-all group"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>

                                    {/* Icon */}
                                    {tech.logo ? (
                                        <img src={tech.logo} alt={tech.name}
                                            className={`w-5 h-5 object-contain flex-shrink-0 ${tech.name === 'Express.js' || tech.name === 'Vercel' || tech.name === 'Next.js' ? 'dark:invert' : ''}`}
                                            onError={(e) => { e.target.style.display = 'none'; }} />
                                    ) : (
                                        <span className="text-base leading-none select-none">{tech.emoji}</span>
                                    )}

                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors whitespace-nowrap">
                                        {tech.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Note */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-500 italic">
                    🔧 We can also build websites using other technologies based on your project needs.
                </p>
            </motion.div>
        </div>
    </section>
);

export default TrustSection;
