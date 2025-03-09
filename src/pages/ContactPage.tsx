import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  projectType: string;
  services: string[];
  description: string;
  files: FileList | null;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    projectType: '',
    services: [],
    description: '',
    files: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          services: [...prev.services, value]
        };
      } else {
        return {
          ...prev,
          services: prev.services.filter(item => item !== value)
        };
      }
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: e.target.files
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to submit the form data
      // For demo purposes, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your message has been sent. We will contact you shortly.'
      });
      
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        projectType: '',
        services: [],
        description: '',
        files: null
      });
      
      // Clear success message after some time
      setTimeout(() => {
        setSubmitMessage({ type: '', text: '' });
      }, 5000);
      
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'There was an error sending your message. Please try again or call us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Seamless Edge</title>
        <meta name="description" content="Contact Seamless Edge for premium drywall services in Calgary and surrounding areas. Get in touch for quotes, consultations, or project inquiries." />
      </Helmet>

      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl mb-0">Get in touch with our team for quotes, consultations, or project inquiries</p>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 p-8 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <p className="mb-6 text-gray-600">Have questions or ready to get started? Fill out the form below, and our team will be in touch promptly to discuss your project.</p>
                
                {submitMessage.text && (
                  <div className={`p-4 mb-6 rounded ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {submitMessage.text}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="fullName" className="block text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="projectType" className="block text-gray-700 mb-2">Project Type *</label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">-- Select Project Type --</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Renovation">Renovation</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <span className="block text-gray-700 mb-2">Services Needed *</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="services"
                            value="Boarding"
                            checked={formData.services.includes('Boarding')}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                          />
                          Boarding
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="services"
                            value="Taping"
                            checked={formData.services.includes('Taping')}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                          />
                          Taping
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="services"
                            value="Sanding"
                            checked={formData.services.includes('Sanding')}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                          />
                          Sanding
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="services"
                            value="Repairs"
                            checked={formData.services.includes('Repairs')}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                          />
                          Repairs
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="services"
                            value="Custom Textures"
                            checked={formData.services.includes('Custom Textures')}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                          />
                          Custom Textures
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 mb-2">Project Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="files" className="block text-gray-700 mb-2">Upload Photos/Plans (Optional)</label>
                    <input
                      type="file"
                      id="files"
                      name="files"
                      onChange={handleFileChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      multiple
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 5 files. Accepted formats: PDF, JPG, PNG.</p>
                  </div>
                  
                  <button
                    type="submit"
                    className={`bg-primary text-white font-semibold px-6 py-3 rounded hover:bg-primary-dark transition duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </motion.div>
            </div>
            
            {/* Contact Information */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">Direct Contact</h2>
                <p className="mb-6 text-gray-600">Prefer to speak with us directly? Reach out via phone or email—our team is ready to assist you!</p>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                  <div className="flex items-start mb-6">
                    <div className="bg-primary text-white p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Phone</h3>
                      <p className="text-gray-700">(403) 555-7890</p>
                      <p className="text-sm text-gray-500 mt-1">Monday – Friday: 8 AM – 6 PM</p>
                      <p className="text-sm text-gray-500">Saturday: By Appointment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary text-white p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email</h3>
                      <p className="text-gray-700">hello@seamlessedgeco.com</p>
                      <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-6">Service Area</h2>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4 flex items-center justify-center">
                    {/* In a real project, this would be replaced with a real map component */}
                    <p className="text-gray-500">Interactive Map: Serving Calgary and surrounding areas</p>
                  </div>
                  <p className="text-gray-700">
                    Based in Calgary, we serve the entire Calgary region including Airdrie, Cochrane, Chestermere, and Okotoks. 
                    For locations beyond these areas, additional travel fees may apply.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">How soon can you start my project?</h3>
              <p className="text-gray-700">Our schedule varies based on current workload, but we typically can begin new projects within 2-3 weeks of contract approval. For urgent repairs, we offer expedited services when possible.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Do you provide free estimates?</h3>
              <p className="text-gray-700">Yes, we offer complimentary on-site consultations and detailed written estimates for all projects. You can also use our online quote calculator for a preliminary estimate.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-700">We accept all major credit cards, e-transfers, and checks. For larger projects, we typically require a deposit to secure the start date, with progress payments based on project milestones.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Are you insured and licensed?</h3>
              <p className="text-gray-700">Absolutely. Seamless Edge is fully licensed, bonded, and insured for your protection and peace of mind. We're happy to provide documentation upon request.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for a Flawless Finish?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Experience the Seamless Edge difference. Request your free quote today and let us transform your space with precision and expertise.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/quote" className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300">Get a Free Quote</a>
            <a href="tel:4035557890" className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition duration-300">Call Us Now</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage; 