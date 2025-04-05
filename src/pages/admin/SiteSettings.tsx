import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import supabaseService from '../../services/supabaseService';
import { 
  FaSave, FaSpinner, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPinterest, FaYoutube,
  FaCloudUploadAlt, FaImage, FaTimes
} from 'react-icons/fa';

// --- Interfaces for Settings Sections --- 
interface GeneralSettings { companyName: string; tagline: string; description: string; logoUrl: string; faviconUrl: string; }
interface ContactSettings { contactEmail: string; contactPhone: string; address: string; }
interface SocialMediaSettings { facebook: string; twitter: string; instagram: string; linkedin: string; pinterest: string; youtube: string; }
interface BusinessHoursSettings { monday: string; tuesday: string; wednesday: string; thursday: string; friday: string; saturday: string; sunday: string; }
interface AppearanceSettings { primaryColor: string; secondaryColor: string; }
interface SeoSettings { metaTitle: string; metaDescription: string; ogImage: string; }
interface IntegrationSettings { googleMapsApiKey: string; googleAnalyticsId: string; }

// Type for the state holding all settings sections
interface AllSettings {
    general: GeneralSettings;
    contact: ContactSettings;
    social: SocialMediaSettings;
    hours: BusinessHoursSettings;
    appearance: AppearanceSettings;
    seo: SeoSettings;
    integrations: IntegrationSettings;
}

// Default state structure
const defaultSettings: AllSettings = {
    general: { companyName: 'Seamless Edge', tagline: '', description: '', logoUrl: '/logo.png', faviconUrl: '/favicon.ico' },
    contact: { contactEmail: '', contactPhone: '', address: '' },
    social: { facebook: '', twitter: '', instagram: '', linkedin: '', pinterest: '', youtube: '' },
    hours: { monday: '8am-5pm', tuesday: '8am-5pm', wednesday: '8am-5pm', thursday: '8am-5pm', friday: '8am-5pm', saturday: 'Closed', sunday: 'Closed' },
    appearance: { primaryColor: '#3D5734', secondaryColor: '#1B365D' },
    seo: { metaTitle: '', metaDescription: '', ogImage: '' },
    integrations: { googleMapsApiKey: '', googleAnalyticsId: '' }
};

type SettingsSectionKey = keyof AllSettings;
// Type for mapping form field names to their section and setting key
type FileUploadFieldMap = 'logoUrl' | 'faviconUrl' | 'ogImage';

