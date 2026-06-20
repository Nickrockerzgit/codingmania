import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#050505] min-h-screen relative overflow-hidden font-sans selection:bg-red-500/30 selection:text-white flex items-center justify-center px-6">

      {/* Background Volumetric Lights and Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 w-full h-full pointer-events-none z-0">
        <div className="volumetric-light-red"></div>
        <div className="volumetric-light-secondary opacity-50"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        {/* Badge */}
        <div className="inline-block px-5 py-2 bg-red-500/10 rounded-full border border-red-500/50 mb-8 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
          <span className="text-red-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
            <Sparkles size={16} />
            Stay Tuned
          </span>
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold text-metallic mb-8 tracking-tighter drop-shadow-2xl leading-none">
          Coming Soon
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
          We are crafting something amazing for you. This page is under construction — check back soon!
        </p>

        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-10 rounded-full opacity-80"></div>

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="group mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}

export default ComingSoon;
