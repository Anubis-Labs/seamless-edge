import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const ServicesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Our Drywall Services | Seamless Edge</title>
        <meta name="description" content="Explore our premium drywall services including boarding, taping, mudding, sanding, repairs and custom textures throughout Calgary and surrounding areas." />
      </Helmet>

      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Drywall Services</h1>
          <p className="text-xl mb-0">Premium drywall solutions with unmatched craftsmanship and attention to detail</p>
        </div>
      </section>

      {/* Detailed Service Descriptions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gray-100 rounded-lg p-8 h-full">
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Boarding & Installation</h3>
                <p className="text-gray-700 mb-4">
                  From the moment we arrive, our team ensures a solid foundation with precision boarding and installation services. We use only the highest quality materials to guarantee durability and an even surface ready for finishing.
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Precise measurements and cutting</li>
                  <li>Sturdy, gap-free installation</li>
                  <li>Premium materials for durability</li>
                  <li>Proper framing preparation</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gray-100 rounded-lg p-8 h-full">
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0 0L9.121 9.121" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Taping & Mudding</h3>
                <p className="text-gray-700 mb-4">
                  Our taping and mudding services are executed with surgical precision. We apply premium joint compounds and tape to create seamless transitions that prepare your walls for that perfect final touch.
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Expert seam concealment</li>
                  <li>Precise corner treatments</li>
                  <li>Premium compounds for durability</li>
                  <li>Multiple coats for flawless finish</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-gray-100 rounded-lg p-8 h-full">
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Sanding & Finishing</h3>
                <p className="text-gray-700 mb-4">
                  Finishing is where our true craftsmanship shines. With expert sanding and polish techniques, we transform rough surfaces into smooth, immaculate canvases that enhance any space.
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Dust-controlled sanding processes</li>
                  <li>Meticulous surface preparation</li>
                  <li>Levels 1-5 finishing options</li>
                  <li>Ready-for-paint surfaces</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-gray-100 rounded-lg p-8 h-full">
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Repairs & Custom Textures</h3>
                <p className="text-gray-700 mb-4">
                  Whether it's a small repair or a completely custom finish, we offer tailored solutions. Choose from a variety of textures—from knockdown to orange peel—to match your aesthetic and practical needs.
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Hole and crack repairs</li>
                  <li>Water damage restoration</li>
                  <li>Custom texture matching</li>
                  <li>Decorative texture options</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultation</h3>
              <p className="text-gray-700">We begin with a thorough consultation, discussing your vision and assessing your space.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Preparation</h3>
              <p className="text-gray-700">Every project starts with detailed planning and preparation, ensuring a clean slate for flawless execution.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Precision Work</h3>
              <p className="text-gray-700">Using cutting-edge techniques and quality materials, our team meticulously applies each step with expert precision.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-primary text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Final Walkthrough</h3>
              <p className="text-gray-700">After completing the project, we perform a detailed walkthrough with you to ensure every element meets our high standards—and your complete satisfaction.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">What is a Level 5 finish?</h3>
              <p className="text-gray-700">It's the highest standard of drywall finishing, providing a smooth, paint-ready surface with no visible imperfections. This premium finish involves multiple layers of joint compound, extensive sanding, and a final skim coat over the entire surface.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">How do you handle large-scale projects?</h3>
              <p className="text-gray-700">We have the resources and expertise to manage both residential and commercial projects, scaling our services to meet your needs. Our team can coordinate multiple aspects of large projects, ensuring efficient timelines without sacrificing quality.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Do you offer custom texture options?</h3>
              <p className="text-gray-700">Absolutely. We can create a variety of textures to suit your style, from subtle knockdown finishes to more distinctive custom patterns. Our artisans are skilled in creating both contemporary and traditional texture styles to complement your design vision.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">What is the timeline for a typical drywall project?</h3>
              <p className="text-gray-700">Project timelines vary based on size, complexity, and finishing requirements. A standard room might take 3-5 days from boarding to final sanding, while larger projects require more time. During your consultation, we'll provide a detailed timeline specific to your project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Contact us today to discuss your drywall project and experience the Seamless Edge difference—where quality craftsmanship meets exceptional service.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/quote" className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300">Get a Free Quote</a>
            <a href="/contact" className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition duration-300">Contact Us</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage; 