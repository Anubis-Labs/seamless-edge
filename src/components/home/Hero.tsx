import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import QuoteCalculator from '../quote/QuoteCalculator';
import { motion } from 'framer-motion';

// High-quality, magazine-style images
const images = [
  'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1920&q=85&auto=format&fit=crop'
];

const Hero: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showQuoteCalculator, setShowQuoteCalculator] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const maxBlur = 10; // Maximum blur in pixels
  const heroRef = useRef<HTMLDivElement>(null);

  // Set loaded state after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showQuoteCalculator) {
        setAnimating(true);
        setTimeout(() => {
          setCurrentImage((prev) => (prev + 1) % images.length);
          setTimeout(() => {
            setAnimating(false);
          }, 500);
        }, 500);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [showQuoteCalculator]);

  // Handle scroll effect for blur
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate blur based on scroll position
  const calculateBlur = () => {
    if (!heroRef.current) return 0;
    const heroHeight = heroRef.current.offsetHeight;
    const blurAmount = (scrollY / heroHeight) * maxBlur;
    return Math.min(blurAmount, maxBlur);
  };

  // Toggle quote calculator
  const toggleQuoteCalculator = () => {
    setShowQuoteCalculator(!showQuoteCalculator);
    // Disable body scrolling when calculator is open
    document.body.style.overflow = !showQuoteCalculator ? 'hidden' : '';
  };

  const blurAmount = calculateBlur();

  return (
    <section ref={heroRef} className="relative w-full h-[90vh] overflow-hidden">
      {/* CSS for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0; 
              transform: scale(0.9);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes rotate {
            100% {
              transform: rotate(1turn);
            }
          }
          
          .animated-border-button {
            position: relative;
            z-index: 0;
            overflow: hidden;
            padding: 16px 32px;
          }
          
          .animated-border-button::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -100%;
            width: 200%;
            height: 300%;
            background-color: transparent;
            background-repeat: no-repeat;
            background-size: 50% 50%, 50% 50%;
            background-position: 0 0, 100% 0, 100% 100%, 0 100%;
            background-image: linear-gradient(#FFC107, #FF9800);
            animation: rotate 4s linear infinite;
          }
          
          .animated-border-button::after {
            content: '';
            position: absolute;
            z-index: -1;
            left: 3px;
            top: 3px;
            width: calc(100% - 6px);
            height: calc(100% - 6px);
            background: #1F7757;
            border-radius: 2px;
          }
        `}
      </style>

      {/* High-resolution background images with elegant transition */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1500 ease-in-out ${
            index === currentImage 
              ? 'opacity-100 scale-105' 
              : 'opacity-0 scale-100'
          }`}
          style={{ 
            backgroundImage: `url(${image})`,
            transformOrigin: 'center center',
            filter: showQuoteCalculator 
              ? 'brightness(0.5) contrast(1.1) blur(8px)' 
              : `brightness(0.9) contrast(1.1) blur(${blurAmount}px)`,
            transition: 'filter 0.5s ease-in-out, transform 1.5s ease-in-out, opacity 1.5s ease-in-out'
          }}
        />
      ))}
      
      {/* Sophisticated overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-accent-navy/60 to-transparent" />
      
      {/* Main hero content */}
      {!showQuoteCalculator && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div 
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} 
            style={{ animation: animating ? 'fadeOut 0.5s ease' : 'fadeIn 0.5s ease' }}
          >
            {/* Editorial-style category label */}
            <div className="inline-block mb-6 px-3 py-1 border border-white/20 bg-white/10 backdrop-blur-sm">
              <span className="text-xs text-white/90 uppercase tracking-widest font-heading">Premium Drywall Services</span>
            </div>
            
            {/* Magazine-style headline with sophisticated typography */}
            <h1 className="text-5xl md:text-7xl font-heading font-semibold text-white mb-6 tracking-tight leading-tight">
              <span className="block mb-2">Flawless Drywall,</span>
              <span className="text-white/80 font-light italic">Seamless Results</span>
            </h1>
            
            {/* Elegant divider */}
            <div className="w-24 h-px bg-white/40 mx-auto mb-8 opacity-80" />
            
            {/* Refined descriptive paragraph */}
            <p className="text-xl md:text-2xl font-body text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Craftsmanship and precision in every detail, serving Calgary and all of Alberta with uncompromising quality.
            </p>
            
            {/* Sophisticated call-to-action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <button
                onClick={toggleQuoteCalculator}
                className="animated-border-button text-white font-heading font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
              >
                <span className="mr-2">Realtime Instant Quote</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <Link
                to="/gallery"
                className="group px-8 py-4 bg-transparent border border-white/30 text-white font-heading font-medium tracking-wide hover:bg-white/10 transition-all duration-300"
              >
                <span className="flex items-center">
                  <span>View Our Work</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 opacity-70 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quote Calculator Overlay */}
      {showQuoteCalculator && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            animation: 'fadeIn 0.5s ease'
          }}
        >
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-none shadow-2xl w-[90%] max-w-6xl h-[90vh] relative overflow-hidden"
            style={{ 
              animation: 'scaleIn 0.5s ease', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
            }}
          >
            {/* Decorative accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-forest/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-navy/5 translate-y-1/2 -translate-x-1/2 rounded-full"></div>
            
            <div className="relative h-full flex flex-col p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <span className="text-accent-forest text-xs font-heading tracking-[0.2em] uppercase">Instant Estimator</span>
                  <h2 className="text-2xl md:text-3xl font-heading font-semibold text-accent-navy mt-1">
                    Get Your Quote
                  </h2>
                  <div className="w-16 h-px bg-accent-forest mt-3"></div>
                </div>
                <button 
                  onClick={toggleQuoteCalculator}
                  className="text-accent-navy/70 hover:text-accent-forest transition-colors w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-accent-forest"
                  aria-label="Close quote calculator"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content - fixed size to avoid scrolling */}
              <div className="flex-1 overflow-hidden">
                <QuoteCalculator />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Magazine-style indicators */}
      {!showQuoteCalculator && (
        <div className="absolute bottom-10 right-10 hidden md:flex space-x-2">
          {images.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-8 h-1 transition-all duration-300 ${
                index === currentImage ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Elegant scroll indicator */}
      {!showQuoteCalculator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-white/70 text-xs mb-2 font-heading tracking-widest">SCROLL</span>
          <div className="w-px h-10 bg-white/30 animate-pulse"></div>
        </div>
      )}
    </section>
  );
};

export default Hero; 