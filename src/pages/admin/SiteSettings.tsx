import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  FaCog, 
  FaSave, 
  FaGlobe, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaPinterest,
  FaYoutube,
  FaCloudUploadAlt,
  FaWindows
} from 'react-icons/fa';

interface SiteSettings {
  companyName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl: string;
  faviconUrl: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    pinterest: string;
    youtube: string;
  };
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  googleMapsApiKey: string;
  googleAnalyticsId: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
}

const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    companyName: 'Seamless Edge',
    tagline: 'Premium Home Remodeling & Renovation',
    description: 'Seamless Edge is a premium home remodeling and renovation company serving the Seattle area. We specialize in kitchen remodels, bathroom renovations, and complete home makeovers.',
    contactEmail: 'info@seamlessedge.com',
    contactPhone: '(206) 555-1234',
    address: '123 Main Street, Seattle, WA 98101',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    socialMedia: {
      facebook: 'https://facebook.com/seamlessedge',
      twitter: 'https://twitter.com/seamlessedge',
      instagram: 'https://instagram.com/seamlessedge',
      linkedin: 'https://linkedin.com/company/seamlessedge',
      pinterest: 'https://pinterest.com/seamlessedge',
      youtube: 'https://youtube.com/c/seamlessedge'
    },
    businessHours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: '10:00 AM - 3:00 PM',
      sunday: 'Closed'
    },
    googleMapsApiKey: '',
    googleAnalyticsId: 'UA-XXXXXXXXX-X',
    theme: {
      primaryColor: '#3D5734',
      secondaryColor: '#1B365D'
    },
    seo: {
      metaTitle: 'Seamless Edge | Premium Home Remodeling & Renovation',
      metaDescription: 'Seattle\'s top-rated home remodeling and renovation company. Specializing in kitchen, bathroom, and complete home transformations.',
      ogImage: '/og-image.jpg'
    }
  });
  
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    const storedSettings = localStorage.getItem('seamlessedge_site_settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      // Store initial settings in localStorage for development
      localStorage.setItem('seamlessedge_site_settings', JSON.stringify(settings));
    }
    
    setLoading(false);
  }, []);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    section?: keyof SiteSettings, 
    subfield?: string
  ) => {
    const { name, value } = e.target;
    
    if (section && subfield) {
      // For nested objects like socialMedia.facebook
      setSettings(prev => {
        const prevSection = prev[section] as Record<string, any>;
        return {
          ...prev,
          [section]: {
            ...prevSection,
            [subfield]: value
          }
        };
      });
    } else if (section) {
      // For objects like theme.primaryColor
      setSettings(prev => {
        const prevSection = prev[section] as Record<string, any>;
        return {
          ...prev,
          [section]: {
            ...prevSection,
            [name]: value
          }
        };
      });
    } else {
      // For top-level fields like companyName
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setHasChanges(true);
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // In a real implementation, this would save to Supabase
    // For now, just store in localStorage and simulate a delay
    setTimeout(() => {
      localStorage.setItem('seamlessedge_site_settings', JSON.stringify(settings));
      setIsSaving(false);
      setHasChanges(false);
      alert('Settings saved successfully!');
    }, 800);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-forest"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Site Settings | Seamless Edge Admin</title>
      </Helmet>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Site Settings</h1>
          <p className="text-gray-600">Configure your website's settings and appearance.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className={`mt-4 md:mt-0 px-4 py-2 rounded-lg flex items-center ${
            isSaving || !hasChanges 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-accent-forest text-white hover:bg-accent-forest-dark'
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2" /> Save Changes
            </>
          )}
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'general' 
                  ? 'border-b-2 border-accent-forest text-accent-forest' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'contact' 
                  ? 'border-b-2 border-accent-forest text-accent-forest' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Info
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'social' 
                  ? 'border-b-2 border-accent-forest text-accent-forest' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('social')}
            >
              Social Media
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'hours' 
                  ? 'border-b-2 border-accent-forest text-accent-forest' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('hours')}
            >
              Business Hours
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'appearance' 
                  ? 'border-b-2 border-accent-forest text-accent-forest' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'seo' 
                  ? 'border-b-2 border-accent-forest text-accent-forest' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('seo')}
            >
              SEO
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'integrations' 
                  ? 'border-b-2 border-accent-forest text-accent-forest' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('integrations')}
            >
              Integrations
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.tagline}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Company Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Logo URL</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="logoUrl"
                      className="flex-1 border border-gray-300 rounded-l-lg p-2"
                      value={settings.logoUrl}
                      onChange={handleInputChange}
                    />
                    <button className="bg-gray-100 text-gray-700 px-4 rounded-r-lg border border-l-0 border-gray-300 hover:bg-gray-200">
                      <FaCloudUploadAlt />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    In a production system, this would be a file upload component.
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Favicon URL</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="faviconUrl"
                      className="flex-1 border border-gray-300 rounded-l-lg p-2"
                      value={settings.faviconUrl}
                      onChange={handleInputChange}
                    />
                    <button className="bg-gray-100 text-gray-700 px-4 rounded-r-lg border border-l-0 border-gray-300 hover:bg-gray-200">
                      <FaCloudUploadAlt />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Contact Info */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FaEnvelope className="inline mr-2 text-gray-600" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FaPhone className="inline mr-2 text-gray-600" />
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.contactPhone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-gray-600" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.address}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          
          {/* Social Media */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <FaFacebook className="text-blue-600 mr-2" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.socialMedia.facebook}
                    onChange={(e) => handleInputChange(e, 'socialMedia', 'facebook')}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <FaTwitter className="text-blue-400 mr-2" />
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.socialMedia.twitter}
                    onChange={(e) => handleInputChange(e, 'socialMedia', 'twitter')}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <FaInstagram className="text-pink-600 mr-2" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.socialMedia.instagram}
                    onChange={(e) => handleInputChange(e, 'socialMedia', 'instagram')}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <FaLinkedin className="text-blue-700 mr-2" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.socialMedia.linkedin}
                    onChange={(e) => handleInputChange(e, 'socialMedia', 'linkedin')}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <FaPinterest className="text-red-600 mr-2" />
                    Pinterest URL
                  </label>
                  <input
                    type="url"
                    name="pinterest"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.socialMedia.pinterest}
                    onChange={(e) => handleInputChange(e, 'socialMedia', 'pinterest')}
                    placeholder="https://pinterest.com/yourhandle"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <FaYoutube className="text-red-600 mr-2" />
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.socialMedia.youtube}
                    onChange={(e) => handleInputChange(e, 'socialMedia', 'youtube')}
                    placeholder="https://youtube.com/c/yourchannel"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Business Hours */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Monday</label>
                  <input
                    type="text"
                    name="monday"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.businessHours.monday}
                    onChange={(e) => handleInputChange(e, 'businessHours', 'monday')}
                    placeholder="9:00 AM - 5:00 PM or Closed"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Tuesday</label>
                  <input
                    type="text"
                    name="tuesday"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.businessHours.tuesday}
                    onChange={(e) => handleInputChange(e, 'businessHours', 'tuesday')}
                    placeholder="9:00 AM - 5:00 PM or Closed"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Wednesday</label>
                  <input
                    type="text"
                    name="wednesday"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.businessHours.wednesday}
                    onChange={(e) => handleInputChange(e, 'businessHours', 'wednesday')}
                    placeholder="9:00 AM - 5:00 PM or Closed"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Thursday</label>
                  <input
                    type="text"
                    name="thursday"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.businessHours.thursday}
                    onChange={(e) => handleInputChange(e, 'businessHours', 'thursday')}
                    placeholder="9:00 AM - 5:00 PM or Closed"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Friday</label>
                  <input
                    type="text"
                    name="friday"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.businessHours.friday}
                    onChange={(e) => handleInputChange(e, 'businessHours', 'friday')}
                    placeholder="9:00 AM - 5:00 PM or Closed"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Saturday</label>
                  <input
                    type="text"
                    name="saturday"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.businessHours.saturday}
                    onChange={(e) => handleInputChange(e, 'businessHours', 'saturday')}
                    placeholder="9:00 AM - 5:00 PM or Closed"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Sunday</label>
                  <input
                    type="text"
                    name="sunday"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.businessHours.sunday}
                    onChange={(e) => handleInputChange(e, 'businessHours', 'sunday')}
                    placeholder="9:00 AM - 5:00 PM or Closed"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Primary Color</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="primaryColor"
                      className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
                      value={settings.theme.primaryColor}
                      onChange={(e) => handleInputChange(e, 'theme')}
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      className="flex-1 ml-3 border border-gray-300 rounded-lg p-2"
                      value={settings.theme.primaryColor}
                      onChange={(e) => handleInputChange(e, 'theme')}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Used for main buttons, accents, and highlights
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Secondary Color</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="secondaryColor"
                      className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => handleInputChange(e, 'theme')}
                    />
                    <input
                      type="text"
                      name="secondaryColor"
                      className="flex-1 ml-3 border border-gray-300 rounded-lg p-2"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => handleInputChange(e, 'theme')}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Used for secondary elements and accents
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Color Preview</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-lg shadow-md mb-2" 
                      style={{ backgroundColor: settings.theme.primaryColor }}
                    ></div>
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-lg shadow-md mb-2" 
                      style={{ backgroundColor: settings.theme.secondaryColor }}
                    ></div>
                    <span className="text-sm">Secondary</span>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-lg flex items-center justify-center text-white font-bold shadow-md mb-2" 
                      style={{ backgroundColor: settings.theme.primaryColor }}
                    >
                      Button
                    </div>
                    <span className="text-sm">Button</span>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-lg border-2 flex items-center justify-center font-bold shadow-md mb-2" 
                      style={{ borderColor: settings.theme.primaryColor, color: settings.theme.primaryColor }}
                    >
                      Btn
                    </div>
                    <span className="text-sm">Outlined</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.seo.metaTitle}
                    onChange={(e) => handleInputChange(e, 'seo')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The title that appears in search engine results (max 60 characters)
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.seo.metaDescription}
                    onChange={(e) => handleInputChange(e, 'seo')}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    The description that appears in search engine results (max 160 characters)
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Open Graph Image URL</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="ogImage"
                      className="flex-1 border border-gray-300 rounded-l-lg p-2"
                      value={settings.seo.ogImage}
                      onChange={(e) => handleInputChange(e, 'seo')}
                    />
                    <button className="bg-gray-100 text-gray-700 px-4 rounded-r-lg border border-l-0 border-gray-300 hover:bg-gray-200">
                      <FaCloudUploadAlt />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Image displayed when your site is shared on social media (recommended size: 1200x630px)
                  </p>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">SEO Preview</h3>
                  <div className="bg-white border rounded-lg p-4 max-w-2xl">
                    <div className="text-xl text-blue-800 font-medium">{settings.seo.metaTitle}</div>
                    <div className="text-sm text-green-800">https://www.seamlessedge.com/</div>
                    <div className="text-sm text-gray-800 mt-1">{settings.seo.metaDescription}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Google Maps API Key</label>
                  <input
                    type="text"
                    name="googleMapsApiKey"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.googleMapsApiKey}
                    onChange={handleInputChange}
                    placeholder="Enter your Google Maps API Key"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for displaying maps on your contact page and locations
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    name="googleAnalyticsId"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={settings.googleAnalyticsId}
                    onChange={handleInputChange}
                    placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for tracking website traffic with Google Analytics
                  </p>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Email Integration</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaWindows className="text-blue-600 mr-3 text-xl" />
                      <div>
                        <div className="font-medium text-blue-800">Microsoft Outlook Integration</div>
                        <div className="text-sm text-blue-700">
                          Email integration is configured in the Messages Management section.
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => window.location.href = '/admin/messages'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
                      >
                        <FaCog className="mr-2" /> Configure Email Integration
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SiteSettings; 