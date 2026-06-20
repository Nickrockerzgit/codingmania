import authIllustration from "../../assets/image.png";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, X, Mail, Loader2, Camera, Upload } from "lucide-react";
import { useAuth } from "../AuthContext";

const AlumniAuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    company: "",
    position: "",
    batch: "",
    branch: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
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
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      company: "",
      position: "",
      batch: "",
      branch: "",
    });
    setAvatar(null);
    setAvatarPreview("");
    setOtp("");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, WebP allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = isSignUp
        ? `${import.meta.env.VITE_API_BASE_URL}/auth/alumni/signup/send-otp`
        : `${import.meta.env.VITE_API_BASE_URL}/auth/alumni/login/send-otp`;
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
      let url: string;
      let response: any;

      if (isSignUp && avatar) {
        url = `${import.meta.env.VITE_API_BASE_URL}/auth/alumni/signup/verify-otp-with-avatar`;
        const formDataPayload = new FormData();
        formDataPayload.append("name", formData.name);
        formDataPayload.append("email", formData.email);
        formDataPayload.append("phone", formData.phone);
        formDataPayload.append("password", formData.password);
        formDataPayload.append("company", formData.company);
        formDataPayload.append("position", formData.position);
        formDataPayload.append("batch", formData.batch);
        formDataPayload.append("branch", formData.branch);
        formDataPayload.append("otp", otp);
        formDataPayload.append("avatar", avatar);

        response = await axios.post(url, formDataPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        url = isSignUp
          ? `${import.meta.env.VITE_API_BASE_URL}/auth/alumni/signup/verify-otp`
          : `${import.meta.env.VITE_API_BASE_URL}/auth/alumni/login/verify-otp`;
        response = await axios.post(url, { ...formData, otp });
      }

      const { data } = response;
      toast.success(data.message);

      login(
        {
          name: formData.name || formData.email.split("@")[0],
          email: formData.email,
          avatar: data.avatar || "",
          role: 'alumni',
        },
        data.token
      );

      navigate("/login/alumni/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const url = isSignUp
        ? `${import.meta.env.VITE_API_BASE_URL}/auth/alumni/signup/send-otp`
        : `${import.meta.env.VITE_API_BASE_URL}/auth/alumni/login/send-otp`;
      await axios.post(url, formData);
      toast.success("OTP resent!");
      setTimer(30);
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-red-600/8 rounded-full blur-[120px]"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-15%] left-[-15%] w-96 h-96 bg-red-900/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        className="w-full max-w-5xl bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid md:grid-cols-2 min-h-[650px] relative">
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
              <div className="h-full w-full bg-gradient-to-br from-red-950/40 to-orange-950/40 flex items-center justify-center p-8">
                <img
                  src={authIllustration}
                  alt="Authentication Illustration"
                  className="max-h-[85%] w-auto object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className={`p-8 md:p-12 flex flex-col justify-center ${isSignUp ? "md:order-2" : "md:order-1"}`}>
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
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {isSignUp ? "Alumni Registration" : "Alumni Login"}
                      </h1>
                      <p className="text-gray-400">
                        {isSignUp
                          ? "Connect with your alma mater community"
                          : "Welcome back, alumni!"}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {isSignUp && (
                        <>
                          <div className="flex flex-col items-center">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Photo</label>
                            <div className="relative group">
                              {avatarPreview ? (
                                <img
                                  src={avatarPreview}
                                  alt="Profile preview"
                                  className="w-24 h-24 rounded-full object-cover border-4 border-red-500 shadow-lg"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-white/5 border-4 border-dashed border-white/10 flex items-center justify-center">
                                  <Camera className="w-8 h-8 text-gray-400" />
                                </div>
                                                      )}
                              <label className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 shadow-lg transition-all">
                                {avatarPreview ? (
                                  <X className="w-4 h-4" onClick={handleRemoveAvatar} />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/jpeg,image/png,image/gif,image/webp"
                                  onChange={handleAvatarChange}
                                                        />
                                                      </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {avatar ? avatar.name : "Upload your photo (optional)"}
                            </p>
                          </div>
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
                          <div className="grid grid-cols-2 gap-4">
                            <FloatingInput
                              label="Batch Year"
                              type="text"
                              name="batch"
                              value={formData.batch}
                              onChange={handleChange}
                              placeholder="e.g. 2024"
                            />
                            <div className="space-y-1.5">
                              <label className="block text-sm font-medium text-gray-300">Branch</label>
                              <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                              >
                                <option value="">Select Branch</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="ECE">ECE</option>
                                <option value="EE">EE</option>
                                <option value="ME">ME</option>
                                <option value="CE">CE</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                          <FloatingInput
                            label="Current Company"
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Company name"
                          />
                          <FloatingInput
                            label="Current Position"
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            placeholder="Your job role"
                          />
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
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-red-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" />
                            Sending OTP...
                          </span>
                        ) : (isSignUp ? "Send OTP to Sign Up" : "Send OTP to Login")}
                      </motion.button>
                    </form>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
                      <p className="text-gray-400">
                        Enter the 6-digit code sent to <br />
                        <span className="font-medium text-white">{formData.email}</span>
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-5">
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
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-red-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isVerifying ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" />
                            Verifying...
                          </span>
                        ) : "Verify & Continue"}
                      </motion.button>
                    </form>

                    <div className="text-center">
                      {timer > 0 ? (
                        <p className="text-gray-400">
                          Resend in <span className="text-red-400 font-medium">{timer}s</span>
                        </p>
                      ) : (
                        <button
                          onClick={handleResendOtp}
                          className="text-red-400 hover:text-red-300 underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="text-center mt-8 text-gray-400 text-sm">
              {isSignUp ? "Already an alumni?" : "New to our community?"}{" "}
              <button
                onClick={toggleForm}
                className="text-red-400 hover:text-red-300 font-medium underline"
              >
                {isSignUp ? "Sign In" : "Register"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

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
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
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
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-300">Password</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 pr-12 transition-all"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
);

export default AlumniAuthPage;