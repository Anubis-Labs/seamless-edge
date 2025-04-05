import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import supabaseService from '../../services/supabaseService';
import { FaSave, FaSpinner, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

// Interfaces for structure (assuming nested object under 'calculator' key)
interface DiscountThreshold {
  squareFootage: number;
  discountPercentage: number;
}

interface CalculationSettingsData {
  materialsCostPercentage: number;
  laborCostPercentage: number;
  minimumProjectSize: number;
  discountThresholds: DiscountThreshold[];
}

interface ServiceOption { id: string; name: string; description: string; icon: string; basePrice: number; }
interface ComplexityOption { id: string; name: string; description: string; multiplier: number; }
interface AddonOption { id: string; name: string; description: string; price: number; unit: 'per_sqft' | 'flat'; }
interface LocationOption { id: string; name: string; multiplier: number; }

// Structure for the entire 'calculator' settings value
interface CalculatorSettings {
    calculationSettings: CalculationSettingsData;
    serviceOptions?: ServiceOption[];
    complexityOptions?: ComplexityOption[];
    addonOptions?: AddonOption[];
    locationOptions?: LocationOption[];
}

// Default state
const defaultCalcSettings: CalculationSettingsData = {
    materialsCostPercentage: 0.4,
    laborCostPercentage: 0.6,
    minimumProjectSize: 100,
    discountThresholds: []
};

type SettingsSectionKey = keyof Omit<CalculatorSettings, 'calculationSettings'>; // Keys for list sections

// Add type for form data within list sections
type EditingItem<T> = T & { isNew?: boolean };

const CalculatorSettingsPage: React.FC = () => {
  const [calcSettings, setCalcSettings] = useState<CalculationSettingsData>(defaultCalcSettings);
  // State for other sections
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [complexityOptions, setComplexityOptions] = useState<ComplexityOption[]>([]);
  const [addonOptions, setAddonOptions] = useState<AddonOption[]>([]);
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // State for inline editing - store the item being edited, or an empty object for 'add new'
  const [editingService, setEditingService] = useState<EditingItem<ServiceOption> | null>(null);
  const [editingComplexity, setEditingComplexity] = useState<EditingItem<ComplexityOption> | null>(null);
  const [editingAddon, setEditingAddon] = useState<EditingItem<AddonOption> | null>(null);
  const [editingLocation, setEditingLocation] = useState<EditingItem<LocationOption> | null>(null);
  const [editingThreshold, setEditingThreshold] = useState<EditingItem<DiscountThreshold> | null>(null); // Merged editing state for thresholds

  // Fetch all calculator settings
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedData = await supabaseService.settings.getSectionSettings('calculator');
      
      // Set Calculation Settings (merge with defaults)
      setCalcSettings({ 
          ...defaultCalcSettings, 
          ...(fetchedData.calculationSettings || {}) 
      });
      // Set other sections (or default to empty arrays)
      setServiceOptions(fetchedData.serviceOptions || []);
      setComplexityOptions(fetchedData.complexityOptions || []);
      setAddonOptions(fetchedData.addonOptions || []);
      setLocationOptions(fetchedData.locationOptions || []);

    } catch (err: any) {
      console.error("Error fetching calculator settings:", err);
      setError('Failed to load settings. Displaying defaults.');
      toast.error('Failed to load settings. Displaying defaults.');
      // Reset to defaults on error
      setCalcSettings(defaultCalcSettings);
      setServiceOptions([]);
      setComplexityOptions([]);
      setAddonOptions([]);
      setLocationOptions([]);
    } finally {
      setIsLoading(false);
      setHasChanges(false); // Reset changes state after fetch
      // Reset editing states
      setEditingService(null);
      setEditingComplexity(null);
      setEditingAddon(null);
      setEditingLocation(null);
      setEditingThreshold(null);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handle changes specifically for CalculationSettingsData (core percentages, min size)
  const handleCalcSettingChange = <K extends keyof Omit<CalculationSettingsData, 'discountThresholds'>>(
    field: K,
    value: CalculationSettingsData[K]
  ) => {
    setCalcSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // --- State Update/Delete Helpers ---

  // Update function for lists with an 'id' field
  const updateListById = <T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    newItem: T
  ) => {
    setter(prev => {
      const itemWithId = { ...newItem, id: newItem.id || uuidv4() }; // Ensure ID exists
      const exists = prev.some(i => i.id === itemWithId.id);
      if (exists) {
        return prev.map(i => (i.id === itemWithId.id ? itemWithId : i));
      } else {
        return [...prev, itemWithId];
      }
    });
    setHasChanges(true);
  };

  // Delete function for lists with an 'id' field
  const deleteListById = <T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: string
  ) => {
    if (!window.confirm(`Are you sure you want to delete this item?`)) return;
    setter(prev => prev.filter(item => item.id !== id));
    setHasChanges(true);
  };

  // Update function specifically for the discountThresholds array within calcSettings
  const updateThresholdsState = (newThreshold: DiscountThreshold, originalSqFt: number | null | undefined) => {
    setCalcSettings(prev => {
        let updatedThresholds;
        const isEditing = originalSqFt !== null && originalSqFt !== undefined;
        if (isEditing) {
            updatedThresholds = prev.discountThresholds.map(t => t.squareFootage === originalSqFt ? newThreshold : t);
        } else {
            updatedThresholds = [...prev.discountThresholds, newThreshold];
        }
        // Sort thresholds after adding/updating
        updatedThresholds.sort((a, b) => a.squareFootage - b.squareFootage);
        return { ...prev, discountThresholds: updatedThresholds };
    });
    setHasChanges(true);
 };

  // Delete function specifically for discountThresholds array within calcSettings
  const deleteThresholdFromState = (sqFt: number) => {
    if (!window.confirm(`Are you sure you want to delete the threshold for ${sqFt} sq ft?`)) return;
      setCalcSettings(prev => ({
          ...prev,
          discountThresholds: prev.discountThresholds.filter(t => t.squareFootage !== sqFt)
      }));
      setHasChanges(true);
  };


  // Save *ALL* settings together
  const handleSaveAllSettings = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Ensure discount thresholds are part of the calcSettings being saved
      const completeCalcSettings: CalculationSettingsData = {
        ...calcSettings,
        // The discountThresholds state is managed directly within calcSettings now
      };

      const fullSettingsToSave: CalculatorSettings = {
        calculationSettings: completeCalcSettings,
        serviceOptions: serviceOptions,
        complexityOptions: complexityOptions,
        addonOptions: addonOptions,
        locationOptions: locationOptions
      };

      await supabaseService.settings.updateSettings('calculator', fullSettingsToSave);
      toast.success('Calculator settings saved successfully!');
      setHasChanges(false); // Reset changes state
      // Clear editing states after successful save
      setEditingService(null);
      setEditingComplexity(null);
      setEditingAddon(null);
      setEditingLocation(null);
      setEditingThreshold(null);
    } catch (err: any) {
      console.error("Error saving calculator settings:", err);
      setError(`Failed to save settings: ${err.message || 'Unknown error'}`);
      toast.error(`Failed to save settings: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Specific Handlers for Starting Edits/Adds and Save/Delete Actions ---

  const handleEditService = (item: ServiceOption) => setEditingService({ ...item });
  const handleAddService = () => setEditingService({ id: '', name: '', description: '', icon: '', basePrice: 0, isNew: true });
  const handleCancelService = () => setEditingService(null);
  const handleSaveService = (item: ServiceOption) => {
    updateListById(setServiceOptions, item);
    handleCancelService();
  };
  const handleDeleteService = (id: string) => deleteListById(setServiceOptions, id);

  const handleEditComplexity = (item: ComplexityOption) => setEditingComplexity({ ...item });
  const handleAddComplexity = () => setEditingComplexity({ id: '', name: '', description: '', multiplier: 1.0, isNew: true });
  const handleCancelComplexity = () => setEditingComplexity(null);
  const handleSaveComplexity = (item: ComplexityOption) => {
    updateListById(setComplexityOptions, item);
    handleCancelComplexity();
  };
  const handleDeleteComplexity = (id: string) => deleteListById(setComplexityOptions, id);

  const handleEditAddon = (item: AddonOption) => setEditingAddon({ ...item });
  const handleAddAddon = () => setEditingAddon({ id: '', name: '', description: '', price: 0, unit: 'flat', isNew: true });
  const handleCancelAddon = () => setEditingAddon(null);
  const handleSaveAddon = (item: AddonOption) => {
    updateListById(setAddonOptions, item);
    handleCancelAddon();
  };
  const handleDeleteAddon = (id: string) => deleteListById(setAddonOptions, id);

  const handleEditLocation = (item: LocationOption) => setEditingLocation({ ...item });
  const handleAddLocation = () => setEditingLocation({ id: '', name: '', multiplier: 1.0, isNew: true });
  const handleCancelLocation = () => setEditingLocation(null);
  const handleSaveLocation = (item: LocationOption) => {
    updateListById(setLocationOptions, item);
    handleCancelLocation();
  };
  const handleDeleteLocation = (id: string) => deleteListById(setLocationOptions, id);

  const handleEditThreshold = (item: DiscountThreshold) => setEditingThreshold({ ...item, isNew: false });
  const handleAddThreshold = () => setEditingThreshold({ squareFootage: 0, discountPercentage: 0, isNew: true });
  const handleCancelThreshold = () => setEditingThreshold(null);
  const handleSaveThreshold = (itemToSave: DiscountThreshold) => {
      const isNew = editingThreshold?.isNew ?? false;
      // If editing, get the original sqft to check against duplicates correctly
      const originalSqFt = !isNew ? editingThreshold?.squareFootage : null;

      // Check for duplicate squareFootage before saving
      if (calcSettings.discountThresholds.some(t => t.squareFootage === itemToSave.squareFootage && t.squareFootage !== originalSqFt)) {
          toast.error(`A discount threshold for ${itemToSave.squareFootage} sq ft already exists.`);
          return; // Prevent saving duplicate
      }

      updateThresholdsState(itemToSave, originalSqFt);
      handleCancelThreshold(); // Close form
  };

  // Use the specific delete function for thresholds
  const handleDeleteThreshold = (sqFt: number) => {
      deleteThresholdFromState(sqFt);
  };

  // --- Inline Form Components ---

  // ServiceItemForm (remains the same)
  const ServiceItemForm: React.FC<{ item: EditingItem<ServiceOption>, onSave: (item: ServiceOption) => void, onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    const isNew = item.isNew === true;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.basePrice < 0) {
            toast.error("Service Name and a non-negative Base Price are required.");
            return;
        }
        const { isNew, ...saveData } = formData; // Remove isNew flag before saving
        onSave(saveData as ServiceOption);
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-gray-50 mb-4">
        <h3 className="text-lg font-semibold mb-3">{isNew ? 'Add New Service' : `Editing: ${item.name}`}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="hidden" name="id" value={formData.id} />
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Price ($)</label>
            <input type="number" step="0.01" min="0" name="basePrice" value={formData.basePrice} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Icon (e.g., 'FaTools')</label>
            <input type="text" name="icon" value={formData.icon} onChange={handleChange} placeholder="Optional icon name" className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={onCancel} className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit" className="px-3 py-1 bg-accent-forest text-white rounded hover:bg-accent-forest-dark flex items-center">
            <FaSave className="mr-1" /> {isNew ? 'Add Service' : 'Save Changes'}
          </button>
        </div>
      </form>
    );
  };

  // ComplexityItemForm (Expanded and corrected)
  const ComplexityItemForm: React.FC<{ item: EditingItem<ComplexityOption>, onSave: (item: ComplexityOption) => void, onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    const isNew = item.isNew === true;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.multiplier < 0) {
            toast.error("Complexity Name and a non-negative Multiplier are required.");
            return;
        }
        const { isNew, ...saveData } = formData;
        onSave(saveData as ComplexityOption);
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-gray-50 mb-4">
        <h3 className="text-lg font-semibold mb-3">{isNew ? 'Add Complexity Level' : `Editing: ${item.name}`}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="hidden" name="id" value={formData.id} />
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Multiplier (e.g., 1.2)</label>
            <input type="number" step="0.01" min="0" name="multiplier" value={formData.multiplier} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={onCancel} className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit" className="px-3 py-1 bg-accent-forest text-white rounded hover:bg-accent-forest-dark flex items-center">
            <FaSave className="mr-1" /> {isNew ? 'Add Level' : 'Save Changes'}
          </button>
        </div>
      </form>
    );
  };

  // AddonItemForm (Expanded and corrected)
  const AddonItemForm: React.FC<{ item: EditingItem<AddonOption>, onSave: (item: AddonOption) => void, onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    const isNew = item.isNew === true;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.price < 0) {
            toast.error("Add-on Name and a non-negative Price are required.");
            return;
        }
        const { isNew, ...saveData } = formData;
        onSave(saveData as AddonOption);
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-gray-50 mb-4">
        <h3 className="text-lg font-semibold mb-3">{isNew ? 'Add Feature Add-on' : `Editing: ${item.name}`}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="hidden" name="id" value={formData.id} />
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
              <option value="flat">Flat Rate</option>
              <option value="per_sqft">Per Sq Ft</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={onCancel} className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit" className="px-3 py-1 bg-accent-forest text-white rounded hover:bg-accent-forest-dark flex items-center">
            <FaSave className="mr-1" /> {isNew ? 'Add Add-on' : 'Save Changes'}
          </button>
        </div>
      </form>
    );
  };

  // LocationItemForm (Expanded and corrected)
  const LocationItemForm: React.FC<{ item: EditingItem<LocationOption>, onSave: (item: LocationOption) => void, onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    const isNew = item.isNew === true;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.multiplier < 0) {
            toast.error("Location Name and a non-negative Multiplier are required.");
            return;
        }
        const { isNew, ...saveData } = formData;
        onSave(saveData as LocationOption);
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-gray-50 mb-4">
        <h3 className="text-lg font-semibold mb-3">{isNew ? 'Add Location Factor' : `Editing: ${item.name}`}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="hidden" name="id" value={formData.id} />
          <div>
            <label className="block text-sm font-medium text-gray-700">Location Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Multiplier (e.g., 1.1)</label>
            <input type="number" step="0.01" min="0" name="multiplier" value={formData.multiplier} onChange={handleChange} required className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={onCancel} className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit" className="px-3 py-1 bg-accent-forest text-white rounded hover:bg-accent-forest-dark flex items-center">
            <FaSave className="mr-1" /> {isNew ? 'Add Factor' : 'Save Changes'}
          </button>
        </div>
      </form>
    );
   };

  // ThresholdItemForm (Corrected structure for table row)
   const ThresholdItemForm: React.FC<{ item: EditingItem<DiscountThreshold>, onSave: (item: DiscountThreshold) => void, onCancel: () => void }> = ({ item, onSave, onCancel }) => {
     const [formData, setFormData] = useState(item);
     const isNew = item.isNew === true;

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Ensure discount percentage remains between 0 and 1
        let parsedValue = name === 'discountPercentage' ? parseFloat(value) : parseInt(value) || 0;
        if (name === 'discountPercentage') {
            parsedValue = Math.max(0, Math.min(1, parsedValue || 0));
        }
        if (name === 'squareFootage') {
            parsedValue = Math.max(0, parsedValue || 0); // Ensure positive sqft
        }
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleFormSubmit = (e?: React.FormEvent) => {
        e?.preventDefault(); // Prevent default if called from button/enter key
         if (formData.squareFootage <= 0 || formData.discountPercentage < 0 || formData.discountPercentage > 1) {
             toast.error("Square Footage must be positive. Discount must be between 0 and 1 (e.g., 0.1 for 10%).");
             return;
         }
        const { isNew, ...saveData } = formData;
        onSave(saveData as DiscountThreshold); // Call the passed-in onSave handler
    };

    // Render as table row elements
     return (
       <tr className="bg-blue-50">
         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
           <input
             type="number"
             name="squareFootage"
             value={formData.squareFootage > 0 ? formData.squareFootage : ''} // Show empty for 0 or negative placeholder
             onChange={handleChange}
             placeholder="Sq Ft Threshold"
             required
             min="1"
             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-1"
             disabled={!isNew} // Only allow editing sqft for new thresholds
             aria-label="Square Footage Threshold"
           />
         </td>
         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
           <div className="flex items-center">
             <input
               type="number"
               name="discountPercentage"
               step="0.01"
               min="0"
               max="1"
               value={formData.discountPercentage}
               onChange={handleChange}
               placeholder="Discount (0-1)"
               required
               className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-1"
               aria-label="Discount Percentage"
             />
             <span className="ml-2 text-gray-500">({Math.round(formData.discountPercentage * 100)}%)</span>
           </div>
         </td>
         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
           <div className="flex justify-end space-x-2">
             <button type="button" onClick={() => handleFormSubmit()} className="text-green-600 hover:text-green-800" disabled={isSaving} aria-label="Save Threshold">Save</button>
             <button type="button" onClick={onCancel} className="text-gray-600 hover:text-gray-800" disabled={isSaving} aria-label="Cancel Edit Threshold">Cancel</button>
           </div>
         </td>
       </tr>
     );
   };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin h-12 w-12 text-accent-forest" /></div>;
  }

  // Helper to render list sections consistently
  const renderListSection = <T extends { id: string; name: string; }>(
    title: string,
    items: T[],
    editingItem: EditingItem<T> | null,
    ItemFormComponent: React.ComponentType<{ item: EditingItem<T>, onSave: (item: T) => void, onCancel: () => void }>,
    onAdd: () => void,
    onEdit: (item: T) => void,
    onDelete: (id: string) => void,
    onSaveHandler: (item: T) => void,
    onCancelHandler: () => void,
    renderItemDetails: (item: T) => React.ReactNode
  ) => (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={onAdd}
          disabled={isSaving || editingItem !== null}
          className={`px-3 py-1 text-sm rounded flex items-center ${editingItem !== null ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition`}
        >
          <FaPlus className="mr-1" /> Add New
        </button>
      </div>

      {editingItem && <ItemFormComponent item={editingItem} onSave={onSaveHandler} onCancel={onCancelHandler} />}

      {items.length === 0 && !editingItem && (
          <p className="text-center text-gray-500 py-4">No {title.toLowerCase()} configured yet.</p>
      )}

      {items.length > 0 && (
          <ul className="space-y-3">
              {items.map((item) => (
                  <li key={item.id} className="border rounded-md p-3 flex justify-between items-start bg-white hover:bg-gray-50 transition duration-150 ease-in-out">
                      <div className="flex-1 mr-4">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {renderItemDetails(item)}
                      </div>
                      <div className="flex-shrink-0 flex items-center space-x-2 mt-1">
                          <button
                              onClick={() => onEdit(item)}
                              disabled={isSaving || editingItem !== null}
                              className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit"
                          >
                              <FaEdit />
                          </button>
                          <button
                              onClick={() => onDelete(item.id)}
                              disabled={isSaving || editingItem !== null}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                          >
                              <FaTrash />
                          </button>
                      </div>
                  </li>
              ))}
          </ul>
      )}
    </section>
  );

  return (
    <>
      <Helmet><title>Calculator Settings | Admin</title></Helmet>

      {/* Header with Save Button */}
      <header className="bg-white shadow-sm mb-8 sticky top-0 z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
           <h1 className="text-2xl font-heading font-semibold text-accent-navy">Quote Calculator Settings</h1>
           {/* Use handleSaveAllSettings now */}
           <button onClick={handleSaveAllSettings} disabled={isSaving || !hasChanges} className={`px-4 py-2 rounded flex items-center ${ (isSaving || !hasChanges) ? 'bg-gray-300 cursor-not-allowed' : 'bg-accent-forest hover:bg-accent-forest-dark' } text-white transition`}>
             {isSaving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} {isSaving ? 'Saving...' : 'Save All Changes'}
           </button>
         </div>
      </header>
      {error && (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><strong className="font-bold">Error:</strong><span className="block sm:inline"> {error}</span></div></div>)}


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Calculation Settings Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
           <h2 className="text-xl font-semibold text-gray-800 mb-4">Core Calculation Settings</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Materials Cost Input */}
                <div>
                   <label htmlFor="materialsCostPercentage" className="block text-sm font-medium text-gray-700 mb-1">Materials Cost %</label>
                   <div className="flex items-center">
                       <input id="materialsCostPercentage" type="number" step="0.01" min="0" max="1" value={calcSettings.materialsCostPercentage} onChange={(e) => handleCalcSettingChange('materialsCostPercentage', parseFloat(e.target.value) || 0)} className="w-full border rounded-md p-2 disabled:bg-gray-100" disabled={isSaving} />
                       <span className="ml-2 text-gray-500">({Math.round(calcSettings.materialsCostPercentage * 100)}%)</span>
                   </div>
                </div>
                {/* Labor Cost Input */}
                <div>
                   <label htmlFor="laborCostPercentage" className="block text-sm font-medium text-gray-700 mb-1">Labor Cost %</label>
                    <div className="flex items-center">
                       <input id="laborCostPercentage" type="number" step="0.01" min="0" max="1" value={calcSettings.laborCostPercentage} onChange={(e) => handleCalcSettingChange('laborCostPercentage', parseFloat(e.target.value) || 0)} className="w-full border rounded-md p-2 disabled:bg-gray-100" disabled={isSaving} />
                       <span className="ml-2 text-gray-500">({Math.round(calcSettings.laborCostPercentage * 100)}%)</span>
                   </div>
                </div>
                {/* Minimum Size Input */}
                <div>
                   <label htmlFor="minimumProjectSize" className="block text-sm font-medium text-gray-700 mb-1">Min Project Size (sq ft)</label>
                   <input id="minimumProjectSize" type="number" step="1" min="0" value={calcSettings.minimumProjectSize} onChange={(e) => handleCalcSettingChange('minimumProjectSize', parseInt(e.target.value) || 0)} className="w-full border rounded-md p-2 disabled:bg-gray-100" disabled={isSaving} />
                </div>
           </div>
        </section>

        {/* Discount Thresholds Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-semibold text-gray-800">Volume Discounts</h2>
             <button
               onClick={handleAddThreshold}
               className={`px-3 py-1 text-sm rounded flex items-center ${editingThreshold !== null ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition`}
               disabled={isSaving || editingThreshold !== null}
             >
               <FaPlus className="mr-1" /> Add Threshold
             </button>
           </div>
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold (sq ft)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount %</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {/* Render Add/Edit Form */}
                 {editingThreshold && <ThresholdItemForm item={editingThreshold} onSave={handleSaveThreshold} onCancel={handleCancelThreshold} />}

                 {/* Render Existing Thresholds */}
                 {(calcSettings.discountThresholds || [])
                   .filter(threshold => !(editingThreshold?.isNew === false && editingThreshold?.squareFootage === threshold.squareFootage)) // Don't show item being edited in list
                   .map((threshold) => (
                   <tr key={threshold.squareFootage}>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{threshold.squareFootage.toLocaleString()} sq ft</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(threshold.discountPercentage * 100).toFixed(0)}%</td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                         <button
                           onClick={() => handleEditThreshold(threshold)}
                           className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                           disabled={isSaving || editingThreshold !== null}
                           title="Edit"
                         >
                           <FaEdit />
                         </button>
                         <button
                           onClick={() => handleDeleteThreshold(threshold.squareFootage)}
                           className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                           disabled={isSaving || editingThreshold !== null}
                           title="Delete"
                         >
                           <FaTrash />
                         </button>
                     </td>
                   </tr>
                 ))}
                 {calcSettings.discountThresholds.length === 0 && !editingThreshold && (
                     <tr>
                         <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No volume discounts configured yet.</td>
                     </tr>
                 )}
               </tbody>
             </table>
           </div>
         </section>

        {/* Service Options Section */}
        {renderListSection(
            "Service Options",
            serviceOptions,
            editingService,
            ServiceItemForm,
            handleAddService,
            handleEditService,
            handleDeleteService,
            handleSaveService,
            handleCancelService,
            (item) => <p className="text-sm text-gray-600">Price: ${item.basePrice.toFixed(2)} {item.description ? `- ${item.description.substring(0, 50)}...` : ''} {item.icon ? `(Icon: ${item.icon})` : ''}</p>
        )}

        {/* Complexity Options Section */}
         {renderListSection(
             "Complexity Levels",
             complexityOptions,
             editingComplexity,
             ComplexityItemForm,
             handleAddComplexity,
             handleEditComplexity,
             handleDeleteComplexity,
             handleSaveComplexity,
             handleCancelComplexity,
             (item) => <p className="text-sm text-gray-600">Multiplier: x{item.multiplier.toFixed(2)} {item.description ? `- ${item.description.substring(0, 50)}...` : ''}</p>
         )}

        {/* Feature Add-ons Section */}
         {renderListSection(
             "Feature Add-ons",
             addonOptions,
             editingAddon,
             AddonItemForm,
             handleAddAddon,
             handleEditAddon,
             handleDeleteAddon,
             handleSaveAddon,
             handleCancelAddon,
             (item) => <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)} ({item.unit === 'per_sqft' ? 'per sq ft' : 'flat rate'}) {item.description ? `- ${item.description.substring(0, 50)}...` : ''}</p>
         )}

        {/* Location Factors Section */}
         {renderListSection(
             "Location Factors",
             locationOptions,
             editingLocation,
             LocationItemForm,
             handleAddLocation,
             handleEditLocation,
             handleDeleteLocation,
             handleSaveLocation,
             handleCancelLocation,
             (item) => <p className="text-sm text-gray-600">Cost Multiplier: x{item.multiplier.toFixed(2)}</p>
         )}

      </div>
    </>
  );
};

export default CalculatorSettingsPage; 