
// import { useEffect, useState } from 'react';
// import { Users, Bell, ExternalLink, X, FileText, Check, X as XIcon } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';
// import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';



// interface JoinRequest {
//   id: number;
//   full_name: string;
//   email: string;
//   phone: string;
//   college_name: string;
//   course_stream: string;
//   year_of_study: string;
//   skills: string[];
//   interests: string[];
//   motivation: string;
//   github_url: string;
//   linkedin_url: string;
//   website_url: string;
//   team_preferences: string[];
//   created_at: string;
//   read?: boolean;
// }

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

// function AdminDashboard() {
//   const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
//   const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
//   const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
//   const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserList, setShowUserList] = useState(false);
//   const [showRegistrationsList, setShowRegistrationsList] = useState(false);
//   const [showRegistrationNotifications, setShowRegistrationNotifications] = useState(false);
  
//   const unreadCount = joinRequests.filter(req => !req.read).length;
//   const unreadRegistrationsCount = eventRegistrations.filter(reg => !reg.read).length;
  
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isMainDashboard = location.pathname === '/admin';

//   useEffect(() => {
//     if (localStorage.getItem("isAdminAuthenticated") !== "true") {
//       navigate("/admin");
//     }
//     fetchJoinRequests();
//     fetchEventRegistrations();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("isAdminAuthenticated");
//     navigate("/");
//   };


//   const fetchJoinRequests = async () => {
//   try {
//     const response = await fetch('http://localhost:5001/api/join-us/data');

//     if (!response.ok) {
//       console.error(`Join-us API error: ${response.status}`);
//       setJoinRequests([]);
//       return;
//     }

//     const data = await response.json();

//     if (!Array.isArray(data)) {
//       console.warn("Join-us response not array:", data);
//       setJoinRequests([]);
//       return;
//     }

//     setJoinRequests(
//       data.map((req) => {
//         let skills = [], interests = [], team_preferences = [];

//         try { skills = JSON.parse(req.skills || '[]'); } catch {}
//         try { interests = JSON.parse(req.interests || '[]'); } catch {}
//         try { team_preferences = JSON.parse(req.team_preferences || '[]'); } catch {}

//         return {
//           ...req,
//           skills: Array.isArray(skills) ? skills : [],
//           interests: Array.isArray(interests) ? interests : [],
//           team_preferences: Array.isArray(team_preferences) ? team_preferences : [],
//           read: false,
//         };
//       })
//     );
//   } catch (error) {
//     console.error('Error fetching join requests:', error);
//     setJoinRequests([]);
//   }
// };

//   const fetchEventRegistrations = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/events/registrations');
//       const data = await response.json();
//       setEventRegistrations(data.map((reg: EventRegistration) => ({
//         ...reg,
//         status: reg.status || 'pending',
//         read: false
//       })));
//     } catch (error) {
//       console.error('Error fetching event registrations:', error);
//     }
//   };

//   const handleRequestClick = (request: JoinRequest) => {
//     setSelectedRequest(request);
//     const updatedRequests = joinRequests.map(req =>
//       req.id === request.id ? { ...req, read: true } : req
//     );
//     setJoinRequests(updatedRequests);
//   };

//   const handleRegistrationClick = (registration: EventRegistration) => {
//     setSelectedRegistration(registration);
//     const updatedRegistrations = eventRegistrations.map(reg =>
//       reg.id === registration.id ? { ...reg, read: true } : reg
//     );
//     setEventRegistrations(updatedRegistrations);
//   };

//   const handleRegistrationAction = async (id: number, action: 'accept' | 'reject') => {
//     try {
//       // This would be an actual API call in production
//       // await fetch(`http://localhost:5000/registrations/${id}/${action}`, {
//       //   method: 'POST',
//       // });
      
//       // For now, just update the local state
//       const updatedRegistrations = eventRegistrations.map(reg =>
//         reg.id === id ? { ...reg, status: action === 'accept' ? 'accepted' : 'rejected' } : reg
//       );
//       setEventRegistrations(updatedRegistrations);
      
//       if (selectedRegistration && selectedRegistration.id === id) {
//         setSelectedRegistration({
//           ...selectedRegistration,
//           status: action === 'accept' ? 'accepted' : 'rejected'
//         });
//       }
//     } catch (error) {
//       console.error(`Error ${action}ing registration:`, error);
//     }
//   };



//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <nav className="w-64 h-screen bg-gray-800 text-white p-4 sticky top-0">
//         <h2 className="text-xl mb-8">Admin Dashboard</h2>
//         <ul>
//           <li><Link to="/admin/carousel" className="block py-2 hover:bg-gray-700 rounded px-2 transition-colors">Carousel</Link></li>
//           <li><Link to="/admin/team" className="block py-2 hover:bg-gray-700 rounded px-2 transition-colors">Team</Link></li>
//           <li><Link to="/admin/events" className="block py-2 hover:bg-gray-700 rounded px-2 transition-colors">Events</Link></li>
//           <li><Link to="/admin/vlogs" className="block py-2 hover:bg-gray-700 rounded px-2 transition-colors">Vlogs</Link></li>
//           <li><Link to="/admin/sponsors" className="block py-2 hover:bg-gray-700 rounded px-2 transition-colors">Sponsors</Link></li>
//         </ul>
//         <button
//           onClick={handleLogout}
//           className="mt-6 bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-colors"
//         >
//           Logout
//         </button>
//       </nav>

//       {/* Main Content */}
//       <main className="flex-1 p-8 bg-gray-100 relative">
//         {isMainDashboard && (
//           <>

//             {/* Dashboard Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//               {/* User Data Card */}
//               <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="bg-blue-100 p-4 rounded-full">
//                     <Users className="w-8 h-8 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-800">{joinRequests.length}</h3>
//                     <p className="text-gray-600">Total Users</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowUserList(!showUserList)}
//                   className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
//                 >
//                   View User Data
//                 </button>
//               </div>

//               {/* Event Registrations Card */}
//               <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="bg-green-100 p-4 rounded-full">
//                     <FileText className="w-8 h-8 text-green-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-800">{eventRegistrations.length}</h3>
//                     <p className="text-gray-600">Event Registrations</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowRegistrationsList(!showRegistrationsList)}
//                   className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
//                 >
//                   View Registrations
//                 </button>
//               </div>
//             </div>

//             {/* User List */}
//             {showUserList && (
//               <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//                 <h3 className="text-xl font-bold mb-4">User List</h3>
//                 <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//                   {joinRequests.map((request) => (
//                     <div
//                       key={request.id}
//                       onClick={() => handleRequestClick(request)}
//                       className="bg-white rounded-lg shadow-lg p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
//                       style={{
//                         perspective: '1000px',
//                         transform: 'translateZ(0)',
//                       }}
//                     >
//                       <h4 className="font-bold text-lg mb-2">{request.full_name}</h4>
//                       <p className="text-gray-600 text-sm mb-1">{request.email}</p>
//                       <p className="text-gray-500 text-sm">{request.college_name}</p>
//                       <div className="mt-2 flex flex-wrap gap-1">
//                         {request.skills.slice(0, 3).map((skill, index) => (
//                           <span
//                             key={index}
//                             className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
//                           >
//                             {skill}
//                           </span>
//                         ))}
//                         {request.skills.length > 3 && (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
//                             +{request.skills.length - 3}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Event Registrations List */}
//             {showRegistrationsList && (
//               <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//                 <h3 className="text-xl font-bold mb-4">Event Registrations</h3>
//                 <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//                   {eventRegistrations.map((registration) => (
//                     <div
//                       key={registration.id}
//                       onClick={() => handleRegistrationClick(registration)}
//                       className={`bg-white rounded-lg shadow-lg p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-l-4 ${
//                         registration.status === 'accepted' ? 'border-green-500' : 
//                         registration.status === 'rejected' ? 'border-red-500' : 'border-yellow-500'
//                       }`}
//                       style={{
//                         perspective: '1000px',
//                         transform: 'translateZ(0)',
//                       }}
//                     >
//                       <div className="flex justify-between items-start">
//                         <h4 className="font-bold text-lg mb-2">{registration.team_name}</h4>
//                         <span className={`text-xs px-2 py-1 rounded ${
//                           registration.status === 'accepted' ? 'bg-green-100 text-green-800' : 
//                           registration.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {registration.status}
//                         </span>
//                       </div>
//                       <p className="text-gray-600 text-sm mb-1">Leader: {registration.team_leader_name}</p>
//                       <p className="text-gray-500 text-sm">Project: {registration.project_name}</p>
//                       <p className="text-gray-500 text-sm">Category: {registration.category}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Notification Bells */}
//             <div className="absolute top-4 right-4 flex space-x-4">
//               {/* User Notifications */}
//               <button
//                 className="relative p-2 hover:bg-gray-200 rounded-full"
//                 onClick={() => {
//                   setShowNotifications(!showNotifications);
//                   setShowRegistrationNotifications(false);
//                 }}
//               >
//                 <Bell className="w-6 h-6" />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {/* Event Registration Notifications */}
//               <button
//                 className="relative p-2 hover:bg-gray-200 rounded-full"
//                 onClick={() => {
//                   setShowRegistrationNotifications(!showRegistrationNotifications);
//                   setShowNotifications(false);
//                 }}
//               >
//                 <FileText className="w-6 h-6" />
//                 {unreadRegistrationsCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {unreadRegistrationsCount}
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* User Notifications Panel */}
//             {showNotifications && (
//               <div className="absolute top-16 right-4 w-96 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-10">
//                 <div className="p-4 border-b border-gray-200">
//                   <h3 className="text-lg font-semibold">Join Requests</h3>
//                 </div>
//                 <div className="divide-y divide-gray-200">
//                   {joinRequests.length > 0 ? (
//                     joinRequests.map((request) => (
//                       <div
//                         key={request.id}
//                         className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                           !request.read ? 'bg-blue-50' : ''
//                         }`}
//                         onClick={() => handleRequestClick(request)}
//                       >
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h4 className="font-medium">{request.full_name}</h4>
//                             <p className="text-sm text-gray-600">{request.email}</p>
//                             <p className="text-xs text-gray-500 mt-1">
//                               {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
//                             </p>
//                           </div>
//                           {!request.read && (
//                             <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="p-4 text-center text-gray-500">No join requests found</div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Event Registration Notifications Panel */}
//             {showRegistrationNotifications && (
//               <div className="absolute top-16 right-4 w-96 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-10">
//                 <div className="p-4 border-b border-gray-200">
//                   <h3 className="text-lg font-semibold">Event Registrations</h3>
//                 </div>
//                 <div className="divide-y divide-gray-200">
//                   {eventRegistrations.length > 0 ? (
//                     eventRegistrations.map((registration) => (
//                       <div
//                         key={registration.id}
//                         className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                           !registration.read ? 'bg-blue-50' : ''
//                         }`}
//                         onClick={() => handleRegistrationClick(registration)}
//                       >
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h4 className="font-medium">{registration.team_name}</h4>
//                             <p className="text-sm text-gray-600">
//                               {registration.project_name} ({registration.category})
//                             </p>
//                             <p className="text-xs text-gray-500 mt-1">
//                               {registration.created_at ? formatDistanceToNow(new Date(registration.created_at), { addSuffix: true }) : 'Recently'}
//                             </p>
//                           </div>
//                           <div className="flex items-center">
//                             <span className={`text-xs px-2 py-1 rounded mr-2 ${
//                               registration.status === 'accepted' ? 'bg-green-100 text-green-800' : 
//                               registration.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
//                             }`}>
//                               {registration.status}
//                             </span>
//                             {!registration.read && (
//                               <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="p-4 text-center text-gray-500">No event registrations found</div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* Selected Request Details */}
//         {selectedRequest && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 hover:scale-[1.02]">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h2 className="text-2xl font-bold">{selectedRequest.full_name}</h2>
//                   <button
//                     onClick={() => setSelectedRequest(null)}
//                     className="p-1 hover:bg-gray-100 rounded-full"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <h3 className="font-semibold text-gray-700">Contact Information</h3>
//                       <p className="text-sm">Email: {selectedRequest.email}</p>
//                       <p className="text-sm">Phone: {selectedRequest.phone || 'Not provided'}</p>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-700">Education</h3>
//                       <p className="text-sm">College: {selectedRequest.college_name}</p>
//                       <p className="text-sm">Course: {selectedRequest.course_stream}</p>
//                       <p className="text-sm">Year: {selectedRequest.year_of_study}</p>
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-700">Skills</h3>
//                     <div className="flex flex-wrap gap-2 mt-1">
//                       {selectedRequest.skills.map((skill, index) => (
//                         <span
//                           key={index}
//                           className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-700">Interests</h3>
//                     <div className="flex flex-wrap gap-2 mt-1">
//                       {selectedRequest.interests.map((interest, index) => (
//                         <span
//                           key={index}
//                           className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded"
//                         >
//                           {interest}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-700">Motivation</h3>
//                     <p className="text-sm mt-1">{selectedRequest.motivation}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-700">Portfolio Links</h3>
//                     <div className="space-y-2 mt-1">
//                       {selectedRequest.github_url && (
//                         <a
//                           href={selectedRequest.github_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center text-sm text-blue-600 hover:underline"
//                         >
//                           GitHub <ExternalLink className="w-4 h-4 ml-1" />
//                         </a>
//                       )}
//                       {selectedRequest.linkedin_url && (
//                         <a
//                           href={selectedRequest.linkedin_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center text-sm text-blue-600 hover:underline"
//                         >
//                           LinkedIn <ExternalLink className="w-4 h-4 ml-1" />
//                         </a>
//                       )}
//                       {selectedRequest.website_url && (
//                         <a
//                           href={selectedRequest.website_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center text-sm text-blue-600 hover:underline"
//                         >
//                           Portfolio <ExternalLink className="w-4 h-4 ml-1" />
//                         </a>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <h3 className="font-semibold text-gray-700">Team Preferences</h3>
//                       <div className="flex flex-wrap gap-2 mt-1">
//                         {selectedRequest.team_preferences.map((pref, index) => (
//                           <span
//                             key={index}
//                             className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded"
//                           >
//                             {pref}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Selected Registration Details */}
//         {selectedRegistration && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 hover:scale-[1.02]">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-2xl font-bold">{selectedRegistration.team_name}</h2>
//                     <span className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
//                       selectedRegistration.status === 'accepted' ? 'bg-green-100 text-green-800' : 
//                       selectedRegistration.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {selectedRegistration.status}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => setSelectedRegistration(null)}
//                     className="p-1 hover:bg-gray-100 rounded-full"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <h3 className="font-semibold text-gray-700">Team Leader</h3>
//                       <p className="text-sm">Name: {selectedRegistration.team_leader_name}</p>
//                       <p className="text-sm">Email: {selectedRegistration.team_leader_email}</p>
//                       <p className="text-sm">Phone: {selectedRegistration.team_leader_phone}</p>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-700">Project Details</h3>
//                       <p className="text-sm">Name: {selectedRegistration.project_name}</p>
//                       <p className="text-sm">Category: {selectedRegistration.category}</p>
//                     </div>
//                   </div>

