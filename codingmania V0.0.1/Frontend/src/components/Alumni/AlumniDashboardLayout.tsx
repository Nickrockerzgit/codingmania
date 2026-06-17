import { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Home,
  TrendingUp,
  TrendingDown,
  Bell,
  Search,
  GraduationCap,
  Briefcase,
  Users,
  FolderGit2,
  Map,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Calendar,
  Award,
} from "lucide-react";

const STUDENTS_DATA = [12, 18, 15, 22, 28, 25, 32, 38, 35, 42, 48, 52];
const ANSWERS_DATA = [8, 12, 10, 15, 18, 20, 22, 25, 28, 30, 35, 40];
const JOBS_DATA = [2, 3, 1, 4, 5, 3, 6, 4, 5, 7, 6, 8];

const MiniBarChart = ({ data, barHex, id }: { data: number[]; barHex: string; id: string }) => {
  const max = Math.max(...data);
  const W = 200;
  const H = 80;
  const n = data.length;
  const gap = 3;
  const bw = Math.floor(W / n) - gap;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <pattern id={`dots-${id}`} x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill={barHex} opacity="0.55" />
        </pattern>
        <pattern id={`lines-${id}`} x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <line x1="0" y1="5" x2="5" y2="0" stroke={barHex} strokeWidth="1.2" opacity="0.55" />
        </pattern>
        <linearGradient id={`solid-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={barHex} stopOpacity="0.9" />
          <stop offset="100%" stopColor={barHex} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {data.map((val, i) => {
        const bh = Math.max((val / max) * (H - 6), 4);
        const x = i * (W / n) + gap / 2;
        const y = H - bh;
        const third = Math.floor(n / 3);
        const fill =
          i < third
            ? `url(#dots-${id})`
            : i < third * 2
              ? `url(#lines-${id})`
              : `url(#solid-${id})`;

        return (
          <rect
            key={i}
            x={x} y={y}
            width={bw} height={bh}
            rx={3}
            fill={fill}
          />
        );
      })}
    </svg>
  );
};

interface StatCardProps {
  label: string;
  Icon: React.ElementType;
  value: string;
  trendUp: boolean;
  trendLabel: string;
  data: number[];
  barHex: string;
  bgFrom: string;
  bgTo: string;
  textColor: string;
  id: string;
}

const StatCard = ({ label, Icon, value, trendUp, trendLabel, data, barHex, bgFrom, bgTo, textColor, id }: StatCardProps) => (
  <div
    className="rounded-3xl p-6 flex flex-col gap-1 overflow-hidden relative"
    style={{ background: `linear-gradient(145deg, ${bgFrom}, ${bgTo})` }}
  >
    <div className="flex items-start justify-between mb-1">
      <p className={`text-sm font-semibold ${textColor} opacity-80`}>{label}</p>
      <Icon className={`w-4 h-4 ${textColor} opacity-50 flex-shrink-0`} />
    </div>

    <div className="flex items-end gap-2.5 mb-0.5">
      <span className={`text-[42px] font-extrabold leading-none ${textColor}`}>{value}</span>
      <span
        className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full mb-1
          ${trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}
      >
        {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trendLabel}
      </span>
    </div>

    <p className={`text-[11px] font-medium ${textColor} opacity-50 mb-3`}>vs last month</p>

    <div className="h-20 -mx-1">
      <MiniBarChart data={data} barHex={barHex} id={id} />
    </div>
  </div>
);

interface SidebarButtonProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
  isLogout?: boolean;
  accent?: "default" | "danger";
}

const SidebarButton = ({ icon: Icon, label, active, expanded, onClick, isLogout, accent = "default" }: SidebarButtonProps) => {
  const baseClass = `flex items-center gap-3 rounded-2xl transition-all duration-200 flex-shrink-0 ${expanded ? "w-full px-3 py-2.5" : "w-10 h-10 justify-center mx-auto"}`;

  const style = isLogout
    ? { color: accent === "danger" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.45)" }
    : {
        background: active ? "rgba(255,255,255,0.18)" : "transparent",
        color: active ? "#ffffff" : "rgba(255,255,255,0.35)",
      };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isLogout) {
      (e.target as HTMLElement).style.color = accent === "danger" ? "#fca5a5" : "#ddd6fe";
      (e.target as HTMLElement).style.background = accent === "danger" ? "rgba(239,68,68,0.12)" : "rgba(139,92,246,0.14)";
    } else if (!active) {
      (e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)";
      (e.target as HTMLElement).style.background = "rgba(255,255,255,0.08)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isLogout) {
      (e.target as HTMLElement).style.color = accent === "danger" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.45)";
      (e.target as HTMLElement).style.background = "transparent";
    } else if (!active) {
      (e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)";
      (e.target as HTMLElement).style.background = "transparent";
    }
  };

  return (
    <button
      onClick={onClick}
      title={!expanded ? label : undefined}
      className={baseClass}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Icon className="w-[17px] h-[17px] flex-shrink-0" />
      {expanded && (
        <span className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </span>
      )}
    </button>
  );
};

