import React from 'react';
import Hero from '../components/home/Hero';
import ServiceSnapshot from '../components/home/ServiceSnapshot';
import WhyChooseUs from '../components/home/WhyChooseUs';
import FeaturedProjects from '../components/home/FeaturedProjects';
import ClientTestimonials from '../components/home/ClientTestimonials';
import ServiceAreaCTA from '../components/home/ServiceAreaCTA';

const HomePage: React.FC = () => {
  return (
    <div className="home-page w-full overflow-x-hidden">
      <Hero />
      <ServiceSnapshot />
      <WhyChooseUs />
      <FeaturedProjects />
      <ClientTestimonials />
      <ServiceAreaCTA />
    </div>
  );
};

export default HomePage; 