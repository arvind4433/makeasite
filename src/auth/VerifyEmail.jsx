import { useState } from "react";
import { useVerifyOtpMutation } from "../services/auth";

export default function VerifyEmail() {

  const [otp,setOtp] = useState("");

  const [
    verifyOtp,
    {isLoading}
  ] = useVerifyOtpMutation();

  const handleSubmit = async(e)=>{

    e.preventDefault();

    if(!otp) return;

    await verifyOtp({otp});

  };

  return (

    <div className="max-w-md mx-auto mt-20">

      <h2 className="text-xl font-bold mb-4">
        Verify Email
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e)=>setOtp(e.target.value)}
          className="w-full border p-3 rounded-lg text-center"
        />

        <button
          disabled={isLoading}
          className="w-full bg-black text-white p-3 rounded-lg"
        >

          {isLoading ? "Verifying..." : "Verify"}

        </button>

      </form>

    </div>

  );
}