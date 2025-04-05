import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import PageHero from '../components/common/PageHero';

const AboutPage: React.FC = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Helmet>
        <title>About Seamless Edge | Our Story & Team</title>
        <meta name="description" content="Learn about Seamless Edge, our story, our dedicated team, and our commitment to excellence in drywall and finishing services in Calgary, Alberta." />
      </Helmet>

      {/* Page Hero */}
      <PageHero 
        title="About Seamless Edge" 
        subtitle="Get to know the passionate team behind Calgary's premier drywall finishing experts."
        backgroundImage="/images/services/consultation.jpg"
      />

      {/* Our Story Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeIn}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-accent-navy">Our Story</h2>
              <div className="w-16 h-1 bg-accent-forest mb-6"></div>
              <p className="text-gray-700 mb-6 font-body">
                Founded by Steve & Allie, Seamless Edge Co. began as a family passion for quality and precision. 
                What started as a small local operation has grown into a trusted name in drywall and interior finishing, 
                with every project reflecting our dedication to craftsmanship and personal service.
              </p>
              <p className="text-gray-700 font-body">
                Based in Calgary, we've spent years perfecting our craft and building a reputation for excellence
                throughout Alberta. Our journey has been defined by a commitment to doing things right the first time
                and treating every client's space with the same care we would our own.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variants={fadeIn}
              className="rounded-lg overflow-hidden shadow-xl flex-1"
            >
              <img 
                src="/images/services/drywall-installation.jpg" 
                alt="The founding team of Seamless Edge Co." 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Philosophy */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeIn}
              className="order-2 md:order-1 rounded-lg overflow-hidden shadow-xl flex-1"
            >
              <img 
                src="/images/services/texture-application.jpg" 
                alt="Seamless Edge craftsman at work" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variants={fadeIn}
              className="order-1 md:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-accent-navy">Craftsmanship Philosophy</h2>
              <div className="w-16 h-1 bg-accent-forest mb-6"></div>
              <p className="text-gray-700 mb-6 font-body">
                Our philosophy is simple: never settle for second best. Every board, every tape, every finish 
                is executed with an unwavering commitment to perfection. We believe that your home or business 
                deserves the very best—and we deliver that every time.
              </p>
              <p className="text-gray-700 font-body">
                This dedication to quality means we never cut corners, we always use premium materials, and we take 
                the time to ensure every detail is perfect. It's not just about completing a job—it's about creating 
                spaces that stand the test of time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-neutral-offwhite/50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-forest/5 rounded-full transform -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-navy/5 rounded-full transform translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-accent-navy">Meet the Team</h2>
            <div className="w-20 h-1 bg-accent-forest mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto font-body">
              Our success is built on the expertise and dedication of our skilled team members. Together, we bring decades of experience and a passion for perfection to every project.
            </p>
          </motion.div>
          
          <div className="flex flex-wrap gap-8 md:gap-12 mb-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              variants={fadeIn}
              className="flex-1 w-full lg:w-[calc(50%-24px)]"
            >
              <div className="flex flex-col items-center gap-4">
                {/* Square image above the card */}
                <div className="w-full aspect-square max-w-xs rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-4 border-accent-forest/10">
                  <img 
                    src="/images/services/tools.jpg" 
                    alt="Steve, Co-founder" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Card content */}
                <div className="bg-white w-full p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold font-heading mb-2 text-accent-navy text-center">Steve</h3>
                  <p className="text-accent-forest font-medium mb-4 text-center">Co-founder & Master Craftsman</p>
                  <p className="text-gray-700 font-body">
                    With over 15 years of experience in drywall installation and finishing, 
                    Steve brings unparalleled expertise to every project. His attention to detail
                    and commitment to quality craftsmanship sets the standard for our entire team.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              variants={fadeIn}
              className="flex-1 w-full lg:w-[calc(50%-24px)]"
            >
              <div className="flex flex-col items-center gap-4">
                {/* Square image above the card */}
                <div className="w-full aspect-square max-w-xs rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-4 border-accent-forest/10">
                  <img 
                    src="/images/services/consultation.jpg" 
                    alt="Allie, Co-founder" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Card content */}
                <div className="bg-white w-full p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold font-heading mb-2 text-accent-navy text-center">Allie</h3>
                  <p className="text-accent-forest font-medium mb-4 text-center">Co-founder & Operations Director</p>
                  <p className="text-gray-700 font-body">
                    Allie's keen eye for detail and project management expertise ensures that 
                    every job runs smoothly from start to finish. She oversees client communications,
                    scheduling, and quality control to deliver a seamless experience.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            variants={fadeIn}
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <h3 className="text-2xl font-bold font-heading mb-4 text-center text-accent-navy">Our Skilled Team</h3>
            <p className="text-gray-700 text-center mb-8 font-body max-w-3xl mx-auto">
              Our team is more than just professionals—we're artisans. Each member shares our passion for quality, 
              working together to deliver results that not only meet but exceed client expectations.
            </p>
            <div className="flex flex-wrap gap-6 sm:gap-8 justify-center">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="text-center transform hover:scale-105 transition-transform duration-300 flex-1 min-w-[120px] max-w-[150px]">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 shadow-md border-2 border-accent-forest/10">
                    <img 
                      src={`/images/services/${num === 1 ? 'drywall-installation.jpg' : num === 2 ? 'drywall-taping.jpg' : num === 3 ? 'texture-application.jpg' : 'tools.jpg'}`}
                      alt={`Team member ${num}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-medium text-accent-navy">Team Member {num}</p>
                  <p className="text-sm text-gray-600 font-body">{num === 1 ? 'Installation Expert' : num === 2 ? 'Finishing Specialist' : num === 3 ? 'Texture Artist' : 'Quality Inspector'}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Future Vision */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-neutral-offwhite/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-sage/5 rounded-full transform -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-forest/5 rounded-full transform translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-accent-navy">Our Future Vision</h2>
            <div className="w-20 h-1 bg-accent-forest mx-auto mb-8"></div>
            <p className="mb-6 text-lg text-gray-700 font-body">
              Looking ahead, we're committed to mentoring the next generation of drywall experts and expanding 
              our service footprint. Our vision is to set new industry standards, blending traditional techniques 
              with innovative practices to create lasting beauty in every space.
            </p>
            <p className="mb-8 text-gray-700 font-body">
              As we grow, we remain dedicated to our core values of quality, integrity, and customer satisfaction.
              We're excited about the future of Seamless Edge Co. and look forward to continuing to serve the 
              Calgary area with excellence for years to come.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-4 bg-accent-sage text-white font-heading font-semibold hover:bg-accent-gold transition-colors duration-300 shadow-md rounded-lg"
            >
              Join Us on Our Journey
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage; 