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

  // Glass card — circular photo (red ring), name, role, social icons, red bottom glow
  const renderCard = (member: TeamMember, index: number, extraClass = '') => (
    <motion.div
      key={member.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className={`group relative rounded-[1.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-md flex flex-col overflow-hidden transition-all duration-300 hover:border-red-500/40 hover:bg-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${extraClass}`}
    >
      {/* Red glow at the bottom edge */}
      <div className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-red-600/40 blur-2xl rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent z-10"></div>

      {/* Photo — full card width box at the top */}
      <div className="relative w-full aspect-[4/3] overflow-hidden border-b-2 border-red-500/60">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Details */}
      <div className="relative flex flex-col items-center text-center px-3 py-5">
        <h3 className="text-white font-bold text-base sm:text-lg leading-tight">{member.name}</h3>
        <p className="text-red-500 text-xs sm:text-sm font-medium mt-1">{member.role}</p>

        <div className="flex gap-3 mt-4">
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] border border-white/10 text-white hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] border border-white/10 text-white hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-[#050505] min-h-screen relative overflow-hidden font-sans selection:bg-red-500/30 selection:text-white pt-20 pb-8">
      
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
            <span className="text-red-500 text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              Our Team
              <Users size={16} />
            </span>
          </div>
         <h2 className="text-2xl sm:text-2xl md:text-4xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl">
            Our Team
          </h2>
        <p className="text-lg sm:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
             Meet the passionate individuals behind Technoverse who make it all possible.
          </p>
          
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 sm:gap-5 max-w-7xl mx-auto items-start">
            {[3, 1, 2, 0, 4, 5, 6].map((memberIdx, pos) => {
              const member = teamMembers[memberIdx];
              if (!member) return null;
              return renderCard(
                member,
                pos,
                ['xl:mt-0', 'xl:mt-10', 'xl:mt-20', 'xl:mt-28', 'xl:mt-20', 'xl:mt-10', 'xl:mt-0'][pos] || ''
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
