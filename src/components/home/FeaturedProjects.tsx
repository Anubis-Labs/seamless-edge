import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProjects: React.FC = () => {
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
    
    const targetElement = document.getElementById('featured-projects-section');
    if (targetElement) {
      observer.observe(targetElement);
    }
    
    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, []);

  // Higher quality project images with real drywall/interior examples
  const projects = [
    {
      id: 1,
      title: 'Modern Living Room Transformation',
      description: 'Complete drywall installation with custom texture finish for an elegant contemporary space.',
      imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80&auto=format&fit=crop',
      category: 'Residential'
    },
    {
      id: 2,
      title: 'Executive Office Renovation',
      description: 'Commercial space with Level 5 finish for perfect walls that reflect professional excellence.',
      imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&auto=format&fit=crop',
      category: 'Commercial'
    },
    {
      id: 3,
      title: 'Luxury Basement Finishing',
      description: 'From unfinished space to sophisticated entertainment area with custom drywall details.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop',
      category: 'Residential'
    }
  ];

  return (
    <section id="featured-projects-section" className="w-full py-32 bg-white border-b border-neutral-softgray/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Magazine-style section header with editorial typography */}
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <div 
            className={`transition-all duration-700 delay-300 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
          >
            <span className="text-accent-sage text-xs font-heading tracking-[0.2em] uppercase">Our Portfolio</span>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mt-3 mb-6 text-accent-sage tracking-tight leading-tight">
              Proof in Our Projects
            </h2>
            <div className="w-16 h-px bg-accent-gold mx-auto mb-6"></div>
            <p className="text-lg text-neutral-charcoal/70 font-body leading-relaxed">
              Browse through our gallery of stunning transformations. Each project showcases our commitment to flawless craftsmanship, from elegant new builds to custom finishes.
            </p>
          </div>
        </div>
        
        {/* Magazine-inspired staggered layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 gap-x-8 mb-20">
          {/* First project - featured large */}
          <div 
            className={`md:col-span-8 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0 translate-y-16'}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div className="group relative overflow-hidden">
              <div className="relative h-96 overflow-hidden">
                <div className="absolute inset-0 bg-accent-sage/10 group-hover:bg-accent-sage/0 transition-colors duration-700 z-10"></div>
                <img 
                  src={projects[0].imageUrl} 
                  alt={projects[0].title}
                  className="w-full h-full object-cover object-center transition-all duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 z-20">
                  <span className="inline-block px-3 py-1 bg-white/90 text-accent-sage text-xs font-heading tracking-wider uppercase">
                    {projects[0].category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 bg-white border-l border-accent-gold">
                <h3 className="text-2xl font-bold font-heading mb-3 text-accent-sage group-hover:text-accent-gold transition-colors duration-500">
                  {projects[0].title}
                </h3>
                
                <div className="w-12 h-px bg-accent-gold mb-4 transition-all duration-500 group-hover:w-16"></div>
                
                <p className="text-neutral-charcoal/70 mb-6 font-body leading-relaxed">
                  {projects[0].description}
                </p>
                
                <Link 
                  to={`/gallery/${projects[0].id}`} 
                  className="inline-flex items-center text-accent-sage font-medium font-heading hover:text-accent-gold transition-all duration-300 group-hover:translate-x-1"
                >
                  <span className="mr-2 uppercase text-sm tracking-wide">View Project</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Secondary projects */}
          <div className="md:col-span-4 space-y-8">
            {projects.slice(1, 3).map((project, index) => (
              <div 
                key={project.id}
                className={`group relative overflow-hidden transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0 translate-y-16'}`}
                style={{ transitionDelay: `${(index + 1) * 0.2}s` }}
              >
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-accent-sage/10 group-hover:bg-accent-sage/0 transition-colors duration-700 z-10"></div>
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover object-center transition-all duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-block px-2 py-1 bg-white/90 text-accent-sage text-xs font-heading tracking-wider uppercase">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 bg-white border-l border-accent-gold">
                  <h3 className="text-lg font-bold font-heading mb-2 text-accent-sage group-hover:text-accent-gold transition-colors duration-500">
                    {project.title}
                  </h3>
                  
                  <div className="w-8 h-px bg-accent-gold mb-3 transition-all duration-500 group-hover:w-12"></div>
                  
                  <p className="text-neutral-charcoal/70 mb-4 font-body leading-relaxed text-sm">
                    {project.description}
                  </p>
                  
                  <Link 
                    to={`/gallery/${project.id}`} 
                    className="inline-flex items-center text-accent-sage font-medium font-heading hover:text-accent-gold transition-all duration-300 text-sm group-hover:translate-x-1"
                  >
                    <span className="mr-1 uppercase tracking-wide">View Project</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Magazine-style call to action */}
        <div 
          className={`text-center transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '0.6s' }}
        >
          <Link 
            to="/gallery" 
            className="inline-flex items-center px-10 py-4 bg-accent-gold text-accent-sage font-heading tracking-wide hover:bg-accent-sage hover:text-white transition-all duration-300 shadow-sm hover:shadow group"
          >
            <span className="mr-2">View Full Portfolio</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects; 