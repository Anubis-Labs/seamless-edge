import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CallToActionProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  showBookingButton?: boolean;
  bookingButtonText?: string;
  backgroundColor?: string;
  textColor?: string;
  image?: string;
  maxWidth?: string;
  includeDivider?: boolean;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title = "Ready to Transform Your Space?",
  subtitle = "Contact us today for a free consultation and estimate on your drywall project.",
  primaryButtonText = "Get a Free Estimate",
  primaryButtonLink = "/contact",
  secondaryButtonText = "See Our Work",
  secondaryButtonLink = "/gallery",
  showBookingButton = false,
  bookingButtonText = "Book an Appointment",
  backgroundColor = "bg-accent-navy",
  textColor = "text-white",
  image,
  maxWidth = "max-w-7xl",
  includeDivider = true,
}) => {
  // Motion variants for animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <section className={`py-16 md:py-24 ${backgroundColor} relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {image ? (
          <>
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <img
              src={image}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover z-[-1]"
            />
          </>
        ) : (
          <>
            {/* Abstract shapes when no image provided */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full transform translate-x-1/2 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full transform -translate-x-1/2 translate-y-1/4"></div>
          </>
        )}
      </div>
      
      <div className={`container mx-auto px-4 ${maxWidth} relative z-10`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          className="text-center"
        >
          <h2 className={`text-3xl md:text-4xl font-bold font-heading mb-4 ${textColor}`}>{title}</h2>
          {includeDivider && <div className="w-20 h-1 bg-accent-forest mx-auto mb-6"></div>}
          <p className={`${textColor} opacity-90 max-w-2xl mx-auto font-body mb-8 md:mb-10 text-lg`}>{subtitle}</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={primaryButtonLink}
              className="px-8 py-3 bg-accent-forest text-white font-medium rounded-md hover:bg-accent-forest/90 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              {primaryButtonText}
            </Link>
            
            {secondaryButtonText && (
              <Link
                to={secondaryButtonLink}
                className="px-8 py-3 bg-white text-accent-navy font-medium rounded-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                {secondaryButtonText}
              </Link>
            )}
            
            {showBookingButton && (
              <Link
                to="/booking"
                className="px-8 py-3 bg-accent-navy/20 text-white font-medium rounded-md hover:bg-accent-navy/30 transition-all duration-300 transform hover:scale-105 shadow-md border border-white/30"
              >
                {bookingButtonText}
              </Link>
            )}
          </div>
          
          {/* Phone number */}
          <div className={`mt-8 ${textColor}`}>
            <p className="text-lg opacity-90">Or call us directly at</p>
            <a 
              href="tel:+14035551234" 
              className={`text-xl md:text-2xl font-bold hover:text-accent-forest transition-colors duration-300`}
            >
              (403) 555-1234
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction; 