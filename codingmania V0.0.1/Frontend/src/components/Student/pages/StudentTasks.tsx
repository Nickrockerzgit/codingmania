import { CheckSquare, Clock, AlertCircle, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";

interface Task {
  id: number;
  title: string;
  description?: string | null;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
}

const StudentTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/student/tasks?userId=${user.id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(
          data.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            deadline: t.deadline ? new Date(t.deadline).toISOString().split("T")[0] : "—",
            priority: t.priority,
            status: t.status,
          }))
        );
      } catch (err) {
        console.error(err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user?.id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-300 bg-red-500/15";
      case "medium": return "text-amber-400 bg-amber-500/15";
      case "low": return "text-green-400 bg-green-500/15";
      default: return "text-gray-300 bg-white/5";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in-progress": return <Clock className="w-5 h-5 text-red-400" />;
      default: return <AlertCircle className="w-5 h-5 text-amber-400" />;
    }
  };

  const updateStatus = async (id: number, status: Task["status"]) => {
    const progress = status === "completed" ? 100 : status === "in-progress" ? 50 : 0;
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/student/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status, progress }),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      console.error(err);
      alert("Failed to update task status");
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm("Delete this task?")) return;
    const prev = tasks;
    setTasks((p) => p.filter((t) => t.id !== id));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/student/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
      setTasks(prev); // rollback
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="w-5 h-5 text-red-400" />
            <span className="font-medium text-white">Total Tasks</span>
          </div>
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-red-400" />
            <span className="font-medium text-white">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-white">{tasks.filter(t => t.status === "in-progress").length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-medium text-white">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{tasks.filter(t => t.status === "completed").length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="font-medium text-white">Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">{tasks.filter(t => t.status === "pending").length}</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Your Tasks</h3>
        </div>
        <div className="divide-y divide-white/10">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <CheckSquare className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              No tasks assigned yet.
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  {getStatusIcon(task.status)}
                  <div className="min-w-0">
                    <h4 className={`font-medium text-white ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>
                      {task.title}
                    </h4>
                    {task.description && <p className="text-sm text-gray-400 truncate">{task.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-sm text-gray-400 hidden sm:inline">{task.deadline}</span>

                  {/* Status update */}
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value as Task["status"])}
                    className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="pending" className="bg-[#0a0a0a]">Pending</option>
                    <option value="in-progress" className="bg-[#0a0a0a]">In Progress</option>
                    <option value="completed" className="bg-[#0a0a0a]">Completed</option>
                  </select>

                  {/* Delete */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTasks;
