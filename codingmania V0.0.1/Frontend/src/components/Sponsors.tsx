import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { Sparkles } from "lucide-react";

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website: string;
}

// Ensure the URL has a protocol so it opens as an absolute link, not a relative path
const normalizeUrl = (url: string) => {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/sponsors/get-sponsors`);
        setSponsors(response.data);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen relative overflow-hidden font-sans selection:bg-red-500/30 selection:text-white pt-32 pb-20">
      
      {/* Background Volumetric Lights and Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 w-full h-full pointer-events-none z-0">
        <div className="volumetric-light-red"></div>
        <div className="volumetric-light-secondary opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-block px-5 py-2 bg-red-500/10 rounded-full border border-red-500/50 mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <span className="text-red-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
              <Sparkles size={16} />
              Our Partners
            </span>
          </div>
          <h2 className="text-2xl sm:text-2xl md:text-4xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl">
            Sponsors
          </h2>
          <p className="text-lg sm:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Proud to be supported by industry leaders in technology.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-8 rounded-full opacity-80"></div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="h-24 mb-4 bg-white/5 animate-pulse rounded-lg"></div>
                <div className="h-5 w-3/4 bg-white/5 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : sponsors.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="sponsor-marquee-mask relative w-full overflow-hidden py-4"
          >
            {/* Duplicate the list so the loop is seamless */}
            <div className="sponsor-marquee">
              {[...sponsors, ...sponsors].map((sponsor, index) => (
                <a
                  key={`${sponsor.id}-${index}`}
                  href={normalizeUrl(sponsor.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-panel rounded-2xl p-6 mx-3 w-56 shrink-0 flex flex-col items-center justify-center border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform hover:scale-[1.05] hover:shadow-[0_15px_30px_rgba(220,38,38,0.2)] transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-full h-24 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className="relative w-full h-full object-contain transition-all duration-300"
                    />
                  </div>
                  <div className="text-center relative">
                    <h3 className="text-base font-semibold text-white group-hover:text-shadow-glow transition-all">
                      {sponsor.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Sparkles className="h-10 w-10 text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg">No sponsors yet.</p>
            <p className="text-gray-600 text-sm mt-2">Check back soon for our partners!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sponsors;
