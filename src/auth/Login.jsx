import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, X } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import Logo from "../components/Logo";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const socialButtonClass = "relative mx-auto flex h-10 w-full max-w-[400px] items-center justify-center rounded-full border border-[#dadce0] bg-white px-4 text-sm font-medium text-[#3c4043] transition-colors hover:bg-[#f8faff]";

export default function LoginModal({ isOpen, onClose, openRegister, openForgotPassword }) {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) onClose();
  }, [user, onClose]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) return toast.error("Please enter your email and password.");
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      toast.success("Login successful");
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
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="flex items-center gap-2"><Logo size={22} showText={false} /><h2 className="text-base font-bold sm:text-lg">Login</h2></div>
            <button type="button" onClick={onClose} aria-label="Close login"><X size={20} /></button>
          </div>
          <div className="space-y-4 p-4 sm:p-5">
            <form onSubmit={handleLogin} className="space-y-3 rounded-2xl border border-[var(--border)] p-4" style={{ background: "var(--bg-card-inner)" }}>
              <div><label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">Email address</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-500" /></div></div>
              <div><label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">Password</label><div className="relative"><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 pr-11 text-sm outline-none focus:border-red-500" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
              <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60">{submitting ? <Loader2 size={17} className="animate-spin" /> : null}{submitting ? "Logging in..." : "Login with Email"}</button>
              <button type="button" onClick={openForgotPassword} className="w-full text-center text-xs font-medium text-red-600 hover:underline">Forgot password?</button>
            </form>
            <div className="flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-[var(--border)]" />or continue with<span className="h-px flex-1 bg-[var(--border)]" /></div>
            <div className="space-y-2.5"><GoogleSignInButton /><button type="button" onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/facebook`; }} className={socialButtonClass}><img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" className="absolute left-3 h-5 w-5" alt="" />Continue with Facebook</button><button type="button" onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/linkedin`; }} className={socialButtonClass}><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="absolute left-3 h-5 w-5" alt="" />Continue with LinkedIn</button></div>
            <p className="pt-1 text-center text-xs text-gray-400">Don&apos;t have an account?<button type="button" onClick={openRegister} className="ml-1.5 font-bold text-red-600 hover:underline">Register</button></p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
