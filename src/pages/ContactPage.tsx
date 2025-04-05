import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageHero from '../components/common/PageHero';
import ContactForm from '../components/common/ContactForm';
import { 
    FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
    FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube,
    FaSpinner
} from 'react-icons/fa';
import supabaseService from '../services/supabaseService';

// Type Interfaces
interface ContactSettings { contactEmail: string; contactPhone: string; address: string; }
interface SocialMediaSettings { facebook: string; twitter: string; instagram: string; linkedin: string; pinterest?: string; youtube: string; }
interface BusinessHoursSettings { monday: string; tuesday: string; wednesday: string; thursday: string; friday: string; saturday: string; sunday: string; }

// Default States
const defaultContact: ContactSettings = { contactEmail: '', contactPhone: '', address: '' };
const defaultSocial: SocialMediaSettings = { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' };
const defaultHours: BusinessHoursSettings = { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' };

const ContactPage: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactSettings>(defaultContact);
  const [socialInfo, setSocialInfo] = useState<SocialMediaSettings>(defaultSocial);
  const [hoursInfo, setHoursInfo] = useState<BusinessHoursSettings>(defaultHours);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    const fetchContactData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [contactData, socialData, hoursData] = await Promise.allSettled([
          supabaseService.settings.getSectionSettings('site_contact'),
          supabaseService.settings.getSectionSettings('site_social'),
          supabaseService.settings.getSectionSettings('site_hours')
        ]);

        if (contactData.status === 'fulfilled') {
            setContactInfo({ ...defaultContact, ...(contactData.value as ContactSettings) });
        } else {
             console.warn('Failed to load contact settings:', contactData.reason);
        }
        if (socialData.status === 'fulfilled') {
            setSocialInfo({ ...defaultSocial, ...(socialData.value as SocialMediaSettings) });
        } else {
             console.warn('Failed to load social settings:', socialData.reason);
        }
        if (hoursData.status === 'fulfilled') {
            const fetchedHours = hoursData.value as Partial<BusinessHoursSettings>;
            const completeHours = { ...defaultHours };
            for (const day in completeHours) {
                if (fetchedHours[day as keyof BusinessHoursSettings]) {
                    completeHours[day as keyof BusinessHoursSettings] = fetchedHours[day as keyof BusinessHoursSettings]!;
                }
            }
             setHoursInfo(completeHours);
        } else {
             console.warn('Failed to load hours settings:', hoursData.reason);
        }

        if (contactData.status === 'rejected' && socialData.status === 'rejected' && hoursData.status === 'rejected') {
             throw new Error('Failed to load any contact page settings.');
        }

      } catch (err: any) {
        console.error("Error fetching contact page settings:", err);
        setError(err.message || "Could not load contact information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Create social links array from fetched data
  const socialLinks = [
    { name: 'Facebook', url: socialInfo.facebook, Icon: FaFacebookF },
    { name: 'Instagram', url: socialInfo.instagram, Icon: FaInstagram },
    { name: 'LinkedIn', url: socialInfo.linkedin, Icon: FaLinkedinIn },
    { name: 'Twitter', url: socialInfo.twitter, Icon: FaTwitter },
    { name: 'YouTube', url: socialInfo.youtube, Icon: FaYoutube },
  ].filter(link => link.url);

  // Format hours for display
  const businessHoursDisplay = Object.entries(hoursInfo)
    .filter(([_, value]) => value)
    .map(([day, time]) => ({ day, time }));

  
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
        backgroundImage="/images/updated/services/sage-living-room.jpg"
      />
      
      <section className="py-16 md:py-24 bg-white" id="contact-form">
        <div className="container mx-auto px-4">
           {/* Loading State */}
           {isLoading && (
             <div className="text-center py-16">
                <FaSpinner className="animate-spin h-12 w-12 text-accent-forest mx-auto" />
                <p className="mt-4 text-gray-600">Loading Contact Info...</p>
             </div>
           )}
           {/* Error State */}
           {error && !isLoading && (
             <div className="text-center py-16 bg-red-50 p-6 rounded-md max-w-2xl mx-auto">
                <p className="text-red-700 font-semibold text-xl">Error Loading Information</p>
                <p className="text-red-600 mt-3">{error}</p>
             </div>
           )}

           {/* Content Display */}
           {!isLoading && !error && (
                <div className="flex flex-wrap gap-12">
                    {/* Company Info - Updated with Fetched Data */}
                    <motion.div 
                    className="flex-1 min-w-[300px] lg:min-w-[25%] lg:max-w-[30%]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    variants={fadeIn}
                    >
                    <div className="bg-gradient-to-b from-neutral-offwhite/50 to-white rounded-lg p-8 h-full shadow-sm">
                        <h2 className="text-2xl font-heading font-semibold text-accent-navy mb-6">Our Information</h2>
                        
                        <div className="space-y-6">
                        {/* Location */} 
                        {contactInfo.address && (
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <div className="bg-accent-forest/10 h-10 w-10 rounded-full flex items-center justify-center text-accent-forest">
                                    <FaMapMarkerAlt />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-accent-navy mb-1">Our Location</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{contactInfo.address}</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Phone */}
                        {contactInfo.contactPhone && (
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <div className="bg-accent-forest/10 h-10 w-10 rounded-full flex items-center justify-center text-accent-forest">
                                    <FaPhone />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-accent-navy mb-1">Phone Number</h3>
                                    <a href={`tel:${contactInfo.contactPhone}`} className="text-gray-600 hover:text-accent-forest transition-colors">{contactInfo.contactPhone}</a>
                                </div>
                            </div>
                        )}
                        
                        {/* Email */}
                        {contactInfo.contactEmail && (
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <div className="bg-accent-forest/10 h-10 w-10 rounded-full flex items-center justify-center text-accent-forest">
                                    <FaEnvelope />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-accent-navy mb-1">Email Address</h3>
                                    <a href={`mailto:${contactInfo.contactEmail}`} className="text-gray-600 hover:text-accent-forest transition-colors break-all">{contactInfo.contactEmail}</a>
                                </div>
                            </div>
                        )}
                        
                        {/* Hours */} 
                        {businessHoursDisplay.length > 0 && (
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <div className="bg-accent-forest/10 h-10 w-10 rounded-full flex items-center justify-center text-accent-forest">
                                    <FaClock />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-accent-navy mb-1">Business Hours</h3>
                                    <div className="text-gray-600 text-sm space-y-1">
                                    {businessHoursDisplay.map(({ day, time }) => (
                                        <p key={day}><span className="font-medium capitalize">{day}:</span> {time}</p>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                        
                        {/* Social Media Links - Updated with Fetched Data */}
                        {socialLinks.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-accent-navy mb-4">Connect With Us</h3>
                                <div className="flex space-x-4">
                                {socialLinks.map(({ name, url, Icon }) => (
                                    <a 
                                        key={name}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Follow us on ${name}`}
                                        className="h-10 w-10 rounded-full bg-accent-forest/10 text-accent-forest flex items-center justify-center hover:bg-accent-forest/20 transition-colors duration-300"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                                </div>
                            </div>
                        )}
                    </div>
                    </motion.div>
                    
                    {/* Contact Form Section */}
                    <div className="flex-1 min-w-[300px] lg:min-w-[65%]">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            variants={fadeIn}
                        >
                            <ContactForm 
                            title="Send Us a Message"
                            subtitle="Fill out the form below and we'll get back to you within 24 hours"
                            backgroundColor="bg-white"
                            showAddress={false}
                            includeBookingCalendar={true}
                            />
                        </motion.div>
                    </div>
                </div>
             )}
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
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-accent-navy mb-4">Service Area</h2>
            <div className="w-20 h-1 bg-accent-forest mx-auto mb-6"></div>
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
      
      {/* Ready to Get Started? Section - Updated with Fetched Phone */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/updated/services/modern-kitchen-sage.jpg" 
            alt="Modern kitchen interior with premium finishes" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div> {/* Semi-transparent black overlay */}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">Ready to Get Started?</h2>
            <div className="w-20 h-1 bg-accent-forest mx-auto mb-8"></div>
            <p className="mb-10 text-xl text-white/90 font-body">
              Transform your space with Seamless Edge's expert drywall solutions. 
              Contact us today for a free consultation and quote.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {contactInfo.contactPhone && (
                <a 
                  href={`tel:${contactInfo.contactPhone}`}
                  className="px-8 py-4 bg-accent-forest text-white font-heading font-semibold rounded-lg shadow-lg hover:bg-white hover:text-accent-navy transition-all duration-300 w-full sm:w-auto"
                >
                  Call: {contactInfo.contactPhone}
                </a>
              )}
              <a 
                href="#contact-form" 
                className="px-8 py-4 bg-white/10 text-white border-2 border-white font-heading font-semibold rounded-lg shadow-lg hover:bg-white hover:text-accent-navy transition-all duration-300 w-full sm:w-auto"
              >
                Request an Estimate
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ContactPage; 