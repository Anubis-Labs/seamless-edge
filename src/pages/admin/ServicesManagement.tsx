import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar, FaTools, FaSearch, FaSave, FaSpinner, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabaseService from '../../services/supabaseService';
import FileUpload from '../../components/common/FileUpload';

// Interface matching Supabase services table (adapt as needed)
interface Service {
  id: number;
  name: string;
  description: string;
  short_description: string; // snake_case assumed
  category: string;
  icon?: string | null; // Assuming icon name from react-icons
  image: string;
  image_url?: string; // Add the image_url field to support both formats
  features?: string[] | null; // Assuming stored as JSON array or similar
  price?: string | null;
  featured: boolean;
  display_order: number; // Renamed from 'order' to avoid reserved word conflict
  created_at?: string;
}

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  // Drag state removed

  // Fetch services
  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await supabaseService.services.getServices();
      
      // Process data to ensure all services have required fields
      const processedData = (data || []).map((service: any) => ({
        ...service,
        category: service.category || 'General', // Set default category if missing
        short_description: service.short_description || service.description?.substring(0, 100) || '', // Set default short description
        features: service.features || [], // Ensure features is an array
        display_order: service.display_order || service.order || 0 // Handle both display_order and legacy order field
      }));
      
      setServices(processedData);
      const uniqueCategories = Array.from(new Set(processedData.map((s: Service) => s.category))).filter(c => c) as string[];
      setCategories(uniqueCategories);
    } catch (err: any) {
      console.error("Error fetching services:", err);
      setError('Failed to load services.');
      toast.error('Failed to load services.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // --- Restore and connect mutation handlers ---
  const handleAddNew = () => {
    // Restore logic to setup new service object
    setSelectedService({
      id: 0,
      name: '',
      description: '',
      short_description: '',
      category: categories[0] || '',
      icon: null,
      image: '',
      image_url: '',
      features: [],
      price: '',
      featured: false,
      display_order: (services.length > 0 ? Math.max(...services.map(s => s.display_order)) : 0) + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    // Restore edit logic
    setSelectedService(JSON.parse(JSON.stringify(service)));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    // Restore delete logic
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setIsSaving(true);
    try {
      await supabaseService.services.deleteService(id);
      toast.success('Service deleted!');
      await fetchServices();
    } catch (err: any) {
      console.error("Error deleting service:", err);
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeatured = async (service: Service) => {
    // Restore toggle logic
    setIsSaving(true);
    try {
      await supabaseService.services.updateService(service.id, { featured: !service.featured });
      toast.success(`Featured status updated.`);
      await fetchServices();
    } catch (err: any) {
      console.error("Error updating featured status:", err);
      toast.error(`Failed to update: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveService = async (serviceToSave: Service) => {
    if (isSaving) return; // Prevent double clicks
    setIsSaving(true);
    setError(null);

    if (!serviceToSave.name || !serviceToSave.category || !serviceToSave.short_description || !serviceToSave.image) {
        toast.error("Please fill Name, Category, Short Description, and Image URL.");
        setIsSaving(false);
        return;
    }

    try {
      // Prepare data: explicitly exclude DB-managed fields
      const { id, created_at, ...dataToSubmit } = serviceToSave;

      if (id === 0) { // New service
        // Send only the relevant data for creation
        await supabaseService.services.createService(dataToSubmit);
        toast.success('Service created!');
      } else { // Update existing service
        // Send ID separately from the data payload
        await supabaseService.services.updateService(id, dataToSubmit);
        toast.success('Service updated!');
      }
      setIsModalOpen(false);
      setSelectedService(null);
      await fetchServices(); // Refetch to show the latest data
    } catch (err: any) {
      console.error("Error saving service:", err);
      const errorMessage = `Failed to save service: ${err.message}`;
      toast.error(errorMessage);
      setError(errorMessage); // Show error in the modal
    } finally {
      setIsSaving(false);
    }
  };

  // Add an image upload handler
  const handleImageUpload = (imageUrl: string) => {
    if (selectedService) {
      setSelectedService({
        ...selectedService,
        image: imageUrl
      });
      toast.success('Image uploaded successfully');
    }
  };

  // Filter logic (remains client-side for now)
  const filteredServices = services
    .filter(service => {
      const matchesSearch = (
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.short_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesCategory = filterCategory === '' || service.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
     // Assuming fetchServices returns sorted data based on display_order

   // Format date (if needed, kept for consistency but not used in current list view)
   const formatDate = (dateString: string | null | undefined) => {
     if (!dateString) return 'N/A';
     try { const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }; return new Date(dateString).toLocaleDateString('en-US', options); } catch (e) { return dateString; }
   };

  return (
    <>
      <Helmet><title>Services Management | Seamless Edge Admin</title></Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Services Management</h1>
        <p className="text-gray-600">Manage the services your company offers.</p>
         {error && !isModalOpen && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert"><strong className="font-bold">Error:</strong><span className="block sm:inline"> {error}</span></div>)}
      </div>

      {/* Filters and Actions - Disable relevant controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
            {/* Search Input */} 
            <div className="relative"><input type="text" placeholder="Search services..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest disabled:opacity-50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isLoading} /><FaSearch className="absolute left-3 top-3 text-gray-400" /></div>
            {/* Category Filter */} 
            <select className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest disabled:opacity-50" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} disabled={isLoading}><option value="">All Categories</option>{categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select>
        </div>
         {/* Add Button - Temporarily disabled */}
        <button onClick={handleAddNew} className="bg-accent-forest text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-accent-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || isSaving}>
          <FaPlus className="mr-2" /> Add New Service
        </button>
      </div>

      {/* Services List - Show loading or no results */} 
      {isLoading ? (
        <div className="flex justify-center py-12"><FaSpinner className="animate-spin h-12 w-12 text-accent-forest" /></div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <FaTools className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">No Services Found</h3>
          <p className="text-gray-500 mt-2">{searchTerm || filterCategory ? 'No services match filters.' : 'Add your first service.'}</p>
          {(searchTerm || filterCategory) && (<button className="mt-4 text-accent-forest hover:text-accent-forest-dark" onClick={() => { setSearchTerm(''); setFilterCategory(''); }}>Clear Filters</button>)}
        </div>
      ) : (
        // Services List/Table - Render data, remove drag, disable actions
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="grid grid-cols-12 font-medium text-gray-500">
              <div className="col-span-1 text-center">Order</div>
              <div className="col-span-3">Service Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-3">Short Description</div>
              <div className="col-span-1 text-center">Featured</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>
          <div className="divide-y">
            {filteredServices.map((service) => (
              // Remove draggable attributes and handlers
              <div key={service.id} className={`px-6 py-4 grid grid-cols-12 items-center hover:bg-gray-50`}>
                <div className="col-span-1 text-center text-gray-500">{service.display_order}</div>
                <div className="col-span-3 font-medium">{service.name}</div>
                <div className="col-span-2"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{service.category}</span></div>
                <div className="col-span-3 text-sm text-gray-600 truncate">{service.short_description}</div>
                <div className="col-span-1 text-center">
                  {/* Disable feature toggle */} 
                  <button onClick={() => handleToggleFeatured(service)} disabled={isSaving} className="disabled:opacity-50">
                    {service.featured ? <FaStar className="text-yellow-500 mx-auto" /> : <FaRegStar className="text-gray-400 mx-auto" />}
                  </button>
                </div>
                <div className="col-span-2 flex justify-end gap-3">
                   {/* Disable action buttons */}
                  <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-800 disabled:opacity-50" title="Edit" disabled={isSaving}><FaEdit /></button>
                  <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-800 disabled:opacity-50" title="Delete" disabled={isSaving}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
          {/* Optional Footer Note - Removed drag info */}
          {/* <div className="px-6 py-4 bg-gray-50 border-t"><p className="text-sm text-gray-500">Services are ordered by the 'Order' field.</p></div> */} 
        </div>
      )}

      {/* Service Edit/Add Modal - Ensure inputs/buttons use isSaving */}
      {isModalOpen && selectedService && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
             <div className="p-6 border-b"><h2 className="text-2xl font-bold">{selectedService.id === 0 ? 'Add New Service' : 'Edit Service'}</h2></div>
             <form onSubmit={(e) => { e.preventDefault(); handleSaveService(selectedService); }} className="p-6 overflow-y-auto flex-grow">
               {error && isModalOpen && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"><strong className="font-bold">Error:</strong><span className="block sm:inline"> {error}</span></div>)}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Inputs disabled based on isSaving */} 
                   <div className="md:col-span-2"><label className="block text-gray-700 font-medium mb-2">Service Name</label><input type="text" required className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedService.name} onChange={(e) => setSelectedService({...selectedService, name: e.target.value})} disabled={isSaving} /></div>
                   <div><label className="block text-gray-700 font-medium mb-2">Category</label><input type="text" required list="categories" className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedService.category} onChange={(e) => setSelectedService({...selectedService, category: e.target.value})} disabled={isSaving} /><datalist id="categories">{categories.map(cat => (<option key={cat} value={cat} />))}</datalist></div>
                   <div><label className="block text-gray-700 font-medium mb-2">Price</label><input type="text" className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedService.price || ''} onChange={(e) => setSelectedService({...selectedService, price: e.target.value})} placeholder="e.g., From $X,XXX" disabled={isSaving} /></div>
                   <div className="md:col-span-2"><label className="block text-gray-700 font-medium mb-2">Short Description</label><input type="text" required maxLength={100} className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedService.short_description} onChange={(e) => setSelectedService({...selectedService, short_description: e.target.value})} disabled={isSaving} /><p className="text-xs text-gray-500 mt-1">(Max 100 chars)</p></div>
                   <div className="md:col-span-2"><label className="block text-gray-700 font-medium mb-2">Full Description</label><textarea required rows={4} className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedService.description} onChange={(e) => setSelectedService({...selectedService, description: e.target.value})} disabled={isSaving}></textarea></div>
                   <div><label className="block text-gray-700 font-medium mb-2">Icon Name</label><input type="text" placeholder="FaHome" className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedService.icon || ''} onChange={(e) => setSelectedService({...selectedService, icon: e.target.value})} disabled={isSaving} /><p className="text-xs text-gray-500 mt-1">(React Icons name)</p></div>
                   <div>
                     <label className="block text-gray-700 font-medium mb-2">Service Image</label>
                     {selectedService.image ? (
                       <div className="mb-3">
                         <img 
                           src={selectedService.image} 
                           alt={selectedService.name}
                           className="h-40 w-full object-cover rounded"
                         />
                       </div>
                     ) : (
                       <div className="flex items-center justify-center h-40 bg-gray-100 rounded mb-3">
                         <FaImage className="text-gray-400 text-4xl" />
                       </div>
                     )}
                     <FileUpload
                       bucketName="service-images"
                       onUploadComplete={handleImageUpload}
                       acceptedFileTypes="image/*"
                       label="Upload Service Image"
                     />
                     <div className="mt-2">
                       <label className="block text-xs text-gray-500 mb-1">Or enter image URL directly:</label>
                       <input 
                         type="text" 
                         className="w-full border border-gray-300 rounded-lg p-2 text-sm disabled:bg-gray-100" 
                         value={selectedService.image} 
                         onChange={(e) => setSelectedService({...selectedService, image: e.target.value})} 
                         placeholder="https://... or /images/..."
                         disabled={isSaving}
                       />
                     </div>
                   </div>
                   <div className="md:col-span-2"><label className="block text-gray-700 font-medium mb-2">Features</label><div className="space-y-2">{(selectedService.features || []).map((feature, index) => (<div key={index} className="flex gap-2"><input type="text" className="flex-1 border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={feature} onChange={(e) => { const u = [...(selectedService.features || [])]; u[index] = e.target.value; setSelectedService({...selectedService, features: u}); }} placeholder={`Feature ${index + 1}`} disabled={isSaving} /><button type="button" className="text-red-500 hover:text-red-700 disabled:opacity-50" onClick={() => { const u = (selectedService.features || []).filter((_, i) => i !== index); setSelectedService({...selectedService, features: u}); }} disabled={isSaving}><FaTrash /></button></div>))}<button type="button" className="mt-2 text-accent-forest hover:text-accent-forest-dark text-sm disabled:opacity-50" onClick={() => { setSelectedService({...selectedService, features: [...(selectedService.features || []), '']}); }} disabled={isSaving}>+ Add Feature</button></div></div>
                   <div><label className="block text-gray-700 font-medium mb-2">Display Order</label><input type="number" required min="1" className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedService.display_order} onChange={(e) => setSelectedService({...selectedService, display_order: parseInt(e.target.value) || selectedService.display_order})} disabled={isSaving} /></div>
                   <div><label className="flex items-center mt-6"><input type="checkbox" className="rounded text-accent-forest focus:ring-accent-forest h-5 w-5 mr-2 disabled:opacity-50" checked={selectedService.featured} onChange={(e) => setSelectedService({...selectedService, featured: e.target.checked})} disabled={isSaving} /><span>Feature this service</span></label></div>
               </div>
               {/* Modal Footer Buttons disabled based on isSaving */} 
               <div className="flex justify-end gap-3 pt-4 border-t">
                 <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50" onClick={() => { setIsModalOpen(false); setSelectedService(null); setError(null);}} disabled={isSaving}>Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest-dark flex items-center disabled:opacity-50" disabled={isSaving}>{isSaving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} {isSaving ? 'Saving...' : 'Save Service'}</button>
               </div>
             </form>
           </div>
         </div>
      )}
    </>
  );
};

export default ServicesManagement; 