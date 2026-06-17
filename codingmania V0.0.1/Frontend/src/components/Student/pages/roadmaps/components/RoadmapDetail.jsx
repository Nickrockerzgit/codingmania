import { ChevronLeft, Clock, CheckCircle2, ExternalLink, Loader2, Sparkles, Route, Award } from "lucide-react";
import { DIFFICULTY_STYLES, getInitials, ROADMAP_COLORS, getCategories } from "../utils";
import { ProgressRing } from "./ProgressRing";
import { ProgressBar } from "./ProgressBar";

export const RoadmapDetail = ({ roadmap, onBack, onToggleStep, toggling }) => {
  const color = ROADMAP_COLORS[roadmap.id % ROADMAP_COLORS.length] || "#5b6ef5";
  const steps = roadmap.steps || [];
  const completedCount = steps.filter((s) => s.completed).length;
  const percent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  const getEncouragement = () => {
    if (percent === 0) return "Let's get started! Your first step awaits.";
    if (percent < 25) return "You're making progress! Keep going!";
    if (percent < 50) return "Almost halfway there — you're doing amazing!";
    if (percent < 75) return "Over halfway done! The finish line is in sight!";
    if (percent < 100) return "Almost there! Just a few more steps!";
    return "Roadmap complete! You crushed it!";
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Roadmaps
      </button>

      {/* Hero */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.9)" }}>
        <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-md"
              style={{ background: color }}>
              {getInitials(roadmap.author?.name)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{roadmap.author?.name || "Anonymous"}</p>
              <p className="text-xs text-gray-400">
                {new Date(roadmap.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <h2 className="text-lg font-extrabold text-gray-900 mb-2">{roadmap.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">{roadmap.description}</p>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            {getCategories(roadmap).map((tag) => (
              <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border"
                style={{ background: `${color}10`, color, borderColor: `${color}25` }}>{tag}</span>
            ))}
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${DIFFICULTY_STYLES[roadmap.difficulty]?.bg} ${DIFFICULTY_STYLES[roadmap.difficulty]?.text} ${DIFFICULTY_STYLES[roadmap.difficulty]?.border}`}>
              {DIFFICULTY_STYLES[roadmap.difficulty]?.label}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock className="w-3.5 h-3.5" /> {roadmap.duration?.replace("_", " ")}
            </span>
          </div>

          {roadmap.isEnrolled ? (
            <div className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
              <div className="flex items-center gap-4">
                <ProgressRing percent={percent} color={color} size={64} strokeWidth={6} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">{completedCount} of {steps.length} steps</span>
                    {percent === 100 && <Sparkles className="w-4 h-4 text-amber-500" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{getEncouragement()}</p>
                  <ProgressBar percent={percent} color={color} height={6} showLabel={false} />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-500">Enrol in this roadmap to track your progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      < RoadmapSteps 
        steps={steps} 
        roadmap={roadmap} 
        color={color} 
        onToggleStep={onToggleStep} 
        toggling={toggling} 
      />

      {/* Completion */}
      {roadmap.isEnrolled && percent === 100 && (
        <div className="rounded-2xl p-6 text-center" style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)`, border: `1px solid ${color}20` }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}20` }}>
            <Award className="w-8 h-8" style={{ color }} />
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">Roadmap Complete!</h3>
          <p className="text-sm text-gray-500">You finished all steps. Amazing work!</p>
        </div>
      )}
    </div>
  );
};

const RoadmapSteps = ({ steps, roadmap, color, onToggleStep, toggling }) => {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.9)" }}>
      <div className="px-6 py-4 border-b border-gray-100/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}>
          <Route className="w-4 h-4" style={{ color }} />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color }}>Step by Step</span>
          <h3 className="text-base font-bold text-gray-900 leading-none">Milestones</h3>
        </div>
        <span className="ml-auto text-[11px] text-gray-400">{steps.length} steps</span>
      </div>

      <div className="p-4">
        <div className="relative">
          {steps.length > 1 && (
            <div className="absolute left-[19px] top-6 bottom-6 w-0.5" style={{ background: `${color}20` }} />
          )}
          <div className="space-y-1">
            {steps.map((step, idx) => (
              <div key={step.id} className={`relative flex gap-3 p-3 rounded-xl transition-all ${step.completed ? "opacity-70" : "hover:bg-white/60"}`}>
                <button
                  onClick={() => roadmap.isEnrolled && onToggleStep(roadmap.id, step.id)}
                  disabled={!roadmap.isEnrolled || toggling === step.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 z-10 ${
                    step.completed ? "text-white shadow-md" : roadmap.isEnrolled ? "border-2 border-gray-200 hover:border-current hover:scale-110 bg-white" : "border-2 border-gray-150 bg-white cursor-default"
                  }`}
                  style={step.completed ? { background: color } : roadmap.isEnrolled ? { color } : {}}
                >
                  {toggling === step.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color }} />
                  ) : step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold leading-snug ${step.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                    {step.title}
                  </h4>
                  {step.description && (
                    <p className={`text-xs mt-0.5 leading-relaxed ${step.completed ? "text-gray-300" : "text-gray-500"}`}>
                      {step.description}
                    </p>
                  )}
                  {step.link && (
                    <a href={step.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-medium mt-1.5 hover:underline" style={{ color }}>
                      <ExternalLink className="w-3 h-3" /> Open resource
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
};

export default RoadmapDetail;