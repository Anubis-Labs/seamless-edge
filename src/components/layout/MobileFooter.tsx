import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

// Simple accordion component for mobile menu
const AccordionSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        className="w-full flex items-center justify-between py-3 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-heading font-semibold text-white">{title}</h3>
        <span className="text-accent-gold">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 py-2' : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const MobileFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setSubscribed(true);
    setEmail('');
    
    setTimeout(() => {
      setSubscribed(false);
    }, 3000);
  };

  const socialLinks = [
    { icon: <FaFacebookF />, url: 'https://facebook.com', name: 'Facebook' },
    { icon: <FaInstagram />, url: 'https://instagram.com', name: 'Instagram' },
    { icon: <FaLinkedinIn />, url: 'https://linkedin.com', name: 'LinkedIn' },
    { icon: <FaTwitter />, url: 'https://twitter.com', name: 'Twitter' },
    { icon: <FaYoutube />, url: 'https://youtube.com', name: 'YouTube' }
  ];

  return (
    <footer className="sm:hidden bg-gradient-to-b from-neutral-charcoal to-black text-white pt-8 pb-6 overflow-hidden">
      <div className="px-4">
        {/* Company Info */}
        <div className="mb-6">
          <h3 className="text-xl font-heading font-bold mb-2">Seamless Edge</h3>
          <p className="text-white/90 font-body text-sm mb-4">
            Calgary's premier drywall specialists. Delivering flawless finishes across Alberta.
          </p>
          
          {/* Social Media Icons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-accent-gold/10 hover:bg-accent-gold/30 transition-all duration-300 group"
                aria-label={social.name}
              >
                <span className="text-accent-gold group-hover:text-white text-base">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="mb-6">
          <AccordionSection title="Our Services">
            <ul className="space-y-2 pl-2 mb-2">
              <li>
                <Link to="/services#boarding" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <FaChevronRight className="w-2.5 h-2.5 mr-1.5 text-white flex-shrink-0" />
                  <span>Boarding & Installation</span>
                </Link>
              </li>
              <li>
                <Link to="/services#taping" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <FaChevronRight className="w-2.5 h-2.5 mr-1.5 text-white flex-shrink-0" />
                  <span>Taping & Mudding</span>
                </Link>
              </li>
              <li>
                <Link to="/services#sanding" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <FaChevronRight className="w-2.5 h-2.5 mr-1.5 text-white flex-shrink-0" />
                  <span>Sanding & Finishing</span>
                </Link>
              </li>
              <li>
                <Link to="/services#repairs" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <FaChevronRight className="w-2.5 h-2.5 mr-1.5 text-white flex-shrink-0" />
                  <span>Repairs & Custom Textures</span>
                </Link>
              </li>
            </ul>
          </AccordionSection>
          
          <AccordionSection title="Quick Links">
            <ul className="space-y-2 pl-2 mb-2">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <FaChevronRight className="w-2.5 h-2.5 mr-1.5 text-white flex-shrink-0" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <FaChevronRight className="w-2.5 h-2.5 mr-1.5 text-white flex-shrink-0" />
                  <span>Project Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <FaChevronRight className="w-2.5 h-2.5 mr-1.5 text-white flex-shrink-0" />
                  <span>Blog & Tips</span>
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <FaChevronRight className="w-2.5 h-2.5 mr-1.5 text-white flex-shrink-0" />
                  <span>Careers</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white inline-flex items-center text-sm">
                  <FaChevronRight className="w-2.5 h-2.5 mr-1.5 text-white flex-shrink-0" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </AccordionSection>
        </div>

        {/* Newsletter Signup */}
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold mb-2">Stay Updated</h3>
          <p className="text-white/90 font-body text-sm mb-3">
            Subscribe for special offers and updates.
          </p>
          
          <form onSubmit={handleSubscribe}>
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-2 pl-9 text-sm rounded-md bg-white/10 border border-white/20 focus:border-accent-gold focus:ring-0 text-white placeholder-white/60 font-body"
                />
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 text-xs" />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 bg-accent-gold hover:bg-accent-gold/90 rounded-md text-neutral-charcoal font-heading font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
              >
                <span>Subscribe</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            {subscribed && (
              <p className="mt-2 text-green-300 text-xs flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Thank you for subscribing!
              </p>
            )}
          </form>
        </div>

        {/* Contact Information */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center">
            <div className="h-7 w-7 rounded-full bg-accent-gold/20 flex items-center justify-center mr-2.5 flex-shrink-0">
              <FaPhone className="h-2.5 w-2.5 text-accent-gold" />
            </div>
            <span className="text-white/90 text-sm">(403) 555-7890</span>
          </div>
          
          <div className="flex items-center">
            <div className="h-7 w-7 rounded-full bg-accent-gold/20 flex items-center justify-center mr-2.5 flex-shrink-0">
              <FaEnvelope className="h-2.5 w-2.5 text-accent-gold" />
            </div>
            <span className="text-white/90 text-sm break-all">info@seamlessedgeco.com</span>
          </div>
          
          <div className="flex items-center">
            <div className="h-7 w-7 rounded-full bg-accent-gold/20 flex items-center justify-center mr-2.5 flex-shrink-0">
              <FaMapMarkerAlt className="h-2.5 w-2.5 text-accent-gold" />
            </div>
            <span className="text-white/90 text-sm">Calgary, Alberta, Canada</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-4">
          <div className="text-center text-white/70 font-body text-xs">
            <p>© {new Date().getFullYear()} Seamless Edge. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3">
              <Link to="/terms" className="text-white/70 hover:text-accent-gold transition-colors duration-300">Terms of Service</Link>
              <Link to="/privacy" className="text-white/70 hover:text-accent-gold transition-colors duration-300">Privacy Policy</Link>
              <Link to="/sitemap" className="text-white/70 hover:text-accent-gold transition-colors duration-300">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter; 