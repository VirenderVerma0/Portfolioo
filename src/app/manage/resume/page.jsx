"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const ManageResumePage = () => {
  const { user, updateUser } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || "");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setResumeUrl(user?.resumeUrl || "");
  }, [user]);

  const handleFileChange = (event) => {
    setError("");
    setMessage("");
    const file = event.target.files?.[0];
    setResumeFile(file);
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      setError("Please select a resume file first.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await fetch("/api/upload/resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setResumeUrl(result.user?.resumeUrl || result.data?.url || "");
        updateUser(result.user || { resumeUrl: result.data?.url });
        setMessage("Resume uploaded successfully.");
        setResumeFile(null);
      } else {
        setError(result.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      setError("Unexpected error while uploading resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    if (!resumeUrl) return;
    window.open(resumeUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Latest Resume</h1>
          <p className="text-gray-400">
            Upload the latest PDF or Word resume for your portfolio. Once uploaded, it will be available for download from the public site.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">Select Resume File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
            <p className="text-sm text-gray-400">Allowed formats: PDF, DOC, DOCX. Maximum size 10MB.</p>
          </div>

          {resumeFile && (
            <div className="rounded-md bg-gray-900 border border-gray-700 p-4">
              <p className="text-sm text-gray-200">Selected file: {resumeFile.name} ({Math.round(resumeFile.size / 1024)} KB)</p>
            </div>
          )}

          {resumeUrl && (
            <div className="rounded-md bg-gray-900 border border-gray-700 p-4">
              <p className="text-sm text-gray-200 font-medium">Current resume URL</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-300 underline break-all"
                >
                  {resumeUrl}
                </a>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  Preview Resume
                </button>
              </div>
            </div>
          )}

          {(message || error) && (
            <div className={`rounded-md p-4 ${message ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>
              {message || error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-700">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageResumePage;
