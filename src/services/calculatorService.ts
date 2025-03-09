import axios from 'axios';
import defaultSettings from '../data/calculatorSettings.json';

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  icon: string;
}

export interface ComplexityOption {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

export interface AddonOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface LocationOption {
  id: string;
  name: string;
  region: string;
  travelFee: number;
}

export interface DiscountThreshold {
  squareFootage: number;
  discountPercentage: number;
}

export interface CalculationSettings {
  materialsCostPercentage: number;
  laborCostPercentage: number;
  minimumProjectSize: number;
  discountThresholds: DiscountThreshold[];
}

export interface CalculatorSettings {
  serviceOptions: ServiceOption[];
  complexityOptions: ComplexityOption[];
  addonOptions: AddonOption[];
  locationOptions: LocationOption[];
  calculationSettings: CalculationSettings;
}

// Mock API endpoints for a real implementation
// In a production environment, you would use actual API endpoints
const API_ENDPOINTS = {
  getSettings: '/api/calculator/settings',
  updateSettings: '/api/calculator/settings',
};

// In-memory storage for settings in development
let currentSettings: CalculatorSettings = { ...defaultSettings } as CalculatorSettings;

/**
 * Load calculator settings from API or fallback to local data
 */
export const loadCalculatorSettings = async (): Promise<CalculatorSettings> => {
  try {
    // In a production environment, this would be an API call
    // For now, we'll simulate a successful response using our local data
    // const response = await axios.get(API_ENDPOINTS.getSettings);
    // return response.data;
    
    // For development, just return the in-memory settings
    return currentSettings;
  } catch (error) {
    console.error('Error loading calculator settings:', error);
    // Fallback to default settings
    return { ...defaultSettings } as CalculatorSettings;
  }
};

/**
 * Save calculator settings to API or local storage
 */
export const saveCalculatorSettings = async (settings: CalculatorSettings): Promise<boolean> => {
  try {
    // In a production environment, this would be an API call
    // const response = await axios.post(API_ENDPOINTS.updateSettings, settings);
    // return response.status === 200;
    
    // For development, store in memory and simulate a successful save
    currentSettings = { ...settings };
    
    // Simulate saving to a file (this would be server-side in production)
    // In a real implementation, this would be done on the server
    console.log('Settings saved:', JSON.stringify(currentSettings, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error saving calculator settings:', error);
    return false;
  }
};

/**
 * Calculate quote based on inputs and current settings
 */
export const calculateQuote = (
  squareFootage: number,
  selectedServiceId: string,
  complexityId: string,
  selectedAddonIds: string[],
  locationId: string,
  settings: CalculatorSettings
) => {
  if (squareFootage <= 0 || !selectedServiceId) {
    return {
      totalCost: 0,
      materialsCost: 0,
      laborCost: 0,
      addonsCost: 0,
      travelCost: 0,
      discount: 0
    };
  }
  
  // Find selected service details
  const service = settings.serviceOptions.find(s => s.id === selectedServiceId);
  if (!service) {
    return {
      totalCost: 0,
      materialsCost: 0,
      laborCost: 0,
      addonsCost: 0,
      travelCost: 0,
      discount: 0
    };
  }
  
  // Find complexity multiplier
  const complexityOption = settings.complexityOptions.find(c => c.id === complexityId);
  const multiplier = complexityOption ? complexityOption.multiplier : 1;
  
  // Calculate base materials cost
  const { materialsCostPercentage, laborCostPercentage } = settings.calculationSettings;
  const baseMaterialsCost = squareFootage * (service.basePrice * materialsCostPercentage);
  const materialsCost = parseFloat(baseMaterialsCost.toFixed(2));
  
  // Calculate labor cost
  const baseLabor = squareFootage * (service.basePrice * laborCostPercentage);
  const laborWithComplexity = baseLabor * multiplier;
  const laborCost = parseFloat(laborWithComplexity.toFixed(2));
  
  // Calculate addons cost
  let addonsCost = 0;
  selectedAddonIds.forEach(addonId => {
    const addon = settings.addonOptions.find(a => a.id === addonId);
    if (addon) {
      // Some addons might be flat fees, others per square foot
      if (addon.id === 'same-day') {
        // Flat fee addon
        addonsCost += addon.price;
      } else {
        // Per square foot addon
        addonsCost += squareFootage * addon.price;
      }
    }
  });
  addonsCost = parseFloat(addonsCost.toFixed(2));
  
  // Calculate travel fee based on location
  const location = settings.locationOptions.find(l => l.id === locationId);
  const travelCost = location ? location.travelFee : 0;
  
  // Apply volume discount if applicable
  let discount = 0;
  const { discountThresholds } = settings.calculationSettings;
  for (let i = discountThresholds.length - 1; i >= 0; i--) {
    if (squareFootage >= discountThresholds[i].squareFootage) {
      const subtotal = materialsCost + laborCost + addonsCost;
      discount = parseFloat((subtotal * discountThresholds[i].discountPercentage).toFixed(2));
      break;
    }
  }
  
  // Calculate total
  const totalCost = parseFloat((materialsCost + laborCost + addonsCost + travelCost - discount).toFixed(2));
  
  return {
    totalCost,
    materialsCost,
    laborCost,
    addonsCost,
    travelCost,
    discount
  };
};

export default {
  loadCalculatorSettings,
  saveCalculatorSettings,
  calculateQuote
}; 