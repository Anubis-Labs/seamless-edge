import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import PageHero from '../components/common/PageHero';
import BookingCalendar from '../components/common/BookingCalendar';
import supabaseService from '../services/supabaseService';
import { FaSpinner } from 'react-icons/fa';

const BookingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    message: '',
  });
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Handle slot selection
  const handleSelectSlot = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
        toast.error("Please select a date and time slot.");
        return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    let startTimeISO: string | null = null;
    if (selectedDate && selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const bookingDateTime = new Date(selectedDate);
        bookingDateTime.setHours(hours, minutes, 0, 0); 
        startTimeISO = bookingDateTime.toISOString();
    }

    const bookingData = {
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        service_type: formData.projectType,
        notes: formData.message,
        start_time: startTimeISO,
        status: 'pending'
    };

    try {
      await supabaseService.bookings.createBooking(bookingData);
      
      toast.success("Appointment requested successfully!");
      setFormSubmitted(true);

    } catch (error: any) {
        console.error('Booking submission error:', error);
        const errMsg = `Failed to submit booking: ${error.message}`;
        toast.error(errMsg);
        setSubmitError(errMsg);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Book an Appointment | Seamless Edge Drywall</title>
        <meta 
          name="description" 
          content="Book an appointment with Seamless Edge Drywall. Check our availability and schedule a free consultation for your drywall project."
        />
        <meta 
          name="keywords" 
          content="drywall appointment, book consultation, drywall availability, schedule estimate, Calgary drywall booking" 
        />
      </Helmet>
      
      <PageHero 
        title="Book an Appointment" 
        subtitle="Check our availability and schedule a consultation for your drywall project"
        backgroundImage="/images/updated/services/minimalist-bedroom.jpg"
      />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-8 text-center max-w-2xl mx-auto my-8"
            >
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-heading font-semibold text-accent-navy mb-2">Appointment Confirmed!</h3>
              <p className="text-gray-700 mb-2">Your appointment has been successfully scheduled for:</p>
              <p className="text-xl font-medium text-accent-navy mb-6">
                {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
              </p>
              <p className="text-gray-700 mb-6">We'll send a confirmation email with all the details. If you need to make any changes, please contact us.</p>
              <button 
                onClick={() => {
                  setFormSubmitted(false);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    projectType: 'Residential',
                    message: '',
                  });
                }}
                className="px-6 py-2 bg-accent-navy text-white rounded-md hover:bg-accent-navy/90 transition-colors duration-300"
              >
                Book Another Appointment
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-accent-navy">Check Our Availability</h2>
                <div className="w-20 h-1 bg-accent-forest mx-auto mb-6"></div>
                <p className="text-gray-700 max-w-2xl mx-auto font-body">
                  Select a date and time that works for you. We offer free consultations and estimates for all drywall projects.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-8">
                {/* Left sidebar with FAQs */}
                <div className="flex-1 min-w-[300px] lg:min-w-[20%] lg:max-w-[25%] bg-gradient-to-b from-neutral-offwhite/50 to-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-heading font-bold text-accent-navy mb-4">Booking FAQs</h3>
                  {/* ... content ... */}
                </div>
                
                {/* Calendar Section */}
                <div className="flex-grow-[3] min-w-[300px] lg:min-w-[50%]">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <BookingCalendar 
                      onSelectSlot={handleSelectSlot}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                    />
                  </div>
                </div>
                
                {/* Form Section */}
                <div className="flex-1 min-w-[300px] lg:min-w-[20%]">
                  <div className="bg-gradient-to-b from-neutral-offwhite/50 to-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold font-heading text-accent-navy mb-4">
                      Your Information
                    </h3>
                    
                    {submitError && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm" role="alert">
                        {submitError}
                      </div>
                    )}
                    
                    {selectedDate && selectedTime ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors disabled:bg-gray-100"
                            placeholder="Your name"
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors disabled:bg-gray-100"
                            placeholder="your.email@example.com"
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors disabled:bg-gray-100"
                            placeholder="(123) 456-7890"
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="projectType" className="block mb-1 text-sm font-medium text-gray-700">
                            Project Type
                          </label>
                          <select
                            id="projectType"
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors disabled:bg-gray-100"
                            disabled={isSubmitting}
                          >
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Renovation">Renovation</option>
                            <option value="Repair">Repair</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700">
                            Project Details
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-forest/30 focus:border-accent-forest outline-none transition-colors disabled:bg-gray-100"
                            placeholder="Please provide any details about your project..."
                            disabled={isSubmitting}
                          ></textarea>
                        </div>
                        
                        <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full py-3 px-4 text-center bg-accent-navy text-white rounded-md hover:bg-accent-navy/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={isSubmitting}
                          >
                            {isSubmitting && <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                            {isSubmitting ? 'Submitting...' : 'Confirm Appointment'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-gray-600 mb-4">
                          Please select a date and time from the calendar to continue.
                        </p>
                        <div className="bg-accent-forest/10 border border-accent-forest/20 rounded-md p-4 text-accent-forest">
                          <svg className="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="font-medium">No date and time selected</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="mt-16 flex flex-wrap gap-8">
                <div className="flex-1 min-w-[280px] bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="h-12 w-12 bg-accent-forest/10 rounded-full flex items-center justify-center text-accent-forest mb-4">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold font-heading text-accent-navy mb-2">Appointment Duration</h3>
                  <p className="text-gray-600">
                    Initial consultations typically last 30-45 minutes, allowing us to assess your project needs and provide an accurate estimate.
                  </p>
                </div>
                
                <div className="flex-1 min-w-[280px] bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="h-12 w-12 bg-accent-forest/10 rounded-full flex items-center justify-center text-accent-forest mb-4">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold font-heading text-accent-navy mb-2">Can't Find a Time?</h3>
                  <p className="text-gray-600">
                    If none of the available slots work for you, please contact us directly at (403) 555-1234 and we'll do our best to accommodate your schedule.
                  </p>
                </div>
                
                <div className="flex-1 min-w-[280px] bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="h-12 w-12 bg-accent-forest/10 rounded-full flex items-center justify-center text-accent-forest mb-4">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold font-heading text-accent-navy mb-2">Cancellation Policy</h3>
                  <p className="text-gray-600">
                    We understand plans change. Please provide at least 24 hours notice if you need to cancel or reschedule your appointment so we can offer the slot to other clients.
                  </p>
                </div>
              </div>

              {/* Booking Instructions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 font-heading text-accent-navy">How Our Booking Works</h3>
                <div className="bg-gradient-to-b from-neutral-offwhite/50 to-white p-6 rounded-lg shadow-sm">
                  <ol className="list-decimal pl-5 space-y-3 font-body text-gray-700">
                    {/* ... content ... */}
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default BookingPage; 