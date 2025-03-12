import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaStar, FaRegStar, FaCalendarAlt, FaEye, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';

// Job interface (same as in the other job-related files)
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

// Sample jobs data (same as in the other files)
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

// Job form interface for creating/editing jobs
interface JobFormData {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Seasonal';
  experience: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  postedDate: string;
  closingDate: string;
  featured: boolean;
}

// Initial form data
const initialFormData: JobFormData = {
  id: '',
  title: '',
  department: '',
  location: '',
  type: 'Full-time',
  experience: '',
  description: '',
  responsibilities: '',
  requirements: '',
  benefits: '',
  postedDate: new Date().toISOString().split('T')[0],
  closingDate: '',
  featured: false
};

const JobsManagement: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([...JOBS_DATA]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([...JOBS_DATA]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  
  // Get unique departments
  const departments = Array.from(new Set(jobs.map(job => job.department)));
  
  // Job types
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Seasonal'];
  
  // Filter jobs based on search term and filters
  useEffect(() => {
    const filtered = jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType ? job.type === filterType : true;
      const matchesDepartment = filterDepartment ? job.department === filterDepartment : true;
      
      return matchesSearch && matchesType && matchesDepartment;
    });
    
    setFilteredJobs(filtered);
  }, [searchTerm, filterType, filterDepartment, jobs]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Create a new job
  const handleCreateJob = () => {
    setIsEditing(false);
    setFormData({
      ...initialFormData,
      id: `job-${Date.now().toString(36)}`, // Generate a unique ID
      postedDate: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };
  
  // Edit an existing job
  const handleEditJob = (job: Job) => {
    setIsEditing(true);
    setSelectedJob(job);
    setFormData({
      ...job,
      responsibilities: job.responsibilities.join('\n'),
      requirements: job.requirements.join('\n'),
      benefits: job.benefits.join('\n'),
    });
    setShowModal(true);
  };
  
  // Delete a job
  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobs(prev => prev.filter(job => job.id !== id));
    }
  };
  
  // Toggle featured status
  const handleToggleFeatured = (id: string) => {
    setJobs(prev => 
      prev.map(job => 
        job.id === id ? { ...job, featured: !job.featured } : job
      )
    );
  };
  
  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJob: Job = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').filter(item => item.trim() !== ''),
      requirements: formData.requirements.split('\n').filter(item => item.trim() !== ''),
      benefits: formData.benefits.split('\n').filter(item => item.trim() !== ''),
    };
    
    if (isEditing) {
      // Update existing job
      setJobs(prev => 
        prev.map(job => 
          job.id === newJob.id ? newJob : job
        )
      );
    } else {
      // Add new job
      setJobs(prev => [...prev, newJob]);
    }
    
    // Close modal and reset form
    setShowModal(false);
    setFormData(initialFormData);
    setSelectedJob(null);
  };
  
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-accent-sage">Job Postings Management</h1>
          <button
            onClick={handleCreateJob}
            className="bg-accent-sage text-white px-4 py-2 rounded hover:bg-accent-gold transition-colors duration-300 flex items-center"
          >
            <FaPlus className="mr-2" />
            Create New Job
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Job Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        {/* Results summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} job postings
          </p>
        </div>
        
        {/* Jobs Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Job Title</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Department</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Type</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Location</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Posted Date</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Closing Date</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Featured</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <tr key={job.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-accent-sage">{job.title}</div>
                    </td>
                    <td className="py-3 px-4">{job.department}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center">
                        <FaClock className="mr-1 text-accent-sage text-xs" />
                        {job.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{job.location}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-accent-sage text-xs" />
                        {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-accent-sage text-xs" />
                        {new Date(job.closingDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleToggleFeatured(job.id)}
                        className="text-xl"
                        aria-label={job.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {job.featured ? (
                          <FaStar className="text-accent-gold" />
                        ) : (
                          <FaRegStar className="text-gray-400 hover:text-accent-gold" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="View job posting"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditJob(job)}
                          className="text-accent-sage hover:text-accent-gold"
                          aria-label="Edit job posting"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete job posting"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                    No job postings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Job Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-accent-sage">
                {isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="department">
                    Department*
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="type">
                    Job Type*
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                    required
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="experience">
                    Experience*
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                    required
                    placeholder="e.g. 2+ years"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="mr-2 h-5 w-5 text-accent-sage focus:ring-accent-sage/50"
                    />
                    Featured Job
                  </label>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="postedDate">
                    Posted Date*
                  </label>
                  <input
                    type="date"
                    id="postedDate"
                    name="postedDate"
                    value={formData.postedDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="closingDate">
                    Closing Date*
                  </label>
                  <input
                    type="date"
                    id="closingDate"
                    name="closingDate"
                    value={formData.closingDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                  Job Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                  rows={4}
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="responsibilities">
                  Responsibilities* (one per line)
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                  rows={5}
                  required
                  placeholder="Lead installation teams on commercial and residential projects&#10;Ensure all work meets company quality standards and building codes&#10;..."
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="requirements">
                  Requirements* (one per line)
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                  rows={5}
                  required
                  placeholder="Minimum 5 years of professional drywall installation experience&#10;Experience leading small teams&#10;..."
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="benefits">
                  Benefits* (one per line)
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50"
                  rows={5}
                  required
                  placeholder="Competitive salary based on experience ($30-$40/hour)&#10;Health and dental benefits after 3 months&#10;..."
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent-sage text-white rounded hover:bg-accent-gold transition-colors duration-300"
                >
                  {isEditing ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default JobsManagement; 