import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageHero from '../components/common/PageHero';
import BeforeAfterSlider from '../components/common/BeforeAfterSlider';
import supabaseService from '../services/supabaseService';
import { FaSpinner } from 'react-icons/fa';

// Define Project type based on expected Supabase table structure
interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  location?: string;
  image_url_before: string;
  image_url_after: string;
  featured?: boolean;
}

const GalleryPage: React.FC = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [sliderPositions, setSliderPositions] = useState<{[key: number]: number}>({});

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProjects = await supabaseService.gallery.getProjects();
        const projectsData = (fetchedProjects as Project[] || []);
        setAllProjects(projectsData);

        // Dynamically generate categories
        const uniqueCategories = ['All', ...new Set(projectsData.map(p => p.category).filter(Boolean) as string[])];
        setCategories(uniqueCategories);

        // Initialize slider positions
        const initialPositions: {[key: number]: number} = {};
        projectsData.forEach(project => {
            initialPositions[project.id] = 50; // Start at the middle
        });
        setSliderPositions(initialPositions);

      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on selected category
  const filteredProjects = allProjects.filter(project => 
    selectedCategory === 'All' || project.category === selectedCategory
  );

  // Get featured projects from the *original* list, not the filtered one
  const featuredProjects = allProjects.filter(project => project.featured);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSliderChange = (projectId: number, value: number) => {
    setSliderPositions(prev => ({
      ...prev,
      [projectId]: value
    }));
  };

  const openProject = (project: Project) => {
    setActiveProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setActiveProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <Helmet>
        <title>Project Gallery | Seamless Edge Drywall Services</title>
        <meta name="description" content="Browse our gallery of drywall installation, finishing, and repair projects throughout Calgary. See before and after transformations and the quality of our work." />
        <meta name="keywords" content="drywall projects, drywall gallery, drywall before after, Calgary drywall, drywall repair examples, texture examples" />
        <link rel="canonical" href="https://seamlessedgeco.com/gallery" />
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="Drywall Project Gallery | Seamless Edge" />
        <meta property="og:description" content="See our stunning drywall transformations across Calgary and surrounding areas." />
        <meta property="og:image" content="/images/services/texture-application.jpg" />
        <meta property="og:url" content="https://seamlessedgeco.com/gallery" />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageHero 
        title="Project Gallery" 
        subtitle="Browse our portfolio of drywall transformations and see our craftsmanship in action."
        backgroundImage="/images/updated/gallery/after-renovation.jpg"
      />

      {/* Category Filters */}
      <section className="py-12 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                  selectedCategory === category 
                    ? 'bg-accent-navy text-white shadow-md'
                    : 'bg-white text-accent-navy hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
                disabled={isLoading}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading && (
             <div className="text-center py-16">
                <FaSpinner className="animate-spin h-12 w-12 text-accent-forest mx-auto" />
                <p className="mt-4 text-gray-600">Loading Projects...</p>
             </div>
          )}
          {/* Error State */}
          {error && (
             <div className="text-center py-16 bg-red-50 p-6 rounded-md max-w-2xl mx-auto">
                <p className="text-red-700 font-semibold text-xl">Error Loading Projects</p>
                <p className="text-red-600 mt-3">{error}</p>
             </div>
          )}

          {/* Projects Grid - Fetched Data */} 
          {!isLoading && !error && (
            <>
              <div className="flex flex-wrap gap-8 justify-center">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    variants={fadeIn}
                    className="flex-1 min-w-[300px] max-w-md bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                    onClick={() => openProject(project)}
                  >
                    {/* Project Card */}
                    <div className="relative h-56 overflow-hidden">
                      <BeforeAfterSlider 
                        beforeImage={project.image_url_before || '/images/placeholder.png'}
                        afterImage={project.image_url_after || '/images/placeholder.png'}
                        beforeAlt={`Before: ${project.title}`}
                        afterAlt={`After: ${project.title}`}
                        initialPosition={sliderPositions[project.id] || 50}
                        className="w-full h-full"
                      />
                    </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold font-heading text-accent-navy group-hover:text-accent-forest transition-colors duration-300">{project.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 font-body line-clamp-3">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-body flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-accent-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {project.location || 'Location N/A'}
                        </span>
                        <span className="text-sm text-accent-forest font-medium font-body">View Details</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* No Projects Found Message */} 
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-accent-navy mb-2">No projects found</h3>
                  <p className="text-gray-600">We couldn't find any projects in the '{selectedCategory}' category.</p>
                  <button 
                    onClick={() => setSelectedCategory("All")}
                    className="mt-4 px-6 py-2 bg-accent-forest text-white rounded-md hover:bg-accent-navy transition-colors duration-300"
                  >
                    View All Projects
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Project Spotlight Section - Uses Fetched Data */}
      {!isLoading && featuredProjects.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-accent-navy">Project Spotlights</h2>
              <div className="w-24 h-1 bg-accent-forest mx-auto mb-6"></div>
              <p className="text-gray-700 max-w-2xl mx-auto">
                See how our expert craftsmanship has transformed these spaces. From major renovations to subtle repairs,
                these spotlighted projects showcase our attention to detail and commitment to quality.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-12 justify-center">
              {featuredProjects.slice(0, 2)
                .map((project, index) => (
                  <motion.div
                    key={`spotlight-${project.id}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.2 }}
                    variants={fadeIn}
                    className="bg-gradient-to-b from-neutral-offwhite/50 to-white rounded-lg overflow-hidden shadow-lg flex-1 min-w-[300px] max-w-2xl"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-1/2 min-h-[300px]">
                        <img 
                          src={project.image_url_after || '/images/placeholder.png'}
                          alt={project.title} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end">
                          <div className="p-6">
                            <div className="bg-accent-forest text-white text-xs inline-block px-2 py-1 rounded-full mb-2">
                              {project.category}
                            </div>
                            <h3 className="text-xl font-bold text-white">{project.title}</h3>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 md:w-1/2 flex flex-col justify-between">
                        <div>
                          <p className="text-gray-700 mb-4 font-body">{project.description}</p>
                        </div>
                        <button 
                          onClick={() => openProject(project)}
                          className="self-end mt-4 bg-accent-forest text-white px-4 py-2 rounded hover:bg-accent-navy transition-colors duration-300 flex items-center"
                        >
                          View Project Details
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section (Static) */}
      <div className="max-w-3xl mx-auto text-center my-24">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-accent-navy mb-4"
        >
          Ready to Transform Your Space?
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-lg text-gray-600 mb-8"
        >
          Let our experienced team bring your vision to life with precision and artistry.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <a 
            href="/contact" 
            className="inline-block px-8 py-4 bg-accent-forest text-white rounded-lg shadow-md hover:shadow-lg hover:bg-accent-navy transition-all duration-300"
          >
            Request a Consultation
          </a>
        </motion.div>
      </div>

      {/* Project Detail Modal - Updated */}
      {activeProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeProject}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeProject}
              className="absolute top-3 right-3 z-10 h-10 w-10 bg-white/70 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content using activeProject state */} 
            <div className="flex flex-col lg:flex-row">
              {/* Project Visuals */}
              <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-[600px] bg-gray-100">
                <BeforeAfterSlider 
                  beforeImage={activeProject.image_url_before || '/images/placeholder.png'}
                  afterImage={activeProject.image_url_after || '/images/placeholder.png'}
                  beforeAlt={`Before: ${activeProject.title}`}
                  afterAlt={`After: ${activeProject.title}`}
                  initialPosition={sliderPositions[activeProject.id] || 50}
                  showLabels={true}
                />
              </div>
              
              {/* Project Details */}
              <div className="p-8 lg:w-1/2">
                <div className="bg-accent-forest text-white text-sm inline-block px-3 py-1 rounded-full mb-3">
                  {activeProject.category}
                </div>
                
                <h2 className="text-3xl font-bold font-heading text-accent-navy mb-4">{activeProject.title}</h2>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{activeProject.location || 'Location N/A'}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-xl font-semibold font-heading text-accent-navy mb-4">Project Details</h3>
                  <p className="text-gray-700 mb-6 font-body">{activeProject.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-8">
                  <a 
                    href="/quote" 
                    className="px-6 py-3 bg-accent-forest text-white font-medium rounded hover:bg-accent-navy transition-colors duration-300 flex items-center"
                  >
                    Get a Quote
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                  <a 
                    href="/contact" 
                    className="px-6 py-3 bg-gray-100 text-accent-navy font-medium rounded hover:bg-gray-200 transition-colors duration-300"
                  >
                    Discuss Your Project
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default GalleryPage; 