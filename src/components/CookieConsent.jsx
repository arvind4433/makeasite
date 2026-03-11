import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 sm:max-w-md pointer-events-none"
                >
                    <div className="glass-card shadow-2xl rounded-2xl p-6 pointer-events-auto border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f172a] relative">
                        <button
                            onClick={handleDecline}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                        <div className="flex items-start mb-4">
                            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-xl mr-4 text-indigo-600 dark:text-indigo-400">
                                <Cookie size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Cookie Setup</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    We use cookies to improve your browsing experience, analyze site traffic, and secure your session data.
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-3 w-full">
                            <button
                                onClick={handleAccept}
                                className="flex-1 primary-btn py-2.5 rounded-xl font-bold transition-transform hover:scale-105 shadow text-sm"
                            >
                                Accept Necessary
                            </button>
                            <button
                                onClick={handleDecline}
                                className="flex-1 secondary-btn py-2.5 rounded-xl font-bold bg-gray-100 dark:bg-[#1e293b] text-sm"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
