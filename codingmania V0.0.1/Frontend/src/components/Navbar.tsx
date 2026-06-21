import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink, scroller } from "react-scroll";
import {
  Menu,
  X,
  LogOut,
  User,
  Sparkles,
  FileText,
  FileEdit,
  BadgeCheck,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import RollNumberModal from "./RollNumberModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAIToolsDropdown, setShowAIToolsDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showRollModal, setShowRollModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const aiDropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: "Home", to: "home" },
    { name: "About", to: "about" },
    { name: "Events", to: "events" },
    { name: "Vlogs", to: "vlogs" },
    { name: "Courses", to: "courses" },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
    if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target as Node)) {
      setShowAIToolsDropdown(false);
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowDropdown(false);
      setShowAIToolsDropdown(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Scroll-based hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      }
      // Hide navbar when scrolling down past threshold
      else if (currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  const routeToRoleDashboard = (role?: string, appliedRole?: string, status?: string) => {
    if (appliedRole === "alumni" || role === "alumni") {
      navigate("/login/alumni/dashboard");
      return true;
    }
    if (appliedRole === "student" && ["pending", "approved"].includes(status || "")) {
      navigate("/login/student/dashboard");
      return true;
    }
    return false;
  };

  const handleDashboard = () => {
    setShowDropdown(false);
    // If the user already has a student/alumni role, go straight to that dashboard.
    // Otherwise (e.g. Google sign-in with no roll number) ask for the enrollment number first.
    const routed = routeToRoleDashboard(user?.role, user?.appliedRole, user?.applicationStatus);
    if (!routed) setShowRollModal(true);
  };

  const getInitial = () => {
    if (!user) return "U";
    return user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  const handleScrollOrNavigate = (target: string) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        scroller.scrollTo(target, {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
          offset: -70,
        });
      }, 300);
    } else {
      scroller.scrollTo(target, {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -70,
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 navbar-scroll-transition ${isVisible ? 'navbar-scroll-visible' : 'navbar-scroll-hidden'}`}>
      <div className="flex justify-center px-4 pt-4">
        <div className="glass-panel-full w-full max-w-5xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
         <div
  className="flex items-center gap-3 cursor-pointer"
  onClick={() => navigate("/")}
>
  <div>
    <img
      src="/Logo.png"
      alt="Technovers Logo"
      className="h-8 w-18 object-cover rounded-lg"
    />
  </div>
</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleScrollOrNavigate(item.to)}
                className="nav-link bg-transparent border-none cursor-pointer"
              >
                {item.name}
              </button>
            ))}

            {isAuthenticated && (
              <div className="relative" ref={aiDropdownRef}>
                <button
                  onClick={() => setShowAIToolsDropdown((prev) => !prev)}
                  className="flex items-center space-x-1 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showAIToolsDropdown && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-md py-2 z-50">
                    <button
                      onClick={() => navigate("/resume-builder")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Build Resume
                    </button>
                    <button
                      onClick={() => navigate("/cover-letter")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition"
                    >
                      <FileEdit className="h-4 w-4 mr-2" />
                      Cover Letter
                    </button>
                    <button
                      onClick={() => navigate("/interview-prep")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition"
                    >
                      <BadgeCheck className="h-4 w-4 mr-2" />
                      Interview Prep
                    </button>
                    {user?.appliedRole === "student" && (
                      <button
                        onClick={() => {
                          setShowAIToolsDropdown(false);
                          navigate("/login/student/dashboard?tab=mentors");
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition"
                      >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Alumni Section
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <AuthButtons
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                handleDashboard={handleDashboard}
                handleLogout={handleLogout}
                getInitial={getInitial}
                dropdownRef={dropdownRef}
              />
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="btn-glass-subtle text-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 glass-panel rounded-2xl p-4 md:hidden flex flex-col gap-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                handleScrollOrNavigate(item.to);
                setIsOpen(false);
              }}
              className="text-gray-300 hover:text-white text-base font-medium cursor-pointer text-center py-2"
            >
              {item.name}
            </button>
          ))}

          {isAuthenticated && (
            <>
              <button
                onClick={() => {
                  navigate("/resume-builder");
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-2 py-2 text-sm text-gray-300 hover:bg-white/10 rounded"
              >
                <FileText className="h-4 w-4 mr-2" />
                Build Resume
              </button>
              <button
                onClick={() => {
                  navigate("/interview-prep");
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-2 py-2 text-sm text-gray-300 hover:bg-white/10 rounded"
              >
                <BadgeCheck className="h-4 w-4 mr-2" />
                Interview Prep
              </button>
              {user?.appliedRole === "student" && (
                <button
                  onClick={() => {
                    navigate("/login/student/dashboard?tab=mentors");
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-2 py-2 text-sm text-gray-300 hover:bg-white/10 rounded"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Alumni Section
                </button>
              )}
            </>
          )}

          {isAuthenticated ? (
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  handleDashboard();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-2 py-2 text-sm text-gray-300 hover:bg-white/10 rounded"
              >
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-sm text-red-400 hover:bg-white/10 rounded"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/auth");
                setIsOpen(false);
              }}
              className="btn-glow-red text-sm w-full mt-3"
            >
              Login
            </button>
          )}
        </div>
      )}

      <RollNumberModal
        isOpen={showRollModal}
        onClose={() => setShowRollModal(false)}
        onSuccess={(role) => {
          setShowRollModal(false);
          navigate(role === "alumni" ? "/login/alumni/dashboard" : "/login/student/dashboard");
        }}
      />
    </nav>
  );
};

export default Navbar;


interface AuthButtonsProps {
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handleDashboard: () => void;
  handleLogout: () => void;
  getInitial: () => string;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const AuthButtons = ({
  showDropdown,
  setShowDropdown,
  handleDashboard,
  handleLogout,
  getInitial,
  dropdownRef,
}: AuthButtonsProps) => {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white text-lg font-bold hover:scale-105 transition-transform"
      >
        {getInitial()}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 glass-panel rounded-md py-1 z-50">
          <button
            onClick={handleDashboard}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
          >
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};