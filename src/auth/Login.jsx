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
  AlertCircle
} from "lucide-react";
import OTPModal from "../components/OTPModal";
import { API_BASE_URL } from "../config/api";
import Logo from "../components/Logo";
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

  const googleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

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
                {/* Notice Banner */}
                <div className="rounded-2xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5 shadow-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong>Notice:</strong> Yeh manual login abhi allow nahi kiya gaya hai. Aap niche diye gaye <strong>Google / Social Account</strong> se directly login kar sakte hain!
                  </div>
                </div>

                {/* Prominent Social Login Options */}
                <div>
                  <button
                    type="button"
                    onClick={googleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-red-500/30 hover:border-red-500 px-4 py-3 text-sm font-bold shadow-sm transition-all hover:scale-[1.01]"
                    style={{ background: 'var(--bg-card-inner)' }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                      className="w-5 h-5"
                      alt="Google"
                    />
                    Continue with Google (Recommended)
                  </button>

                  <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                    <button
                      type="button"
                      onClick={facebookLogin}
                      className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
                        className="w-4 h-4"
                        alt="Facebook"
                      />
                      Facebook
                    </button>

                    <button
                      type="button"
                      onClick={linkedinLogin}
                      className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                        className="w-4 h-4"
                        alt="LinkedIn"
                      />
                      LinkedIn
                    </button>
                  </div>
                </div>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wider"><span className="bg-[var(--bg-card)] px-2 text-slate-400 font-semibold">Or Manual Sign-In (Under Maintenance)</span></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-3 opacity-75">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-600 dark:text-slate-400">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2 pr-12 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 hover:bg-slate-800 px-4 py-2 text-white text-sm font-semibold"
                  >
                    Continue
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    Don&apos;t have an account?
                    <button
                      type="button"
                      onClick={openRegister}
                      className="text-red-600 font-bold ml-1"
                    >
                      Register
                    </button>
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
