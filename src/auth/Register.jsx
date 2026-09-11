import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import Logo from "../components/Logo";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const socialButtonClass = "relative mx-auto flex h-10 w-full max-w-[400px] items-center justify-center rounded-full border border-[#dadce0] bg-white px-4 text-sm font-medium text-[#3c4043] transition-colors hover:bg-[#f8faff]";

export default function RegisterModal({ isOpen, onClose, openLogin }) {
  const { user, register, verifyContactOTP, hydrateUser } = useContext(AuthContext);
  const [stage, setStage] = useState("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStage("form"); setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setOtp("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) onClose();
  }, [user, onClose]);

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) return toast.error("Please complete all fields.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      setStage("verify");
    } catch {
      // AuthContext shows a helpful API error.
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) return toast.error("Enter the 6-digit code sent to your email.");
    setSubmitting(true);
    try {
      const response = await verifyContactOTP({ email: email.trim(), channel: "email", otp });
      if (response.completedRegistration && response.user) {
        hydrateUser(response.user);
        toast.success("Email verified and account created.");
      }
    } catch {
      // AuthContext shows a helpful API error.
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pb-4 pt-[4.35rem] sm:px-5 sm:pb-5 sm:pt-[5.2rem]">
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="mt-1 w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-xl sm:mt-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3.5 sm:px-5 sm:py-4"><div className="flex items-center gap-2"><Logo size={22} showText={false} /><h2 className="text-base font-bold sm:text-lg">{stage === "form" ? "Create Account" : "Verify your email"}</h2></div><button type="button" onClick={onClose} aria-label="Close register"><X size={20} /></button></div>
          <div className="space-y-4 p-4 sm:p-5">
            {stage === "form" ? <>
              <form onSubmit={handleRegister} className="space-y-3 rounded-2xl border border-[var(--border)] p-4" style={{ background: "var(--bg-card-inner)" }}>
                <div><label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">Full name</label><div className="relative"><UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Your name" className="w-full rounded-xl border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500" /></div></div>
                <div><label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">Email address</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500" /></div></div>
                <div><label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">Create password</label><div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="At least 6 characters" className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 pr-11 text-sm outline-none focus:border-red-500" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
                <div><label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">Confirm password</label><input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder="Re-enter your password" className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none focus:border-red-500" /></div>
                <p className="text-xs text-slate-500">Registration and verification are email-only. We do not require a phone number.</p>
                <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60">{submitting ? <Loader2 size={17} className="animate-spin" /> : null}{submitting ? "Sending code..." : "Create account"}</button>
              </form>
              <div className="flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-[var(--border)]" />or continue with<span className="h-px flex-1 bg-[var(--border)]" /></div>
              <div className="space-y-2.5"><GoogleSignInButton label="Sign up with Google" /><button type="button" onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/facebook`; }} className={socialButtonClass}><img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" className="absolute left-3 h-5 w-5" alt="" />Sign up with Facebook</button><button type="button" onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/linkedin`; }} className={socialButtonClass}><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="absolute left-3 h-5 w-5" alt="" />Sign up with LinkedIn</button></div>
              <p className="pt-1 text-center text-xs text-gray-400">Already have an account?<button type="button" onClick={openLogin} className="ml-1.5 font-bold text-red-600 hover:underline">Login</button></p>
            </> : <form onSubmit={handleVerify} className="space-y-4 rounded-2xl border border-[var(--border)] p-5 text-center" style={{ background: "var(--bg-card-inner)" }}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"><ShieldCheck size={25} /></div><div><h3 className="font-bold">Check your inbox</h3><p className="mt-1 text-sm text-slate-500">We sent a 6-digit verification code to <strong>{email}</strong>.</p></div><input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="Enter 6-digit code" className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-center text-lg font-bold tracking-[0.35em] outline-none focus:border-red-500" /><button type="submit" disabled={submitting || otp.length !== 6} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white disabled:opacity-60">{submitting ? <Loader2 size={17} className="animate-spin" /> : null}{submitting ? "Verifying..." : "Verify email"}</button><button type="button" onClick={() => setStage("form")} className="text-xs font-medium text-red-600 hover:underline">Use another email</button></form>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
