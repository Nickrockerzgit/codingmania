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

const StudentEvents2: React.FC = () => {
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/get-events`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      
      const mappedEvents = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        description: e.about || "No description provided.",
        date: e.date ? new Date(e.date).toISOString().split('T')[0] : "TBD",
        time: e.event_start ? new Date(e.event_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "TBD",
        location: e.location || "TBD",
        type: e.location?.toLowerCase().includes("online") ? "online" : "offline",
        status: e.registration_open ? "upcoming" : "closed",
        organizer: "Admin",
        capacity: parseInt(e.participants) || 100,
        registered: 0,
        category: e.categories || "General",
        registrationDate: e.registration_start ? new Date(e.registration_start).toLocaleDateString() : null
      }));
      
      setEvents(mappedEvents);
    } catch (err) {
      console.error(err);
      // Remove fallback dummy data to make the section dynamic
      setEvents([]);
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
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "registered": return "bg-green-100 text-green-800";
      case "attended": return "bg-purple-100 text-purple-800";
      case "missed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "online": return "bg-cyan-100 text-cyan-800";
      case "offline": return "bg-orange-100 text-orange-800";
      case "hybrid": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
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

  if (loading) return <div className="p-8">Loading events...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">My Events 2</h1>
        <p className="text-sm text-gray-400 mt-0.5">Alternative events view from regular dashboard</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                            {getTypeIcon(event.type)} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            {event.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span>{time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span>{event.registered}/{event.capacity} slots filled</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-500">
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
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Join Event
                          </a>
                        )}
                        
                        {event.status === 'attended' && (
                          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-center">
                            ✓ Attended
                          </div>
                        )}
                        
                        {event.status === 'missed' && (
                          <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-center">
                            ✗ Missed
                          </div>
                        )}
                        
                        {(event.status === 'upcoming' || event.status === 'registered') && !isUpcoming && (
                          <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-center text-sm">
                            Event Ended
                          </div>
                        )}
                        
                        {event.status === 'upcoming' && isUpcoming && (
                          <button
                            onClick={() => handleRegister(event.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar for capacity */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Registration Progress</span>
                        <span>{Math.round((event.registered / event.capacity) * 100)}% full</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
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
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No events found.</p>
              <p className="text-gray-400 text-sm">Register for events to see them here!</p>
            </div>
          )}
          
          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {events.filter(e => e.status === 'upcoming' || e.status === 'registered').length}
              </div>
              <div className="text-sm text-blue-700">Upcoming</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {events.filter(e => e.status === 'attended').length}
              </div>
              <div className="text-sm text-purple-700">Attended</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {events.filter(e => e.status === 'missed').length}
              </div>
              <div className="text-sm text-red-700">Missed</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {events.length}
              </div>
              <div className="text-sm text-gray-700">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEvents2;
