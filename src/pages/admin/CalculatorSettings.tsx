import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import calculatorService, { 
  CalculatorSettings, 
  ServiceOption, 
  ComplexityOption, 
  AddonOption, 
  LocationOption, 
  DiscountThreshold,
  CalculationSettings
} from '../../services/calculatorService';
import ServiceEditModal from '../../components/admin/ServiceEditModal';
import ComplexityEditModal from '../../components/admin/ComplexityEditModal';

const CalculatorSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState<CalculatorSettings | null>(null);
  
  // Editing states for different sections
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingComplexityId, setEditingComplexityId] = useState<string | null>(null);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [editingThresholdIndex, setEditingThresholdIndex] = useState<number | null>(null);
  
  // Selected items for editing
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [selectedComplexity, setSelectedComplexity] = useState<ComplexityOption | null>(null);
  
  // Modal visibility states
  const [serviceModalOpen, setServiceModalOpen] = useState<boolean>(false);
  const [complexityModalOpen, setComplexityModalOpen] = useState<boolean>(false);
  
  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await calculatorService.loadCalculatorSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load calculator settings:', err);
        setError('Failed to load calculator settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Save all settings
  const handleSaveSettings = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      const success = await calculatorService.saveCalculatorSettings(settings);
      
      if (success) {
        setSuccess(true);
        setError(null);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to save settings. Please try again.');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Update services
  const handleUpdateService = (updatedService: ServiceOption, isNew: boolean = false) => {
    if (!settings) return;
    
    let newServices;
    if (isNew) {
      newServices = [...settings.serviceOptions, updatedService];
    } else {
      newServices = settings.serviceOptions.map(service => 
        service.id === updatedService.id ? updatedService : service
      );
    }
    
    setSettings({
      ...settings,
      serviceOptions: newServices
    });
    setServiceModalOpen(false);
  };
  
  const handleDeleteService = (serviceId: string) => {
    if (!settings) return;
    if (!window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) return;
    
    setSettings({
      ...settings,
      serviceOptions: settings.serviceOptions.filter(service => service.id !== serviceId)
    });
  };
  
  // Update complexity options
  const handleUpdateComplexity = (updatedComplexity: ComplexityOption, isNew: boolean = false) => {
    if (!settings) return;
    
    let newComplexities;
    if (isNew) {
      newComplexities = [...settings.complexityOptions, updatedComplexity];
    } else {
      newComplexities = settings.complexityOptions.map(complexity => 
        complexity.id === updatedComplexity.id ? updatedComplexity : complexity
      );
    }
    
    setSettings({
      ...settings,
      complexityOptions: newComplexities
    });
    setComplexityModalOpen(false);
  };
  
  const handleDeleteComplexity = (complexityId: string) => {
    if (!settings) return;
    if (!window.confirm("Are you sure you want to delete this complexity option? This action cannot be undone.")) return;
    
    setSettings({
      ...settings,
      complexityOptions: settings.complexityOptions.filter(complexity => complexity.id !== complexityId)
    });
  };
  
  // Update addon options
  const handleUpdateAddon = (updatedAddon: AddonOption, isNew: boolean = false) => {
    if (!settings) return;
    
    let newAddons;
    if (isNew) {
      newAddons = [...settings.addonOptions, updatedAddon];
    } else {
      newAddons = settings.addonOptions.map(addon => 
        addon.id === updatedAddon.id ? updatedAddon : addon
      );
    }
    
    setSettings({
      ...settings,
      addonOptions: newAddons
    });
    setEditingAddonId(null);
  };
  
  const handleDeleteAddon = (addonId: string) => {
    if (!settings) return;
    if (!window.confirm("Are you sure you want to delete this addon? This action cannot be undone.")) return;
    
    setSettings({
      ...settings,
      addonOptions: settings.addonOptions.filter(addon => addon.id !== addonId)
    });
  };
  
  // Update location options
  const handleUpdateLocation = (updatedLocation: LocationOption, isNew: boolean = false) => {
    if (!settings) return;
    
    let newLocations;
    if (isNew) {
      newLocations = [...settings.locationOptions, updatedLocation];
    } else {
      newLocations = settings.locationOptions.map(location => 
        location.id === updatedLocation.id ? updatedLocation : location
      );
    }
    
    setSettings({
      ...settings,
      locationOptions: newLocations
    });
    setEditingLocationId(null);
  };
  
  const handleDeleteLocation = (locationId: string) => {
    if (!settings) return;
    if (!window.confirm("Are you sure you want to delete this location? This action cannot be undone.")) return;
    
    setSettings({
      ...settings,
      locationOptions: settings.locationOptions.filter(location => location.id !== locationId)
    });
  };
  
  // Update discount thresholds
  const handleUpdateThreshold = (updatedThreshold: DiscountThreshold, index: number, isNew: boolean = false) => {
    if (!settings) return;
    
    let newThresholds;
    if (isNew) {
      newThresholds = [...settings.calculationSettings.discountThresholds, updatedThreshold];
    } else {
      newThresholds = settings.calculationSettings.discountThresholds.map((threshold, i) => 
        i === index ? updatedThreshold : threshold
      );
    }
    
    // Sort thresholds by square footage ascending
    newThresholds.sort((a, b) => a.squareFootage - b.squareFootage);
    
    setSettings({
      ...settings,
      calculationSettings: {
        ...settings.calculationSettings,
        discountThresholds: newThresholds
      }
    });
    setEditingThresholdIndex(null);
  };
  
  const handleDeleteThreshold = (index: number) => {
    if (!settings) return;
    if (!window.confirm("Are you sure you want to delete this discount threshold? This action cannot be undone.")) return;
    
    const newThresholds = settings.calculationSettings.discountThresholds.filter((_, i) => i !== index);
    
    setSettings({
      ...settings,
      calculationSettings: {
        ...settings.calculationSettings,
        discountThresholds: newThresholds
      }
    });
  };
  
  // Update calculation settings
  const handleUpdateCalculationSettings = (field: keyof CalculationSettings, value: number) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      calculationSettings: {
        ...settings.calculationSettings,
        [field]: value
      }
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-forest"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl text-red-600 mb-2">Error Loading Settings</h2>
          <p className="text-gray-700">Unable to load calculator settings. Please try again later.</p>
          <button 
            onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-accent-navy text-white rounded hover:bg-accent-navy-dark"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-calculator-settings bg-gray-50 min-h-screen pb-16">
      <Helmet>
        <title>Calculator Settings | Admin | Seamless Edge</title>
      </Helmet>
      
      {/* Admin Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-semibold text-accent-navy">Quote Calculator Settings</h1>
          
          <div className="flex items-center">
            <Link 
              to="/admin" 
              className="text-accent-forest hover:text-accent-navy transition-colors mr-4"
            >
              Back to Dashboard
            </Link>
            <button 
              onClick={handleSaveSettings} 
              disabled={saving}
              className={`px-4 py-2 rounded ${saving ? 'bg-gray-400' : 'bg-accent-forest hover:bg-accent-forest-dark'} text-white transition`}
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Status Messages */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <p className="text-green-700">Settings successfully saved!</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* General Calculation Settings */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Calculation Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials Cost Percentage
              </label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  max="1"
                  value={settings.calculationSettings.materialsCostPercentage}
                  onChange={(e) => handleUpdateCalculationSettings('materialsCostPercentage', parseFloat(e.target.value))}
                  className="shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <span className="ml-2 text-gray-500">
                  ({Math.round(settings.calculationSettings.materialsCostPercentage * 100)}%)
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Portion of base price allocated to materials (0-1)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Labor Cost Percentage
              </label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  max="1"
                  value={settings.calculationSettings.laborCostPercentage}
                  onChange={(e) => handleUpdateCalculationSettings('laborCostPercentage', parseFloat(e.target.value))}
                  className="shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <span className="ml-2 text-gray-500">
                  ({Math.round(settings.calculationSettings.laborCostPercentage * 100)}%)
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Portion of base price allocated to labor (0-1)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Project Size (sq ft)
              </label>
              <input 
                type="number" 
                step="1"
                min="0"
                value={settings.calculationSettings.minimumProjectSize}
                onChange={(e) => handleUpdateCalculationSettings('minimumProjectSize', parseInt(e.target.value))}
                className="shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum square footage required for a project
              </p>
            </div>
          </div>
        </section>
        
        {/* Discount Thresholds */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Volume Discount Thresholds</h2>
            <button 
              onClick={() => {
                setEditingThresholdIndex(-1); // Use -1 to indicate new threshold
              }}
              className="px-3 py-1 bg-accent-forest text-white rounded text-sm hover:bg-accent-forest-dark"
            >
              Add Threshold
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threshold (sq ft)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount %
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {settings.calculationSettings.discountThresholds.map((threshold, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingThresholdIndex === index ? (
                        <input 
                          type="number" 
                          value={threshold.squareFootage}
                          onChange={(e) => {
                            const newThresholds = [...settings.calculationSettings.discountThresholds];
                            newThresholds[index] = {
                              ...newThresholds[index],
                              squareFootage: parseInt(e.target.value)
                            };
                            setSettings({
                              ...settings,
                              calculationSettings: {
                                ...settings.calculationSettings,
                                discountThresholds: newThresholds
                              }
                            });
                          }}
                          className="shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <span>{threshold.squareFootage.toLocaleString()} sq ft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingThresholdIndex === index ? (
                        <div className="flex items-center">
                          <input 
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={threshold.discountPercentage}
                            onChange={(e) => {
                              const newThresholds = [...settings.calculationSettings.discountThresholds];
                              newThresholds[index] = {
                                ...newThresholds[index],
                                discountPercentage: parseFloat(e.target.value)
                              };
                              setSettings({
                                ...settings,
                                calculationSettings: {
                                  ...settings.calculationSettings,
                                  discountThresholds: newThresholds
                                }
                              });
                            }}
                            className="shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <span className="ml-2">
                            ({Math.round(threshold.discountPercentage * 100)}%)
                          </span>
                        </div>
                      ) : (
                        <span>{(threshold.discountPercentage * 100).toFixed(0)}%</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingThresholdIndex === index ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              handleUpdateThreshold(
                                settings.calculationSettings.discountThresholds[index],
                                index,
                                false
                              );
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingThresholdIndex(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setEditingThresholdIndex(index)}
                            className="text-accent-navy hover:text-accent-navy-dark"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteThreshold(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* New threshold row */}
                {editingThresholdIndex === -1 && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input 
                        type="number" 
                        placeholder="Square Footage"
                        className="shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => {
                          const newThreshold = {
                            squareFootage: parseInt(e.target.value) || 0,
                            discountPercentage: 0
                          };
                          handleUpdateThreshold(newThreshold, -1, true);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <input 
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          placeholder="Discount (0-1)"
                          className="shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md"
                          onChange={(e) => {
                            const newThreshold = {
                              squareFootage: 0,
                              discountPercentage: parseFloat(e.target.value) || 0
                            };
                            handleUpdateThreshold(newThreshold, -1, true);
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingThresholdIndex(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Service Options */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Service Options</h2>
            <button 
              onClick={() => {
                setSelectedService(null);
                setServiceModalOpen(true);
              }}
              className="px-3 py-1 bg-accent-forest text-white rounded text-sm hover:bg-accent-forest-dark"
            >
              Add Service
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.serviceOptions.map(service => (
              <div 
                key={service.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{service.icon}</span>
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedService(service);
                        setServiceModalOpen(true);
                      }}
                      className="text-xs text-accent-navy hover:text-accent-navy-dark"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Base Price: <span className="font-semibold">${service.basePrice.toFixed(2)}</span>/sq ft</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Complexity Options */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Complexity Levels</h2>
            <button 
              onClick={() => {
                setSelectedComplexity(null);
                setComplexityModalOpen(true);
              }}
              className="px-3 py-1 bg-accent-forest text-white rounded text-sm hover:bg-accent-forest-dark"
            >
              Add Complexity Level
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.complexityOptions.map(complexity => (
              <div 
                key={complexity.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">{complexity.name}</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedComplexity(complexity);
                        setComplexityModalOpen(true);
                      }}
                      className="text-xs text-accent-navy hover:text-accent-navy-dark"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteComplexity(complexity.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{complexity.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Multiplier: <span className="font-semibold">{complexity.multiplier.toFixed(2)}x</span></span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Add-ons */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Add-on Options</h2>
            <button 
              onClick={() => {
                setEditingAddonId('new');
              }}
              className="px-3 py-1 bg-accent-forest text-white rounded text-sm hover:bg-accent-forest-dark"
            >
              Add Option
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.addonOptions.map(addon => (
              <div 
                key={addon.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">{addon.name}</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingAddonId(addon.id)}
                      className="text-xs text-accent-navy hover:text-accent-navy-dark"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteAddon(addon.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{addon.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Price: <span className="font-semibold">
                      {addon.id === 'same-day' ? `$${addon.price.toFixed(2)} (flat)` : `$${addon.price.toFixed(2)}/sq ft`}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Locations */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Service Locations</h2>
            <button 
              onClick={() => {
                setEditingLocationId('new');
              }}
              className="px-3 py-1 bg-accent-forest text-white rounded text-sm hover:bg-accent-forest-dark"
            >
              Add Location
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Travel Fee
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {settings.locationOptions.map((location) => (
                  <tr key={location.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {location.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${location.travelFee.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setEditingLocationId(location.id)}
                          className="text-accent-navy hover:text-accent-navy-dark"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Bottom Save Button */}
        <div className="flex justify-end mt-8">
          <button 
            onClick={handleSaveSettings} 
            disabled={saving}
            className={`px-6 py-3 rounded-md ${saving ? 'bg-gray-400' : 'bg-accent-forest hover:bg-accent-forest-dark'} text-white transition`}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Modals for editing items */}
      <ServiceEditModal 
        service={selectedService}
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        onSave={handleUpdateService}
      />
      
      <ComplexityEditModal
        complexity={selectedComplexity}
        isOpen={complexityModalOpen}
        onClose={() => setComplexityModalOpen(false)}
        onSave={handleUpdateComplexity}
      />
    </div>
  );
};

export default CalculatorSettingsPage; 