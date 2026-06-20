import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAlumni, AlumniProfile } from "../../../api/mentorsApi";
import {
  GraduationCap,
  Search,
  Filter,
  Building2,
  Briefcase,
  MessageSquare,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";

const fallbackAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Alumni")}&background=5b6ef5&color=fff&size=128`;

interface Alumni extends AlumniProfile {
  user?: {
    name?: string;
  };
}

const AlumniCard = ({ alumni, onConnect }: { alumni: Alumni; onConnect: (userId: number) => void }) => {
  const name = alumni.user?.name || alumni.name || "Alumni";
  const batch = alumni.batch || "—";
  const branch = alumni.branch || "—";
  const company = alumni.company || "—";
  const position = alumni.position || "—";

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <div className="relative mb-4">
        <img
          src={alumni.imageUrl || alumni.avatar || fallbackAvatar(name)}
          alt={name}
          className="w-20 h-20 rounded-2xl object-cover shadow-md"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackAvatar(name);
          }}
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
      </div>

      <h4 className="text-sm font-bold text-white leading-tight">{name}</h4>

      <div className="flex items-center gap-1.5 mt-1.5">
        <Briefcase className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <p className="text-xs text-gray-300 font-medium truncate">
          {position} at {company}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mt-1">
        <GraduationCap className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <p className="text-xs text-gray-400">
          {branch} · Batch {batch}
        </p>
      </div>

      {alumni.bio && (
        <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">
          {alumni.bio}
        </p>
      )}

      <div className="mt-3 mb-4">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400">
          <Building2 className="w-3 h-3" />
          {company}
        </span>
      </div>

      <button
        onClick={() => onConnect(alumni.userId)}
        className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:shadow-md hover:brightness-110 bg-gradient-to-r from-red-600 to-orange-600"
      >
        <span className="flex items-center justify-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Connect
        </span>
      </button>
    </div>
  );
};

const StudentMentors = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await getAllAlumni();
        if (mounted) setAlumni(res.data);
      } catch {
        if (mounted) setError("Failed to load mentors.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const branches = useMemo(
    () => [...new Set(alumni.map((a) => a.branch).filter(Boolean))].sort(),
    [alumni]
  );
  const batches = useMemo(
    () => [...new Set(alumni.map((a) => String(a.batch)).filter(Boolean))].sort(),
    [alumni]
  );

  const filtered = useMemo(() => {
    return alumni.filter((a) => {
      const name = a.user?.name?.toLowerCase() || a.name?.toLowerCase() || "";
      const company = a.company?.toLowerCase() || "";
      const position = a.position?.toLowerCase() || "";
      const q = search.toLowerCase();
      const matchSearch =
        !q || name.includes(q) || company.includes(q) || position.includes(q);
      const matchBranch = selectedBranch === "All" || a.branch === selectedBranch;
      const matchBatch = selectedBatch === "All" || String(a.batch) === selectedBatch;
      return matchSearch && matchBranch && matchBatch;
    });
  }, [alumni, search, selectedBranch, selectedBatch]);

  const handleConnect = (userId: number) => {
    navigate(`/login/student/dashboard?tab=messages&targetUserId=${userId}`);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedBranch("All");
    setSelectedBatch("All");
  };

  const hasActiveFilters = search || selectedBranch !== "All" || selectedBatch !== "All";

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-red-400 font-semibold">
                Connect
              </span>
              <h3 className="text-base font-bold text-white leading-none">
                Find a Mentor
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
                placeholder="Search by name, company..."
                className="pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 w-52 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-medium transition-all ${
                showFilters || hasActiveFilters
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="px-6 py-3 border-b border-white/10 flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl text-xs text-white pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
              >
                <option value="All">All Branches</option>
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl text-xs text-white pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
              >
                <option value="All">All Batches</option>
                {batches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        )}

        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading mentors...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-sm text-red-500 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-sm text-gray-300 font-medium">No mentors found</p>
              <p className="text-xs text-gray-400">Try adjusting your filters</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <p className="text-xs text-gray-400 mb-4">
                {filtered.length} mentor{filtered.length !== 1 ? "s" : ""} available
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((a) => (
                  <AlumniCard
                    key={a.id}
                    alumni={a}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMentors;