import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';

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
    description: 'Provide administrative support to our growing drywall and finishing company with a focus on customer service and office efficiency.',
    responsibilities: [
      'Manage phone calls and client inquiries',
      'Schedule appointments and site visits',
      'Process paperwork and maintain filing systems',
      'Assist with basic bookkeeping tasks',
      'Support team members with administrative needs'
    ],
    requirements: [
      'Prior office experience preferred',
      'Excellent communication and customer service skills',
      'Proficiency in Microsoft Office',
      'Strong organizational abilities',
      'Detail-oriented and reliable'
    ],
    benefits: [
      'Competitive hourly rate: $17-20/hour',
      'Flexible schedule (20-30 hours per week)',
      'Paid time off',
      'Potential for growth to full-time',
      'Friendly, supportive work environment'
    ],
    postedDate: '2023-07-20',
    closingDate: '2023-08-20',
    featured: false
  },
  {
    id: '4',
    title: 'Junior Drywall Installer',
    department: 'Production',
    location: 'Denver, CO',
    type: 'Full-time',
    experience: 'Entry-level',
    description: 'Learn the trade and develop your skills under the guidance of experienced professionals in the drywall industry.',
    responsibilities: [
      'Assist senior installers with drywall hanging',
      'Prepare work areas and clean up job sites',
      'Load, unload, and organize materials',
      'Learn proper techniques for measuring, cutting, and installing drywall',
      'Help maintain tools and equipment'
    ],
    requirements: [
      'No prior experience necessary - willing to train',
      'Strong work ethic and eagerness to learn',
      'Good physical stamina and ability to lift 50+ lbs',
      'Reliable transportation',
      'High school diploma or GED preferred'
    ],
    benefits: [
      'Starting pay: $17-20/hr with regular increases as skills develop',
      'Paid on-the-job training',
      'Health insurance after 90 days',
      'Opportunities for advancement',
      'Stable work schedule'
    ],
    postedDate: '2023-07-25',
    closingDate: '2023-08-25',
    featured: false
  },
  {
    id: '5',
    title: 'Marketing Coordinator',
    department: 'Marketing',
    location: 'Remote (Denver area preferred)',
    type: 'Part-time',
    experience: '2+ years',
    description: 'Develop and implement marketing strategies to promote our drywall and finishing services to residential and commercial clients.',
    responsibilities: [
      'Manage social media accounts and content calendar',
      'Update website content and blog',
      'Coordinate photo and video shoots of completed projects',
      'Design promotional materials and advertisements',
      'Track marketing metrics and report on campaign effectiveness'
    ],
    requirements: [
      'Experience in marketing, preferably in construction or related industries',
      'Proficiency with social media platforms and basic graphic design',
      'Excellent writing and communication skills',
      'Knowledge of SEO and digital marketing principles',
      'Self-motivated with ability to work independently'
    ],
    benefits: [
      'Competitive pay: $22-28/hr based on experience',
      'Flexible remote work arrangement (10-15 hours per week)',
      'Performance bonuses',
      'Opportunity to grow with the company',
      'Creative freedom and collaborative environment'
    ],
    postedDate: '2023-07-30',
    closingDate: '2023-08-30',
    featured: false
  }
];

// Format date function
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const JobsPage: React.FC = () => {
  return (
    <div className="jobs-page">
      <Helmet>
        <title>Careers | Seamless Edge Drywall</title>
        <meta name="description" content="Join our team of skilled craftsmen and professionals. View current job openings at Seamless Edge Drywall and Finishing." />
      </Helmet>

      <PageHero
        title="Join Our Team"
        subtitle="Explore career opportunities with Seamless Edge"
        backgroundImage="/images/updated/team/team-working.jpg"
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
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-accent-gold text-white rounded-md hover:bg-accent-sage transition-colors text-lg font-medium"
            >
              Submit Open Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobsPage; 