
// //after google auth code 
// import { useState, useEffect, SetStateAction } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { Eye, EyeOff, X, Mail } from "lucide-react";
// import { useAuth } from "./AuthContext";
// import GoogleSignIn from "./GoogleSignIn";

// const AuthPage = () => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [step, setStep] = useState<"form" | "otp">("form");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", rollNumber: "" });
//   const [otp, setOtp] = useState("");
//   const [timer, setTimer] = useState(30);
//   const [forgotPasswordData, setForgotPasswordData] = useState({ email: "", newPassword: "" });
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   useEffect(() => {
//     if (step === "otp" && timer > 0) {
//       const interval = setInterval(() => setTimer((t) => t - 1), 1000);
//       return () => clearInterval(interval);
//     }
//   }, [step, timer]);

//   const toggleForm = () => {
//     setIsSignUp((prev) => !prev);
//     setStep("form");
//     setFormData({ name: "", email: "", phone: "", password: "", rollNumber: "" });
//     setOtp("");
//   };

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleChange = (e: { target: { name: any; value: any; }; }) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleForgotPasswordChange = (e: { target: { name: any; value: any; }; }) => {
//     setForgotPasswordData({ ...forgotPasswordData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     try {
//       const url = isSignUp
//         ? "${import.meta.env.vite_api_base_url}/auth/signup/send-otp"
//         : "${import.meta.env.vite_api_base_url}/auth/login/send-otp";
//       await axios.post(url, formData);
//       toast.success("OTP sent to your email");
//       setStep("otp");
//       setTimer(30);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   const handleVerifyOtp = async (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     try {
//       const url = isSignUp
//         ? "${import.meta.env.vite_api_base_url}/auth/signup/verify-otp"
//         : "${import.meta.env.vite_api_base_url}/auth/login/verify-otp";
//       const { data } = await axios.post(url, { ...formData, otp });
//       toast.success(data.message);

//       login(
//         {
//           name: formData.name || formData.email.split("@")[0],
//           email: formData.email,
//         },
//         data.token
//       );

//       setFormData({ name: "", email: "", phone: "", password: "", rollNumber: "" });
//       setOtp("");
//       navigate("/joinus");
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Invalid or expired OTP");
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       const url = isSignUp
//         ? "${import.meta.env.vite_api_base_url}/auth/signup/send-otp"
//         : "${import.meta.env.vite_api_base_url}/auth/login/send-otp";
//       await axios.post(url, formData);
//       toast.success("OTP resent to your email");
//       setTimer(30);
//     } catch (err) {
//       toast.error("Failed to resend OTP");
//     }
//   };

//   const handleForgotPassword = async (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     try {
//       await axios.post("${import.meta.env.vite_api_base_url}/auth/forgot-password", forgotPasswordData);
//       toast.success("Password updated successfully!");
//       setShowForgotPassword(false);
//       setForgotPasswordData({ email: "", newPassword: "" });
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to update password");
//     }
//   };

//   const handleGoogleSuccess = (userData: any, token: string) => {
//     login(userData, token);
//     navigate("/joinus");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
//       {/* Gradient Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-blue-800"></div>
//       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-blue-500/20"></div>
      
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       <motion.div
//         className="w-[90%] max-w-sm bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl z-10 relative mt-14"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Welcome Message */}
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">
//             {step === "form" 
//               ? (isSignUp ? "Create an Account" : "Welcome Back") 
//               : "Verify Your Email"
//             }
//           </h1>
//           <p className="text-gray-600">
//             {step === "form" 
//               ? (isSignUp 
//                   ? "Join Technoverse and start your journey" 
//                   : "Sign in to continue to your account"
//                 ) 
//               : "Enter the OTP sent to your email"
//             }
//           </p>
//         </div>

//         {step === "form" ? (
//           <>
//             <form onSubmit={handleSubmit} className="space-y-1">
//               {isSignUp && (
//                 <>
//                   <FloatingInput 
//                     label="Full Name" 
//                     type="text" 
//                     id="name" 
//                     name="name" 
//                     value={formData.name} 
//                     onChange={handleChange} 
//                     placeholder="Enter your full name" 
//                   />
//                   <FloatingInput 
//                     label="Phone Number" 
//                     type="tel" 
//                     id="phone" 
//                     name="phone" 
//                     value={formData.phone} 
//                     onChange={handleChange} 
//                     placeholder="Enter your phone number" 
//                   />
//                 </>
//               )}
              
//               <FloatingInput 
//                 label="Email" 
//                 type="email" 
//                 id="email" 
//                 name="email" 
//                 value={formData.email} 
//                 onChange={handleChange} 
//                 placeholder="Enter your email" 
//               />
              
//               {isSignUp && (
//                 <PasswordInput 
//                   id="password" 
//                   name="password" 
//                   value={formData.password} 
//                   onChange={handleChange} 
//                   showPassword={showPassword} 
//                   toggleVisibility={togglePasswordVisibility} 
//                 />
//               )}

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg"
//               >
//                 {isSignUp ? "Send OTP to Sign Up" : "Send OTP to Sign In"}
//               </motion.button>
//             </form>

//             {/* Google Sign In */}
//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                 </div>
//               </div>
              
//               <div className="mt-4">
//                 <GoogleSignIn onSuccess={handleGoogleSuccess} />
//               </div>
//             </div>

//             {/* Forgot Password Link */}
//             {!isSignUp && (
//               <div className="text-center mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowForgotPassword(true)}
//                   className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
//                 >
//                   Forgot your password?
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           <form onSubmit={handleVerifyOtp} className="space-y-4">
//             <FloatingInput 
//               label="OTP" 
//               type="text" 
//               id="otp" 
//               name="otp" 
//               value={otp} 
//               onChange={(e: { target: { value: SetStateAction<string>; }; }) => setOtp(e.target.value)} 
//               placeholder="Enter 6-digit OTP" 
//             />

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg"
//             >
//               Verify OTP
//             </motion.button>

//             {timer > 0 ? (
//               <p className="text-center text-sm text-gray-600">
//                 Resend OTP in <span className="font-semibold text-purple-600">{timer}s</span>
//               </p>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 className="text-sm text-purple-600 hover:text-purple-800 hover:underline block mx-auto"
//               >
//                 Resend OTP
//               </button>
//             )}
//           </form>
//         )}

//         <div className="text-center mt-6">
//           <p className="text-sm text-gray-600">
//             {isSignUp ? "Already have an account?" : "Don't have an account?"} {" "}
//             <button 
//               onClick={toggleForm} 
//               className="text-purple-600 hover:text-purple-800 font-semibold hover:underline"
//             >
//               {isSignUp ? "Sign In" : "Sign Up"}
//             </button>
//           </p>
//         </div>
//       </motion.div>

//       {/* Forgot Password Modal */}
//       <AnimatePresence>
//         {showForgotPassword && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 z-50"
//               onClick={() => setShowForgotPassword(false)}
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               className="fixed inset-0 flex items-center justify-center z-50 p-4"
//             >
//               <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
//                 <button
//                   onClick={() => setShowForgotPassword(false)}
//                   className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={20} />
//                 </button>
                
//                 <div className="text-center mb-6">
//                   <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
//                     <Mail className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-800 mb-2">Reset Password</h3>
//                   <p className="text-gray-600">Enter your email and new password</p>
//                 </div>

//                 <form onSubmit={handleForgotPassword} className="space-y-4">
//                   <FloatingInput
//                     label="Email"
//                     type="email"
//                     id="forgot-email"
//                     name="email"
//                     value={forgotPasswordData.email}
//                     onChange={handleForgotPasswordChange}
//                     placeholder="Enter your email"
//                   />
//                   <FloatingInput
//                     label="New Password"
//                     type="password"
//                     id="forgot-password"
//                     name="newPassword"
//                     value={forgotPasswordData.newPassword}
//                     onChange={handleForgotPasswordChange}
//                     placeholder="Enter new password"
//                   />
                  
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="submit"
//                     className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-200"
//                   >
//                     Update Password
//                   </motion.button>
//                 </form>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// interface FloatingInputProps {
//   label: string;
//   type: string;
//   id: string;
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder: string;
// }

// const FloatingInput = ({ label, type, id, name, value, onChange, placeholder }: FloatingInputProps) => (
//   <div className="space-y-1">
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
//     <input 
//       type={type} 
//       id={id} 
//       name={name} 
//       value={value} 
//       onChange={onChange} 
//       placeholder={placeholder} 
//       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
//     />
//   </div>
// );

// interface PasswordInputProps {
//   id: string;
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   showPassword: boolean;
//   toggleVisibility: () => void;
// }

// const PasswordInput = ({ id, name, value, onChange, showPassword, toggleVisibility }: PasswordInputProps) => (
//   <div className="space-y-1">
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700">Password</label>
//     <div className="relative">
//       <input
//         type={showPassword ? "text" : "password"}
//         id={id}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder="Enter your password"
//         className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
//       />
//       <button
//         type="button"
//         onClick={toggleVisibility}
//         className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
//       >
//         {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//       </button>
//     </div>
//   </div>
// );

// export default AuthPage;
















import authIllustration from "../assets/image.png"; // ← your image here


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, X, Mail, Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import GoogleSignIn from "./GoogleSignIn";

// Import your image (adjust path as needed)

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", rollNumber: "" });
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: "", newPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setStep("form");
    setFormData({ name: "", email: "", phone: "", password: "", rollNumber: "" });
    setOtp("");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotPasswordData({ ...forgotPasswordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = isSignUp
        ? `${import.meta.env.VITE_API_BASE_URL}/auth/signup/send-otp`
        : `${import.meta.env.VITE_API_BASE_URL}/auth/login/send-otp`;
      await axios.post(url, formData);
      toast.success("OTP sent to your email");
      setStep("otp");
      setTimer(30);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const url = isSignUp
        ? `${import.meta.env.VITE_API_BASE_URL}/auth/signup/verify-otp`
        : `${import.meta.env.VITE_API_BASE_URL}/auth/login/verify-otp`;
      const { data } = await axios.post(url, { ...formData, otp });
      toast.success(data.message);

      login(
        {
          name: formData.name || formData.email.split("@")[0],
          email: formData.email,
          role: data.role,
          appliedRole: data.appliedRole,
          applicationStatus: data.applicationStatus,
        },
        data.token
      );

      // Auto-route to the right dashboard based on the role derived from the roll number
      const effectiveRole = data.role || data.appliedRole;
      if (effectiveRole === "alumni") {
        navigate("/login/alumni/dashboard");
      } else if (effectiveRole === "student") {
        navigate("/login/student/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const url = isSignUp
        ? `${import.meta.env.VITE_API_BASE_URL}/auth/signup/send-otp`
        : `${import.meta.env.VITE_API_BASE_URL}/auth/login/send-otp`;
      await axios.post(url, formData);
      toast.success("OTP resent!");
      setTimer(30);
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, forgotPasswordData);
      toast.success("Password updated successfully!");
      setShowForgotPassword(false);
      setForgotPasswordData({ email: "", newPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleGoogleSuccess = (userData: any, token: string) => {
    login(userData, token);
    navigate("/");
  };

  // Animation variants for card switch
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const formVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: 30, opacity: 0, transition: { duration: 0.4 } },
  };

  const imageVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: -30, opacity: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden relative py-16">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Volumetric lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-[120px]"></div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-15%] left-[-15%] w-96 h-96 bg-orange-900/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        className="w-full max-w-3xl bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 h-auto mt-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid md:grid-cols-2 gap-0 relative">
          {/* Image Side - changes position based on isSignUp */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup-image" : "login-image"}
              variants={isSignUp ? imageVariants : formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`hidden md:block absolute md:static inset-0 md:inset-auto ${
                isSignUp ? "md:order-1" : "md:order-2"
              }`}
            >
              <div className="h-full w-full bg-gradient-to-br from-red-950/40 to-orange-950/40 flex items-center justify-center p-4">
                <img
                  src={authIllustration}
                  alt="Authentication Illustration"
                  className="max-h-[85%] w-auto object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Form Side */}
          <div className={`p-6 md:p-8 flex flex-col justify-center ${isSignUp ? "md:order-2" : "md:order-1"}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {step === "form" ? (
                  <>
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-white mb-1">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                      </h1>
                      <p className="text-sm text-gray-400">
                        {isSignUp
                          ? "Join Technoverse and start learning today"
                          : "Sign in to continue your journey"}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      {isSignUp && (
                        <>
                          <FloatingInput
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                          />
                          <FloatingInput
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                          />
                          <FloatingInput
                            label="College Roll Number"
                            type="text"
                            name="rollNumber"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            placeholder="e.g. 0967CS221060"
                          />
                          <p className="text-xs text-gray-500 -mt-1 px-1">
                            We use your enrollment number to set up your student or alumni profile.
                          </p>
                        </>
                      )}

                      <FloatingInput
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />

                      {isSignUp && (
                        <PasswordInput
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          showPassword={showPassword}
                          toggleVisibility={togglePasswordVisibility}
                        />
                      )}

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-2 rounded-lg font-semibold text-sm shadow-lg shadow-red-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" />
                            Sending OTP...
                          </span>
                        ) : (isSignUp ? "Send OTP to Sign Up" : "Send OTP to Login")}
                      </motion.button>
                    </form>

                    <div className="mt-4">
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-3 bg-gray-900 text-gray-400 text-xs">Or continue with</span>
                        </div>
                      </div>

                      <GoogleSignIn onSuccess={handleGoogleSuccess} />
                    </div>

                    {!isSignUp && (
                      <div className="text-center mt-3">
                        <button
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-red-400 hover:text-red-300 underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white mb-1">Verify Email</h2>
                      <p className="text-sm text-gray-400">
                        Enter the 6-digit code sent to <br />
                        <span className="font-medium text-white">{formData.email}</span>
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                      <FloatingInput
                        label="OTP Code"
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                      />

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isVerifying}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-2 rounded-lg font-semibold text-sm shadow-lg shadow-red-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isVerifying ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" />
                            Verifying...
                          </span>
                        ) : "Verify & Continue"}
                      </motion.button>
                    </form>

                    <div className="text-center text-xs">
                      {timer > 0 ? (
                        <p className="text-gray-400">
                          Resend in <span className="text-red-400 font-medium">{timer}s</span>
                        </p>
                      ) : (
                        <button
                          onClick={handleResendOtp}
                          className="text-xs text-red-400 hover:text-red-300 underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="text-center mt-4 text-gray-400 text-xs">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={toggleForm}
                className="text-red-400 hover:text-red-300 font-medium underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowForgotPassword(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/10 relative">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-6">
                  <div className="mx-auto w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Reset Password</h3>
                  <p className="text-xs text-gray-400">We'll send instructions to your email</p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <FloatingInput
                    label="Email"
                    type="email"
                    name="email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    placeholder="you@example.com"
                  />
                  <PasswordInput
                    name="newPassword"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                    showPassword={showPassword}
                    toggleVisibility={togglePasswordVisibility}
                  />

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-2 rounded-lg font-semibold text-sm shadow-lg shadow-red-600/20"
                  >
                    Reset Password
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable Input Components (updated for dark theme)
const FloatingInput = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-medium text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
      />
  </div>
);

const PasswordInput = ({
  name,
  value,
  onChange,
  showPassword,
  toggleVisibility,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleVisibility: () => void;
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-medium text-gray-300">Password</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 pr-10 transition-all"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default AuthPage;
