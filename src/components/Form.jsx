"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Form() {
  const [activeTab, setActiveTab] = useState("skills");
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  // Form states
  const [skillForm, setSkillForm] = useState({ name: "", category: "", level: "" });
  const [projectForm, setProjectForm] = useState({
    name: "", liveLink: "", githubLink: "", techStack: "", description: ""
  });
  const [experienceForm, setExperienceForm] = useState({
    company: "", role: "", startDate: "", endDate: "", description: ""
  });

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/signin");
      return;
    }
    fetchData();
  }, [user, isAdmin, router]);

  const fetchData = async () => {
    try {
      const [skillsRes, projectsRes, experiencesRes] = await Promise.all([
        fetch("/api/skills"),
        fetch("/api/projects"),
        fetch("/api/experience")
      ]);

      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        setSkills(skillsData.data || []);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.data || []);
      }

      if (experiencesRes.ok) {
        const experiencesData = await experiencesRes.json();
        setExperiences(experiencesData.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingItem ? "PATCH" : "POST";
      const url = editingItem ? `/api/skills/${editingItem._id}` : "/api/skills";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(skillForm)
      });

      if (response.ok) {
        await fetchData();
        setSkillForm({ name: "", category: "", level: "" });
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error saving skill:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingItem ? "PATCH" : "POST";
      const url = editingItem ? `/api/projects/${editingItem._id}` : "/api/projects";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(projectForm)
      });

      if (response.ok) {
        await fetchData();
        setProjectForm({ name: "", liveLink: "", githubLink: "", techStack: "", description: "" });
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingItem ? "PATCH" : "POST";
      const url = editingItem ? `/api/experience/${editingItem._id}` : "/api/experience";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(experienceForm)
      });

      if (response.ok) {
        await fetchData();
        setExperienceForm({ company: "", role: "", startDate: "", endDate: "", description: "" });
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error saving experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/${type}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEdit = (type, item) => {
    setEditingItem(item);
    if (type === "skills") {
      setSkillForm({ name: item.name, category: item.category, level: item.level });
    } else if (type === "projects") {
      setProjectForm({
        name: item.name,
        liveLink: item.liveLink || "",
        githubLink: item.githubLink || "",
        techStack: item.techStack,
        description: item.description
      });
    } else if (type === "experience") {
      setExperienceForm({
        company: item.company,
        role: item.role,
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        description: item.description
      });
    }
    setActiveTab(type);
  };

  const resetForm = () => {
    setEditingItem(null);
    setSkillForm({ name: "", category: "", level: "" });
    setProjectForm({ name: "", liveLink: "", githubLink: "", techStack: "", description: "" });
    setExperienceForm({ company: "", role: "", startDate: "", endDate: "", description: "" });
  };

  if (!user || !isAdmin()) {
    return <div className="text-center py-8">Redirecting to login...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Portfolio Admin Panel
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Manage your skills, projects, and experience
          </p>
        </CardHeader>

        <CardContent>
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {["skills", "projects", "experience"].map((section) => (
              <Button
                key={section}
                onClick={() => {
                  setActiveTab(section);
                  resetForm();
                }}
                variant={activeTab === section ? "default" : "outline"}
                className="capitalize"
              >
                {section}
              </Button>
            ))}
          </div>

          {/* Current Items List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              Current {activeTab} ({activeTab === "skills" ? skills.length : activeTab === "projects" ? projects.length : experiences.length})
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activeTab === "skills" && skills.map((skill) => (
                <div key={skill._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({skill.category}) - Level: {skill.level}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit("skills", skill)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete("skills", skill._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}

              {activeTab === "projects" && projects.map((project) => (
                <div key={project._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{project.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({project.techStack})</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit("projects", project)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete("projects", project._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}

              {activeTab === "experience" && experiences.map((exp) => (
                <div key={exp._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{exp.role} at {exp.company}</span>
                    <span className="text-sm text-gray-600 ml-2">({exp.startDate} - {exp.endDate})</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit("experience", exp)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete("experience", exp._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
            </h3>

            {/* SKILLS FORM */}
            {activeTab === "skills" && (
              <form onSubmit={handleSkillSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Skill Name</Label>
                    <Input
                      placeholder="e.g. React.js"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="e.g. Frontend"
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Skill Level (1-100)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 90"
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({...skillForm, level: e.target.value})}
                    required
                    min="1"
                    max="100"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingItem ? "Update Skill" : "Add Skill"}
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}

            {/* PROJECTS FORM */}
            {activeTab === "projects" && (
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    placeholder="e.g. Portfolio Website"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Live Link</Label>
                    <Input
                      placeholder="e.g. https://yourproject.com"
                      value={projectForm.liveLink}
                      onChange={(e) => setProjectForm({...projectForm, liveLink: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>GitHub Link</Label>
                    <Input
                      placeholder="e.g. https://github.com/..."
                      value={projectForm.githubLink}
                      onChange={(e) => setProjectForm({...projectForm, githubLink: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Tech Stack</Label>
                  <Input
                    placeholder="e.g. React, Tailwind, Next.js"
                    value={projectForm.techStack}
                    onChange={(e) => setProjectForm({...projectForm, techStack: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your project..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    required
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingItem ? "Update Project" : "Add Project"}
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}

            {/* EXPERIENCE FORM */}
            {activeTab === "experience" && (
              <form onSubmit={handleExperienceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      placeholder="e.g. Microsoft"
                      value={experienceForm.company}
                      onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      placeholder="e.g. Frontend Developer"
                      value={experienceForm.role}
                      onChange={(e) => setExperienceForm({...experienceForm, role: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      placeholder="e.g. Jan 2024"
                      value={experienceForm.startDate}
                      onChange={(e) => setExperienceForm({...experienceForm, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      placeholder="e.g. Present"
                      value={experienceForm.endDate}
                      onChange={(e) => setExperienceForm({...experienceForm, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="What did you work on?"
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                    required
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingItem ? "Update Experience" : "Add Experience"}
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
