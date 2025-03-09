import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ClientTestimonials: React.FC = () => {
  const [inView, setInView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Set inView state after component is mounted
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    const targetElement = document.getElementById('testimonials-section');
    if (targetElement) {
      observer.observe(targetElement);
    }
    
    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, []);

  const testimonials = [
    {
      id: 1,
      quote: "Seamless Edge completely transformed our renovation. Their perfectionism and attention to detail created flawlessly smooth walls that became the canvas for our entire home design.",
      author: 'Janet Reynolds',
      location: 'Calgary Homeowner',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&q=80&auto=format&fit=crop'
    },
    {
      id: 2,
      quote: "Professional, efficient, and remarkably skilled. Their expertise in drywall finishing gave our office the polished look we needed, delivered on schedule and with impeccable attention to detail.",
      author: 'Mark Davidson',
      location: 'Business Owner',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&q=80&auto=format&fit=crop'
    },
    {
      id: 3,
      quote: "Their craftsmanship and personal touch saved our historic home renovation. The texture matching was so perfect, you can't tell where the original plaster ends and their work begins.",
      author: 'Lisa & Tom Hendricks',
      location: 'Heritage Home Renovation',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=200&h=200&q=80&auto=format&fit=crop'
    }
  ];

  // Generate star rating display
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`} 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Handle navigation of testimonials
  const navigateTestimonial = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
    } else {
      setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <section id="testimonials-section" className="w-full py-28 bg-neutral-offwhite overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Magazine-style masthead */}
        <div 
          className={`mb-20 transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
        >
          <div className="max-w-xl mx-auto text-center">
            <span className="text-accent-forest text-xs font-heading tracking-[0.2em] uppercase">Client Stories</span>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mt-3 mb-6 text-accent-navy tracking-tight leading-tight">
              What Our Clients Are Saying
            </h2>
            <div className="w-16 h-px bg-accent-forest mx-auto mb-6"></div>
            <p className="text-lg text-accent-navy/70 font-body leading-relaxed">
              The true measure of our work is in the satisfaction of those we serve.
            </p>
          </div>
        </div>
        
        {/* Horizontal scrolling testimonial carousel */}
        <div 
          ref={carouselRef}
          className={`relative pb-16 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Carousel container with overflow */}
          <div className="relative overflow-hidden">
            {/* Testimonial slider */}
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="max-w-4xl mx-auto bg-white shadow-sm p-8 md:p-12">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      {/* Client image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 relative">
                        <div className="w-full h-full bg-white p-1 shadow-sm overflow-hidden">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.author} 
                            className="w-full h-full object-cover object-center rounded-full"
                          />
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -right-3 -bottom-3 w-full h-full -z-10 bg-accent-forest/10"></div>
                      </div>
                      
                      {/* Testimonial content */}
                      <div className="grow text-center md:text-left">
                        {/* Rating */}
                        <div className="flex justify-center md:justify-start mb-4">
                          {renderStars(testimonial.rating)}
                        </div>
                        
                        {/* Quote mark */}
                        <div className="text-5xl font-serif text-accent-forest/20 leading-none text-left">
                          &ldquo;
                        </div>
                        
                        {/* Quote text with refined typography */}
                        <p className="text-accent-navy/80 font-body text-lg italic leading-relaxed mb-6 mt-2">
                          {testimonial.quote}
                        </p>
                        
                        {/* Author info with editorial styling */}
                        <div className="flex flex-col">
                          <span className="font-medium text-accent-navy font-heading">{testimonial.author}</span>
                          <span className="text-sm text-accent-navy/60 font-heading">{testimonial.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-center mt-8 items-center space-x-4">
            <button 
              onClick={() => navigateTestimonial('prev')}
              className="p-2 border border-accent-navy/20 text-accent-navy hover:bg-accent-forest hover:text-white hover:border-accent-forest transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Indicators */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-accent-forest w-8' : 'bg-accent-navy/20'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => navigateTestimonial('next')}
              className="p-2 border border-accent-navy/20 text-accent-navy hover:bg-accent-forest hover:text-white hover:border-accent-forest transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Magazine-style call to action */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <Link 
            to="/reviews" 
            className="inline-flex items-center text-accent-navy hover:text-accent-forest transition-all duration-300 font-heading font-medium group"
          >
            <span className="mr-2 tracking-wide uppercase text-sm">Read More Client Stories</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonials; 