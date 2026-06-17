import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  BookOpen,
  Map,
  CheckCircle2,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Loader2,
  WifiOff,
} from "lucide-react";
import { getRoadmapAnalytics } from "../../../../alumni.api";

// ─── Animated Counter Hook ──────────────────────────────────────────────────

const useAnimatedCounter = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = 0;
    const end = Number(target) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
};

// ─── Skeleton Loader ────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="rounded-2xl p-5 animate-pulse"
    style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
    <div className="flex items-start justify-between mb-3">
      <div className="h-3 w-20 bg-gray-200 rounded" />
      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
    </div>
    <div className="h-7 w-16 bg-gray-200 rounded" />
  </div>
);

const SkeletonChart = () => (
  <div className="rounded-2xl p-6 animate-pulse"
    style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
      <div className="space-y-1">
        <div className="h-2 w-12 bg-gray-200 rounded" />
        <div className="h-3 w-28 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="h-40 bg-gray-100 rounded-xl" />
  </div>
);

const SkeletonList = () => (
  <div className="rounded-2xl p-6 animate-pulse"
    style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
      <div className="space-y-1">
        <div className="h-2 w-12 bg-gray-200 rounded" />
        <div className="h-3 w-28 bg-gray-200 rounded" />
      </div>
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-gray-50/80">
        <div className="w-7 h-7 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-1">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-2 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-10 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <SkeletonChart /><SkeletonChart />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <SkeletonList /><SkeletonList /><SkeletonList />
    </div>
  </div>
);

// ─── Error Fallback ─────────────────────────────────────────────────────────

const ErrorFallback = ({ error, onRetry, loading }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6">
    <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
      <WifiOff className="w-8 h-8 text-rose-400" />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-1">Failed to load analytics</h3>
    <p className="text-sm text-gray-400 text-center max-w-md mb-6">
      {error || "Unable to connect to the server. Please check your connection and try again."}
    </p>
    <button
      onClick={onRetry}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-60"
      style={{ background: "linear-gradient(135deg, #5b6ef5, #7c3aed)" }}
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Retrying...</>
      ) : (
        <><RefreshCw className="w-4 h-4" /> Retry</>
      )}
    </button>
  </div>
);

// ─── Section Header ─────────────────────────────────────────────────────────

const SectionHeader = ({ accent, title, Icon }) => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-[#5b6ef5]/10 flex items-center justify-center">
      <Icon className="w-4 h-4 text-[#5b6ef5]" />
    </div>
    <div>
      <span className="text-[10px] uppercase tracking-widest text-[#5b6ef5] font-semibold">
        {accent}
      </span>
      <h3 className="text-sm font-bold text-gray-900 leading-none">{title}</h3>
    </div>
  </div>
);

// ─── Glass Card Wrapper ─────────────────────────────────────────────────────

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#5b6ef5]/5 ${className}`}
    style={{
      background: "rgba(255,255,255,0.65)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.8)",
    }}
  >
    {children}
  </div>
);

// ─── Stat Card ──────────────────────────────────────────────────────────────

const StatCard = ({ label, value, suffix = "", Icon, color }) => {
  const numericValue = typeof value === "number" ? value : parseInt(value, 10) || 0;
  const animatedValue = useAnimatedCounter(numericValue);

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#5b6ef5]/5 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.8)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-gray-900 tabular-nums">
        {animatedValue}{suffix}
      </p>
    </div>
  );
};

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 shadow-xl border border-gray-100"
      style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)" }}>
      <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

// ─── Difficulty Donut ───────────────────────────────────────────────────────