const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<AllSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<SettingsSectionKey>('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<FileUploadFieldMap | null>(null); // Track which field is uploading
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  // --- Data Fetching --- 
  const fetchAllSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const sectionKeys = Object.keys(defaultSettings) as SettingsSectionKey[];
    // Deep clone default settings to avoid mutation issues
    let loadedSettings = JSON.parse(JSON.stringify(defaultSettings)) as AllSettings;

    try {
        const promises = sectionKeys.map(key => 
            supabaseService.settings.getSectionSettings(`site_${key}`)
        );
        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
            const key = sectionKeys[index];
            if (result.status === 'fulfilled' && result.value && Object.keys(result.value).length > 0) {
                 // Explicitly merge fetched data into the correct section
                 const fetchedSectionData = result.value;
                 const targetSection = loadedSettings[key];
                 for (const fetchedKey in fetchedSectionData) {
                     // Check if the key exists in the target section to maintain type structure
                     if (Object.prototype.hasOwnProperty.call(targetSection, fetchedKey)) {
                         // Assign the fetched value, ensuring type safety (though any cast might be needed for complex cases)
                         (targetSection as any)[fetchedKey] = fetchedSectionData[fetchedKey];
                     }
                 }
            } else if (result.status === 'rejected') {
                 console.warn(`Failed to load settings for section '${key}':`, result.reason);
            }
        });
        
        setSettings(loadedSettings);

    } catch (err: any) {
        console.error("Error fetching site settings:", err);
        setError('Failed to load some settings. Displaying defaults where needed.');
        toast.error('Failed to load some settings.');
        // Fallback might need deep clone too if mutation is a concern
        setSettings(JSON.parse(JSON.stringify(defaultSettings)));
    } finally {
        setIsLoading(false);
        setHasChanges(false);
    }
}, []);

  useEffect(() => {
    fetchAllSettings();
  }, [fetchAllSettings]);

  // --- State Updates --- 
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: SettingsSectionKey
  ) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
    setHasChanges(true);
  };

  // Trigger hidden file input click
  const handleUploadButtonClick = (fieldName: FileUploadFieldMap) => {
    if (fileInputRef.current) {
        // Set data attribute to know which field we're uploading for
        fileInputRef.current.setAttribute('data-field-name', fieldName);
        fileInputRef.current.click();
    }
  };

  // Handle file selection and upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const fieldName = event.target.getAttribute('data-field-name') as FileUploadFieldMap | null;

    if (!file || !fieldName) {
      return; // No file selected or field name missing
    }

    // Reset file input value to allow re-uploading the same file
    event.target.value = ''; 

    // Determine which section the field belongs to
    let sectionKey: SettingsSectionKey;
    if (fieldName === 'logoUrl' || fieldName === 'faviconUrl') {
        sectionKey = 'general';
    } else if (fieldName === 'ogImage') {
        sectionKey = 'seo';
    } else {
        console.error('Invalid field name for file upload:', fieldName);
        return;
    }

    setIsUploading(fieldName);
    toast.info(`Uploading ${fieldName}...`);

    try {
        // Suggest a file path within the bucket
        const filePath = `${sectionKey}/${fieldName}_${file.name}`;
        // Upload using the storage service
        const uploadedPath = await supabaseService.storage.uploadFile(file, 'site-assets', filePath, { upsert: true });
        
        // Get the public URL
        const { publicUrl } = supabaseService.storage.getPublicUrl(uploadedPath, 'site-assets');

        if (!publicUrl) {
             throw new Error('Failed to get public URL after upload.');
        }
        
        // Update the state
        setSettings(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                [fieldName]: publicUrl
            }
        }));
        setHasChanges(true);
        toast.success(`${fieldName} uploaded successfully!`);

    } catch (error: any) {
        console.error(`Error uploading ${fieldName}:`, error);
        toast.error(`Upload failed for ${fieldName}: ${error.message}`);
    } finally {
        setIsUploading(null);
    }
  };

  // --- Save Logic --- 
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    let success = true;
    try {
        // Save each section individually
        const savePromises = (Object.keys(settings) as SettingsSectionKey[]).map(key => 
            supabaseService.settings.updateSettings(`site_${key}`, settings[key])
        );
        const results = await Promise.allSettled(savePromises);

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                const key = (Object.keys(settings) as SettingsSectionKey[])[index];
                console.error(`Failed to save section '${key}':`, result.reason);
                toast.error(`Error saving ${key} settings.`);
                success = false; // Mark overall save as failed if any part fails
            }
        });

        if (success) {
            toast.success('Site settings saved successfully!');
            setHasChanges(false);
        } else {
             setError('Failed to save some settings. Please check console and try again.');
        }

    } catch (err: any) { // Catch potential errors in Promise.allSettled
      console.error("Error during bulk settings save:", err);
      setError('An unexpected error occurred during save.');
      toast.error('An unexpected error occurred during save.');
      success = false;
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render Logic --- 
  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin h-12 w-12 text-accent-forest" /></div>;
  }

  // Get settings for the currently active tab
  const currentTabData = settings[activeTab];

  // Component for rendering file input with preview
  const FileUploadInput: React.FC<{ 
      label: string; 
      fieldName: FileUploadFieldMap;
      currentValue: string;
      sectionKey: SettingsSectionKey;
      accept?: string; // e.g., "image/*", ".ico"
  }> = ({ label, fieldName, currentValue, sectionKey, accept="image/*" }) => {
      const isCurrentlyUploading = isUploading === fieldName;
      return (
          <div>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <div className="mt-1 flex items-center space-x-4">
                   {/* Preview Area */} 
                   <div className="flex-shrink-0 h-16 w-16 border border-gray-300 rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                       {currentValue ? (
                           <img src={currentValue} alt={`${label} preview`} className="h-full w-full object-contain" />
                       ) : (
                           <FaImage className="h-8 w-8 text-gray-400" />
                       )}
                   </div>
                    {/* Input and Upload Button */} 
                   <div className="flex-grow">
                       <input 
                           type="text" 
                           name={fieldName} 
                           className="w-full border rounded-md p-2 bg-gray-100 text-sm" 
                           value={currentValue} 
                           readOnly // URL is managed by upload
                           placeholder="Upload an image..."
                       />
                       <button 
                           type="button" 
                           onClick={() => handleUploadButtonClick(fieldName)} 
                           disabled={isSaving || isCurrentlyUploading}
                           className={`mt-2 px-3 py-1.5 text-xs font-medium rounded-md flex items-center justify-center ${isSaving || isCurrentlyUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                       >
                           {isCurrentlyUploading ? (
                               <><FaSpinner className="animate-spin h-4 w-4 mr-1"/> Uploading...</>
                           ) : (
                               <><FaCloudUploadAlt className="mr-1" /> {currentValue ? 'Change' : 'Upload'}</>
                           )}
                       </button>
                   </div>
               </div>
           </div>
      );
  };

  return (
    <>
      <Helmet><title>Site Settings | Admin</title></Helmet>

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept="image/*,.ico" // Accept common image types and ico
      />

      {/* Header & Save Button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Site Settings</h1>
            <p className="text-gray-600">Configure global website settings.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving || isUploading !== null || !hasChanges} className={`mt-4 md:mt-0 px-4 py-2 rounded-lg flex items-center ${ (isSaving || isUploading !== null || !hasChanges) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-accent-forest text-white hover:bg-accent-forest-dark' } transition-colors`}>
            {isSaving ? (<><FaSpinner className="animate-spin h-5 w-5 mr-2"/>Saving...</>) : (<><FaSave className="mr-2" /> Save Changes</>)}
        </button>
      </div>
      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">{error}</div>)}

      {/* Tabs & Content Area */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {(Object.keys(settings) as SettingsSectionKey[]).map((key) => (
                <button
                    key={key}
                    className={`px-6 py-3 font-medium text-sm focus:outline-none capitalize whitespace-nowrap ${ activeTab === key ? 'border-b-2 border-accent-forest text-accent-forest' : 'text-gray-500 hover:text-gray-700' }`}
                    onClick={() => setActiveTab(key)}
                    disabled={isSaving || isUploading !== null} 
                >
                    {key}
                </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */} 
        <div className="p-6">
            {/* General Settings Tab */}
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700">Company Name</label><input type="text" name="companyName" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.general.companyName} onChange={e => handleInputChange(e, 'general')} disabled={isSaving || isUploading !== null} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Tagline</label><input type="text" name="tagline" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.general.tagline} onChange={e => handleInputChange(e, 'general')} disabled={isSaving || isUploading !== null} /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Description</label><textarea name="description" rows={4} className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.general.description} onChange={e => handleInputChange(e, 'general')} disabled={isSaving || isUploading !== null}></textarea></div>
                        <FileUploadInput label="Logo" fieldName="logoUrl" currentValue={settings.general.logoUrl} sectionKey="general" accept="image/png, image/jpeg, image/svg+xml" />
                        <FileUploadInput label="Favicon" fieldName="faviconUrl" currentValue={settings.general.faviconUrl} sectionKey="general" accept=".ico, image/png" />
                    </div>
                </div>
            )}
            {/* Contact Settings Tab */}
            {activeTab === 'contact' && (
                 <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div><label className="flex items-center text-sm font-medium text-gray-700"><FaEnvelope className="inline mr-2 text-gray-400" /> Contact Email</label><input type="email" name="contactEmail" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.contact.contactEmail} onChange={e => handleInputChange(e, 'contact')} disabled={isSaving || isUploading !== null} /></div>
                         <div><label className="flex items-center text-sm font-medium text-gray-700"><FaPhone className="inline mr-2 text-gray-400" /> Contact Phone</label><input type="text" name="contactPhone" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.contact.contactPhone} onChange={e => handleInputChange(e, 'contact')} disabled={isSaving || isUploading !== null} /></div>
                         <div className="md:col-span-2"><label className="flex items-center text-sm font-medium text-gray-700"><FaMapMarkerAlt className="inline mr-2 text-gray-400" /> Address</label><textarea name="address" rows={2} className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.contact.address} onChange={e => handleInputChange(e, 'contact')} disabled={isSaving || isUploading !== null}></textarea></div>
                     </div>
                 </div>
            )}
            {/* Social Settings Tab */}
            {activeTab === 'social' && (
                 <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className="flex items-center text-sm font-medium text-gray-700"><FaFacebook className="inline mr-2 text-blue-600" /> Facebook URL</label><input type="url" name="facebook" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.social.facebook} onChange={e => handleInputChange(e, 'social')} placeholder="https://..." disabled={isSaving || isUploading !== null} /></div>
                          <div><label className="flex items-center text-sm font-medium text-gray-700"><FaTwitter className="inline mr-2 text-sky-500" /> Twitter URL</label><input type="url" name="twitter" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.social.twitter} onChange={e => handleInputChange(e, 'social')} placeholder="https://..." disabled={isSaving || isUploading !== null} /></div>
                          <div><label className="flex items-center text-sm font-medium text-gray-700"><FaInstagram className="inline mr-2 text-pink-500" /> Instagram URL</label><input type="url" name="instagram" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.social.instagram} onChange={e => handleInputChange(e, 'social')} placeholder="https://..." disabled={isSaving || isUploading !== null} /></div>
                          <div><label className="flex items-center text-sm font-medium text-gray-700"><FaLinkedin className="inline mr-2 text-blue-700" /> LinkedIn URL</label><input type="url" name="linkedin" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.social.linkedin} onChange={e => handleInputChange(e, 'social')} placeholder="https://..." disabled={isSaving || isUploading !== null} /></div>
                          <div><label className="flex items-center text-sm font-medium text-gray-700"><FaPinterest className="inline mr-2 text-red-600" /> Pinterest URL</label><input type="url" name="pinterest" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.social.pinterest} onChange={e => handleInputChange(e, 'social')} placeholder="https://..." disabled={isSaving || isUploading !== null} /></div>
                          <div><label className="flex items-center text-sm font-medium text-gray-700"><FaYoutube className="inline mr-2 text-red-500" /> YouTube URL</label><input type="url" name="youtube" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.social.youtube} onChange={e => handleInputChange(e, 'social')} placeholder="https://..." disabled={isSaving || isUploading !== null} /></div>
                     </div>
                 </div>
            )}
            {/* Business Hours Tab */}
             {activeTab === 'hours' && (
                 <div className="space-y-6">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                         {(Object.keys(settings.hours) as Array<keyof BusinessHoursSettings>).map(day => (
                              <div key={day}><label className="block text-sm font-medium text-gray-700 capitalize">{day}</label><input type="text" name={day} className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.hours[day]} onChange={e => handleInputChange(e, 'hours')} placeholder="e.g., 9am-5pm" disabled={isSaving || isUploading !== null} /></div>
                         ))}
                     </div>
                 </div>
             )}
             {/* Appearance Tab */}
             {activeTab === 'appearance' && (
                  <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div><label className="block text-sm font-medium text-gray-700">Primary Color</label><div className="flex items-center mt-1"><input type="color" name="primaryColor" className="h-10 w-10 p-0 border rounded-md cursor-pointer disabled:opacity-50" value={settings.appearance.primaryColor} onChange={e => handleInputChange(e, 'appearance')} disabled={isSaving || isUploading !== null} /><input type="text" name="primaryColor" className="flex-1 ml-3 border rounded p-2 disabled:bg-gray-100" value={settings.appearance.primaryColor} onChange={e => handleInputChange(e, 'appearance')} disabled={isSaving || isUploading !== null} /></div></div>
                           <div><label className="block text-sm font-medium text-gray-700">Secondary Color</label><div className="flex items-center mt-1"><input type="color" name="secondaryColor" className="h-10 w-10 p-0 border rounded-md cursor-pointer disabled:opacity-50" value={settings.appearance.secondaryColor} onChange={e => handleInputChange(e, 'appearance')} disabled={isSaving || isUploading !== null} /><input type="text" name="secondaryColor" className="flex-1 ml-3 border rounded p-2 disabled:bg-gray-100" value={settings.appearance.secondaryColor} onChange={e => handleInputChange(e, 'appearance')} disabled={isSaving || isUploading !== null} /></div></div>
                      </div>
                      {/* Preview */}
                       <div className="border-t pt-6 mt-6"><h3 className="text-lg font-medium text-gray-800 mb-4">Preview</h3><div className="flex flex-wrap gap-4"><div className="text-center"><div className="w-20 h-20 rounded-md border flex items-center justify-center" style={{ backgroundColor: settings.appearance.primaryColor }}></div><span className="text-xs mt-1 block text-gray-600">Primary</span></div><div className="text-center"><div className="w-20 h-20 rounded-md border flex items-center justify-center" style={{ backgroundColor: settings.appearance.secondaryColor }}></div><span className="text-xs mt-1 block text-gray-600">Secondary</span></div></div></div>
                  </div>
             )}
             {/* SEO Tab */}
            {activeTab === 'seo' && (
                 <div className="space-y-6">
                     <div className="grid grid-cols-1 gap-6">
                          <div><label className="block text-sm font-medium text-gray-700">Meta Title</label><input type="text" name="metaTitle" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.seo.metaTitle} onChange={e => handleInputChange(e, 'seo')} disabled={isSaving || isUploading !== null} /></div>
                          <div><label className="block text-sm font-medium text-gray-700">Meta Description</label><textarea name="metaDescription" rows={3} className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.seo.metaDescription} onChange={e => handleInputChange(e, 'seo')} disabled={isSaving || isUploading !== null}></textarea></div>
                          <FileUploadInput label="Open Graph Image" fieldName="ogImage" currentValue={settings.seo.ogImage} sectionKey="seo" accept="image/png, image/jpeg" />
                          <div className="border-t pt-6 mt-6"><h3 className="text-lg font-medium text-gray-800 mb-4">Search Result Preview</h3><div className="bg-white border rounded-md p-4 max-w-xl mx-auto shadow-sm"><div className="text-xl text-blue-800 truncate group-hover:underline">{settings.seo.metaTitle || '[Your Website Title]'}</div><div className="text-sm text-green-700 truncate">{window.location.origin}</div><div className="text-sm text-gray-600 line-clamp-2">{settings.seo.metaDescription || '[Your website description will appear here. Optimize it for relevant keywords.]'}</div></div></div>
                     </div>
                 </div>
             )}
             {/* Integrations Tab */}
             {activeTab === 'integrations' && (
                 <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className="block text-sm font-medium text-gray-700">Google Maps API Key</label><input type="text" name="googleMapsApiKey" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.integrations.googleMapsApiKey} onChange={e => handleInputChange(e, 'integrations')} disabled={isSaving || isUploading !== null} /></div>
                          <div><label className="block text-sm font-medium text-gray-700">Google Analytics ID</label><input type="text" name="googleAnalyticsId" className="mt-1 w-full border rounded p-2 disabled:bg-gray-100" value={settings.integrations.googleAnalyticsId} onChange={e => handleInputChange(e, 'integrations')} placeholder="UA-XXXX... or G-XXXX..." disabled={isSaving || isUploading !== null} /></div>
                     </div>
                 </div>
             )}
        </div>

      </div>
    </>
  );
};

export default SiteSettings; 