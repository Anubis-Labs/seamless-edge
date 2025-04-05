import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaStar, FaRegStar, FaCalendarAlt, FaEye, FaClock, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import supabaseService from '../../services/supabaseService';

// Interface matching Supabase jobs table (adjust if needed)
interface Job {
  id: number; // Changed from string to number assuming integer ID in DB
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Seasonal';
  experience: string;
  description: string;
  responsibilities: string[]; // Store as JSON array in DB?
  requirements: string[];   // Store as JSON array in DB?
  benefits: string[];       // Store as JSON array in DB?
  posted_date: string;    // snake_case
  closing_date: string;   // snake_case
  featured: boolean;
  created_at?: string;
}

// Interface for form data (using newline-separated strings for array fields)
interface JobFormData {
  id: number | null; // Allow null for new jobs
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Seasonal';
  experience: string;
  description: string;
  responsibilities: string; // Newline separated
  requirements: string;   // Newline separated
  benefits: string;       // Newline separated
  posted_date: string;
  closing_date: string;
  featured: boolean;
}

// Initial form data
const initialFormData: JobFormData = {
  id: null,
  title: '',
  department: '',
  location: '',
  type: 'Full-time',
  experience: '',
  description: '',
  responsibilities: '',
  requirements: '',
  benefits: '',
  posted_date: new Date().toISOString().split('T')[0],
  closing_date: '',
  featured: false
};