//                   <div>
//                      <h3 className="font-semibold text-gray-700">Team Members</h3>
//                        <ul className="text-sm mt-1 space-y-1">
//                              {selectedRegistration.members.map((member: { name: string; role: string; email: string | number | boolean | SVGRectElement<any, string | SetConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
//                                <li key={index} className="border-b py-1">
//                                   <span className="font-medium">{member.name.trim()}</span> - {member.role.trim()} 
//                                  (<a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
//                                      {member.email}
//                                    </a>)
//                                  </li>
//                              ))}
//                     </ul>
//                    </div> 


//                   <div>
//                     <h3 className="font-semibold text-gray-700">Project Description</h3>
//                     <p className="text-sm mt-1">{selectedRegistration.project_description}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-700">Links</h3>
//                     <div className="space-y-2 mt-1">
//                       {selectedRegistration.github && (
//                         <a
//                           href={selectedRegistration.github}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center text-sm text-blue-600 hover:underline"
//                         >
//                           GitHub <ExternalLink className="w-4 h-4 ml-1" />
//                         </a>
//                       )}
//                       {selectedRegistration.linkedin && (
//                         <a
//                           href={selectedRegistration.linkedin}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center text-sm text-blue-600 hover:underline"
//                         >
//                           LinkedIn <ExternalLink className="w-4 h-4 ml-1" />
//                         </a>
//                       )}
//                       {selectedRegistration.project_proposal && (
                    
//                          <a
//                            href={selectedRegistration.project_proposal}
//                            target="_blank"
//                            rel="noopener noreferrer"
//                            className="flex items-center text-sm text-blue-600 hover:underline"
//                          >
//                            Project Proposal <ExternalLink className="w-4 h-4 ml-1" />
//                          </a>
//                       )}
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex justify-end space-x-3 mt-6">
//                     {selectedRegistration.status === 'pending' && (
//                       <>
//                         <button
//                           onClick={() => handleRegistrationAction(selectedRegistration.id, 'reject')}
//                           className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
//                         >
//                           <XIcon className="w-4 h-4 mr-1" /> Reject
//                         </button>
//                         <button
//                           onClick={() => handleRegistrationAction(selectedRegistration.id, 'accept')}
//                           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
//                         >
//                           <Check className="w-4 h-4 mr-1" /> Accept
//                         </button>
//                       </>
//                     )}
//                     {selectedRegistration.status === 'rejected' && (
//                       <button
//                         onClick={() => handleRegistrationAction(selectedRegistration.id, 'accept')}
//                         className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
//                       >
//                         <Check className="w-4 h-4 mr-1" /> Accept Instead
//                       </button>
//                     )}
//                     {selectedRegistration.status === 'accepted' && (
//                       <button
//                         onClick={() => handleRegistrationAction(selectedRegistration.id, 'reject')}
//                         className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
//                       >
//                         <XIcon className="w-4 h-4 mr-1" /> Reject Instead
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Render the nested route content */}
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default AdminDashboard;














