import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";

interface RollNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: string) => void;
}

const RollNumberModal = ({ isOpen, onClose, onSuccess }: RollNumberModalProps) => {
  const { token, updateUser } = useAuth();
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/set-roll`,
        { rollNumber: rollNumber.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      updateUser({
        role: data.role,
        appliedRole: data.appliedRole,
        applicationStatus: data.applicationStatus,
      });
      onSuccess(data.role);
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not verify your enrollment number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-sm p-6 relative shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-red-400" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Enter Enrollment Number</h3>
            <p className="text-sm text-gray-400 mb-5">
              We use your college roll number to set up your student or alumni dashboard.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 0967CS221060"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading || !rollNumber.trim()}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Continue to Dashboard"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RollNumberModal;
