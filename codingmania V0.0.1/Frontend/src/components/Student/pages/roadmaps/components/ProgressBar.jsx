import { CheckCircle2 } from "lucide-react";

export const ProgressBar = ({ percent, color = "#5b6ef5", height = 8, showLabel = true }) => (
  <div>
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: `${color}15` }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
        style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
      >
        {percent > 0 && percent < 100 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        )}
      </div>
    </div>
    {showLabel && (
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] font-semibold" style={{ color }}>{percent}% complete</span>
        {percent === 100 && <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Done!</span>}
      </div>
    )}
  </div>
);

export default ProgressBar;