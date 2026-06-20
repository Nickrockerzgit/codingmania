import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Clock,
  Users,
  CheckCircle,
  Circle,
} from "lucide-react";
import { RoadmapSummary, Roadmap } from "../types";
import { useStudentRoadmaps } from "../hooks/useStudentRoadmaps";

const StudentRoadmaps = () => {
  const { roadmapApi } = useStudentRoadmaps();
  const [view, setView] = useState<"list" | "detail">("list");
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoadmaps = async () => {
    setIsLoading(true);
    try {
      const data = await roadmapApi.getAll();
      setRoadmaps(data);
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);
      toast.error("Failed to load roadmaps");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewDetail = async (id: number) => {
    setIsLoading(true);
    try {
      const roadmap = await roadmapApi.getById(id);
      setSelectedRoadmap(roadmap);
      setView("detail");
    } catch {
      toast.error("Failed to load roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrol = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await roadmapApi.enrol(id);
      toast.success("Enrolled successfully!");
      fetchRoadmaps();
      if (selectedRoadmap && selectedRoadmap.id === id) {
        const updated = await roadmapApi.getById(id);
        setSelectedRoadmap(updated);
      }
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : "Failed to enroll";
      toast.error(message || "Failed to enroll");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStep = async (stepId: number) => {
    if (!selectedRoadmap) return;
    setIsLoading(true);
    try {
      await roadmapApi.toggleStep(selectedRoadmap.id, stepId);
      const updated = await roadmapApi.getById(selectedRoadmap.id);
      setSelectedRoadmap(updated);
      fetchRoadmaps();
    } catch {
      toast.error("Failed to update step");
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyColors = {
    beginner: "bg-green-500/15 text-green-400",
    intermediate: "bg-amber-500/15 text-amber-400",
    advanced: "bg-red-500/15 text-red-300",
  };

  if (view === "detail" && selectedRoadmap) {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setView("list");
                setSelectedRoadmap(null);
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {selectedRoadmap.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span
                className={`px-2 py-1 rounded-full ${
                  difficultyColors[
                    selectedRoadmap.difficulty as keyof typeof difficultyColors
                  ] || difficultyColors.beginner
                }`}
              >
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

          {selectedRoadmap.isEnrolled && (
            <div className="mb-6 p-4 bg-red-500/10 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">Your Progress</span>
                <span className="font-medium text-red-400">
                  {selectedRoadmap.completedSteps || 0} / {selectedRoadmap.stepCount} steps
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all"
                  style={{ width: `${selectedRoadmap.progressPercent || 0}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {selectedRoadmap.progressPercent || 0}% complete
              </p>
            </div>
          )}

          {!selectedRoadmap.isEnrolled && (
            <button
              onClick={(e) => handleEnrol(selectedRoadmap.id, e)}
              disabled={isLoading}
              className="w-full mb-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enrolling...
                </span>
              ) : (
                "Enroll in Roadmap"
              )}
            </button>
          )}

          <div>
            <h3 className="font-semibold text-white mb-3">Steps</h3>
            <div className="space-y-3">
              {selectedRoadmap.steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-4 rounded-lg transition-colors ${
                    selectedRoadmap.isEnrolled
                      ? "bg-white/5 hover:bg-white/10 cursor-pointer"
                      : "bg-white/5"
                  }`}
                  onClick={() =>
                    selectedRoadmap.isEnrolled && handleToggleStep(step.id)
                  }
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed
                        ? "bg-green-500/15 text-green-400"
                        : "bg-white/5 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        step.completed ? "text-gray-400 line-through" : "text-white"
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.description && (
                      <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                    )}
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-red-400 hover:underline mt-1 block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Resource →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isLoading && roadmaps.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-red-400" />
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-gray-400">
            No roadmaps available yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-red-500/30 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleViewDetail(roadmap.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <BookOpen className="w-6 h-6 text-red-400" />
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    difficultyColors[
                      roadmap.difficulty as keyof typeof difficultyColors
                    ] || difficultyColors.beginner
                  }`}
                >
                  {roadmap.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {roadmap.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {roadmap.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span className="font-medium">{roadmap.author?.name}</span>
                <span>•</span>
                <span>{roadmap.stepCount} steps</span>
                <span>•</span>
                <span>{roadmap.enrolledCount} enrolled</span>
              </div>

              {roadmap.isEnrolled ? (
                <>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${roadmap.progressPercent || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {roadmap.progressPercent || 0}% Complete
                    {roadmap.completedSteps !== undefined &&
                      ` (${roadmap.completedSteps}/${roadmap.stepCount})`}
                  </p>
                </>
              ) : (
                <button
                  onClick={(e) => handleEnrol(roadmap.id, e)}
                  disabled={isLoading}
                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Enroll
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="p-6 bg-gradient-to-r from-red-600 to-orange-600 border border-red-500/30 rounded-2xl">
        <h2 className="text-xl font-semibold text-white mb-2">
          Create Your Own Roadmap
        </h2>
        <p className="text-gray-300">
          Design a personalized learning path to achieve your career goals.
        </p>
      </div>
    </div>
  );
};

export default StudentRoadmaps;