// import { useEffect, useState } from 'react';
// import { 
//   LayoutDashboard, 
//   UserPlus, 
//   CalendarCheck, 
//   LogOut, 
//   Images, 
//   Users, 
//   Calendar, 
//   Video, 
//   HeartHandshake 
// } from 'lucide-react';
// import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
// import JoinUsRequests from './JoinUsRequests';
// import EventRegistrations from './EventRegistrations';

// function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<'dashboard' | 'join-us' | 'events'>('dashboard');
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (localStorage.getItem("isAdminAuthenticated") !== "true") {
//       navigate("/admin");
//     }
//   }, [navigate]);

//   // Sync activeTab with location for state-managed tabs
//   useEffect(() => {
//     if (location.pathname === '/admin') {
//       setActiveTab('dashboard');
//     } else if (location.pathname.includes('join-us')) {
//       setActiveTab('join-us');
//     } else if (location.pathname.includes('events-registrations')) {
//       setActiveTab('events');
//     }
//   }, [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("isAdminAuthenticated");
//     navigate("/");
//   };

//   // Check if we are on a nested route (not main /admin)
//   const isNestedRoute = location.pathname !== '/admin';

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar - Fixed position, full height, no scroll */}
//       <nav className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white flex flex-col z-50 overflow-hidden">
//         <div className="p-6 border-b border-gray-800">
//           <h2 className="text-2xl font-bold">Admin Panel</h2>
//         </div>
//         <div className="flex-1 p-4 space-y-1">
//           <ul className="space-y-1">
//             <li>
//               <button
//                 onClick={() => {
//                   setActiveTab('dashboard');
//                   navigate('/admin');
//                 }}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   activeTab === 'dashboard' && !isNestedRoute ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
//                 }`}
//               >
//                 <LayoutDashboard size={20} />
//                 Dashboard
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => {
//                   setActiveTab('join-us');
//                   navigate('/admin');
//                 }}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   activeTab === 'join-us' && !isNestedRoute ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
//                 }`}
//               >
//                 <UserPlus size={20} />
//                 Join Us Requests
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => {
//                   setActiveTab('events');
//                   navigate('/admin');
//                 }}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   activeTab === 'events' && !isNestedRoute ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
//                 }`}
//               >
//                 <CalendarCheck size={20} />
//                 Event Registrations
//               </button>
//             </li>

//             {/* Routed Links */}
//             <li className="mt-6">
//               <Link 
//                 to="/admin/carousel" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/carousel' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
//                 }`}
//               >
//                 <Images size={20} />
//                 Carousel
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 to="/admin/team" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/team' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
//                 }`}
//               >
//                 <Users size={20} />
//                 Team
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 to="/admin/events" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/events' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
//                 }`}
//               >
//                 <Calendar size={20} />
//                 Events
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 to="/admin/vlogs" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/vlogs' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
//                 }`}
//               >
//                 <Video size={20} />
//                 Vlogs
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 to="/admin/sponsors" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/sponsors' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
//                 }`}
//               >
//                 <HeartHandshake size={20} />
//                 Sponsors
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* Logout at bottom - fixed within sidebar */}
//         <div className="p-4 border-t border-gray-800">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
//           >
//             <LogOut size={20} />
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Main Content - Shifted right to make space for fixed sidebar */}
//       <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50 ml-64">
//         {/* Only show tab content if not on nested route */}
//         {!isNestedRoute && activeTab === 'dashboard' && (
//           <div>
//             <h1 className="text-3xl font-bold mb-8">Welcome to Admin Dashboard</h1>
//             <p className="text-gray-600 mb-6">
//               Select an option from the sidebar to manage content.
//             </p>
//             {/* Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div className="bg-white p-6 rounded-xl shadow border">
//                 <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
//                 <p>Manage Join Requests, Events, Vlogs, etc. from sidebar.</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {!isNestedRoute && activeTab === 'join-us' && <JoinUsRequests />}
//         {!isNestedRoute && activeTab === 'events' && <EventRegistrations />}

//         {/* Outlet for nested routes - always shown, but tabs hidden when on route */}
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default AdminDashboard;















// //well UI 
// import { useEffect, useState } from 'react';
// import { 
//   LayoutDashboard, 
//   UserPlus, 
//   CalendarCheck, 
//   LogOut, 
//   Images, 
//   Users, 
//   Calendar, 
//   Video, 
//   HeartHandshake,
//   Mail 
// } from 'lucide-react';
// import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
// import JoinUsRequests from './JoinUsRequests';
// import EventRegistrations from './EventRegistrations';
// import { useAuth } from '../pages/AuthContext'; // ← Yeh import karna mat bhoolna!

// function AdminDashboard() {
//   const { userEmail } = useAuth(); // ← AuthContext se email le rahe hain
//   const [activeTab, setActiveTab] = useState<'dashboard' | 'join-us' | 'events'>('dashboard');
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (localStorage.getItem("isAdminAuthenticated") !== "true") {
//       navigate("/admin");
//     }
//   }, [navigate]);

//   // Sync activeTab with location
//   useEffect(() => {
//     if (location.pathname === '/admin') {
//       setActiveTab('dashboard');
//     } else if (location.pathname.includes('join-us')) {
//       setActiveTab('join-us');
//     } else if (location.pathname.includes('events-registrations')) {
//       setActiveTab('events');
//     }
//   }, [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("isAdminAuthenticated");
//     navigate("/");
//   };

//   const isNestedRoute = location.pathname !== '/admin';

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar - Fixed */}
//       <nav className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white flex flex-col z-50 overflow-hidden">
//         <div className="p-6 border-b border-gray-800">
//           <h2 className="text-2xl font-bold">Admin Panel</h2>
//         </div>

