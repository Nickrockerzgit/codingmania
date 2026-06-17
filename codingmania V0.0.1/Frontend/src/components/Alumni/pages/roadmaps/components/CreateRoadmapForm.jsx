import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Sparkles,
  BookOpen,
  Clock,
  Tag,
  Layers,
  FileText,
  Pencil,
} from "lucide-react";

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "intermediate", label: "Intermediate", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "advanced", label: "Advanced", color: "bg-rose-100 text-rose-700 border-rose-200" },
];

const CATEGORY_OPTIONS = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "Blockchain",
  "UI/UX Design",
  "System Design",
  "Competitive Programming",
  "Interview Preparation",
];

const DURATION_OPTIONS = [
  { value: "1_week", label: "1 Week" },
  { value: "2_weeks", label: "2 Weeks" },
  { value: "1_month", label: "1 Month" },
  { value: "2_months", label: "2 Months" },
  { value: "3_months", label: "3 Months" },
  { value: "6_months", label: "6 Months" },
];

const emptyTopic = () => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  order: 1,
});

const CreateRoadmapForm = ({ onCreate }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    customCategory: "",
    difficulty: "",
    duration: "",
  });
  const [topics, setTopics] = useState([emptyTopic()]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isCustomCategory = form.category === "__custom__";
  const resolvedCategory = isCustomCategory ? form.customCategory.trim() : form.category;

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const addTopic = () => {
    setTopics((prev) => [
      ...prev,
      { ...emptyTopic(), order: prev.length + 1 },
    ]);
  };

  const removeTopic = (index) => {
    if (topics.length <= 1) return;
    setTopics((prev) =>
      prev.filter((_, i) => i !== index).map((t, i) => ({ ...t, order: i + 1 }))
    );
  };

  const updateTopic = (index, field, value) => {
    setTopics((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const moveTopic = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= topics.length) return;
    setTopics((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next.map((t, i) => ({ ...t, order: i + 1 }));
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!resolvedCategory) errs.category = isCustomCategory ? "Custom topic is required" : "Category is required";
    if (!form.difficulty) errs.difficulty = "Difficulty is required";
    if (!form.duration) errs.duration = "Duration is required";

    const topicErrs = topics.map((t) => ({
      title: !t.title.trim() ? "Topic title is required" : undefined,
      description: !t.description.trim() ? "Description is required" : undefined,
    }));
    if (topicErrs.some((t) => t.title || t.description)) {
      errs.topics = topicErrs;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const resolvedForm = {
      ...form,
      category: resolvedCategory,
    };
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    onCreate?.(resolvedForm, topics);
    setForm({ title: "", description: "", category: "", customCategory: "", difficulty: "", duration: "" });
    setTopics([emptyTopic()]);
    setErrors({});
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info Card */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#5b6ef5]/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#5b6ef5]" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#5b6ef5] font-semibold">
              Step 1
            </span>
            <h2 className="text-sm font-bold text-gray-900 leading-none">
              Basic Information
            </h2>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Roadmap Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateForm("title", e.target.value)}
            placeholder="e.g., Full Stack Web Development Roadmap"
            className={inputBase}
          />
          {errors.title && (
            <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
            placeholder="Describe what students will learn and achieve through this roadmap..."
            rows={3}
            className={`${inputBase} resize-none`}
          />
          {errors.description && (
            <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Category & Difficulty Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3 h-3" /> Category / Domain
            </label>
            <select
              value={form.category}
              onChange={(e) => {
                updateForm("category", e.target.value);
                if (e.target.value !== "__custom__") {
                  setForm((prev) => ({ ...prev, customCategory: "" }));
                }
              }}
              className={`${inputBase} appearance-none cursor-pointer`}
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__custom__">Other / Custom Topic...</option>
            </select>
            {isCustomCategory && (
              <div className="relative mt-2">
                <Pencil className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5b6ef5]/60" />
                <input
                  type="text"
                  value={form.customCategory}
                  onChange={(e) => updateForm("customCategory", e.target.value)}
                  placeholder="Type your custom topic or domain..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#5b6ef5]/5 border border-[#5b6ef5]/20 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all duration-200"
                />
              </div>
            )}
            {errors.category && (
              <p className="text-xs text-rose-500 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3 h-3" /> Difficulty Level
            </label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateForm("difficulty", value)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                    form.difficulty === value
                      ? color
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.difficulty && (
              <p className="text-xs text-rose-500 mt-1">{errors.difficulty}</p>
            )}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Estimated Duration
          </label>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateForm("duration", value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  form.duration === value
                    ? "bg-[#5b6ef5]/10 text-[#5b6ef5] border-[#5b6ef5]/30"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.duration && (
            <p className="text-xs text-rose-500 mt-1">{errors.duration}</p>
          )}
        </div>
      </div>

      {/* Topics Section */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5b6ef5]/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#5b6ef5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#5b6ef5] font-semibold">
                Step 2
              </span>
              <h2 className="text-sm font-bold text-gray-900 leading-none">
                Topics / Milestones ({topics.length})
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={addTopic}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#5b6ef5]/10 text-[#5b6ef5] text-xs font-semibold hover:bg-[#5b6ef5]/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Topic
          </button>
        </div>

        <div className="space-y-3">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className="rounded-xl bg-white/80 border border-gray-200 p-4 space-y-3 transition-all duration-200 hover:border-[#5b6ef5]/20"
            >
              {/* Topic Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <GripVertical className="w-4 h-4 text-gray-300" />
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                      #{topic.order}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveTopic(index, -1)}
                    disabled={index === 0}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTopic(index, 1)}
                    disabled={index === topics.length - 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    disabled={topics.length <= 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Topic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 mb-1 block">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    value={topic.title}
                    onChange={(e) => updateTopic(index, "title", e.target.value)}
                    placeholder="e.g., HTML & CSS Fundamentals"
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all"
                  />
                  {errors.topics?.[index]?.title && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.topics[index].title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 mb-1 block">
                    Description
                  </label>
                  <input
                    type="text"
                    value={topic.description}
                    onChange={(e) =>
                      updateTopic(index, "description", e.target.value)
                    }
                    placeholder="Brief description of this topic..."
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all"
                  />
                  {errors.topics?.[index]?.description && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.topics[index].description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #5b6ef5, #7c3aed)",
          }}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Create Roadmap
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateRoadmapForm;
