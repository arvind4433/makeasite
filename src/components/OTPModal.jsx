import { useState, useContext, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function OTPModal({
  isOpen,
  email,
  phone,
  onClose,
  onVerified
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { verifyOTP } = useContext(AuthContext);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted.length) return;
    const nextOtp = [...otp];
    for (let i = 0; i < 6; i += 1) nextOtp[i] = pasted[i] || "";
    setOtp(nextOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return;

    setLoading(true);
    try {
      await verifyOTP(email || phone, code);
      onVerified?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="w-full max-w-lg bg-[var(--bg-card)] rounded-2xl border border-[var(--border-strong)] shadow-xl relative z-[81]">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold">OTP Verification</h2>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500 text-center">
            We sent a 6-digit code to
            <br />
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {email || phone}
            </span>
          </p>

          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: digit ? 'var(--accent-primary)' : 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            ))}
          </div>

          <button type="button" onClick={handleVerify} disabled={loading || otp.join("").length < 6} className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl flex justify-center items-center font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button type="button" onClick={onClose} className="w-full p-3 border rounded-xl transition-colors" style={{ borderColor: 'var(--border)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
