import { Home, LogOut, GraduationCap, Settings } from "lucide-react";
import { navItems, NavItem } from "../types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

interface StudentSidebarProps {
  activeTab: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

const StudentSidebar = ({ activeTab, onNavigate, isOpen, onClose, onOpenSettings }: StudentSidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleBackToWebsite = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
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
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Student Portal</h1>
                <p className="text-xs text-gray-500">Technoverse</p>
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
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
            <button
              onClick={handleBackToWebsite}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
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

export default StudentSidebar;