//         <div className="flex-1 p-4 overflow-y-auto">
//           <ul className="space-y-1">
//             <li>
//               <button
//                 onClick={() => {
//                   setActiveTab('dashboard');
//                   navigate('/admin');
//                 }}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   activeTab === 'dashboard' && !isNestedRoute ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
//                 }`}
//               >
//                 <LayoutDashboard size={20} />
//                 Dashboard
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => {
//                   setActiveTab('join-us');
//                   navigate('/admin');
//                 }}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   activeTab === 'join-us' && !isNestedRoute ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
//                 }`}
//               >
//                 <UserPlus size={20} />
//                 Join Us Requests
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => {
//                   setActiveTab('events');
//                   navigate('/admin');
//                 }}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   activeTab === 'events' && !isNestedRoute ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
//                 }`}
//               >
//                 <CalendarCheck size={20} />
//                 Event Registrations
//               </button>
//             </li>

//             {/* Other links */}
//             <li className="mt-6 border-t border-gray-800 pt-4">
//               <Link 
//                 to="/admin/carousel" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/carousel' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
//                 }`}
//               >
//                 <Images size={20} />
//                 Carousel
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 to="/admin/team" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/team' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
//                 }`}
//               >
//                 <Users size={20} />
//                 Team
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 to="/admin/events" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/events' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
//                 }`}
//               >
//                 <Calendar size={20} />
//                 Events
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 to="/admin/vlogs" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/vlogs' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
//                 }`}
//               >
//                 <Video size={20} />
//                 Vlogs
//               </Link>
//             </li>
//             <li>
//               <Link 
//                 to="/admin/sponsors" 
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   location.pathname === '/admin/sponsors' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
//                 }`}
//               >
//                 <HeartHandshake size={20} />
//                 Sponsors
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* Logout section - bottom fixed */}
//         <div className="p-4 border-t border-gray-800 mt-auto">
//           {/* Email display */}
//           <div className="mb-4 px-4 py-3 bg-gray-800/50 rounded-lg text-sm text-gray-300 flex items-center gap-3">
//             <Mail size={18} />
//             <div className="truncate">
//               {userEmail ? ` ${userEmail}` : 'Not logged in'}
//             </div>
//           </div>

//           {/* Logout button */}
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
//           >
//             <LogOut size={20} />
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50 ml-64">
//         {/* Tab content only on main /admin */}
//         {!location.pathname.startsWith('/admin/') && activeTab === 'dashboard' && (
//           <div>
//             <h1 className="text-3xl font-bold mb-8">Welcome to Admin Dashboard</h1>
//             <p className="text-gray-600 mb-6">
//               Select an option from the sidebar to manage content.
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-white p-6 rounded-xl shadow border">
//                 <h3 className="text-xl font-semibold mb-2">Quick Access</h3>
//                 <p className="text-gray-600">Use the sidebar to manage all sections.</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {!location.pathname.startsWith('/admin/') && activeTab === 'join-us' && <JoinUsRequests />}
//         {!location.pathname.startsWith('/admin/') && activeTab === 'events' && <EventRegistrations />}

//         {/* Nested pages (carousel, team, vlogs, etc.) */}
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default AdminDashboard;







// after remove glitch
// import { useEffect, useState } from 'react';
// import {
//   LayoutDashboard,
//   UserPlus,
//   CalendarCheck,
//   LogOut,
//   Images,
//   Users,
//   Calendar,
//   Video,
//   HeartHandshake,
//   Mail,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import JoinUsRequests from './JoinUsRequests';
// import EventRegistrations from './EventRegistrations';
// import CarouselManagement from './CarouselManagement';
// import EventManagement from './EventManagement';
// import SponsorsManagement from './SponsorsManagement';
// import TeamManagement from './TeamManagement';
// import VlogsManagement from './VlogsManagement';

// import { useAuth } from '../pages/AuthContext';

// function AdminDashboard() {
//   const { userEmail } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState<
//     'dashboard' | 'join-us' | 'events-registrations' | 'carousel' | 'team' | 'events' | 'vlogs' | 'sponsors'
//   >('dashboard');

//   useEffect(() => {
//     if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
//       navigate('/admin');
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('isAdminAuthenticated');
//     navigate('/');
//   };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
//     { id: 'join-us', label: 'Join Us Requests', icon: UserPlus },
//     { id: 'events-registrations', label: 'Event Registrations', icon: CalendarCheck },
//     { id: 'carousel', label: 'Carousel', icon: Images },
//     { id: 'team', label: 'Team', icon: Users },
//     { id: 'events', label: 'Events', icon: Calendar },
//     { id: 'vlogs', label: 'Vlogs', icon: Video },
//     { id: 'sponsors', label: 'Sponsors', icon: HeartHandshake },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <nav className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-gradient-to-b from-gray-900 to-gray-950 text-white shadow-xl">
//         {/* Header with LIVE pill badge */}
//         <div className="border-b border-gray-800/70 px-6 py-5">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
//               Dashboard
//               <span className="relative inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
//                 <span className="relative mr-1.5 flex h-2 w-2">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
//                   <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
//                 </span>
//                 Live
//               </span>
//             </h2>

//             {/* Optional ellipsis menu */}
//             <button className="text-gray-400 hover:text-white">
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//               </svg>
//             </button>
//           </div>
//           <p className="mt-1 text-xs text-gray-500">Last update: just now</p>
//         </div>

//         {/* Menu */}
//         <div className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
//           {menuItems.map((item) => {
//             const isActive = activeTab === item.id;
//             const Icon = item.icon;

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id as any)}
//                 className={`
//                   group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
//                   ${isActive ? 'bg-indigo-600/90 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}
//                 `}
//               >
//                 <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
//                 <span>{item.label}</span>
//                 {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />}
//               </button>
//             );
//           })}
//         </div>

