import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// SVG Icon components for a more elegant look
const DryboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const TapingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const FinishingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const RepairsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0 0L9.121 9.121M7.5 7.5l2.879.757m7 7l2.828 2.828" />
  </svg>
);

// Vector animation component for background
const VectorAnimation = ({ inView, scrollPosition }: { inView: boolean; scrollPosition: number }) => {
  const calculateOffset = (base: number) => {
    return base + (scrollPosition * 0.05);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Vector line animations */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        {/* Softly undulating lines that start together, bulge in middle, and taper at end */}
        <path
          className="vector-path path-1"
          d="M50,300 C150,280 350,400 500,380 S800,300 950,320"
          stroke="#5F7161"
          strokeWidth="1.5"
          fill="none"
          style={{
            opacity: inView ? 0.5 : 0,
            transform: `translateY(${calculateOffset(0)}px)`,
            transition: 'opacity 1s ease-out, transform 0.5s ease-out',
          }}
        />
        
        <path
          className="vector-path path-2"
          d="M50,340 C180,310 380,450 500,420 S820,330 950,360"
          stroke="#5F7161"
          strokeWidth="1.5"
          fill="none"
          style={{
            opacity: inView ? 0.45 : 0,
            transform: `translateY(${calculateOffset(5)}px)`,
            transition: 'opacity 1s ease-out 0.2s, transform 0.5s ease-out',
          }}
        />
        
        <path
          className="vector-path path-3"
          d="M50,380 C200,340 400,500 500,460 S850,360 950,400"
          stroke="#D5A021"
          strokeWidth="1.2"
          fill="none"
          style={{
            opacity: inView ? 0.45 : 0,
            transform: `translateY(${calculateOffset(10)}px)`,
            transition: 'opacity 1s ease-out 0.4s, transform 0.5s ease-out',
          }}
        />
        
        <path
          className="vector-path path-4"
          d="M50,420 C220,370 420,550 500,500 S880,390 950,440"
          stroke="#5F7161"
          strokeWidth="1.5"
          fill="none"
          style={{
            opacity: inView ? 0.4 : 0,
            transform: `translateY(${calculateOffset(15)}px)`,
            transition: 'opacity 1s ease-out 0.3s, transform 0.5s ease-out',
          }}
        />
        
        <path
          className="vector-path path-5"
          d="M50,460 C240,400 440,600 500,540 S910,420 950,480"
          stroke="#D5A021"
          strokeWidth="1.2"
          fill="none"
          style={{
            opacity: inView ? 0.5 : 0,
            transform: `translateY(${calculateOffset(20)}px)`,
            transition: 'opacity 1s ease-out 0.5s, transform 0.5s ease-out',
          }}
        />
        
        <path
          className="vector-path path-6"
          d="M50,500 C260,430 460,650 500,580 S940,450 950,520"
          stroke="#5F7161"
          strokeWidth="1.5"
          fill="none"
          style={{
            opacity: inView ? 0.4 : 0,
            transform: `translateY(${calculateOffset(25)}px)`,
            transition: 'opacity 1s ease-out 0.6s, transform 0.5s ease-out',
          }}
        />
        
        <path
          className="vector-path path-7"
          d="M50,540 C280,460 480,700 500,620 S920,480 950,560"
          stroke="#D5A021"
          strokeWidth="1.2"
          fill="none"
          style={{
            opacity: inView ? 0.45 : 0,
            transform: `translateY(${calculateOffset(30)}px)`,
            transition: 'opacity 1s ease-out 0.7s, transform 0.5s ease-out',
          }}
        />
        
        <path
          className="vector-path path-8"
          d="M50,580 C300,490 500,750 500,660 S900,510 950,600"
          stroke="#5F7161"
          strokeWidth="1.5"
          fill="none"
          style={{
            opacity: inView ? 0.35 : 0,
            transform: `translateY(${calculateOffset(35)}px)`,
            transition: 'opacity 1s ease-out 0.8s, transform 0.5s ease-out',
          }}
        />
        
        {/* Keyframe animation for undulating effect */}
        <style>
          {`
            @keyframes undulate1 {
              0%, 100% { d: path('M50,300 C150,280 350,400 500,380 S800,300 950,320'); }
              50% { d: path('M50,300 C150,290 350,390 500,400 S800,310 950,320'); }
            }
            
            @keyframes undulate2 {
              0%, 100% { d: path('M50,340 C180,310 380,450 500,420 S820,330 950,360'); }
              50% { d: path('M50,340 C180,330 380,430 500,440 S820,350 950,360'); }
            }
            
            @keyframes undulate3 {
              0%, 100% { d: path('M50,380 C200,340 400,500 500,460 S850,360 950,400'); }
              50% { d: path('M50,380 C200,370 400,480 500,480 S850,380 950,400'); }
            }
            
            @keyframes undulate4 {
              0%, 100% { d: path('M50,420 C220,370 420,550 500,500 S880,390 950,440'); }
              50% { d: path('M50,420 C220,410 420,530 500,520 S880,410 950,440'); }
            }
            
            @keyframes undulate5 {
              0%, 100% { d: path('M50,460 C240,400 440,600 500,540 S910,420 950,480'); }
              50% { d: path('M50,460 C240,440 440,580 500,560 S910,440 950,480'); }
            }
            
            @keyframes undulate6 {
              0%, 100% { d: path('M50,500 C260,430 460,650 500,580 S940,450 950,520'); }
              50% { d: path('M50,500 C260,470 460,630 500,600 S940,470 950,520'); }
            }
            
            @keyframes undulate7 {
              0%, 100% { d: path('M50,540 C280,460 480,700 500,620 S920,480 950,560'); }
              50% { d: path('M50,540 C280,500 480,680 500,640 S920,500 950,560'); }
            }
            
            @keyframes undulate8 {
              0%, 100% { d: path('M50,580 C300,490 500,750 500,660 S900,510 950,600'); }
              50% { d: path('M50,580 C300,530 500,730 500,680 S900,530 950,600'); }
            }
            
            .path-1 {
              animation: undulate1 8s ease-in-out infinite;
            }
            
            .path-2 {
              animation: undulate2 12s ease-in-out infinite;
            }
            
            .path-3 {
              animation: undulate3 10s ease-in-out infinite;
            }
            
            .path-4 {
              animation: undulate4 15s ease-in-out infinite;
            }
            
            .path-5 {
              animation: undulate5 9s ease-in-out infinite;
            }
            
            .path-6 {
              animation: undulate6 14s ease-in-out infinite;
            }
            
            .path-7 {
              animation: undulate7 11s ease-in-out infinite;
            }
            
            .path-8 {
              animation: undulate8 13s ease-in-out infinite;
            }
          `}
        </style>
      </svg>
    </div>
  );
};

