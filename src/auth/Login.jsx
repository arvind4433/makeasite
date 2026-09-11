import { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  X,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Phone,
  AlertCircle,
  Lock
} from "lucide-react";
import OTPModal from "../components/OTPModal";
import { API_BASE_URL } from "../config/api";
import Logo from "../components/Logo";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

export default function LoginModal({
  isOpen,
  onClose,
  openRegister,
  openForgotPassword
}) {
  const { login, user } = useContext(AuthContext);

  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    toast.info("Manual login abhi allow nahi kiya gaya hai. Kripya Google ya Social Account se login karein!");
  };

  useEffect(() => {
    if (user) {
      setShowOTP(false);
      onClose();
    }
  }, [user, onClose]);

  const facebookLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/facebook`;
  };

  const linkedinLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/linkedin`;
  };

  if (!isOpen) return null;

  return (
    <>
      {showOTP ? (
        <OTPModal
          isOpen={showOTP}
          email={otpIdentifier.includes("@") ? otpIdentifier : undefined}
          phone={!otpIdentifier.includes("@") ? otpIdentifier : undefined}
          onVerified={() => {
            setShowOTP(false);
            onClose();
          }}
          onClose={() => setShowOTP(false)}
        />
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pb-4 pt-[4.35rem] sm:px-5 sm:pb-5 sm:pt-[5.2rem]"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="mt-1 w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-xl max-h-[calc(100vh-5.25rem)] sm:mt-3 sm:max-h-[calc(100vh-6.25rem)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3.5 sm:px-5 sm:py-4">
                <div className="flex items-center gap-2">
                  <Logo size={22} showText={false} />
                  <h2 className="text-base font-bold sm:text-lg">Login</h2>
                </div>

                <button type="button" onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                {/* Email & Password (Blurred & Feature Locked) */}
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] p-4 bg-[var(--bg-card-inner)]">
                  {/* Blurred Form Fields */}
                  <div className="space-y-3 filter blur-[1.5px] opacity-35 select-none pointer-events-none">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-600 dark:text-slate-400">Email Address / Number</label>
                      <input
                        type="text"
                        disabled
                        placeholder="you@example.com / +91..."
                        className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm bg-transparent"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-bold mb-1 text-slate-600 dark:text-slate-400">Password</label>
                      <input
                        type="password"
                        disabled
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Lock Overlay Badge */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 dark:bg-black/30 backdrop-blur-[1px]">
                    <div className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-4 py-1.5 shadow-md">
                      <Lock size={14} className="text-amber-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide">Locked (Feature Under Development)</span>
                    </div>
                  </div>
                </div>

                {/* Vertically Stacked Social Logins (Google -> Facebook -> LinkedIn) */}
                <div className="space-y-2.5 pt-1">
                  {/* Google Button */}
                  <GoogleSignInButton />

                  {/* Facebook Button */}
                  <button
                    type="button"
                    onClick={facebookLogin}
                    className="relative mx-auto flex h-10 w-full max-w-[400px] items-center justify-center rounded-full border border-[#dadce0] bg-white px-4 text-sm font-medium text-[#3c4043] transition-colors hover:bg-[#f8faff]"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
                      className="absolute left-3 h-5 w-5"
                      alt="Facebook"
                    />
                    <span>Continue with Facebook</span>
                  </button>

                  {/* LinkedIn Button */}
                  <button
                    type="button"
                    onClick={linkedinLogin}
                    className="relative mx-auto flex h-10 w-full max-w-[400px] items-center justify-center rounded-full border border-[#dadce0] bg-white px-4 text-sm font-medium text-[#3c4043] transition-colors hover:bg-[#f8faff]"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                      className="absolute left-3 h-5 w-5"
                      alt="LinkedIn"
                    />
                    <span>Continue with LinkedIn</span>
                  </button>
                </div>

                {/* Footer Switch to Register */}
                <div className="pt-2 text-center text-xs text-gray-400">
                  Don&apos;t have an account?
                  <button
                    type="button"
                    onClick={openRegister}
                    className="text-red-600 font-bold ml-1.5 hover:underline"
                  >
                    Register
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
