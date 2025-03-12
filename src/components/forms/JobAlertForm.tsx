import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaCheckCircle } from 'react-icons/fa';

interface JobAlertFormProps {
  className?: string;
}

const JobAlertForm: React.FC<JobAlertFormProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJobTypeToggle = (type: string) => {
    if (jobTypes.includes(type)) {
      setJobTypes(jobTypes.filter(t => t !== type));
    } else {
      setJobTypes([...jobTypes, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // Reset form after submission
      setEmail('');
      setJobTypes([]);
    }, 1500);
  };

  return (
    <div className={`job-alert-form ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <FaBell className="text-accent-gold mr-3 flex-shrink-0" />
          <h3 className="text-xl font-heading font-bold text-accent-sage">
            Job Alerts
          </h3>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-600 mb-5">
              Sign up to receive notifications when new positions matching your interests become available.
            </p>
            
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-accent-sage focus:border-accent-sage"
                required
              />
            </div>
            
            <div className="mb-5">
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Interested Job Types
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Full-time', 'Part-time', 'Contract', 'Remote'].map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      checked={jobTypes.includes(type)}
                      onChange={() => handleJobTypeToggle(type)}
                      className="w-4 h-4 text-accent-gold border-gray-300 rounded focus:ring-accent-sage"
                    />
                    <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-600">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !email}
              className={`w-full p-3 ${
                isLoading ? 'bg-gray-400' : 'bg-accent-gold hover:bg-accent-sage'
              } text-white rounded-md transition-colors flex justify-center items-center`}
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              {isLoading ? 'Subscribing...' : 'Subscribe to Job Alerts'}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-800 mb-2">Successfully Subscribed!</h4>
            <p className="text-gray-600">
              You'll now receive notifications about new job opportunities at Seamless Edge.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 text-accent-sage hover:text-accent-gold transition-colors"
            >
              Sign up for another email
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobAlertForm; 