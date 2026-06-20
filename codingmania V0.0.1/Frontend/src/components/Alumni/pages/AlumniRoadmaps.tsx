import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit2,
  Users,
  ChevronRight,
  ArrowLeft,
  Loader2,
  BookOpen,
  Clock,
  BarChart3,
} from "lucide-react";
import { RoadmapSummary, Roadmap, EnrolledStudent } from "../types";
import { useAlumniAuth } from "../hooks/useAlumniAuth";

const AlumniRoadmaps = () => {
  const { roadmapApi, getToken } = useAlumniAuth();
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [myRoadmaps, setMyRoadmaps] = useState<RoadmapSummary[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolledStudentsLoading, setIsEnrolledStudentsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    duration: "",
  });
  const [steps, setSteps] = useState([{ title: "", description: "", link: "" }]);

  const currentUserId = (() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).id : null;
    } catch {
      return null;
    }
  })();

  const fetchRoadmaps = async () => {
    setIsLoading(true);
    try {
      const [all, mine] = await Promise.all([
        roadmapApi.getAll(),
        roadmapApi.getMyRoadmaps(),
      ]);
      setRoadmaps(all);
      setMyRoadmaps(mine);
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);
      toast.error("Failed to load roadmaps");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    const validSteps = steps.filter((s) => s.title.trim());
    if (validSteps.length === 0) {
      toast.error("Add at least one step");
      return;
    }

    setIsLoading(true);
    try {
      await roadmapApi.create({
        ...formData,
        steps: validSteps,
      });
      toast.success("Roadmap created successfully");
      setView("list");
      fetchRoadmaps();
      setFormData({ title: "", description: "", category: "", difficulty: "beginner", duration: "" });
      setSteps([{ title: "", description: "", link: "" }]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoadmap = async (id: number) => {
    if (!confirm("Are you sure? This will delete all progress data.")) return;

    setIsLoading(true);
    try {
      await roadmapApi.delete(id);
      toast.success("Roadmap deleted");
      fetchRoadmaps();
    } catch (error) {
      toast.error("Failed to delete roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (id: number) => {
    setIsLoading(true);
    try {
      const roadmap = await roadmapApi.getById(id);
      setSelectedRoadmap(roadmap);

      if (roadmap.author?.id === currentUserId) {
        setIsEnrolledStudentsLoading(true);
        try {
          const students = await roadmapApi.getEnrolledStudents(id);
          setEnrolledStudents(students);
        } catch (error) {
          console.error("Failed to load students:", error);
        } finally {
          setIsEnrolledStudentsLoading(false);
        }
      }

      setView("detail");
    } catch (error) {
      toast.error("Failed to load roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const addStep = () => {
    setSteps([...steps, { title: "", description: "", link: "" }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const difficultyColors = {
    beginner: "bg-green-500/15 text-green-400",
    intermediate: "bg-amber-500/15 text-amber-400",
    advanced: "bg-red-500/15 text-red-300",
  };

  const difficultyOptions = ["beginner", "intermediate", "advanced"];

  if (view === "create") {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Roadmap</h2>
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <form onSubmit={handleCreateRoadmap} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="e.g., Complete Web Development Roadmap"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={3}
              placeholder="What will students learn from this roadmap?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Web Dev, AI/ML"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., 3 months"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {difficultyOptions.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">Steps *</label>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(index, "title", e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder={`Step ${index + 1} title`}
                      />
                      <textarea
                        value={step.description}
                        onChange={(e) => updateStep(index, "description", e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows={2}
                        placeholder="Description (optional)"
                      />
                      <input
                        type="url"
                        value={step.link}
                        onChange={(e) => updateStep(index, "link", e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Resource link (optional)"
                      />
                    </div>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Roadmap"
            )}
          </button>
        </form>
      </div>
    );
  }

  if (view === "detail" && selectedRoadmap) {
    const isOwner = selectedRoadmap.author?.id === currentUserId;

    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              setView("list");
              setSelectedRoadmap(null);
              setEnrolledStudents([]);
            }}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDeleteRoadmap(selectedRoadmap.id)}
                className="flex items-center gap-1 px-3 py-2 text-red-400 hover:bg-red-500/15 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{selectedRoadmap.title}</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`px-2 py-1 rounded-full ${difficultyColors[selectedRoadmap.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner}`}>
              {selectedRoadmap.difficulty}
            </span>
            {selectedRoadmap.category && (
              <span className="text-gray-400">{selectedRoadmap.category}</span>
            )}
            {selectedRoadmap.duration && (
              <span className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" />
                {selectedRoadmap.duration}
              </span>
            )}
            <span className="flex items-center gap-1 text-gray-400">
              <BookOpen className="w-4 h-4" />
              {selectedRoadmap.stepCount} steps
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Users className="w-4 h-4" />
              {selectedRoadmap.enrolledCount || 0} enrolled
            </span>
          </div>
        </div>

        <p className="text-gray-300 mb-6">{selectedRoadmap.description}</p>

        <div className="mb-6">
          <h3 className="font-semibold text-white mb-3">Steps</h3>
          <div className="space-y-3">
            {selectedRoadmap.steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
              >
                <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{step.title}</h4>
                  {step.description && (
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                  )}
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-red-400 hover:underline mt-1 block"
                    >
                      View Resource →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isOwner && (
          <div>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Enrolled Students ({enrolledStudents.length})
            </h3>
            {isEnrolledStudentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-red-400" />
              </div>
            ) : enrolledStudents.length === 0 ? (
              <p className="text-gray-400">No students enrolled yet.</p>
            ) : (
              <div className="space-y-2">
                {enrolledStudents.map((student) => (
                  <div
                    key={student.studentId}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{student.name}</p>
                      <p className="text-sm text-gray-400">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        {student.completedSteps}/{student.totalSteps} completed
                      </p>
                      <div className="w-24 h-2 bg-white/10 rounded-full mt-1">
                        <div
                          className="h-full bg-red-600 rounded-full"
                          style={{ width: `${student.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Learning Roadmaps</h2>
        <button
          onClick={() => setView("create")}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Roadmap
        </button>
      </div>

      {myRoadmaps.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-300 mb-3">My Roadmaps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRoadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="p-4 border border-red-500/30 bg-red-500/10 rounded-xl hover:border-red-500/50 transition-colors cursor-pointer"
                onClick={() => handleViewDetail(roadmap.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white">{roadmap.title}</h4>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {roadmap.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span className={`px-2 py-0.5 rounded-full ${difficultyColors[roadmap.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner}`}>
                    {roadmap.difficulty}
                  </span>
                  <span>{roadmap.stepCount} steps</span>
                  <span>{roadmap.enrolledCount} enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-medium text-gray-300 mb-3">All Roadmaps</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-red-400" />
          </div>
        ) : roadmaps.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No roadmaps available yet. Be the first to create one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="p-4 border border-white/10 rounded-xl hover:border-red-500/50 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleViewDetail(roadmap.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white">{roadmap.title}</h4>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {roadmap.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span className="font-medium">{roadmap.author?.name}</span>
                  <span className={`px-2 py-0.5 rounded-full ${difficultyColors[roadmap.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner}`}>
                    {roadmap.difficulty}
                  </span>
                  <span>{roadmap.stepCount} steps</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniRoadmaps;