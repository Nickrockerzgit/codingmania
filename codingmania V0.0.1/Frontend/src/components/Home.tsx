import React from "react";
import {
  Terminal,
  Braces,
  Binary,
  Hash,
  Code,
  Zap,
  Users,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Star,
  Anchor,
  Flag,
  Sparkles,
  Mail,
  Globe,
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import logo from "../assets/UITlogo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Prism from "./Prism";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Prism WebGL Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden">
        <Prism
          animationType="hover" // Makes it interactive with the mouse
          timeScale={0.4}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0} // Hue shift not needed anymore due to custom shader mapping
          colorFrequency={1.2} // Restored to create nice dynamic luminance mapped to red
          noise={0} // Set to 0 to remove the pixelated static effect
          glow={1.5} // Increased glow
        />
        {/* Soft dark gradient fade at the bottom to blend with the rest of the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        {/* Header with Logo and University Name */}
        <div className="mb-8 animate-fade-in-up delay-100">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 object-contain animate-float"
            />
            <h1 className="text-white font-bold text-lg max-sm:text-center leading-tight drop-shadow-lg text-left">
              <span className="block opacity-90">
                राजीव गांधी प्रौद्योगिकी विश्वविद्यालय शिवपुरी (म.प्र.), भारत
              </span>
              <span className="block text-sm text-gray-300">
                Rajiv Gandhi Technical University Shivpuri (M.P.), INDIA
              </span>
            </h1>
          </div>
          <div className="mt-2 px-5 py-2 bg-red-500/10 rounded-full border border-red-500/50 inline-block animate-pulse-glow shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <span className="text-red-400 text-sm font-semibold tracking-wider uppercase">
              Official Coding Club
            </span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 glass-panel rounded-full mb-8 animate-fade-in-up delay-200 shadow-lg border border-white/10 hover:border-white/30 transition-colors">
          <div className="flex gap-1 text-red-500 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={15} fill="currentColor" />
            ))}
          </div>
          <span className="text-xs text-gray-300 ml-2 font-medium tracking-wide">
            4.9 ratings by Students
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl animate-fade-in-up delay-300">
          TECHNOVERSE
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 max-w-2xl mx-auto mb-6 font-medium animate-fade-in-up delay-400 tracking-wide">
          Where Code Meets Innovation
        </p>

        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-8 rounded-full animate-fade-in-up delay-400 opacity-80"></div>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-500 font-light leading-relaxed">
          Join the future of technology. Learn, Build, and Innovate with the
          most passionate coders in the universe. Let's create magic together.
        </p>

        {/* Single Glowing CTA Button */}
        {isAuthenticated && (
          <div className="flex justify-center mb-16 animate-fade-in-up delay-500">
            <button
              onClick={() => navigate("/joinus")}
              className="btn-glow-red text-lg tracking-wide px-10 py-4 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.6)]"
            >
              Join Technoverse
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const StatsBar: React.FC = () => {
  const stats = [
    { icon: Anchor, value: "500+", label: "Active Members" },
    { icon: Flag, value: "50+", label: "Successful Events" },
    { icon: Sparkles, value: "20+", label: "Open Source Projects" },
  ];

  return (
    <section className="relative z-20 pb-20 px-6 mt-[-30px]">
      <div className="max-w-5xl mx-auto">
        <div className="glass-panel rounded-3xl py-10 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {stats.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <div className="group flex items-center gap-5 flex-1 justify-center sm:justify-start transform hover:scale-[1.02] transition-transform duration-300">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300">
                  <stat.icon
                    size={32}
                    className="text-gray-400 group-hover:text-red-400 transition-colors"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-left">
                  <div className="text-4xl font-light text-white tracking-wide drop-shadow-md group-hover:text-shadow-glow">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-medium group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              {index < stats.length - 1 && (
                <div className="stat-divider hidden sm:block opacity-30 group-hover:opacity-80 transition-opacity" />
              )}
            </React.Fragment>
          ))}
        </div>
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
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-12 relative z-20 px-6">
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
      <StatsBar />
      <SocialLinks />

      <footer className="relative z-20 pb-12 pt-8 text-center border-t border-white/5 mt-10 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-500 text-sm tracking-wider font-light">
            © {new Date().getFullYear()} Technoverse. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-3 tracking-widest uppercase font-medium">
            Rajiv Gandhi Technical University Shivpuri
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
