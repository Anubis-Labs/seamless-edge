import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  backgroundColor?: string;
  maxWidth?: string;
  includeDivider?: boolean;
}

const FAQ: React.FC<FAQProps> = ({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to the most common questions about our drywall services",
  faqs,
  backgroundColor = "bg-white",
  maxWidth = "max-w-4xl",
  includeDivider = true,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Toggle FAQ item
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  // Motion variants for animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Motion variants for the answer content
  const answerVariants = {
    collapsed: { 
      height: 0,
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    expanded: { 
      height: "auto",
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
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
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={fadeIn}
          className="max-w-3xl mx-auto"
        >
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id}
                className={`border ${
                  activeIndex === index 
                    ? 'border-accent-forest/40 bg-accent-forest/5' 
                    : 'border-gray-200 hover:border-accent-forest/30 hover:bg-gray-50'
                } rounded-lg overflow-hidden transition-all duration-300`}
              >
                <button
                  className="flex items-center justify-between w-full p-5 text-left"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="text-lg font-medium text-accent-navy font-heading pr-2">{faq.question}</span>
                  <span className={`text-accent-forest transform transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      key={`answer-${faq.id}`}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={answerVariants}
                      id={`faq-answer-${faq.id}`}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-gray-700 font-body">
                        <div className="h-px bg-gray-200 mb-5"></div>
                        {/* Split paragraphs and render */}
                        {faq.answer.split('\n\n').map((paragraph, i) => (
                          <p key={i} className={i > 0 ? 'mt-4' : ''}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Sample FAQ data that can be used as a default
export const sampleFAQs: FAQItem[] = [
  {
    id: 1,
    question: "What services do you offer?",
    answer: "We offer comprehensive drywall services including installation, taping, mudding, repairs, and texturing for both residential and commercial properties. Our team specializes in both new construction and renovation projects."
  },
  {
    id: 2,
    question: "How long does a typical drywall project take?",
    answer: "The timeline for drywall projects varies depending on the scope and size. A small repair might be completed in just a few hours, while a full home drywall installation could take 1-2 weeks.\n\nFactors that affect the timeline include the square footage, complexity of the space, any custom finishes or textures, and drying time between coats. We always provide a detailed timeline estimate before beginning any project."
  },
  {
    id: 3,
    question: "Do you offer free estimates?",
    answer: "Yes, we provide free, no-obligation estimates for all drywall projects. Our estimator will visit your site, assess the work needed, and provide a detailed quote that outlines all costs involved."
  },
  {
    id: 4,
    question: "What type of warranty do you offer on your work?",
    answer: "We stand behind our work with a comprehensive warranty. All our drywall installations come with a 1-year warranty covering workmanship and materials. If any issues arise due to our installation, we'll address them at no additional cost to you."
  },
  {
    id: 5,
    question: "How do you handle dust and cleanup?",
    answer: "We take dust control and cleanup very seriously. Our team uses professional dust containment systems, plastic barriers, and air scrubbers to minimize dust migration. After project completion, we conduct a thorough cleanup, removing all debris and vacuuming the work area."
  },
  {
    id: 6,
    question: "Do I need to move my furniture before you start work?",
    answer: "For the best results and to protect your belongings, we recommend removing furniture from the work area when possible. For items that cannot be moved, we carefully cover and protect them with plastic sheeting."
  },
  {
    id: 7,
    question: "Can you match existing textures for repairs?",
    answer: "Yes, our experienced technicians are skilled at matching existing textures. We use specialized techniques and tools to carefully analyze and recreate your current texture for seamless repairs that blend perfectly with the surrounding areas."
  }
];

export default FAQ; 