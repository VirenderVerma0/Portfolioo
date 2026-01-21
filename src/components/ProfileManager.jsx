"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ImageUpload from "@/components/ui/ImageUpload";

const ProfileManager = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
  const [saving, setSaving] = useState(false);

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
        onClose();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Manage Profile</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Profile Picture</h2>
            <ImageUpload
              value={profilePhoto}
              onChange={setProfilePhoto}
              label="Upload or enter URL for your profile picture"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
