import { useEffect, useState } from 'react';
import { Check, ExternalLink, ShieldCheck, UserRoundX, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface MatchedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  appliedRole?: string | null;
  applicationStatus?: string | null;
  adminAccess: boolean;
  superAdminAccess: boolean;
}

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
  status: 'pending' | 'approved' | 'rejected';
  matchedUser: MatchedUser | null;
}

const getStatusClasses = (status: JoinRequest['status']) => {
  if (status === 'approved') return 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30';
  if (status === 'rejected') return 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30';
  return 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30';
};

export default function JoinUsRequests() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [selected, setSelected] = useState<JoinRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const token = localStorage.getItem('authToken');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join-us/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to fetch admin requests');
      }

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load admin requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      setActionLoading(id);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join-us/${id}/${action}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || `Failed to ${action} request`);
      }

      toast.success(data.message || `Request ${action}d successfully`);
      await fetchRequests();
      if (selected?.id === id) setSelected(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || `Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-300">Loading admin membership requests...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Admin Membership</p>
            <h1 className="mt-2 text-3xl font-bold">Join Us Requests</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Review incoming admin applications. Approval grants additive admin capability without replacing the applicant&apos;s current student or alumni role.
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 px-5 py-4 text-sm text-slate-300 ring-1 ring-white/10">
            Pending requests: <span className="font-semibold text-white">{requests.filter((req) => req.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-10 text-center text-slate-400">
          No admin membership requests found yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((req) => (
            <button
              key={req.id}
              type="button"
              onClick={() => setSelected(req)}
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-left text-white shadow-xl transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{req.full_name}</p>
                  <p className="mt-1 text-sm text-slate-300">{req.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(req.status)}`}>
                  {req.status}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <p>{req.college_name || 'College not provided'}</p>
                <p>{req.course_stream || 'Course not provided'}</p>
                <p>{formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}</p>
              </div>

              <div className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                {req.matchedUser ? (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-emerald-300">Matched account found</p>
                    <p className="text-slate-300">{req.matchedUser.name}</p>
                    <p className="text-slate-400">Base role: {req.matchedUser.appliedRole || req.matchedUser.role || 'member'}</p>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-amber-300">No matching logged-in account yet</p>
                    <p className="text-slate-400">Approval must wait until the applicant has an account with the same email.</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
            <div className="sticky top-0 z-10 mb-8 flex items-start justify-between gap-4 border-b border-white/10 bg-slate-950 pb-5">
              <div>
                <h2 className="text-3xl font-bold">{selected.full_name}</h2>
                <p className="mt-2 text-sm text-slate-300">{selected.email}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <h3 className="text-lg font-semibold">Contact and Education</h3>
                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p><span className="text-slate-400">Phone:</span> {selected.phone || 'N/A'}</p>
                    <p><span className="text-slate-400">College:</span> {selected.college_name || 'N/A'}</p>
                    <p><span className="text-slate-400">Course:</span> {selected.course_stream || 'N/A'}</p>
                    <p><span className="text-slate-400">Year:</span> {selected.year_of_study || 'N/A'}</p>
                  </div>
                </section>

                <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.skills.length > 0 ? selected.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm text-cyan-200 ring-1 ring-cyan-500/25">
                        {skill}
                      </span>
                    )) : <p className="text-sm text-slate-400">No skills listed.</p>}
                  </div>
                </section>

                <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <h3 className="text-lg font-semibold">Interests and Teams</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selected.interests.length > 0 ? selected.interests.map((interest) => (
                        <span key={interest} className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-sm text-fuchsia-200 ring-1 ring-fuchsia-500/25">
                          {interest}
                        </span>
                      )) : <p className="text-sm text-slate-400">No interests listed.</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selected.team_preferences.length > 0 ? selected.team_preferences.map((pref) => (
                        <span key={pref} className="rounded-full bg-amber-500/15 px-3 py-1 text-sm text-amber-200 ring-1 ring-amber-500/25">
                          {pref}
                        </span>
                      )) : <p className="text-sm text-slate-400">No team preferences listed.</p>}
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <h3 className="text-lg font-semibold">Application Status</h3>
                  <div className="mt-4 space-y-4 text-sm text-slate-300">
                    <span className={`inline-flex rounded-full px-3 py-1 font-semibold capitalize ${getStatusClasses(selected.status)}`}>
                      {selected.status}
                    </span>
                    <p>Submitted {formatDistanceToNow(new Date(selected.created_at), { addSuffix: true })}</p>
                  </div>
                </section>

                <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <h3 className="text-lg font-semibold">Matched Account</h3>
                  {selected.matchedUser ? (
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Eligible for approval</span>
                      </div>
                      <p><span className="text-slate-400">Name:</span> {selected.matchedUser.name}</p>
                      <p><span className="text-slate-400">Email:</span> {selected.matchedUser.email}</p>
                      <p><span className="text-slate-400">Base role:</span> {selected.matchedUser.appliedRole || selected.matchedUser.role || 'member'}</p>
                      <p><span className="text-slate-400">Application status:</span> {selected.matchedUser.applicationStatus || 'N/A'}</p>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl bg-amber-500/10 p-4 text-sm text-amber-100 ring-1 ring-amber-500/20">
                      <UserRoundX className="mt-0.5 h-5 w-5 shrink-0" />
                      <p>This applicant must first log into the main website with the same email before admin approval can be granted.</p>
                    </div>
                  )}
                </section>

                <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <h3 className="text-lg font-semibold">Motivation</h3>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{selected.motivation || 'No motivation provided.'}</p>
                </section>

                <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <h3 className="text-lg font-semibold">Links</h3>
                  <div className="mt-4 space-y-3">
                    {selected.github_url && <a href={selected.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200">GitHub <ExternalLink className="h-4 w-4" /></a>}
                    {selected.linkedin_url && <a href={selected.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200">LinkedIn <ExternalLink className="h-4 w-4" /></a>}
                    {selected.website_url && <a href={selected.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200">Portfolio <ExternalLink className="h-4 w-4" /></a>}
                    {!selected.github_url && !selected.linkedin_url && !selected.website_url && <p className="text-sm text-slate-400">No links provided.</p>}
                  </div>
                </section>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleAction(selected.id, 'reject')}
                disabled={actionLoading === selected.id || selected.status !== 'pending'}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Reject Request
              </button>
              <button
                type="button"
                onClick={() => handleAction(selected.id, 'approve')}
                disabled={actionLoading === selected.id || selected.status !== 'pending' || !selected.matchedUser}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                Approve Admin Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