//         {/* Footer */}
//         <div className="border-t border-gray-800/70 p-4">
//           <div className="mb-4 flex items-center gap-3 text-sm text-gray-400">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700/60">
//               <Mail size={16} />
//             </div>
//             <div className="truncate">
//               <div className="font-medium text-gray-200">{userEmail || 'Not logged in'}</div>
//               <div className="text-xs text-gray-500">Logged in</div>
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/90 px-4 py-3 font-medium text-white transition hover:bg-red-700 active:bg-red-800"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Main Content remains the same */}
//       <main className="ml-72 flex-1 p-6 md:p-8">
//         <div className="mx-auto max-w-7xl">
//           {activeTab === 'dashboard' && (
//             <div className="rounded-xl bg-white p-8 shadow">
//               <div className="flex items-center justify-between">
//                 <h1 className="text-3xl font-bold text-gray-800">Welcome Admin</h1>
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" className="h-4 w-4 accent-emerald-500" />
//                     <span>Auto-refresh</span>
//                   </label>
//                   <button className="flex items-center gap-1.5 rounded bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
//                     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     Refresh
//                   </button>
//                 </div>
//               </div>
//               <p className="mt-2 text-gray-600">Welcome back! Last update: just now</p>
//             </div>
//           )}

//           {activeTab === 'join-us' && <JoinUsRequests />}
//           {activeTab === 'events-registrations' && <EventRegistrations />}
//           {activeTab === 'carousel' && <CarouselManagement />}
//           {activeTab === 'team' && <TeamManagement />}
//           {activeTab === 'events' && <EventManagement />}
//           {activeTab === 'vlogs' && <VlogsManagement />}
//           {activeTab === 'sponsors' && <SponsorsManagement />}
//         </div>
//       </main>
//     </div>
//   );
// }


// export default AdminDashboard;











// import { useEffect, useState } from 'react';
// import {
//   LayoutDashboard,
//   UserPlus,
//   CalendarCheck,
//   LogOut,
//   Images,
//   Users,
//   Calendar,
//   Video,
//   HeartHandshake,
//   Mail,
//   User as UserIcon, // Added for users tab
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import JoinUsRequests from './JoinUsRequests';
// import EventRegistrations from './EventRegistrations';
// import CarouselManagement from './CarouselManagement';
// import EventManagement from './EventManagement';
// import SponsorsManagement from './SponsorsManagement';
// import TeamManagement from './TeamManagement';
// import VlogsManagement from './VlogsManagement';
// import UserManagement from '../pages/UserManagement'; // New component

// import { useAuth } from '../pages/AuthContext';

// function AdminDashboard() {
//   const { userEmail } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState<
//     'dashboard' | 'join-us' | 'events-registrations' | 'carousel' | 'team' | 'events' | 'vlogs' | 'sponsors' | 'users'
//   >('dashboard');

//   const [userCount, setUserCount] = useState(0);

//   useEffect(() => {
//     if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
//       navigate('/admin');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     // Fetch total user count
//     fetch('/api/users/count')
//       .then((res) => res.json())
//       .then((data) => setUserCount(data.count))
//       .catch((err) => console.error('Error fetching user count:', err));
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('isAdminAuthenticated');
//     navigate('/');
//   };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
//     { id: 'join-us', label: 'Join Us Requests', icon: UserPlus },
//     { id: 'events-registrations', label: 'Event Registrations', icon: CalendarCheck },
//     { id: 'carousel', label: 'Carousel', icon: Images },
//     { id: 'team', label: 'Team', icon: Users },
//     { id: 'events', label: 'Events', icon: Calendar },
//     { id: 'vlogs', label: 'Vlogs', icon: Video },
//     { id: 'sponsors', label: 'Sponsors', icon: HeartHandshake },
//     { id: 'users', label: 'Users', icon: UserIcon }, // New users tab
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <nav className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-gradient-to-b from-gray-900 to-gray-950 text-white shadow-xl">
//         {/* Header with LIVE pill badge */}
//         <div className="border-b border-gray-800/70 px-6 py-5">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
//               Dashboard
//               <span className="relative inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
//                 <span className="relative mr-1.5 flex h-2 w-2">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
//                   <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
//                 </span>
//                 Live
//               </span>
//             </h2>

//             {/* Optional ellipsis menu */}
//             <button className="text-gray-400 hover:text-white">
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//               </svg>
//             </button>
//           </div>
//           <p className="mt-1 text-xs text-gray-500">Last update: just now</p>
//         </div>

//         {/* Menu */}
//         <div className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
//           {menuItems.map((item) => {
//             const isActive = activeTab === item.id;
//             const Icon = item.icon;

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id as any)}
//                 className={`
//                   group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
//                   ${isActive ? 'bg-indigo-600/90 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}
//                 `}
//               >
//                 <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
//                 <span>{item.label}</span>
//                 {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />}
//               </button>
//             );
//           })}
//         </div>

//         {/* Footer */}
//         <div className="border-t border-gray-800/70 p-4">
//           <div className="mb-4 flex items-center gap-3 text-sm text-gray-400">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700/60">
//               <Mail size={16} />
//             </div>
//             <div className="truncate">
//               <div className="font-medium text-gray-200">{userEmail || 'Not logged in'}</div>
//               <div className="text-xs text-gray-500">Logged in</div>
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/90 px-4 py-3 font-medium text-white transition hover:bg-red-700 active:bg-red-800"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="ml-72 flex-1 p-6 md:p-8">
//         <div className="mx-auto max-w-7xl">
//           {activeTab === 'dashboard' && (
//             <div className="rounded-xl bg-white p-8 shadow">
//               <div className="flex items-center justify-between">
//                 <h1 className="text-3xl font-bold text-gray-800">Welcome Admin</h1>
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" className="h-4 w-4 accent-emerald-500" />
//                     <span>Auto-refresh</span>
//                   </label>
//                   <button className="flex items-center gap-1.5 rounded bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
//                     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     Refresh
//                   </button>
//                 </div>
//               </div>
//               <p className="mt-2 text-gray-600">Welcome back! Last update: just now</p>
//               {/* Total Users count - clickable to users tab */}
//               <button
//                 onClick={() => setActiveTab('users')}
//                 className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-3 text-indigo-800 hover:bg-indigo-200"
//               >
//                 <Users size={20} />
//                 <span>Total Users: {userCount}</span>
//               </button>
//             </div>
//           )}