const DifficultyDonut = ({ data }) => {
  if (!data?.length) return <EmptyState message="No difficulty data" />;

  const COLORS = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#ef4444" };

  return (
    <div className="flex items-center gap-4">
      <div className="w-32 h-32 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={55}
              paddingAngle={3}
              dataKey="count"
              animationDuration={1200}
              animationBegin={200}
            >
              {data.map((entry) => (
                <Cell key={entry.level} fill={COLORS[entry.level] || "#94a3b8"} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-3">
        {data.map((d) => (
          <div key={d.level} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[d.level] || "#94a3b8" }} />
                <span className="text-xs font-semibold text-gray-700">{d.level}</span>
              </div>
              <span className="text-xs font-bold text-gray-500 tabular-nums">
                {d.count} ({d.pct}%)
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${d.pct}%`, background: COLORS[d.level] || "#94a3b8" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Empty State ────────────────────────────────────────────────────────────

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
      <AlertTriangle className="w-5 h-5 text-gray-400" />
    </div>
    <p className="text-sm text-gray-400">{message || "No data available"}</p>
  </div>
);

// ─── Time Period Options ────────────────────────────────────────────────────

const PERIOD_OPTIONS = [
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ─── Main Component ─────────────────────────────────────────────────────────

const REFRESH_INTERVAL = 30000; // 30 seconds

const RoadmapAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const res = await getRoadmapAnalytics(period);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    intervalRef.current = setInterval(() => fetchData(true), REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  // ── Chart data transformations ──

  const monthlyChartData = data ? MONTHS.map((m, i) => ({
    month: m,
    Enrollments: data.monthlyEnrollments[i] || 0,
    Completions: data.monthlyCompletions[i] || 0,
  })) : [];

  const categoryChartData = data?.categoryBreakdown?.map((c) => ({
    name: c.category,
    value: c.count,
    pct: c.pct,
  })) || [];

  const CATEGORY_COLORS = ["#5b6ef5", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

  // ── Render ──

  if (loading) return <LoadingSkeleton />;
  if (error && !data) return <ErrorFallback error={error} onRetry={() => fetchData()} loading={loading} />;

  return (
    <div className="space-y-5">
      {/* Header with Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Analytics Overview</h2>
          <p className="text-xs text-gray-400">Real-time insights from your roadmaps</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/80 border border-gray-200 text-gray-500 hover:text-[#5b6ef5] hover:border-[#5b6ef5]/30 transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/80 border border-gray-200">
            {PERIOD_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  period === value
                    ? "bg-[#5b6ef5] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Banner (non-blocking when we have cached data) */}
      {error && data && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Showing cached data. {error}</span>
        </div>
      )}

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Students"
          value={data.totalEnrolled}
          Icon={Users}
          color="#5b6ef5"
        />
        <StatCard
          label="Avg Completion"
          value={data.avgCompletion}
          suffix="%"
          Icon={Target}
          color="#10b981"
        />
        <StatCard
          label="Completed"
          value={data.totalCompleted}
          Icon={CheckCircle2}
          color="#a855f7"
        />
        <StatCard
          label="Roadmaps"
          value={data.totalRoadmaps}
          Icon={Map}
          color="#f59e0b"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Enrollments */}
        <GlassCard>
          <SectionHeader accent="Trend" title="Monthly Enrollments" Icon={TrendingUp} />
          {monthlyChartData.some((d) => d.Enrollments > 0) ? (
            <div className="h-52 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyChartData}>
                  <defs>
                    <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5b6ef5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#5b6ef5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Enrollments"
                    stroke="#5b6ef5"
                    strokeWidth={2.5}
                    fill="url(#enrollGrad)"
                    dot={{ r: 3, fill: "#5b6ef5", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 5, fill: "#5b6ef5", stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={1400}
                    animationBegin={100}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No enrollment data yet" />
          )}
        </GlassCard>

        {/* Monthly Completions */}
        <GlassCard>
          <SectionHeader accent="Trend" title="Monthly Completions" Icon={CheckCircle2} />
          {monthlyChartData.some((d) => d.Completions > 0) ? (
            <div className="h-52 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="Completions"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    animationDuration={1200}
                    animationBegin={200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No completion data yet" />
          )}
        </GlassCard>
      </div>

      {/* Rankings + Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Most Completed Roadmaps */}
        <GlassCard>
          <SectionHeader accent="Top" title="Most Completed" Icon={Trophy} />
          {data.topRoadmaps?.length ? (
            <div className="space-y-2.5 mt-4">
              {data.topRoadmaps.map((r, i) => (
                <div
                  key={r.id || r.title}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-200 hover:translate-x-0.5"
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{
                      background:
                        i === 0 ? "#f59e0b" :
                        i === 1 ? "#94a3b8" :
                        i === 2 ? "#a855f7" :
                        "#cbd5e1",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{r.title}</p>
                    <p className="text-[11px] text-gray-400">{r.enrolled} enrolled</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-600 tabular-nums">{r.completion}%</p>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                        style={{ width: `${r.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No roadmap data yet" />
          )}
        </GlassCard>

        {/* Needs Improvement */}
        <GlassCard>
          <SectionHeader accent="Attention" title="Needs Improvement" Icon={TrendingDown} />
          {data.leastCompleted?.length ? (
            <div className="space-y-2.5 mt-4">
              {data.leastCompleted.map((r) => (
                <div
                  key={r.id || r.title}
                  className="p-3 rounded-xl bg-gray-50/80 hover:bg-rose-50/60 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-800 truncate pr-2">{r.title}</p>
                    <span className="text-xs font-bold text-rose-500 tabular-nums flex-shrink-0">{r.completion}%</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span>{r.enrolled} enrolled</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-rose-400 transition-all duration-700"
                        style={{ width: `${Math.max(r.completion, 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-500 font-medium">All roadmaps are performing well!</p>
              <p className="text-xs text-gray-400 mt-0.5">No roadmaps below 35% completion</p>
            </div>
          )}
        </GlassCard>

        {/* Difficulty Breakdown */}
        <GlassCard>
          <SectionHeader accent="Breakdown" title="By Difficulty" Icon={BarChart3} />
          {data.difficultyBreakdown?.length ? (
            <div className="mt-4">
              <DifficultyDonut data={data.difficultyBreakdown} />
            </div>
          ) : (
            <EmptyState message="No difficulty data" />
          )}
        </GlassCard>
      </div>

      {/* Category Breakdown */}
      <GlassCard>
        <SectionHeader accent="Categories" title="Enrollment by Category" Icon={BookOpen} />
        {categoryChartData.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Pie Chart */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1200}
                    animationBegin={300}
                    label={({ name, pct }) => `${name} (${pct}%)`}
                    labelLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
                  >
                    {categoryChartData.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} students`, name]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* List */}
            <div className="space-y-3">
              {categoryChartData.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-700 truncate">{c.name}</span>
                      <span className="text-xs font-bold text-gray-500 tabular-nums">{c.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${c.pct}%`, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState message="No category data available" />
        )}
      </GlassCard>
    </div>
  );
};

export default RoadmapAnalytics;
