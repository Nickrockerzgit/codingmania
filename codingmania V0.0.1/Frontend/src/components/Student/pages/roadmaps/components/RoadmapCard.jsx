import { ArrowRight, Clock, Users, BookOpen, Plus } from "lucide-react";
import { DIFFICULTY_STYLES, getInitials, ROADMAP_COLORS, getCategories } from "../utils";
import { ProgressBar } from "./ProgressBar";

export const RoadmapCard = ({ roadmap, onView, onEnrol, enrolling }) => {
  const diffStyle = DIFFICULTY_STYLES[roadmap.difficulty] || DIFFICULTY_STYLES.beginner;
  const color = ROADMAP_COLORS[roadmap.id % ROADMAP_COLORS.length] || "#5b6ef5";
  const categories = getCategories(roadmap);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
      style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.9)" }}
      onClick={() => onView(roadmap)}
    >
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white ring-2 ring-white shadow-sm"
            style={{ background: color }}>
            {getInitials(roadmap.author?.name)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{roadmap.author?.name || "Anonymous"}</p>
          </div>
          <span className="ml-auto text-[10px] text-gray-400 font-medium flex-shrink-0">
            {new Date(roadmap.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-indigo-700 transition-colors">
          {roadmap.title}
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{roadmap.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg border"
              style={{ background: `${color}10`, color, borderColor: `${color}25` }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
            {diffStyle.label}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Clock className="w-3 h-3" /> {roadmap.duration?.replace("_", " ")}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <BookOpen className="w-3 h-3" /> {roadmap.stepCount || roadmap.steps?.length || 0} steps
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Users className="w-3 h-3" /> {roadmap.enrolledStudents || 0}
          </span>
        </div>

        {roadmap.isEnrolled ? (
          <div className="pt-3 border-t border-gray-100/60">
            <ProgressBar percent={roadmap.progressPercent || 0} color={color} />
            <button
              className="w-full mt-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:shadow-md"
              style={{ background: `${color}12`, color }}
            >
              Continue Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            disabled={enrolling}
            className="w-full py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:shadow-md hover:brightness-110 mt-1 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
            onClick={(e) => { e.stopPropagation(); onEnrol(roadmap.id); }}
          >
            {enrolling ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enrolling...</> : <><Plus className="w-3.5 h-3.5" /> Enrol in Roadmap</>}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoadmapCard;