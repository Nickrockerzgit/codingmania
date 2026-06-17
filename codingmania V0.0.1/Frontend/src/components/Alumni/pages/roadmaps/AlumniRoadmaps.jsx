import { useState, useEffect, useCallback } from "react";
import {
  getAllAlumniRoadmaps,
  createAlumniRoadmap,
  deleteAlumniRoadmap,
  updateAlumniRoadmap,
} from "../../../alumni.api";
import CreatedRoadmapsList from "./components/CreatedRoadmapsList";
import EnrolledStudentsTracker from "./components/EnrolledStudentsTracker";
import RoadmapAnalytics from "./components/RoadmapAnalytics";
import {
  PlusCircle,
  ListTodo,
  Users,
  BarChart3,
  Sparkles,
  BookOpen,
  Clock,
  Tag,
  Layers,
  Loader2,
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Link as LinkIcon,
  Pencil,
  Map,
  Route,
} from "lucide-react";

const TABS = [
  { key: "create", label: "Create Roadmap", Icon: PlusCircle },
  { key: "list", label: "My Roadmaps", Icon: ListTodo },
  { key: "analytics", label: "Analytics", Icon: BarChart3 },
];

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "intermediate", label: "Intermediate", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "advanced", label: "Advanced", color: "bg-rose-100 text-rose-700 border-rose-200" },
];

const CATEGORY_OPTIONS = [
  "Web Development", "Mobile Development", "Data Science", "Machine Learning",
  "Cloud Computing", "DevOps", "Cybersecurity", "Blockchain", "UI/UX Design",
  "System Design", "Competitive Programming", "Interview Preparation",
];

const DURATION_OPTIONS = [
  { value: "1_week", label: "1 Week" },
  { value: "2_weeks", label: "2 Weeks" },
  { value: "1_month", label: "1 Month" },
  { value: "2_months", label: "2 Months" },
  { value: "3_months", label: "3 Months" },
  { value: "6_months", label: "6 Months" },
];

const emptyStep = () => ({ id: crypto.randomUUID(), title: "", description: "", link: "" });

const AlumniRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
  const [justCreated, setJustCreated] = useState(null);

  // Create form state
  const [form, setForm] = useState({
    title: "", description: "", category: "", customCategory: "",
    difficulty: "beginner", duration: "1_month",
  });
  const [steps, setSteps] = useState([emptyStep()]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isCustomCategory = form.category === "__custom__";
  const resolvedCategory = isCustomCategory ? form.customCategory.trim() : form.category;

  const fetchRoadmaps = useCallback(async () => {
    try {
      const res = await getAllAlumniRoadmaps();
      setRoadmaps(res.data);
    } catch (err) {
      console.error("Failed to fetch roadmaps:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoadmaps(); }, [fetchRoadmaps]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const addStep = () => setSteps((prev) => [...prev, emptyStep()]);
  const removeStep = (index) => { if (steps.length > 1) setSteps((prev) => prev.filter((_, i) => i !== index)); };
  const updateStep = (index, field, value) => setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  const moveStep = (index, dir) => {
    const ni = index + dir;
    if (ni < 0 || ni >= steps.length) return;
    setSteps((prev) => { const n = [...prev]; [n[index], n[ni]] = [n[ni], n[index]]; return n; });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!resolvedCategory) errs.category = "Category is required";
    const stepErrs = steps.map((s) => ({ title: !s.title.trim() ? "Step title is required" : undefined }));
    if (stepErrs.some((s) => s.title)) errs.steps = stepErrs;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await createAlumniRoadmap({
        title: form.title.trim(),
        description: form.description.trim(),
        category: resolvedCategory,
        difficulty: form.difficulty,
        duration: form.duration,
        steps: steps.map((s, i) => ({
          title: s.title.trim(),
          description: s.description.trim(),
          link: s.link.trim() || null,
          order: i + 1,
        })),
      });
      setJustCreated(res.data.id);
      setForm({ title: "", description: "", category: "", customCategory: "", difficulty: "beginner", duration: "1_month" });
      setSteps([emptyStep()]);
      setErrors({});
      await fetchRoadmaps();
      setActiveTab("list");
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || "Failed to create roadmap" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewStudents = (roadmapId) => {
    setSelectedRoadmapId(roadmapId);
    setActiveTab("students");
  };

  const handleBackToList = () => {
    setSelectedRoadmapId(null);
    setActiveTab("list");
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    await deleteAlumniRoadmap(roadmapId);
    setRoadmaps((prev) => prev.filter((r) => r.id !== roadmapId));
  };

  const handleUpdateRoadmap = async (roadmapId, data) => {
    const res = await updateAlumniRoadmap(roadmapId, data);
    setRoadmaps((prev) => prev.map((r) => (r.id === roadmapId ? { ...r, ...res.data } : r)));
  };

  const inputBase = "w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all duration-200";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#5b6ef5]" />
          <span className="text-sm text-gray-500 font-medium">Loading roadmaps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Roadmap Management</h1>
        <p className="text-sm text-gray-400 mt-0.5">Create learning roadmaps and track student progress</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-2xl overflow-x-auto"
        style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => { setSelectedRoadmapId(null); setActiveTab(key); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeTab === key ? "bg-white text-[#5b6ef5] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
        {activeTab === "students" && selectedRoadmapId && (
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap bg-white text-[#5b6ef5] shadow-sm flex-shrink-0">
            <Users className="w-4 h-4" /> Enrolled Students
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "create" && (
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="rounded-2xl p-6 space-y-5"
            style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#5b6ef5]/10 flex items-center justify-center">
                <Route className="w-4 h-4 text-[#5b6ef5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#5b6ef5] font-semibold">Step 1</span>
                <h2 className="text-sm font-bold text-gray-900 leading-none">Basic Information</h2>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Roadmap Title</label>
              <input type="text" value={form.title} onChange={(e) => updateForm("title", e.target.value)}
                placeholder="e.g., Full Stack Web Development Roadmap" className={inputBase} />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Describe what students will learn..." rows={3} className={`${inputBase} resize-none`} />
              {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Category / Domain
                </label>
                <select value={form.category}
                  onChange={(e) => { updateForm("category", e.target.value); if (e.target.value !== "__custom__") setForm((p) => ({ ...p, customCategory: "" })); }}
                  className={`${inputBase} appearance-none cursor-pointer`}>
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  <option value="__custom__">Other / Custom Topic...</option>
                </select>
                {isCustomCategory && (
                  <div className="relative mt-2">
                    <Pencil className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5b6ef5]/60" />
                    <input type="text" value={form.customCategory} onChange={(e) => updateForm("customCategory", e.target.value)}
                      placeholder="Type your custom topic or domain..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#5b6ef5]/5 border border-[#5b6ef5]/20 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all duration-200" />
                  </div>
                )}
                {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3 h-3" /> Difficulty Level
                </label>
                <div className="flex gap-2">
                  {DIFFICULTY_OPTIONS.map(({ value, label, color }) => (
                    <button key={value} type="button" onClick={() => updateForm("difficulty", value)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                        form.difficulty === value ? color : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }`}>{label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Estimated Duration
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => updateForm("duration", value)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      form.duration === value ? "bg-[#5b6ef5]/10 text-[#5b6ef5] border-[#5b6ef5]/30" : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}>{label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="rounded-2xl p-6 space-y-4"
            style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#5b6ef5]/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#5b6ef5]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#5b6ef5] font-semibold">Step 2</span>
                  <h2 className="text-sm font-bold text-gray-900 leading-none">Steps / Milestones ({steps.length})</h2>
                </div>
              </div>
              <button type="button" onClick={addStep}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#5b6ef5]/10 text-[#5b6ef5] text-xs font-semibold hover:bg-[#5b6ef5]/20 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="rounded-xl bg-white/80 border border-gray-200 p-4 space-y-3 transition-all duration-200 hover:border-[#5b6ef5]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">#{index + 1}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveStep(index, -1)} disabled={index === 0}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => moveStep(index, 1)} disabled={index === steps.length - 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => removeStep(index)} disabled={steps.length <= 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Step Title</label>
                      <input type="text" value={step.title} onChange={(e) => updateStep(index, "title", e.target.value)}
                        placeholder="e.g., HTML & CSS Fundamentals"
                        className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all" />
                      {errors.steps?.[index]?.title && <p className="text-[11px] text-rose-500 mt-1">{errors.steps[index].title}</p>}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Description</label>
                      <input type="text" value={step.description} onChange={(e) => updateStep(index, "description", e.target.value)}
                        placeholder="Brief description of this step..."
                        className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all" />
                    </div>
                  </div>
                  <div className="relative">
                    <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="url" value={step.link} onChange={(e) => updateStep(index, "link", e.target.value)}
                      placeholder="Resource link (optional)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {errors.submit && <p className="text-sm text-rose-500 text-center">{errors.submit}</p>}

          <div className="flex justify-end">
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #5b6ef5, #7c3aed)" }}>
              {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : <><Sparkles className="w-4 h-4" /> Create Roadmap</>}
            </button>
          </div>
        </form>
      )}

      {activeTab === "list" && (
        <CreatedRoadmapsList
          roadmaps={roadmaps}
          justCreated={justCreated}
          onViewStudents={handleViewStudents}
          onDelete={handleDeleteRoadmap}
          onUpdate={handleUpdateRoadmap}
        />
      )}

      {activeTab === "students" && selectedRoadmapId && (
        <EnrolledStudentsTracker
          roadmapId={selectedRoadmapId}
          roadmapMeta={roadmaps.find((r) => r.id === selectedRoadmapId) || null}
          onBack={handleBackToList}
        />
      )}

      {activeTab === "analytics" && <RoadmapAnalytics />}
    </div>
  );
};

export default AlumniRoadmaps;
