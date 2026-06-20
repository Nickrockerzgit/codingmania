import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  Handshake,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { menuItems, MenuItem } from "../types";

const alumniStats = [
  { label: "Students supported", value: "24", detail: "Mentorship and Q&A interactions this month" },
  { label: "Active opportunities", value: "06", detail: "Open jobs and referrals shared with the community" },
  { label: "Community reach", value: "91%", detail: "Strong response rate across your network touchpoints" },
];

const impactItems = [
  {
    title: "Post an opportunity",
    description: "Share jobs and internships that can unlock student momentum.",
    icon: Briefcase,
    tab: "jobs",
  },
  {
    title: "Answer community questions",
    description: "Help students with honest, practical guidance from your journey.",
    icon: MessageSquareText,
    tab: "messages",
  },
  {
    title: "Host or join an event",
    description: "Create visibility through workshops, talks, and network sessions.",
    icon: CalendarClock,
    tab: "events",
  },
];

const recentHighlights = [
  { title: "New mentorship request from CSE batch 2027", meta: "Respond within 24 hours", tone: "bg-red-500/10 text-red-400" },
  { title: "Frontend internship post received 14 views", meta: "Performance updated today", tone: "bg-red-500/10 text-red-400" },
  { title: "Roadmap draft saved for interview prep", meta: "Ready to publish", tone: "bg-red-500/10 text-red-400" },
];

const AlumniDashboardPage = () => {
  const navigate = useNavigate();

  const goToTab = (tab?: string) => {
    if (!tab) {
      return;
    }
    navigate(`/login/alumni/dashboard?tab=${tab}`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-500/30 bg-gradient-to-br from-[#050505] via-red-950 to-orange-900 p-6 md:p-8 text-white shadow-[0_30px_80px_-40px_rgba(76,5,25,0.8)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.26),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.18),transparent_26%)]" />
        <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full border border-white/10 bg-white/5 blur-2xl" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.95fr)] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-red-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Alumni impact hub
            </div>

            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-black leading-tight md:text-4xl">
                Turn experience into impact with a sharper alumni community dashboard.
              </h2>
              <p className="max-w-xl text-sm leading-6 text-red-100/90 md:text-base">
                Stay visible, support students, share opportunities, and keep your network active
                through one focused dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => goToTab("jobs")}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                Post an opportunity
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => goToTab("roadmaps")}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Share a roadmap
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {alumniStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-red-100/70">{stat.label}</p>
                <p className="mt-3 text-3xl font-black">{stat.value}</p>
                <p className="mt-2 text-sm text-red-50/85">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_-45px_rgba(76,5,25,0.6)] backdrop-blur-sm md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
                Community tools
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">Lead through action</h3>
            </div>
            <div className="hidden rounded-2xl bg-red-500/10 p-3 text-red-400 md:block">
              <Handshake className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item: MenuItem) => (
              <button
                key={item.title}
                onClick={() => goToTab(item.path)}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_20px_50px_-35px_rgba(192,38,211,0.55)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 to-orange-600 opacity-80" />
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

        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-[0_20px_60px_-45px_rgba(192,38,211,0.45)] md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
            High-value actions
          </p>
          <h3 className="mt-2 text-xl font-bold text-white">Where you can help most</h3>

          <div className="mt-5 space-y-3">
            {impactItems.map((item) => (
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.75)] md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
                Recent highlights
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">What changed in your network</h3>
            </div>
            <button
              onClick={() => goToTab("messages")}
              className="text-sm font-semibold text-red-400 transition-colors hover:text-red-300"
            >
              Open inbox
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {recentHighlights.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
              >
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="mt-1 text-sm text-gray-300">{item.meta}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                  Update
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-white shadow-[0_20px_70px_-45px_rgba(2,6,23,0.92)] md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
            Contribution snapshot
          </p>
          <h3 className="mt-2 text-xl font-bold">Your presence is creating momentum</h3>
          <p className="mt-3 text-sm leading-6 text-gray-300">
            Alumni support compounds fast when jobs, events, guidance, and roadmaps stay active in
            one place.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Users2 className="h-5 w-5 text-red-400" />
              <p className="mt-4 text-3xl font-black">+18</p>
              <p className="mt-1 text-sm text-gray-300">New student connections this cycle</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <TrendingUp className="h-5 w-5 text-red-400" />
              <p className="mt-4 text-3xl font-black">87%</p>
              <p className="mt-1 text-sm text-gray-300">Engagement across your shared resources</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlumniDashboardPage;
