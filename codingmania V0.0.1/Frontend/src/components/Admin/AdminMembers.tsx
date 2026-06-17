import { useEffect, useState } from 'react';
import { Shield, ShieldCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminMember {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role?: string | null;
  appliedRole?: string | null;
  applicationStatus?: string | null;
  adminAccess: boolean;
  superAdminAccess: boolean;
  created_at: string;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const token = localStorage.getItem('authToken');
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join-us/admin-members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to load admin members');
      }

      setMembers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Fetch admin members error:', err);
      setError(err.message || 'Failed to load admin members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const removeAdmin = async (userId: number) => {
    try {
      setRemovingId(userId);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join-us/admin-members/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to remove admin access');
      }

      toast.success(data.message || 'Admin access removed');
      await fetchMembers();
    } catch (err: any) {
      console.error('Remove admin error:', err);
      toast.error(err.message || 'Failed to remove admin access');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-300">Loading admin members...</div>;
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-950/30 p-6 text-center text-rose-200">
        <p>{error}</p>
        <button
          onClick={fetchMembers}
          className="mt-4 rounded-xl bg-rose-600 px-4 py-2 font-medium text-white transition hover:bg-rose-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-white shadow-2xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Access Control</p>
          <h1 className="mt-2 text-3xl font-bold">Admin Members</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            This list shows every account that currently holds admin capability. Removing access here revokes dashboard privileges without deleting the underlying user account.
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 px-5 py-4 text-sm text-slate-300 ring-1 ring-white/10">
          Total active admins: <span className="font-semibold text-white">{members.length}</span>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
          No admin members found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr className="text-left text-sm text-slate-300">
                <th className="px-4 py-4 font-medium">Member</th>
                <th className="px-4 py-4 font-medium">Base Role</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Access</th>
                <th className="px-4 py-4 font-medium">Phone</th>
                <th className="px-4 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/40">
              {members.map((member) => (
                <tr key={member.id} className="text-sm text-slate-200">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-11 w-11 rounded-full object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/20">
                          {member.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white">{member.name || 'Unnamed member'}</p>
                        <p className="text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{member.appliedRole || member.role || 'member'}</td>
                  <td className="px-4 py-4 text-slate-300">{member.applicationStatus || 'N/A'}</td>
                  <td className="px-4 py-4">
                    {member.superAdminAccess ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-fuchsia-200 ring-1 ring-fuchsia-500/25">
                        <ShieldCheck className="h-4 w-4" />
                        Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-200 ring-1 ring-cyan-500/25">
                        <Shield className="h-4 w-4" />
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-300">{member.phone || 'N/A'}</td>
                  <td className="px-4 py-4">
                    {isSuperAdmin && !member.superAdminAccess ? (
                      <button
                        onClick={() => removeAdmin(member.id)}
                        disabled={removingId === member.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Access
                      </button>
                    ) : (
                      <span className="text-slate-500">{member.superAdminAccess ? 'Protected' : 'View only'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
