// import { useEffect, useState } from 'react';
// import { X, ExternalLink, Check, X as XIcon } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';

// interface EventRegistration {
//   id: number;
//   team_name: string;
//   team_leader_name: string;
//   team_leader_email: string;
//   team_leader_phone: string;
//   members: string;
//   category: string;
//   project_name: string;
//   project_description: string;
//   github: string;
//   linkedin: string;
//   project_proposal: string | null;
//   status?: 'pending' | 'accepted' | 'rejected';
//   created_at: string;
//   read?: boolean;
// }

// export default function EventRegistrations() {
//   const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
//   const [selected, setSelected] = useState<EventRegistration | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchRegistrations();
//   }, []);

//   const fetchRegistrations = async () => {
//     try {
//       const res = await fetch('http://localhost:5001/api/events/registrations');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setRegistrations(
//         data.map((reg: EventRegistration) => ({
//           ...reg,
//           status: reg.status || 'pending',
//           read: false,
//         }))
//       );
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = (id: number) => {
//     setRegistrations(prev => prev.map(r => r.id === id ? { ...r, read: true } : r));
//   };

//   const handleAction = async (id: number, action: 'accept' | 'reject') => {
//     try {
//       // Uncomment when you have real API
//       // await fetch(`http://localhost:5001/api/events/registrations/${id}/${action}`, { method: 'POST' });

//       setRegistrations(prev =>
//         prev.map(reg =>
//           reg.id === id ? { ...reg, status: action === 'accept' ? 'accepted' : 'rejected' } : reg
//         )
//       );

//       if (selected?.id === id) {
//         setSelected(prev => prev ? { ...prev, status: action === 'accept' ? 'accepted' : 'rejected' } : null);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <div className="text-center py-12">Loading registrations...</div>;

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-8">Event Registrations</h1>

//       {registrations.length === 0 ? (
//         <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
//           No event registrations found.
//         </div>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {registrations.map((reg) => (
//             <div
//               key={reg.id}
//               onClick={() => {
//                 setSelected(reg);
//                 markAsRead(reg.id);
//               }}
//               className={`p-6 bg-white rounded-xl shadow cursor-pointer hover:shadow-2xl transition-all border-l-4 ${
//                 reg.status === 'accepted' ? 'border-green-500' :
//                 reg.status === 'rejected' ? 'border-red-500' :
//                 'border-yellow-500'
//               } ${!reg.read ? 'bg-blue-50/40' : ''}`}
//             >
//               <div className="flex justify-between items-start mb-3">
//                 <h3 className="font-bold text-lg">{reg.team_name}</h3>
//                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                   reg.status === 'accepted' ? 'bg-green-100 text-green-800' :
//                   reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                   'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {reg.status?.toUpperCase()}
//                 </span>
//               </div>
//               <p className="text-gray-600 mb-1">Leader: {reg.team_leader_name}</p>
//               <p className="text-gray-500 text-sm">{reg.project_name} • {reg.category}</p>
//               <p className="text-gray-500 text-xs mt-3">
//                 {formatDistanceToNow(new Date(reg.created_at), { addSuffix: true })}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Detail Modal */}
//       {selected && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-8">
//               <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
//                 <div>
//                   <h2 className="text-3xl font-bold">{selected.team_name}</h2>
//                   <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${
//                     selected.status === 'accepted' ? 'bg-green-100 text-green-800' :
//                     selected.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                     'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {selected.status?.toUpperCase()}
//                   </span>
//                 </div>
//                 <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-full">
//                   <X className="w-8 h-8 text-gray-600" />
//                 </button>
//               </div>

//               <div className="space-y-8">
//                 <div className="grid md:grid-cols-2 gap-8">
//                   <div>
//                     <h3 className="font-semibold text-xl mb-4">Team Leader</h3>
//                     <p><strong>Name:</strong> {selected.team_leader_name}</p>
//                     <p><strong>Email:</strong> {selected.team_leader_email}</p>
//                     <p><strong>Phone:</strong> {selected.team_leader_phone}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-xl mb-4">Project</h3>
//                     <p><strong>Name:</strong> {selected.project_name}</p>
//                     <p><strong>Category:</strong> {selected.category}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold text-xl mb-4">Description</h3>
//                   <p className="text-gray-700 whitespace-pre-wrap">{selected.project_description}</p>
//                 </div>

//                 <div>
//                   <h3 className="font-semibold text-xl mb-4">Links</h3>
//                   <div className="space-y-3">
//                     {selected.github && (
//                       <a href={selected.github} target="_blank" className="flex items-center text-blue-600 hover:underline">
//                         GitHub <ExternalLink className="ml-2" size={18} />
//                       </a>
//                     )}
//                     {selected.linkedin && (
//                       <a href={selected.linkedin} target="_blank" className="flex items-center text-blue-600 hover:underline">
//                         LinkedIn <ExternalLink className="ml-2" size={18} />
//                       </a>
//                     )}
//                     {selected.project_proposal && (
//                       <a href={selected.project_proposal} target="_blank" className="flex items-center text-blue-600 hover:underline">
//                         Project Proposal <ExternalLink className="ml-2" size={18} />
//                       </a>
//                     )}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-4 mt-10">
//                   {selected.status === 'pending' && (
//                     <>
//                       <button
//                         onClick={() => handleAction(selected.id, 'reject')}
//                         className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
//                       >
//                         <XIcon size={18} /> Reject
//                       </button>
//                       <button
//                         onClick={() => handleAction(selected.id, 'accept')}
//                         className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
//                       >
//                         <Check size={18} /> Accept
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






import { useEffect, useState } from 'react';
import { X, ExternalLink, Check, X as XIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TeamMember {
  name: string;
  role: string;
  email: string;
}

interface EventRegistration {
  id: number;
  team_name: string;
  team_leader_name: string;
  team_leader_email: string;
  team_leader_phone: string;
  members: any; // Changed to 'any' to handle both string and array safely
  category: string;
  project_name: string;
  project_description: string;
  github: string;
  linkedin: string;
  project_proposal: string | null;
  status?: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  read?: boolean;
}

export default function EventRegistrations() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [selected, setSelected] = useState<EventRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/registrations`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Make sure status is always set
      setRegistrations(
        data.map((reg: EventRegistration) => ({
          ...reg,
          status: reg.status || 'pending',
          read: false,
        }))
      );
    } catch (err: any) {
      console.error('Error fetching registrations:', err);
      setError('Failed to load event registrations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: number) => {
    setRegistrations(prev =>
      prev.map(r => r.id === id ? { ...r, read: true } : r)
    );
  };

  const handleAction = async (id: number, action: 'accept' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this registration?`)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/registrations/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update status');
      }

      const data = await response.json();
      console.log('Status updated:', data);

      // Refresh the list
      fetchRegistrations();

      // Update selected modal if open
      if (selected?.id === id) {
        setSelected(prev => prev ? { ...prev, status: action === 'accept' ? 'accepted' : 'rejected' } : null);
      }

      alert(`Registration ${action}ed successfully! Email sent to team leader.`);
    } catch (err: any) {
      console.error(`Error ${action}ing registration:`, err);
      alert(`Failed to ${action} registration: ${err.message || 'Unknown error'}`);
    }
  };

  // Safe parsing for members - handles string, array, or object
  const getTeamMembers = (membersData: any): TeamMember[] => {
    if (!membersData) return [];

    // Case 1: Already an array
    if (Array.isArray(membersData)) {
      return membersData.filter(m =>
        m && typeof m === 'object' && 'name' in m
      ) as TeamMember[];
    }

    // Case 2: String (JSON)
    if (typeof membersData === 'string') {
      try {
        const parsed = JSON.parse(membersData);
        if (Array.isArray(parsed)) {
          return parsed.filter(m =>
            m && typeof m === 'object' && 'name' in m
          ) as TeamMember[];
        }
        return [];
      } catch (e) {
        console.warn('Members JSON parse failed:', e);
        return [];
      }
    }

    // Case 3: Single object
    if (typeof membersData === 'object' && membersData !== null && 'name' in membersData) {
      return [membersData as TeamMember];
    }

    return [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 animate-pulse">Loading event registrations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl p-8">
        {error}
        <button
          onClick={fetchRegistrations}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
        <button
          onClick={fetchRegistrations}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500 border border-gray-200">
          No event registrations found yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              onClick={() => {
                setSelected(reg);
                markAsRead(reg.id);
              }}
              className={`p-6 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 ${
                reg.status === 'accepted' ? 'border-green-500 bg-green-50/30' :
                reg.status === 'rejected' ? 'border-red-500 bg-red-50/30' :
                'border-yellow-500 bg-yellow-50/30'
              } ${!reg.read ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{reg.team_name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  reg.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {reg.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>

              <p className="text-gray-700 mb-2 font-medium">
                Leader: {reg.team_leader_name}
              </p>
              <p className="text-gray-600 text-sm mb-1 line-clamp-1">{reg.project_name}</p>
              <p className="text-gray-500 text-sm">{reg.category}</p>

              <p className="text-gray-500 text-xs mt-4">
                {formatDistanceToNow(new Date(reg.created_at), { addSuffix: true })}
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
              {/* Header */}
              <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 pb-4 border-b">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selected.team_name}</h2>
                  <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold ${
                    selected.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    selected.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selected.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-8 h-8 text-gray-600" />
                </button>
              </div>

              <div className="space-y-10">
                {/* Leader & Project Info */}
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="font-semibold text-xl mb-4 text-gray-800">Team Leader</h3>
                    <p className="mb-2"><strong>Name:</strong> {selected.team_leader_name}</p>
                    <p className="mb-2"><strong>Email:</strong> {selected.team_leader_email}</p>
                    <p><strong>Phone:</strong> {selected.team_leader_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-4 text-gray-800">Project Info</h3>
                    <p className="mb-2"><strong>Name:</strong> {selected.project_name}</p>
                    <p><strong>Category:</strong> {selected.category}</p>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">Team Members</h3>
                  {(() => {
                    const members = getTeamMembers(selected.members);
                    if (members.length === 0) {
                      return <p className="text-gray-600 italic bg-gray-50 p-4 rounded-xl">No additional team members listed.</p>;
                    }
                    return (
                      <div className="grid gap-6 md:grid-cols-2">
                        {members.map((member, index) => (
                          <div
                            key={index}
                            className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            <div className="font-semibold text-lg mb-2 text-gray-900">
                              {member.name.trim()}
                            </div>
                            <div className="text-gray-700 mb-1">
                              Role: <span className="font-medium">{member.role.trim()}</span>
                            </div>
                            <div>
                              <a
                                href={`mailto:${member.email}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 text-sm"
                              >
                                {member.email}
                                <ExternalLink size={16} />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Project Description */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">Project Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-5 rounded-xl border border-gray-200">
                    {selected.project_description || 'No description provided.'}
                  </p>
                </div>

                {/* Links */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">Relevant Links</h3>
                  <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                    {selected.github && (
                      <a href={selected.github} target="_blank" className="flex items-center text-blue-600 hover:text-blue-800 hover:underline gap-2">
                        GitHub <ExternalLink size={18} />
                      </a>
                    )}
                    {selected.linkedin && (
                      <a href={selected.linkedin} target="_blank" className="flex items-center text-blue-600 hover:text-blue-800 hover:underline gap-2">
                        LinkedIn <ExternalLink size={18} />
                      </a>
                    )}
                    {selected.project_proposal && (
                      <a href={selected.project_proposal} target="_blank" className="flex items-center text-blue-600 hover:text-blue-800 hover:underline gap-2">
                        Project Proposal <ExternalLink size={18} />
                      </a>
                    )}
                    {!selected.github && !selected.linkedin && !selected.project_proposal && (
                      <p className="text-gray-600 italic">No links provided.</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-8 border-t">
                  {selected.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(selected.id, 'reject')}
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
                      >
                        <XIcon size={18} /> Reject
                      </button>
                      <button
                        onClick={() => handleAction(selected.id, 'accept')}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
                      >
                        <Check size={18} /> Accept
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}