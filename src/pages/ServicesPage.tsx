import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import FAQ, { sampleFAQs } from '../components/common/FAQ';
import CallToAction from '../components/common/CallToAction';
import ProjectTimelineVisualizer from '../components/services/ProjectTimelineVisualizer';
import PageHero from '../components/common/PageHero';

const ServicesPage: React.FC = () => {
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
        backgroundImage="/images/services/drywall-installation.jpg"
      />

      {/* Detailed Service Descriptions */}
      <section className="py-16 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {/* Boarding & Installation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col h-full"
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src="/images/services/drywall-installation.jpg" 
                    alt="Drywall installation" 
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-0 left-0 bg-accent-forest text-white py-1 px-3 text-sm font-medium">
                    Installation
                  </div>
                </div>
                
                <div className="p-8 flex-grow">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold font-heading mb-4 text-accent-navy">Boarding & Installation</h3>
                  <p className="text-gray-700 mb-4 font-body">
                    From the moment we arrive, our team ensures a solid foundation with precision boarding and installation services. We use only the highest quality materials to guarantee durability and an even surface ready for finishing.
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2 font-body">
                    <li>Precise measurements and cutting</li>
                    <li>Sturdy, gap-free installation</li>
                    <li>Premium materials for durability</li>
                    <li>Proper framing preparation</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Taping & Mudding */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src="/images/services/drywall-taping.jpg" 
                    alt="Drywall taping tools" 
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-0 left-0 bg-accent-forest text-white py-1 px-3 text-sm font-medium">
                    Finishing
                  </div>
                </div>
                
                <div className="p-8 flex-grow">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0 0L9.121 9.121" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold font-heading mb-4 text-accent-navy">Taping & Mudding</h3>
                  <p className="text-gray-700 mb-4 font-body">
                    Our taping and mudding services are executed with surgical precision. We apply premium joint compounds and tape to create seamless transitions that prepare your walls for that perfect final touch.
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2 font-body">
                    <li>Expert seam concealment</li>
                    <li>Precise corner treatments</li>
                    <li>Premium compounds for durability</li>
                    <li>Multiple coats for flawless finish</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Sanding & Finishing */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col h-full"
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src="/images/services/texture-application.jpg" 
                    alt="Textured wall detail" 
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-0 left-0 bg-accent-forest text-white py-1 px-3 text-sm font-medium">
                    Perfection
                  </div>
                </div>
                
                <div className="p-8 flex-grow">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold font-heading mb-4 text-accent-navy">Sanding & Finishing</h3>
                  <p className="text-gray-700 mb-4 font-body">
                    Finishing is where our true craftsmanship shines. With expert sanding and polish techniques, we transform rough surfaces into smooth, immaculate canvases that enhance any space.
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2 font-body">
                    <li>Dust-controlled sanding processes</li>
                    <li>Meticulous surface preparation</li>
                    <li>Levels 1-5 finishing options</li>
                    <li>Ready-for-paint surfaces</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Repairs & Custom Textures */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col h-full"
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src="/images/services/tools.jpg" 
                    alt="Professional construction tools" 
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-0 left-0 bg-accent-forest text-white py-1 px-3 text-sm font-medium">
                    Custom Work
                  </div>
                </div>
                
                <div className="p-8 flex-grow">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold font-heading mb-4 text-accent-navy">Repairs & Custom Textures</h3>
                  <p className="text-gray-700 mb-4 font-body">
                    Whether it's a small repair or a completely custom finish, we offer tailored solutions. Choose from a variety of textures—from knockdown to orange peel—to match your aesthetic and practical needs.
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2 font-body">
                    <li>Hole and crack repairs</li>
                    <li>Water damage restoration</li>
                    <li>Custom texture matching</li>
                    <li>Decorative texture options</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
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
              className="text-center"
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
              className="text-center"
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
              className="text-center"
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
        image="/images/services/drywall-installation.jpg"
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