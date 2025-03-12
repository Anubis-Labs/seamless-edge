import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaTwitter, 
  FaPinterestP, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaChevronRight 
} from 'react-icons/fa';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [seed, setSeed] = useState(Math.random());

  // Regenerate animations periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSeed(Math.random());
    }, 30000); // Change seed every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send the email to a server
    console.log('Subscribing email:', email);
    setSubscribed(true);
    setEmail('');
    
    // Reset the subscribed message after 3 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 3000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const socialLinks = [
    { icon: <FaFacebookF />, url: 'https://facebook.com', name: 'Facebook' },
    { icon: <FaInstagram />, url: 'https://instagram.com', name: 'Instagram' },
    { icon: <FaLinkedinIn />, url: 'https://linkedin.com', name: 'LinkedIn' },
    { icon: <FaTwitter />, url: 'https://twitter.com', name: 'Twitter' },
    { icon: <FaPinterestP />, url: 'https://pinterest.com', name: 'Pinterest' },
    { icon: <FaYoutube />, url: 'https://youtube.com', name: 'YouTube' }
  ];

  // Generate a series of horizontally stacked lines
  const generateHorizontalLines = (count = 30) => {
    // Generate a single shared wave pattern that all lines will follow
    const generateSharedWavePattern = (numPoints = 50) => {
      const basePoints = [];
      // Create many points for a smoother curve
      for (let i = 0; i <= numPoints; i++) {
        const x = (100 / numPoints) * i;
        // Create a basic sine wave pattern
        const y = Math.sin((x / 100) * Math.PI * 3) * 3; // 3 waves across width, 3px amplitude
        basePoints.push(y);
      }
      return basePoints;
    };
    
    // Generate the shared wave pattern
    const sharedWavePattern = generateSharedWavePattern();
    
    // Create multiple variations of the base pattern with slight phase shifts
    const waveVariations = Array.from({ length: 5 }).map((_, varIndex) => {
      const phaseShift = (varIndex / 5) * Math.PI * 2;
      return sharedWavePattern.map(y => 
        Math.sin((y + phaseShift) / 5) * 3
      );
    });
    
    return Array.from({ length: count }).map((_, index) => {
      const lineHeight = 0.25; // Make lines much thinner - 0.25px
      const opacity = 0.07 + (index % 3) * 0.01; // Slightly vary opacity in a pattern
      const yPosition = (100 / count) * index; // Evenly distribute lines vertically
      
      // All lines share the same animation timing
      const duration = 30; // Longer, more subtle animation
      
      // Generate control points for all keyframes using the shared pattern
      const generateControlPoints = (wavePattern: number[]) => {
        const points = [];
        const numPoints = wavePattern.length;
        
        for (let i = 0; i < numPoints; i++) {
          const x = (100 / (numPoints - 1)) * i;
          // Use the shared wave pattern, just offset by the line's y position
          const y = yPosition + wavePattern[i];
          points.push({ x, y });
        }
        
        return points;
      };
      
      // Generate keyframes using the shared wave variations
      const keyframes = waveVariations.map(variation => 
        generateControlPoints(variation)
      );
      
      // Create a function to convert control points to an SVG path
      const pointsToPath = (points: {x: number, y: number}[]) => {
        // Explicitly start at the leftmost edge (x=-5 to ensure it extends beyond viewport)
        let path = `M -5 ${points[0].y}`;
        
        // Use Catmull-Rom spline for smoother curve
        for (let i = 1; i < points.length; i++) {
          const prev = points[i-1];
          const current = points[i];
          
          // Calculate control points for a smoother curve
          const cp1x = prev.x + (current.x - prev.x) / 3;
          const cp2x = prev.x + (current.x - prev.x) * 2 / 3;
          
          path += ` C ${cp1x} ${prev.y}, ${cp2x} ${current.y}, ${current.x} ${current.y}`;
        }
        
        // Ensure the path extends well beyond the right edge
        path += ` L 105 ${points[points.length-1].y}`;
        
        return path;
      };
      
      // Convert all keyframes to paths
      const paths = keyframes.map(points => pointsToPath(points));
      
      return {
        lineHeight,
        opacity,
        yPosition,
        paths,
        duration
      };
    });
  };
  
  // Generate the horizontal lines with their animation data
  const horizontalLines = React.useMemo(() => generateHorizontalLines(30), [seed]);

  return (
    <footer className="relative bg-gradient-to-b from-neutral-charcoal to-black text-white pt-16 pb-8 overflow-hidden">
      {/* Animated Morphing Lines Background */}
      <div className="absolute inset-0 pointer-events-none w-full h-full">
        <svg
          width="100%"
          height="100%"
          viewBox="-5 0 110 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        >
          {horizontalLines.map((line, index) => (
            <motion.path
              key={`line-${index}-${seed}`}
              d={line.paths[0]}
              fill="none" 
              stroke="white"
              strokeWidth={line.lineHeight}
              strokeOpacity={line.opacity}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 1 }}
              animate={{ 
                d: [
                  line.paths[0],
                  line.paths[1],
                  line.paths[2],
                  line.paths[3],
                  line.paths[4],
                  line.paths[0]
                ]
              }}
              transition={{
                d: { 
                  duration: line.duration,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0 // All lines move together, no delay
                }
              }}
            />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="flex flex-col space-y-4"
            >
              <h3 className="text-2xl font-heading font-bold">Seamless Edge</h3>
              <p className="text-white/90 font-body">
                Calgary's premier drywall specialists. Delivering flawless finishes and precision in every detail across Alberta.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-accent-gold/10 hover:bg-accent-gold/30 hover:scale-110 transition-all duration-300 group"
                    whileHover={{ y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    aria-label={social.name}
                  >
                    <span className="text-accent-gold group-hover:text-white text-lg">
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-4"
          >
            <h3 className="text-xl font-heading font-semibold">Our Services</h3>
            <ul className="space-y-3 font-body">
              <li>
                <Link to="/services#boarding" className="text-white/80 hover:text-white inline-flex items-center hover:translate-x-1 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 mr-2 text-white" />
                  Boarding & Installation
                </Link>
              </li>
              <li>
                <Link to="/services#taping" className="text-white/80 hover:text-white inline-flex items-center hover:translate-x-1 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 mr-2 text-white" />
                  Taping & Mudding
                </Link>
              </li>
              <li>
                <Link to="/services#sanding" className="text-white/80 hover:text-white inline-flex items-center hover:translate-x-1 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 mr-2 text-white" />
                  Sanding & Finishing
                </Link>
              </li>
              <li>
                <Link to="/services#repairs" className="text-white/80 hover:text-white inline-flex items-center hover:translate-x-1 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 mr-2 text-white" />
                  Repairs & Custom Textures
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-4"
          >
            <h3 className="text-xl font-heading font-semibold">Quick Links</h3>
            <ul className="space-y-3 font-body">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white inline-flex items-center hover:translate-x-1 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 mr-2 text-white" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-white/80 hover:text-white inline-flex items-center hover:translate-x-1 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 mr-2 text-white" />
                  Project Gallery
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/80 hover:text-white inline-flex items-center hover:translate-x-1 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 mr-2 text-white" />
                  Blog & Tips
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-white/80 hover:text-white inline-flex items-center hover:translate-x-1 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 mr-2 text-white" />
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white inline-flex items-center hover:translate-x-1 transition-all duration-300">
                  <FaChevronRight className="w-3 h-3 mr-2 text-white" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-4"
          >
            <h3 className="text-xl font-heading font-semibold">Stay Updated</h3>
            <p className="text-white/90 font-body">
              Subscribe to our newsletter for special offers, tips, and the latest updates.
            </p>
            
            <form onSubmit={handleSubscribe} className="mt-4">
              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-2 pl-10 rounded-md bg-white/10 border border-white/20 focus:border-accent-gold focus:ring-0 text-white placeholder-white/60 font-body"
                  />
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-gold hover:bg-accent-gold/90 rounded-md text-neutral-charcoal font-heading font-medium transition-all duration-300 flex items-center justify-center space-x-2 hover:translate-y-[-2px]"
                >
                  <span>Subscribe</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              {subscribed && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-green-300 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Thank you for subscribing!
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="border-t border-white/20 pt-10 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-8">
            <div className="flex items-center group">
              <div className="h-8 w-8 rounded-full bg-accent-gold/20 flex items-center justify-center mr-3 group-hover:bg-accent-gold/30 transition-colors duration-300">
                <FaPhone className="h-3 w-3 text-accent-gold group-hover:text-white" />
              </div>
              <span className="text-white/90">(403) 555-7890</span>
            </div>
            <div className="flex items-center group">
              <div className="h-8 w-8 rounded-full bg-accent-gold/20 flex items-center justify-center mr-3 group-hover:bg-accent-gold/30 transition-colors duration-300">
                <FaEnvelope className="h-3 w-3 text-accent-gold group-hover:text-white" />
              </div>
              <span className="text-white/90">info@seamlessedgeco.com</span>
            </div>
          </div>
          <div className="flex items-center justify-start md:justify-end group">
            <div className="h-8 w-8 rounded-full bg-accent-gold/20 flex items-center justify-center mr-3 group-hover:bg-accent-gold/30 transition-colors duration-300">
              <FaMapMarkerAlt className="h-3 w-3 text-accent-gold group-hover:text-white" />
            </div>
            <span className="text-white/90">Calgary, Alberta, Canada</span>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-6 pt-6 text-center text-white/70 font-body">
          <p>© {new Date().getFullYear()} Seamless Edge. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link to="/terms" className="text-white/70 hover:text-accent-gold transition-colors duration-300">Terms of Service</Link>
            <span className="text-white/40">•</span>
            <Link to="/privacy" className="text-white/70 hover:text-accent-gold transition-colors duration-300">Privacy Policy</Link>
            <span className="text-white/40">•</span>
            <Link to="/sitemap" className="text-white/70 hover:text-accent-gold transition-colors duration-300">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 