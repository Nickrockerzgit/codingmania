import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Search, Filter, ExternalLink } from 'lucide-react';
import { useAuth } from '../../AuthContext';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'online' | 'offline' | 'hybrid';
  status: 'registered' | 'attended' | 'missed' | 'upcoming';
  organizer: string;
  capacity: number;
  registered: number;
  category: string;
  meetingLink?: string;
  registrationDate: string;
}

const AlumniEvents2: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webinars/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      // fallback dummy data just to show the UI
      setEvents([
        {
          id: 1,
          title: "React Advanced Patterns Workshop",
          description: "Deep dive into advanced React patterns including compound components, render props, and custom hooks.",
          date: "2026-05-25",
          time: "14:00",
          location: "TechHub Conference Center",
          type: "offline",
          status: "upcoming",
          organizer: "React Experts Guild",
          capacity: 50,
          registered: 35,
          category: "Workshop",
          registrationDate: "2026-04-10"
        },
        {
          id: 2,
          title: "Full Stack Developer Meetup",
          description: "Monthly meetup for full stack developers to share experiences, network, and learn about new technologies.",
          date: "2026-05-20",
          time: "18:30",
          location: "Virtual Event",
          type: "online",
          status: "registered",
          organizer: "Full Stack Community",
          capacity: 100,
          registered: 78,
          category: "Meetup",
          meetingLink: "https://meet.example.com/fullstack-meetup",
          registrationDate: "2026-04-05"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webinars/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to register');
      fetchEvents(); // Refresh
    } catch (err) {
      console.error(err);
      alert('Failed to register. Slots may be full.');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "upcoming": return "bg-red-500/10 text-red-400";
      case "registered": return "bg-green-500/15 text-green-400";
      case "attended": return "bg-purple-500/15 text-purple-400";
      case "missed": return "bg-red-500/15 text-red-300";
      default: return "bg-white/5 text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "online": return "bg-cyan-500/15 text-cyan-400";
      case "offline": return "bg-orange-500/15 text-orange-400";
      case "hybrid": return "bg-red-500/10 text-red-400";
      default: return "bg-white/5 text-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "online": return "🌐";
      case "offline": return "🏢";
      case "hybrid": return "🔄";
      default: return "📍";
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return {
      date: eventDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: eventDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const isEventUpcoming = (date: string, time: string) => {
    const eventDateTime = new Date(`${date}T${time}`);
    return eventDateTime > new Date();
  };

  if (loading) return <div className="p-8 text-white">Loading events...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white">My Events 2</h1>
        <p className="text-sm text-gray-400 mt-0.5">Alternative events view from regular dashboard</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10 w-full overflow-hidden">
        <div className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-300" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="registered">Registered</option>
                  <option value="attended">Attended</option>
                  <option value="missed">Missed</option>
                </select>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Types</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          {sortedEvents.length > 0 ? (
            <div className="space-y-4">
              {sortedEvents.map(event => {
                const { date, time } = formatDateTime(event.date, event.time);
                const isUpcoming = isEventUpcoming(event.date, event.time);
                
                return (
                  <div key={event.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                            {getTypeIcon(event.type)} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                          <span className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-xs font-medium">
                            {event.category}
                          </span>
                        </div>

                        <p className="text-gray-300 mb-3">{event.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-red-400" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-400" />
                            <span>{time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span>{event.registered}/{event.capacity} slots filled</span>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-400">
                          <p>Organized by: {event.organizer}</p>
                          <p>Registered on: {event.registrationDate || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 lg:w-auto">
                        {event.meetingLink && (event.status === 'registered' || event.status === 'upcoming') && isUpcoming && (
                          <a
                            href={event.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Join Event
                          </a>
                        )}

                        {event.status === 'attended' && (
                          <div className="px-4 py-2 bg-green-500/15 text-green-400 rounded-lg text-center">
                            ✓ Attended
                          </div>
                        )}

                        {event.status === 'missed' && (
                          <div className="px-4 py-2 bg-red-500/15 text-red-300 rounded-lg text-center">
                            ✗ Missed
                          </div>
                        )}

                        {(event.status === 'upcoming' || event.status === 'registered') && !isUpcoming && (
                          <div className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg text-center text-sm">
                            Event Ended
                          </div>
                        )}

                        {event.status === 'upcoming' && isUpcoming && (
                          <button
                            onClick={() => handleRegister(event.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar for capacity */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Registration Progress</span>
                        <span>{Math.round((event.registered / event.capacity) * 100)}% full</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg">No events found.</p>
              <p className="text-gray-400 text-sm">Register for events to see them here!</p>
            </div>
          )}
          
          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {events.filter(e => e.status === 'upcoming' || e.status === 'registered').length}
              </div>
              <div className="text-sm text-red-400">Upcoming</div>
            </div>
            <div className="bg-purple-500/15 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {events.filter(e => e.status === 'attended').length}
              </div>
              <div className="text-sm text-purple-400">Attended</div>
            </div>
            <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-300 mb-1">
                {events.filter(e => e.status === 'missed').length}
              </div>
              <div className="text-sm text-red-300">Missed</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {events.length}
              </div>
              <div className="text-sm text-gray-300">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniEvents2;
