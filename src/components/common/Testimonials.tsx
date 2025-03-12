import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  position?: string;
  company?: string;
  location: string;
  content: string;
  rating: number;
  avatar?: string;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah & Mark Johnson",
    position: "Homeowners",
    location: "Airdrie, AB",
    content: "Seamless Edge transformed our basement renovation with immaculate drywall work. Their attention to detail is remarkable—you can't even tell where the seams are! The team was clean, professional, and completed the job ahead of schedule.",
    rating: 5,
    avatar: "/images/services/consultation.jpg"
  },
  {
    id: 2,
    name: "Robert Chambers",
    position: "General Contractor",
    company: "Chambers Construction",
    location: "Calgary, AB",
    content: "As a contractor, I rely on quality subcontractors. Seamless Edge has become our go-to for all drywall needs. Their work quality and reliability are consistently outstanding. They make my job easier and make me look good to my clients.",
    rating: 5
  },
  {
    id: 3,
    name: "Jennifer Williams",
    position: "Interior Designer",
    company: "JW Designs",
    location: "Calgary, AB",
    content: "The level of craftsmanship from Seamless Edge is exceptional. Their ability to execute custom textures and perfectly smooth Level 5 finishes gives me confidence to design without limitations. They're truly artisans in their field.",
    rating: 5,
    avatar: "/images/services/consultation.jpg"
  },
  {
    id: 4,
    name: "The Thompson Family",
    location: "Cochrane, AB",
    content: "After significant water damage, we needed extensive repairs. Seamless Edge matched our existing texture perfectly—you literally cannot tell where the repair was done. Excellent service from start to finish.",
    rating: 5
  },
  {
    id: 5,
    name: "Alex Martinez",
    position: "Project Manager",
    company: "Modern Living Spaces",
    location: "Calgary, AB",
    content: "We've worked with Seamless Edge on multiple commercial projects. Their team consistently delivers high-quality work on schedule and within budget. Their professionalism and expertise are unmatched in the industry.",
    rating: 5,
    avatar: "/images/services/tools.jpg"
  }
];

const Testimonials: React.FC<TestimonialsProps> = ({ 
  title = "What Our Clients Say", 
  subtitle = "Read testimonials from our satisfied customers throughout Calgary and surrounding areas.",
  backgroundColor = "bg-gradient-to-b from-neutral-offwhite/50 to-white",
  maxWidth = "max-w-7xl"
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // For fade animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0
    })
  };

  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Get current testimonial
  const currentTestimonial = testimonials[activeIndex];
  
  return (
    <section className={`py-16 ${backgroundColor} relative overflow-hidden`} id="testimonials">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-forest/5 rounded-full transform -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-navy/5 rounded-full transform translate-y-1/2 -translate-x-1/3"></div>
      
      <div className={`container mx-auto px-4 ${maxWidth} relative z-10`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-accent-navy">{title}</h2>
          <div className="w-20 h-1 bg-accent-forest mx-auto mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto font-body">{subtitle}</p>
        </motion.div>

        {/* Testimonial Display - Consistent across screen sizes */}
        <div className="max-w-4xl mx-auto relative px-4 md:px-8">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentTestimonial.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="bg-white rounded-lg shadow-lg p-6 md:p-10"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="md:w-1/3 flex justify-center md:justify-start">
                  {currentTestimonial.avatar ? (
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-accent-forest/20">
                      <img 
                        src={currentTestimonial.avatar} 
                        alt={currentTestimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent-navy/10 flex items-center justify-center text-accent-navy font-bold text-3xl border-4 border-accent-forest/20">
                      {currentTestimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="md:w-2/3">
                  {/* Rating Stars */}
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg 
                        key={index} 
                        className={`h-5 w-5 ${
                          index < currentTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  {/* Quote Icon */}
                  <div className="text-accent-forest/20 mb-4">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  {/* Testimonial Content */}
                  <p className="text-gray-700 text-lg md:text-xl font-body italic mb-6">
                    "{currentTestimonial.content}"
                  </p>
                  
                  {/* Client Info */}
                  <div>
                    <h4 className="font-semibold text-accent-navy font-heading text-lg">{currentTestimonial.name}</h4>
                    <div className="text-sm text-gray-600 font-body">
                      {currentTestimonial.position && (
                        <span>{currentTestimonial.position}{currentTestimonial.company && `, ${currentTestimonial.company}`}</span>
                      )}
                      {(!currentTestimonial.position && currentTestimonial.company) && (
                        <span>{currentTestimonial.company}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 font-body">{currentTestimonial.location}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Side Navigation Controls */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-6 h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-accent-navy hover:text-white transition-colors duration-300 z-10"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-6 h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-accent-navy hover:text-white transition-colors duration-300 z-10"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Bottom Navigation Controls */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                activeIndex === index ? 'w-10 bg-accent-forest' : 'w-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 