const JobsManagement: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // Keep for delete confirmation text
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await supabaseService.jobs.getJobs();
      setJobs(data || []);
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      setError('Failed to load jobs.');
      toast.error('Failed to load jobs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Get unique departments for filtering
  const departments = Array.from(new Set(jobs.map(job => job.department))).filter(d => d);
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Seasonal'];

  // Filter jobs
  useEffect(() => {
    const filtered = jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType ? job.type === filterType : true;
      const matchesDepartment = filterDepartment ? job.department === filterDepartment : true;
      return matchesSearch && matchesType && matchesDepartment;
    });
    setFilteredJobs(filtered);
  }, [searchTerm, filterType, filterDepartment, jobs]);

  // Form input handlers (unchanged)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Prepare for creating a new job
  const handleCreateJob = () => {
    setIsEditing(false);
    setFormData(initialFormData); // Reset form
    setShowModal(true);
  };

  // Prepare for editing an existing job
  const handleEditJob = (job: Job) => {
    setIsEditing(true);
    setSelectedJob(job); // Store original job if needed
    setFormData({
      ...job,
      // Convert arrays to newline-separated strings for textarea
      responsibilities: job.responsibilities?.join('\n') || '',
      requirements: job.requirements?.join('\n') || '',
      benefits: job.benefits?.join('\n') || '',
    });
    setShowModal(true);
  };

  // Delete a job
  const handleDeleteJob = async (id: number) => {
    const jobToDelete = jobs.find(j => j.id === id);
    if (!window.confirm(`Are you sure you want to delete the job posting "${jobToDelete?.title || 'this job'}"?`)) return;
    setIsSaving(true);
    try {
      await supabaseService.jobs.deleteJob(id);
      toast.success('Job posting deleted!');
      await fetchJobs();
    } catch (err: any) {
      console.error("Error deleting job:", err);
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (job: Job) => {
    setIsSaving(true);
    try {
      await supabaseService.jobs.updateJob(job.id, { featured: !job.featured });
      toast.success(`Featured status updated.`);
      // Optimistically update or refetch
      setJobs(prev => prev.map(j => j.id === job.id ? {...j, featured: !job.featured} : j));
      // await fetchJobs(); // Alternatively, refetch
    } catch (err: any) {
      console.error("Error updating featured status:", err);
      toast.error(`Failed to update: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Convert newline-separated strings back to arrays
    const jobDataForDb: Omit<Job, 'id' | 'created_at'> & { id?: number } = {
      ...formData,
      id: isEditing ? formData.id ?? undefined : undefined, // Include ID only if editing
      responsibilities: formData.responsibilities.split('\n').filter(item => item.trim() !== ''),
      requirements: formData.requirements.split('\n').filter(item => item.trim() !== ''),
      benefits: formData.benefits.split('\n').filter(item => item.trim() !== ''),
    };

    try {
      if (isEditing && jobDataForDb.id) {
        await supabaseService.jobs.updateJob(jobDataForDb.id, jobDataForDb);
        toast.success('Job posting updated!');
      } else {
        const { id, ...createData } = jobDataForDb; // Exclude id for creation
        await supabaseService.jobs.createJob(createData);
        toast.success('Job posting created!');
      }
      setShowModal(false);
      setFormData(initialFormData);
      setSelectedJob(null);
      await fetchJobs(); // Refetch list
    } catch (err: any) {
      console.error("Error saving job:", err);
      toast.error(`Failed to save: ${err.message}`);
      setError(`Modal error: ${err.message}`); // Show error in modal
    } finally {
      setIsSaving(false);
    }
  };

   // Format date
   const formatDate = (dateString: string | null | undefined) => {
     if (!dateString) return 'N/A';
     try { const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }; return new Date(dateString).toLocaleDateString('en-US', options); } catch (e) { return dateString; }
   };

  return (
    <>
    <Helmet><title>Jobs Management | Seamless Edge Admin</title></Helmet>
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-accent-sage">Job Postings Management</h1>
        <button onClick={handleCreateJob} className="bg-accent-sage text-white px-4 py-2 rounded hover:bg-accent-gold transition-colors duration-300 flex items-center disabled:opacity-50" disabled={isLoading || isSaving}>
          <FaPlus className="mr-2" /> Create New Job
        </button>
      </div>
      {error && !showModal && (<div className="bg-red-100 text-red-800 text-sm p-4 mb-4" role="alert">{error}</div>)}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[280px]">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="relative flex-1 min-w-[280px]">
          <select
            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:opacity-50"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            disabled={isLoading}
          >
            <option value="">All Departments</option>
            {departments.map(department => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
          <FaFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>
        
        <div className="relative flex-1 min-w-[280px]">
          <select
            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:opacity-50"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            disabled={isLoading}
          >
            <option value="">All Job Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <FaFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} job postings
        </p>
      </div>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin h-10 w-10 text-accent-sage" />
          </div>
        ) : (
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
                        {formatDate(job.posted_date)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-accent-sage text-xs" />
                        {formatDate(job.closing_date)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleToggleFeatured(job)}
                        className="text-xl disabled:opacity-50"
                        disabled={isSaving}
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
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          disabled={isSaving}
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditJob(job)}
                          className="text-accent-sage hover:text-accent-gold disabled:opacity-50"
                          disabled={isSaving}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          disabled={isSaving}
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
        )}
      </div>
      
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
              {error && showModal && (<div className="bg-red-100 text-red-800 text-sm p-4 mb-6" role="alert">{error}</div>)}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex-1 min-w-[280px]">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                    required
                    disabled={isSaving}
                  />
                </div>
                
                <div className="flex-1 min-w-[280px]">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="department">
                    Department*
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                    required
                    disabled={isSaving}
                  />
                </div>
                
                <div className="flex-1 min-w-[280px]">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                    required
                    disabled={isSaving}
                  />
                </div>
                
                <div className="flex-1 min-w-[280px]">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="type">
                    Job Type*
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                    required
                    disabled={isSaving}
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1 min-w-[280px]">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="experience">
                    Experience*
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                    required
                    placeholder="e.g. 2+ years"
                    disabled={isSaving}
                  />
                </div>
                
                <div className="flex-1 min-w-[280px]">
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="mr-2 h-5 w-5 text-accent-sage focus:ring-accent-sage/50 disabled:opacity-50"
                      disabled={isSaving}
                    />
                    Featured Job
                  </label>
                </div>
                
                <div className="flex-1 min-w-[280px]">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="posted_date">
                    Posted Date*
                  </label>
                  <input
                    type="date"
                    id="posted_date"
                    name="posted_date"
                    value={formData.posted_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                    required
                    disabled={isSaving}
                  />
                </div>
                
                <div className="flex-1 min-w-[280px]">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="closing_date">
                    Closing Date*
                  </label>
                  <input
                    type="date"
                    id="closing_date"
                    name="closing_date"
                    value={formData.closing_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                    required
                    disabled={isSaving}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                  rows={4}
                  required
                  disabled={isSaving}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                  rows={5}
                  required
                  placeholder="Lead installation teams on commercial and residential projects&#10;Ensure all work meets company quality standards and building codes&#10;..."
                  disabled={isSaving}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                  rows={5}
                  required
                  placeholder="Minimum 5 years of professional drywall installation experience&#10;Experience leading small teams&#10;..."
                  disabled={isSaving}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-sage/50 disabled:bg-gray-100"
                  rows={5}
                  required
                  placeholder="Competitive salary based on experience ($30-$40/hour)&#10;Health and dental benefits after 3 months&#10;..."
                  disabled={isSaving}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent-sage text-white rounded hover:bg-accent-gold transition-colors duration-300 disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? <FaSpinner className="animate-spin mr-2" /> : null}
                  {isEditing ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
    </>
  );
};

export default JobsManagement; 