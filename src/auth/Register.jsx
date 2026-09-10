import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, Loader2, Mail, Phone, ShieldCheck, X, AlertCircle, Lock } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import Logo from "../components/Logo";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const OtpRow = ({
  channel,
  label,
  value,
  verified,
  disabled,
  onChange,
  onVerify,
  verifying
}) => (
  <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-card-inner)' }}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm font-bold">
          {channel === "email" ? <Mail size={16} /> : <Phone size={16} />}
          {label}
        </div>
        <div className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {verified ? "Verified successfully" : "Enter the verification OTP and click verify."}
        </div>
      </div>
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
        {verified ? <CheckCircle2 size={14} /> : <ShieldCheck size={14} />}
        {verified ? "Verified" : "Pending"}
      </span>
    </div>

    {!verified ? (
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter OTP"
          className="flex-1 rounded-xl border px-4 py-3"
          disabled={disabled || verifying}
        />
        <button
          type="button"
          onClick={() => onVerify(channel)}
          disabled={disabled || verifying || value.length < 5}
          className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {verifying ? "Verifying..." : "Verify"}
        </button>
      </div>
    ) : null}
  </div>
);

export default function RegisterModal({ isOpen, onClose, openLogin }) {
  const { user, register, verifyContactOTP, hydrateUser } = useContext(AuthContext);

  const [stage, setStage] = useState("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpValues, setOtpValues] = useState({ email: "", phone: "" });
  const [verificationState, setVerificationState] = useState({ emailVerified: false, phoneVerified: false });
  const [submitting, setSubmitting] = useState(false);
  const [verifyingChannel, setVerifyingChannel] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStage("form");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setOtpValues({ email: "", phone: "" });
      setVerificationState({ emailVerified: false, phoneVerified: false });
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) onClose();
  }, [user, onClose]);

  const handleRegister = async (e) => {
    e.preventDefault();
    toast.info("Manual registration abhi allow nahi kiya gaya hai. Kripya Google ya Social Account se sign up karein!");
  };

  const handleVerify = async (channel) => {
    setVerifyingChannel(channel);
    try {
      const response = await verifyContactOTP({
        channel,
        otp: otpValues[channel],
        email: email.trim(),
        phone
      });

      setVerificationState({
        emailVerified: Boolean(response.emailVerified),
        phoneVerified: Boolean(response.phoneVerified)
      });

      if (response.completedRegistration && response.user) {
        hydrateUser(response.user);
        setTimeout(() => {
          onClose();
        }, 1400);
      }
    } finally {
      setVerifyingChannel("");
    }
  };

  const googleSignup = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const facebookSignup = () => {
    window.location.href = `${API_BASE_URL}/api/auth/facebook`;
  };

  const linkedinSignup = () => {
    window.location.href = `${API_BASE_URL}/api/auth/linkedin`;
  };

  if (!isOpen) return null;

  return (
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
              <h2 className="text-base font-bold sm:text-lg">{stage === "form" ? "Create Account" : "Verify Your Account"}</h2>
            </div>

            <button type="button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            {stage === "form" ? (
              <>
                {/* Form Fields (Blurred & Feature Locked) */}
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] p-4 bg-[var(--bg-card-inner)]">
                  {/* Blurred Form Fields */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 filter blur-[1.5px] opacity-35 select-none pointer-events-none">
                    <input
                      type="text"
                      disabled
                      placeholder="Full Name"
                      className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm bg-transparent"
                    />

                    <input
                      type="email"
                      disabled
                      placeholder="Email address"
                      className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm bg-transparent"
                    />

                    <div className="sm:col-span-2">
                      <input
                        type="password"
                        disabled
                        placeholder="Create password"
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

                {/* Vertically Stacked Social Signups (Google -> Facebook -> LinkedIn) */}
                <div className="space-y-2.5 pt-1">
                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={googleSignup}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-red-500/25 hover:border-red-500 px-4 py-3 text-sm font-bold shadow-sm transition-all hover:scale-[1.01]"
                    style={{ background: 'var(--bg-card-inner)' }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                      className="w-5 h-5"
                      alt="Google"
                    />
                    <span>Sign up with Google</span>
                  </button>

                  {/* Facebook Button */}
                  <button
                    type="button"
                    onClick={facebookSignup}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-500/30 hover:border-blue-500 px-4 py-3 text-sm font-bold shadow-sm transition-all hover:scale-[1.01]"
                    style={{ background: 'var(--bg-card-inner)' }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
                      className="w-5 h-5"
                      alt="Facebook"
                    />
                    <span>Sign up with Facebook</span>
                  </button>

                  {/* LinkedIn Button */}
                  <button
                    type="button"
                    onClick={linkedinSignup}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-sky-500/30 hover:border-sky-500 px-4 py-3 text-sm font-bold shadow-sm transition-all hover:scale-[1.01]"
                    style={{ background: 'var(--bg-card-inner)' }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                      className="w-5 h-5"
                      alt="LinkedIn"
                    />
                    <span>Sign up with LinkedIn</span>
                  </button>
                </div>

                {/* Footer Switch to Login */}
                <div className="pt-2 text-center text-xs text-gray-400">
                  Already have account?
                  <button
                    type="button"
                    onClick={openLogin}
                    className="text-red-600 font-bold ml-1.5 hover:underline"
                  >
                    Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl border px-4 py-3 text-[13px] leading-5 sm:text-sm sm:leading-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-card-inner)', color: 'var(--text-secondary)' }}>
                  Enter the 6-digit OTP sent to <strong>{email}</strong> to activate your account.
                </div>

                <OtpRow
                  channel="email"
                  label={`Email OTP for ${email}`}
                  value={otpValues.email}
                  verified={verificationState.emailVerified}
                  disabled={false}
                  verifying={verifyingChannel === "email"}
                  onChange={(value) => setOtpValues((current) => ({ ...current, email: value }))}
                  onVerify={handleVerify}
                />

                <p className="text-center text-[13px] text-gray-400 sm:text-sm">
                  Already have account?
                  <button type="button" onClick={openLogin} className="text-red-600 ml-1">
                    Login
                  </button>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
