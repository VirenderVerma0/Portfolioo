"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Check password reset flow
      const isPasswordReset =
        searchParams.get("reset") === "true" ||
        localStorage.getItem("passwordResetFlow") === "true";

      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, isPasswordReset }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isPasswordReset) {
          setSuccess("OTP verified successfully! Redirecting to reset password...");
          localStorage.removeItem("passwordResetFlow");

          setTimeout(() => {
            router.push(`/ResetPassword?email=${encodeURIComponent(email)}`);
          }, 2000);
        } else {
          setSuccess("Account verified successfully! Redirecting to login...");
          setTimeout(() => {
            router.push("/Signin");
          }, 2000);
        }
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setCountdown(60); // 60 seconds countdown
    setError("");
    setSuccess("");

    try {
      const isPasswordReset =
        searchParams.get("reset") === "true" ||
        localStorage.getItem("passwordResetFlow") === "true";

      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, isPasswordReset }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("OTP resent successfully! Check your email.");
      } else {
        setError(data.error || "Failed to resend OTP");
        setResendDisabled(false);
        setCountdown(0);
      }
    } catch (error) {
      setError("Network error. Please try again.");
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center px-4">
      {/* Logo */}
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 24 24"
          strokeWidth="1.5"
          stroke="#6366f1"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5c2.121 0 3.75 1.629 3.75 3.75S14.121 12 12 12s-3.75-1.629-3.75-3.75S9.879 4.5 12 4.5zM12 12v7.5"
          />
        </svg>
      </div>

      <div className="bg-[#1e293b] p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
              placeholder="Enter 6-digit OTP"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          {success && (
            <div className="text-green-400 text-sm text-center">{success}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Didn't receive OTP?{" "}
          <button
            onClick={handleResend}
            disabled={resendDisabled}
            className={`hover:underline ${resendDisabled ? 'text-gray-500 cursor-not-allowed' : 'text-indigo-400'}`}
          >
            {resendDisabled ? `Resend in ${countdown}s` : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
