import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaSpinner, FaEnvelope, FaPhone, FaFileAlt, FaEye, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabaseService from '../../services/supabaseService';
import { formatDistanceToNow } from 'date-fns';

// Define types
interface JobApplication {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  resume_url: string;
  job_id: number | null;
  status: 'new' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface Job {
  id: number;
  title: string;
}

const ApplicationsManagement: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch job applications
        const applicationsData = await supabaseService.jobApplications.getApplications();
        setApplications(applicationsData);
        
        // Fetch jobs for filtering
        const jobsData = await supabaseService.jobs.getJobs();
        setJobs(jobsData);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load applications');
        toast.error('Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    // Filter by status
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }
    
    // Filter by job
    if (jobFilter !== 'all' && app.job_id !== jobFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.full_name.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.position.toLowerCase().includes(searchLower) ||
        (app.message && app.message.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Handle status update
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await supabaseService.jobApplications.updateApplicationStatus(id, newStatus);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: newStatus as any } : app
        )
      );
      
      toast.success(`Application status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error('Failed to update application status');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }
    
    try {
      await supabaseService.jobApplications.deleteApplication(id);
      
      // Update local state
      setApplications(prev => prev.filter(app => app.id !== id));
      
      toast.success('Application deleted successfully');
    } catch (err: any) {
      console.error('Error deleting application:', err);
      toast.error('Failed to delete application');
    }
  };

  // View application details
  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  // Get job title by ID
  const getJobTitle = (jobId: number | null) => {
    if (!jobId) return 'General Application';
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : `Job #${jobId}`;
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Manage Job Applications | Seamless Edge Admin</title>
      </Helmet>
      
      <h1 className="text-2xl font-bold mb-6">Job Applications</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, position..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-sage/30 focus:border-accent-sage"
            />
          </div>
          
          {/* Status filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-sage/30 focus:border-accent-sage"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="interviewed">Interviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          {/* Job filter */}
          <div>
            <label htmlFor="jobFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              id="jobFilter"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-sage/30 focus:border-accent-sage"
            >
              <option value="all">All Positions</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
              <option value="null">General Applications</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Applications table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <FaSpinner className="animate-spin text-accent-sage h-8 w-8" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No applications found matching your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map(application => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{application.full_name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaEnvelope className="text-xs mr-1" />
                        {application.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaPhone className="text-xs mr-1" />
                        {application.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getJobTitle(application.job_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="text-accent-sage hover:text-accent-gold"
                          title="View details"
                        >
                          <FaEye />
                        </button>
                        <div className="relative group">
                          <button
                            className="text-accent-sage hover:text-accent-gold"
                            title="Update status"
                          >
                            <FaCheck />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                            <div className="py-1">
                              {['new', 'reviewing', 'interviewed', 'accepted', 'rejected'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusUpdate(application.id, status)}
                                  disabled={application.status === status}
                                  className={`${
                                    application.status === status
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  } block px-4 py-2 text-sm w-full text-left`}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(application.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete application"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Application view modal */}
      {isViewModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setIsViewModalOpen(false)}>
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center bg-accent-sage text-white p-4">
              <h2 className="text-xl font-bold">Application Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-white hover:text-neutral-offwhite transition-colors"
                aria-label="Close modal"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Applicant Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-1">
                      <span className="font-medium">Name:</span> {selectedApplication.full_name}
                    </p>
                    <p className="mb-1">
                      <span className="font-medium">Email:</span> {selectedApplication.email}
                    </p>
                    <p className="mb-1">
                      <span className="font-medium">Phone:</span> {selectedApplication.phone}
                    </p>
                    <p className="mb-1">
                      <span className="font-medium">Applied on:</span>{" "}
                      {new Date(selectedApplication.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Position Details</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-1">
                      <span className="font-medium">Position:</span>{" "}
                      {selectedApplication.position || getJobTitle(selectedApplication.job_id)}
                    </p>
                    <p className="mb-1">
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </span>
                    </p>
                    {selectedApplication.resume_url && (
                      <p className="mb-1">
                        <span className="font-medium">Resume:</span>{" "}
                        <a
                          href={supabaseService.storage.getPublicUrl(selectedApplication.resume_url, 'resumes').publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-sage hover:text-accent-gold inline-flex items-center"
                        >
                          <FaFileAlt className="mr-1" /> View Resume
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedApplication.message && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Additional Message</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="whitespace-pre-wrap">{selectedApplication.message}</p>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Status
                  </label>
                  <div className="flex gap-2">
                    {['new', 'reviewing', 'interviewed', 'accepted', 'rejected'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          handleStatusUpdate(selectedApplication.id, status);
                          setSelectedApplication(prev => prev ? {...prev, status: status as any} : null);
                        }}
                        disabled={selectedApplication.status === status}
                        className={`px-3 py-1 text-xs rounded ${
                          selectedApplication.status === status
                            ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                            : 'bg-accent-sage text-white hover:bg-accent-gold'
                        } transition-colors`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleDelete(selectedApplication.id);
                    setIsViewModalOpen(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement; 