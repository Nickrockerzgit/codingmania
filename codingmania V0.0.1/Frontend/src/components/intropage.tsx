
// import { useState, useRef, useEffect } from "react";
// import { Link as ScrollLink } from "react-scroll";
// import { useNavigate } from "react-router-dom";
// import { Menu, X, LogOut, User, Sparkles, FileText, FileEdit, BadgeCheck ,ChevronDown} from "lucide-react";
// import { useAuth } from "../components/AuthContext";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showAIToolsDropdown, setShowAIToolsDropdown] = useState(false);
//   const { user, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const aiDropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowDropdown(false);
//       }
//       if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target as Node)) {
//         setShowAIToolsDropdown(false);
//       }
//     };
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         setShowDropdown(false);
//         setShowAIToolsDropdown(false);
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscape);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   const handleLogout = () => {
//     logout();
//     setShowDropdown(false);
//     navigate("/");
//   };

//   const handleDashboard = () => {
//     setShowDropdown(false);
//     navigate("/dashboard");
//   };

//   const getInitial = () => {
//     if (!user) return "U";
//     return user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();
//   };

//   const menuItems = [
//     { name: "Home", to: "home" },
//     { name: "About", to: "about" },
//     { name: "Events", to: "events" },
//     { name: "Vlogs", to: "vlogs" },
//     { name: "Courses", to: "courses" },
//   ];

//   return (
//     <nav className="fixed w-full bg-black/20 backdrop-blur-md z-50">
//       <div className="flex justify-between items-center px-6 py-3">
//         {/* Logo */}
//         <div className="flex items-center rounded-md bg-white p-1">
//           <img src="/Logo.png" alt="Technovers Logo" className="h-8 w-auto max-w-[7.25rem]" />
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center space-x-6">
//           {menuItems.map((item) => (
//             <ScrollLink
//               key={item.name}
//               to={item.to}
//               smooth={true}
//               duration={500}
//               className="text-gray-300 hover:text-white text-sm font-medium cursor-pointer hover:scale-105 transition-all"
//             >
//               {item.name}
//             </ScrollLink>
//           ))}

//           {isAuthenticated && (
//             <div className="relative" ref={aiDropdownRef}>
//               <button
//                 onClick={() => setShowAIToolsDropdown((prev) => !prev)}
//                 className="flex items-center space-x-1 bg-white text-black border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition"
//               >
//                 <Sparkles className="h-4 w-4" />
//                 <span>AI Tools</span>
//                 <ChevronDown className="h-4 w-4 mr-2" />
//               </button>

//               {showAIToolsDropdown && (
//                 <div className="absolute right-0 mt-2 w-56 bg-black text-white rounded-md shadow-lg py-2 z-50">
//                   <button
//                     onClick={() => navigate("/resume-builder")}
//                     className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-800 transition"
//                   >
//                     <FileText className="h-4 w-4 mr-2" />
//                     Build Resume
//                   </button>
//                   <button
//                     onClick={() => navigate("/cover-letter")}
//                     className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-800 transition"
//                   >
//                     <FileEdit className="h-4 w-4 mr-2" />
//                     Cover Letter
//                   </button>
//                   <button
//                     onClick={() => navigate("/interview-prep")}
//                     className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-800 transition"
//                   >
//                     <BadgeCheck className="h-4 w-4 mr-2" />
//                     Interview Prep
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {isAuthenticated ? (
//             <AuthButtons
//               showDropdown={showDropdown}
//               setShowDropdown={setShowDropdown}
//               handleDashboard={handleDashboard}
//               handleLogout={handleLogout}
//               getInitial={getInitial}
//               dropdownRef={dropdownRef}
//             />
//           ) : (
//             <button
//               onClick={() => navigate("/auth")}
//               className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition"
//             >
//               Login
//             </button>
//           )}
//         </div>

//         {/* Mobile Menu */}
//         <div className="md:hidden">
//           <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
//             {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Dropdown (optional simplified version) */}
//       {isOpen && (
//         <div className="flex flex-col px-6 pb-4 space-y-3 bg-black/80 backdrop-blur-md md:hidden">
//           {menuItems.map((item) => (
//             <ScrollLink
//               key={item.name}
//               to={item.to}
//               smooth={true}
//               duration={500}
//               onClick={() => setIsOpen(false)}
//               className="text-gray-300 hover:text-white text-base font-medium cursor-pointer"
//             >
//               {item.name}
//             </ScrollLink>
//           ))}

//           {isAuthenticated && (
//             <>
//               <button
//                 onClick={() => {
//                   navigate("/resume-builder");
//                   setIsOpen(false);
//                 }}
//                 className="flex items-center w-full px-2 py-2 text-sm text-white hover:bg-white/10 rounded"
//               >
//                 <FileText className="h-4 w-4 mr-2" />
//                 Build Resume
//               </button>
//               <button
//                 onClick={() => {
//                   navigate("/cover-letter");
//                   setIsOpen(false);
//                 }}
//                 className="flex items-center w-full px-2 py-2 text-sm text-white hover:bg-white/10 rounded"
//               >
//                 <FileEdit className="h-4 w-4 mr-2" />
//                 Cover Letter
//               </button>
//               <button
//                 onClick={() => {
//                   navigate("/interview-prep");
//                   setIsOpen(false);
//                 }}
//                 className="flex items-center w-full px-2 py-2 text-sm text-white hover:bg-white/10 rounded"
//               >
//                 <BadgeCheck className="h-4 w-4 mr-2" />
//                 Interview Prep
//               </button>
//             </>
//           )}

//           {isAuthenticated ? (
//             <div className="mt-4">
//               <button
//                 onClick={() => {
//                   handleDashboard();
//                   setIsOpen(false);
//                 }}
//                 className="flex items-center w-full px-2 py-2 text-sm text-white hover:bg-white/10 rounded"
//               >
//                 <User className="h-4 w-4 mr-2" />
//                 Dashboard
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center w-full px-2 py-2 text-sm text-red-400 hover:bg-white/10 rounded"
//               >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => {
//                 navigate("/auth");
//                 setIsOpen(false);
//               }}
//               className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition mt-3"
//             >
//               Login
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

// // ----------------------------

// interface AuthButtonsProps {
//   showDropdown: boolean;
//   setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
//   handleDashboard: () => void;
//   handleLogout: () => void;
//   getInitial: () => string;
//   dropdownRef: React.RefObject<HTMLDivElement>;
// }

// const AuthButtons = ({
//   showDropdown,
//   setShowDropdown,
//   handleDashboard,
//   handleLogout,
//   getInitial,
//   dropdownRef,
// }: AuthButtonsProps) => {
//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setShowDropdown(!showDropdown)}
//         className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-600 text-white text-lg font-bold hover:bg-purple-700 transition-transform transform hover:scale-105"
//       >
//         {getInitial()}
//       </button>

//       {showDropdown && (
//         <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
//           <button
//             onClick={handleDashboard}
//             className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           >
//             <User className="h-4 w-4 mr-2" />
//             Dashboard
//           </button>
//           <button
//             onClick={handleLogout}
//             className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//           >
//             <LogOut className="h-4 w-4 mr-2" />
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };




import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import videoSrc from "./assets/0_Business Meeting_Presentation_3840x2160.mp4";

const IntroPage: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black text-white px-10 relative overflow-hidden">
      {/* Animated Star Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black z-0">
        <div className="stars"></div>
      </div>

      {/* Left Side */}
      <div className="w-1/2 space-y-6 z-10">
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-600">Welcome to Technoverse</h1>
        <p className="text-xl text-gray-400">Join our innovative coding community where we transform ideas into reality through technology and creativity.</p>
        {/* Social Media Icons */}
        <div className="flex space-x-6 mt-4">
          {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
            <Icon
              key={index}
              className="text-3xl cursor-pointer transition transform hover:scale-125 hover:text-blue-500"
            />
          ))}
        </div>
      </div>

      {/* Right Side - Video */}
      <div className="w-1/2 flex justify-center z-10">
        <video
          autoPlay
          loop
          muted
          className="object-cover w-full h-full rounded-lg shadow-xl">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default IntroPage;

























// import React from "react";
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
// // Import video directly using the import statement
// import videoSrc from "./assets/0_Business Meeting_Presentation_3840x2160.mp4";

// const IntroPage: React.FC = () => {
//   return (
//     <div className="h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black text-white px-10 relative overflow-hidden">
//       {/* Left Side */}
//       <div className="w-1/2 space-y-6 z-10">
//         <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-600">Welcome to Technoverse</h1>
//         <p className="text-xl text-gray-400">Join our innovative coding community where we transform ideas into reality through technology and creativity.</p>
//         {/* Social Media Icons */}
//         <div className="flex space-x-6 mt-4">
//           {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
//             <Icon
//               key={index}
//               className="text-3xl cursor-pointer transition transform hover:scale-125 hover:text-blue-500"
//             />
//           ))}
//         </div>
//       </div>

//       {/* Right Side - Video */}
//       <div className="w-1/2 flex justify-center z-10">
//         <video
//           autoPlay
//           loop
//           muted
//           className="object-cover w-full h-full rounded-lg shadow-xl"
//         >
//           <source src={videoSrc} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     </div>
//   );
// };

// export default IntroPage;
