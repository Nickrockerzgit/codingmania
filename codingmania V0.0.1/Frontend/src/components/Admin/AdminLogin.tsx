
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import NET from "vanta/dist/vanta.net.min";
// import * as THREE from "three";

// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const vantaRef = useRef(null);

//   useEffect(() => {
//     const vantaEffect = NET({
//       el: vantaRef.current,
//       THREE: THREE,
//       color: 0x6a0dad, 
//       backgroundColor: 0x111827, 
//       maxDistance: 20.0,
//       spacing: 15.0,
//     });

//     return () => {
//       if (vantaEffect) vantaEffect.destroy();
//     };
//   }, []);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (email === "rishabhjhade060@gmail.com" && password === "Rishabh@2005") {
//       localStorage.setItem("isAdminAuthenticated", "true");
//       navigate("/admin");
//     } else {
//       alert("Invalid Credentials!");
//     }
//   };

//   return (
//     <div ref={vantaRef} className="flex justify-center items-center h-screen">
//       <div className="p-8 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg z-10">
//         <h2 className="text-white text-2xl mb-4">Admin Login</h2>
//         <form onSubmit={handleLogin}>
//           <input
//             type="email"
//             placeholder="Admin Email"
//             className="w-full p-2 mb-4 rounded"
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full p-2 mb-4 rounded"
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button className="w-full bg-purple-500 text-white py-2 rounded">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;













import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "rishabhjhade060@gmail.com" && password === "Rishabh@2005") {
      localStorage.setItem("isAdminAuthenticated", "true");
      navigate("/admin");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] p-4 overflow-hidden">
      {/* Ambient red glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-red-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-red-600/10 blur-[120px]" />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-sm text-gray-400 mt-1">Sign in to manage CodingMania</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="admin@codingmania.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-red-900/30"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