//           {activeTab === 'join-us' && <JoinUsRequests />}
//           {activeTab === 'events-registrations' && <EventRegistrations />}
//           {activeTab === 'carousel' && <CarouselManagement />}
//           {activeTab === 'team' && <TeamManagement />}
//           {activeTab === 'events' && <EventManagement />}
//           {activeTab === 'vlogs' && <VlogsManagement />}
//           {activeTab === 'sponsors' && <SponsorsManagement />}
//           {activeTab === 'users' && <UserManagement />}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default AdminDashboard;























// import { useEffect, useState } from 'react';
// import {
//   LayoutDashboard,
//   UserPlus,
//   CalendarCheck,
//   LogOut,
//   Images,
//   Users,
//   Calendar,
//   Video,
//   HeartHandshake,
//   Mail,
//   User as UserIcon, // Added for users tab
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import JoinUsRequests from './JoinUsRequests';
// import EventRegistrations from './EventRegistrations';
// import CarouselManagement from './CarouselManagement';
// import EventManagement from './EventManagement';
// import SponsorsManagement from './SponsorsManagement';
// import TeamManagement from './TeamManagement';
// import VlogsManagement from './VlogsManagement';
// import UserManagement from '../pages/UserManagement'; // New component

// import { useAuth } from '../pages/AuthContext';

// function AdminDashboard() {
//   const { userEmail } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState<
//     'dashboard' | 'join-us' | 'events-registrations' | 'carousel' | 'team' | 'events' | 'vlogs' | 'sponsors' | 'users'
//   >('dashboard');

//   const [userCount, setUserCount] = useState(0);

//   useEffect(() => {
//     if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
//       navigate('/admin');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     // Fetch total user count
//     fetch('/api/users/count')
//       .then((res) => res.json())
//       .then((data) => setUserCount(data.count))
//       .catch((err) => console.error('Error fetching user count:', err));
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('isAdminAuthenticated');
//     navigate('/');
//   };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
//     { id: 'join-us', label: 'Join Us Requests', icon: UserPlus },
//     { id: 'events-registrations', label: 'Event Registrations', icon: CalendarCheck },
//     { id: 'carousel', label: 'Carousel', icon: Images },
//     { id: 'team', label: 'Team', icon: Users },
//     { id: 'events', label: 'Events', icon: Calendar },
//     { id: 'vlogs', label: 'Vlogs', icon: Video },
//     { id: 'sponsors', label: 'Sponsors', icon: HeartHandshake },
//     { id: 'users', label: 'Users', icon: UserIcon }, // New users tab
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <nav className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-gradient-to-b from-gray-900 to-gray-950 text-white shadow-xl">
//         {/* Header with LIVE pill badge */}
//         <div className="border-b border-gray-800/70 px-6 py-5">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
//               Dashboard
//               <span className="relative inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
//                 <span className="relative mr-1.5 flex h-2 w-2">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
//                   <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
//                 </span>
//                 Live
//               </span>
//             </h2>

//             {/* Optional ellipsis menu */}
//             <button className="text-gray-400 hover:text-white">
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//               </svg>
//             </button>
//           </div>
//           <p className="mt-1 text-xs text-gray-500">Last update: just now</p>
//         </div>

//         {/* Menu */}
//         <div className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
//           {menuItems.map((item) => {
//             const isActive = activeTab === item.id;
//             const Icon = item.icon;

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id as any)}
//                 className={`
//                   group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
//                   ${isActive ? 'bg-indigo-600/90 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}
//                 `}
//               >
//                 <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
//                 <span>{item.label}</span>
//                 {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />}
//               </button>
//             );
//           })}
//         </div>

//         {/* Footer */}
//         <div className="border-t border-gray-800/70 p-4">
//           <div className="mb-4 flex items-center gap-3 text-sm text-gray-400">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700/60">
//               <Mail size={16} />
//             </div>
//             <div className="truncate">
//               <div className="font-medium text-gray-200">{userEmail || 'Not logged in'}</div>
//               <div className="text-xs text-gray-500">Logged in</div>
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/90 px-4 py-3 font-medium text-white transition hover:bg-red-700 active:bg-red-800"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="ml-72 flex-1 p-6 md:p-8">
//         <div className="mx-auto max-w-7xl">
//           {activeTab === 'dashboard' && (
//             <div className="rounded-xl bg-white p-8 shadow">
//               <div className="flex items-center justify-between">
//                 <h1 className="text-3xl font-bold text-gray-800">Welcome Admin</h1>
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" className="h-4 w-4 accent-emerald-500" />
//                     <span>Auto-refresh</span>
//                   </label>
//                   <button className="flex items-center gap-1.5 rounded bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
//                     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     Refresh
//                   </button>
//                 </div>
//               </div>
//               <p className="mt-2 text-gray-600">Welcome back! Last update: just now</p>
//               {/* Total Users count - clickable to users tab */}
//               <button
//                 onClick={() => setActiveTab('users')}
//                 className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-3 text-indigo-800 hover:bg-indigo-200"
//               >
//                 <Users size={20} />
//                 <span>Total Users: {userCount}</span>
//               </button>
//             </div>
//           )}

//           {activeTab === 'join-us' && <JoinUsRequests />}
//           {activeTab === 'events-registrations' && <EventRegistrations />}
//           {activeTab === 'carousel' && <CarouselManagement />}
//           {activeTab === 'team' && <TeamManagement />}
//           {activeTab === 'events' && <EventManagement />}
//           {activeTab === 'vlogs' && <VlogsManagement />}
//           {activeTab === 'sponsors' && <SponsorsManagement />}
//           {activeTab === 'users' && <UserManagement />}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default AdminDashboard;





