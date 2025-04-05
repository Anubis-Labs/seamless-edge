import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSpinner, FaImage, FaSave, FaExchangeAlt } from 'react-icons/fa';
import supabaseService from '../../services/supabaseService';
import { toast } from 'react-toastify';
import FileUpload from '../../components/common/FileUpload';

interface Project {
  id: number;
  title: string;
  description?: string | null;
  client_id?: number | null;
  status?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  total_cost?: number | null;
  service_type?: string | null;
  created_at?: string;
  updated_at?: string;
  before_image?: string | null;
  after_image?: string | null;
  comparison_images?: any[] | null;
}

const GalleryManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [filterServiceType, setFilterServiceType] = useState('');
  
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseService.gallery.getProjects();
      const formattedData = (data || []).map((p: any) => ({
         ...p,
         title: p.title ?? 'Untitled Project',
         service_type: p.service_type ?? 'Unknown',
         end_date: p.end_date,
         before_image: p.before_image || null,
         after_image: p.after_image || null,
         comparison_images: p.comparison_images || []
      }));
      setProjects(formattedData as Project[]);
      
      const uniqueServiceTypes = Array.from(
        new Set(formattedData.map((project: Project) => project.service_type))
      ).filter(st => st);
      setServiceTypes(uniqueServiceTypes as string[]);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      toast.error(`Failed to load projects: ${err.message}`);
      setError(`Failed to load projects: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  const handleAddNew = () => {
    setSelectedProject({
      id: 0,
      title: '',
      description: '',
      service_type: serviceTypes[0] || '',
      end_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      before_image: null,
      after_image: null,
      comparison_images: []
    });
    setIsModalOpen(true);
    setError(null);
  };
  
  const handleEdit = (project: Project) => {
    setSelectedProject({
      ...JSON.parse(JSON.stringify(project)),
      end_date: project.end_date ? project.end_date.split('T')[0] : null
    });
    setIsModalOpen(true);
    setError(null);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?') && !saving) {
      setSaving(true);
      try {
        await supabaseService.gallery.deleteProject(id);
        toast.success('Project deleted successfully!');
        await fetchProjects();
      } catch (err: any) {
        console.error('Error deleting project:', err);
        toast.error(`Error deleting project: ${err.message}`);
        setError(`Failed to delete project: ${err.message}`);
      } finally {
        setSaving(false);
      }
    }
  };
  
  const handleSaveProject = async (projectToSave: Project) => {
    if (saving) return;
    setSaving(true);
    setError(null);

    if (!projectToSave.title || !projectToSave.service_type) {
        toast.error("Please fill in Title and Service Type.");
        setSaving(false);
        return;
    }

    try {
      const { id, created_at, updated_at, ...dataToSave } = projectToSave; 
      
      const payload = {
          title: dataToSave.title,
          description: dataToSave.description,
          service_type: dataToSave.service_type,
          end_date: dataToSave.end_date,
          status: dataToSave.status,
          client_id: dataToSave.client_id,
          start_date: dataToSave.start_date,
          total_cost: dataToSave.total_cost,
          before_image: dataToSave.before_image,
          after_image: dataToSave.after_image,
          comparison_images: dataToSave.comparison_images
      };
      
      Object.keys(payload).forEach(key => payload[key as keyof typeof payload] === undefined && delete payload[key as keyof typeof payload]);

      if (id === 0) {
        await supabaseService.gallery.createProject(payload);
        toast.success(`Project created successfully!`);
      } else {
        await supabaseService.gallery.updateProject(id, payload);
        toast.success(`Project updated successfully!`);
      }
      
      setIsModalOpen(false);
      setSelectedProject(null);
      await fetchProjects();
    } catch (err: any) {
      console.error('Error saving project:', err);
      const errorMessage = `Error saving project: ${err.message}`;
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle image uploads
  const handleBeforeImageUpload = (imageUrl: string) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        before_image: imageUrl
      });
      toast.success('Before image uploaded successfully');
    }
  };

  const handleAfterImageUpload = (imageUrl: string) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        after_image: imageUrl
      });
      toast.success('After image uploaded successfully');
    }
  };
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
        (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesServiceType = filterServiceType === '' || project.service_type === filterServiceType;
    
    return matchesSearch && matchesServiceType;
  });

  return (
    <>
      <Helmet>
        <title>Gallery Management | Seamless Edge Admin</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gallery Management</h1>
        <p className="text-gray-600">Manage your project gallery and showcase your best work.</p>
        {error && !isModalOpen && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
             <strong className="font-bold">Error:</strong>
             <span className="block sm:inline"> {error}</span>
           </div>
        )}
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading || saving}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <select
            className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest disabled:opacity-50"
            value={filterServiceType}
            onChange={(e) => setFilterServiceType(e.target.value)}
            disabled={loading || saving || serviceTypes.length === 0}
          >
            <option value="">All Service Types</option>
            {serviceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleAddNew}
          className="bg-accent-forest text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-accent-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || saving}
        >
          <FaPlus className="mr-2" /> Add New Project
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin h-12 w-12 text-accent-forest" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold text-gray-700">No Projects Found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm || filterServiceType ? 'No projects match your filters.' : 'Start by adding your first project.'}
          </p>
          {(searchTerm || filterServiceType) && (
            <button 
              className="mt-4 text-accent-forest hover:text-accent-forest-dark disabled:opacity-50"
              onClick={() => {
                setSearchTerm('');
                setFilterServiceType('');
              }}
              disabled={loading || saving}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex-1 min-w-[280px] max-w-md">
              {/* Images preview section */}
              <div className="relative h-40 bg-gray-200">
                {project.before_image || project.after_image ? (
                  <div className="flex h-full">
                    {project.before_image && (
                      <div className="flex-1 overflow-hidden">
                        <img 
                          src={project.before_image} 
                          alt={`Before: ${project.title}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">
                          Before
                        </div>
                      </div>
                    )}
                    {project.after_image && (
                      <div className="flex-1 overflow-hidden">
                        <img 
                          src={project.after_image} 
                          alt={`After: ${project.title}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">
                          After
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaImage className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 truncate pr-2">{project.title}</h3>
                  <span className="text-xs bg-accent-forest text-white px-2 py-1 rounded whitespace-nowrap">
                    {project.service_type || 'N/A'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description || 'No description.'}</p>
                <div className="text-gray-500 text-sm mb-4">
                  <div>Completed: {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</div>
                </div>
                
                <div className="flex justify-between pt-2 border-t">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-600 hover:text-blue-800 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={saving}
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-800 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={saving}
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {selectedProject.id === 0 ? 'Add New Project' : 'Edit Project'}
              </h2>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveProject(selectedProject); }} className="p-6 overflow-y-auto flex-grow">
               {error && isModalOpen && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                   <strong className="font-bold">Error:</strong>
                   <span className="block sm:inline"> {error}</span>
                 </div>
               )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Project Title *</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedProject.title} onChange={(e) => setSelectedProject({...selectedProject, title: e.target.value})} disabled={saving}/>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Service Type *</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedProject.service_type || ''} onChange={(e) => setSelectedProject({...selectedProject, service_type: e.target.value})} list="serviceTypesList" disabled={saving}/>
                  <datalist id="serviceTypesList"> {serviceTypes.map(type => (<option key={type} value={type} />))} </datalist>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">End Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedProject.end_date || ''} onChange={(e) => setSelectedProject({...selectedProject, end_date: e.target.value})} disabled={saving}/>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" value={selectedProject.description || ''} onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})} disabled={saving}></textarea>
                </div>
                
                {/* Before Image Upload */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Before Image</label>
                  {selectedProject.before_image ? (
                    <div className="mb-2 relative">
                      <img 
                        src={selectedProject.before_image} 
                        alt="Before" 
                        className="h-40 w-full object-cover rounded"
                      />
                      <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">
                        Before
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 bg-gray-100 rounded mb-2 border border-dashed border-gray-300">
                      <div className="text-center">
                        <FaImage className="mx-auto text-gray-400 text-4xl mb-2" />
                        <span className="text-sm text-gray-500">No before image</span>
                      </div>
                    </div>
                  )}
                  <FileUpload
                    bucketName="gallery-images"
                    onUploadComplete={handleBeforeImageUpload}
                    acceptedFileTypes="image/*"
                    label="Upload Before Image"
                  />
                </div>
                
                {/* After Image Upload */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">After Image</label>
                  {selectedProject.after_image ? (
                    <div className="mb-2 relative">
                      <img 
                        src={selectedProject.after_image} 
                        alt="After" 
                        className="h-40 w-full object-cover rounded"
                      />
                      <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">
                        After
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 bg-gray-100 rounded mb-2 border border-dashed border-gray-300">
                      <div className="text-center">
                        <FaImage className="mx-auto text-gray-400 text-4xl mb-2" />
                        <span className="text-sm text-gray-500">No after image</span>
                      </div>
                    </div>
                  )}
                  <FileUpload
                    bucketName="gallery-images"
                    onUploadComplete={handleAfterImageUpload}
                    acceptedFileTypes="image/*"
                    label="Upload After Image"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50" onClick={() => { setIsModalOpen(false); setSelectedProject(null); setError(null); }} disabled={saving}> Cancel </button>
                <button type="submit" className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest-dark flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={saving}> {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} {saving ? 'Saving...' : 'Save Project'} </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryManagement; 