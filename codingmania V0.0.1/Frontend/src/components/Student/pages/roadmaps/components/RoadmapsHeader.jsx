import { Map, Search, Compass, Sparkles, ArrowRight } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { ROADMAP_COLORS } from "../utils";

export const RoadmapsHeader = ({ 
  search, 
  setSearch, 
  filterDifficulty, 
  setFilterDifficulty, 
  tab, 
  setTab, 
  browseRoadmaps, 
  enrolledRoadmaps, 
  setSelectedRoadmap 
}) => {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
      <div className="px-6 py-4 border-b border-gray-100/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Map className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-indigo-500 font-semibold">Learn</span>
            <h3 className="text-base font-bold text-gray-900 leading-none">Learning Roadmaps</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roadmaps..."
              className="pl-9 pr-3 py-2 bg-white/70 border border-gray-200 rounded-xl text-xs text-gray-700 placeholder-gray-400 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all" />
          </div>
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 bg-white/70 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 appearance-none cursor-pointer">
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-2.5 border-b border-gray-100/40 flex items-center gap-1">
        {[
          { key: "browse", label: "Browse All", icon: Compass, count: browseRoadmaps.length },
          { key: "enrolled", label: "My Roadmaps", icon: Sparkles, count: enrolledRoadmaps.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              tab === key ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
            <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${tab === key ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Enrolled progress summary */}
      {tab === "browse" && enrolledRoadmaps.length > 0 && (
        <div className="px-6 py-3 border-b border-gray-100/30 flex items-center gap-4 overflow-x-auto">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex-shrink-0">Your Progress</span>
          {enrolledRoadmaps.map((r) => {
            const c = ROADMAP_COLORS[r.id % ROADMAP_COLORS.length] || "#5b6ef5";
            return (
              <button key={r.id} onClick={() => setSelectedRoadmap(r)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/60 transition-colors flex-shrink-0">
                <ProgressRing percent={r.progressPercent || 0} size={28} strokeWidth={3} color={c} />
                <span className="text-[11px] font-semibold text-gray-700 max-w-[100px] truncate">{r.title.split("—")[0].split(":")[0].trim()}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const EmptyState = ({ tab, onBrowse }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
        {tab === "browse" ? <Compass className="w-7 h-7 text-indigo-400" /> : <Sparkles className="w-7 h-7 text-indigo-400" />}
      </div>
      <p className="text-sm text-gray-500 font-medium">
        {tab === "browse" ? "No roadmaps found" : "No roadmaps enrolled yet"}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {tab === "browse" ? "Try adjusting your search or filters" : "Browse roadmaps and enrol to start learning"}
      </p>
      {tab === "enrolled" && (
        <button onClick={onBrowse}
          className="mt-4 px-5 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5"
          style={{ background: "linear-gradient(135deg, #5b6ef5, #7c3aed)" }}>
          Browse Roadmaps <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default RoadmapsHeader;