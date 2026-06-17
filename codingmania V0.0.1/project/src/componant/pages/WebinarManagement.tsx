import { useEffect, useState } from 'react';
import { Mic, Plus, Edit, Trash2, Users, X, Calendar, Clock, Globe, MapPin, Users as UsersIcon } from 'lucide-react';

interface Webinar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  mode: 'online' | 'offline';
  host: string;
  type: string;
  place?: string;
  link?: string;
  capacity?: number;
}

interface Attendance {
  id: number;
  user: { id: number; name: string; email: string };
  status: 'registered' | 'attended' | 'missed';
}

function WebinarManagement() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Webinar>>({});
  const [attendanceModal, setAttendanceModal] = useState<number | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webinars`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch webinars');
      const data = await response.json();
      setWebinars(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${import.meta.env.VITE_API_BASE_URL}/webinars/${isEditing}`
        : `${import.meta.env.VITE_API_BASE_URL}/webinars`;

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save webinar');
      }

      fetchWebinars();
      resetForm();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Something went wrong');
    }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setIsEditing(null);
    setFormData({});
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this webinar?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webinars/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete');
      fetchWebinars();
    } catch (err) {
      console.error(err);
      alert('Failed to delete webinar');
    }
  };

  const openAttendance = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webinars/${id}/attendances`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch attendances');
      const data = await response.json();
      setAttendances(data);
      setAttendanceModal(id);
    } catch (err) {
      console.error(err);
      alert('Failed to load attendances');
    }
  };

  const updateStatus = async (attendanceId: number, newStatus: 'attended' | 'missed') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webinars/attendance`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ attendanceId, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update');
      openAttendance(attendanceModal!); // refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to update attendance status');
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      webinar: 'bg-purple-600',
      meetup: 'bg-blue-600',
      workshop: 'bg-green-600',
      conference: 'bg-indigo-600',
      bootcamp: 'bg-orange-600',
    };
    return colors[type.toLowerCase()] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          Loading webinars...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Mic className="h-8 w-8 text-indigo-400" />
              Webinar Management
            </h1>
            <p className="text-gray-400 mt-1">Create, manage and track your webinars & sessions</p>
          </div>
          
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium transition shadow-lg shadow-indigo-900/30"
          >
            <Plus size={20} />
            Create New Webinar
          </button>
        </div>

        {/* Webinar List */}
        {webinars.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
            <Mic className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No webinars yet</h3>
            <p className="text-gray-500 mb-6">Create your first webinar to get started</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Add Webinar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {webinars.map((webinar) => (
              <div 
                key={webinar.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-indigo-600/50 transition-all duration-300 shadow-lg hover:shadow-indigo-900/20 group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {webinar.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadge(webinar.type)}`}>
                          {webinar.type.charAt(0).toUpperCase() + webinar.type.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          webinar.mode === 'online' ? 'bg-cyan-900/60 text-cyan-300' : 'bg-orange-900/60 text-orange-300'
                        }`}>
                          {webinar.mode === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormData(webinar);
                          setIsEditing(webinar.id);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(webinar.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {webinar.description || 'No description provided'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={16} className="text-indigo-400" />
                      <span>{new Date(webinar.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock size={16} className="text-indigo-400" />
                      <span>{webinar.time}</span>
                    </div>
                    {webinar.mode === 'online' ? (
                      <div className="flex items-center gap-2 text-gray-300 col-span-2">
                        <Globe size={16} className="text-cyan-400" />
                        <span className="truncate">{webinar.link || 'Link not set'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-300 col-span-2">
                        <MapPin size={16} className="text-orange-400" />
                        <span className="truncate">{webinar.place || 'Location not set'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-300">
                      <UsersIcon size={16} className="text-purple-400" />
                      <span>Capacity: {webinar.capacity || 'Unlimited'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mic size={16} className="text-indigo-400" />
                      <span>Host: {webinar.host}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-950/70 px-6 py-4 border-t border-gray-800 flex justify-between items-center">
                  <button
                    onClick={() => openAttendance(webinar.id)}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition"
                  >
                    <Users size={18} />
                    View Registrations
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Webinar' : 'Create New Webinar'}
                </h2>
                <button 
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Date *</label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Time *</label>
                    <input
                      type="time"
                      value={formData.time || ''}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Mode *</label>
                    <select
                      value={formData.mode || ''}
                      onChange={e => setFormData({...formData, mode: e.target.value as 'online' | 'offline'})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      required
                    >
                      <option value="">Select Mode</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Type *</label>
                    <select
                      value={formData.type || ''}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="webinar">Webinar</option>
                      <option value="meetup">Meetup</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="bootcamp">Bootcamp</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Host / Organization *</label>
                  <input
                    type="text"
                    value={formData.host || ''}
                    onChange={e => setFormData({...formData, host: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                {formData.mode === 'offline' && (
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Venue / Place</label>
                    <input
                      type="text"
                      value={formData.place || ''}
                      onChange={e => setFormData({...formData, place: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                )}

                {formData.mode === 'online' && (
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Meeting Link</label>
                    <input
                      type="url"
                      value={formData.link || ''}
                      onChange={e => setFormData({...formData, link: e.target.value})}
                      placeholder="https://meet.google.com/xxx-yyyy-zzz"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Max Capacity / Slots (optional)</label>
                  <input
                    type="number"
                    value={formData.capacity || ''}
                    onChange={e => setFormData({...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined})}
                    min="1"
                    placeholder="Leave blank for unlimited"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                  >
                    {isEditing ? 'Update Webinar' : 'Create Webinar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Attendance Modal */}
        {attendanceModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Users size={24} className="text-indigo-400" />
                  Registered Users
                </h2>
                <button 
                  onClick={() => setAttendanceModal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {attendances.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    No registrations yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attendances.map((att) => (
                      <div 
                        key={att.id}
                        className="bg-gray-800 rounded-lg p-4 flex justify-between items-center border border-gray-700 hover:border-indigo-600/50 transition"
                      >
                        <div>
                          <p className="font-medium text-white">{att.user.name}</p>
                          <p className="text-sm text-gray-400">{att.user.email}</p>
                        </div>
                        <select
                          value={att.status}
                          onChange={(e) => updateStatus(att.id, e.target.value as 'attended' | 'missed')}
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white focus:border-indigo-500"
                        >
                          <option value="registered">Registered</option>
                          <option value="attended">Attended</option>
                          <option value="missed">Missed</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebinarManagement;