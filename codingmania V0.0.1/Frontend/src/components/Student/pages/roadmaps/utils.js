export const DIFFICULTY_STYLES = {
  beginner: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", label: "Beginner" },
  intermediate: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", label: "Intermediate" },
  advanced: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", label: "Advanced" },
};

export const getInitials = (name) =>
  (name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export const ROADMAP_COLORS = ["#5b6ef5", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899", "#06b6d4"];

export const getCategories = (roadmap) => {
  return Array.isArray(roadmap.category) ? roadmap.category : (roadmap.category ? roadmap.category.split(",") : []);
};