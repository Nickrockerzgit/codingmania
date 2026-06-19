import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, MapPin, Calendar, Building } from 'lucide-react';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { icon: Users, label: 'Registered Users', value: '500+' },
    { icon: Building, label: 'Community Partners', value: '20+' },
    { icon: MapPin, label: 'Cities', value: '15+' },
    { icon: Calendar, label: 'Events', value: '100+' },
  ];

  return (
    <div className="bg-[#050505] min-h-screen relative overflow-hidden font-sans selection:bg-red-500/30 selection:text-white pt-15 pb-12">
      
      {/* Background Volumetric Lights and Rays */}
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
          className="text-center mb-12 md:mb-12"
        >
          
          <div className="inline-block px-5 py-2 bg-red-500/10 rounded-full border border-red-500/50 mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <span className="text-red-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
              <Users size={16} />
            our story
            </span>
          </div>
          <h2 className="text-2xl sm:text-2xl md:text-4xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl">
            About Technoverse
          </h2>
          <p className="text-lg sm:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Meet the passionate individuals behind Technoverse who make it all possible. A collective of forward-thinkers building the future.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-8 rounded-full opacity-80"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          {/* Left side - Description */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-8"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Who We Are
            </h3>
            <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
              <p>
                Technoverse is more than just a coding club - it's a community of passionate
                developers, innovators, and problem solvers. We believe in hands-on learning,
                collaborative growth, and pushing the boundaries of technology.
              </p>
              <p>
                Our mission is to nurture the next generation of tech leaders through
                practical experience, mentorship, and real-world projects. Join us in
                our journey to transform ideas into impactful solutions.
              </p>
            </div>
          </motion.div>

          {/* Right side - Animated SVG */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-auto md:h-[360px]"
          >
            <div className="glass-panel rounded-3xl p-8 h-full flex items-center justify-center border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] transition-transform duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-48 h-48 relative md:w-56 md:h-56">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0 border border-red-500/30 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      delay: index * 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-5 rounded-full bg-[#050505] border border-red-500/40 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                      <code className="text-red-400 text-2xl font-bold tracking-wider">&lt;/&gt;</code>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group glass-panel rounded-2xl p-3 text-center border-t border-l border-white/10 shadow transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(220,38,38,0.12)] transition-all duration-300"
            >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:shadow-[0_0_12px_rgba(220,38,38,0.2)] transition-all duration-200">
                    <stat.icon className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide group-hover:text-shadow-glow transition-all">
                  {stat.value}
                </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-medium group-hover:text-gray-300 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;