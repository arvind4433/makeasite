import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SocialLogin() {

  const navigate = useNavigate();

  useEffect(() => {

    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {

      localStorage.setItem(
        "userInfo",
        JSON.stringify({ token })
      );

      navigate("/dashboard");

    }

  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Signing you in...</p>
    </div>
  );
}