const SIDEBAR_NAV = [
  { key: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
  { key: "profile", Icon: User, label: "Profile" },
  { key: "roadmaps", Icon: Map, label: "Roadmaps" },
  { key: "jobs", Icon: Briefcase, label: "Jobs" },
  { key: "events", Icon: Calendar, label: "Events" },
  { key: "events2", Icon: Calendar, label: "Events 2" },
  { key: "certificates", Icon: Award, label: "Certificates" },
  { key: "projects", Icon: FolderGit2, label: "Projects" },
  { key: "qa", Icon: MessageSquare, label: "Q&A Board" },
  { key: "messages", Icon: Mail, label: "Messages" },
  { key: "settings", Icon: Settings, label: "Settings" },
];

const AlumniDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [greeting, setGreeting] = useState("Good morning");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    studentsConnected: 12,
    qaAnswered: 8,
    jobsPosted: 3,
  });

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const checkSize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      if (w < 768) setSidebarExpanded(false);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };
  const handleBackToWebsite = () => { navigate("/"); };

  const activeKey = useMemo(() => {
    const path = location.pathname.replace(/\/+$/, "");
    const segments = path.split("/");
    const last = segments[segments.length - 1];
    if (last === "dashboard") return "dashboard";
    return last;
  }, [location.pathname]);

  const isDashboard = activeKey === "dashboard";

  const handleNavClick = useCallback((key: string) => {
    if (key === "dashboard") {
      navigate("/login/alumni/dashboard");
    } else {
      navigate(`/login/alumni/dashboard/${key}`);
    }
    if (isMobile) setMobileMenuOpen(false);
  }, [navigate, isMobile]);

  const displayName = user?.name?.split(" ")[0] || "Alumni";
  const userInitials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "AL";

  const SIDEBAR_WIDTH = sidebarExpanded ? "w-[220px]" : "w-[68px]";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#ECEBF8", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          flex-shrink-0 flex flex-col py-5 gap-1 overflow-hidden transition-all duration-300 ease-in-out
          ${isMobile
            ? `fixed top-0 left-0 h-full z-50 w-[240px] ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`
            : SIDEBAR_WIDTH
          }
        `}
        style={{ background: "#0f0f1e" }}
      >
        <div className={`flex items-center ${sidebarExpanded || isMobile ? "px-4 justify-between" : "justify-center"} mb-5 flex-shrink-0`}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {(sidebarExpanded || isMobile) && (
              <span className="text-white text-sm font-bold whitespace-nowrap">Alumni Hub</span>
            )}
          </div>

          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {!isMobile && (
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        <div className={`flex flex-col gap-0.5 flex-1 ${sidebarExpanded || isMobile ? "px-3" : "px-0 items-center"}`}>
          {SIDEBAR_NAV.map(({ key, Icon, label }) => (
            <SidebarButton
              key={key}
              icon={Icon}
              label={label}
              active={activeKey === key}
              expanded={sidebarExpanded || isMobile}
              onClick={() => handleNavClick(key)}
            />
          ))}
        </div>

        <div className={`mt-auto ${sidebarExpanded || isMobile ? "px-3" : "px-0 flex justify-center"}`}>
          <SidebarButton
            icon={Home}
            label="Back to website"
            expanded={sidebarExpanded || isMobile}
            onClick={handleBackToWebsite}
            isLogout
            accent="default"
          />
          <SidebarButton
            icon={LogOut}
            label="Sign out"
            expanded={sidebarExpanded || isMobile}
            onClick={handleLogout}
            isLogout
            accent="danger"
          />
        </div>
      </aside>

      {isDashboard ? (
        <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between px-4 md:px-7 pt-5 md:pt-6 pb-0 flex-shrink-0 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="w-10 h-10 rounded-2xl bg-white/70 border border-white/70 flex items-center justify-center text-gray-500 hover:bg-white/90 transition-colors flex-shrink-0"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-extrabold text-gray-900 leading-tight truncate">
                  {greeting}, {displayName}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">Here's your alumni dashboard overview</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-2.5 flex-shrink-0">
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-2xl text-sm placeholder-gray-300 text-gray-700 outline-none w-40 md:w-64 border border-white/70 focus:border-[#5b6ef5]/30 transition-colors"
                />
              </div>

              {isMobile && (
                <button className="w-10 h-10 rounded-2xl bg-white/70 border border-white/70 flex items-center justify-center text-gray-400 hover:bg-white/90 transition-colors flex-shrink-0">
                  <Search className="w-4 h-4" />
                </button>
              )}

              <div className="relative flex-shrink-0">
                <button className="w-10 h-10 rounded-2xl bg-white/70 border border-white/70 flex items-center justify-center text-gray-400 hover:bg-white/90 transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#5b6ef5] text-white text-[9px] font-bold flex items-center justify-center">
                  2
                </span>
              </div>

              <div className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 bg-white/70 border border-white/70 rounded-2xl cursor-pointer hover:bg-white/90 transition-colors flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#5b6ef5]/10 flex items-center justify-center text-[10px] font-bold text-[#5b6ef5] flex-shrink-0">
                  {userInitials}
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="p-4 md:p-7 space-y-5">
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #5b6ef5, #7c3aed)",
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/5 rounded-full" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70 font-semibold uppercase tracking-widest mb-1">
                    {greeting} 👋
                  </p>
                  <h2 className="text-xl font-extrabold text-white">
                    Welcome back, {displayName}
                  </h2>
                  <p className="text-sm text-white/70 mt-1">
                    Here's what's happening with your network today.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/15 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">{stats.studentsConnected} students connected</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                id="mentors"
                label="Students Connected"
                Icon={Users}
                value={`+${stats.studentsConnected}`}
                trendUp={true}
                trendLabel={`+${stats.studentsConnected}`}
                data={STUDENTS_DATA}
                barHex="#5b6ef5"
                bgFrom="#dde0f8"
                bgTo="#c9cef4"
                textColor="text-indigo-900"
              />
              <StatCard
                id="qa"
                label="Q&A Answered"
                Icon={MessageSquare}
                value={`+${stats.qaAnswered}`}
                trendUp={true}
                trendLabel={`+${stats.qaAnswered}`}
                data={ANSWERS_DATA}
                barHex="#3b82f6"
                bgFrom="#d6edf9"
                bgTo="#bdddf5"
                textColor="text-blue-900"
              />
              <StatCard
                id="jobs"
                label="Jobs Posted"
                Icon={Briefcase}
                value={`+${stats.jobsPosted}`}
                trendUp={true}
                trendLabel={`+${stats.jobsPosted}`}
                data={JOBS_DATA}
                barHex="#a855f7"
                bgFrom="#ead6f7"
                bgTo="#d9bdf2"
                textColor="text-purple-900"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.8)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#5b6ef5]/10 flex items-center justify-center">
                    <div className="w-4 h-px bg-[#5b6ef5]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#5b6ef5] font-semibold">Quick</span>
                    <h3 className="text-sm font-bold text-gray-900 leading-none">Quick Actions</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Edit Profile", desc: "Update your professional info", Icon: User },
                    { label: "Post a Job", desc: "Share opportunities with students", Icon: Briefcase },
                    { label: "Start Mentoring", desc: "Connect with students seeking guidance", Icon: GraduationCap },
                  ].map(({ label, desc, Icon }) => (
                    <div
                      key={label}
                      onClick={() => {
                        if (label === "Edit Profile") handleNavClick("profile");
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#5b6ef5]/5 transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#5b6ef5]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#5b6ef5]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#5b6ef5] transition-colors">{label}</p>
                        <p className="text-[11px] text-gray-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.8)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#5b6ef5]/10 flex items-center justify-center">
                    <div className="w-4 h-px bg-[#5b6ef5]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#5b6ef5] font-semibold">Feed</span>
                    <h3 className="text-sm font-bold text-gray-900 leading-none">Recent Activity</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { text: "Rohan Gupta sent you a message", time: "2h ago" },
                    { text: "New student joined your mentorship", time: "1d ago" },
                    { text: "Your job posting got 12 applications", time: "2d ago" },
                  ].map(({ text, time }, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100/60 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5b6ef5] mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700">{text}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #5b6ef5, #7c3aed)" }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full" />
                <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Impact</p>
                <p className="text-4xl font-extrabold leading-none mb-1">{stats.studentsConnected + stats.qaAnswered + stats.jobsPosted}</p>
                <p className="text-sm opacity-80 font-medium">Total contributions</p>
                <div className="mt-4 pt-3 border-t border-white/20">
                  <p className="text-xs opacity-60">{stats.studentsConnected} Students · {stats.qaAnswered} Answers · {stats.jobsPosted} Jobs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto" style={{ background: "#ECEBF8" }}>
          {isMobile && (
            <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3 bg-[#ECEBF8]/90 backdrop-blur-sm">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 rounded-2xl bg-white/70 border border-white/70 flex items-center justify-center text-gray-500 hover:bg-white/90 transition-colors flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-base font-bold text-gray-900 truncate capitalize">
                {activeKey}
              </h1>
            </div>
          )}
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDashboardLayout;
