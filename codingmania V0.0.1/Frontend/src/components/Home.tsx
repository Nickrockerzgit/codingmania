import React from "react";
import {
 
  Github,
  Linkedin,
  Twitter,
  Instagram,
  
 
  Mail,
  Globe,
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import logo from "../assets/UITlogo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-12 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src="/bgvideo.mp4" type="video/mp4" />
</video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 z-[1]"></div>
        {/* Subtle red-tinted vignette overlay */}
        <div className="absolute inset-0 z-[2]" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}></div>
        {/* Bottom gradient fade to blend with page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-[3] pointer-events-none"></div>
        {/* Top subtle red accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] z-[2] pointer-events-none" style={{
          background: 'radial-gradient(ellipse at top center, rgba(220,38,38,0.12) 0%, transparent 70%)',
        }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        {/* Header with Logo and University Name */}
        <div className="mb-8 animate-fade-in-up delay-100">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 object-contain animate-float drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
            />
            <h1 className="text-white font-bold text-lg max-sm:text-center leading-tight text-left" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6)' }}>
              <span className="block opacity-95">
                राजीव गांधी प्रौद्योगिकी विश्वविद्यालय शिवपुरी (म.प्र.), भारत
              </span>
              <span className="block text-sm text-gray-200" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
                Rajiv Gandhi Technical University Shivpuri (M.P.), INDIA
              </span>
            </h1>
          </div>
          <div className="mt-0 px-4 py-2 bg-red-600/20 backdrop-blur-sm rounded-full border border-red-500/60 inline-block animate-pulse-glow shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <span className="text-red-200 text-sm font-semibold tracking-wider uppercase" style={{ textShadow: '0 0 10px rgba(239,68,68,0.6)' }}>
              Official Coding Club
            </span>
          </div>
        </div>

       

        {/* Main Heading - TECHNOVERSE */}
    <h1 className="text-8xl sm:text-8xl md:text-8xl font-extrabold mb-6 tracking-tighter animate-fade-in-up delay-300 hero-title-video text-metallic drop-shadow-2xl">
  TECHNOVERSE
</h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl max-w-2xl mx-auto mb-6 font-semibold animate-fade-in-up delay-400 tracking-wide hero-subtitle-video">
          Where Code Meets Innovation
        </p>

        <div className="w-28 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-8 rounded-full animate-fade-in-up delay-400 shadow-[0_0_12px_rgba(220,38,38,0.5)]"></div>

        <p className="text-base sm:text-lg max-w-2xl mx-auto mb-10 animate-fade-in-up delay-500 font-light leading-relaxed text-gray-200" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.7)' }}>
          Join the future of technology. Learn, Build, and Innovate with the
          most passionate coders in the universe. Let's create magic together.
        </p>

        {/* Single Glowing CTA Button */}
        {isAuthenticated && (
          <div className="flex justify-center mb-4 animate-fade-in-up delay-500">
            <button
              onClick={() => navigate("/joinus")}
              className="btn-glow-red text-lg tracking-wide px-10 py-4 transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(220,38,38,0.7)]"
            >
              Join Technoverse
            </button>
            
          </div>
        )}
        <SocialLinks />
      </div>
    </section>
  );
};


const SocialLinks: React.FC = () => {
  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/technoverseclub",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/technoverse-b4614b366?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      label: "LinkedIn",
    },
    { icon: Twitter, href: "https://x.com/technoverse_uit", label: "Twitter" },
    {
      icon: Instagram,
      href: "https://www.instagram.com/technoverseee?igsh=bG9nMHA2bGxsbmt6",
      label: "Instagram",
    },
    { icon: Mail, href: "mailto:technoverseclub@gmail.com", label: "Email" },
    { icon: Globe, href: "#", label: "Website" },
    { icon: FaDiscord, href: "#", label: "Discord" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2 relative z-20 px-6">
      {socialLinks.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 glass-panel rounded-full text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300 transform hover:-translate-y-2 shadow-[0_0_0_transparent] hover:shadow-[0_10px_30px_rgba(220,38,38,0.4)]"
          aria-label={label}
        >
          <Icon size={24} />
        </a>
      ))}
    </div>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#050505] min-h-screen relative overflow-hidden font-sans selection:bg-red-500/30 selection:text-white">
      {/* Background Accent Rays Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>

      <HeroSection />
     

    </div>
  );
};

export default LandingPage;
