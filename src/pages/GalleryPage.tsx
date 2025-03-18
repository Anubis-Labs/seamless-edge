import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageHero from '../components/common/PageHero';
import BeforeAfterSlider from '../components/common/BeforeAfterSlider';

// Sample project data - in a real app, this would come from a backend
const projects = [
  {
    id: 1,
    title: 'Modern Basement Renovation',
    description: 'Complete drywall installation with Level 5 finish in a newly renovated basement.',
    category: 'Basements',
    location: 'Airdrie, AB',
    imageBefore: '/images/services/drywall-installation.jpg',
    imageAfter: '/images/services/texture-application.jpg',
    featured: true,
    testimonial: "Seamless Edge transformed our unfinished basement into a stunning living space. Their attention to detail was remarkable.",
    client: "The Thompson Family"
  },
  {
    id: 2,
    title: 'Custom Texture Application',
    description: 'Applied an elegant knockdown texture to bring character to this living room.',
    category: 'Custom Textures',
    location: 'Calgary, AB',
    imageBefore: '/images/services/drywall-taping.jpg',
    imageAfter: '/images/services/drywall-installation.jpg',
    featured: true,
    testimonial: "We wanted something unique for our living room walls, and the custom texture exceeded our expectations!",
    client: "Mark & Sarah Johnson"
  },
  {
    id: 3,
    title: 'Executive Office Space',
    description: 'Commercial drywall installation and finishing for a new executive office.',
    category: 'Commercial',
    location: 'Calgary, AB',
    imageBefore: '/images/services/tools.jpg',
    imageAfter: '/images/services/texture-application.jpg',
    featured: false,
    testimonial: "Professional, efficient, and top-quality work. Our new office looks impeccable.",
    client: "Apex Business Solutions"
  },
  {
    id: 4,
    title: 'Water Damage Repair',
    description: 'Full restoration of water-damaged walls with seamless patching and finishing.',
    category: 'Repairs',
    location: 'Cochrane, AB',
    imageBefore: '/images/services/drywall-installation.jpg',
    imageAfter: '/images/services/tools.jpg',
    featured: false,
    testimonial: "After significant water damage, I couldn't believe how perfectly they restored our walls. You can't tell there was ever any damage!",
    client: "Rebecca & Jason Miller"
  },
  {
    id: 5,
    title: 'New Home Construction',
    description: 'Complete drywall services for a new luxury home construction.',
    category: 'New Construction',
    location: 'Calgary, AB',
    imageBefore: '/images/services/consultation.jpg',
    imageAfter: '/images/services/texture-application.jpg',
    featured: true,
    testimonial: "The quality of work in our new home is exceptional. Every corner, every edge is perfect.",
    client: "The Wilsons"
  },
  {
    id: 6,
    title: 'Ceiling Repair & Texture',
    description: 'Repaired damaged ceiling and applied a matching popcorn texture.',
    category: 'Repairs',
    location: 'Airdrie, AB',
    imageBefore: '/images/services/tools.jpg',
    imageAfter: '/images/services/drywall-taping.jpg',
    featured: false,
    testimonial: "They matched our existing ceiling texture perfectly. You can't tell where the repair was done.",
    client: "Helen Martinez"
  },
  {
    id: 7,
    title: 'Open Concept Renovation',
    description: 'Removed load-bearing wall and refinished all connecting walls and ceilings.',
    category: 'Renovations',
    location: 'Calgary, AB',
    imageBefore: '/images/services/drywall-taping.jpg',
    imageAfter: '/images/services/texture-application.jpg',
    featured: true,
    testimonial: "Our renovation required significant drywall work, and Seamless Edge made the transition between old and new walls completely invisible.",
    client: "The Peterson Family"
  },
  {
    id: 8,
    title: 'Craftsman Home Restoration',
    description: 'Restoration of damaged plaster walls in a historic craftsman home.',
    category: 'Repairs',
    location: 'Calgary, AB',
    imageBefore: '/images/services/consultation.jpg',
    imageAfter: '/images/services/drywall-installation.jpg',
    featured: false,
    testimonial: "They took great care with our historic home, preserving its character while updating the walls.",
    client: "James & Emily Thompson"
  }
];

