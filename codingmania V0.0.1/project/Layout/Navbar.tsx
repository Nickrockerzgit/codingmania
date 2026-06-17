import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/componant/pages/AuthContext";


const Navbar: React.FC = () => {
  const { userEmail, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitial = () => {
    return userEmail ? userEmail.charAt(0).toUpperCase() : "U";
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-6 w-full">
  <div className="flex items-center justify-between w-full">
    {/* Logo */}
    <div className="flex items-center ml-6 rounded-md p-1">
      <img
        src="./Logo.png"
        alt="Technovers Logo"
        className="h-8 w-[12 rem] rounded-lg object-contain"
      />
    </div>

    {/* Auth buttons */}
    {isAuthenticated ? (
      <div className="flex items-center gap-4">
        <button
         onClick={() => navigate("/admin")}
          className="w-8 h-8  rounded-full flex items-center justify-center text-white font-semibold text-sm bg-white/20 "
          title={userEmail || "Profile"}
        >
          {getInitial()}
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>
    ) : (
      <Link
        to="/login"
        className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
      >
        Login
      </Link>
    )}
  </div>
</nav>
  );
};

export default Navbar;
