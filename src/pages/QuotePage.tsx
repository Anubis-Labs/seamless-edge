import React from 'react';
import { Helmet } from 'react-helmet';
import QuoteCalculator from '../components/quote/QuoteCalculator';
import PageHero from '../components/common/PageHero';

const QuotePage: React.FC = () => {
  return (
    <div className="quote-page">
      <Helmet>
        <title>Instant Quote Calculator | Seamless Edge</title>
        <meta 
          name="description" 
          content="Get an accurate estimate for your project in seconds with our instant quote calculator. Plan your budget with confidence."
        />
      </Helmet>
      
      {/* Hero banner - hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:block">
        <PageHero
          title="Instant Quote Calculator"
          subtitle="Get an accurate estimate for your project in seconds. Simply enter your project details below for a comprehensive breakdown."
          backgroundImage="/images/updated/services/minimalist-bedroom.jpg"
        />
      </div>
      
      {/* Mobile-only title */}
      <div className="md:hidden pt-8 pb-4 bg-accent-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Instant Quote</h1>
        </div>
      </div>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <QuoteCalculator />
        </div>
      </section>
      
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center text-primary">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">How accurate is this estimate?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our calculator provides a good starting point for budgeting your project. For a precise quote, we recommend scheduling an in-person consultation where we can assess the specific requirements of your space.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">What factors might affect my final quote?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Several factors can impact the final cost, including ceiling height, wall conditions, access to the work area, and any special requirements. Our in-person assessment will account for these variables.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">Do you offer financing options?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes, we work with several financing partners to offer flexible payment options. Contact our team to learn more about available financing programs for your project.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3 text-primary">How long will my project take?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Project timelines depend on the scope and complexity of work. A standard room might take 3-5 days, while larger projects can take several weeks. We'll provide a detailed timeline during your consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Contact us today for a personalized consultation and detailed quote for your project.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="/contact" className="quote-btn quote-btn-primary bg-white text-primary hover:bg-opacity-90">
              Schedule a Consultation
            </a>
            <a href="tel:+14035557890" className="quote-btn quote-btn-secondary bg-white bg-opacity-20 text-white hover:bg-opacity-30">
              Call Us: (403) 555-7890
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuotePage; 