import { motion, AnimatePresence } from "framer-motion";
import { X, Map } from "lucide-react";

interface RoadmapsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoadmapsModal({ isOpen, onClose }: RoadmapsModalProps) {
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
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl w-full max-w-md border border-purple-500/30 relative overflow-hidden">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-white/70 hover:text-white z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Map className="w-10 h-10 text-purple-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">Roadmaps</h2>
                
                <div className="inline-block px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full mb-6">
                  <span className="text-amber-400 font-medium">Coming Soon</span>
                </div>

                <p className="text-white/60 mb-6">
                  We're working on creating personalized learning roadmaps to help you navigate your career journey. Stay tuned!
                </p>

                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/50 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}