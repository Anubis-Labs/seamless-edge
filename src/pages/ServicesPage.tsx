import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import FAQ, { sampleFAQs } from '../components/common/FAQ';
import CallToAction from '../components/common/CallToAction';
import ProjectTimelineVisualizer from '../components/services/ProjectTimelineVisualizer';
import PageHero from '../components/common/PageHero';
import supabaseService from '../services/supabaseService';
import { FaSpinner, FaTools, FaPaintRoller, FaWrench, FaDraftingCompass } from 'react-icons/fa';

interface Service {
    id: number;
    name: string;
    description: string;
    features: string[];
    image?: string;
    image_url?: string;
    icon?: string;
    category?: string;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
    FaTools: FaTools,
    FaPaintRoller: FaPaintRoller,
    FaWrench: FaWrench,
    FaDraftingCompass: FaDraftingCompass,
};

const GetIconComponent = ({ iconName }: { iconName?: string }) => {
    if (!iconName || !iconMap[iconName]) {
        return <FaTools />;
    }
    const IconComponent = iconMap[iconName];
    return <IconComponent className="h-8 w-8 text-accent-navy" />;
};

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedServices = await supabaseService.services.getServices();
        // Process data to ensure all services have required fields
        const processedServices = (fetchedServices as Service[] || []).map(service => ({
          ...service,
          category: service.category || 'General', // Set default category if missing
          features: service.features || [] // Ensure features is an array
        }));
        setServices(processedServices);
      } catch (err: any) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Drywall Services | Seamless Edge</title>
        <meta name="description" content="Explore our premium drywall services including boarding, taping, mudding, sanding, repairs and custom textures throughout Calgary and surrounding areas." />
      </Helmet>

      {/* Hero Section */}
      <PageHero 
        title="Our Drywall Services" 
        subtitle="Premium drywall solutions with unmatched craftsmanship and attention to detail for residential and commercial spaces."
        backgroundImage="/images/updated/services/modern-kitchen-sage.jpg"
      />

      {/* Detailed Service Descriptions - Fetched from Supabase */}
      <section className="py-16 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          {isLoading && (
             <div className="text-center py-10">
                <FaSpinner className="animate-spin h-12 w-12 text-accent-forest mx-auto" />
                <p className="mt-4 text-gray-600">Loading Services...</p>
             </div>
          )}
          {error && (
             <div className="text-center py-10 bg-red-50 p-4 rounded-md">
                <p className="text-red-700 font-semibold">Error Loading Services</p>
                <p className="text-red-600 mt-2">{error}</p>
             </div>
          )}
          {!isLoading && !error && (
            <div className="flex flex-wrap gap-10 mb-16 justify-center">
              {services.map((service, index) => (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col h-full flex-1 min-w-[280px] sm:min-w-[300px] md:min-w-[45%] max-w-md md:max-w-[48%]"
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={service.image_url || service.image || '/images/placeholder.png'}
                        alt={service.name} 
                        className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" 
                      />
                      {service.category && (
                          <div className="absolute top-0 left-0 bg-accent-forest text-white py-1 px-3 text-sm font-medium rounded-br-lg">
                              {service.category}
                          </div>
                      )}
                    </div>
                    
                    <div className="p-8 flex-grow">
                      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
                        <GetIconComponent iconName={service.icon} />
                      </div>
                      <h3 className="text-2xl font-semibold font-heading mb-4 text-accent-navy">{service.name}</h3>
                      <p className="text-gray-700 mb-4 font-body">
                        {service.description}
                      </p>
                      {service.features && service.features.length > 0 && (
                        <ul className="list-disc pl-5 text-gray-700 space-y-2 font-body">
                          {service.features.map((feature, fIndex) => (
                            <li key={fIndex}>{feature}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
               ))}
            </div>
           )}
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Our Process</h2>
            <div className="w-20 h-1 bg-accent-forest mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto font-body">
              We follow a thoughtful, systematic approach to ensure excellent results on every project.
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center flex-1 min-w-[240px] max-w-[280px]"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                <span className="text-accent-navy text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold font-heading mb-2 text-accent-navy">Consultation</h3>
              <p className="text-gray-700 font-body">We start with a thorough consultation to understand your needs, timeline, and budget.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center flex-1 min-w-[240px] max-w-[280px]"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                <span className="text-accent-navy text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold font-heading mb-2 text-accent-navy">Preparation</h3>
              <p className="text-gray-700 font-body">Every project starts with detailed planning and preparation, ensuring a clean slate for flawless execution.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center flex-1 min-w-[240px] max-w-[280px]"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                <span className="text-accent-navy text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold font-heading mb-2 text-accent-navy">Precision Work</h3>
              <p className="text-gray-700 font-body">Using cutting-edge techniques and quality materials, our team meticulously applies each step with expert precision.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center flex-1 min-w-[240px] max-w-[280px]"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                <span className="text-accent-navy text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold font-heading mb-2 text-accent-navy">Final Walkthrough</h3>
              <p className="text-gray-700 font-body">After completing the project, we perform a detailed walkthrough with you to ensure every element meets our high standards—and your complete satisfaction.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Timeline Visualizer */}
      <section className="py-16 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Explore Our Project Timeline</h2>
            <div className="w-20 h-1 bg-accent-forest mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto font-body">
              See the detailed craftsmanship that goes into every phase of our drywall projects, from initial planning to final inspection.
            </p>
          </motion.div>
          
          <ProjectTimelineVisualizer className="max-w-6xl mx-auto" />
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-accent-forest mx-auto mb-6"></div>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold font-heading mb-3 text-accent-navy">What is a Level 5 finish?</h3>
              <p className="text-gray-700 font-body">It's the highest standard of drywall finishing, providing a smooth, paint-ready surface with no visible imperfections. This premium finish involves multiple layers of joint compound, extensive sanding, and a final skim coat over the entire surface.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold font-heading mb-3 text-accent-navy">How do you handle large-scale projects?</h3>
              <p className="text-gray-700 font-body">We have the resources and expertise to manage both residential and commercial projects, scaling our services to meet your needs. Our team can coordinate multiple aspects of large projects, ensuring efficient timelines without sacrificing quality.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold font-heading mb-3 text-accent-navy">Do you offer custom texture options?</h3>
              <p className="text-gray-700 font-body">Absolutely. We can create a variety of textures to suit your style, from subtle knockdown finishes to more distinctive custom patterns. Our artisans are skilled in creating both contemporary and traditional texture styles to complement your design vision.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gray-50 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold font-heading mb-3 text-accent-navy">What is the timeline for a typical drywall project?</h3>
              <p className="text-gray-700 font-body">Project timelines vary based on size, complexity, and finishing requirements. A standard room might take 3-5 days from boarding to final sanding, while larger projects require more time. During your consultation, we'll provide a detailed timeline specific to your project.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ 
        faqs={sampleFAQs} 
        title="Common Questions About Our Services"
        subtitle="Find answers to frequently asked questions about our drywall services and processes"
        backgroundColor="bg-white"
      />

      {/* Call to Action */}
      <CallToAction 
        title="Ready to Start Your Project?"
        subtitle="Contact us today for a free consultation and estimate on your drywall needs."
        primaryButtonText="Get a Free Quote"
        secondaryButtonText="See Our Work"
        image="/images/updated/services/sage-living-room.jpg"
      />

      {/* Service Areas */}
      <section className="py-16 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          {/* ... content ... */}
        </div>
      </section>
    </>
  );
};

export default ServicesPage; 