// src/pages/admin/AdminDashboard.tsx (updated)

import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  LogOut,
  Images,
  Users,
  Calendar,
  Video,
  HeartHandshake,
  Mail,
  User as UserIcon,
  Mic, // New for webinars
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import JoinUsRequests from './JoinUsRequests';
import EventRegistrations from './EventRegistrations';
import CarouselManagement from './CarouselManagement';
import EventManagement from './EventManagement';
import SponsorsManagement from './SponsorsManagement';
import TeamManagement from './TeamManagement';
import VlogsManagement from './VlogsManagement';
import AdminMembers from './AdminMembers';
import AdminUserList from './AdminUserList';
import WebinarManagement from '../Project/WebinarManagement';

import { useAuth } from '../Project/AuthContext';

function AdminDashboard() {
  const { userEmail, logout, isAuthenticated, isAuthInitialized } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = localStorage.getItem("isSuperAdmin") === "true";
  const token = localStorage.getItem('authToken');

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'join-us' | 'events-registrations' | 'carousel' | 'team' | 'events' | 'vlogs' | 'sponsors' | 'users' | 'webinars' | 'user-list'
  >('dashboard');

  const [adminMemberCount, setAdminMemberCount] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthInitialized) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isAuthInitialized, navigate]);

  useEffect(() => {
    const fetchAdminMemberCount = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join-us/admin-members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch admin members');
        }

        const data = await res.json();
        setAdminMemberCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error('Error fetching admin member count:', err);
      }
    };

    if (isAuthenticated && token) {
      fetchAdminMemberCount();
    }
  }, [isAuthenticated, token]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('isSuperAdmin');
    navigate('/', { replace: true });
  };

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
          <span>Checking admin session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  type MenuChild = { id: string; label: string; icon: typeof LayoutDashboard };
  type MenuItem = MenuChild & { children?: MenuChild[] };
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'join-us', label: 'Join Us Requests', icon: UserPlus },
    {
      id: 'event-group',
      label: 'Event',
      icon: Calendar,
      children: [
        { id: 'events', label: 'Event Post', icon: Calendar },
        { id: 'events-registrations', label: 'Event Register', icon: CalendarCheck },
      ],
    },
    { id: 'carousel', label: 'Carousel', icon: Images },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'vlogs', label: 'Vlogs', icon: Video },
    { id: 'sponsors', label: 'Sponsors', icon: HeartHandshake },
    { id: 'users', label: 'Admin Members', icon: UserIcon },
    { id: 'user-list', label: 'User Management', icon: Users },
    { id: 'webinars', label: 'Webinars', icon: Mic }, // New tab
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-gradient-to-b from-gray-900 to-gray-950 text-white shadow-xl">
        {/* Header with LIVE pill badge */}
        <div className="border-b border-gray-800/70 px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Dashboard
              <span className="relative inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                <span className="relative mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Live
              </span>
            </h2>

            {/* Optional ellipsis menu */}
            <button className="text-gray-400 hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Last update: just now</p>
        </div>

        {/* Menu */}
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // Grouped item with a dropdown of children
            if (item.children) {
              const childActive = item.children.some((c) => c.id === activeTab);
              const isOpen = openGroups[item.id] ?? childActive;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => setOpenGroups((prev) => ({ ...prev, [item.id]: !isOpen }))}
                    className={`
                      group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
                      ${childActive ? 'bg-indigo-600/90 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}
                    `}
                  >
                    <Icon size={20} className={childActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                    <span>{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''} ${childActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-1 space-y-1 pl-5">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = activeTab === child.id;
                        return (
                          <button
                            key={child.id}
                            onClick={() => setActiveTab(child.id as any)}
                            className={`
                              group flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                              ${isChildActive ? 'bg-indigo-600/90 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'}
                            `}
                          >
                            <ChildIcon size={18} className={isChildActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                            <span>{child.label}</span>
                            {isChildActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular item
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`
                  group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
                  ${isActive ? 'bg-indigo-600/90 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}
                `}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800/70 p-4">
          <div className="mb-4 flex items-center gap-3 text-sm text-gray-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700/60">
              <Mail size={16} />
            </div>
            <div className="truncate">
              <div className="font-medium text-gray-200">{userEmail || 'Not logged in'}</div>
              <div className="text-xs text-gray-500">Logged in</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/90 px-4 py-3 font-medium text-white transition hover:bg-red-700 active:bg-red-800"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          {activeTab === 'dashboard' && (
            <div className="rounded-xl bg-white p-8 shadow">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">{isSuperAdmin ? "Welcome Super Admin" : "Welcome Admin"}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 accent-emerald-500" />
                    <span>Auto-refresh</span>
                  </label>
                  <button className="flex items-center gap-1.5 rounded bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-600">Welcome back! Last update: just now</p>
              {/* Admin member count - clickable to members tab */}
              <button
                onClick={() => setActiveTab('users')}
                className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-3 text-indigo-800 hover:bg-indigo-200"
              >
                <Users size={20} />
                <span>Admin Members: {adminMemberCount}</span>
              </button>
            </div>
          )}

          {activeTab === 'join-us' && <JoinUsRequests />}
          {activeTab === 'events-registrations' && <EventRegistrations />}
          {activeTab === 'carousel' && <CarouselManagement />}
          {activeTab === 'team' && <TeamManagement />}
          {activeTab === 'events' && <EventManagement />}
          {activeTab === 'vlogs' && <VlogsManagement />}
          {activeTab === 'sponsors' && <SponsorsManagement />}
          {activeTab === 'users' && <AdminMembers />}
          {activeTab === 'user-list' && <AdminUserList />}
          {activeTab === 'webinars' && <WebinarManagement />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
