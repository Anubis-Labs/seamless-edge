import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ServiceAreaCTA: React.FC = () => {
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
    
    const targetElement = document.getElementById('service-area-section');
    if (targetElement) {
      observer.observe(targetElement);
    }
    
    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, []);

  const regions = [
    {
      name: 'Calgary Region',
      cities: ['Downtown Calgary', 'Northwest Calgary', 'Northeast Calgary', 'Southwest Calgary', 'Southeast Calgary', 'Airdrie', 'Cochrane', 'Chestermere', 'Okotoks']
    },
    {
      name: 'Extended Service Area',
      cities: ['Red Deer', 'Lethbridge', 'Medicine Hat', 'Edmonton', 'Fort McMurray', 'Grande Prairie', 'Banff', 'Canmore', 'And more!']
    }
  ];

  return (
    <section 
      id="service-area-section" 
      className="w-full py-32 bg-gradient-to-b from-white to-neutral-offwhite overflow-hidden relative"
    >
      {/* Map background for visual appeal */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="#2d3748" strokeWidth="0.1" />
          <path d="M20,20 L40,20 L60,40 L80,20 L80,80 L60,60 L40,80 L20,80 Z" fill="none" stroke="#2d3748" strokeWidth="0.2" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Magazine-style section header with editorial typography */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div 
            className={`transition-all duration-700 delay-300 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
          >
            <span className="text-accent-forest text-xs font-heading tracking-[0.2em] uppercase">Serving the Province</span>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mt-3 mb-6 text-accent-navy tracking-tight leading-tight">
              Our Service Area in Alberta
            </h2>
            <div className="w-16 h-px bg-accent-forest mx-auto mb-6"></div>
            <p className="text-lg text-accent-navy/70 font-body leading-relaxed">
              Based in the heart of Calgary, Seamless Edge provides exceptional drywall services 
              throughout Alberta. Our expert team delivers quality workmanship to residential 
              and commercial clients across the province.
            </p>
          </div>
        </div>
        
        {/* Refined two-column layout with elegant cards */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-12 gap-12 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          style={{ transitionDelay: '0.3s' }}
        >
          {/* Service regions card */}
          <div className="md:col-span-7">
            <div className="bg-white p-10 shadow-sm border border-neutral-softgray/10 relative overflow-hidden group">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-forest/5 -translate-y-1/2 translate-x-1/2 rounded-full transition-all duration-700 group-hover:bg-accent-forest/10"></div>
              
              <h3 className="text-2xl font-heading font-semibold text-accent-navy mb-8 relative">
                Areas We Proudly Serve
                <span className="block w-12 h-px bg-accent-forest mt-3"></span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                {regions.map((region, index) => (
                  <div key={index} className="relative">
                    <h4 className="font-heading font-semibold text-lg text-accent-navy mb-4 flex items-center">
                      <span className="w-2 h-2 bg-accent-forest mr-2"></span>
                      {region.name}
                    </h4>
                    <ul className="space-y-2.5 text-accent-navy/80 font-body">
                      {region.cities.map((city, cityIndex) => (
                        <li key={cityIndex} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-forest/70 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>{city}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-6 bg-neutral-offwhite border-l-2 border-accent-forest text-accent-navy/70 font-body text-sm">
                <p>
                  <span className="font-medium text-accent-navy">Note:</span> Standard pricing applies to Calgary and surrounding areas up to Airdrie. 
                  For locations beyond Airdrie, additional travel fees may apply. Please inquire for a custom quote 
                  tailored to your specific location.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact and map card */}
          <div className="md:col-span-5">
            <div className="bg-white p-10 shadow-sm border border-neutral-softgray/10 h-full flex flex-col relative overflow-hidden group">
              {/* Map visualization */}
              <div className="mb-8 aspect-w-4 aspect-h-3 overflow-hidden">
                <div className="relative w-full h-full p-1 bg-accent-navy/5">
                  <div className="absolute inset-0 m-1 bg-cover bg-center" style={{ 
                    backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Alberta_in_Canada.svg/800px-Alberta_in_Canada.svg.png')",
                  }}>
                    {/* Calgary location marker */}
                    <div className="absolute left-[48%] top-[52%]">
                      <div className="w-4 h-4 bg-accent-forest rounded-full relative animate-pulse">
                        <div className="absolute inset-0 bg-accent-forest rounded-full animate-ping opacity-75"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3 right-3 bg-white px-3 py-2 text-xs font-heading font-medium text-accent-navy shadow-sm">
                    <span>Seamless Edge</span>
                  </div>
                </div>
              </div>
              
              {/* Headquarters information */}
              <div className="mb-8">
                <h3 className="text-xl font-heading font-semibold text-accent-navy mb-4 relative">
                  Headquarters
                  <span className="block w-8 h-px bg-accent-forest mt-3"></span>
                </h3>
                
                <ul className="space-y-4 text-accent-navy/80">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-forest mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>123 Drywall Avenue, <br />Calgary, AB T2P 1J9</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-forest mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>(403) 555-7890</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-forest mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>info@seamlessedge.co</span>
                  </li>
                </ul>
              </div>
              
              {/* Call to action */}
              <div className="mt-auto pt-6 border-t border-neutral-softgray/20">
                <p className="text-accent-navy/80 font-body mb-6">
                  Ready for your drywall project anywhere in Alberta? Get your personalized quote today!
                </p>
                <Link 
                  to="/quote" 
                  className="inline-flex items-center px-6 py-3 bg-accent-forest text-white font-heading tracking-wide hover:bg-accent-navy transition-all duration-300 shadow-sm group"
                >
                  <span className="mr-2">Get Your Free Quote</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaCTA; 