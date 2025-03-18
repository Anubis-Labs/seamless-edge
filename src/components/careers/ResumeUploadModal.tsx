import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: {
    id: string;
    title: string;
    department: string;
  };
}

const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({ isOpen, onClose, job }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    resumeFile: null as File | null,
    message: '',
  });
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData(prev => ({ ...prev, resumeFile: file }));
      setFileName(file.name);
      // Clear error when user uploads file
      if (errors.resumeFile) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.resumeFile;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.resumeFile) newErrors.resumeFile = 'Resume is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    // In a real application, you would upload the file to your server here
    // For this example, we'll simulate a successful upload after a delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          position: '',
          resumeFile: null,
          message: '',
        });
        setFileName('');
        onClose();
      }, 5000);
    }, 2000);
  };

  // Set position when job changes
  useEffect(() => {
    if (job?.title) {
      setFormData(prev => ({ 
        ...prev, 
        position: job.title 
      }));
    }
  }, [job]);

  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={onClose} // Close when clicking outside
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-accent-sage text-white p-5">
              <h3 className="text-xl font-bold font-heading">
                {job ? `Apply for ${job.title}` : 'Open Application'}
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-neutral-offwhite transition-colors"
                aria-label="Close modal"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-10">
                  <FaCheckCircle className="text-accent-sage text-5xl mx-auto mb-4" />
                  <h4 className="text-2xl font-heading font-bold text-accent-sage mb-2">Application Received!</h4>
                  <p className="text-gray-600 mb-6">
                    Thank you for your interest in joining our team. We'll review your application and contact you if there's a match for your skills and experience.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    {job 
                      ? `Submit your application for the ${job.title} position. We look forward to reviewing your qualifications.` 
                      : 'Submit your resume and contact information for consideration in future opportunities. We\'re always looking for talented individuals to join our team.'}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md border ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-accent-sage/30 focus:border-accent-sage outline-none transition-colors`}
                        placeholder="Your full name"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-accent-sage/30 focus:border-accent-sage outline-none transition-colors`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-accent-sage/30 focus:border-accent-sage outline-none transition-colors`}
                        placeholder="(123) 456-7890"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    {/* Position of Interest */}
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                        Position of Interest
                      </label>
                      {job ? (
                        <input
                          type="text"
                          id="position"
                          name="position"
                          value={formData.position}
                          readOnly
                          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50"
                        />
                      ) : (
                        <select
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-sage/30 focus:border-accent-sage outline-none transition-colors"
                        >
                          <option value="">General Application</option>
                          <option value="Installation">Drywall Installation</option>
                          <option value="Finishing">Drywall Finishing/Taping</option>
                          <option value="Estimating">Estimating/Sales</option>
                          <option value="Administration">Office/Administration</option>
                          <option value="Management">Project Management</option>
                        </select>
                      )}
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700 mb-1">
                        Resume <span className="text-red-500">*</span>
                      </label>
                      <div 
                        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                          errors.resumeFile ? 'border-red-500' : 'border-gray-300'
                        }`}
                        onClick={() => document.getElementById('resumeFile')?.click()}
                      >
                        <input
                          type="file"
                          id="resumeFile"
                          name="resumeFile"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        {fileName ? (
                          <div className="flex items-center justify-center space-x-2 text-accent-sage">
                            <FaCheckCircle />
                            <span>{fileName}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400" />
                            <p className="text-sm text-gray-500">
                              Click to upload your resume (PDF, DOC, DOCX)
                            </p>
                          </div>
                        )}
                      </div>
                      {errors.resumeFile && (
                        <p className="mt-1 text-sm text-red-500">{errors.resumeFile}</p>
                      )}
                    </div>

                    {/* Additional Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-sage/30 focus:border-accent-sage outline-none transition-colors"
                        placeholder="Tell us about your experience, skills, or anything else you'd like to share..."
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 mr-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-accent-sage text-white rounded-md hover:bg-accent-forest transition-colors flex items-center"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeUploadModal; 