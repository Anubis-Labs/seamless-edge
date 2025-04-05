import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar, FaQuoteLeft, FaSearch, FaCheck, FaTimes, FaSpinner, FaUser, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabaseService from '../../services/supabaseService';
import FileUpload from '../../components/common/FileUpload';

// Interface matching Supabase testimonials table schema
interface Testimonial {
  id: number;
  client_name: string;
  client_title?: string | null;
  client_company?: string | null;
  client_location: string;
  client_image?: string | null;
  content: string;
  rating: number;
  status: string;
  service_type: string;
  display_on_homepage: boolean;
  created_at?: string;
  updated_at?: string;
}

const TestimonialsManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [filterServiceType, setFilterServiceType] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await supabaseService.testimonials.getTestimonials();
      const formattedData = (data || []).map((t: any) => ({
          ...t,
          rating: t.rating ?? 5,
          status: t.status ?? 'pending',
          service_type: t.service_type ?? '',
          display_on_homepage: t.display_on_homepage ?? false,
      }));
      setTestimonials(formattedData as Testimonial[]);
      const uniqueServiceTypes = Array.from(new Set(formattedData.map((t: Testimonial) => t.service_type))).filter(st => st) as string[];
      setServiceTypes(uniqueServiceTypes);
    } catch (err: any) {
      console.error("Error fetching testimonials:", err);
      setError('Failed to load testimonials.');
      toast.error('Failed to load testimonials.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Open modal for adding
  const handleAddNew = () => {
    setSelectedTestimonial({
      id: 0,
      client_name: '',
      client_title: '',
      client_company: '',
      client_location: '',
      service_type: '',
      content: '',
      rating: 5,
      display_on_homepage: false,
      status: 'pending',
      client_image: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(JSON.parse(JSON.stringify(testimonial)));
    setIsModalOpen(true);
  };

  // Delete testimonial
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    setIsSaving(true);
    try {
      await supabaseService.testimonials.deleteTestimonial(id);
      toast.success('Testimonial deleted!');
      await fetchTestimonials();
    } catch (err: any) {
      console.error("Error deleting testimonial:", err);
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle display_on_homepage status
  const handleToggleFeatured = async (testimonial: Testimonial) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await supabaseService.testimonials.updateTestimonial(testimonial.id, { display_on_homepage: !testimonial.display_on_homepage });
      toast.success(`Homepage display status updated.`);
      await fetchTestimonials();
    } catch (err: any) {
      console.error("Error updating homepage display status:", err);
      toast.error(`Failed to update status: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to approve/reject (update status)
  const handleUpdateStatus = async (testimonial: Testimonial, newStatus: string) => {
     if (isSaving) return;
     setIsSaving(true);
    try {
      await supabaseService.testimonials.updateTestimonial(testimonial.id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}.`);
      await fetchTestimonials();
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast.error(`Failed to update status: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save new or updated testimonial
  const handleSaveTestimonial = async (testimonialToSave: Testimonial) => {
    if (isSaving) return;
    setIsSaving(true);
    setError(null);

    if (!testimonialToSave.client_name || !testimonialToSave.service_type || !testimonialToSave.content) {
        toast.error("Please fill Client Name, Service Type, and Content.");
        setIsSaving(false);
        return;
    }

    try {
      const { id, created_at, updated_at, ...dataToSubmit } = testimonialToSave; 

      if (id === 0) {
        await supabaseService.testimonials.createTestimonial(dataToSubmit);
        toast.success('Testimonial created!');
      } else {
        await supabaseService.testimonials.updateTestimonial(id, dataToSubmit);
        toast.success('Testimonial updated!');
      }
      setIsModalOpen(false);
      setSelectedTestimonial(null);
      await fetchTestimonials();
    } catch (err: any) {
      console.error("Error saving testimonial:", err);
      const errorMessage = `Failed to save testimonial: ${err.message}`;
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Add image upload handler
  const handleImageUpload = (imageUrl: string) => {
    if (selectedTestimonial) {
      setSelectedTestimonial({
        ...selectedTestimonial,
        client_image: imageUrl
      });
      toast.success('Client image uploaded successfully');
    }
  };

  // Filter logic
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesStatus = filterStatus === 'all' || testimonial.status === filterStatus;
    
    const matchesSearch = (
        testimonial.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (testimonial.client_location && testimonial.client_location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (testimonial.service_type && testimonial.service_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (testimonial.client_company && testimonial.client_company.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const matchesServiceType = filterServiceType === '' || testimonial.service_type === filterServiceType;
    
    return matchesSearch && matchesServiceType && matchesStatus;
  });

   // Format date
   const formatDate = (dateString: string | null | undefined) => {
     if (!dateString) return 'N/A';
     try { const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }; return new Date(dateString).toLocaleDateString('en-US', options); } catch (e) { return dateString; }
   };

  return (
    <>
      <Helmet><title>Testimonials Management | Seamless Edge Admin</title></Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Testimonials Management</h1>
        <p className="text-gray-600">Manage client testimonials and reviews for your business.</p>
         {error && !isModalOpen && (<div className="bg-red-100 ..." role="alert">... {error} ...</div>)}
      </div>

      {/* Filters and Actions - Disable controls when loading */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* Search Input */} 
          <div className="relative"><input type="text" placeholder="Search testimonials..." className="pl-10 pr-4 py-2 ... disabled:opacity-50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isLoading} /><FaSearch className="absolute left-3 top-3 ..." /></div>
          {/* Service Type Filter */} 
          <select className="py-2 pl-3 pr-8 ... disabled:opacity-50" value={filterServiceType} onChange={(e) => setFilterServiceType(e.target.value)} disabled={isLoading}><option value="">All Service Types</option>{serviceTypes.map(type => (<option key={type} value={type}>{type}</option>))}</select>
          {/* Status Filter */} 
          <select className="py-2 pl-3 pr-8 ... disabled:opacity-50" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} disabled={isLoading}>
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        {/* Add Button */} 
        <button onClick={handleAddNew} className="bg-accent-forest ... disabled:opacity-50" disabled={isLoading || isSaving}><FaPlus className="mr-2" /> Add New Testimonial</button>
      </div>

      {/* Testimonials List - Show loading or no results */} 
      {isLoading ? (
        <div className="flex justify-center py-12"><FaSpinner className="animate-spin h-12 w-12 text-accent-forest" /></div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white p-8 ... text-center">
          <FaQuoteLeft className="text-gray-300 ..." />
          <h3 className="text-xl ...">No Testimonials Found</h3>
          <p className="text-gray-500 ...">{searchTerm || filterServiceType || filterStatus !== 'all' ? 'No testimonials match filters.' : 'Add your first testimonial.'}</p>
          {(searchTerm || filterServiceType || filterStatus !== 'all') && (<button className="mt-4 ..." onClick={() => { setSearchTerm(''); setFilterServiceType(''); setFilterStatus('all'); }}>Clear Filters</button>)}
        </div>
      ) : (
        // Testimonials Grid - Render actual data
        <div className="flex flex-wrap gap-6">
          {filteredTestimonials.map(testimonial => (
            <div key={testimonial.id} className={`bg-white ... ${testimonial.status === 'pending' ? 'border-l-4 border-yellow-400' : testimonial.status === 'rejected' ? 'border-l-4 border-red-400' : ''} ...`}>
              <div className="p-6">
                {/* Header: Name, Location, Rating */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {testimonial.client_image ? (
                      <img 
                        src={testimonial.client_image} 
                        alt={testimonial.client_name}
                        className="w-12 h-12 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold ...">{testimonial.client_name}</h3>
                      <div className="text-gray-500 ...">{testimonial.client_location}</div>
                    </div>
                  </div>
                  <div>{[...Array(5)].map((_, i) => (<span key={i} className={`text-${i < testimonial.rating ? 'yellow-500' : 'gray-300'}`}>★</span>))}</div>
                </div>
                {/* Content */} 
                <div className="bg-gray-50 p-4 ... relative"><FaQuoteLeft className="text-gray-200 ..." /><p className="text-gray-700 ...">{testimonial.content}</p></div>
                {/* Footer: Project Type, Date, Actions - Disable buttons while saving */} 
                <div className="flex justify-between items-center mt-4">
                  <div>
                      <span className="px-2 py-1 bg-gray-100 ...">{testimonial.service_type || 'N/A'}</span>
                      <span className="text-gray-500 text-sm ml-2">{formatDate(testimonial.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      {testimonial.status !== 'approved' && 
                        <button onClick={() => handleUpdateStatus(testimonial, 'approved')} className={`p-1 rounded-full bg-green-100 text-green-700 disabled:opacity-50`} title="Approve" disabled={isSaving}><FaCheck /></button>
                      }
                      {testimonial.status !== 'pending' && 
                        <button onClick={() => handleUpdateStatus(testimonial, 'pending')} className={`p-1 rounded-full bg-yellow-100 text-yellow-700 disabled:opacity-50`} title="Set to Pending" disabled={isSaving}><FaTimes /></button>
                      }
                      <button onClick={() => handleToggleFeatured(testimonial)} className="p-1 rounded-full disabled:opacity-50" title={testimonial.display_on_homepage ? 'Displayed on Homepage' : 'Not on Homepage'} disabled={isSaving}>{testimonial.display_on_homepage ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-400" />}</button>
                      <button onClick={() => handleEdit(testimonial)} className="text-blue-600 ... disabled:opacity-50" title="Edit" disabled={isSaving}><FaEdit /></button>
                      <button onClick={() => handleDelete(testimonial.id)} className="text-red-600 ... disabled:opacity-50" title="Delete" disabled={isSaving}><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonial Edit/Add Modal - Update fields, add loading/error */}
      {isModalOpen && selectedTestimonial && (
        <div className="fixed inset-0 ... z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
             {/* Modal Header */} 
            <div className="p-6 border-b"><h2 className="text-2xl font-bold">{selectedTestimonial.id === 0 ? 'Add New Testimonial' : 'Edit Testimonial'}</h2></div>
            {/* Modal Body */} 
            <form onSubmit={(e) => { e.preventDefault(); handleSaveTestimonial(selectedTestimonial); }} className="p-6 overflow-y-auto flex-grow">
              {error && isModalOpen && (<div className="bg-red-100 ... mb-4" role="alert">... {error} ...</div>)}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Client Name, Location, Project Type, Date Inputs - Disable while saving */} 
                   <div><label className="block ...">Client Name</label><input type="text" required className="w-full ... disabled:bg-gray-100" value={selectedTestimonial.client_name} onChange={(e) => setSelectedTestimonial({...selectedTestimonial, client_name: e.target.value})} disabled={isSaving} /></div>
                   <div><label className="block ...">Client Location</label><input type="text" required className="w-full ... disabled:bg-gray-100" value={selectedTestimonial.client_location} onChange={(e) => setSelectedTestimonial({...selectedTestimonial, client_location: e.target.value})} disabled={isSaving} /></div>
                   <div><label className="block ...">Client Title</label><input type="text" className="w-full ..." value={selectedTestimonial.client_title || ''} onChange={(e) => setSelectedTestimonial({...selectedTestimonial, client_title: e.target.value})} disabled={isSaving} /></div>
                   <div><label className="block ...">Client Company</label><input type="text" className="w-full ..." value={selectedTestimonial.client_company || ''} onChange={(e) => setSelectedTestimonial({...selectedTestimonial, client_company: e.target.value})} disabled={isSaving} /></div>
                   <div><label className="block ...">Service Type *</label><input type="text" required list="serviceTypesList" className="w-full ..." value={selectedTestimonial.service_type} onChange={(e) => setSelectedTestimonial({...selectedTestimonial, service_type: e.target.value})} disabled={isSaving} /><datalist id="serviceTypesList">{serviceTypes.map(type => (<option key={type} value={type} />))}</datalist></div>
                   {/* Content Textarea */} 
                  <div className="md:col-span-2"><label className="block ...">Testimonial Content</label><textarea required rows={4} className="w-full ... disabled:bg-gray-100" value={selectedTestimonial.content} onChange={(e) => setSelectedTestimonial({...selectedTestimonial, content: e.target.value})} disabled={isSaving}></textarea></div>
                  {/* Rating */} 
                  <div>
                    <label className="block ...">Rating</label>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                        <button key={rating} type="button" className={`text-2xl focus:outline-none ${isSaving ? 'cursor-not-allowed opacity-50' : ''}`} onClick={() => !isSaving && setSelectedTestimonial({...selectedTestimonial, rating})} disabled={isSaving}>
                            <span className={`${rating <= selectedTestimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                        </button>
                        ))}
                    </div>
                  </div>
                   {/* Status Select */}
                  <div>
                    <label className="block ...">Status *</label>
                    <select required className="w-full ..." value={selectedTestimonial.status} onChange={(e) => setSelectedTestimonial({...selectedTestimonial, status: e.target.value})} disabled={isSaving}>
                         <option value="pending">Pending</option>
                         <option value="approved">Approved</option>
                    </select>
                  </div>
                   {/* Display on Homepage Checkbox */}
                  <div className="flex items-center pt-4 md:pt-6">
                    <label className="flex items-center"><input type="checkbox" className="rounded ..." checked={selectedTestimonial.display_on_homepage} onChange={(e) => setSelectedTestimonial({...selectedTestimonial, display_on_homepage: e.target.checked})} disabled={isSaving} /><span>Display on Homepage</span></label>
                  </div>
                  {/* Client Image Section */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Client Photo</label>
                    <div className="flex items-center mb-3">
                      {selectedTestimonial.client_image ? (
                        <div className="mr-4">
                          <img 
                            src={selectedTestimonial.client_image} 
                            alt={selectedTestimonial.client_name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                          <FaUser className="text-gray-400 text-xl" />
                        </div>
                      )}
                      <div className="flex-1">
                        <FileUpload
                          bucketName="testimonial-images"
                          onUploadComplete={handleImageUpload}
                          acceptedFileTypes="image/*"
                          label="Upload Client Photo"
                        />
                        <div className="mt-2">
                          <label className="block text-xs text-gray-500 mb-1">Or enter image URL directly:</label>
                          <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm disabled:bg-gray-100" 
                            value={selectedTestimonial.client_image || ''} 
                            onChange={(e) => setSelectedTestimonial({...selectedTestimonial, client_image: e.target.value})} 
                            placeholder="https://... or /images/..."
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              {/* Modal Footer */} 
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" className="px-4 py-2 ... disabled:opacity-50" onClick={() => { setIsModalOpen(false); setSelectedTestimonial(null); setError(null); }} disabled={isSaving}>Cancel</button>
                <button type="submit" className="px-4 py-2 ... flex items-center disabled:opacity-50" disabled={isSaving}>{isSaving ? <FaSpinner className="animate-spin mr-2" /> : null} {isSaving ? 'Saving...' : 'Save Testimonial'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TestimonialsManagement; 