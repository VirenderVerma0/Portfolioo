"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ImageUpload from "@/components/ui/ImageUpload";
import { useRouter } from "next/navigation";

const ManageProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setProfilePhoto(user?.profilePhoto || "");
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/profile-photo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photoUrl: profilePhoto }),
      });

      const result = await response.json();
      if (result.success) {
        updateUser(result.user);
        alert("Profile photo updated successfully!");
        router.push("/");
      } else {
        alert("Failed to update profile photo: " + result.error);
      }
    } catch (error) {
      console.error("Error updating profile photo:", error);
      alert("An error occurred while updating profile photo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Profile</h1>
          <p className="text-gray-400">Update your profile picture and personal information.</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
            <ImageUpload
              value={profilePhoto}
              onChange={setProfilePhoto}
              label="Upload or enter URL for your profile picture"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProfilePage;
