import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, User, Briefcase } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface ApplyForRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: string) => void;
  userName: string;
  userEmail: string;
}

type Role = "student" | "alumni";

const branches = ["CSE", "ECE", "EE", "ME", "CE", "IT", "MCA", "Other"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const batches = ["2020", "2021", "2022", "2023", "2024", "2025"];

export default function ApplyForRoleModal({ isOpen, onClose, onSuccess, userName, userEmail }: ApplyForRoleModalProps) {
  const [activeTab, setActiveTab] = useState<Role>("student");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [studentData, setStudentData] = useState({
    yearOfStudy: "",
    branch: "",
    collegeName: "",
    githubUrl: "",
    websiteUrl: "",
    bio: "",
  });

  const [alumniData, setAlumniData] = useState({
    company: "",
    position: "",
    batch: "",
    branch: "",
    bio: "",
  });

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleAlumniChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAlumniData({ ...alumniData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      let payload: any = { role: activeTab };

      if (activeTab === "student") {
        payload = { ...payload, ...studentData };
      } else if (activeTab === "alumni") {
        payload = { ...payload, ...alumniData };
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/apply`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Application submitted successfully!");
      onSuccess(activeTab);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "student", label: "Student", icon: User },
    { id: "alumni", label: "Alumni", icon: Briefcase },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl w-full max-w-2xl border border-white/10 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-gray-400 hover:text-white z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
                  <p className="text-gray-400">Select your role and fill in the details</p>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="flex bg-gray-800/50 rounded-xl p-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? "bg-red-600 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <tab.icon size={18} />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {activeTab === "student" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Year of Study</label>
                          <select
                            name="yearOfStudy"
                            value={studentData.yearOfStudy}
                            onChange={handleStudentChange}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                            required
                          >
                            <option value="">Select Year</option>
                            {years.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Branch</label>
                          <select
                            name="branch"
                            value={studentData.branch}
                            onChange={handleStudentChange}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                            required
                          >
                            <option value="">Select Branch</option>
                            {branches.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">College Name</label>
                        <input
                          type="text"
                          name="collegeName"
                          value={studentData.collegeName}
                          onChange={handleStudentChange}
                          placeholder="Enter your college name"
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">GitHub URL (Optional)</label>
                          <input
                            type="url"
                            name="githubUrl"
                            value={studentData.githubUrl}
                            onChange={handleStudentChange}
                            placeholder="https://github.com/username"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Website URL (Optional)</label>
                          <input
                            type="url"
                            name="websiteUrl"
                            value={studentData.websiteUrl}
                            onChange={handleStudentChange}
                            placeholder="https://yourwebsite.com"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
                        <textarea
                          name="bio"
                          value={studentData.bio}
                          onChange={handleStudentChange}
                          placeholder="Tell us about yourself..."
                          rows={3}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "alumni" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Company</label>
                          <input
                            type="text"
                            name="company"
                            value={alumniData.company}
                            onChange={handleAlumniChange}
                            placeholder="Company name"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Position</label>
                          <input
                            type="text"
                            name="position"
                            value={alumniData.position}
                            onChange={handleAlumniChange}
                            placeholder="Your role"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Batch</label>
                          <select
                            name="batch"
                            value={alumniData.batch}
                            onChange={handleAlumniChange}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                            required
                          >
                            <option value="">Select Batch</option>
                            {batches.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Branch</label>
                          <select
                            name="branch"
                            value={alumniData.branch}
                            onChange={handleAlumniChange}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                            required
                          >
                            <option value="">Select Branch</option>
                            {branches.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
                        <textarea
                          name="bio"
                          value={alumniData.bio}
                          onChange={handleAlumniChange}
                          placeholder="Tell us about yourself..."
                          rows={3}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-red-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        Submitting...
                      </span>
                    ) : (
                      `Apply as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
