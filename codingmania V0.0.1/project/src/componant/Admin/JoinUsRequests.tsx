import { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JoinRequest {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  college_name: string;
  course_stream: string;
  year_of_study: string;
  skills: string[];
  interests: string[];
  motivation: string;
  github_url: string;
  linkedin_url: string;
  website_url: string;
  team_preferences: string[];
  created_at: string;
  read?: boolean;
}

export default function JoinUsRequests() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [selected, setSelected] = useState<JoinRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join-us/data`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      setRequests(
        data.map((req: any) => {
          let skills = [], interests = [], team_preferences = [];
          try { skills = JSON.parse(req.skills || '[]'); } catch {}
          try { interests = JSON.parse(req.interests || '[]'); } catch {}
          try { team_preferences = JSON.parse(req.team_preferences || '[]'); } catch {}
          return {
            ...req,
            skills: Array.isArray(skills) ? skills : [],
            interests: Array.isArray(interests) ? interests : [],
            team_preferences: Array.isArray(team_preferences) ? team_preferences : [],
            read: false,
          };
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, read: true } : r));
  };

  if (loading) return <div className="text-center py-12">Loading join requests...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Join Us Requests</h1>

      {requests.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
          No join requests found yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <div
              key={req.id}
              onClick={() => {
                setSelected(req);
                markAsRead(req.id);
              }}
              className={`p-6 bg-white rounded-xl shadow cursor-pointer hover:shadow-2xl transition-all border-l-4 ${
                req.read ? 'border-gray-300' : 'border-blue-500 bg-blue-50/40'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{req.full_name}</h3>
                {!req.read && <span className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></span>}
              </div>
              <p className="text-gray-600 mb-1">{req.email}</p>
              <p className="text-gray-500 text-sm">{req.college_name}</p>
              <p className="text-gray-500 text-xs mt-3">
                {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
                <h2 className="text-3xl font-bold">{selected.full_name}</h2>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-8 h-8 text-gray-600" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Contact & Education */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-xl mb-4 text-gray-800">Contact Information</h3>
                    <p><strong>Email:</strong> {selected.email}</p>
                    <p><strong>Phone:</strong> {selected.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-4 text-gray-800">Education</h3>
                    <p><strong>College:</strong> {selected.college_name}</p>
                    <p><strong>Course:</strong> {selected.course_stream}</p>
                    <p><strong>Year:</strong> {selected.year_of_study}</p>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map((s, i) => (
                      <span key={i} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.interests.map((int, i) => (
                      <span key={i} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
                        {int}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">Motivation</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selected.motivation}</p>
                </div>

                {/* Links */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">Portfolio / Links</h3>
                  <div className="space-y-3">
                    {selected.github_url && (
                      <a href={selected.github_url} target="_blank" className="flex items-center text-blue-600 hover:underline">
                        GitHub <ExternalLink className="ml-2" size={18} />
                      </a>
                    )}
                    {selected.linkedin_url && (
                      <a href={selected.linkedin_url} target="_blank" className="flex items-center text-blue-600 hover:underline">
                        LinkedIn <ExternalLink className="ml-2" size={18} />
                      </a>
                    )}
                    {selected.website_url && (
                      <a href={selected.website_url} target="_blank" className="flex items-center text-blue-600 hover:underline">
                        Website / Portfolio <ExternalLink className="ml-2" size={18} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Team Preferences */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">Team Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.team_preferences.map((pref, i) => (
                      <span key={i} className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}