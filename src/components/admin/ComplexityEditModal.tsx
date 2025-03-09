import React, { useState, useEffect } from 'react';
import { ComplexityOption } from '../../services/calculatorService';

interface ComplexityEditModalProps {
  complexity: ComplexityOption | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (complexity: ComplexityOption, isNew: boolean) => void;
}

const ComplexityEditModal: React.FC<ComplexityEditModalProps> = ({ 
  complexity, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [multiplier, setMultiplier] = useState<number>(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Reset form when complexity changes
  useEffect(() => {
    if (complexity) {
      setId(complexity.id);
      setName(complexity.name);
      setDescription(complexity.description);
      setMultiplier(complexity.multiplier);
      setErrors({});
    } else {
      // Default values for new complexity option
      setId('');
      setName('');
      setDescription('');
      setMultiplier(1);
      setErrors({});
    }
  }, [complexity]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!id.trim()) {
      newErrors.id = 'ID is required';
    } else if (!/^[a-z0-9-]+$/.test(id)) {
      newErrors.id = 'ID can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (multiplier <= 0) {
      newErrors.multiplier = 'Multiplier must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const updatedComplexity: ComplexityOption = {
      id,
      name,
      description,
      multiplier
    };
    
    onSave(updatedComplexity, !complexity);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {complexity ? 'Edit Complexity Level' : 'Add New Complexity Level'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <input 
              type="text" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={!!complexity} // Cannot edit ID of existing complexity
              className={`shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.id ? 'border-red-300' : ''
              }`}
              placeholder="complexity-id"
            />
            {errors.id && (
              <p className="mt-1 text-sm text-red-600">{errors.id}</p>
            )}
            {!!complexity && (
              <p className="mt-1 text-xs text-gray-500">ID cannot be changed after creation</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.name ? 'border-red-300' : ''
              }`}
              placeholder="Complexity Name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.description ? 'border-red-300' : ''
              }`}
              placeholder="Brief description of the complexity level"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Multiplier
            </label>
            <input 
              type="number" 
              step="0.01"
              min="0.01"
              value={multiplier}
              onChange={(e) => setMultiplier(parseFloat(e.target.value) || 1)}
              className={`shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.multiplier ? 'border-red-300' : ''
              }`}
              placeholder="1.0"
            />
            {errors.multiplier && (
              <p className="mt-1 text-sm text-red-600">{errors.multiplier}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Factor to multiply labor costs by (1.0 = no change, 1.5 = 50% more, 0.8 = 20% less)
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-accent-forest rounded-md hover:bg-accent-forest-dark"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplexityEditModal; 