import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
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
    return dateString || 'N/A';
  }
};

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // Fetch job data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch the current job
        const numericId = parseInt(id, 10);
        const jobData = await supabaseService.jobs.getJobById(numericId);
        if (!jobData) {
          throw new Error('Job not found');
        }
        setJob(jobData);
        
        // Fetch other jobs for the "Similar Jobs" section
        const allJobs = await supabaseService.jobs.getJobs();
        const filteredJobs = allJobs.filter((j: Job) => j.id !== numericId)
          .sort(() => Math.random() - 0.5) // Shuffle
          .slice(0, 3); // Take up to 3
        setSimilarJobs(filteredJobs);
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <FaSpinner className="animate-spin text-accent-forest h-10 w-10" />
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{error || 'Job not found'}</p>
            <button 
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center px-4 py-2 bg-accent-navy text-white rounded hover:bg-accent-navy-dark transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 pb-16">
      <Helmet>
        <title>{job.title} | Careers | Seamless Edge</title>
        <meta name="description" content={`${job.title} position at Seamless Edge. ${job.description.substring(0, 150)}...`} />
      </Helmet>
      
      {/* Job Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Link 
                to="/jobs"
                className="inline-flex items-center text-accent-sage hover:text-accent-gold mb-4"
              >
                <FaArrowLeft className="mr-2" /> Back to Jobs
              </Link>
              <h1 className="text-3xl font-bold text-accent-navy mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-gray-600">
                <div className="flex items-center">
                  <FaBriefcase className="mr-2 text-accent-sage" /> {job.department}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-accent-sage" /> {job.location}
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2 text-accent-sage" /> {job.type}
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <button
                onClick={openModal}
                className="inline-block px-6 py-3 bg-accent-forest text-white rounded-md hover:bg-accent-forest-dark transition-colors duration-300 font-semibold"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Job Details</h2>
                  <div className="text-sm text-gray-600 flex items-center">
                    <FaCalendarAlt className="mr-2" /> Posted: {formatDate(job.posted_date)}
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-6">{job.description}</p>
                  
                  <div className="p-4 bg-gray-50 rounded-lg mb-8">
                    <div className="flex flex-wrap gap-4">
                      <div className="w-full md:w-auto flex items-center">
                        <span className="font-medium">Department:</span>
                        <span className="ml-2">{job.department}</span>
                      </div>
                      <div className="w-full md:w-auto flex items-center">
                        <span className="font-medium">Employment Type:</span>
                        <span className="ml-2">{job.type}</span>
                      </div>
                      <div className="w-full md:w-auto flex items-center">
                        <span className="font-medium">Experience:</span>
                        <span className="ml-2">{job.experience}</span>
                      </div>
                      {job.closing_date && (
                        <div className="w-full md:w-auto flex items-center">
                          <span className="font-medium">Closing Date:</span>
                          <span className="ml-2">{formatDate(job.closing_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-accent-navy">Responsibilities</h3>
                  <ul className="list-disc pl-6 mb-8 space-y-2">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-bold mb-4 text-accent-navy">Requirements</h3>
                  <ul className="list-disc pl-6 mb-8 space-y-2">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-bold mb-4 text-accent-navy">Benefits</h3>
                  <ul className="list-disc pl-6 mb-8 space-y-2">
                    {job.benefits.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={openModal}
                  className="w-full md:w-auto inline-block px-6 py-3 bg-accent-forest text-white rounded-md hover:bg-accent-forest-dark transition-colors duration-300 font-semibold text-center"
                >
                  Apply for this Position
                </button>
              </div>
            </div>
          </div>
          
          {/* Similar Jobs Section */}
          {similarJobs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-accent-navy mb-6">Similar Jobs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarJobs.map(otherJob => (
                  <motion.div
                    key={otherJob.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{otherJob.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <FaMapMarkerAlt className="mr-2 text-accent-sage" />
                        {otherJob.location}
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{otherJob.description}</p>
                      <Link
                        to={`/jobs/${otherJob.id}`}
                        className="inline-block px-4 py-2 bg-accent-sage text-white rounded hover:bg-accent-gold transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ResumeUploadModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default JobDetailPage; 