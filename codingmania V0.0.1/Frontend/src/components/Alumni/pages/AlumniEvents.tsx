import { useState, useEffect, useMemo } from "react";
import { createEvent, getMyEvents, deleteEvent } from "../../../api/eventsApi";
import {
  Calendar,
  PlusCircle,
  Code2,
  Rocket,
  Trophy,
  Lightbulb,
  ExternalLink,
  Loader2,
  Send,
  CheckCircle2,
  Trash2,
} from "lucide-react";

const EVENT_TYPE_CONFIG: Record<string, { icon: typeof Code2; color: string; label: string }> = {
  contest: { icon: Code2, color: "#dc2626", label: "Contest" },
  hackathon: { icon: Rocket, color: "#10b981", label: "Hackathon" },
  competition: { icon: Trophy, color: "#f59e0b", label: "Competition" },
  workshop: { icon: Lightbulb, color: "#a855f7", label: "Workshop" },
};

const EVENT_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  registration_open: { label: "Registration Open", className: "bg-green-500/15 text-green-400 border-green-500/30" },
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

const TYPE_OPTIONS = [
  { value: "contest", label: "Contest" },
  { value: "hackathon", label: "Hackathon" },
  { value: "competition", label: "Competition" },
  { value: "workshop", label: "Workshop" },
];

const STATUS_OPTIONS = [
  { value: "registration_open", label: "Registration Open" },
  { value: "upcoming", label: "Upcoming" },
  { value: "live", label: "LIVE" },
];

const TAG_OPTIONS = [
  "DSA", "Algorithm", "Full Stack", "Cloud", "AI", "Innovation",
  "Open Source", "Mentorship", "System Design", "Architecture",
  "Problem Solving", "Math", "Web", "Mobile", "DevOps", "Security",
];

