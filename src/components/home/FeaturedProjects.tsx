import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabaseService from '../../services/supabaseService'; // Import service
import { FaSpinner } from 'react-icons/fa'; // Import spinner

// Define Project type based on expected Supabase table structure
interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url_before?: string; // Optional before image
  image_url_after?: string;  // Optional after image
  image_url?: string; // Optional single image URL (if before/after not used)
  featured?: boolean;
}

// Helper to get a display image URL (prioritize after, then before, then single, then placeholder)
const getProjectDisplayImage = (project: Project): string => {
    return project.image_url_after || project.image_url_before || project.image_url || '/images/placeholder.png';
}

const FeaturedProjects: React.FC = () => {
  const [inView, setInView] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch projects and filter featured ones
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const allProjects = await supabaseService.gallery.getProjects();
            const featured = (allProjects as Project[] || [])
                                .filter(p => p.featured)
                                .slice(0, 3); // Take only the first 3 featured
            setFeaturedProjects(featured);
        } catch (err: any) {
            console.error("Error fetching featured projects:", err);
            setError("Could not load featured projects.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchFeaturedProjects();
  }, []);

  // Set inView state when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Disconnect after first view
        }
      },
      { threshold: 0.2 } // Trigger when 20% is visible
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


  // Render skeleton loaders
  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className={`flex-1 min-w-[280px] bg-white rounded-lg shadow-md overflow-hidden h-96 ${index === 0 ? 'md:min-w-[60%]' : 'md:min-w-[30%]'}`}>
            <div className="w-full h-56 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse mb-4"></div>
                <div className="h-5 w-1/3 bg-gray-200 animate-pulse"></div>
            </div>
        </div>
    ));
  }

  return (
    <section id="featured-projects-section" className="w-full py-16 sm:py-24 md:py-32 bg-white border-b border-neutral-softgray/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Magazine-style section header with editorial typography */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center max-w-2xl mx-auto">
          <div 
            className={`transition-all duration-700 delay-300 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
          >
            <span className="text-accent-sage text-xs font-heading tracking-[0.2em] uppercase">Our Portfolio</span>
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-heading font-semibold mt-3 mb-4 sm:mb-6 text-accent-sage tracking-tight leading-tight">
              Proof in Our Projects
            </h2>
            <div className="w-16 h-px bg-accent-gold mx-auto mb-6"></div>
            <p className="text-base sm:text-lg text-neutral-charcoal/70 font-body leading-relaxed px-4 sm:px-0">
              Browse through our gallery of stunning transformations. Each project showcases our commitment to flawless craftsmanship, from elegant new builds to custom finishes.
            </p>
          </div>
        </div>
        
        {/* Loading, Error, or Projects Display */} 
        <div className="flex flex-wrap gap-y-6 sm:gap-y-8 md:gap-y-16 gap-x-6 sm:gap-x-8 mb-12 sm:mb-16 md:mb-20 justify-center"> {/* Added justify-center */} 
           {isLoading ? (
                renderSkeletons(3) // Show 3 skeletons while loading
           ) : error ? (
                <div className="w-full text-center text-red-600 bg-red-50 p-4 rounded-lg">
                    {error}
                </div>
           ) : featuredProjects.length === 0 ? (
                 <div className="w-full text-center text-gray-500 py-10">
                     No featured projects available at the moment.
                 </div>
           ) : (
            <>
                {/* First project - featured large */} 
                {featuredProjects[0] && (
                    <div 
                        className={`flex-1 min-w-[280px] md:min-w-[60%] transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0 translate-y-16'}`}
                        style={{ transitionDelay: '0.2s' }}
                    >
                        <div className="group relative overflow-hidden">
                        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                            <div className="absolute inset-0 bg-accent-sage/10 group-hover:bg-accent-sage/0 transition-colors duration-700 z-10"></div>
                            <img 
                                src={getProjectDisplayImage(featuredProjects[0])} // Use helper
                                alt={featuredProjects[0].title}
                                className="w-full h-full object-cover object-center transition-all duration-1000 ease-out group-hover:scale-105"
                            />
                            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
                            <span className="inline-block px-2 sm:px-3 py-1 bg-white/90 text-accent-sage text-xs font-heading tracking-wider uppercase">
                                {featuredProjects[0].category}
                            </span>
                            </div>
                        </div>
                        
                        <div className="p-4 sm:p-6 md:p-8 bg-white border-l-4 border-accent-gold"> {/* Changed border */} 
                            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2 sm:mb-3 text-accent-sage group-hover:text-accent-gold transition-colors duration-500">
                            {featuredProjects[0].title}
                            </h3>
                            
                            <div className="w-12 h-px bg-accent-gold mb-4 transition-all duration-500 group-hover:w-16"></div>
                            
                            <p className="text-neutral-charcoal/70 mb-4 sm:mb-6 font-body leading-relaxed text-sm sm:text-base line-clamp-3"> {/* Use line-clamp */} 
                            {featuredProjects[0].description}
                            </p>
                            
                            {/* Link to main gallery page */} 
                            <Link 
                                to={'/gallery'} 
                                className="inline-flex items-center text-accent-sage font-medium font-heading hover:text-accent-gold transition-all duration-300 group-hover:translate-x-1 text-sm sm:text-base"
                            >
                            <span className="mr-2 uppercase text-sm tracking-wide">View Gallery</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            </Link>
                        </div>
                        </div>
                    </div>
                )}
                
                {/* Secondary projects container */}
                {featuredProjects.length > 1 && (
                    <div className="flex-1 min-w-[280px] md:min-w-[30%] space-y-6 sm:space-y-8">
                        {featuredProjects.slice(1, 3).map((project, index) => (
                        <div 
                            key={project.id}
                            className={`group relative overflow-hidden transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0 translate-y-16'}`}
                            style={{ transitionDelay: `${(index + 2) * 0.2}s` }} // Stagger delay correctly
                        >
                            <div className="relative h-44 sm:h-52 overflow-hidden">
                            <div className="absolute inset-0 bg-accent-sage/10 group-hover:bg-accent-sage/0 transition-colors duration-700 z-10"></div>
                            <img 
                                src={getProjectDisplayImage(project)} // Use helper
                                alt={project.title}
                                className="w-full h-full object-cover object-center transition-all duration-1000 ease-out group-hover:scale-105"
                            />
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
                                <span className="inline-block px-2 py-1 bg-white/90 text-accent-sage text-xs font-heading tracking-wider uppercase">
                                {project.category}
                                </span>
                            </div>
                            </div>
                            
                            <div className="p-4 sm:p-6 bg-white border-l-4 border-accent-gold"> {/* Changed border */} 
                            <h3 className="text-lg sm:text-lg font-bold font-heading mb-2 text-accent-sage group-hover:text-accent-gold transition-colors duration-500 line-clamp-2"> {/* Use line-clamp */} 
                                {project.title}
                            </h3>
                            
                            <div className="w-8 h-px bg-accent-gold mb-3 transition-all duration-500 group-hover:w-12"></div>
                            
                            <p className="text-neutral-charcoal/70 mb-3 sm:mb-4 font-body leading-relaxed text-xs sm:text-sm line-clamp-2"> {/* Use line-clamp */} 
                                {project.description}
                            </p>
                            
                            {/* Link to main gallery page */} 
                            <Link 
                                to={'/gallery'} 
                                className="inline-flex items-center text-accent-sage font-medium font-heading hover:text-accent-gold transition-all duration-300 text-sm sm:text-base group-hover:translate-x-1"
                            >
                                <span className="mr-1 uppercase tracking-wide text-xs">More Projects</span> {/* Adjusted text */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </>
           )}
        </div>
        
        {/* Magazine-style call to action */}
        <div 
          className={`text-center transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '0.6s' }}
        >
          <Link 
            to="/gallery" 
            className="inline-flex items-center px-6 sm:px-10 py-3 sm:py-4 bg-accent-gold text-accent-sage font-heading tracking-wide hover:bg-accent-sage hover:text-white transition-all duration-300 shadow-sm hover:shadow group text-sm sm:text-base"
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