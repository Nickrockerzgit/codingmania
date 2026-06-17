
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Database, Brain, Shield, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const courses = [
    {
      title: 'Web Development',
      icon: Code2,
      description: 'Learn modern web development with React, Node.js, and more.',
    },
    {
      title: 'Data Structures & Algorithms',
      icon: Database,
      description: 'Master fundamental DSA concepts and problem-solving skills.',
    },
    {
      title: 'AI & Machine Learning',
      icon: Brain,
      description: 'Explore artificial intelligence and machine learning fundamentals.',
    },
    {
      title: 'Cyber Security',
      icon: Shield,
      description: 'Learn to protect systems and networks from cyber threats.',
    }
  ];

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
              <GraduationCap size={16} />
              Learn & Grow
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl">
            Our Courses
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Enhance your skills with our comprehensive tech courses.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-8 rounded-full opacity-80"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              onClick={() => navigate('/coming-soon')}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="glass-panel rounded-2xl p-6 h-full border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(220,38,38,0.2)] transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors border border-white/10">
                      <course.icon className="h-8 w-8 text-red-400 group-hover:text-red-300" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-shadow-glow transition-all">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {course.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
