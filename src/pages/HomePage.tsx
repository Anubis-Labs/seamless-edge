import React, { ErrorInfo, Component, useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import ServiceSnapshot from '../components/home/ServiceSnapshot';
import WhyChooseUs from '../components/home/WhyChooseUs';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Testimonials from '../components/common/Testimonials';
import ServiceAreaCTA from '../components/home/ServiceAreaCTA';
import CallToAction from '../components/common/CallToAction';
import TextureTechShowcase from '../components/home/TextureTechShowcase';

// Component-specific error boundary
class ComponentErrorBoundary extends Component<{children: React.ReactNode, fallback?: React.ReactNode, componentName: string}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, fallback?: React.ReactNode, componentName: string}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.componentName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="py-12 text-center">
          <div className="container mx-auto px-4">
            <h3 className="text-lg text-gray-500">This section is temporarily unavailable</h3>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const HomePage: React.FC = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Set page as loaded after a small delay to allow components to initialize
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Simple fallback component to show while loading or if components fail
  if (!pageLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-accent-navy mb-4">Seamless Edge</h1>
          <p className="text-xl text-gray-700">Loading our premier drywall services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page w-full overflow-x-hidden">
      <ComponentErrorBoundary componentName="Hero">
        <Hero />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="ServiceSnapshot">
        <ServiceSnapshot />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="WhyChooseUs">
        <WhyChooseUs />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="FeaturedProjects">
        <FeaturedProjects />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="TextureTechShowcase">
        <TextureTechShowcase />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="Testimonials">
        <Testimonials 
          title="What Our Clients Are Saying" 
          subtitle="The true measure of our work is in the satisfaction of those we serve. Read what our clients have to say about our dedication to quality and service."
        />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="CallToAction">
        <CallToAction 
          title="Ready to Schedule Your Drywall Service?"
          subtitle="Book an appointment online to check our availability, or contact us for a personalized consultation."
          primaryButtonText="Contact Us"
          primaryButtonLink="/contact"
          showBookingButton={true}
          bookingButtonText="Check Availability & Book"
          backgroundColor="bg-accent-forest"
          image="/images/services/drywall-taping.jpg"
        />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="ServiceAreaCTA">
        <ServiceAreaCTA />
      </ComponentErrorBoundary>
    </div>
  );
};

export default HomePage; 