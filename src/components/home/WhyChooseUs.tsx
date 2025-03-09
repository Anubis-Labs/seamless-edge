import React, { useState, useEffect } from 'react';

const WhyChooseUs: React.FC = () => {
  const [inView, setInView] = useState(false);
  
  // Set inView state when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    const targetElement = document.getElementById('why-choose-section');
    if (targetElement) {
      observer.observe(targetElement);
    }
    
    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, []);

  const reasons = [
    {
      title: 'Craftsmanship Guarantee',
      description: 'Every project is a masterpiece built on quality, attention to detail, and the highest standards in the industry.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Uncompromising Quality',
      description: 'We combine modern techniques with timeless craftsmanship to deliver results that exceed expectations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: 'Family-Owned & Trusted Locally',
      description: 'Founded by Steve & Allie, our business is built on family values, community trust, and a commitment to excellence.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: 'Customer-Centric Approach',
      description: 'We listen, we plan, and we deliver personalized service from start to finish.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <section 
      id="why-choose-section" 
      className="w-full py-32 bg-cover bg-center bg-fixed relative"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1599619585752-c3ac5296484b?w=1400&q=80&auto=format&fit=crop')",
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-accent-navy/80"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Magazine-style section header with editorial typography */}
        <div className="mb-16 text-center max-w-xl mx-auto">
          <div 
            className={`transition-all duration-700 delay-300 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
          >
            <span className="text-white/90 text-xs font-heading tracking-[0.2em] uppercase">Excellence Defined</span>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mt-3 mb-6 text-white tracking-tight leading-tight">
              Why Seamless Edge?
            </h2>
            <div className="w-16 h-px bg-accent-forest mx-auto mb-6"></div>
            <p className="text-lg text-white/80 font-body leading-relaxed">
              When you choose Seamless Edge, you're choosing a partnership built on integrity, expertise, and an unwavering commitment to exceptional results.
            </p>
          </div>
        </div>
        
        {/* Magazine-inspired grid layout with refined cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-8 border-l-2 border-accent-forest relative group hover:bg-white/15 transition-all duration-500">
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-accent-forest border-l-[40px] border-l-transparent group-hover:border-t-white transition-colors duration-300"></div>
                
                <div className="text-accent-forest mb-6">
                  {reason.icon}
                </div>
                
                <h3 className="text-xl font-heading font-semibold mb-4 text-white">
                  {reason.title}
                </h3>
                
                <div className="w-10 h-px bg-accent-forest mb-4 group-hover:w-16 transition-all duration-300"></div>
                
                <p className="text-white/80 font-body leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 