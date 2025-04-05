import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';

// Define the texture display options
const TEXTURE_OPTIONS = [
  {
    id: 'smooth',
    name: 'Smooth Finish',
    description: 'Level 5 smoothness ideal for modern spaces and painted walls. Creates a sleek, contemporary look with no texture at all.',
    image: '/images/services/texture-application.jpg',
    color: '#2e4f3e'
  },
  {
    id: 'knockdown', 
    name: 'Knockdown Texture',
    description: 'Subtle texture with a mottled appearance. Popular for its ability to hide imperfections while maintaining a refined look.',
    image: '/images/services/drywall-installation.jpg',
    color: '#1e3a5f'
  },
  {
    id: 'orange-peel',
    name: 'Orange Peel',
    description: 'Light texture resembling the surface of an orange. Provides a subtle dimension that catches light beautifully.',
    image: '/images/services/drywall-taping.jpg',
    color: '#b8afa6'
  },
  {
    id: 'popcorn',
    name: 'Popcorn Removal',
    description: 'We specialize in removing outdated popcorn ceilings and replacing them with modern, smooth finishes.',
    image: '/images/services/tools.jpg',
    color: '#a67c52'
  }
];

const TextureTechShowcase: React.FC = () => {
  const [activeTextureIndex, setActiveTextureIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: false, amount: 0.3 });
  
  // Auto-rotation logic
  useEffect(() => {
    if (!isDragging && inView) {
      const timer = setTimeout(() => {
        setActiveTextureIndex((prev) => (prev + 1) % TEXTURE_OPTIONS.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeTextureIndex, isDragging, inView]);

  // Motion values for 3D effect and dragging
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-200, 200], [30, -30]);
  const rotateX = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation based on mouse position relative to center
      const rotX = ((e.clientY - centerY) / rect.height) * 20;
      const rotY = ((e.clientX - centerX) / rect.width) * 20;
      
      rotateX.set(rotX);
      x.set(rotY * 10);
    }
  };
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  const textureVariants = {
    initial: { scale: 0.95, opacity: 0, rotateY: 90 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      scale: 0.95, 
      opacity: 0, 
      rotateY: -90,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <section ref={containerRef} className="py-16 sm:py-20 md:py-24 overflow-hidden relative" onMouseMove={handleMouseMove}>
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-offwhite to-white"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-neutral-softgray/30"></div>
      <div className="absolute w-72 h-72 rounded-full bg-accent-forest/5 -top-20 -right-20 blur-3xl"></div>
      <div className="absolute w-96 h-96 rounded-full bg-accent-navy/5 -bottom-20 -left-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={variants}
          className="max-w-6xl mx-auto text-center mb-16"
        >
          <span className="uppercase tracking-wider text-sm font-medium text-accent-forest">Texture Expertise</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mt-2 mb-3 sm:mb-4 text-accent-navy">Drywall Texture Showcase</h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-body px-4 sm:px-0">
            Experience our range of premium drywall textures and finishes. 
            Swipe through to explore options for your next project.
          </p>
        </motion.div>
        
        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-12 items-center">
          {/* 3D texture display */}
          <motion.div 
            className="lg:col-span-7 relative h-64 sm:h-80 md:h-[500px] perspective"
            style={{ rotateY, rotateX }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={(_, info) => {
              // Update active texture on significant drag
              if (Math.abs(info.offset.x) > 100) {
                if (info.offset.x > 0) {
                  setActiveTextureIndex((prev) => (prev - 1 + TEXTURE_OPTIONS.length) % TEXTURE_OPTIONS.length);
                } else {
                  setActiveTextureIndex((prev) => (prev + 1) % TEXTURE_OPTIONS.length);
                }
              }
            }}
          >
            <div className="w-full h-full relative">
              {/* 3D texture card */}
              <motion.div 
                key={TEXTURE_OPTIONS[activeTextureIndex].id}
                className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={textureVariants}
              >
                {/* Texture image */}
                <div className="w-full h-full relative">
                  <img 
                    src={TEXTURE_OPTIONS[activeTextureIndex].image} 
                    alt={TEXTURE_OPTIONS[activeTextureIndex].name} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Texture info overlay */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white"
                    style={{ 
                      borderBottom: `4px solid ${TEXTURE_OPTIONS[activeTextureIndex].color}` 
                    }}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 font-heading">{TEXTURE_OPTIONS[activeTextureIndex].name}</h3>
                    <p className="text-xs sm:text-sm text-white/90 font-body">{TEXTURE_OPTIONS[activeTextureIndex].description}</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Interactive elements */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-accent-navy">
                Drag to rotate
              </div>
              
              {/* Navigation indicators */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {TEXTURE_OPTIONS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTextureIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTextureIndex 
                        ? `w-10 bg-${TEXTURE_OPTIONS[index].color}` 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`View ${TEXTURE_OPTIONS[index].name}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Texture selection */}
          <div className="lg:col-span-5">
            <motion.div 
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={variants}
              transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
              className="space-y-4 sm:space-y-6 mt-16 md:mt-0"
            >
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-accent-navy mb-4 sm:mb-6">Select a Texture</h3>
              
              {TEXTURE_OPTIONS.map((texture, index) => (
                <motion.div
                  key={texture.id}
                  variants={variants}
                  className={`texture-option p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    index === activeTextureIndex
                      ? 'bg-white shadow-lg border-l-4 translate-x-2'
                      : 'bg-gray-50 hover:bg-gray-100 border-l-4 border-transparent'
                  }`}
                  style={{ 
                    borderLeftColor: index === activeTextureIndex ? texture.color : 'transparent' 
                  }}
                  onClick={() => setActiveTextureIndex(index)}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-full flex-shrink-0 mr-4 bg-cover bg-center border-2 border-white shadow-sm"
                      style={{ backgroundImage: `url(${texture.image})` }}
                    ></div>
                    <div>
                      <h4 className="font-heading font-medium text-accent-navy">{texture.name}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {texture.description.split('.')[0]}.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <h4 className="text-base sm:text-lg font-heading font-semibold text-accent-navy mb-2 sm:mb-3">
                  Custom Texture Solutions
                </h4>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                  Beyond these popular options, we offer custom texture applications tailored 
                  to your design vision. Contact us to discuss creating a unique look for your space.
                </p>
                <a 
                  href="/services" 
                  className="inline-flex items-center text-accent-forest hover:text-accent-navy transition-colors duration-300"
                >
                  <span className="font-medium">View all texture services</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextureTechShowcase; 