import { useState, useEffect, useMemo } from "react";
import { getJobs } from "../../../api/jobsApi";
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Calendar,
  Building2,
  ChevronDown,
  ExternalLink,
  Loader2,
} from "lucide-react";

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  deadline: string;
  description?: string;
  applicationLink?: string;
  tags: string[];
  posterId: number;
  poster?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

const JobCard = ({ job }: { job: Job }) => {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
          style={{ background: "linear-gradient(135deg, #dc2626, #ea580c)" }}
        >
          {job.company[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                {job.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-300 font-medium">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  {job.company}
                </span>
                <span className="text-gray-400">·</span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  {job.location}
                </span>
              </div>
            </div>

            <span
              className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border
                ${
                  job.type === "Internship"
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "bg-green-500/15 text-green-400 border-white/10"
                }`}
            >
              {job.type === "INTERNSHIP" ? "Internship" : "Full-time"}
            </span>
          </div>

          {job.description && (
            <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">{job.description}</p>
          )}

          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {job.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {job.poster && (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center text-[8px] font-bold text-white">
                  {job.poster.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <span className="text-[11px] text-gray-400 font-medium">{job.poster.name}</span>
              </div>
            )}
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock className="w-3 h-3" />
              {timeAgo(job.createdAt)}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Calendar className="w-3 h-3" />
              Deadline: {job.deadline}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-4 pt-3 border-t border-white/10">
        {job.applicationLink ? (
          <a
            href={job.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-md hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #dc2626, #ea580c)" }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Apply Now
          </a>
        ) : (
          <span className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-400 bg-white/5 rounded-xl cursor-not-allowed">
            <ExternalLink className="w-3.5 h-3.5" />
            Application link not available
          </span>
        )}
      </div>
    </div>
  );
};

const StudentJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await getJobs();
        if (mounted) setJobs(res.data);
      } catch {
        if (mounted) setError("Failed to load jobs.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        (job.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchType = typeFilter === "All" || job.type === typeFilter || 
        (typeFilter === "Internship" && job.type === "INTERNSHIP") ||
        (typeFilter === "Full-time" && job.type === "FULL_TIME");
      return matchSearch && matchType;
    });
  }, [jobs, search, typeFilter]);

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-red-400 font-semibold">
                Opportunities
              </span>
              <h3 className="text-base font-bold text-white leading-none">
                Jobs & Internships
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role, company..."
                className="pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 w-52 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-medium transition-all ${
                showFilters || typeFilter !== "All"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
              {typeFilter !== "All" && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="px-6 py-3 border-b border-white/10 flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl text-xs text-white pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {typeFilter !== "All" && (
              <button
                onClick={() => setTypeFilter("All")}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-2.5 border-b border-white/10 flex items-center gap-4">
          <span className="text-[11px] text-gray-400">
            {filtered.length} opportunit{filtered.length !== 1 ? "ies" : "y"} found
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <span className="flex items-center gap-1.5 text-[11px] text-gray-300">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {jobs.filter((j) => j.type === "INTERNSHIP").length} Internships
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-gray-300">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              {jobs.filter((j) => j.type === "FULL_TIME").length} Full-time
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading jobs...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm text-red-500 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-3">
                <Briefcase className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-sm text-gray-300 font-medium">No jobs found</p>
              <p className="text-xs text-gray-400 mt-1">Check back later for new opportunities</p>
            </div>
          )}

          {!loading && !error && filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentJobs;
