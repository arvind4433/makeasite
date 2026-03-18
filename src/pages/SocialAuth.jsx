import { useEffect, useContext, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import AuthSuccessCard from "../components/AuthSuccessCard";

export default function SocialAuth() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { hydrateUser } = useContext(AuthContext);
  const hasStartedRef = useRef(false);
  const [status, setStatus] = useState("loading");
  const provider = params.get("provider") || "social";

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      toast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in failed. Please try again.`);
      navigate("/", { replace: true });
      return;
    }

    const run = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Unable to load your profile");
        const data = await res.json();

        hydrateUser({
          token,
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar,
          role: data.role,
          preferences: data.preferences
        });

        setStatus("success");
        window.setTimeout(() => navigate("/", { replace: true }), 1800);
      } catch {
        toast.error('Social sign-in failed. Please try again.');
        navigate("/", { replace: true });
      }
    };

    run();
  }, [params, navigate, hydrateUser, provider]);

  if (status === "success") {
    return <AuthSuccessCard message="Login Successfully" />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
        </div>
        <p className="text-lg font-medium text-slate-800">Completing your {provider} sign-in...</p>
      </div>
    </div>
  );
}