const ServiceSnapshot: React.FC = () => {
  const [inView, setInView] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Enhanced intersection observer for finer animation control
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const targetElement = sectionRef.current;
    if (targetElement) {
      observer.observe(targetElement);
    }
    
    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, []);
  
  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Calculate parallax offset based on section position
  const calculateParallax = (factor: number = 0.1) => {
    if (!sectionRef.current) return 0;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const relativeScroll = scrollPosition - sectionTop + window.innerHeight;
    return relativeScroll * factor;
  };

  const services = [
    {
      title: 'Boarding & Installation',
      description: 'From initial layout to secure installation, our boarding services set the foundation for perfection.',
      icon: <DryboardIcon />,
      link: '/services#boarding',
      image: 'https://images.unsplash.com/photo-1513467655676-561b7d489a88?w=800&q=80&auto=format&fit=crop'
    },
    {
      title: 'Taping & Mudding',
      description: 'Precision taping and expertly applied mud ensure smooth, even surfaces every time.',
      icon: <TapingIcon />,
      link: '/services#taping',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80&auto=format&fit=crop'
    },
    {
      title: 'Sanding & Finishing',
      description: 'Our finishing touches are all about detail—polished surfaces that make your space shine.',
      icon: <FinishingIcon />,
      link: '/services#sanding',
      image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80&auto=format&fit=crop'
    },
    {
      title: 'Repairs & Textures',
      description: 'From minor repairs to custom textures like knockdown or orange peel, we have got you covered.',
      icon: <RepairsIcon />,
      link: '/services#repairs',
      image: 'https://images.unsplash.com/photo-1606676539940-12768ce0e762?w=800&q=80&auto=format&fit=crop'
    }
  ];

  // CSS Keyframes for animations
  const keyframes = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes shine {
      from { background-position: -200% center; }
      to { background-position: 200% center; }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes breathe {
      0% { box-shadow: 0 0 0 0 rgba(31, 119, 87, 0); }
      50% { box-shadow: 0 0 20px 5px rgba(31, 119, 87, 0.2); }
      100% { box-shadow: 0 0 0 0 rgba(31, 119, 87, 0); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.5); opacity: 0.3; }
      100% { transform: scale(1); opacity: 0.7; }
    }
    
    @keyframes drawLine {
      to {
        stroke-dashoffset: 0;
      }
    }
    
    .vector-path {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawLine 8s ease-out forwards;
    }
    
    .path-1 {
      animation-delay: 0.1s;
    }
    
    .path-2 {
      animation-delay: 0.3s;
    }
    
    .path-3 {
      animation-delay: 0.5s;
    }
    
    .path-4 {
      animation-delay: 0.7s;
    }
    
    .vector-corner {
      stroke-dasharray: 500;
      stroke-dashoffset: 500;
      animation: drawLine 3s ease-out forwards;
    }
  `;

  return (
    <section ref={sectionRef} id="service-section" className="w-full py-28 bg-gradient-to-b from-white to-neutral-offwhite/30 border-b border-neutral-softgray/10 overflow-hidden relative">
      {/* Add keyframes */}
      <style>{keyframes}</style>
      
      {/* Background vector animation for the entire section */}
      <VectorAnimation inView={inView} scrollPosition={scrollPosition} />
      
      {/* Decorative elements - Enhanced with additional elements */}
      <div 
        className="absolute top-10 left-10 w-48 h-48 rounded-full bg-accent-sage/5 -z-10"
        style={{ 
          transform: inView ? `translate(${calculateParallax(0.05)}px, ${calculateParallax(-0.02)}px)` : 'none',
          transition: 'transform 0.3s ease-out',
          opacity: inView ? 0.8 : 0,
        }}
      ></div>
      <div 
        className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-accent-gold/5 -z-10"
        style={{ 
          transform: inView ? `translate(${calculateParallax(-0.04)}px, ${calculateParallax(0.03)}px)` : 'none',
          transition: 'transform 0.3s ease-out',
          opacity: inView ? 0.8 : 0,
        }}
      ></div>
      <div 
        className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-accent-navy/3 -z-10"
        style={{ 
          transform: inView ? `translate(${calculateParallax(0.07)}px, ${calculateParallax(0.04)}px)` : 'none',
          transition: 'transform 0.3s ease-out',
          opacity: inView ? 0.6 : 0,
        }}
      ></div>
      <div 
        className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-accent-forest/3 -z-10"
        style={{ 
          transform: inView ? `translate(${calculateParallax(-0.06)}px, ${calculateParallax(-0.03)}px)` : 'none',
          transition: 'transform 0.3s ease-out',
          opacity: inView ? 0.7 : 0,
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Revamped section header with enhanced typography and visual elements */}
        <div className="mb-16 text-center relative">
          <div 
            className="transition-all duration-1000 delay-300 max-w-3xl mx-auto"
            style={{ 
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              animation: inView ? 'scaleIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
            }}
          >
            <span 
              className="text-accent-gold text-xs font-heading tracking-[0.2em] uppercase relative inline-block"
              style={{
                background: inView ? 'linear-gradient(90deg, transparent, rgba(213, 160, 33, 0.8), transparent)' : '',
                backgroundSize: '200% auto',
                animation: inView ? 'shine 3s ease-in-out infinite' : 'none',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: inView ? 'transparent' : 'initial',
              }}
            >
              <span className="absolute -left-6 top-1/2 w-4 h-px bg-accent-gold/50"></span>
              Professional Excellence
              <span className="absolute -right-6 top-1/2 w-4 h-px bg-accent-gold/50"></span>
            </span>
            
            <h2 
              className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6 text-accent-sage tracking-tight leading-tight relative z-10 px-4"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(15px)',
                transition: 'opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s',
              }}
            >
              <span className="relative">
                Craftsmanship in 
                <span className="relative">
                  <svg className="absolute -bottom-2 left-0 w-full h-2 text-accent-gold/30" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0,5 C50,0 150,10 200,5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </span>
              <br/>
              <span className="relative inline-block mt-1">
                Every Detail
                <span className="absolute -right-8 -top-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </span>
              </span>
            </h2>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div 
                className="w-12 h-px bg-accent-sage/30"
                style={{ 
                  width: inView ? '12px' : '0px',
                  transition: 'width 0.6s ease-out 0.6s',
                }}
              ></div>
              <div 
                className="w-16 h-px bg-accent-gold"
                style={{ 
                  width: inView ? '16px' : '0px',
                  transition: 'width 0.6s ease-out 0.7s',
                  animation: inView ? 'breathe 3s ease-in-out infinite' : 'none',
                }}
              ></div>
              <div 
                className="w-12 h-px bg-accent-sage/30"
                style={{ 
                  width: inView ? '12px' : '0px',
                  transition: 'width 0.6s ease-out 0.8s',
                }}
              ></div>
            </div>
            
            <p 
              className="text-lg md:text-xl text-neutral-charcoal/70 font-body leading-relaxed max-w-2xl mx-auto"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(15px)',
                transition: 'opacity 0.6s ease-out 0.9s, transform 0.6s ease-out 0.9s',
              }}
            >
              At Seamless Edge, we elevate every project through meticulous attention to detail, 
              premium techniques, and an unwavering pursuit of perfection that transforms spaces 
              with precision and artistry.
            </p>
          </div>
        </div>
        
        {/* Completely redesigned service card layout */}
        <div className="mb-16">
          {/* Modern 2x2 grid for service cards on medium screens, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {services.map((service, index) => (
              <Link 
                key={index} 
                to={service.link}
                className="group block h-full"
                aria-label={`Learn more about ${service.title}`}
              >
                <div 
                  className="relative h-full overflow-hidden bg-white rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.01]"
                  style={{ 
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.7s ease-out ${0.2 + index * 0.1}s, transform 0.7s ease-out ${0.2 + index * 0.1}s`,
                  }}
                >
                  {/* Image container with improved aspect ratio for better display */}
                  <div className="relative w-full pb-[58%] overflow-hidden">
                    {/* Service icon badge with improved visual style */}
                    <div className="absolute top-5 right-5 z-20 w-16 h-16 flex items-center justify-center bg-white/95 text-accent-gold rounded-full shadow-lg transform group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                      {service.icon}
                    </div>

                    {/* Image with proper fill, rendering at full quality */}
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-800 ease-out scale-100 group-hover:scale-110"
                      loading="eager"
                      onError={(e) => {
                        // Fallback to a reliable image if the original fails to load
                        const target = e.target as HTMLImageElement;
                        if (target.src !== 'https://images.unsplash.com/photo-1606676539940-12768ce0e762?w=800&q=80&auto=format&fit=crop') {
                          target.src = 'https://images.unsplash.com/photo-1606676539940-12768ce0e762?w=800&q=80&auto=format&fit=crop';
                        }
                      }}
                    />

                    {/* Enhanced gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500"></div>
                    
                    {/* Service title overlay with improved positioning and emphasis */}
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-accent-gold transition-colors duration-300">
                        {service.title}
                      </h3>
                      <div className="w-0 h-0.5 bg-accent-gold group-hover:w-16 transition-all duration-500 ease-out"></div>
                    </div>
                  </div>

                  {/* Description area with improved typography and spacing */}
                  <div className="p-6 md:p-7">
                    <p className="text-gray-700 mb-5 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Learn more link with clearer call to action */}
                    <div className="flex items-center text-accent-sage font-semibold group-hover:text-accent-gold transition-colors duration-300">
                      <span className="mr-2 uppercase text-sm tracking-wide">Learn More</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Enhanced call to action */}
        <div className="text-center">
          <Link 
            to="/services" 
            className="inline-flex items-center px-10 py-4 bg-accent-sage text-white font-heading tracking-wide hover:bg-accent-gold transition-all duration-300 shadow-md hover:shadow-lg rounded-lg"
          >
            <span className="mr-2">View All Services</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceSnapshot; 