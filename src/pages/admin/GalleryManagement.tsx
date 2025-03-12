import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar, FaImage, FaSearch } from 'react-icons/fa';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  image_before: string;
  image_after: string;
  additional_images: string[];
  date_completed: string;
  featured: boolean;
  testimonial_id?: number;
}

const GalleryManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  
  // Mock data for development
  useEffect(() => {
    // In real implementation, this would fetch from Supabase
    const mockProjects: Project[] = [
      {
        id: 1,
        title: 'Modern Kitchen Renovation',
        description: 'Complete kitchen remodel with custom cabinets and high-end appliances',
        category: 'Kitchen',
        location: 'Seattle, WA',
        image_before: 'https://placehold.co/600x400?text=Before',
        image_after: 'https://placehold.co/600x400?text=After',
        additional_images: ['https://placehold.co/600x400?text=Detail+1', 'https://placehold.co/600x400?text=Detail+2'],
        date_completed: '2023-10-15',
        featured: true
      },
      {
        id: 2,
        title: 'Bathroom Spa Transformation',
        description: 'Luxury bathroom renovation with custom tiling and walk-in shower',
        category: 'Bathroom',
        location: 'Portland, OR',
        image_before: 'https://placehold.co/600x400?text=Before',
        image_after: 'https://placehold.co/600x400?text=After',
        additional_images: ['https://placehold.co/600x400?text=Detail+1'],
        date_completed: '2023-11-20',
        featured: false
      },
      {
        id: 3,
        title: 'Basement Entertainment Area',
        description: 'Converted unfinished basement into a family entertainment room',
        category: 'Basement',
        location: 'Bellevue, WA',
        image_before: 'https://placehold.co/600x400?text=Before',
        image_after: 'https://placehold.co/600x400?text=After',
        additional_images: [],
        date_completed: '2023-09-05',
        featured: true
      }
    ];
    
    // Load from localStorage or use mock data if not available
    const storedProjects = localStorage.getItem('seamlessedge_projects');
    const projectsData = storedProjects ? JSON.parse(storedProjects) : mockProjects;
    
    setProjects(projectsData);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(projectsData.map((project: Project) => project.category)));
    setCategories(uniqueCategories as string[]);
    
    setLoading(false);
    
    // Store mock data in localStorage for persistence during development
    if (!storedProjects) {
      localStorage.setItem('seamlessedge_projects', JSON.stringify(mockProjects));
    }
  }, []);
  
  const handleAddNew = () => {
    setSelectedProject({
      id: Date.now(),
      title: '',
      description: '',
      category: '',
      location: '',
      image_before: '',
      image_after: '',
      additional_images: [],
      date_completed: new Date().toISOString().split('T')[0],
      featured: false
    });
    setIsModalOpen(true);
  };
  
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
      localStorage.setItem('seamlessedge_projects', JSON.stringify(updatedProjects));
    }
  };
  
  const handleToggleFeatured = (id: number) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, featured: !project.featured } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('seamlessedge_projects', JSON.stringify(updatedProjects));
  };
  
  const handleSaveProject = (project: Project) => {
    let updatedProjects;
    
    if (projects.some(p => p.id === project.id)) {
      // Update existing project
      updatedProjects = projects.map(p => p.id === project.id ? project : p);
    } else {
      // Add new project
      updatedProjects = [...projects, project];
    }
    
    setProjects(updatedProjects);
    localStorage.setItem('seamlessedge_projects', JSON.stringify(updatedProjects));
    setIsModalOpen(false);
    setSelectedProject(null);
  };
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === '' || project.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Gallery Management | Seamless Edge Admin</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gallery Management</h1>
        <p className="text-gray-600">Manage your project gallery and showcase your best work.</p>
      </div>
      
      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <select
            className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleAddNew}
          className="bg-accent-forest text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-accent-forest-dark transition-colors"
        >
          <FaPlus className="mr-2" /> Add New Project
        </button>
      </div>
      
      {/* Projects List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-forest"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <FaImage className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">No Projects Found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm || filterCategory ? 'No projects match your filters.' : 'Start by adding your first project.'}
          </p>
          {(searchTerm || filterCategory) && (
            <button 
              className="mt-4 text-accent-forest hover:text-accent-forest-dark"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <div className="flex h-48">
                  <div className="w-1/2 bg-gray-100">
                    <img 
                      src={project.image_before} 
                      alt={`${project.title} Before`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      Before
                    </div>
                  </div>
                  <div className="w-1/2 bg-gray-100">
                    <img 
                      src={project.image_after} 
                      alt={`${project.title} After`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      After
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggleFeatured(project.id)}
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow"
                >
                  {project.featured ? 
                    <FaStar className="text-yellow-500" /> : 
                    <FaRegStar className="text-gray-400" />
                  }
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                  <span className="text-xs bg-accent-forest text-white px-2 py-1 rounded">
                    {project.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description}</p>
                <div className="text-gray-500 text-sm mb-4">
                  <div>{project.location}</div>
                  <div>Completed: {new Date(project.date_completed).toLocaleDateString()}</div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Project Edit/Add Modal - In a real implementation, this would be a separate component */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-90vh overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {selectedProject.id ? 'Edit Project' : 'Add New Project'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveProject(selectedProject);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Project Title</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedProject.title}
                      onChange={(e) => setSelectedProject({...selectedProject, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Category</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedProject.category}
                      onChange={(e) => setSelectedProject({...selectedProject, category: e.target.value})}
                      list="categories"
                    />
                    <datalist id="categories">
                      {categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedProject.location}
                      onChange={(e) => setSelectedProject({...selectedProject, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Completion Date</label>
                    <input
                      type="date"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedProject.date_completed}
                      onChange={(e) => setSelectedProject({...selectedProject, date_completed: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedProject.description}
                      onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Before Image URL</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedProject.image_before}
                      onChange={(e) => setSelectedProject({...selectedProject, image_before: e.target.value})}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      In a production system, this would be a file upload component.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">After Image URL</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedProject.image_after}
                      onChange={(e) => setSelectedProject({...selectedProject, image_after: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Additional Image URLs</label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedProject.additional_images.join('\n')}
                      onChange={(e) => setSelectedProject({
                        ...selectedProject, 
                        additional_images: e.target.value.split('\n').filter(url => url.trim() !== '')
                      })}
                      placeholder="Enter one URL per line"
                    ></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-accent-forest focus:ring-accent-forest h-5 w-5 mr-2"
                        checked={selectedProject.featured}
                        onChange={(e) => setSelectedProject({...selectedProject, featured: e.target.checked})}
                      />
                      <span>Feature this project</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedProject(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest-dark"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryManagement; 