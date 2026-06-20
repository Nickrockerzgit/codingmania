import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AlumniSidebar, AlumniHeader } from "./components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  AlumniDashboardPage,
  AlumniProfile,
  AlumniMessages,
  AlumniJobs,
  AlumniRoadmaps,
  AlumniEvents,
  AlumniEvents2,
  AlumniCertificates,
} from "./pages";

const AlumniDashboard = () => {
  const { user, isAuthenticated, token, isAuthInitialized, isUserProfileReady } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "dashboard");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
      return;
    }
    setActiveTab("dashboard");
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthInitialized || !isUserProfileReady) {
      return;
    }

    if (!isAuthenticated || !token) {
      navigate("/", { replace: true });
      return;
    }

    if (user?.role !== 'alumni' && user?.appliedRole !== 'alumni') {
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
    setActiveTab(path);
    setIsEditing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AlumniDashboardPage />;
      case "profile":
        return <AlumniProfile isEditing={isEditing} setIsEditing={setIsEditing} />;
      case "events":
        return <AlumniEvents />;
      case "events2":
        return <AlumniEvents2 />;
      case "certificates":
        return <AlumniCertificates />;
      case "messages":
        return <AlumniMessages />;
      case "jobs":
        return <AlumniJobs />;
      case "roadmaps":
        return <AlumniRoadmaps />;
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
            <p className="text-gray-300 mt-1">Welcome back to your community</p>
          </div>
        );
      case "profile":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-gray-300 mt-1">Your alumni profile</p>
          </div>
        );
      case "events":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Events</h1>
            <p className="text-gray-300 mt-1">Create and manage events</p>
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
            <p className="text-gray-300 mt-1">View and manage certifications</p>
          </div>
        );
      case "messages":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-gray-300 mt-1">Network with alumni</p>
          </div>
        );
      case "jobs":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Jobs</h1>
            <p className="text-gray-300 mt-1">Browse job opportunities</p>
          </div>
        );
      case "roadmaps":
        return (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Roadmaps</h1>
            <p className="text-gray-300 mt-1">Create and share learning paths</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <AlumniSidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-h-screen">
        <AlumniHeader onMenuClick={() => setSidebarOpen(true)} />

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
    </div>
  );
};

export default AlumniDashboard;
