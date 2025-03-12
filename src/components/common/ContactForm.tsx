import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BookingCalendar from './BookingCalendar';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  projectType: string;
  message: string;
  appointmentDate?: Date | null;
  appointmentTime?: string | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  serviceType?: string;
  message?: string;
}

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  maxWidth?: string;
  showAddress?: boolean;
  includeDivider?: boolean;
  includeBookingCalendar?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  title = "Get in Touch",
  subtitle = "Contact us for a free consultation and estimate for your drywall needs",
  backgroundColor = "bg-white",
  maxWidth = "max-w-4xl",
  showAddress = false,
  includeDivider = true,
  includeBookingCalendar = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    projectType: 'Residential',
    message: '',
    appointmentDate: null,
    appointmentTime: null,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Motion variants for fade in animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Service types
  const serviceTypes = [
    'Drywall Installation',
    'Drywall Repair',
    'Texture Application',
    'Popcorn Ceiling Removal',
    'Basement Finishing',
    'Commercial Services',
    'Other'
  ];
  
  // Project types
  const projectTypes = ['Residential', 'Commercial', 'Renovation', 'New Construction'];
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !/^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    // Service type
    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }
    
    // Message
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide some details about your project';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message is too short';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // This would be replaced with actual API call in a real application
      console.log('Form data being submitted:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setSubmitted(true);
      
      // Reset form data on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        serviceType: '',
        projectType: 'Residential',
        message: '',
        appointmentDate: null,
        appointmentTime: null,
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('There was a problem submitting your request. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle booking calendar selection
  const handleAppointmentSelected = (date: Date, time: string) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: time
    }));
  };
  
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className={`container mx-auto px-4 ${maxWidth}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-accent-navy">{title}</h2>
          {includeDivider && <div className="w-20 h-1 bg-accent-forest mx-auto mb-6"></div>}
          <p className="text-gray-700 max-w-2xl mx-auto font-body">{subtitle}</p>
        </motion.div>
        
        {/* Success message */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-8 text-center max-w-2xl mx-auto"
          >
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-heading font-semibold text-accent-navy mb-2">Thank You!</h3>
            <p className="text-gray-700 mb-6">Your message has been received. We'll get back to you shortly.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="px-6 py-2 bg-accent-navy text-white rounded-md hover:bg-accent-navy/90 transition-colors duration-300"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            className="bg-white shadow-sm rounded-lg p-6 md:p-8 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Error message if submission failed */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                <p>{submitError}</p>
              </div>
            )}
            
            {/* Booking Calendar (conditional) */}
            {includeBookingCalendar && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-accent-navy mb-4">Select Preferred Appointment (Optional)</h3>
                <BookingCalendar 
                  isEmbedded={true}
                  onDateTimeSelected={handleAppointmentSelected}
                  selectedDate={formData.appointmentDate}
                  selectedTime={formData.appointmentTime}
                />
                {formData.appointmentDate && formData.appointmentTime && (
                  <div className="mt-4 p-3 bg-accent-forest/10 border border-accent-forest/20 rounded-md text-accent-navy text-sm">
                    <p className="font-medium">Selected Appointment:</p>
                    <p>{formData.appointmentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {formData.appointmentTime}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors duration-200`}
                  placeholder="Your name"
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors duration-200`}
                  placeholder="your.email@example.com"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors duration-200`}
                  placeholder="(123) 456-7890"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>
              
              {/* Service Type */}
              <div>
                <label htmlFor="serviceType" className="block mb-2 text-sm font-medium text-gray-700">
                  Service Needed <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-md border ${
                    errors.serviceType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors duration-200`}
                  aria-describedby={errors.serviceType ? "service-error" : undefined}
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p id="service-error" className="mt-1 text-sm text-red-600">
                    {errors.serviceType}
                  </p>
                )}
              </div>
            </div>
            
            {/* Project Type */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">Project Type</label>
              <div className="flex flex-wrap gap-4">
                {projectTypes.map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="radio"
                      id={`project-${type}`}
                      name="projectType"
                      value={type}
                      checked={formData.projectType === type}
                      onChange={handleChange}
                      className="h-4 w-4 text-accent-forest focus:ring-accent-forest/30 border-gray-300"
                    />
                    <label htmlFor={`project-${type}`} className="ml-2 text-sm text-gray-700">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Address (conditional) */}
            {showAddress && (
              <div className="mb-6">
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700">
                  Project Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors duration-200"
                  placeholder="123 Main St, City, Province, Postal Code"
                />
              </div>
            )}
            
            {/* Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                Project Details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md border ${
                  errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors duration-200`}
                placeholder="Please describe your project and any specific requirements..."
                aria-describedby={errors.message ? "message-error" : undefined}
              ></textarea>
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-red-600">
                  {errors.message}
                </p>
              )}
            </div>
            
            {/* Submit button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-3 font-medium text-white rounded-md transition-all duration-300 ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-accent-navy hover:bg-accent-forest'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
              <p className="mt-4 text-sm text-gray-600">
                <span className="text-red-500">*</span> Required fields
              </p>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default ContactForm; 