import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Users,
  Mail,
  GraduationCap,
} from "lucide-react";
import { getEnrolledStudents } from "../../../../alumni.api";

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl animate-pulse"
    style={{ background: "rgba(255,255,255,0.5)" }}>
    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-gray-200 rounded w-32" />
      <div className="h-2.5 bg-gray-100 rounded w-48" />
    </div>
    <div className="w-12 h-5 bg-gray-200 rounded-lg flex-shrink-0" />
    <div className="w-24 h-2 bg-gray-100 rounded-full flex-shrink-0" />
  </div>
);

const SkeletonList = () => (
  <div className="space-y-2">
    {[1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}
  </div>
);

// ─── Progress Ring ────────────────────────────────────────────────────────────

const ProgressRing = ({ percent, size = 40, strokeWidth = 3.5, color = "#5b6ef5" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-gray-700">{percent}%</span>
      </div>
    </div>
  );
};

// ─── Student Row ──────────────────────────────────────────────────────────────

const StatusIcon = ({ completed }) =>
  completed
    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
    : <Circle className="w-3.5 h-3.5 text-gray-300" />;

const StudentRow = ({ student }) => {
  const [expanded, setExpanded] = useState(false);

  const getInitials = (name) =>
    (name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const barColor =
    student.progressPercent === 100
      ? "#10b981"
      : student.progressPercent > 0
      ? "#5b6ef5"
      : "#d1d5db";

  return (
    <div
      className="rounded-xl transition-all duration-200 hover:shadow-md group overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.8)",
      }}
    >
      {/* Main Row */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left flex items-center gap-3 sm:gap-4 px-4 py-3.5 hover:bg-white/50 transition-colors"
      >
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ring-2 ring-white shadow-sm"
          style={{ background: barColor }}
        >
          {getInitials(student.name)}
        </div>

        {/* Name + Email */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] text-gray-400 truncate flex items-center gap-1">
              <Mail className="w-3 h-3 flex-shrink-0" /> {student.email}
            </span>
            {student.branch && (
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400">
                <GraduationCap className="w-3 h-3" /> {student.branch}
              </span>
            )}
          </div>
        </div>

        {/* Enrollment Date */}
        <span className="hidden md:flex items-center gap-1 text-[11px] text-gray-400 flex-shrink-0">
          <Calendar className="w-3 h-3" />
          {student.enrolledAt
            ? new Date(student.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "N/A"}
        </span>

        {/* Progress Ring */}
        <ProgressRing percent={student.progressPercent} color={barColor} />

        {/* Progress Bar */}
        <div className="hidden sm:block w-24 flex-shrink-0">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${student.progressPercent}%`, background: barColor }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 text-right">
            {student.completedSteps}/{student.totalSteps} steps
          </p>
        </div>

        {/* Expand Arrow */}
        {expanded
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>

      {/* Expanded Step Breakdown */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100/60">
          <div className="pt-3 space-y-1.5">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Step-by-Step Breakdown
            </p>
            {student.steps.map((step) => (
              <div
                key={step.stepId}
                className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-gray-50/80"
              >
                <StatusIcon completed={step.completed} />
                <span className={`text-xs flex-1 ${step.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                  {step.title}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  step.completed
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}>
                  {step.completed ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const EnrolledStudentsTracker = ({ roadmapId, onBack, roadmapMeta = null }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEnrolledStudents(roadmapId);
      setStudents(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load enrolled students");
    } finally {
      setLoading(false);
    }
  }, [roadmapId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgProgress = students.length > 0
    ? Math.round(students.reduce((s, st) => s + st.progressPercent, 0) / students.length)
    : 0;

  const title = roadmapMeta?.title || "Roadmap";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white/80 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">{title}</h2>
          <p className="text-xs text-gray-400">
            {loading ? "Loading..." : `${students.length} students enrolled`}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Enrolled", value: students.length, color: "#5b6ef5" },
            { label: "Completed", value: students.filter((s) => s.progressPercent === 100).length, color: "#10b981" },
            { label: "In Progress", value: students.filter((s) => s.progressPercent > 0 && s.progressPercent < 100).length, color: "#f59e0b" },
            { label: "Avg Progress", value: `${avgProgress}%`, color: "#a855f7" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
              <p className="text-lg font-extrabold" style={{ color }}>{value}</p>
              <p className="text-[11px] text-gray-400 font-medium">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      {!loading && students.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, email, or branch..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5b6ef5]/40 focus:ring-2 focus:ring-[#5b6ef5]/10 transition-all"
          />
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && <SkeletonList />}

      {/* Error State */}
      {!loading && error && (
        <div className="rounded-2xl p-8 text-center"
          style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
          <p className="text-sm text-rose-500 font-medium">{error}</p>
          <button onClick={fetchStudents}
            className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-[#5b6ef5] bg-[#5b6ef5]/10 hover:bg-[#5b6ef5]/20 transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && students.length === 0 && (
        <div className="rounded-2xl p-10 text-center"
          style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">No students enrolled yet</p>
          <p className="text-xs text-gray-400 mt-1">
            This roadmap has been created. Students can enroll to start tracking their progress.
          </p>
          {roadmapMeta?.steps && roadmapMeta.steps.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {roadmapMeta.steps.map((step, i) => (
                <span key={i}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-[#5b6ef5]/10 text-[#5b6ef5] border border-[#5b6ef5]/20">
                  {typeof step === "string" ? step : step.title}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student List */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
          {filtered.map((student) => (
            <StudentRow key={student.studentId} student={student} />
          ))}
        </div>
      )}

      {/* No Search Results */}
      {!loading && !error && students.length > 0 && filtered.length === 0 && (
        <div className="text-center py-8">
          <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No students match your search</p>
        </div>
      )}
    </div>
  );
};

export default EnrolledStudentsTracker;
