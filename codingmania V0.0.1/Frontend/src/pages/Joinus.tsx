import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Globe, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const skills = [
  'HTML/CSS', 'JavaScript', 'React.js', 'Python', 'Java', 'C++/DSA', 'Git/GitHub'
];

const interests = [
  'Web Development', 'App Development', 'Competitive Programming',
  'UI/UX Design', 'AI/ML', 'Cybersecurity', 'Open Source Contributions'
];

const roles = ['Frontend Developer', 'Backend Developer', 'Designer', 'Content Creator', 'Event Organizer'];

function Joinus() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();
  const savedUser = useMemo(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser) as { email?: string; name?: string };
    } catch {
      return null;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please log in first to submit your admin membership application.');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    
    const form = formRef.current;
    if (!form) return;

    const formData = {
      fullName: (form.elements.namedItem('fullName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      collegeName: (form.elements.namedItem('collegeName') as HTMLInputElement).value,
      courseStream: (form.elements.namedItem('courseStream') as HTMLInputElement).value,
      yearOfStudy: (form.elements.namedItem('yearOfStudy') as HTMLSelectElement).value,
      skills: skills.filter((_, i) => (form.elements.namedItem(`skill-${i}`) as HTMLInputElement).checked),
      interests: interests.filter((_, i) => (form.elements.namedItem(`interest-${i}`) as HTMLInputElement).checked),
      motivation: (form.elements.namedItem('motivation') as HTMLTextAreaElement).value,
      githubUrl: (form.elements.namedItem('githubUrl') as HTMLInputElement).value,
      linkedinUrl: (form.elements.namedItem('linkedinUrl') as HTMLInputElement).value,
      websiteUrl: (form.elements.namedItem('websiteUrl') as HTMLInputElement).value,
      teamPreferences: roles.filter((_, i) => (form.elements.namedItem(`role-${i}`) as HTMLInputElement).checked),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/join-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Your application is submitted.");
        form.reset();
      } else if (response.status === 400) {
        toast.error(data.error || "You have already submitted your application.");
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("Failed to submit the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen relative overflow-hidden font-sans selection:bg-red-500/30 selection:text-white pt-16 pb-10">
      
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
          className="text-center mb-12 md:mb-6"
        >
         <div className="inline-block px-5 py-2 bg-red-500/10 rounded-full border border-red-500/50 mb-4 mt-4 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
  <span className="text-red-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
    <Users size={16} />
    Join Our Family
  </span>
</div>
          <h2 className="text-2xl sm:text-2xl md:text-4xl font-extrabold text-metallic mb-4 tracking-tighter drop-shadow-2xl">
            Become a Member
          </h2>
          <p className="text-lg sm:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Fill out the form below to join our tech community and start your journey with Technoverse.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-8 rounded-full opacity-80"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <form ref={formRef} className="grid lg:grid-cols-2 gap-6 space-y-0" onSubmit={handleSubmit}>
            
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-panel rounded-2xl p-6 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    defaultValue={savedUser?.name || ''}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={savedUser?.email || ''}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                    readOnly
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number (Optional)</label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Educational Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel rounded-2xl p-6 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <h3 className="text-xl font-bold text-white mb-4">Educational Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">College/School Name</label>
                  <input
                    name="collegeName"
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course/Stream</label>
                  <input
                    name="courseStream"
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year of Study</label>
                  <select
                    name="yearOfStudy"
                    className="w-full px-4 py-3 rounded-xl text-white bg-white/5 border border-white/10 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                    required
                  >
                    <option value="" style={{ color: "black" }}>Select Year</option>
                    <option value="1" style={{ color: "black" }}>1st Year</option>
                    <option value="2" style={{ color: "black" }}>2nd Year</option>
                    <option value="3" style={{ color: "black" }}>3rd Year</option>
                    <option value="4" style={{ color: "black" }}>4th Year</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Technical Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-panel rounded-2xl p-6 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:col-span-2"
            >
              <h3 className="text-xl font-bold text-white mb-4">Technical Skills</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skills.map((skill, index) => (
                  <label key={skill} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      name={`skill-${index}`}
                      type="checkbox"
                      className="w-5 h-5 rounded bg-white/5 border-white/20 text-red-500 focus:ring-red-500/50"
                    />
                    <span className="text-gray-400 group-hover:text-white transition-colors">{skill}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <input
                  name="otherSkills"
                  type="text"
                  placeholder="Other skills..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                />
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-panel rounded-2xl p-6 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:col-span-2"
            >
              <h3 className="text-xl font-bold text-white mb-4">Interests</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {interests.map((interest, index) => (
                  <label key={interest} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      name={`interest-${index}`}
                      type="checkbox"
                      className="w-5 h-5 rounded bg-white/5 border-white/20 text-red-500 focus:ring-red-500/50"
                    />
                    <span className="text-gray-400 group-hover:text-white transition-colors">{interest}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Motivation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-panel rounded-2xl p-6 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:col-span-2"
            >
              <h3 className="text-xl font-bold text-white mb-4">Why Do You Want to Join?</h3>
              <textarea
                name="motivation"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                rows={4}
                placeholder="Tell us about your motivation (100-200 words)"
                required
              ></textarea>
            </motion.div>

            {/* Portfolio Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass-panel rounded-2xl p-6 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:col-span-2"
            >
              <h3 className="text-xl font-bold text-white mb-4">Portfolio Links (Optional)</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Github className="w-5 h-5 text-red-500" />
                  <input
                    name="githubUrl"
                    type="url"
                    placeholder="GitHub Profile URL"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-5 h-5 text-red-500" />
                  <input
                    name="linkedinUrl"
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-red-500" />
                  <input
                    name="websiteUrl"
                    type="url"
                    placeholder="Personal Website URL"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Team Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass-panel rounded-2xl p-6 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:col-span-2"
            >
              <h3 className="text-xl font-bold text-white mb-4">Team Preferences</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {roles.map((role, index) => (
                  <label key={role} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      name={`role-${index}`}
                      type="checkbox"
                      className="w-5 h-5 rounded bg-white/5 border-white/20 text-red-500 focus:ring-red-500/50"
                    />
                    <span className="text-gray-400 group-hover:text-white transition-colors">{role}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 lg:col-span-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl font-semibold transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Submitting...
                  </span>
                ) : "Submit Application"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Joinus;
