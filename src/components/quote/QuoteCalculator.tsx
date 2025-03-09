import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  icon: string;
}

interface ComplexityOption {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

interface AddonOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface LocationOption {
  id: string;
  name: string;
  region: string;
  travelFee: number;
}

const QuoteCalculator: React.FC = () => {
  // Form state
  const [squareFootage, setSquareFootage] = useState<number>(0);
  const [selectedService, setSelectedService] = useState<string>('');
  const [complexity, setComplexity] = useState<string>('moderate');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('calgary');
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  
  // Quote result
  const [totalCost, setTotalCost] = useState<number>(0);
  const [materialsCost, setMaterialsCost] = useState<number>(0);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [addonsCost, setAddonsCost] = useState<number>(0);
  const [travelCost, setTravelCost] = useState<number>(0);
  
  // Wizard step state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;
  
  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Available options
  const serviceOptions: ServiceOption[] = [
    { 
      id: 'boarding', 
      name: 'Boarding & Installation', 
      description: 'Complete drywall installation with high-quality materials',
      basePrice: 2.5,
      icon: '📋'
    },
    { 
      id: 'taping', 
      name: 'Taping & Mudding', 
      description: 'Professional taping and mudding for seamless walls',
      basePrice: 1.75,
      icon: '🔧'
    },
    { 
      id: 'sanding', 
      name: 'Sanding & Finishing', 
      description: 'Fine finishing and detailed sanding work',
      basePrice: 1.25,
      icon: '✨'
    },
    { 
      id: 'repair', 
      name: 'Repairs & Patches', 
      description: 'Targeted repairs for damaged areas',
      basePrice: 3.5,
      icon: '🔨'
    },
    { 
      id: 'texture', 
      name: 'Custom Textures', 
      description: 'Specialty texture application',
      basePrice: 2.95,
      icon: '🎨'
    },
  ];
  
  const complexityOptions: ComplexityOption[] = [
    { 
      id: 'simple', 
      name: 'Simple', 
      description: 'Standard room, minimal angles/corners',
      multiplier: 0.85
    },
    { 
      id: 'moderate', 
      name: 'Moderate', 
      description: 'Average complexity with some detail work',
      multiplier: 1.0
    },
    { 
      id: 'complex', 
      name: 'Complex', 
      description: 'High ceilings, many corners, detailed work',
      multiplier: 1.35
    },
  ];
  
  const addonOptions: AddonOption[] = [
    { 
      id: 'premium-materials', 
      name: 'Premium Materials', 
      description: 'Higher grade drywall and finishing materials',
      price: 0.75
    },
    { 
      id: 'same-day', 
      name: 'Expedited Service', 
      description: 'Prioritized scheduling and faster completion',
      price: 250
    },
    { 
      id: 'soundproofing', 
      name: 'Soundproofing', 
      description: 'Additional soundproofing materials and techniques',
      price: 2.50
    },
  ];

  const locationOptions: LocationOption[] = [
    {
      id: 'calgary',
      name: 'Calgary',
      region: 'Calgary Region',
      travelFee: 0
    },
    {
      id: 'airdrie',
      name: 'Airdrie',
      region: 'Calgary Region',
      travelFee: 0
    },
    {
      id: 'cochrane',
      name: 'Cochrane',
      region: 'Calgary Region',
      travelFee: 50
    },
    {
      id: 'chestermere',
      name: 'Chestermere',
      region: 'Calgary Region',
      travelFee: 50
    },
    {
      id: 'okotoks',
      name: 'Okotoks',
      region: 'Calgary Region',
      travelFee: 75
    },
    {
      id: 'red-deer',
      name: 'Red Deer',
      region: 'Central Alberta',
      travelFee: 150
    },
    {
      id: 'lethbridge',
      name: 'Lethbridge',
      region: 'Southern Alberta',
      travelFee: 225
    },
    {
      id: 'medicine-hat',
      name: 'Medicine Hat',
      region: 'Southern Alberta',
      travelFee: 300
    },
    {
      id: 'edmonton',
      name: 'Edmonton',
      region: 'Northern Alberta',
      travelFee: 300
    },
    {
      id: 'fort-mcmurray',
      name: 'Fort McMurray',
      region: 'Northern Alberta',
      travelFee: 450
    },
    {
      id: 'grande-prairie',
      name: 'Grande Prairie',
      region: 'Northern Alberta',
      travelFee: 400
    },
    {
      id: 'banff',
      name: 'Banff',
      region: 'Mountain Region',
      travelFee: 125
    },
    {
      id: 'canmore',
      name: 'Canmore',
      region: 'Mountain Region',
      travelFee: 100
    },
    {
      id: 'other',
      name: 'Other Location',
      region: 'Custom',
      travelFee: 0
    }
  ];

  // Calculate quote when inputs change
  useEffect(() => {
    if (squareFootage <= 0 || !selectedService) {
      resetQuote();
      return;
    }
    
    // Find selected service details
    const service = serviceOptions.find(s => s.id === selectedService);
    if (!service) {
      resetQuote();
      return;
    }
    
    // Find complexity multiplier
    const complexityOption = complexityOptions.find(c => c.id === complexity);
    const multiplier = complexityOption ? complexityOption.multiplier : 1;
    
    // Calculate base materials cost
    const baseMaterialsCost = squareFootage * (service.basePrice * 0.4); // 40% of base price for materials
    setMaterialsCost(parseFloat(baseMaterialsCost.toFixed(2)));
    
    // Calculate labor cost
    const baseLabor = squareFootage * (service.basePrice * 0.6); // 60% of base price for labor
    const laborWithComplexity = baseLabor * multiplier;
    setLaborCost(parseFloat(laborWithComplexity.toFixed(2)));
    
    // Calculate addons cost
    let addonsTotal = 0;
    selectedAddons.forEach(addonId => {
      const addon = addonOptions.find(a => a.id === addonId);
      if (addon) {
        if (addonId === 'same-day') {
          // Flat fee addon
          addonsTotal += addon.price;
        } else {
          // Per square foot addon
          addonsTotal += squareFootage * addon.price;
        }
      }
    });
    setAddonsCost(parseFloat(addonsTotal.toFixed(2)));
    
    // Calculate travel fee based on location
    const location = locationOptions.find(l => l.id === selectedLocation);
    const travelFee = location ? location.travelFee : 0;
    setTravelCost(travelFee);
    
    // Calculate total including travel fee
    const total = baseMaterialsCost + laborWithComplexity + addonsTotal + travelFee;
    setTotalCost(parseFloat(total.toFixed(2)));
    
  }, [squareFootage, selectedService, complexity, selectedAddons, selectedLocation]);

  const resetQuote = () => {
    setTotalCost(0);
    setMaterialsCost(0);
    setLaborCost(0);
    setAddonsCost(0);
    setTravelCost(0);
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Group locations by region
  const groupedLocations = locationOptions.reduce((acc, location) => {
    const { region } = location;
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(location);
    return acc;
  }, {} as Record<string, LocationOption[]>);

  // Function to validate the current step
  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    switch(step) {
      case 1:
        if (!squareFootage || squareFootage <= 0) {
          newErrors.squareFootage = 'Please enter a valid square footage';
        }
        break;
      case 2:
        if (!selectedService) {
          newErrors.service = 'Please select a service type';
        }
        break;
      // Other steps don't have required fields
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle next step
  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Function to handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Function to go to a specific step
  const goToStep = (step: number) => {
    // Only allow going to a step if all previous steps are validated
    let canProceed = true;
    
    for (let i = 1; i < step; i++) {
      if (!validateStep(i)) {
        canProceed = false;
        setCurrentStep(i);
        break;
      }
    }
    
    if (canProceed && step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Animation variants for step transitions
  const variants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <div className="quote-calculator">
      <div className="quote-calculator-header">
        <h2>Instant Drywall Quote Calculator</h2>
        <p>Get an accurate estimate for your drywall project in just a few simple steps.</p>
      </div>
      
      <div className="quote-calculator-body">
        {/* Progress indicator */}
        <div className="quote-progress">
          {[...Array(totalSteps)].map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            
            return (
              <div 
                key={stepNumber}
                className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => goToStep(stepNumber)}
              >
                <div className="step-indicator">
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="step-label">
                  {stepNumber === 1 && "Project Info"}
                  {stepNumber === 2 && "Service Type"}
                  {stepNumber === 3 && "Add-ons"}
                  {stepNumber === 4 && "Your Quote"}
                </div>
              </div>
            );
          })}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Step 1: Project Information */}
            {currentStep === 1 && (
              <div className="quote-section">
                <h3 className="quote-section-title">
                  <div className="section-icon">📏</div>
                  Project Information
                </h3>
                
                {/* Square Footage Input */}
                <div className="quote-form-group">
                  <label htmlFor="square-footage">
                    Project Size (Square Footage)
                    <span className="help-tooltip">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <div className="tooltip-content">
                        Enter the total square footage of drywall needed for your project. This is typically the total wall and ceiling area.
                      </div>
                    </span>
                  </label>
                  <input
                    type="number"
                    id="square-footage"
                    min="0"
                    value={squareFootage || ''}
                    onChange={e => setSquareFootage(parseInt(e.target.value) || 0)}
                    className={`quote-form-input ${errors.squareFootage ? 'border-red-500' : ''}`}
                    placeholder="Enter square footage"
                  />
                  {errors.squareFootage && (
                    <p className="text-red-500 text-sm mt-1">{errors.squareFootage}</p>
                  )}
                </div>
                
                {/* Location Selection */}
                <div className="quote-form-group">
                  <label htmlFor="location">
                    Project Location
                  </label>
                  <select
                    id="location"
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="quote-form-input"
                  >
                    {Object.entries(groupedLocations).map(([region, locations]) => (
                      <optgroup key={region} label={region}>
                        {locations.map(location => (
                          <option key={location.id} value={location.id}>
                            {location.name} {location.travelFee > 0 ? `(+${formatCurrency(location.travelFee)} travel fee)` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {selectedLocation === 'other' && (
                    <p className="mt-2 text-sm text-gray-600">
                      For custom locations, please call us at (403) 555-7890 for an accurate quote.
                    </p>
                  )}
                </div>
                
                {/* Complexity Selection */}
                <div className="quote-form-group">
                  <label>
                    Project Complexity
                    <span className="help-tooltip">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <div className="tooltip-content">
                        Select the complexity level that best matches your project. This affects the overall cost based on the amount of detail work required.
                      </div>
                    </span>
                  </label>
                  <div className="quote-complexity-options">
                    {complexityOptions.map(option => (
                      <div
                        key={option.id}
                        className={`complexity-option ${complexity === option.id ? 'selected' : ''}`}
                        onClick={() => setComplexity(option.id)}
                      >
                        <h4>{option.name}</h4>
                        <p>{option.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Service Selection */}
            {currentStep === 2 && (
              <div className="quote-section">
                <h3 className="quote-section-title">
                  <div className="section-icon">🛠️</div>
                  Service Type
                  <span className="help-tooltip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div className="tooltip-content">
                      Choose the primary service you need for your project. Each service has a different base price per square foot.
                    </div>
                  </span>
                </h3>
                <div className="service-cards">
                  {serviceOptions.map(service => (
                    <div
                      key={service.id}
                      className={`service-card ${selectedService === service.id ? 'selected' : ''} ${errors.service && !selectedService ? 'border-red-500' : ''}`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="service-card-header">
                        <div className="service-card-icon">{service.icon}</div>
                        <h3 className="service-card-title">{service.name}</h3>
                      </div>
                      <p className="service-card-description">{service.description}</p>
                      <p className="service-card-price">{`${formatCurrency(service.basePrice)} per sq ft`}</p>
                    </div>
                  ))}
                </div>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-3">{errors.service}</p>
                )}
              </div>
            )}

            {/* Step 3: Add-on Services */}
            {currentStep === 3 && (
              <div className="quote-section">
                <h3 className="quote-section-title">
                  <div className="section-icon">✨</div>
                  Add-on Services (Optional)
                  <span className="help-tooltip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div className="tooltip-content">
                      Select any additional services you'd like to include in your project. These are optional enhancements.
                    </div>
                  </span>
                </h3>
                <div className="service-cards">
                  {addonOptions.map(addon => (
                    <div
                      key={addon.id}
                      className={`addon-card ${selectedAddons.includes(addon.id) ? 'selected' : ''}`}
                      onClick={() => toggleAddon(addon.id)}
                    >
                      <div className="addon-checkbox">
                        {selectedAddons.includes(addon.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="addon-content">
                        <h3 className="addon-title">{addon.name}</h3>
                        <p className="addon-description">{addon.description}</p>
                        <p className="addon-price">
                          {addon.id === 'same-day' 
                            ? `${formatCurrency(addon.price)} flat fee`
                            : `${formatCurrency(addon.price)} per sq ft`
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="additional-options">
                  <h4 className="quote-section-subtitle">Special Requirements</h4>
                  <textarea 
                    className="quote-form-input" 
                    placeholder="Enter any special requirements or notes for your project (optional)"
                    rows={3}
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}
            
            {/* Step 4: Quote Result */}
            {currentStep === 4 && (
              <div className="quote-result-section">
                <h3>Your Project Quote</h3>
                
                {totalCost > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-4">Quote Summary</h4>
                        <div className="quote-summary">
                          <div className="quote-summary-row">
                            <span className="quote-summary-label">Materials:</span>
                            <span className="quote-summary-value">{formatCurrency(materialsCost)}</span>
                          </div>
                          <div className="quote-summary-row">
                            <span className="quote-summary-label">Labor:</span>
                            <span className="quote-summary-value">{formatCurrency(laborCost)}</span>
                          </div>
                          {addonsCost > 0 && (
                            <div className="quote-summary-row">
                              <span className="quote-summary-label">Add-ons:</span>
                              <span className="quote-summary-value">{formatCurrency(addonsCost)}</span>
                            </div>
                          )}
                          {travelCost > 0 && (
                            <div className="quote-summary-row">
                              <span className="quote-summary-label">Travel Fee:</span>
                              <span className="quote-summary-value">{formatCurrency(travelCost)}</span>
                            </div>
                          )}
                          <div className="quote-total-row">
                            <span className="quote-total-label">Total Estimate:</span>
                            <span className="quote-total-value">{formatCurrency(totalCost)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-4">Project Details</h4>
                        <div className="quote-details">
                          <div className="quote-details-row">
                            <span className="quote-details-label">Square Footage:</span>
                            <span className="quote-details-value">{squareFootage} sq ft</span>
                          </div>
                          <div className="quote-details-row">
                            <span className="quote-details-label">Service Type:</span>
                            <span className="quote-details-value">{serviceOptions.find(s => s.id === selectedService)?.name}</span>
                          </div>
                          <div className="quote-details-row">
                            <span className="quote-details-label">Complexity:</span>
                            <span className="quote-details-value">{complexityOptions.find(c => c.id === complexity)?.name}</span>
                          </div>
                          <div className="quote-details-row">
                            <span className="quote-details-label">Location:</span>
                            <span className="quote-details-value">{locationOptions.find(l => l.id === selectedLocation)?.name}</span>
                          </div>
                          {selectedAddons.length > 0 && (
                            <div className="quote-details-row">
                              <span className="quote-details-label">Add-ons:</span>
                              <span className="quote-details-value">
                                {selectedAddons.map(addonId => 
                                  addonOptions.find(a => a.id === addonId)?.name
                                ).join(', ')}
                              </span>
                            </div>
                          )}
                          {specialRequirements && (
                            <div className="quote-details-row">
                              <span className="quote-details-label">Special Requirements:</span>
                              <span className="quote-details-value">{specialRequirements}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="quote-actions">
                      <button 
                        className="quote-btn quote-btn-primary"
                        onClick={() => window.location.href = '/contact'}
                      >
                        Schedule a Consultation
                      </button>
                      <button 
                        className="quote-btn quote-btn-secondary"
                        onClick={resetQuote}
                      >
                        Reset Calculator
                      </button>
                    </div>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                      This is an estimate based on the information provided. For a precise quote, we recommend scheduling an on-site consultation.
                      {travelCost > 0 && " Travel fees may vary based on current fuel prices and project specifics."}
                    </p>
                  </>
                ) : (
                  <p className="text-center text-gray-600">
                    Fill out the form to receive your instant quote. We'll calculate materials, labor, and any additional costs based on your project requirements.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <div className="quote-navigation">
          {currentStep > 1 && (
            <button 
              className="quote-btn quote-btn-secondary"
              onClick={handlePrevious}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Previous
            </button>
          )}
          
          {currentStep < totalSteps && (
            <button 
              className="quote-btn quote-btn-primary"
              onClick={handleNext}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator; 