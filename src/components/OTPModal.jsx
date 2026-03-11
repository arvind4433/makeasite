import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Asterisk } from 'lucide-react';
import { toast } from 'sonner';

const OTPModal = ({ isOpen, onClose, onVerify, email, loading }) => {
    const [otp, setOtp] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length < 6) {
            toast.error('OTP must be at least 6 characters');
            return;
        }
        await onVerify(email, otp);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-slate-900/40 dark:bg-[#020617]/80 backdrop-blur-sm z-50" onClick={onClose} />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 max-w-sm w-full shadow-2xl pointer-events-auto border border-gray-200 dark:border-slate-800"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                                    <ShieldCheck size={28} />
                                </div>
                                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verify it's you</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                                We've sent a 6-digit verification code to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>. It expires in 5 minutes.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6 relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Asterisk size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="000000"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#1e293b] border border-gray-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-400/70 font-mono text-lg tracking-widest text-center"
                                        autoFocus
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium py-3.5 rounded-xl shadow-sm transition-all flex justify-center items-center"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Continue'}
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                                Didn't receive the code? <button className="text-blue-600 dark:text-blue-400 hover:underline">Resend</button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OTPModal;
