import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaMapMarkerAlt, FaClock, FaBriefcase, FaCalendarAlt, FaArrowLeft, FaCheck, FaInfoCircle, FaClipboardList, FaMedal } from 'react-icons/fa';
import PageHero from '../components/common/PageHero';
import ResumeUploadModal from '../components/careers/ResumeUploadModal';

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
    id: '1',
    title: 'Senior Drywall Finisher',
    department: 'Production',
    location: 'Denver, CO',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Join our team of skilled craftsmen delivering top-quality drywall finishing services to residential and commercial clients.',
    responsibilities: [
      'Execute Level 5 finishing and specialty textures',
      'Manage small teams of junior craftsmen',
      'Ensure quality control on projects',
      'Maintain equipment and manage inventory',
      'Communicate effectively with project managers and clients'
    ],
    requirements: [
      'Minimum 5 years experience in drywall finishing',
      'Expert knowledge of various texture techniques',
      'Valid driver\'s license and reliable transportation',
      'Strong communication skills',
      'Ability to work flexible hours when needed'
    ],
    benefits: [
      'Competitive pay: $28-35/hr based on experience',
      'Health insurance options',
      'Retirement plan with company match',
      'Paid time off and holidays',
      'Tool and vehicle allowance',
      'Ongoing professional development'
    ],
    postedDate: '2023-07-12',
    closingDate: '2023-08-12',
    featured: true
  },
  {
    id: '2',
    title: 'Project Estimator',
    department: 'Sales',
    location: 'Denver, CO',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Calculate project costs and prepare detailed quotes for residential and commercial drywall and finishing projects.',
    responsibilities: [
      'Visit sites and prepare thorough assessments',
      'Calculate material and labor requirements',
      'Prepare detailed quotes for clients',
      'Coordinate with production team on job requirements',
      'Maintain client relationships during the estimation process'
    ],
    requirements: [
      'Minimum 3 years experience in construction estimation',
      'Knowledge of drywall installation and finishing processes',
      'Excellent math and budgeting skills',
      'Strong attention to detail',
      'Computer proficiency (Excel, estimation software)'
    ],
    benefits: [
      'Competitive salary: $55,000-70,000 based on experience',
      'Performance bonuses',
      'Comprehensive health benefits',
      'Retirement plan with company match',
      'Company vehicle for site visits',
      'Flexible schedule options'
    ],
    postedDate: '2023-07-15',
    closingDate: '2023-08-15',
    featured: true
  },
  {
    id: '3',
    title: 'Administrative Assistant',
    department: 'Administration',
    location: 'Denver, CO',
    type: 'Part-time',
    experience: '1+ years',
    description: 'Support our office operations with scheduling, client communication, and administrative tasks. Flexible part-time hours with possibility for full-time in the future.',
    responsibilities: [
      'Answer calls and emails from clients',
      'Schedule appointments and consultations',
      'Manage paperwork and filing systems',
      'Process invoices and track payments',
      'Order supplies and maintain inventory'
    ],
    requirements: [
      'Office administration experience',
      'Excellent communication skills',
      'Proficiency in Microsoft Office suite',
      'Basic bookkeeping knowledge',
      'High level of organization and attention to detail'
    ],
    benefits: [
      'Competitive hourly rate: $18-22/hr based on experience',
      'Flexible schedule (15-25 hours per week)',
      'Opportunities for growth and advancement',
      'Friendly, supportive work environment',
      'Employee discounts on services'
    ],
    postedDate: '2023-07-20',
    closingDate: '2023-08-20',
    featured: false
  },
  {
    id: '4',
    title: 'Drywall Installation Apprentice',
    department: 'Installation',
    location: 'Denver, CO',
    type: 'Full-time',
    experience: 'Entry-level',
    description: 'Learn the drywall trade hands-on with our skilled installation team. No experience required - we\'ll train you from the ground up with our comprehensive apprenticeship program.',
    responsibilities: [
      'Assist journeyman installers with drywall hanging',
      'Learn proper measuring, cutting, and hanging techniques',
      'Help maintain job site cleanliness and organization',
      'Assist with material handling and preparation',
      'Participate in regular training sessions'
    ],
    requirements: [
      'High school diploma or equivalent',
      'Physical ability to lift up to 50 lbs regularly',
      'Reliable transportation',
      'Strong work ethic and willingness to learn',
      'Basic math and measuring skills'
    ],
    benefits: [
      'Starting pay: $16-18/hr with regular increases as skills develop',
      'Paid on-the-job training and mentorship',
      'Health insurance eligibility after 90 days',
      'Clear path for advancement to journeyman level',
      'Tool program to help build your equipment over time'
    ],
    postedDate: '2023-10-01',
    closingDate: '2023-11-15',
    featured: false
  },
  {
    id: '5',
    title: 'Lead Texture Specialist',
    department: 'Finishing',
    location: 'Denver, CO',
    type: 'Full-time',
    experience: '7+ years',
    description: 'Join our specialty finishes team to create stunning texture applications for high-end residential and commercial projects. Seeking an artist with extensive experience in custom texturing techniques.',
    responsibilities: [
      'Execute complex custom texture patterns and designs',
      'Develop sample boards for client approval',
      'Train team members on specialty application techniques',
      'Consult with clients on texture options and finishes',
      'Ensure consistent quality across all projects'
    ],
    requirements: [
      'Minimum 7 years experience in texture application',
      'Portfolio demonstrating skill with multiple texture styles',
      'Experience with specialty tools and equipment',
      'Color matching and mixing expertise',
      'Excellent customer service and communication skills'
    ],
    benefits: [
      'Premium pay rate: $32-45/hr based on experience and portfolio',
      'Health, dental, and vision insurance',
      'Retirement benefits with company matching',
      'Paid time off and holidays',
      'Professional development budget for advanced training',
      'Recognition program for exceptional work'
    ],
    postedDate: '2023-09-15',
    closingDate: '2023-11-30',
    featured: true
  },
  {
    id: '6',
    title: 'Drywall Repair Technician',
    department: 'Repairs',
    location: 'Denver, CO',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Specialize in residential and commercial drywall repairs. This position focuses on fixing water damage, holes, cracks, and texture matching in existing structures.',
    responsibilities: [
      'Assess damage and provide repair solutions',
      'Perform patch repairs with seamless finishing',
      'Match existing textures and finishes',
      'Coordinate with painting contractors when needed',
      'Maintain efficient scheduling for multiple smaller jobs daily'
    ],
    requirements: [
      'Minimum 3 years experience in drywall repair',
      'Excellent texture-matching skills',
      'Clean driving record and reliable vehicle',
      'Strong problem-solving abilities',
      'Effective time management skills'
    ],
    benefits: [
      'Competitive pay: $25-32/hr based on experience',
      'Vehicle and fuel allowance',
      'Comprehensive benefits package',
      'Regular schedule with minimal weekend work',
      'Cell phone stipend for work communications'
    ],
    postedDate: '2023-10-10',
    closingDate: '2023-12-10',
    featured: false
  },
  {
    id: '7',
    title: 'Drywall Project Manager',
    department: 'Management',
    location: 'Denver, CO',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Oversee residential and commercial drywall projects from contract to completion. Coordinate crews, manage client relationships, and ensure quality standards are met on all jobs.',
    responsibilities: [
      'Develop project plans and timelines',
      'Coordinate drywall installation and finishing teams',
      'Perform quality inspections throughout projects',
      'Manage client communications and expectations',
      'Troubleshoot issues and implement solutions quickly'
    ],
    requirements: [
      'Minimum 5 years in drywall installation/finishing',
      'Previous supervisory or management experience',
      'Knowledge of building codes and industry standards',
      'Excellent communication and leadership skills',
      'Proficiency with project management software'
    ],
    benefits: [
      'Competitive salary: $65,000-85,000 based on experience',
      'Performance bonus structure',
      'Comprehensive benefits package',
      'Company vehicle for site visits',
      'Cell phone and laptop provided',
      'Professional development opportunities'
    ],
    postedDate: '2023-08-15',
    closingDate: '2023-12-31',
    featured: true
  }
];

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Job Details | Seamless Edge</title>
        </Helmet>
        <PageHero
          title="Job Details"
          subtitle="Loading position information..."
          backgroundImage="/images/updated/services/sage-living-room.jpg"
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
          backgroundImage="/images/updated/services/sage-living-room.jpg"
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
        backgroundImage="/images/updated/services/sage-living-room.jpg"
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
                  
                  <div>
                    <button
                      onClick={openModal}
                      className="inline-flex items-center px-6 py-3 bg-accent-gold text-white font-medium hover:bg-accent-sage transition-colors duration-300 rounded shadow-md"
                    >
                      Apply Now
                    </button>
                  </div>
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
              <button
                onClick={openModal}
                className="inline-block px-8 py-3 bg-accent-gold text-white font-medium hover:bg-accent-sage transition-colors duration-300 shadow-md hover:shadow-lg rounded"
              >
                Submit Your Application
              </button>
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
      
      {/* Resume Upload Modal */}
      <ResumeUploadModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        job={job ? {
          id: job.id,
          title: job.title,
          department: job.department
        } : undefined}
      />
    </>
  );
};

export default JobDetailPage; 