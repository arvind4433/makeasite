import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-sm bg-[var(--bg-card)] rounded-2xl border border-[var(--border-strong)] shadow-xl"
        >

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Confirm Logout
            </h2>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">

            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <LogOut size={24} className="text-red-500" />
              </div>
              <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                Are you sure you want to logout?<br />
                You will need to verify OTP again on next login.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 p-3 rounded-xl border font-semibold transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
              >
                Logout
              </button>
            </div>

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}