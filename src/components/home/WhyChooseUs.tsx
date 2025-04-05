import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const WhyChooseUs: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const reasons = [
    {
      title: 'Craftsmanship Guarantee',
      description: 'Every project is a masterpiece built on quality, attention to detail, and the highest standards in the industry.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Uncompromising Quality',
      description: 'We combine modern techniques with timeless craftsmanship to deliver results that exceed expectations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: 'Family-Owned & Trusted',
      description: 'Founded by Steve & Allie, our business is built on family values, community trust, and a commitment to excellence.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: 'Customer-Centric Approach',
      description: 'We listen, we plan, and we deliver personalized service from start to finish.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      id="why-choose-section" 
      className="w-full py-16 sm:py-20 md:py-24 lg:py-32 bg-cover bg-center bg-fixed relative overflow-hidden"
      style={{ 
        backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
      }}
      ref={ref}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 bg-accent-sage/20 w-96 h-96 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 bg-accent-gold/30 w-96 h-96 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Modern section header with animated elements */}
        <motion.div 
          className="mb-10 sm:mb-16 text-center max-w-2xl mx-auto"
          initial="hidden"
          animate={controls}
          variants={titleVariants}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-accent-sage/20 text-accent-gold text-xs font-heading tracking-[0.2em] uppercase mb-4">Excellence Defined</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mt-2 mb-4 sm:mb-6 text-white tracking-tight leading-tight">
            Why <span className="text-accent-gold">Seamless Edge</span>?
          </h2>
          <div className="w-20 h-1 bg-accent-gold mx-auto mb-6 relative">
            <div className="absolute -top-1 left-0 w-3 h-3 rounded-full bg-accent-gold"></div>
            <div className="absolute -top-1 right-0 w-3 h-3 rounded-full bg-accent-gold"></div>
          </div>
          <p className="text-base sm:text-lg text-white/90 font-body leading-relaxed">
            When you choose Seamless Edge, you're choosing a partnership built on integrity, expertise, and an unwavering commitment to exceptional results.
          </p>
        </motion.div>
        
        {/* Modern flex layout with animated cards */}
        <motion.div 
          className="flex flex-wrap gap-6 sm:gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="group flex-1 min-w-[280px] md:min-w-[45%]"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 hover:shadow-lg transition-all duration-500 h-full">
                {/* Animated highlight on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/0 via-accent-gold/0 to-accent-gold/0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute transform rotate-45 bg-accent-gold text-white font-medium text-xs py-1 text-center w-24 top-4 right-[-20px]"></div>
                </div>
                
                {/* Icon with glowing effect */}
                <div className="relative mb-6 w-16 h-16 p-3 rounded-lg bg-gradient-to-br from-accent-sage to-accent-sage/70 text-white group-hover:shadow-lg group-hover:shadow-accent-sage/20 transition-all duration-500">
                  <div className="absolute inset-0 rounded-lg bg-accent-sage animate-pulse opacity-0 group-hover:opacity-30"></div>
                  {reason.icon}
                </div>
                
                {/* Content with dynamic underline */}
                <h3 className="text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4 text-white group-hover:text-accent-gold transition-colors duration-300">
                  {reason.title}
                </h3>
                
                <div className="w-12 h-0.5 bg-accent-gold mb-4 group-hover:w-20 transition-all duration-500"></div>
                
                <p className="text-white/80 font-body text-sm sm:text-lg leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Bottom CTA */}
        <motion.div 
          className="mt-10 sm:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { delay: 1.2, duration: 0.8 } 
            }
          }}
        >
          <a 
            href="/contact" 
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-accent-gold hover:bg-accent-gold/90 text-accent-sage font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-accent-gold/20 text-sm sm:text-base"
          >
            Experience the Difference
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 