
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: 'How can I join Technovers?',
      answer: 'You can join Technovers by signing up on our website and attending our next orientation session. We welcome members of all skill levels!'
    },
    {
      question: 'What programming languages do you teach?',
      answer: 'We cover a wide range of languages including JavaScript, Python, Java, and more. Our courses are designed to cater to both beginners and advanced developers.'
    },
    {
      question: 'Are the courses free for members?',
      answer: 'Yes, most of our basic courses are free for members. Premium courses and workshops may have a nominal fee to cover resources and materials.'
    },
    {
      question: 'How often do you organize events?',
      answer: 'We organize events monthly, including workshops, hackathons, and tech talks. Check our events page for the latest schedule.'
    },
    {
      question: 'Can I contribute to club projects?',
      answer: "Absolutely! We encourage members to participate in our open-source projects and contribute to the club's technical initiatives."
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-block px-5 py-2 bg-red-500/10 rounded-full border border-red-500/50 mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <span className="text-red-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
              <HelpCircle size={16} />
              Need Help?
            </span>
          </div>
          <h2 className="text-2xl sm:text-2xl md:text-4xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl">
            FAQ
          </h2>
          <p className="text-lg sm:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Find answers to common questions about Technoverse.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-8 rounded-full opacity-80"></div>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full glass-panel rounded-2xl p-6 text-left border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-white/5 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-red-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-red-400" />
                  )}
                </div>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-gray-300 leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
