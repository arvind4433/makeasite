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
  Phone
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

    const identifier = mode === "email" ? email.trim() : phone;

    if (!identifier) {
      toast.error(mode === "email" ? "Email is required" : "Phone is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await login(
        mode === "email"
          ? { email: identifier, password }
          : { phone: identifier, password }
      );
      setOtpIdentifier(response.identifier || identifier);
      setShowOTP(true);
    } finally {
      setSubmitting(false);
    }
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

              <div className="space-y-2.5 p-3.5 sm:space-y-3 sm:p-4">
                <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-white/5">
                  <button
                    type="button"
                    onClick={() => setMode("email")}
                    className={`flex-1 rounded-lg py-1.5 text-sm flex items-center justify-center gap-2 ${
                      mode === "email" ? "bg-white dark:bg-black shadow" : ""
                    }`}
                  >
                    <Mail size={16} />
                    Email
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("phone")}
                    className={`flex-1 rounded-lg py-1.5 text-sm flex items-center justify-center gap-2 ${
                      mode === "phone" ? "bg-white dark:bg-black shadow" : ""
                    }`}
                  >
                    <Phone size={16} />
                    Phone
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-2 sm:space-y-2.5">
                  {mode === "email" && (
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2"
                    />
                  )}

                  {mode === "phone" && (
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={phone}
                      onChange={setPhone}
                      className="w-full rounded-xl border px-4 py-2"
                    />
                  )}

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="rounded-2xl border px-4 py-1.5 text-[13px] leading-5 sm:text-sm sm:leading-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-card-inner)', color: 'var(--text-secondary)' }}>
                    Enter your {mode === "email" ? "email" : "phone number"} and password. After that, we&apos;ll send a one-time verification code.
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Sending OTP
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>

                  <div className="text-center text-[13px] text-gray-400 sm:text-sm">or login with</div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={googleLogin}
                      className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                        className="w-5"
                      />
                      Google
                    </button>

                    <button
                      type="button"
                      onClick={facebookLogin}
                      className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
                        className="w-5"
                      />
                      Facebook
                    </button>

                    <button
                      type="button"
                      onClick={linkedinLogin}
                      className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                        className="w-5"
                      />
                      LinkedIn
                    </button>
                  </div>
                </form>

                <p className="pt-0.5 text-center text-[13px] text-gray-400 sm:text-sm">
                  Don&apos;t have an account?
                  <button
                    type="button"
                    onClick={openRegister}
                    className="text-red-600 ml-1"
                  >
                    Register
                  </button>
                </p>
                <p className="text-center text-[13px] text-gray-400 sm:text-sm">
                  Forgot your password?
                  <button
                    type="button"
                    onClick={openForgotPassword}
                    className="ml-1 text-red-600"
                  >
                    Reset it
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
