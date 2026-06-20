import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
}

const StudentTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete Data Structures assignment", subject: "Data Structures", deadline: "2025-04-10", priority: "high", status: "in-progress" },
    { id: 2, title: "Prepare for Database midterm", subject: "Database Management", deadline: "2025-04-15", priority: "medium", status: "pending" },
    { id: 3, title: "Submit Web Dev project", subject: "Web Development", deadline: "2025-04-08", priority: "high", status: "completed" },
    { id: 4, title: "Review Algorithms notes", subject: "Design & Analysis of Algorithms", deadline: "2025-04-12", priority: "low", status: "pending" },
  ]);

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
          {tasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(task.status)}
                <div>
                  <h4 className="font-medium text-white">{task.title}</h4>
                  <p className="text-sm text-gray-400">{task.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="text-sm text-gray-400">{task.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentTasks;
