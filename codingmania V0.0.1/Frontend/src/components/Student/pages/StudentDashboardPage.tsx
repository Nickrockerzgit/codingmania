import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { menuItems } from "../types";

const studentStats = [
  { label: "Roadmaps in progress", value: "03", detail: "Frontend, DSA, placement prep" },
  { label: "Tasks due this week", value: "07", detail: "Stay ahead with your practice goals" },
  { label: "Mentor replies", value: "12", detail: "Fresh guidance waiting in messages" },
];

const suggestedFocus = [
  {
    title: "Finish your roadmap streak",
    description: "Complete your next roadmap checkpoint to keep your learning momentum strong.",
    icon: Target,
    tab: "roadmaps",
  },
  {
    title: "Review this week's tasks",
    description: "Prioritize submissions and stay on track with coursework and practice.",
    icon: CheckCircle2,
    tab: "tasks",
  },
  {
    title: "Join a live event",
    description: "Discover hackathons, workshops, and contests that build your profile.",
    icon: CalendarDays,
    tab: "events",
  },
];

const upcomingMoments = [
  { title: "UI/UX portfolio workshop", meta: "Today, 6:00 PM", tone: "bg-red-500/10 text-red-400" },
  { title: "Mock interview with alumni mentor", meta: "Tomorrow, 11:00 AM", tone: "bg-red-500/10 text-red-400" },
  { title: "DSA sprint checkpoint", meta: "Friday, 8:30 PM", tone: "bg-red-500/10 text-red-400" },
];

const StudentDashboardPage = () => {
  const navigate = useNavigate();

  const goToTab = (tab?: string) => {
    if (!tab) {
      return;
    }
    navigate(`/login/student/dashboard?tab=${tab}`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-red-600 to-orange-600 p-6 md:p-8 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.85)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.22),transparent_28%)]" />
        <div className="absolute -right-10 top-10 h-40 w-40 rounded-full border border-white/10 bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Student command center
            </div>

            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-black leading-tight md:text-4xl">
                Build momentum every week with a dashboard that keeps learning in motion.
              </h2>
              <p className="max-w-xl text-sm leading-6 text-slate-200 md:text-base">
                Track tasks, follow roadmaps, connect with mentors, and jump into events without
                digging through tabs.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => goToTab("roadmaps")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Continue roadmap
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => goToTab("mentors")}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Connect with mentors
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {studentStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">{stat.label}</p>
                <p className="mt-3 text-3xl font-black">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-200">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.75)] backdrop-blur-sm md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
                Quick access
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">Explore your student tools</h3>
            </div>
            <div className="hidden rounded-2xl bg-white/5 p-3 text-gray-400 md:block">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => goToTab(item.path)}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_20px_50px_-35px_rgba(59,130,246,0.65)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 to-orange-600 opacity-70" />
                {item.comingSoon && (
                  <span className="absolute right-4 top-4 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                    Coming soon
                  </span>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="mt-5 text-lg font-bold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-gray-300">{item.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-400">
                  Open section
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-red-500/30 bg-white/5 backdrop-blur-sm p-5 shadow-[0_20px_60px_-45px_rgba(14,116,144,0.55)] md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
            Suggested focus
          </p>
          <h3 className="mt-2 text-xl font-bold text-white">What to do next</h3>

          <div className="mt-5 space-y-3">
            {suggestedFocus.map((item) => (
              <button
                key={item.title}
                onClick={() => goToTab(item.tab)}
                className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-red-500/30 hover:bg-white/10"
              >
                <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="mt-1 text-sm leading-6 text-gray-300">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.75)] md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
                Upcoming
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">Your week at a glance</h3>
            </div>
            <button
              onClick={() => goToTab("events")}
              className="text-sm font-semibold text-red-400 transition-colors hover:text-red-300"
            >
              View all
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {upcomingMoments.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
              >
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="mt-1 text-sm text-gray-400">{item.meta}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#0a0a0a] p-5 text-white shadow-[0_20px_70px_-45px_rgba(2,6,23,0.9)] md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
            Motivation
          </p>
          <h3 className="mt-2 text-xl font-bold">Keep your profile moving forward</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            A strong weekly rhythm across roadmaps, tasks, and mentoring makes your dashboard more
            useful and your growth more visible.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Learning consistency</span>
                <span className="font-semibold text-white">82%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[82%] rounded-full bg-gradient-to-r from-red-600 to-orange-600" />
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <Clock3 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
              <p className="text-sm leading-6 text-slate-200">
                Set aside 30 minutes today for either task review or roadmap progress to keep your
                streak alive.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboardPage;
