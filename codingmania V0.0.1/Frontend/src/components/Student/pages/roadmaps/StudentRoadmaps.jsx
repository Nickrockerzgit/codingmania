import { useState, useEffect, useCallback } from "react";
import {
  getAllRoadmaps,
  enrolInRoadmap,
  toggleStep,
} from "../../../student.api";
import { Loader2 } from "lucide-react";
import {
  ProgressRing,
  RoadmapCard,
  RoadmapDetail,
  RoadmapsHeader,
  EmptyState,
} from "./components";

const StudentRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("browse");
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [enrolling, setEnrolling] = useState(null);
  const [toggling, setToggling] = useState(null);

  const fetchRoadmaps = useCallback(async () => {
    try {
      const res = await getAllRoadmaps();
      setRoadmaps(res.data);
    } catch (err) {
      console.error("Failed to fetch roadmaps:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  const handleEnrol = async (roadmapId) => {
    setEnrolling(roadmapId);
    try {
      await enrolInRoadmap(roadmapId);
      await fetchRoadmaps();
    } catch (err) {
      console.error("Failed to enrol:", err);
    } finally {
      setEnrolling(null);
    }
  };

  const handleToggleStep = async (roadmapId, stepId) => {
    setToggling(stepId);
    try {
      await toggleStep(roadmapId, stepId);
      await fetchRoadmaps();
      if (selectedRoadmap?.id === roadmapId) {
        const updated = roadmaps.find((r) => r.id === roadmapId);
        if (updated) {
          const updatedSteps = updated.steps.map((s) =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
          );
          setSelectedRoadmap({ ...updated, steps: updatedSteps });
        }
      }
    } catch (err) {
      console.error("Failed to toggle step:", err);
    } finally {
      setToggling(null);
    }
  };

  const filteredRoadmaps = roadmaps.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      const cats = Array.isArray(r.category) ? r.category : (r.category ? r.category.split(",") : []);
      if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !cats.some((t) => t.toLowerCase().includes(q))) return false;
    }
    if (filterDifficulty !== "all" && r.difficulty !== filterDifficulty) return false;
    return true;
  });

  const enrolledRoadmaps = filteredRoadmaps.filter((r) => r.isEnrolled);
  const browseRoadmaps = filteredRoadmaps;

  if (selectedRoadmap) {
    return (
      <RoadmapDetail
        roadmap={selectedRoadmap}
        onBack={() => setSelectedRoadmap(null)}
        onToggleStep={handleToggleStep}
        toggling={toggling}
      />
    );
  }

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
    <div className="space-y-6">
      <RoadmapsHeader
        search={search}
        setSearch={setSearch}
        filterDifficulty={filterDifficulty}
        setFilterDifficulty={setFilterDifficulty}
        tab={tab}
        setTab={setTab}
        browseRoadmaps={browseRoadmaps}
        enrolledRoadmaps={enrolledRoadmaps}
        setSelectedRoadmap={setSelectedRoadmap}
      />

      <div className="rounded-2xl p-4"
        style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
        {((tab === "browse" ? browseRoadmaps : enrolledRoadmaps)).length === 0 ? (
          <EmptyState tab={tab} onBrowse={() => setTab("browse")} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(tab === "browse" ? browseRoadmaps : enrolledRoadmaps).map((r) => (
              <RoadmapCard
                key={r.id}
                roadmap={r}
                onView={setSelectedRoadmap}
                onEnrol={handleEnrol}
                enrolling={enrolling}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRoadmaps;