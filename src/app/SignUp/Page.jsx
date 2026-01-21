"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // First, register the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If registration successful and user uploaded a photo, upload it
        if (form.profilePhoto) {
          try {
            const formData = new FormData();
            formData.append('image', form.profilePhoto);

            const uploadResponse = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json();
              const photoUrl = uploadData.data.url;

              // Update user's profile photo
              const updateResponse = await fetch('/api/user/profile-photo', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${data.token}`,
                },
                body: JSON.stringify({ photoUrl }),
              });

              if (!updateResponse.ok) {
                console.warn('Profile photo update failed, but registration was successful');
              }
            } else {
              console.warn('Photo upload failed, but registration was successful');
            }
          } catch (photoError) {
            console.warn('Photo upload error:', photoError);
            // Don't fail registration if photo upload fails
          }
        }

        setSuccess("Registration successful! Check your email for OTP.");
        setTimeout(() => {
          router.push(`/VerifyOTP?email=${encodeURIComponent(form.email)}`);
        }, 2000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center px-4">
      {/* Logo */}
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Profile Photo (Optional)</label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-[#0f172a] text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPEG, PNG, GIF, WebP, SVG, BMP, TIFF, AVIF, HEIC, HEIF. Max size: 5MB.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
          >
            Sign up
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
export default Signup;