const TABS = [
  { key: "list", label: "Events List", Icon: Calendar },
  { key: "create", label: "Create Event", Icon: PlusCircle },
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

interface EventForm {
  title: string;
  type: string;
  date: string;
  time: string;
  endDate: string;
  endTime: string;
  organizer: string;
  description: string;
  link: string;
  tags: string[];
  status: string;
}

const emptyForm: EventForm = {
  title: "",
  type: "contest",
  date: "",
  time: "",
  endDate: "",
  endTime: "",
  organizer: "",
  description: "",
  link: "",
  tags: [],
  status: "registration_open",
};

const EventCard = ({ event, onDelete, deletingId }: { event: Event; onDelete?: (id: number) => void; deletingId?: number | null }) => {
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
          <span className="text-[11px] text-gray-400 font-medium">
            {formattedDate} · {formattedTime}
          </span>
          <span className={`text-[11px] font-semibold ${
            diffDays <= 2 ? "text-red-500" : diffDays <= 7 ? "text-amber-400" : "text-gray-400"
          }`}>
            {countdown}
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-2 leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/5 text-gray-300 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href={event.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-md hover:brightness-110 flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${typeConfig.color}, ${typeConfig.color}cc)` }}>
              Register
              <ExternalLink className="w-3 h-3" />
            </a>
            {onDelete && (
              <button onClick={() => onDelete(event.id)} disabled={deletingId === event.id}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/15 transition-all duration-200 disabled:opacity-50"
                title="Delete event">
                {deletingId === event.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
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
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 group"
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
          <span className="text-[11px] text-gray-400 font-medium">
            {dateRange}
          </span>
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

const CreateEventForm = ({ onSubmit, submitting }: { onSubmit: (event: Partial<Event>) => void; submitting: boolean }) => {
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof EventForm, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.organizer.trim()) errs.organizer = "Organizer is required";
    if (!form.date) errs.date = "Start date is required";
    if (!form.time) errs.time = "Start time is required";
    if (!form.endDate) errs.endDate = "End date is required";
    if (!form.endTime) errs.endTime = "End time is required";
    if (form.date && form.endDate) {
      const start = new Date(`${form.date}T${form.time || "00:00"}`);
      const end = new Date(`${form.endDate}T${form.endTime || "23:59"}`);
      if (end < start) errs.endDate = "End must be after start";
    }
    if (form.link) {
      try { new URL(form.link); } catch { errs.link = "Enter a valid URL"; }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dateTime = `${form.date}T${form.time}:00`;
    const endDateTime = `${form.endDate}T${form.endTime}:00`;
    const newEvent = {
      title: form.title.trim(),
      type: form.type,
      date: dateTime,
      endDate: endDateTime,
      organizer: form.organizer.trim(),
      tags: form.tags,
      status: form.status,
      description: form.description.trim(),
      link: form.link || "#",
    };
    onSubmit(newEvent);
    setForm(emptyForm);
  };

  const inputBase = "w-full px-4 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-500";
  const labelBase = "text-xs font-semibold text-gray-300 mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl p-6 space-y-5 bg-white/5 backdrop-blur-sm border border-white/10">

        <div>
          <label className={labelBase}>Event Title</label>
          <input value={form.title} onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g., LeetCode Weekly Contest 446" className={inputBase} />
          {errors.title && <p className="text-xs text-red-300 mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelBase}>Event Type</label>
            <select value={form.type} onChange={(e) => updateField("type", e.target.value)} className={inputBase + " cursor-pointer"}>
              {TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelBase}>Status</label>
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className={inputBase + " cursor-pointer"}>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelBase}>Start Date & Time</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)}
                className={inputBase + " cursor-pointer"} />
              {errors.date && <p className="text-xs text-red-300 mt-1">{errors.date}</p>}
            </div>
            <div>
              <input type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)}
                className={inputBase + " cursor-pointer"} />
              {errors.time && <p className="text-xs text-red-300 mt-1">{errors.time}</p>}
            </div>
          </div>
        </div>

        <div>
          <label className={labelBase}>End Date & Time</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input type="date" value={form.endDate} onChange={(e) => updateField("endDate", e.target.value)}
                className={inputBase + " cursor-pointer"} />
              {errors.endDate && <p className="text-xs text-red-300 mt-1">{errors.endDate}</p>}
            </div>
            <div>
              <input type="time" value={form.endTime} onChange={(e) => updateField("endTime", e.target.value)}
                className={inputBase + " cursor-pointer"} />
              {errors.endTime && <p className="text-xs text-red-300 mt-1">{errors.endTime}</p>}
            </div>
          </div>
        </div>

        <div>
          <label className={labelBase}>Organizer</label>
          <input value={form.organizer} onChange={(e) => updateField("organizer", e.target.value)}
            placeholder="e.g., Google, Codeforces, UIT Alumni Hub" className={inputBase} />
          {errors.organizer && <p className="text-xs text-red-300 mt-1">{errors.organizer}</p>}
        </div>

        <div>
          <label className={labelBase}>Description</label>
          <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)}
            placeholder="Brief description of the event..." rows={3} className={inputBase + " resize-none"} />
        </div>

        <div>
          <label className={labelBase}>Registration Link</label>
          <input type="url" value={form.link} onChange={(e) => updateField("link", e.target.value)}
            placeholder="https://example.com/register" className={inputBase} />
          {errors.link && <p className="text-xs text-red-300 mt-1">{errors.link}</p>}
        </div>

        <div>
          <label className={labelBase}>Tags / Skills</label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  form.tags.includes(tag) ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                }`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
            style={{ background: "linear-gradient(135deg, #dc2626, #ea580c)" }}>
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Send className="w-4 h-4" /> Create Event</>}
          </button>
        </div>
      </div>
    </form>
  );
};

const AlumniEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [eventFilter, setEventFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getMyEvents();
      setEvents(res.data);
    } catch {
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateEvent = async (newEvent: Partial<Event>) => {
    setSubmitting(true);
    try {
      const res = await createEvent(newEvent);
      setEvents((prev) => [res.data, ...prev]);
      setActiveTab("list");
    } catch (err) {
      console.error("Failed to create event:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    setDeletingId(eventId);
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error("Failed to delete event:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white">Event Management</h1>
        <p className="text-sm text-gray-400 mt-0.5">Create and manage events for students to participate in</p>
      </div>

      <div className="flex gap-1 p-1 rounded-2xl overflow-x-auto bg-white/5 backdrop-blur-sm border border-white/10">
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeTab === key ? "bg-red-600 text-white shadow-sm" : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {activeTab === "list" && loading && (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
          <p className="text-sm text-gray-400 font-medium mt-3">Loading events...</p>
        </div>
      )}

      {activeTab === "list" && error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <p className="text-sm text-red-500 font-medium">{error}</p>
        </div>
      )}

      {activeTab === "list" && !loading && !error && (
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">

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

            <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={handleDeleteEvent} deletingId={deletingId} />
              ))}
              {upcomingEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Calendar className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400 font-medium">No upcoming events in this category</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">

            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-300">Completed (Last 30 Days)</h3>
              </div>
              <span className="text-[11px] font-semibold text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
                {completedEvents.length} event{completedEvents.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto">
              {completedEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={handleDeleteEvent} deletingId={deletingId} />
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
      )}

      {activeTab === "create" && (
        <CreateEventForm onSubmit={handleCreateEvent} submitting={submitting} />
      )}
    </div>
  );
};

export default AlumniEvents;