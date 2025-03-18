import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import ResumeUploadModal from '../components/careers/ResumeUploadModal';

// Job interface
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // Full-time, Part-time, Contract
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  closingDate: string;
  featured: boolean;
}

// Sample job data
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

// Format date function
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const JobsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="jobs-page">
      <Helmet>
        <title>Careers & Job Opportunities | Seamless Edge Drywall</title>
        <meta name="description" content="Join our team of skilled craftsmen and professionals. View current job openings at Seamless Edge Drywall and Finishing." />
      </Helmet>

      <PageHero
        title="Join Our Team"
        subtitle="Explore career opportunities with Seamless Edge"
        backgroundImage="/images/updated/services/sage-living-room.jpg"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-heading font-bold text-accent-sage mb-4">Career Opportunities</h2>
            <p className="text-lg text-gray-600">
              We're always looking for talented individuals who share our passion for quality and craftsmanship. 
              Explore our current openings and find your place on our team.
            </p>
          </div>

          {/* Featured Jobs Section */}
          {JOBS_DATA.filter(job => job.featured).length > 0 && (
            <div className="max-w-5xl mx-auto mb-12">
              <h3 className="text-2xl font-heading font-bold text-accent-gold mb-6">Featured Positions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {JOBS_DATA.filter(job => job.featured).map(job => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-accent-gold"
                  >
                    <div className="bg-accent-gold py-1 px-4 text-sm font-medium text-white flex items-center justify-center">
                      <FaStar className="mr-1" /> Featured Position
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-accent-sage mb-3">{job.title}</h3>
                      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <FaBriefcase className="mr-2 text-accent-gold" />
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-accent-gold" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-accent-gold" />
                          {job.type}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                          Posted: {formatDate(job.postedDate)}
                        </div>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="inline-block px-4 py-2 bg-accent-gold text-white rounded-md hover:bg-accent-sage transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Available Positions */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-heading font-bold text-accent-sage mb-6">All Available Positions</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {JOBS_DATA.filter(job => !job.featured).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-6 flex flex-col md:flex-row md:items-center ${
                    index < JOBS_DATA.filter(job => !job.featured).length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="flex-grow mb-4 md:mb-0">
                    <h3 className="text-lg font-bold text-accent-sage">{job.title}</h3>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center">
                        <FaBriefcase className="mr-2 text-accent-gold" />
                        {job.department}
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-accent-gold" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-accent-gold" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <div className="md:text-right space-y-2 flex flex-col md:items-end">
                    <div className="text-sm text-gray-500">
                      Posted: {formatDate(job.postedDate)}
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-block px-4 py-2 bg-accent-gold text-white rounded-md hover:bg-accent-sage transition-colors text-center md:text-left"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Application Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-accent-sage mb-4">Don't See a Perfect Fit?</h2>
            <p className="text-lg text-gray-600 mb-8">
              We're always interested in connecting with talented individuals. Send us your resume, 
              and we'll keep it on file for future opportunities that match your skills and experience.
            </p>
            <button
              onClick={openModal}
              className="inline-block px-8 py-3 bg-accent-gold text-white rounded-md hover:bg-accent-sage transition-colors text-lg font-medium"
            >
              Submit Open Application
            </button>
          </div>
        </div>
      </section>

      {/* Resume Upload Modal */}
      <ResumeUploadModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default JobsPage; 