import { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";

/**
 * Uses Google Identity Services in a popup.  The browser stays on this site;
 * only the resulting credential is sent to our API for verification.
 */
export default function GoogleSignInButton({ label = "Continue with Google" }) {
  const { googleLogin } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  const handleSuccess = async (response) => {
    if (!response.credential) {
      toast.error("Google did not return a sign-in credential. Please try again.");
      return;
    }

    setSubmitting(true);
    try {
      await googleLogin(response.credential);
    } catch {
      // AuthContext presents the server error to the visitor.
    } finally {
      setSubmitting(false);
    }
  };

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-red-500/25 px-4 py-3 text-sm font-bold opacity-60"
      >
        {label} is unavailable
      </button>
    );
  }

  return (
    <div className={`mx-auto w-full max-w-[400px] ${submitting ? "pointer-events-none opacity-70" : ""}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in was cancelled or could not be opened.")}
        text={label.startsWith("Sign up") ? "signup_with" : "continue_with"}
        shape="pill"
        theme="outline"
        width="400"
      />
    </div>
  );
}
