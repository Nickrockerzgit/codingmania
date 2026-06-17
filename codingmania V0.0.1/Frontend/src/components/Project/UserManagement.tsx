// import { useEffect, useState } from 'react';
// import { Edit, Trash, LogIn } from 'lucide-react';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   avatar: string;
// }

// function UserManagement() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // IMPORTANT: .env mein already /api daala hai, to yahan sirf /users append karo
//         const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users`;

//         console.log('Fetching users from:', apiUrl); // debug ke liye

//         const response = await fetch(apiUrl);

//         console.log('Response status:', response.status);

//         if (!response.ok) {
//           const errText = await response.text();
//           throw new Error(`Server responded with ${response.status}: ${errText}`);
//         }

//         const data = await response.json();

//         console.log('Received data:', data);

//         // Safety check
//         const userList = Array.isArray(data) ? data : [];

//         setUsers(userList);
//       } catch (err: any) {
//         console.error('Fetch error:', err);
//         setError(err.message || 'Failed to load users. Please check console.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center py-12 text-gray-500">
//         <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
//         <p>Loading users...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg p-6 max-w-2xl mx-auto">
//         <p className="font-medium mb-3">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-xl bg-white p-6 shadow-lg">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
//         <div className="flex gap-3">
//           <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
//             Add New
//           </button>
//           <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
//             Import
//           </button>
//           <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
//             Export (Excel)
//           </button>
//         </div>
//       </div>

//       <div className="text-sm text-gray-600 mb-4 font-medium">
//         Total Users: {users.length}
//       </div>

//       {users.length === 0 ? (
//         <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
//           No users found in the system.
//         </div>
//       ) : (
//         <div className="overflow-x-auto border border-gray-200 rounded-lg">
//           <table className="w-full table-auto border-collapse min-w-[900px]">
//             <thead>
//               <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
//                 <th className="p-4">Photo</th>
//                 <th className="p-4">Member Name</th>
//                 <th className="p-4">Mobile</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Operation</th>
//                 <th className="p-4">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="p-4">
//                     <img
//                       src={user.avatar || 'https://via.placeholder.com/48?text=User'}
//                       alt={user.name}
//                       className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
//                     />
//                   </td>
//                   <td className="p-4 font-medium text-gray-900">{user.name}</td>
//                   <td className="p-4 text-gray-700">{user.phone}</td>
//                   <td className="p-4 text-gray-700 break-all">{user.email}</td>
//                   <td className="p-4">
//                     <div className="flex gap-4">
//                       <button
//                         className="text-blue-600 hover:text-blue-800 transition"
//                         title="Edit"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         className="text-red-600 hover:text-red-800 transition"
//                         title="Delete"
//                       >
//                         <Trash size={18} />
//                       </button>
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <button className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium transition">
//                       <LogIn size={16} />
//                       Login
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserManagement;









import { useEffect, useState } from 'react';
import { ClipboardCheck, Download } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface TaskForm {
  title: string;
  description: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = localStorage.getItem("isSuperAdmin") === "true";
  const SUPER_ADMIN_EMAIL = "lancer969976@gmail.com";

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal for task assignment
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users`;

        console.log('Fetching users from:', apiUrl);

        const response = await fetch(apiUrl);

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Server responded with ${response.status}: ${errText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        const userList = Array.isArray(data) ? data : [];
        const filteredUsers = isSuperAdmin 
          ? userList 
          : userList.filter((user: User) => user.email !== SUPER_ADMIN_EMAIL);
        setUsers(filteredUsers);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load users. Please check console.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Export to CSV
  const exportToExcel = () => {
    const csvContent = [
      'ID,Name,Email,Phone,Avatar',
      ...users.map((user) => `${user.id},"${user.name.replace(/"/g, '""')}","${user.email}","${user.phone}","${user.avatar}"`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Open task modal for selected user
  const openTaskModal = (userId: number) => {
    setSelectedUserId(userId);
    setTaskForm({
      title: '',
      description: '',
      deadline: '',
      priority: 'medium',
    });
    setIsTaskModalOpen(true);
  };

  // Handle task assignment
  const assignTask = async () => {
    if (!selectedUserId || !taskForm.title || !taskForm.deadline) return;

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/tasks`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskForm,
          userId: selectedUserId,
          status: 'pending', // Default status
          progress: 0, // Default progress
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign task');
      }

      alert('Task assigned successfully!');
      setIsTaskModalOpen(false);
    } catch (err: any) {
      console.error('Assign task error:', err);
      alert('Failed to assign task. Try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-300">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400 bg-red-900/30 rounded-lg p-6 max-w-2xl mx-auto">
        <p className="font-medium mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gray-900 text-gray-100 p-6 shadow-2xl border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-md"
        >
          <Download size={18} />
          Export to Excel
        </button>
      </div>

      <div className="text-sm text-gray-400 mb-4 font-medium">
        Total Users: <span className="text-indigo-400">{users.length}</span>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50">
          No users found in the system.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-700 rounded-lg mb-6 bg-gray-800">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-800 text-left text-sm font-semibold text-gray-300">
                  <th className="p-4">Photo</th>
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-700 hover:bg-gray-700/70 transition-colors"
                  >
                    <td className="p-4">
                      <img
                        src={user.avatar || 'https://via.placeholder.com/48?text=User'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-600 shadow-sm"
                      />
                    </td>
                    <td className="p-4 font-medium text-white">{user.name}</td>
                    <td className="p-4 text-gray-300">{user.phone}</td>
                    <td className="p-4 text-gray-300 break-all">{user.email}</td>
                    <td className="p-4">
                      <button
                        onClick={() => openTaskModal(user.id)}
                        className="flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition"
                      >
                        <ClipboardCheck size={18} />
                        Assign Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span>
              Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, users.length)} of{' '}
              <span className="text-white">{users.length}</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 transition disabled:cursor-not-allowed"
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = currentPage - 2 + i;
                if (page < 1 || page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white font-bold shadow-md'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}

              {totalPages > 5 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    currentPage === totalPages
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 transition disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Task Assignment Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 text-gray-100">
            <h2 className="text-xl font-bold mb-4 text-white">Assign Task</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:outline-none text-white"
              />
              <textarea
                placeholder="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:outline-none text-white"
                rows={3}
              />
              <input
                type="date"
                value={taskForm.deadline}
                onChange={(e) => setTaskForm({...taskForm, deadline: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:outline-none text-white"
              />
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value as 'high' | 'medium' | 'low'})}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:outline-none text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={assignTask}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;