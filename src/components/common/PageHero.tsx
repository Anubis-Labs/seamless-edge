import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AIAssistant from './AIAssistant';
import { FaRobot } from 'react-icons/fa';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  showAIAssistant?: boolean;
}

// SVG shape components for visual interest
const ShapeCircle = ({ className = '' }) => (
  <motion.div 
    className={`absolute rounded-full ${className}`}
    animate={{ 
      scale: [1, 1.2, 1],
      opacity: [0.15, 0.25, 0.15],
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const ShapeSquare = ({ className = '' }) => (
  <motion.div 
    className={`absolute ${className}`}
    animate={{ 
      rotate: [0, 45, 0],
      opacity: [0.1, 0.15, 0.1],
    }}
    transition={{ 
      duration: 15, 
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const ShapeDot = ({ className = '', delay = 0 }) => (
  <motion.div 
    className={`absolute rounded-full ${className}`}
    initial={{ opacity: 0.05, scale: 0.5 }}
    animate={{ 
      opacity: [0.1, 0.25, 0.1],
      scale: [0.5, 1, 0.5],
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  />
);

const PageHero: React.FC<PageHeroProps> = ({ 
  title, 
  subtitle, 
  backgroundImage = '', 
  backgroundColor = 'bg-black/10',
  showAIAssistant = true 
}) => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  // Parallax scrolling effect
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  // Split title for staggered animation
  const titleWords = title.split(' ');

  return (
    <section className={`relative ${backgroundColor} text-white py-28 md:py-36 overflow-hidden`}>
      {/* Background Image with Parallax (if provided) */}
      {backgroundImage && (
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-40" 
          style={{ 
            backgroundImage: `url('${backgroundImage}')`,
            backgroundBlendMode: 'overlay',
            y: y1,
          }}
        />
      )}
      
      {/* Black Overlay - increased from 40%/30% to 60%/50% (darker by 20%) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/50" />
      
      {/* Decorative animated shapes with gradients to white */}
      <ShapeCircle className="w-64 h-64 bg-gradient-radial from-neutral-offwhite/50 to-white/0 -top-20 -left-20" />
      <ShapeCircle className="w-96 h-96 bg-gradient-radial from-neutral-offwhite/50 to-white/0 -bottom-40 -right-20" />
      <ShapeSquare className="w-32 h-32 bg-gradient-radial from-neutral-softgray/50 to-white/0 top-20 right-[20%]" />
      <ShapeSquare className="w-48 h-48 bg-gradient-radial from-accent-sage/50 to-white/0 bottom-10 left-[20%]" />
      <ShapeDot className="w-4 h-4 bg-gradient-radial from-accent-gold/50 to-white/0 top-[30%] left-[15%]" delay={0} />
      <ShapeDot className="w-6 h-6 bg-gradient-radial from-accent-gold/50 to-white/0 top-[20%] right-[35%]" delay={1} />
      <ShapeDot className="w-3 h-3 bg-gradient-radial from-neutral-softgray/50 to-white/0 bottom-[30%] right-[25%]" delay={2} />
      <ShapeDot className="w-5 h-5 bg-gradient-radial from-neutral-warmtaupe/50 to-white/0 bottom-[40%] left-[40%]" delay={1.5} />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div 
            className="flex-1 md:w-3/5"
            style={{ opacity }}
          >
            {/* Hero title with word-by-word animation */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight flex flex-wrap gap-x-4">
                {titleWords.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </div>
            
            {/* Animated accent line with gradient to white */}
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-accent-gold/50 to-white/0 mb-8"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {/* Subtitle with animation */}
            {subtitle && (
              <motion.p 
                className="text-xl md:text-2xl font-body text-neutral-offwhite/90 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>

          {/* Agent Chat Button */}
          {showAIAssistant && (
            <motion.div
              className="hidden md:flex flex-shrink-0 md:w-2/5 justify-center md:justify-end items-start"
              style={{ y: y2 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="backdrop-blur-sm bg-white/10 p-6 rounded-lg border border-accent-gold/20 shadow-lg"
              >
                <motion.button
                  onClick={() => setIsAIOpen(true)}
                  className="group flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 border-gradient-to-r from-accent-gold/50 to-white/0 rounded-lg transition-all duration-300"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span 
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-b from-accent-gold/50 to-white/0 rounded-full"
                    whileHover={{ rotate: 15 }}
                  >
                    <FaRobot className="text-black text-lg" />
                  </motion.span>
                  <div className="text-left">
                    <span className="block text-lg font-medium">Ask Agent</span>
                    <span className="text-xs text-neutral-offwhite/70">Get instant answers about our services</span>
                  </div>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* AI Assistant (positioned in global space, not just within the hero) */}
      {showAIAssistant && isAIOpen && (
        <AIAssistant />
      )}
    </section>
  );
};

export default PageHero; 