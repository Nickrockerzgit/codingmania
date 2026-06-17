import { useState, useEffect } from "react";
import {
  Calendar,
  BookOpen,
  Users,
  Eye,
  Search,
  Map,
  TrendingUp,
  Sparkles,
  Trash2,
  Pencil,
  X,
  Check,
  Loader2,
  Plus,
  ChevronUp,
  ChevronDown,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const DIFFICULTY_BADGE = {
  beginner: "bg-emerald-50 text-emerald-600 border-emerald-100",
  intermediate: "bg-amber-50 text-amber-600 border-amber-100",
  advanced: "bg-rose-50 text-rose-600 border-rose-100",
};

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

const getCategoryArray = (cat) => {
  if (Array.isArray(cat)) return cat;
  if (typeof cat === "string" && cat) return cat.split(",").map((c) => c.trim()).filter(Boolean);
  return [];
};

const getStepCount = (r) => {
  if (Array.isArray(r.steps)) return r.steps.length;
  if (Array.isArray(r.topics)) return r.topics.length;
  if (typeof r.stepCount === "number") return r.stepCount;
  return 0;
};

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
  };
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-semibold shadow-lg ${colors[type] || colors.success} animate-slide-in`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

const DeleteModal = ({ open, roadmap, onConfirm, onCancel, deleting }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: "#ECEBF8", border: "1px solid rgba(255,255,255,0.8)" }}
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-rose-500" />
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">Delete Roadmap?</h3>
          <p className="text-sm text-gray-500 mb-1">
            Are you sure you want to delete
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-2">
            "{roadmap?.title}"
          </p>
          <p className="text-xs text-gray-400">
            This will permanently remove the roadmap and all student progress data. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {deleting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
            ) : (
              <><Trash2 className="w-4 h-4" /> Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

const emptyEditStep = (s = {}) => ({
  _id: s.id || crypto.randomUUID(),
  title: s.title || "",
  description: s.description || "",
  link: s.link || "",
  order: s.order || 1,
});

const EditModal = ({ open, roadmap, onSave, onCancel, saving }) => {
  const [form, setForm] = useState({ title: "", description: "", category: "", difficulty: "beginner", duration: "1_month" });
  const [editSteps, setEditSteps] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && roadmap) {
      setForm({
        title: roadmap.title || "",
        description: roadmap.description || "",
        category: getCategoryArray(roadmap.category).join(", "),
        difficulty: roadmap.difficulty || "beginner",
        duration: roadmap.duration || "1_month",
      });
      const steps = Array.isArray(roadmap.steps) ? roadmap.steps : [];
      setEditSteps(steps.length > 0 ? steps.map((s) => emptyEditStep(s)) : [emptyEditStep()]);
      setErrors({});
    }
  }, [open, roadmap]);

  if (!open) return null;

  const updateForm = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const addStep = () => setEditSteps((p) => [...p, emptyEditStep()]);
  const removeStep = (i) => { if (editSteps.length > 1) setEditSteps((p) => p.filter((_, idx) => idx !== i)); };
  const updateStep = (i, field, value) => setEditSteps((p) => p.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  const moveStep = (i, dir) => {
    const ni = i + dir;
    if (ni < 0 || ni >= editSteps.length) return;
    setEditSteps((p) => { const n = [...p]; [n[i], n[ni]] = [n[ni], n[i]]; return n; });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.category.trim()) errs.category = "Category is required";
    const stepErrs = editSteps.map((s) => ({ title: !s.title.trim() ? "Required" : undefined }));
    if (stepErrs.some((s) => s.title)) errs.steps = stepErrs;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      difficulty: form.difficulty,
      duration: form.duration,
      steps: editSteps.map((s, i) => ({
        title: s.title.trim(),
        description: s.description.trim(),
        link: s.link.trim() || null,
        order: i + 1,
      })),
    });
  };

  const inputBase = "w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 pb-6 px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: "#ECEBF8" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200/60"
          style={{ background: "rgba(236,237,248,0.95)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5b6ef5]/10 flex items-center justify-center">
              <Pencil className="w-4 h-4 text-[#5b6ef5]" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Edit Roadmap</h2>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Title</label>
            <input type="text" value={form.title} onChange={(e) => updateForm("title", e.target.value)} className={inputBase} />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={3} className={`${inputBase} resize-none`} />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>

          {/* Category + Difficulty + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Category</label>
              <input type="text" value={form.category} onChange={(e) => updateForm("category", e.target.value)}
                placeholder="e.g. Web Development, AI" className={inputBase} />
              {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => updateForm("difficulty", e.target.value)}
                className={`${inputBase} appearance-none cursor-pointer`}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Duration</label>
              <select value={form.duration} onChange={(e) => updateForm("duration", e.target.value)}
                className={`${inputBase} appearance-none cursor-pointer`}>
                {DURATION_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Steps */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.7)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Steps ({editSteps.length})</h3>
              <button onClick={addStep} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#5b6ef5]/10 text-[#5b6ef5] text-[11px] font-semibold hover:bg-[#5b6ef5]/20 transition-colors">
                <Plus className="w-3 h-3" /> Add Step
              </button>
            </div>
            {editSteps.map((step, i) => (
              <div key={step._id} className="rounded-lg bg-white border border-gray-200 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">#{i + 1}</span>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => moveStep(i, -1)} disabled={i === 0}
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveStep(i, 1)} disabled={i === editSteps.length - 1}
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removeStep(i)} disabled={editSteps.length <= 1}
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-rose-500 disabled:opacity-30">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input type="text" value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)}
                  placeholder="Step title" className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 transition-all" />
                {errors.steps?.[i]?.title && <p className="text-[11px] text-rose-500">{errors.steps[i].title}</p>}
                <input type="text" value={step.description} onChange={(e) => updateStep(i, "description", e.target.value)}
                  placeholder="Description" className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 transition-all" />
                <div className="relative">
                  <LinkIcon className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="url" value={step.link} onChange={(e) => updateStep(i, "link", e.target.value)}
                    placeholder="Resource link (optional)" className="w-full pl-8 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 transition-all" />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button onClick={onCancel} disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #5b6ef5, #7c3aed)" }}>
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Check className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CreatedRoadmapsList = ({ roadmaps = [], justCreated = null, onViewStudents, onDelete, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedId, setHighlightedId] = useState(justCreated);
  const [toast, setToast] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit state
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (justCreated) {
      setHighlightedId(justCreated);
      const t = setTimeout(() => setHighlightedId(null), 3000);
      return () => clearTimeout(t);
    }
  }, [justCreated]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await onDelete(deleteTarget.id);
      showToast("Roadmap deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete roadmap", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSave = async (data) => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await onUpdate(editTarget.id, data);
      showToast("Roadmap updated successfully");
      setEditTarget(null);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update roadmap", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = roadmaps.filter((r) => {
    const q = searchQuery.toLowerCase();
    const cats = getCategoryArray(r.category);
    return r.title?.toLowerCase().includes(q) || cats.some((c) => c.toLowerCase().includes(q));
  });

  const totalStudents = roadmaps.reduce((s, r) => s + (r.enrolledStudents || 0), 0);

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        roadmap={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />

      {/* Edit Modal */}
      <EditModal
        open={!!editTarget}
        roadmap={editTarget}
        onSave={handleEditSave}
        onCancel={() => setEditTarget(null)}
        saving={saving}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Roadmaps", value: roadmaps.length, Icon: Map, color: "#5b6ef5" },
          { label: "Total Enrolled", value: totalStudents, Icon: Users, color: "#10b981" },
          { label: "Active", value: roadmaps.length, Icon: TrendingUp, color: "#f59e0b" },
          { label: "Total Steps", value: roadmaps.reduce((s, r) => s + getStepCount(r), 0), Icon: BookOpen, color: "#a855f7" },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-gray-900">{value}</p>
              <p className="text-[11px] text-gray-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search roadmaps..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all" />
      </div>

      {/* Roadmap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((roadmap) => {
          const isNew = roadmap.id === highlightedId;
          const cats = getCategoryArray(roadmap.category);
          const stepCount = getStepCount(roadmap);
          return (
            <div key={roadmap.id}
              className={`rounded-2xl p-5 space-y-4 transition-all duration-300 hover:shadow-md group ${
                isNew ? "ring-2 ring-[#5b6ef5]/40 shadow-lg shadow-[#5b6ef5]/10" : ""
              }`}
              style={{
                background: isNew ? "rgba(91,110,245,0.06)" : "rgba(255,255,255,0.65)",
                backdropFilter: "blur(12px)",
                border: isNew ? "1px solid rgba(91,110,245,0.3)" : "1px solid rgba(255,255,255,0.8)",
              }}
            >
              {/* Header with Delete Button */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900 truncate">{roadmap.title}</h3>
                    {isNew && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#5b6ef5] text-white flex-shrink-0">
                        <Sparkles className="w-3 h-3" /> NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{roadmap.description}</p>
                </div>
                <button
                  onClick={() => setDeleteTarget(roadmap)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors flex-shrink-0 ml-2"
                  title="Delete roadmap"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {cats.slice(0, 3).map((cat) => (
                  <span key={cat} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">{cat}</span>
                ))}
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${DIFFICULTY_BADGE[roadmap.difficulty] || ""}`}>
                  {roadmap.difficulty ? roadmap.difficulty.charAt(0).toUpperCase() + roadmap.difficulty.slice(1) : "N/A"}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-gray-50 text-gray-500 border border-gray-200">
                  {roadmap.duration?.replace("_", " ")}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2 border-t border-gray-100/60">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">{stepCount} steps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">{roadmap.enrolledStudents || 0} students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">
                    {roadmap.createdAt ? new Date(roadmap.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </span>
                </div>
              </div>

              {/* Actions — View Students + Edit */}
              <div className="flex gap-2">
                <button onClick={() => onViewStudents(roadmap.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-[#5b6ef5] bg-[#5b6ef5]/10 hover:bg-[#5b6ef5]/20 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> View Students
                </button>
                <button onClick={() => setEditTarget(roadmap)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-colors"
                  title="Edit roadmap"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Map className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-medium">No roadmaps found</p>
          <p className="text-xs text-gray-300 mt-1">Try adjusting your search or create a new roadmap</p>
        </div>
      )}
    </div>
  );
};

export default CreatedRoadmapsList;
