import { useState, useEffect, useMemo } from "react";
import { getEvents } from "../../../api/eventsApi";
import {
  Calendar,
  Code2,
  Rocket,
  Trophy,
  Lightbulb,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const EVENT_TYPE_CONFIG: Record<string, { icon: typeof Code2; color: string; label: string }> = {
  contest: { icon: Code2, color: "#5b6ef5", label: "Contest" },
  hackathon: { icon: Rocket, color: "#10b981", label: "Hackathon" },
  competition: { icon: Trophy, color: "#f59e0b", label: "Competition" },
  workshop: { icon: Lightbulb, color: "#a855f7", label: "Workshop" },
};

const EVENT_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  registration_open: { label: "Registration Open", className: "bg-green-500/15 text-green-400 border-white/10" },
  upcoming: { label: "Upcoming", className: "bg-red-500/10 text-red-400 border-red-500/30" },
  live: { label: "LIVE", className: "bg-red-500/15 text-red-300 border-red-500/30 animate-pulse" },
};

const EVENT_FILTERS = [
  { key: "all", label: "All" },
  { key: "contest", label: "Contests" },
  { key: "hackathon", label: "Hackathons" },
  { key: "competition", label: "Competitions" },
  { key: "workshop", label: "Workshops" },
];

function getCountdown(dateStr: string) {
  const now = new Date();
  const eventDate = new Date(dateStr);
  const diffMs = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Ended";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
}

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  endDate: string;
  organizer: string;
  tags: string[];
  status: string;
  description?: string;
  link?: string;
}

const EventCard = ({ event }: { event: Event }) => {
  const typeConfig = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.contest;
  const statusConfig = EVENT_STATUS_CONFIG[event.status] || EVENT_STATUS_CONFIG.upcoming;
  const EventIcon = typeConfig.icon;
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formattedTime = eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const countdown = getCountdown(event.date);
  const diffDays = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 hover:border-red-500/30 hover:bg-white/10 transition-all duration-200 group"
      style={{ background: "rgba(255,255,255,0.05)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{ background: `${typeConfig.color}15` }}>
        <EventIcon className="w-5 h-5" style={{ color: typeConfig.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
            {event.title}
          </h4>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusConfig.className}`}>
              {statusConfig.label}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold"
              style={{ background: `${typeConfig.color}15`, color: typeConfig.color }}>
              {typeConfig.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-[11px] text-gray-300 font-medium">
            {formattedDate} · {formattedTime}
          </span>
          <span className={`text-[11px] font-semibold ${
            diffDays <= 2 ? "text-red-500" : diffDays <= 7 ? "text-amber-400" : "text-gray-400"
          }`}>
            {countdown}
          </span>
        </div>

        <p className="text-xs text-gray-300 mb-2 leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/5 text-gray-300 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
          <a href={event.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-md hover:brightness-110 flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${typeConfig.color}, ${typeConfig.color}cc)` }}>
            Register
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

const CompletedEventCard = ({ event }: { event: Event }) => {
  const typeConfig = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.contest;
  const EventIcon = typeConfig.icon;
  const startDate = new Date(event.date);
  const endDate = new Date(event.endDate);
  const dateRange = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10"
      style={{ background: "rgba(255,255,255,0.05)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 opacity-60"
        style={{ background: `${typeConfig.color}10` }}>
        <EventIcon className="w-5 h-5" style={{ color: typeConfig.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold text-gray-300 leading-snug line-through decoration-gray-500">
            {event.title}
          </h4>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border bg-white/5 text-gray-400 border-white/10 flex-shrink-0">
            Completed
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] text-gray-400 font-medium">{dateRange}</span>
          <span className="text-[10px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">{event.organizer}</span>
        </div>

        <p className="text-xs text-gray-400 mb-2 leading-relaxed">{event.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/5 text-gray-400 border border-white/10">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const StudentEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getEvents();
        setEvents(res.data);
      } catch {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const now = new Date();

  const upcomingEvents = useMemo(() => {
    return events.filter((e) => {
      const end = new Date(e.endDate);
      return end >= now && (eventFilter === "all" || e.type === eventFilter);
    });
  }, [events, eventFilter, now]);

  const completedEvents = useMemo(() => {
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return events.filter((e) => {
      const end = new Date(e.endDate);
      return end < now && end >= oneMonthAgo;
    }).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
  }, [events, now]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
        <p className="text-sm text-gray-400 font-medium mt-3">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white">Events & Competitions</h1>
        <p className="text-sm text-gray-400 mt-0.5">Discover hackathons, contests, workshops, and more</p>
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>

        <div className="px-6 py-3 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
          <Calendar className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-300 mr-1 flex-shrink-0">Filter:</span>
          {EVENT_FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => setEventFilter(key)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
                eventFilter === key ? "bg-red-600 text-white shadow-sm" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="px-6 py-2.5 border-b border-white/10">
          <span className="text-[11px] text-gray-400">
            {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="p-4 space-y-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {upcomingEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-400 font-medium">No upcoming events in this category</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>

        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-300">Completed (Last 30 Days)</h3>
          </div>
          <span className="text-[11px] font-semibold text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
            {completedEvents.length} event{completedEvents.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="p-4 space-y-3">
          {completedEvents.map((event) => (
            <CompletedEventCard key={event.id} event={event} />
          ))}
          {completedEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">No completed events in the last 30 days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEvents;