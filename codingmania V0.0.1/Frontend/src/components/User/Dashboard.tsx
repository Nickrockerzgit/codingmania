
import { useState } from 'react';
import {
  User,
  Settings,
  LogOut,
  Award,
  Calendar,
  Bell,
  Menu,
  X,
  UserPlus
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import Profile from './Profile';
import Notifications from './Notifications';
import SettingsComponent from './Settings';
import Certifications from './Certification';
import Events from './Events';
import ApplyForRoleModal from '../ApplyForRoleModal';

const Dashboard = () => {
  const { user, logout, updateUser, isUserProfileReady } = useAuth();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const showApplyButton = isUserProfileReady && !user?.appliedRole;

  const isStudentUser = () => {
    return user?.appliedRole === 'student' || user?.role === 'student';
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
    setSidebarOpen(false);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getUserInitial = () => {
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const sidebarItems = [
    { id: 'profile', icon: User, label: 'Profile', onClick: () => openModal('profile') },
    { id: 'certifications', icon: Award, label: 'Certifications', onClick: () => openModal('certifications') },
    { id: 'events', icon: Calendar, label: 'Events', onClick: () => openModal('events') },
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Settings', onClick: () => openModal('settings') },
    { id: 'logout', icon: LogOut, label: 'Logout', onClick: handleLogout, className: 'text-red-400 hover:text-red-300' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0a0a0a] text-white border-r border-white/10 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h2 className="text-xl font-bold">Technoverse</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={item.onClick}
                    className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 border border-transparent rounded-lg transition-colors duration-200"
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom items */}
          <div className="px-6 pb-6 border-t border-white/10 pt-6">
            <ul className="space-y-2">
              {bottomItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={item.onClick}
                    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${item.className || 'text-gray-300 hover:text-white hover:bg-red-500/10'
                      }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-[#050505] border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-300 hover:text-white"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              {isUserProfileReady && (user?.role === 'alumni' || user?.appliedRole === 'alumni') && (
                <button
                  className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  onClick={() => navigate('/login/alumni/dashboard')}
                >
                  Alumni Dashboard
                </button>
              )}
              {isUserProfileReady && (user?.appliedRole === 'student' && ['pending', 'approved'].includes(user?.applicationStatus)) && (
                <button
                  className="ml-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                  onClick={() => navigate('/login/student/dashboard')}
                >
                  Student Dashboard
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button
                onClick={() => openModal('notifications')}
                className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Profile */}
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getUserInitial()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Overview Card */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-red-500/30 hover:shadow-[0_8px_32px_rgba(220,38,38,0.15)] transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <User className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-sm text-gray-400">Profile</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Profile Overview</h3>
              <p className="text-gray-400 text-sm mb-4">Manage your profile information and settings.</p>
              <button
                onClick={() => openModal('profile')}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                View Profile
              </button>
            </div>

            {/* Certifications Card */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-red-500/30 hover:shadow-[0_8px_32px_rgba(220,38,38,0.15)] transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-sm text-gray-400">Certificates</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Certifications</h3>
              <p className="text-gray-400 text-sm mb-4">View and download your earned certificates.</p>
              <button
                onClick={() => openModal('certifications')}
                className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200"
              >
                View Certificates
              </button>
            </div>

            {/* Events Card */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-red-500/30 hover:shadow-[0_8px_32px_rgba(220,38,38,0.15)] transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-sm text-gray-400">Events</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Registered Events</h3>
              <p className="text-gray-400 text-sm mb-4">View events you've registered for.</p>
              <button
                onClick={() => openModal('events')}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                View Events
              </button>
            </div>

            {/* Apply for Role Card */}
            {showApplyButton && (
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl shadow-md text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-white/80">Upgrade</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Unlock More Features</h3>
                <p className="text-white/80 text-sm mb-4">Apply for the student or alumni role to unlock the dashboard and profile features made for your journey.</p>
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="w-full px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
                >
                  Apply Now
                </button>
              </div>
            )}

            {/* Quick Stats Card */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 md:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">12</div>
                  <div className="text-sm text-gray-400">Certificates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">3</div>
                  <div className="text-sm text-gray-400">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">85%</div>
                  <div className="text-sm text-gray-400">Profile Completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Profile isOpen={activeModal === 'profile'} onClose={closeModal} />
      <Notifications isOpen={activeModal === 'notifications'} onClose={closeModal} />
      <SettingsComponent isOpen={activeModal === 'settings'} onClose={closeModal} />
      <Certifications isOpen={activeModal === 'certifications'} onClose={closeModal} />
      <Events isOpen={activeModal === 'events'} onClose={closeModal} />

      {showApplyButton && (
        <ApplyForRoleModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          onSuccess={(role: string) => {
            setShowRoleModal(false);
            updateUser({ appliedRole: role, role: role });
            if (role === 'alumni') {
              navigate('/login/alumni/dashboard');
            } else {
              window.location.reload();
            }
          }}
          userName={user?.name || ''}
          userEmail={user?.email || ''}
        />
      )}
    </div>
  );
};

export default Dashboard;
