// import  { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft, Shield, Mail, Lock } from 'lucide-react';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('admin@technoverse.com');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle form submission here
//     console.log('Login attempted with:', { email, password });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800 relative overflow-hidden">
//       {/* Background decoration */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
//         <div className="absolute top-40 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
//       </div>
      
//       {/* Back to Home button */}
//       <div className="absolute top-6 left-6 z-50">
//         <Link 
//           to="/" 
//           className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group"
//         >
//           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
//           <span>Back to Home</span>
//         </Link>
//       </div>
      
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
//         <div className="w-full max-w-md">
//           <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
//             <div className="text-center mb-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl mb-4">
//                 <Shield className="w-8 h-8 text-white" />
//               </div>
//               <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
//               <p className="text-white/60">Enter your credentials to continue</p>
//             </div>
            
//             <div className="space-y-6">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
//                   <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
//                     placeholder="admin@technoverse.com"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
//                   <input
//                     type="password"
//                     id="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
//                     placeholder="••••••••"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <button
//                 type="submit"
//                 className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent"
//               >
//                 Send OTP
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;









import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Shield, Mail, Lock, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "./AuthContext"; 

const SUPER_ADMIN_EMAIL = "lancer969976@gmail.com";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resendTimer > 0 || isLoading) return;
    
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/admin/login/send-otp`, { email });
      setOtpSent(true);
      setError("");
      toast.success("OTP sent to your email!");
      
      // Start countdown timer (30 seconds)
      setResendTimer(30);
      const interval = setInterval(() => {
        setResendTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError("Please wait before requesting another OTP");
        toast.error("Please wait before requesting another OTP");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError("Failed to send OTP. Try again.");
        toast.error("Failed to send OTP!");
      }
    } finally {
      setIsLoading(false);
    }
  };




const handleVerifyOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsVerifying(true);
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/admin/login/verify-otp`, { email, otp });
    
    if (res.data.token) {
      setError("");
      toast.success("Login successful!");

      if (res.data.isSuperAdmin || email === SUPER_ADMIN_EMAIL) {
        localStorage.setItem("isSuperAdmin", "true");
      } else {
        localStorage.removeItem("isSuperAdmin");
      }

      login(email, res.data.token);
      navigate("/admin");
    } else {
      setError("Invalid OTP. Please try again.");
      toast.error("Invalid OTP.");
    }
  } catch (err: any) {
    const message = err.response?.data?.message || "OTP verification failed.";
    setError(message);
    toast.error(message);
  } finally {
    setIsVerifying(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800 relative overflow-hidden">
      {/* Background + Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link to="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Admin Login</h2>
              <p className="text-white/60">Enter your credentials to continue</p>
            </div>

            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple/40" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40"
                    placeholder="Enter admin email"
                    required
                  />
                </div>
              </div>

              {!otpSent && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple/40" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-white/80 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!otpSent ? (resendTimer > 0 || isLoading) : isVerifying}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {otpSent ? (isVerifying ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Verifying...</span> : "Verify OTP") : isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Sending...</span> : (resendTimer > 0 ? `Wait ${resendTimer}s` : "Send OTP")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
