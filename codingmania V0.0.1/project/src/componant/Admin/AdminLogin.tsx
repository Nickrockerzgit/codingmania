
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

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "rishabhjhade060@gmail.com" && password === "Rishabh@2005") {
      localStorage.setItem("isAdminAuthenticated", "true");
      navigate("/admin");
    } else {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-white text-2xl mb-6 text-center">Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
