import { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  MessageSquare,
  Briefcase,
  Mail,
  Settings,
  LogOut,
  Home,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  BookOpen,
  Trophy,
  Users,
  FolderGit2,
  Menu,
  X,
  PanelRightClose,
  PanelRightOpen,
  Map,
  Code2,
  Rocket,
  Lightbulb,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Award,
} from "lucide-react";

const MENTOR_DATA = [28, 35, 42, 38, 55, 48, 62, 58, 70, 65, 80, 74];
const HACKATHON_DATA = [15, 22, 18, 30, 25, 35, 28, 40, 38, 45, 42, 50];
const ARTICLE_DATA = [10, 15, 20, 18, 25, 30, 28, 35, 42, 38, 45, 50];

const NETWORK_SOURCES = [
  { name: "Google", pct: 35, hex: "#4285f4" },
  { name: "Microsoft", pct: 25, hex: "#00a4ef" },
  { name: "Razorpay", pct: 15, hex: "#6366f1" },
  { name: "Atlassian", pct: 13, hex: "#0052cc" },
  { name: "TCS / Wipro", pct: 12, hex: "#a855f7" },
];

const RECENT_ALUMNI = [
  { name: "Arjun Verma", email: "arjun.v@google.com", company: "Google", role: "SDE II", initials: "AV", hex: "#4285f4" },
  { name: "Neha Singh", email: "neha.s@microsoft.com", company: "Microsoft", role: "PM", initials: "NS", hex: "#ec4899" },
  { name: "Rahul Mehta", email: "rahul.m@atlassian.com", company: "Atlassian", role: "Frontend", initials: "RM", hex: "#10b981" },
  { name: "Priya Nair", email: "priya.n@stripe.com", company: "Stripe", role: "Backend", initials: "PN", hex: "#a855f7" },
];

const EVENT_TYPE_CONFIG = {
  contest: { icon: Code2, color: "#5b6ef5", label: "Contest" },
  hackathon: { icon: Rocket, color: "#10b981", label: "Hackathon" },
  competition: { icon: Trophy, color: "#f59e0b", label: "Competition" },
  workshop: { icon: Lightbulb, color: "#a855f7", label: "Workshop" },
};

const EVENT_STATUS_CONFIG = {
  registration_open: { label: "Registration Open", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  upcoming: { label: "Upcoming", className: "bg-blue-50 text-blue-600 border-blue-200" },
  live: { label: "LIVE", className: "bg-red-50 text-red-600 border-red-200 animate-pulse" },
};

const EVENT_FILTERS = [
  { key: "all", label: "All" },
  { key: "contest", label: "Contests" },
  { key: "hackathon", label: "Hackathons" },
  { key: "competition", label: "Competitions" },
  { key: "workshop", label: "Workshops" },
];

const SIDEBAR_NAV = [
  { key: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
  { key: "profile", Icon: User, label: "Profile" },
  { key: "roadmaps", Icon: Map, label: "Roadmaps" },
  { key: "mentors", Icon: GraduationCap, label: "Mentors" },
  { key: "projects", Icon: FolderGit2, label: "Projects" },
  { key: "qa", Icon: MessageSquare, label: "Q&A Board" },
  { key: "jobs", Icon: Briefcase, label: "Jobs" },
  { key: "events", Icon: Calendar, label: "Events" },
  { key: "events2", Icon: Calendar, label: "Events 2" },
  { key: "certificates", Icon: Award, label: "Certificates" },
  { key: "messages", Icon: Mail, label: "Messages" },
  { key: "settings", Icon: Settings, label: "Settings" },
];

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
  showDot?: boolean;
}

const SidebarButton = ({ icon: Icon, label, active, expanded, onClick, isLogout, accent = "default", showDot }: SidebarButtonProps) => {
  const baseClass = `flex items-center gap-3 rounded-2xl transition-all duration-200 flex-shrink-0 ${expanded ? "w-full px-3 py-2.5" : "w-10 h-10 justify-center mx-auto"}`;

  const style = isLogout
    ? { color: accent === "danger" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.45)" }
    : {
        background: active ? "rgba(255,255,255,0.18)" : "transparent",
        color: active ? "#ffffff" : "rgba(255,255,255,0.35)",
      };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isLogout) {
      (e.target as HTMLElement).style.color = accent === "danger" ? "#fca5a5" : "#bfdbfe";
      (e.target as HTMLElement).style.background = accent === "danger" ? "rgba(239,68,68,0.12)" : "rgba(96,165,250,0.12)";
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
      <div className="relative flex-shrink-0">
        <Icon className="w-[17px] h-[17px]" />
        {showDot && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0f0f1e] animate-pulse" style={{ background: "#a855f7" }} />
        )}
      </div>
      {expanded && (
        <span className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </span>
      )}
    </button>
  );
};

const StudentDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [greeting, setGreeting] = useState("Good morning");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hasNewJob, setHasNewJob] = useState(() => {
    return localStorage.getItem("hasNewJobNotification") === "true";
  });
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const checkSize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
      if (w < 768) {
        setSidebarExpanded(false);
        setRightPanelOpen(false);
      } else if (w < 1024) {
        setRightPanelOpen(false);
      } else {
        setRightPanelOpen(true);
      }
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
    const secondLast = segments[segments.length - 2];
    if (last === "dashboard" || secondLast === "dashboard") return "dashboard";
    return last;
  }, [location.pathname]);

  const isDashboard = activeKey === "dashboard";

  const handleNavClick = useCallback((key: string) => {
    if (key === "dashboard") {
      navigate("/login/student/dashboard");
    } else {
      navigate(`/login/student/dashboard/${key}`);
    }
    if (isMobile) setMobileMenuOpen(false);
  }, [navigate, isMobile]);

  const userName = user?.name?.split(" ")[0] || "Student";
  const userInitials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "ST";

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
              showDot={key === "jobs" && hasNewJob}
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
        <div className="flex flex-1 min-w-0 overflow-hidden">
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
                    {greeting}, {userName}
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5">You have 3 upcoming events today</p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-2.5 flex-shrink-0">
                <div className="relative hidden sm:block">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-2xl text-sm placeholder-gray-300 text-gray-700 outline-none w-40 md:w-64 border border-white/70 focus:border-indigo-200 transition-colors"
                  />
                </div>

                {isMobile && (
                  <button className="w-10 h-10 rounded-2xl bg-white/70 border border-white/70 flex items-center justify-center text-gray-400 hover:bg-white/90 transition-colors flex-shrink-0">
                    <Search className="w-4 h-4" />
                  </button>
                )}

                {!isMobile && (
                  <button className="w-10 h-10 rounded-2xl bg-white/70 border border-white/70 flex items-center justify-center text-gray-400 hover:bg-white/90 transition-colors flex-shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                )}

                <div className="relative flex-shrink-0">
                  <button className="w-10 h-10 rounded-2xl bg-white/70 border border-white/70 flex items-center justify-center text-gray-400 hover:bg-white/90 transition-colors">
                    <Bell className="w-4 h-4" />
                  </button>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">
                    3
                  </span>
                </div>

                {!isMobile && (
                  <button
                    onClick={() => setRightPanelOpen(!rightPanelOpen)}
                    className="w-10 h-10 rounded-2xl bg-white/70 border border-white/70 flex items-center justify-center text-gray-400 hover:bg-white/90 transition-colors flex-shrink-0"
                    title={rightPanelOpen ? "Hide panel" : "Show panel"}
                  >
                    {rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                  </button>
                )}

                <div className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 bg-white/70 border border-white/70 rounded-2xl cursor-pointer hover:bg-white/90 transition-colors flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 flex-shrink-0">
                    {userInitials}
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-7 pt-5 flex-shrink-0">
              <StatCard
                id="mentors"
                label="Active Mentors"
                Icon={Users}
                value="+14"
                trendUp={true}
                trendLabel="18%"
                data={MENTOR_DATA}
                barHex="#5b6ef5"
                bgFrom="#dde0f8"
                bgTo="#c9cef4"
                textColor="text-indigo-900"
              />
              <StatCard
                id="hackathons"
                label="Open Hackathons"
                Icon={Trophy}
                value="+5"
                trendUp={false}
                trendLabel="2 ended"
                data={HACKATHON_DATA}
                barHex="#3b82f6"
                bgFrom="#d6edf9"
                bgTo="#bdddf5"
                textColor="text-blue-900"
              />
              <StatCard
                id="articles"
                label="Alumni Articles"
                Icon={BookOpen}
                value="+6"
                trendUp={true}
                trendLabel="30%"
                data={ARTICLE_DATA}
                barHex="#a855f7"
                bgFrom="#ead6f7"
                bgTo="#d9bdf2"
                textColor="text-purple-900"
              />
            </div>

            <div
              className="mx-4 md:mx-7 mt-5 mb-6 rounded-3xl overflow-hidden flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}
            >
              <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm md:text-base font-bold text-gray-900">Upcoming Events</h3>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {EVENT_FILTERS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setEventFilter(key)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
                        eventFilter === key
                          ? "bg-indigo-500 text-white shadow-sm"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 md:px-6 py-4 text-center text-gray-400 text-sm">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Events will appear here</p>
              </div>

              <div className="px-4 md:px-6 py-3 border-t border-gray-100/60 text-center">
                <button onClick={() => handleNavClick("events")} className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
                  View All Events →
                </button>
              </div>
            </div>
          </div>

          {rightPanelOpen && !isMobile && (
            <div
              className="w-[255px] flex-shrink-0 overflow-y-auto py-6 px-5 flex flex-col gap-5 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(12px)",
                borderLeft: "1px solid rgba(255,255,255,0.9)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Network Insight</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {NETWORK_SOURCES.map((src) => (
                    <div key={src.name}>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: src.hex }}
                        >
                          {src.name[0]}
                        </div>
                        <span className="text-xs font-medium text-gray-700 flex-1 min-w-0 truncate">
                          {src.name}
                        </span>
                        <span className="text-xs font-bold text-gray-500 flex-shrink-0">
                          {src.pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-9">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${src.pct}%`, background: src.hex }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Alumni</h3>
                <div className="flex flex-col gap-4">
                  {RECENT_ALUMNI.map((a) => (
                    <div key={a.name}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                          style={{ background: a.hex }}
                        >
                          {a.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate leading-tight">
                            {a.name}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">{a.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pl-11">
                        <span
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: a.hex + "18", color: a.hex }}
                        >
                          {a.company}
                        </span>
                        <div className="flex gap-1.5">
                          <button className="w-7 h-7 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                            <Phone className="w-3 h-3" />
                          </button>
                          <button className="w-7 h-7 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                            <MessageCircle className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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

export default StudentDashboardLayout;
