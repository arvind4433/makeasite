import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo.jsx';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'MakeASite';

const NUM_DOTS = 8;

const PageLoader = ({ visible }) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="page-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #060b17 0%, #0a0a1a 50%, #0f0a0a 100%)',
                    }}
                >
                    {/* Subtle background glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,38,38,0.06) 0%, transparent 70%)',
                        }}
                    />

                    {/* Loader ring assembly */}
                    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>

                        {/* Outer SVG arc — smooth rotating gradient */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                            className="absolute inset-0"
                        >
                            <svg viewBox="0 0 120 120" width="120" height="120">
                                <defs>
                                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0" />
                                        <stop offset="40%" stopColor="#dc2626" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="#f87171" stopOpacity="1" />
                                    </linearGradient>
                                </defs>
                                {/* Track ring */}
                                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(220,38,38,0.1)" strokeWidth="3" />
                                {/* Animated arc */}
                                <circle
                                    cx="60" cy="60" r="52"
                                    fill="none"
                                    stroke="url(#arcGrad)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray={`${Math.PI * 2 * 52 * 0.6} ${Math.PI * 2 * 52 * 0.4}`}
                                />
                            </svg>
                        </motion.div>

                        {/* Orbiting dots ring */}
                        <div className="absolute inset-0">
                            {Array.from({ length: NUM_DOTS }).map((_, i) => {
                                const angle = (i / NUM_DOTS) * 360;
                                const delay = (i / NUM_DOTS) * -1.8;
                                const rad = (angle * Math.PI) / 180;
                                const x = 60 + 52 * Math.cos(rad) - 60; // offset from center
                                const y = 60 + 52 * Math.sin(rad) - 60;
                                const isLarge = i % 2 === 0;
                                return (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.15, 1, 0.15] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.8,
                                            delay,
                                            ease: 'easeInOut',
                                        }}
                                        className="absolute rounded-full"
                                        style={{
                                            width: isLarge ? 6 : 4,
                                            height: isLarge ? 6 : 4,
                                            background: isLarge ? '#dc2626' : '#fca5a5',
                                            top: `calc(50% + ${y}px - ${isLarge ? 3 : 2}px)`,
                                            left: `calc(50% + ${x}px - ${isLarge ? 3 : 2}px)`,
                                        }}
                                    />
                                );
                            })}
                        </div>

                        {/* Inner pulse ring */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.08, 0.25] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                            className="absolute rounded-full"
                            style={{
                                width: 70,
                                height: 70,
                                border: '1.5px solid rgba(220,38,38,0.4)',
                                background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)',
                            }}
                        />

                        {/* Center logo tile */}
                        <motion.div
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                            className="relative z-10 flex items-center justify-center"
                        >
                            <Logo showText={false} size={42} />
                        </motion.div>
                    </div>

                    {/* Brand name */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mt-7 flex items-baseline"
                        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.02em' }}
                    >
                        <span style={{ color: '#f1f5f9' }}>{APP_NAME}</span>
                    </motion.div>

                    {/* Subtitle with blinking cursor */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-xs tracking-[0.22em] uppercase"
                        style={{ color: 'rgba(220,38,38,0.65)', fontWeight: 500 }}
                    >
                        Loading
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                        >
                            …
                        </motion.span>
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PageLoader;
