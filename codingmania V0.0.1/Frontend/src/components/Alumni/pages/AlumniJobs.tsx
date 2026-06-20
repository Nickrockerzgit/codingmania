import { useState, useEffect } from "react";
import { createJob, getMyJobs, updateJob, deleteJob } from "../../../api/jobsApi";
import {
  Briefcase,
  Plus,
  X,
  Loader2,
  MapPin,
  Calendar,
  Building2,
  Clock,
  Send,
  ExternalLink,
  Link,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const TAG_OPTIONS = ["Python", "React", "TypeScript", "DSA", "ML", "AWS", "Docker", "Rust", "Systems", "Frontend", "Backend", "DevOps"];

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  deadline: string;
  description?: string;
  applicationLink?: string;
  tags: string[];
  posterId: number;
  createdAt: string;
}

interface JobForm {
  title: string;
  company: string;
  location: string;
  type: string;
  deadline: string;
  description: string;
  applicationLink: string;
  tags: string[];
}

const CreateJobModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  submitting, 
  editJob 
}: { 
  open: boolean; 
  onClose: () => void; 
  onSubmit: (data: JobForm) => void; 
  submitting: boolean; 
  editJob: Job | null;
}) => {
  const emptyForm: JobForm = {
    title: "",
    company: "",
    location: "",
    type: "FULL_TIME",
    deadline: "",
    description: "",
    applicationLink: "",
    tags: [],
  };

  const [form, setForm] = useState<JobForm>(emptyForm);

  useEffect(() => {
    if (open && editJob) {
      setForm({
        title: editJob.title || "",
        company: editJob.company || "",
        location: editJob.location || "",
        type: editJob.type === "INTERNSHIP" ? "INTERNSHIP" : "FULL_TIME",
        deadline: editJob.deadline || "",
        description: editJob.description || "",
        applicationLink: editJob.applicationLink || "",
        tags: Array.isArray(editJob.tags) ? editJob.tags : [],
      });
    } else if (open) {
      setForm(emptyForm);
    }
  }, [open, editJob]);

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.deadline) return;
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto bg-white/5 backdrop-blur-sm border border-white/10"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-red-400 font-semibold">{editJob ? "Edit" : "New"}</span>
              <h3 className="text-base font-bold text-white leading-none">{editJob ? "Edit Job" : "Post a Job"}</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">Job Title</label>
            <input 
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
              placeholder="e.g. SDE Intern" 
              className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-500"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">Company</label>
              <input 
                value={form.company} 
                onChange={(e) => setForm({ ...form, company: e.target.value })} 
                placeholder="e.g. Google" 
                className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-500"
                required 
              />
            </div>
            <div>
              <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">Location</label>
              <input 
                value={form.location} 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
                placeholder="e.g. Bangalore" 
                className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-500"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">Type</label>
              <select 
                value={form.type} 
                onChange={(e) => setForm({ ...form, type: e.target.value })} 
                className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">Deadline</label>
              <input 
                type="date" 
                value={form.deadline} 
                onChange={(e) => setForm({ ...form, deadline: e.target.value })} 
                className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">Description</label>
            <textarea 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              placeholder="Describe the role, requirements, etc..." 
              rows={3} 
              className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">Application Link</label>
            <div className="relative mt-1">
              <Link className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input 
                type="url" 
                value={form.applicationLink} 
                onChange={(e) => setForm({ ...form, applicationLink: e.target.value })} 
                placeholder="https://company.com/apply or Google Form link" 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-500"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Students will use this link to apply for the job</p>
          </div>

          <div>
            <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">Skills / Tags</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TAG_OPTIONS.map((tag) => (
                <button 
                  key={tag} 
                  type="button" 
                  onClick={() => toggleTag(tag)} 
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${form.tags.includes(tag) ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 rounded-xl transition">Cancel</button>
            <button
              type="submit"
              disabled={submitting || !form.title || !form.company}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
              style={{ background: "linear-gradient(135deg, #dc2626, #ea580c)" }}
            >
              <Send className="w-4 h-4" />
              {submitting ? (editJob ? "Saving..." : "Posting...") : (editJob ? "Save Changes" : "Post Job")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JobCard = ({ job, onEdit, onDelete }: { job: Job; onEdit: (job: Job) => void; onDelete: (job: Job) => void }) => {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group bg-white/5 backdrop-blur-sm border border-white/10"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm bg-gradient-to-r from-red-600 to-orange-600"
        >
          {job.company[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{job.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-300 font-medium">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  {job.company}
                </span>
                <span className="text-gray-400">·</span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  {job.location}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${job.type === "INTERNSHIP" ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-green-500/15 text-green-400 border-green-500/30"}`}>
                {job.type === "INTERNSHIP" ? "Internship" : "Full-time"}
              </span>
              <button
                onClick={() => onEdit(job)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(job)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-500/15 transition-all duration-200"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {job.tags.map((t) => (
                <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">{t}</span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock className="w-3 h-3" />
              {timeAgo(job.createdAt)}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Calendar className="w-3 h-3" />
              Deadline: {job.deadline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlumniJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await getMyJobs();
      setJobs(res.data);
    } catch {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreate = async (data: JobForm) => {
    setSubmitting(true);
    try {
      await createJob(data);
      await fetchJobs();
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to post job:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const handleUpdate = async (data: JobForm) => {
    if (!editingJob) return;
    setSubmitting(true);
    try {
      const res = await updateJob(editingJob.id, data);
      setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? res.data : j)));
      setModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      console.error("Failed to update job:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (job: Job) => {
    setDeleteTarget(job);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJob(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete job:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingJob(null);
  };

  const handleModalSubmit = (data: JobForm) => {
    if (editingJob) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10"
      >
        <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-red-400 font-semibold">Opportunities</span>
              <h3 className="text-base font-bold text-white leading-none">My Posted Jobs</h3>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-xs font-semibold rounded-xl transition-all duration-200 hover:shadow-md hover:brightness-110 bg-gradient-to-r from-red-600 to-orange-600"
          >
            <Plus className="w-3.5 h-3.5" />
            Post Job
          </button>
        </div>

        <div className="p-4 space-y-3">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading jobs...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm text-red-500 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-3">
                <Briefcase className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-sm text-gray-300 font-medium">No jobs posted yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Post Job" to share an opportunity</p>
            </div>
          )}

          {!loading && !error && jobs.map((job) => (
            <JobCard key={job.id} job={job} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      <CreateJobModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        submitting={submitting}
        editJob={editingJob}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Delete Job Posting</h3>
              <p className="text-sm text-gray-300 mb-1">
                Are you sure you want to delete
              </p>
              <p className="text-sm font-semibold text-white mb-2">
                "{deleteTarget.title}" at {deleteTarget.company}?
              </p>
              <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition disabled:opacity-60"
                >
                  {deleting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                  ) : (
                    <><Trash2 className="w-4 h-4" /> Delete</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniJobs;