// Extract unique categories
const categories = ['All', ...new Set(projects.map(project => project.category))];

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [sliderPositions, setSliderPositions] = useState<{[key: number]: number}>({});
  const [isLoading, setIsLoading] = useState(true);

  // For fade animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Simulate loading images
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Initialize slider positions
  useEffect(() => {
    const initialPositions: {[key: number]: number} = {};
    projects.forEach(project => {
      initialPositions[project.id] = 50; // Start at the middle
    });
    setSliderPositions(initialPositions);
  }, []);

  // Filter projects by category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory]);

  const handleSliderChange = (projectId: number, value: number) => {
    setSliderPositions(prev => ({
      ...prev,
      [projectId]: value
    }));
  };

  const openProject = (id: number) => {
    setActiveProject(id);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setActiveProject(null);
    // Re-enable body scrolling when modal is closed
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

      {/* Page Hero */}
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
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'bg-accent-gold text-accent-sage shadow-md' 
                    : 'bg-white text-accent-sage hover:bg-accent-sage/10'
                }`}
                onClick={() => setSelectedCategory(category)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden h-80"
                >
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
                  </div>
                </motion.div>
              ))
            ) : (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  variants={fadeIn}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                  onClick={() => openProject(project.id)}
                >
                  {/* Project Card */}
                  <div className="relative h-56 overflow-hidden">
                    <BeforeAfterSlider 
                      beforeImage={project.imageBefore}
                      afterImage={project.imageAfter}
                      beforeAlt={`Before: ${project.title}`}
                      afterAlt={`After: ${project.title}`}
                      initialPosition={sliderPositions[project.id] || 50}
                      className="w-full h-full"
                    />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold font-heading text-accent-sage group-hover:text-accent-gold transition-colors duration-300">{project.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 font-body">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-body flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {project.location}
                      </span>
                      <span className="text-sm text-accent-gold font-medium font-body">View Details</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          {filteredProjects.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-accent-sage mb-2">No projects found</h3>
              <p className="text-gray-600">We couldn't find any projects in that category. Please try another category.</p>
              <button 
                onClick={() => setSelectedCategory("All")}
                className="mt-4 px-6 py-2 bg-accent-gold text-accent-sage rounded-md hover:bg-accent-gold/80 transition-colors duration-300"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Project Spotlight Section */}
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
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-accent-sage">Project Spotlights</h2>
            <div className="w-24 h-1 bg-accent-gold mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              See how our expert craftsmanship has transformed these spaces. From major renovations to subtle repairs,
              these spotlighted projects showcase our attention to detail and commitment to quality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {projects
              .filter(project => project.featured)
              .slice(0, 2)
              .map((project, index) => (
                <motion.div
                  key={`spotlight-${project.id}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  variants={fadeIn}
                  className="bg-gradient-to-b from-neutral-offwhite/50 to-white rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-full min-h-[300px]">
                      <img 
                        src={project.imageAfter} 
                        alt={project.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end">
                        <div className="p-6">
                          <div className="bg-accent-gold text-accent-sage text-xs inline-block px-2 py-1 rounded-full mb-2">
                            {project.category}
                          </div>
                          <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <p className="text-gray-700 mb-4 font-body">{project.description}</p>
                        <div className="bg-gradient-to-b from-neutral-offwhite/50 to-white p-4 rounded-lg mb-4">
                          <blockquote className="relative text-gray-700 italic text-sm font-body">
                            <svg className="absolute -top-2 -left-2 h-6 w-6 text-accent-gold/20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            {project.testimonial}
                            <div className="mt-2 text-right text-xs font-medium text-accent-sage">- {project.client}</div>
                          </blockquote>
                        </div>
                      </div>
                      <button 
                        onClick={() => openProject(project.id)}
                        className="self-end bg-accent-gold text-accent-sage px-4 py-2 rounded hover:bg-accent-gold/80 transition-colors duration-300 flex items-center"
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

      {/* Beautiful Call to Action */}
      <div className="max-w-3xl mx-auto text-center my-24">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-accent-gold mb-4"
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
            className="inline-block px-8 py-4 bg-accent-gold text-accent-gold rounded-lg shadow-md hover:shadow-lg hover:bg-accent-gold hover:text-white transition-all duration-300"
          >
            Request a Consultation
          </a>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      {activeProject !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={closeProject}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeProject}
              className="absolute top-4 right-4 z-10 h-10 w-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {projects.filter(p => p.id === activeProject).map(project => (
              <div key={`modal-${project.id}`} className="grid grid-cols-1 lg:grid-cols-2">
                {/* Project Visuals */}
                <div className="relative h-full min-h-[300px] lg:min-h-[600px]">
                  <BeforeAfterSlider 
                    beforeImage={project.imageBefore}
                    afterImage={project.imageAfter}
                    beforeAlt={`Before: ${project.title}`}
                    afterAlt={`After: ${project.title}`}
                    initialPosition={sliderPositions[project.id] || 50}
                    showLabels={true}
                  />
                </div>
                
                {/* Project Details */}
                <div className="p-8">
                  <div className="bg-accent-gold text-accent-sage text-sm inline-block px-3 py-1 rounded-full mb-2">
                    {project.category}
                  </div>
                  
                  <h2 className="text-3xl font-bold font-heading text-accent-sage mb-4">{project.title}</h2>
                  
                  <div className="flex items-center text-gray-600 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{project.location}</span>
                  </div>
                  
                  <div className="border-t border-b border-gray-200 py-6 mb-6">
                    <h3 className="text-xl font-semibold font-heading text-accent-sage mb-4">Project Details</h3>
                    <p className="text-gray-700 mb-6 font-body">{project.description}</p>
                    <p className="text-gray-700 font-body">
                      This project showcases our expertise in {project.category.toLowerCase()} work, where our team provided expert drywall solutions that transformed the space completely. Our craftsmen paid careful attention to every detail, ensuring a flawless finish that will stand the test of time.
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold font-heading text-accent-sage mb-4">Client Testimonial</h3>
                    <div className="bg-gradient-to-b from-neutral-offwhite/50 to-white p-6 rounded-lg">
                      <blockquote className="relative text-gray-700 italic font-body">
                        <svg className="absolute -top-2 -left-2 h-8 w-8 text-accent-gold/20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="ml-6">{project.testimonial}</p>
                        <div className="mt-4 text-right font-semibold text-accent-sage">- {project.client}</div>
                      </blockquote>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="/quote" 
                      className="px-6 py-3 bg-accent-gold text-accent-sage font-medium rounded hover:bg-accent-gold/80 transition-colors duration-300 flex items-center"
                    >
                      Get a Similar Result
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                    <a 
                      href="/contact" 
                      className="px-6 py-3 bg-accent-gold text-accent-sage font-medium rounded hover:bg-accent-gold/80 transition-colors duration-300"
                    >
                      Discuss Your Project
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default GalleryPage; 