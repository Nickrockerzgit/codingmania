
import { motion } from "framer-motion";
import {
  Code2,
  Mail,
  Link as LinkIcon,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  Disc,
} from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { name: "Home", to: "home" },
    { name: "About", to: "about" },
    { name: "Events", to: "events" },
    { name: "Courses", to: "courses" },
  ];

  const helpLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms-and-conditions" },
    { name: "FAQs", to: "faq" },
    { name: "Vlogs", to: "vlogs" },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/technoverseclub", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/technoverse-b4614b366?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/technoverseee?igsh=bG9nMHA2bGxsbmt6", label: "Instagram" },
    { icon: Disc, href: "#", label: "Discord" },
  ];

  return (
    <footer className="bg-[#050505] pt-20 pb-8 relative overflow-hidden font-sans selection:bg-red-500/30 selection:text-white">
      
      {/* Background Volumetric Lights */}
      <div className="absolute top-0 w-full h-full pointer-events-none z-0">
        <div className="volumetric-light-red opacity-30"></div>
        <div className="volumetric-light-secondary opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-6">
              <Code2 className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-xl font-bold text-white">
                Technoverse
              </span>
            </div>
            <p className="text-gray-400 mb-6 font-light leading-relaxed">
              Empowering the next generation of tech innovators through
              learning, collaboration, and hands-on experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <ScrollLink
                    to={link.to}
                    smooth={true}
                    duration={500}
                    className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Help</h3>
            <ul className="space-y-4">
              {helpLinks.map((link, index) => (
                <li key={index}>
                  {link.path ? (
                    <RouterLink
                      to={link.path}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      {link.name}
                    </RouterLink>
                  ) : (
                    <ScrollLink
                      to={link.to}
                      smooth={true}
                      duration={500}
                      className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      {link.name}
                    </ScrollLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:technoverseclub@gmail.com"
                  className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-3 text-red-500" />
                  technoverseclub@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LinkIcon className="h-5 w-5 mr-3 text-red-500" />
                  technoverse.com
                </a>
              </li>
              <li>
                <div className="flex items-center text-gray-400">
                  <MapPin className="h-5 w-5 mr-3 text-red-500" />
                  Tech Hub, UIT RGPV Shivpuri
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 glass-panel rounded-full text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 hover:scale-110 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-8 rounded-full opacity-80"></div>
          <p className="text-center text-gray-500 text-sm tracking-wider font-light">
            © {new Date().getFullYear()} Technoverse. All rights reserved.
          </p>
          <p className="text-center text-gray-600 text-xs mt-3 tracking-widest uppercase font-medium">
            Rajiv Gandhi Technical University Shivpuri
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
