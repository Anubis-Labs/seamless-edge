import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Sample project data - in a real app, this would come from a backend
const projects = [
  {
    id: 1,
    title: 'Modern Basement Renovation',
    description: 'Complete drywall installation with Level 5 finish in a newly renovated basement.',
    category: 'Basements',
    location: 'Airdrie, AB',
    imageBefore: '/images/projects/basement-before.jpg',
    imageAfter: '/images/projects/basement-after.jpg',
    featured: true
  },
  {
    id: 2,
    title: 'Custom Texture Application',
    description: 'Applied an elegant knockdown texture to bring character to this living room.',
    category: 'Custom Textures',
    location: 'Calgary, AB',
    imageBefore: '/images/projects/texture-before.jpg',
    imageAfter: '/images/projects/texture-after.jpg',
    featured: true
  },
  {
    id: 3,
    title: 'Executive Office Space',
    description: 'Commercial drywall installation and finishing for a new executive office.',
    category: 'Commercial',
    location: 'Calgary, AB',
    imageBefore: '/images/projects/office-before.jpg',
    imageAfter: '/images/projects/office-after.jpg',
    featured: false
  },
  {
    id: 4,
    title: 'Water Damage Repair',
    description: 'Full restoration of water-damaged walls with seamless patching and finishing.',
    category: 'Repairs',
    location: 'Cochrane, AB',
    imageBefore: '/images/projects/repair-before.jpg',
    imageAfter: '/images/projects/repair-after.jpg',
    featured: false
  },
  {
    id: 5,
    title: 'New Home Construction',
    description: 'Complete drywall services for a new luxury home construction.',
    category: 'New Builds',
    location: 'Chestermere, AB',
    imageBefore: '/images/projects/newbuild-before.jpg',
    imageAfter: '/images/projects/newbuild-after.jpg',
    featured: true
  },
  {
    id: 6,
    title: 'Kitchen Renovation',
    description: 'Precision drywall work for a modern kitchen renovation.',
    category: 'Renovations',
    location: 'Calgary, AB',
    imageBefore: '/images/projects/kitchen-before.jpg',
    imageAfter: '/images/projects/kitchen-after.jpg',
    featured: true
  }
];

// For demo purposes, we'll create placeholder image URLs
// These would be replaced with actual images in production
const getPlaceholderImage = (type: string, id: number) => {
  return `https://source.unsplash.com/random/800x600?drywall,${type},${id}`;
};

// Filter categories
const categories = ['All', 'Basements', 'New Builds', 'Commercial', 'Repairs', 'Custom Textures', 'Renovations'];

const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sliderValues, setSliderValues] = useState<{[key: number]: number}>({});
  
  // Handle slider change for before/after effect
  const handleSliderChange = (projectId: number, value: number) => {
    setSliderValues(prev => ({
      ...prev,
      [projectId]: value
    }));
  };
  
  // Filter projects based on selected category
  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Project Gallery | Seamless Edge</title>
        <meta name="description" content="Browse our portfolio of stunning drywall projects. See before and after transformations showcasing our craftsmanship in Calgary and surrounding areas." />
      </Helmet>

      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Project Gallery</h1>
          <p className="text-xl mb-0">Browse our completed projects and see the transformation we can bring to your space</p>
        </div>
      </section>
      
      {/* Gallery Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <p className="text-xl mb-8">
            Visual proof is our strongest advocate. Browse our project gallery to see the transformation of spaces—each image a story of precision, care, and excellence.
          </p>
          
          {/* Filter Controls */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Filter Projects</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Projects */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Transformations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects
              .filter(project => project.featured)
              .map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-lg"
                >
                  {/* Before/After Slider */}
                  <div className="relative h-64 overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ 
                        backgroundImage: `url(${project.imageAfter || getPlaceholderImage('after', project.id)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div 
                      className="absolute top-0 left-0 h-full"
                      style={{ 
                        width: `${sliderValues[project.id] || 50}%`,
                        backgroundImage: `url(${project.imageBefore || getPlaceholderImage('before', project.id)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRight: '3px solid white'
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValues[project.id] || 50}
                      onChange={(e) => handleSliderChange(project.id, parseInt(e.target.value))}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 z-10"
                    />
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      Before & After
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <p className="text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
      
      {/* All Projects */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">All Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md"
              >
                <div 
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.imageAfter || getPlaceholderImage('after', project.id)})` }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  <p className="text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project.location}
                  </p>
                  <button className="mt-4 text-primary font-medium hover:underline flex items-center">
                    View Project Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Own Transformation?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Let us bring the same level of craftsmanship and attention to detail to your next project.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/quote" className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300">Get a Free Quote</a>
            <a href="/contact" className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition duration-300">Contact Us</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default GalleryPage; 