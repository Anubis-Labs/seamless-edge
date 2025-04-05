import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaStar, FaSpinner } from 'react-icons/fa';
import ResumeUploadModal from '../components/careers/ResumeUploadModal';
import supabaseService from '../services/supabaseService';

// Job interface (matches database structure)
interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  posted_date: string;
  closing_date: string;
  featured: boolean;
}

// Format date helper function
const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch {
    return dateString;
  }
};

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const data = await supabaseService.jobs.getJobs();
        setJobs(data || []);
      } catch (err: any) {
        console.error("Error loading jobs:", err);
        setError("Failed to load job opportunities. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  return (
    <div className="jobs-page">
      <Helmet>
        <title>Careers & Job Opportunities | Seamless Edge Drywall</title>
        <meta name="description" content="Join our team of drywall professionals. Explore career opportunities at Seamless Edge, Calgary's premier drywall contractor." />
      </Helmet>

      <PageHero 
        title="Join Our Team" 
        subtitle="Careers & Job Opportunities" 
        backgroundImage="/images/careers-bg.jpg"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Build Your Career With Us</h2>
            <p className="text-lg text-gray-600">
              We're always looking for talented, dedicated professionals to join our growing team. 
              Seamless Edge offers competitive pay, ongoing training, and opportunities for advancement.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-accent-forest h-10 w-10" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Featured Jobs Section */}
              {jobs.filter(job => job.featured).length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-center mb-8 text-accent-navy">Featured Opportunities</h3>
                  {jobs.filter(job => job.featured).map(job => (
                    <motion.div 
                      key={job.id}
                      className="bg-white rounded-lg shadow-xl overflow-hidden mb-6 border-2 border-accent-forest"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className="p-6">
                        <div className="flex flex-wrap justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">{job.title}</h4>
                            <p className="text-gray-600">{job.department}</p>
                          </div>
                          <span className="inline-flex items-center bg-accent-sage/10 text-accent-sage px-3 py-1 rounded-full text-sm font-medium">
                            <FaStar className="mr-1" />
                            Featured
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-y-2 text-sm text-gray-500 mb-4">
                          <div className="w-full md:w-auto md:mr-6 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-accent-sage" />
                            {job.location}
                          </div>
                          <div className="w-full md:w-auto md:mr-6 flex items-center">
                            <FaBriefcase className="mr-2 text-accent-sage" />
                            {job.type}
                          </div>
                          <div className="w-full md:w-auto flex items-center">
                            <FaClock className="mr-2 text-accent-sage" />
                            Posted {formatDate(job.posted_date)}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-5">{job.description}</p>
                        
                        <Link 
                          to={`/jobs/${job.id}`} 
                          className="inline-block bg-accent-forest hover:bg-accent-forest-dark text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* All Jobs Section */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-8 text-accent-navy">All Open Positions</h3>
                
                {jobs.filter(job => !job.featured).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No additional positions at this time. Please check back later.</p>
                ) : (
                  <div className="space-y-4">
                    {jobs.filter(job => !job.featured).map((job, index) => (
                      <motion.div 
                        key={job.id}
                        className={`bg-white rounded-lg shadow-md overflow-hidden 
                        ${index < jobs.filter(job => !job.featured).length - 1 ? 'border-b border-gray-200' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="p-5">
                          <div className="flex flex-wrap justify-between items-center">
                            <div className="mb-2 md:mb-0">
                              <h4 className="text-lg font-semibold text-gray-800">{job.title}</h4>
                              <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <FaMapMarkerAlt className="mr-1 text-accent-sage" /> {job.location}
                                </span>
                                <span className="mx-2 text-gray-300 hidden md:inline">|</span>
                                <span className="flex items-center">
                                  <FaBriefcase className="mr-1 text-accent-sage" /> {job.type}
                                </span>
                              </div>
                            </div>
                            <Link 
                              to={`/jobs/${job.id}`} 
                              className="bg-accent-sage hover:bg-accent-gold text-white text-sm font-medium py-1.5 px-3 rounded transition duration-300"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* General Application */}
          <div className="mt-16 text-center bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Don't see the right position?</h3>
            <p className="text-gray-600 mb-5">We're always interested in connecting with skilled professionals. Send us your resume for future opportunities.</p>
            <button 
              onClick={openModal}
              className="bg-accent-navy hover:bg-accent-navy-dark text-white font-semibold py-2 px-6 rounded transition duration-300"
            >
              Submit General Application
            </button>
          </div>
        </div>
      </section>

      <ResumeUploadModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default JobsPage; 