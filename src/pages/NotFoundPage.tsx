import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Seamless Edge Co.</title>
        <meta name="description" content="The page you are looking for does not exist. Return to Seamless Edge Co. home page for premium drywall services in Calgary." />
      </Helmet>
      
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6 text-center">Page Not Found</h2>
        <p className="text-xl text-gray-600 max-w-md text-center mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300"
          >
            Return Home
          </Link>
          <Link 
            to="/contact" 
            className="bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 border-t border-gray-200">
        <h3 className="text-2xl font-semibold mb-6 text-center">Popular Pages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Link to="/services" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 text-center">
            <h4 className="font-semibold mb-2">Our Services</h4>
            <p className="text-gray-600 text-sm">Explore our drywall solutions</p>
          </Link>
          <Link to="/gallery" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 text-center">
            <h4 className="font-semibold mb-2">Project Gallery</h4>
            <p className="text-gray-600 text-sm">View our completed transformations</p>
          </Link>
          <Link to="/quote" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 text-center">
            <h4 className="font-semibold mb-2">Get a Quote</h4>
            <p className="text-gray-600 text-sm">Request your free estimate</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage; 