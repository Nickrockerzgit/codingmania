import { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Ban,
  CheckCircle2,
  ClipboardList,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

interface ManagedUser {
  id: number;
  name: string;
  email: string;
  batch: string | null;
  branch: string | null;
  appliedRole: string | null;
  role: string | null;
  blocked: boolean;
}

const API = import.meta.env.VITE_API_BASE_URL;
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
});

const AdminUserList = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Assign-task modal state
  const [taskTarget, setTaskTarget] = useState<ManagedUser | null>(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', deadline: '', priority: 'medium' });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search.trim()) params.set('search', search.trim());
      if (roleFilter) params.set('role', roleFilter);

      const res = await fetch(`${API}/users/managed?${params.toString()}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter]);

  // Reset to page 1 whenever a new search is submitted
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (page === 1) fetchUsers();
    else setPage(1);
  };

  const toggleBlock = async (u: ManagedUser) => {
    if (!confirm(`${u.blocked ? 'Unblock' : 'Block'} ${u.name}?`)) return;
    try {
      const res = await fetch(`${API}/users/${u.id}/block`, {
        method: 'PUT',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed');
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, blocked: !x.blocked } : x)));
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    }
  };

  const openTaskModal = (u: ManagedUser) => {
    setTaskForm({ title: '', description: '', deadline: '', priority: 'medium' });
    setTaskTarget(u);
  };

  const submitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/users/${taskTarget.id}/assign-task`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(taskForm),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to assign task');
      }
      alert(`Task assigned to ${taskTarget.name}`);
      setTaskTarget(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to assign task');
    } finally {
      setSaving(false);
    }
  };

  const roleBadge = (role: string | null) =>
    role === 'alumni'
      ? 'bg-purple-100 text-purple-700'
      : 'bg-blue-100 text-blue-700';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            User Management
          </h1>
          <p className="text-gray-500 mt-1">{total} students & alumni registered</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="alumni">Alumni</option>
          </select>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / email"
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-56"
            />
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Batch</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin inline" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className={u.blocked ? 'bg-red-50/60' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{u.name}</div>
                      {u.blocked && <span className="text-xs text-red-600 font-medium">Blocked</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-gray-600">{u.batch || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleBadge(u.appliedRole)}`}>
                        {u.appliedRole || u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Assign Task — students only */}
                        {u.appliedRole === 'student' && (
                          <button
                            onClick={() => openTaskModal(u)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                          >
                            <ClipboardList className="w-4 h-4" />
                            Assign Task
                          </button>
                        )}

                        <button
                          onClick={() => toggleBlock(u)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition text-white ${
                            u.blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {u.blocked ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          {u.blocked ? 'Unblock' : 'Block'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Assign Task Modal */}
      {taskTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Assign Task to {taskTarget.name}</h2>
              <button onClick={() => setTaskTarget(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={submitTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. Complete React assignment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Task details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                  <input
                    required
                    type="date"
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTaskTarget(null)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-60"
                >
                  {saving ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
