import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageHero from '../components/common/PageHero';
import ContactForm from '../components/common/ContactForm';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactPage: React.FC = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <Helmet>
        <title>Contact Us | Seamless Edge Drywall | Calgary, AB</title>
        <meta 
          name="description" 
          content="Contact Seamless Edge Drywall for your residential and commercial drywall needs in Calgary and surrounding areas. Get a free consultation and estimate."
        />
        <meta 
          name="keywords" 
          content="contact drywall contractor, Calgary drywall services, drywall quote, drywall estimate, Alberta drywall company" 
        />
      </Helmet>
      
      <PageHero 
        title="Contact Us" 
        subtitle="Get in touch for your residential and commercial drywall needs"
        backgroundImage="/images/updated/contact/contact-hero.jpg"
      />
      
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Company Info */}
            <motion.div 
              className="lg:col-span-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              variants={fadeIn}
            >
              <div className="bg-gradient-to-b from-neutral-offwhite/50 to-white rounded-lg p-8 h-full">
                <h2 className="text-2xl font-heading font-semibold text-accent-sage mb-6">Our Information</h2>
                
                <div className="space-y-6">
                  {/* Location */}
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="bg-accent-gold h-10 w-10 rounded-full flex items-center justify-center text-accent-sage">
                        <FaMapMarkerAlt />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-accent-sage mb-1">Our Location</h3>
                      <p className="text-gray-600">123 Drywall Drive<br />Calgary, AB T2X 3Y4</p>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="bg-accent-gold h-10 w-10 rounded-full flex items-center justify-center text-accent-sage">
                        <FaPhone />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-accent-sage mb-1">Phone Number</h3>
                      <p className="text-gray-600">(403) 123-4567</p>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="bg-accent-gold h-10 w-10 rounded-full flex items-center justify-center text-accent-sage">
                        <FaEnvelope />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-accent-sage mb-1">Email Address</h3>
                      <p className="text-gray-600">info@seamlessedgeco.com</p>
                    </div>
                  </div>
                  
                  {/* Hours */}
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="bg-accent-gold h-10 w-10 rounded-full flex items-center justify-center text-accent-sage">
                        <FaClock />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-accent-sage mb-1">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday-Friday: 8am - 6pm<br />
                        Saturday: 9am - 3pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-accent-sage mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="h-10 w-10 rounded-full bg-accent-gold text-accent-sage flex items-center justify-center hover:opacity-80 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-accent-gold text-accent-sage flex items-center justify-center hover:opacity-80 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-accent-gold text-accent-sage flex items-center justify-center hover:opacity-80 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form Section */}
            <div className="lg:col-span-2">
              <ContactForm 
                title="Request a Free Estimate" 
                subtitle="Fill out the form below and we'll get back to you within 24 hours"
                backgroundColor="bg-white"
                showAddress={true}
                includeBookingCalendar={true}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-accent-sage mb-4">Service Area</h2>
            <div className="w-20 h-1 bg-accent-gold mx-auto mb-6"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              We serve Calgary and surrounding areas including Airdrie, Cochrane, Chestermere, and Okotoks
            </p>
          </motion.div>
          
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-md">
            <iframe
              title="Seamless Edge Drywall Service Area"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d160900.68514791342!2d-114.23416214349248!3d51.024986384253346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537170039f843fd5%3A0x266d3bb1b652b63a!2sCalgary%2C%20AB!5e0!3m2!1sen!2sca!4v1650000000000!5m2!1sen!2sca"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage; 