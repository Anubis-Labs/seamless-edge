import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabaseService from '../../services/supabaseService';
import { FaSpinner } from 'react-icons/fa';

interface TestimonialData {
  id: number;
  name: string;
  title?: string;
  company?: string;
  location?: string;
  content: string;
  rating?: number;
  image_url?: string;
  approved?: boolean;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  maxWidth?: string;
  limit?: number;
}

const Testimonials: React.FC<TestimonialsProps> = ({ 
  title = "What Our Clients Say", 
  subtitle = "Read testimonials from our satisfied customers throughout Calgary and surrounding areas.",
  backgroundColor = "bg-gradient-to-b from-neutral-offwhite/50 to-white",
  maxWidth = "max-w-7xl",
  limit
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedData = await supabaseService.testimonials.getTestimonials({ approved: true }); 
        let approvedTestimonials = (fetchedData as TestimonialData[] || []).filter(t => t.approved !== false);

        if (limit && typeof limit === 'number') {
            approvedTestimonials = approvedTestimonials.slice(0, limit);
        }

        setTestimonials(approvedTestimonials);
      } catch (err: any) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [limit]);
  
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
    if (testimonials.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
     if (testimonials.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
     if (testimonials.length === 0) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const currentTestimonial = !isLoading && testimonials.length > 0 ? testimonials[activeIndex] : null;
  
  return (
    <section className={`py-16 ${backgroundColor} relative overflow-hidden`} id="testimonials">
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

        <div className="max-w-4xl mx-auto relative px-4 md:px-8 min-h-[350px]">
           {isLoading && (
             <div className="absolute inset-0 flex items-center justify-center">
                <FaSpinner className="animate-spin h-12 w-12 text-accent-forest" />
             </div>
           )}
           {!isLoading && error && (
             <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                {error}
             </div>
           )}
           {!isLoading && !error && testimonials.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    No testimonials available at the moment.
                </div>
           )}

          {currentTestimonial && (
            <>
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
                      {currentTestimonial.image_url ? (
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-accent-forest/20">
                          <img 
                            src={currentTestimonial.image_url} 
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
                      {currentTestimonial.rating && currentTestimonial.rating > 0 && (
                        <div className="flex mb-4">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <svg 
                              key={index} 
                              className={`h-5 w-5 ${
                                index < (currentTestimonial.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                              }`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-accent-forest/20 mb-4">
                        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      
                      <p className="text-gray-700 text-lg md:text-xl font-body italic mb-6">
                        "{currentTestimonial.content}"
                      </p>
                      
                      <div>
                        <h4 className="font-semibold text-accent-navy font-heading text-lg">{currentTestimonial.name}</h4>
                        <div className="text-sm text-gray-600 font-body">
                          {currentTestimonial.title && (
                            <span>{currentTestimonial.title}{currentTestimonial.company && `, ${currentTestimonial.company}`}</span>
                          )}
                          {(!currentTestimonial.title && currentTestimonial.company) && (
                            <span>{currentTestimonial.company}</span>
                          )}
                        </div>
                        {currentTestimonial.location && (
                            <div className="text-sm text-gray-500 font-body">{currentTestimonial.location}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {testimonials.length > 1 && (
                <>
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
                 </>
               )}
            </>
          )}
        </div>
        
        {!isLoading && testimonials.length > 1 && (
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
        )}
      </div>
    </section>
  );
};

export default Testimonials; 