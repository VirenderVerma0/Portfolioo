"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../ui/ConfirmModal";

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    period: "",
    description: "",
    techStack: "",
  });
  const [confirmState, setConfirmState] = useState({ open: false, id: null, message: "" });
  const { addToast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/experience");
      if (response.status === 401 || response.status === 403) {
        // Invalid or expired token — clear and redirect to sign in
        try { localStorage.removeItem("token"); } catch (e) {}
        window.location.href = "/signin";
        return;
      }

      if (response.status === 405) {
        setExperiences([]);
        return;
      }

      const data = await response.json();
      const items = (data?.data || []).map((it) => {
        // Normalize backend model to UI-friendly shape
        const start = it.startDate ? new Date(it.startDate) : null;
        const end = it.endDate ? new Date(it.endDate) : null;
        const format = (d) => d ? d.toLocaleString("en-US", { month: "short", year: "numeric" }) : null;
        const period = start ? `${format(start)} - ${it.isCurrent ? "Present" : (end ? format(end) : "")}` : "";
        return {
          _id: it._id,
          jobTitle: it.role,
          company: it.company,
          location: it.location,
          period,
          description: (it.description || "").split("\n").filter(Boolean),
          techStack: it.technologies || [],
        };
      });
      setExperiences(items);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");

    // Convert UI form into backend model payload
    const parsePeriod = (periodStr) => {
      const parts = periodStr.split("-").map((p) => p.trim());
      const parsePart = (p) => {
        if (!p) return null;
        if (/^\d{4}$/.test(p)) return new Date(`${p}-01-01`);
        const parsed = Date.parse(p);
        return isNaN(parsed) ? null : new Date(parsed);
      };
      const start = parsePart(parts[0]);
      const rawEnd = parts[1] || "";
      const isCurrent = /present/i.test(rawEnd) || rawEnd === "";
      const end = isCurrent ? null : parsePart(rawEnd);
      return { start, end, isCurrent };
    };

    const { start, end, isCurrent } = parsePeriod(formData.period || "");

    const experienceData = {
      role: formData.jobTitle,
      company: formData.company,
      location: formData.location || "",
      startDate: start,
      endDate: end,
      isCurrent: !!isCurrent,
      description: (formData.description || "").split("\n").map((l) => l.trim()).filter(Boolean).join("\n"),
      technologies: (formData.techStack || "").split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const url = editing ? `/api/experience/${editing._id}` : "/api/experience";
      const method = editing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceData),
      });

      const resJson = await response.json().catch(() => null);

      // If server returned 401/403, verify token validity before redirecting
      if (response.status === 401 || response.status === 403 || (resJson && resJson.success === false && /invalid|expired/i.test(resJson.error || ""))) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const verifyResp = await fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } });
            if (verifyResp.ok) {
              // token actually valid — log and surface server error instead of redirecting
              console.error('Server rejected request despite valid token:', resJson || response.statusText);
            } else {
              // token invalid — clear and redirect
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
        await fetchExperiences();
        resetForm();
        addToast("Saved successfully", "success");
      } else {
        console.error("Save failed:", resJson || response.statusText);
        addToast("Save failed", "error");
      }
    } catch (error) {
      console.error("Error saving experience:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/experience/${id}`, {
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
            window.location.href = "/signin";
            return;
          }
        } else {
          try { localStorage.removeItem("token"); } catch (e) {}
          window.location.href = "/SignIn";
          return;
        }
      }

      if (response.ok) {
        await fetchExperiences();
        addToast("Deleted successfully", "success");
      } else {
        console.error("Delete failed:", resJson || response.statusText);
        addToast("Delete failed", "error");
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (experience) => {
    setEditing(experience);
    setFormData({
      jobTitle: experience.jobTitle,
      company: experience.company,
      location: experience.location,
      period: experience.period,
      description: (experience.description || []).join("\n"),
      techStack: (experience.techStack || []).join(", "),
    });
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      jobTitle: "",
      company: "",
      location: "",
      period: "",
      description: "",
      techStack: "",
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

      <h2 className="text-2xl font-bold mb-6">Manage Experience</h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-gray-700 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Company *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Period *
            </label>
            <input
              type="text"
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value })
              }
              placeholder="e.g., Jan 2020 - Present"
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              value={formData.techStack}
              onChange={(e) =>
                setFormData({ ...formData, techStack: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description (one point per line) *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={6}
              placeholder="• Point 1&#10;• Point 2&#10;• Point 3"
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md border border-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            {editing ? "Update Experience" : "Add Experience"}
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
        <h3 className="text-xl font-semibold">Existing Experiences</h3>
        {experiences.length === 0 ? (
          <p className="text-gray-400">No experiences found.</p>
        ) : (
          experiences.map((experience) => (
            <div
              key={experience._id}
              className="bg-gray-700 p-4 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <h4 className="text-lg font-medium">
                  {experience.jobTitle} at {experience.company}
                </h4>
                <p className="text-gray-300 text-sm mt-1">
                  {experience.period}
                  {experience.location && ` • ${experience.location}`}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {experience.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-600 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(experience)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmState({ open: true, id: experience._id, message: "Are you sure you want to delete this experience?" })}
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
        title="Delete Experience"
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

export default ExperienceManager;
