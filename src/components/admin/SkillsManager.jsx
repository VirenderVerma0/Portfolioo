"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../ui/ConfirmModal";

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, id: null, message: "" });
  const [formData, setFormData] = useState({
    name: "",
    category: "Other",
    level: "Beginner",
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills");
      if (response.status === 401 || response.status === 403) {
        try { localStorage.removeItem("token"); } catch (e) {}
        window.location.href = "/signin";
        return;
      }

      if (response.status === 405) {
        setSkills([]);
        return;
      }

      const data = await response.json();
      setSkills(data?.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const url = editing ? `/api/skills/${editing._id}` : "/api/skills";
      const method = editing ? "PATCH" : "POST";

      // Build payload matching the Skill model: send `proficiency` instead of `level`
      const payload = {
        name: formData.name,
        category: formData.category,
        proficiency: formData.level,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resJson = await response.json().catch(() => null);
      if (response.status === 401 || response.status === 403 || (resJson && resJson.success === false && /invalid|expired/i.test(resJson.error || ""))) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const verifyResp = await fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } });
            if (verifyResp.ok) {
              console.error('Server rejected request despite valid token:', resJson || response.statusText);
            } else {
              try { localStorage.removeItem("token"); } catch (e) {}
              window.location.href = "/signin";
              return;
            }
          } catch (e) {
            try { localStorage.removeItem("token"); } catch (er) {}
            window.location.href = "/signin";
            return;
          }
        } else {
          try { localStorage.removeItem("token"); } catch (e) {}
          window.location.href = "/signin";
          return;
        }
      }

      if (response.ok) {
        await fetchSkills();
        resetForm();
        addToast("Saved successfully", "success");
      } else {
        console.error("Save failed:", resJson || response.statusText);
        addToast("Save failed", "error");
      }
    } catch (error) {
      console.error("Error saving skill:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resJson = await response.json().catch(() => null);
      if (response.status === 401 || response.status === 403 || (resJson && resJson.success === false && /invalid|expired/i.test(resJson.error || ""))) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const verifyResp = await fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } });
            if (verifyResp.ok) {
              console.error('Server rejected delete despite valid token:', resJson || response.statusText);
            } else {
              try { localStorage.removeItem("token"); } catch (e) {}
              window.location.href = "/signin";
              return;
            }
          } catch (e) {
            try { localStorage.removeItem("token"); } catch (er) {}
            window.location.href = "/SignIn";
            return;
          }
        } else {
          try { localStorage.removeItem("token"); } catch (e) {}
          window.location.href = "/signin";
          return;
        }
      }

      if (response.ok) {
        await fetchSkills();
        addToast("Deleted successfully", "success");
      } else {
        console.error("Delete failed:", resJson || response.statusText);
        addToast("Delete failed", "error");
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill) => {
    setEditing(skill);
    setFormData({
      name: skill.name,
      category: skill.category || "Other",
      level: skill.proficiency || "Beginner",
    });
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: "",
      category: "Other",
      level: "Beginner",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {submitting && (
        <div className="absolute inset-0 bg-gray-900/60 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Manage Skills</h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-gray-700 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
              required
            >
              <option>Frontend</option>
              <option>Backend</option>
              <option>Database</option>
              <option>Tools</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Level
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            {editing ? "Update Skill" : "Add Skill"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Existing Skills</h3>
        {skills.length === 0 ? (
          <p className="text-gray-400">No skills found.</p>
        ) : (
          skills.map((skill) => (
            <div
              key={skill._id}
              className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h4 className="text-lg font-medium">{skill.name}</h4>
                <p className="text-gray-300 text-sm">
                  Category: {skill.category}
                  {skill.proficiency && ` • Level: ${skill.proficiency}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmState({ open: true, id: skill._id, message: "Are you sure you want to delete this skill?" })}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmModal
        open={confirmState.open}
        title="Delete Skill"
        message={confirmState.message}
        onCancel={() => setConfirmState({ open: false, id: null, message: "" })}
        onConfirm={() => {
          const id = confirmState.id;
          setConfirmState({ open: false, id: null, message: "" });
          handleDelete(id);
        }}
      />
    </div>
  );
};

export default SkillsManager;
