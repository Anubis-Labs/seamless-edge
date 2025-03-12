import React from 'react';
import Hero from '../components/home/Hero';
import ServiceSnapshot from '../components/home/ServiceSnapshot';
import WhyChooseUs from '../components/home/WhyChooseUs';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Testimonials from '../components/common/Testimonials';
import ServiceAreaCTA from '../components/home/ServiceAreaCTA';
import CallToAction from '../components/common/CallToAction';
import TextureTechShowcase from '../components/home/TextureTechShowcase';

const HomePage: React.FC = () => {
  return (
    <div className="home-page w-full overflow-x-hidden">
      <Hero />
      <ServiceSnapshot />
      <WhyChooseUs />
      <FeaturedProjects />
      <TextureTechShowcase />
      <Testimonials 
        title="What Our Clients Are Saying" 
        subtitle="The true measure of our work is in the satisfaction of those we serve. Read what our clients have to say about our dedication to quality and service."
      />
      
      {/* Call to Action with booking option */}
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
      
      <ServiceAreaCTA />
    </div>
  );
};

export default HomePage; 