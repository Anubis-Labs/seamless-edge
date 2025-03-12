import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaMapMarkerAlt, FaClock, FaBriefcase, FaCalendarAlt, FaArrowLeft, FaCheck, FaInfoCircle, FaClipboardList, FaMedal } from 'react-icons/fa';
import PageHero from '../components/common/PageHero';

// Define job interface (same as in JobsPage)
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Seasonal';
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  closingDate: string;
  featured: boolean;
}

// Sample jobs data (same as in JobsPage - would be moved to a shared data source/service in a real application)
const JOBS_DATA: Job[] = [
  {
    id: 'job-001',
    title: 'Senior Drywall Installer',
    department: 'Installation',
    location: 'Calgary, AB',
    type: 'Full-time',
    experience: '5+ years',
    description: 'We are seeking an experienced Senior Drywall Installer to join our growing team. The ideal candidate will have extensive experience in commercial and high-end residential drywall installation with an eye for detail and commitment to quality.',
    responsibilities: [
      'Lead installation teams on commercial and residential projects',
      'Ensure all work meets company quality standards and building codes',
      'Train and mentor junior installers',
      'Coordinate with project managers and other trades',
      'Troubleshoot complex installation challenges'
    ],
    requirements: [
      'Minimum 5 years of professional drywall installation experience',
      'Experience leading small teams',
      'Knowledge of building codes and industry standards',
      "Valid driver's license",
      'Own transportation and basic tools'
    ],
    benefits: [
      'Competitive salary based on experience ($30-$40/hour)',
      'Health and dental benefits after 3 months',
      'Paid time off',
      'Tool allowance',
      'Career advancement opportunities'
    ],
    postedDate: '2023-10-15',
    closingDate: '2023-12-15',
    featured: true
  },
  {
    id: 'job-002',
    title: 'Drywall Finisher/Taper',
    department: 'Finishing',
    location: 'Calgary, AB',
    type: 'Full-time',
    experience: '3+ years',
    description: "Join our finishing team to create flawless walls and ceilings. We're looking for a skilled finisher who takes pride in their craftsmanship and can achieve Level 5 finishes consistently.",
    responsibilities: [
      'Apply joint compound to drywall joints and corners',
      'Embed tape and feather edges for seamless finishes',
      'Sand surfaces to prepare for painting',
      'Apply texture as specified in project plans',
      'Maintain quality control throughout finishing process'
    ],
    requirements: [
      'Minimum 3 years of drywall finishing experience',
      'Experience with different finishing levels including Level 5',
      'Knowledge of various texturing techniques',
      'Attention to detail and quality workmanship',
      'Ability to work efficiently while maintaining quality'
    ],
    benefits: [
      'Competitive wages ($28-$35/hour based on experience)',
      'Health and dental benefits',
      'Paid time off',
      'Consistent work year-round',
      'Professional development opportunities'
    ],
    postedDate: '2023-11-01',
    closingDate: '2023-12-31',
    featured: true
  },
  {
    id: 'job-003',
    title: 'Apprentice Drywall Installer',
    department: 'Installation',
    location: 'Calgary, AB',
    type: 'Full-time',
    experience: 'Entry-level',
    description: "Start your career in the drywall industry! We're looking for motivated individuals who want to learn the trade from experienced professionals. This position offers hands-on training and a clear path to advancement.",
    responsibilities: [
      'Assist senior installers with drywall hanging',
      'Measure and cut drywall panels',
      'Prepare work areas and maintain cleanliness',
      'Learn proper installation techniques and best practices',
      'Help transport materials to and from job sites'
    ],
    requirements: [
      'High school diploma or equivalent',
      'Strong work ethic and willingness to learn',
      'Basic math skills and ability to read a tape measure',
      'Reliable transportation',
      'Ability to lift 50+ pounds and work in various positions'
    ],
    benefits: [
      'Paid training and apprenticeship program',
      'Steady schedule with consistent hours',
      'Growth opportunities within the company',
      'Earn while you learn - starting at $18-$22/hour',
      'Full benefits package after probation period'
    ],
    postedDate: '2023-11-10',
    closingDate: '2024-01-10',
    featured: false
  },
  {
    id: 'job-004',
    title: 'Project Estimator',
    department: 'Office',
    location: 'Calgary, AB',
    type: 'Full-time',
    experience: '2+ years',
    description: 'We are looking for a detail-oriented Project Estimator to prepare accurate cost estimates for drywall projects. The ideal candidate will have experience in the drywall industry and strong analytical skills.',
    responsibilities: [
      'Review project plans and specifications',
      'Calculate material quantities and labor requirements',
      'Prepare detailed cost estimates for residential and commercial projects',
      'Coordinate with project managers and clients',
      'Maintain database of costs and vendors'
    ],
    requirements: [
      'Minimum 2 years experience in construction estimating, preferably in drywall',
      'Proficiency with estimating software',
      'Strong math skills and attention to detail',
      'Understanding of construction drawings and specifications',
      'Excellent communication skills'
    ],
    benefits: [
      'Competitive salary ($55,000-$75,000 annually based on experience)',
      'Performance bonuses',
      'Comprehensive benefits package',
      'Professional development opportunities',
      'Flexible work schedule with home office options'
    ],
    postedDate: '2023-10-05',
    closingDate: '2023-12-05',
    featured: false
  },
  {
    id: 'job-005',
    title: 'Customer Service Representative',
    department: 'Office',
    location: 'Calgary, AB',
    type: 'Part-time',
    experience: '1+ years',
    description: "Join our office team as a Customer Service Representative to be the friendly voice of Seamless Edge. You'll handle customer inquiries, schedule appointments, and support our field teams.",
    responsibilities: [
      'Answer phone calls and emails from customers',
      'Schedule appointments and consultations',
      'Process work orders and maintain records',
      'Coordinate with field teams regarding schedules',
      'Resolve customer questions and concerns'
    ],
    requirements: [
      'Previous customer service experience',
      'Excellent communication skills',
      'Basic computer proficiency (MS Office)',
      'Organized and detail-oriented',
      'Positive attitude and professional demeanor'
    ],
    benefits: [
      'Competitive hourly wage ($18-$22/hour)',
      'Flexible schedule (20-30 hours per week)',
      'Pleasant office environment',
      'Potential for advancement to full-time',
      'Employee discount program'
    ],
    postedDate: '2023-11-15',
    closingDate: '2023-12-15',
    featured: false
  },
];

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulating API call to fetch job details
    const fetchJob = () => {
      setLoading(true);
      // Find job by ID from the data
      const foundJob = JOBS_DATA.find(job => job.id === id);
      
      // Simulate network delay
      setTimeout(() => {
        setJob(foundJob || null);
        setLoading(false);
      }, 300);
    };
    
    fetchJob();
  }, [id]);
  
  // Handle going back
  const handleBack = () => {
    navigate('/jobs');
  };
  
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Job Details | Seamless Edge</title>
        </Helmet>
        <PageHero
          title="Job Details"
          subtitle="Loading position information..."
          backgroundImage="/images/services/tools.jpg"
        />
        <section className="py-16 bg-gradient-to-b from-white to-neutral-offwhite/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-accent-sage border-t-accent-gold rounded-full animate-spin"></div>
            </div>
          </div>
        </section>
      </>
    );
  }
  
  if (!job) {
    return (
      <>
        <Helmet>
          <title>Job Not Found | Seamless Edge</title>
        </Helmet>
        <PageHero
          title="Job Not Found"
          subtitle="The position you're looking for doesn't exist or has been filled"
          backgroundImage="/images/services/tools.jpg"
        />
        <section className="py-16 bg-gradient-to-b from-white to-neutral-offwhite/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-heading font-bold mb-6 text-accent-sage">Position Not Found</h2>
              <p className="text-lg text-neutral-charcoal/80 mb-8">
                The job listing you're looking for may have been removed or filled.
                Please check our current openings for similar opportunities.
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center px-6 py-3 bg-accent-sage text-white font-medium hover:bg-accent-gold transition-colors duration-300 rounded shadow-sm"
              >
                <FaArrowLeft className="mr-2" />
                View All Positions
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{job.title} | Careers | Seamless Edge</title>
        <meta name="description" content={`Apply for the ${job.title} position at Seamless Edge. ${job.description.substring(0, 100)}...`} />
      </Helmet>
      
      <PageHero
        title={job.title}
        subtitle={`${job.department} • ${job.location}`}
        backgroundImage="/images/services/tools.jpg"
      />
      
      <section className="py-16 bg-gradient-to-b from-white to-neutral-offwhite/30">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <div className="max-w-4xl mx-auto mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-accent-sage hover:text-accent-gold transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to All Positions
            </button>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
            >
              {/* Job header */}
              <div className="p-8 border-b border-neutral-softgray/20">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-accent-sage mb-3">
                      {job.title}
                      {job.featured && (
                        <span className="ml-3 inline-block bg-accent-gold/10 text-accent-gold text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-charcoal/70 mb-4">
                      <span className="flex items-center">
                        <FaBriefcase className="mr-2 text-accent-gold" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-accent-gold" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-2 text-accent-gold" />
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-charcoal/70">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-accent-gold" />
                        Posted: {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-accent-gold" />
                        Closing: {new Date(job.closingDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <FaInfoCircle className="mr-2 text-accent-gold" />
                        Experience: {job.experience}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    to="/contact?subject=Job Application"
                    className="inline-flex items-center px-6 py-3 bg-accent-gold text-white font-medium hover:bg-accent-sage transition-colors duration-300 rounded shadow-md"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
              
              {/* Job description */}
              <div className="p-8">
                <h2 className="text-xl font-heading font-bold text-accent-sage mb-4 flex items-center">
                  <FaInfoCircle className="mr-3 text-accent-gold" /> 
                  About This Position
                </h2>
                <p className="text-neutral-charcoal/80 mb-8 leading-relaxed">
                  {job.description}
                </p>
                
                {/* Responsibilities */}
                <h2 className="text-xl font-heading font-bold text-accent-sage mb-4 flex items-center">
                  <FaClipboardList className="mr-3 text-accent-gold" /> 
                  Key Responsibilities
                </h2>
                <ul className="mb-8">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="mb-2 flex items-start">
                      <FaCheck className="text-accent-gold mt-1 mr-3 flex-shrink-0" />
                      <span className="text-neutral-charcoal/80">{responsibility}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Requirements */}
                <h2 className="text-xl font-heading font-bold text-accent-sage mb-4 flex items-center">
                  <FaClipboardList className="mr-3 text-accent-gold" /> 
                  Requirements
                </h2>
                <ul className="mb-8">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="mb-2 flex items-start">
                      <FaCheck className="text-accent-gold mt-1 mr-3 flex-shrink-0" />
                      <span className="text-neutral-charcoal/80">{requirement}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Benefits */}
                <h2 className="text-xl font-heading font-bold text-accent-sage mb-4 flex items-center">
                  <FaMedal className="mr-3 text-accent-gold" /> 
                  Benefits
                </h2>
                <ul className="mb-8">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="mb-2 flex items-start">
                      <FaCheck className="text-accent-gold mt-1 mr-3 flex-shrink-0" />
                      <span className="text-neutral-charcoal/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            {/* Apply CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-r from-accent-sage/10 to-accent-gold/10 p-8 rounded-lg shadow-inner text-center mb-8"
            >
              <h3 className="text-xl font-bold text-accent-sage mb-4 font-heading">Ready to Apply?</h3>
              <p className="text-neutral-charcoal/80 mb-6 max-w-2xl mx-auto">
                If you're passionate about quality craftsmanship and think you'd be a good fit for this position, we'd love to hear from you.
              </p>
              <Link
                to="/contact?subject=Job Application"
                className="inline-block px-8 py-3 bg-accent-gold text-white font-medium hover:bg-accent-sage transition-colors duration-300 shadow-md hover:shadow-lg rounded"
              >
                Submit Your Application
              </Link>
            </motion.div>
            
            {/* Other positions */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-accent-sage mb-6 font-heading text-center">Other Positions You Might Be Interested In</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {JOBS_DATA.filter(otherJob => otherJob.id !== job.id)
                  .slice(0, 2)
                  .map(otherJob => (
                    <motion.div
                      key={otherJob.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-accent-sage hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <h4 className="text-lg font-heading font-bold text-accent-sage mb-2">
                          {otherJob.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-neutral-charcoal/70 mb-4">
                          <span className="flex items-center">
                            <FaBriefcase className="mr-1 text-accent-gold" />
                            {otherJob.department}
                          </span>
                          <span className="flex items-center">
                            <FaClock className="mr-1 text-accent-gold" />
                            {otherJob.type}
                          </span>
                        </div>
                        <Link
                          to={`/jobs/${otherJob.id}`}
                          className="inline-flex items-center text-accent-sage hover:text-accent-gold transition-colors duration-300 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobDetailPage; 