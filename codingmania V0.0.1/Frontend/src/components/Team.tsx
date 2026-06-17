import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Users } from 'lucide-react';
import axios from 'axios';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  github: string;
  linkedin: string;
}

const Team = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/team/get-team-members`);
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
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
          className="text-center mb-20 md:mb-28"
        >
          <div className="inline-block px-5 py-2 bg-red-500/10 rounded-full border border-red-500/50 mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <span className="text-red-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
              <Users size={16} />
              Meet Our Team
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl">
            The Team
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Meet the passionate individuals behind Technoverse who make it all possible.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-8 rounded-full opacity-80"></div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="glass-panel rounded-3xl p-8 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="relative mb-6 mx-auto w-40 h-40">
                  <div className="rounded-full w-full h-full bg-white/5 animate-pulse"></div>
                </div>
                <div className="h-8 w-48 bg-white/5 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-5 w-32 bg-white/5 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No team members found.</p>
          </div>
        ) : (
          <>
            {/* President and Vice President - Top Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
              {teamMembers.slice(0, 2).map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group glass-panel rounded-3xl p-8 text-center border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="relative mb-6 mx-auto w-40 h-40">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500/30 to-orange-500/30 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="relative rounded-full w-full h-full object-cover border-2 border-white/10 group-hover:border-red-500/40 transition-all duration-300"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-shadow-glow transition-all">{member.name}</h3>
                    <p className="text-red-400 mb-4 font-medium">{member.role}</p>
                    <div className="flex justify-center space-x-4">
                      <a 
                        href={member.github} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 glass-panel rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/20 hover:border-red-500/40 hover:scale-110 transition-all duration-300"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a 
                        href={member.linkedin} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 glass-panel rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/20 hover:border-red-500/40 hover:scale-110 transition-all duration-300"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Other Team Members - Bottom Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {teamMembers.slice(2).map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: (index + 2) * 0.1 }}
                  className="group glass-panel rounded-2xl p-4 sm:p-6 text-center border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(220,38,38,0.2)] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="relative mb-4 mx-auto w-20 h-20 sm:w-24 sm:h-24">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500/20 to-orange-500/20 blur-lg group-hover:blur-xl transition-all duration-300"></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="relative rounded-full w-full h-full object-cover border-2 border-white/10 group-hover:border-red-500/40 transition-all duration-300"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1 group-hover:text-shadow-glow transition-all">{member.name}</h3>
                    <p className="text-red-400 mb-3 text-xs">{member.role}</p>
                    <div className="flex justify-center space-x-3">
                      <a 
                        href={member.github} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                      <a 
                        href={member.linkedin} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Team;
