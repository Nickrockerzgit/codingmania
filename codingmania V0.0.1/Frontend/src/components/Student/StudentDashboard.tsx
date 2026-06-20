import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { StudentSidebar, StudentHeader, StudentSettings } from "./components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  StudentDashboardPage,
  StudentProfile,
  StudentRoadmaps,
  StudentTasks,
  StudentMentors,
  StudentMessages,
  StudentEvents,
  StudentEvents2,
  StudentJobs,
  StudentCertificates,
} from "./pages";

const StudentDashboard = () => {
  const { user, isAuthenticated, token, isAuthInitialized, isUserProfileReady } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "dashboard");
  const [targetUserId, setTargetUserId] = useState<string | null>(searchParams.get("targetUserId"));
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  useEffect(() => {
    const tab = searchParams.get("tab") || "dashboard";
    const targetId = searchParams.get("targetUserId");
    setActiveTab(targetId ? "messages" : tab);
    setTargetUserId(targetId);
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthInitialized || !isUserProfileReady) {
      return;
    }

    if (!isAuthenticated || !token) {
      navigate("/auth");
      return;
    }

    if (user?.appliedRole !== 'student' || !['pending', 'approved'].includes(user?.applicationStatus)) {
      navigate("/dashboard");
      return;
    }

    setIsLoading(false);
  }, [user, isAuthenticated, token, isAuthInitialized, isUserProfileReady, navigate]);

  if (isLoading || !isAuthInitialized || !isUserProfileReady) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex items-center gap-2 text-red-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const handleNavigate = (path: string) => {
    setIsEditing(false);

    const params = new URLSearchParams();
    params.set("tab", path);

    if (path === "messages" && targetUserId) {
      params.set("targetUserId", targetUserId);
    }

    navigate(`/login/student/dashboard?${params.toString()}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <StudentDashboardPage />;
      case "profile":
        return <StudentProfile isEditing={isEditing} setIsEditing={setIsEditing} />;
      case "roadmaps":
        return <StudentRoadmaps />;
      case "tasks":
        return <StudentTasks />;
      case "mentors":
        return <StudentMentors />;
      case "events":
        return <StudentEvents />;
      case "events2":
        return <StudentEvents2 />;
      case "certificates":
        return <StudentCertificates />;
      case "jobs":
        return <StudentJobs />;
      case "messages":
        return <StudentMessages targetUserId={targetUserId} />;
      default:
        return null;
    }
  };

  const renderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-300 mt-1">Continue your learning journey</p>
          </div>
        );
      case "profile":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-gray-300 mt-1">Your student profile</p>
          </div>
        );
      case "roadmaps":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Roadmaps</h1>
            <p className="text-gray-300 mt-1">Learning paths and career guidance</p>
          </div>
        );
      case "tasks":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Tasks</h1>
            <p className="text-gray-300 mt-1">Track your coursework and assignments</p>
          </div>
        );
      case "mentors":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Mentors</h1>
            <p className="text-gray-300 mt-1">Connect with alumni mentors</p>
          </div>
        );
      case "events":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Events</h1>
            <p className="text-gray-300 mt-1">Discover hackathons, contests, workshops</p>
          </div>
        );
      case "events2":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Events 2</h1>
            <p className="text-gray-300 mt-1">My Registered Events</p>
          </div>
        );
      case "certificates":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Certificates</h1>
            <p className="text-gray-300 mt-1">View and manage my certifications</p>
          </div>
        );
      case "jobs":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Jobs</h1>
            <p className="text-gray-300 mt-1">Find job opportunities and internships</p>
          </div>
        );
      case "messages":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-gray-300 mt-1">Chat with alumni and peers</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <StudentSidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => {
          setSidebarOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      <main className="flex-1 min-h-screen">
        <StudentHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              {renderTitle()}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Regular Dashboard
            </button>
          </div>
          {renderContent()}
        </div>
      </main>
      <StudentSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default StudentDashboard;
