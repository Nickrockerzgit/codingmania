import { Home, LogOut, GraduationCap } from "lucide-react";
import { navItems, NavItem } from "../types";
import { useAlumniAuth } from "../hooks/useAlumniAuth";
import { useNavigate } from "react-router-dom";

interface AlumniSidebarProps {
  activeTab: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AlumniSidebar = ({ activeTab, onNavigate, isOpen, onClose }: AlumniSidebarProps) => {
  const { handleLogout } = useAlumniAuth();
  const navigate = useNavigate();

  const handleBackToWebsite = () => {
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/10 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <GraduationCap className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Alumni Portal</h1>
                <p className="text-xs text-gray-400">Technoverse</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item: NavItem) => (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.path
                    ? "bg-red-500/10 text-red-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-2">
            <button
              onClick={handleBackToWebsite}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-500/15 hover:text-red-300 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AlumniSidebar;
