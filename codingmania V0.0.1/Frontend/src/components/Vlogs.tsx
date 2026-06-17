import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Play, ThumbsUp, X, Eye, Video } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Vlog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  video_url: string;
  duration: string;
  views: number;
  likes: number;
}

const Vlogs = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [selectedVlog, setSelectedVlog] = useState<Vlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchVlogs();
  }, []);

  const fetchVlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vlogs/get-vlogs`);
      setVlogs(response.data);
    } catch (err) {
      console.error('Error fetching vlogs:', err);
      setError('Failed to load vlogs. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (vlogId: number) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/vlogs/like-vlog/${vlogId}`);
      fetchVlogs();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handlePlay = async (vlog: Vlog) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/vlogs/increment-views/${vlog.id}`);
      setSelectedVlog(vlog);
      fetchVlogs();
    } catch (error) {
      console.error('View increment error:', error);
    }
  };

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
          className="text-center mb-20 md:mb-28"
        >
          <div className="inline-block px-5 py-2 bg-red-500/10 rounded-full border border-red-500/50 mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <span className="text-red-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
              <Video size={16} />
              Watch & Learn
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl">
            Vlogs
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Watch our educational content and stay updated with the latest in technology.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-8 rounded-full opacity-80"></div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-panel rounded-2xl overflow-hidden border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="h-44 bg-white/5 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse"></div>
                  <div className="h-4 w-1/3 bg-white/5 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchVlogs} 
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              Retry
            </button>
          </div>
        ) : vlogs.length === 0 ? (
          <div className="text-center py-20">
            <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No vlogs available yet.</p>
            <p className="text-gray-600 text-sm mt-2">Check back soon for new content!</p>
          </div>
        ) : (
          <>
            {/* Modal / Dialog */}
            {selectedVlog && (
              <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#050505] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                >
                  <button
                    onClick={() => setSelectedVlog(null)}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white bg-black/50 p-2 rounded-full hover:bg-red-500/20 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <div className="relative">
                    <video
                      controls
                      autoPlay
                      className="w-full aspect-video"
                      onError={(e) => console.error('Video play error:', e)}
                    >
                      <source src={selectedVlog.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">{selectedVlog.title}</h3>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-red-500" />
                        {selectedVlog.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-red-500" />
                        {selectedVlog.likes} likes
                      </span>
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                        {selectedVlog.duration}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedVlog.content || 'No detailed content available.'}
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Vlogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(showAll ? vlogs : vlogs.slice(0, 8)).map((vlog, index) => (
                <motion.div
                  key={vlog.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handlePlay(vlog)}
                  className="group cursor-pointer glass-panel rounded-2xl overflow-hidden border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(220,38,38,0.2)] transition-all duration-300 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <img
                      src={vlog.thumbnail_url}
                      alt={vlog.title}
                      className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent"></div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(vlog);
                      }}
                      className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    </button>
                    
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                      {vlog.duration}
                    </div>
                  </div>

                  <div className="p-4 relative">
                    <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-shadow-glow transition-all">
                      {vlog.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {vlog.excerpt || 'No excerpt available'}
                    </p>

                    <div className="flex items-center justify-between text-gray-500 text-xs pt-3 border-t border-white/10">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-red-500" />
                        {vlog.views.toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(vlog.id);
                        }}
                        className="flex items-center gap-1 hover:text-red-400 transition-colors"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{vlog.likes}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {vlogs.length > 8 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={inView ? { opacity: 1 } : {}} 
                transition={{ duration: 0.8, delay: 0.5 }} 
                className="text-center mt-12"
              >
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 px-6 py-3 glass-panel rounded-full text-gray-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 hover:scale-105 transition-all border border-white/10"
                >
                  {showAll ? 'Show Less' : 'View More Vlogs'}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Vlogs;
