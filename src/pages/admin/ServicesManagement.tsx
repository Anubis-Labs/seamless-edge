import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar, FaTools, FaSearch, FaSave } from 'react-icons/fa';

interface Service {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  icon: string;
  image: string;
  features: string[];
  price: string;
  featured: boolean;
  order: number;
}

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedService, setDraggedService] = useState<Service | null>(null);
  
  // Mock data for development
  useEffect(() => {
    // In real implementation, this would fetch from Supabase
    const mockServices: Service[] = [
      {
        id: 1,
        name: 'Kitchen Remodeling',
        description: 'Transform your kitchen with our professional remodeling services. We handle everything from custom cabinets to countertops and high-end appliance installation.',
        shortDescription: 'Complete kitchen transformation services',
        category: 'Remodeling',
        icon: 'FaHome',
        image: 'https://placehold.co/800x600?text=Kitchen+Remodeling',
        features: [
          'Custom cabinet design',
          'Countertop installation',
          'Appliance fitting',
          'Lighting design',
          'Flooring installation'
        ],
        price: 'From $15,000',
        featured: true,
        order: 1
      },
      {
        id: 2,
        name: 'Bathroom Renovation',
        description: 'Create your dream bathroom with our complete renovation services. We specialize in luxury fixtures, custom tiling, and modern designs.',
        shortDescription: 'Luxury bathroom upgrades and renovations',
        category: 'Remodeling',
        icon: 'FaShower',
        image: 'https://placehold.co/800x600?text=Bathroom+Renovation',
        features: [
          'Custom shower installation',
          'Bathtub replacement',
          'Vanity design and installation',
          'Tile work',
          'Plumbing upgrades'
        ],
        price: 'From $8,000',
        featured: true,
        order: 2
      },
      {
        id: 3,
        name: 'Deck Construction',
        description: 'Extend your living space outdoors with a custom-built deck. Our decks are built to last with premium materials and expert craftsmanship.',
        shortDescription: 'Custom outdoor deck building services',
        category: 'Outdoor',
        icon: 'FaTree',
        image: 'https://placehold.co/800x600?text=Deck+Construction',
        features: [
          'Custom design',
          'Multiple material options',
          'Built-in seating',
          'Pergolas and shade structures',
          'Lighting integration'
        ],
        price: 'From $7,000',
        featured: false,
        order: 3
      }
    ];
    
    // Load from localStorage or use mock data if not available
    const storedServices = localStorage.getItem('seamlessedge_services');
    const servicesData = storedServices ? JSON.parse(storedServices) : mockServices;
    
    setServices(servicesData);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(servicesData.map((service: Service) => service.category)));
    setCategories(uniqueCategories as string[]);
    
    setLoading(false);
    
    // Store mock data in localStorage for persistence during development
    if (!storedServices) {
      localStorage.setItem('seamlessedge_services', JSON.stringify(mockServices));
    }
  }, []);
  
  const handleAddNew = () => {
    setSelectedService({
      id: Date.now(),
      name: '',
      description: '',
      shortDescription: '',
      category: '',
      icon: '',
      image: '',
      features: [''],
      price: '',
      featured: false,
      order: services.length + 1
    });
    setIsModalOpen(true);
  };
  
  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updatedServices = services.filter(service => service.id !== id);
      // Reorder remaining services
      const reorderedServices = updatedServices.map((service, index) => ({
        ...service,
        order: index + 1
      }));
      setServices(reorderedServices);
      localStorage.setItem('seamlessedge_services', JSON.stringify(reorderedServices));
    }
  };
  
  const handleToggleFeatured = (id: number) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...service, featured: !service.featured } : service
    );
    setServices(updatedServices);
    localStorage.setItem('seamlessedge_services', JSON.stringify(updatedServices));
  };
  
  const handleSaveService = (service: Service) => {
    let updatedServices;
    
    if (services.some(s => s.id === service.id)) {
      // Update existing service
      updatedServices = services.map(s => s.id === service.id ? service : s);
    } else {
      // Add new service
      updatedServices = [...services, service];
    }
    
    // Sort by order
    updatedServices.sort((a, b) => a.order - b.order);
    
    setServices(updatedServices);
    localStorage.setItem('seamlessedge_services', JSON.stringify(updatedServices));
    setIsModalOpen(false);
    setSelectedService(null);
  };
  
  const handleDragStart = (service: Service) => {
    setIsDragging(true);
    setDraggedService(service);
  };
  
  const handleDragOver = (e: React.DragEvent, service: Service) => {
    e.preventDefault();
    if (!draggedService || draggedService.id === service.id) return;
    
    const updatedServices = [...services];
    const draggedIndex = updatedServices.findIndex(s => s.id === draggedService.id);
    const hoverIndex = updatedServices.findIndex(s => s.id === service.id);
    
    // Swap order values
    const tempOrder = updatedServices[draggedIndex].order;
    updatedServices[draggedIndex].order = updatedServices[hoverIndex].order;
    updatedServices[hoverIndex].order = tempOrder;
    
    // Resort by order
    updatedServices.sort((a, b) => a.order - b.order);
    
    setServices(updatedServices);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedService(null);
    localStorage.setItem('seamlessedge_services', JSON.stringify(services));
  };
  
  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === '' || service.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <Helmet>
        <title>Services Management | Seamless Edge Admin</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Services Management</h1>
        <p className="text-gray-600">Manage the services your company offers to clients.</p>
      </div>
      
      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
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
          <FaPlus className="mr-2" /> Add New Service
        </button>
      </div>
      
      {/* Services List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-forest"></div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <FaTools className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">No Services Found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm || filterCategory ? 'No services match your filters.' : 'Start by adding your first service.'}
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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="grid grid-cols-12 font-medium text-gray-500">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">Service Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-3">Short Description</div>
              <div className="col-span-1 text-center">Featured</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>
          
          <div className="divide-y">
            {filteredServices.map((service, index) => (
              <div 
                key={service.id} 
                className={`px-6 py-4 grid grid-cols-12 items-center hover:bg-gray-50 cursor-move ${isDragging && draggedService?.id === service.id ? 'opacity-50 bg-gray-100' : ''}`}
                draggable
                onDragStart={() => handleDragStart(service)}
                onDragOver={(e) => handleDragOver(e, service)}
                onDragEnd={handleDragEnd}
              >
                <div className="col-span-1 text-center text-gray-500">{service.order}</div>
                <div className="col-span-3 font-medium">{service.name}</div>
                <div className="col-span-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">{service.category}</span>
                </div>
                <div className="col-span-3 text-sm text-gray-600 truncate">{service.shortDescription}</div>
                <div className="col-span-1 text-center">
                  <button onClick={() => handleToggleFeatured(service.id)}>
                    {service.featured ? 
                      <FaStar className="text-yellow-500 mx-auto" /> : 
                      <FaRegStar className="text-gray-400 mx-auto" />
                    }
                  </button>
                </div>
                <div className="col-span-2 flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-500">
              <p>Drag and drop services to reorder them. Services are displayed on the website in this order.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Edit/Add Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-90vh overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {selectedService.id ? 'Edit Service' : 'Add New Service'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveService(selectedService);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Service Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedService.name}
                      onChange={(e) => setSelectedService({...selectedService, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Category</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedService.category}
                      onChange={(e) => setSelectedService({...selectedService, category: e.target.value})}
                      list="categories"
                    />
                    <datalist id="categories">
                      {categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Price</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedService.price}
                      onChange={(e) => setSelectedService({...selectedService, price: e.target.value})}
                      placeholder="From $X,XXX"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Short Description</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedService.shortDescription}
                      onChange={(e) => setSelectedService({...selectedService, shortDescription: e.target.value})}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Brief description for service cards (max 100 characters)
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Full Description</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedService.description}
                      onChange={(e) => setSelectedService({...selectedService, description: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Icon Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedService.icon}
                      onChange={(e) => setSelectedService({...selectedService, icon: e.target.value})}
                      placeholder="FaHome, FaTools, etc."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      React Icons name (e.g., FaHome, FaTools)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Image URL</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedService.image}
                      onChange={(e) => setSelectedService({...selectedService, image: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      In a production system, this would be a file upload component.
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Features</label>
                    <div className="space-y-2">
                      {selectedService.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-lg p-2"
                            value={feature}
                            onChange={(e) => {
                              const updatedFeatures = [...selectedService.features];
                              updatedFeatures[index] = e.target.value;
                              setSelectedService({...selectedService, features: updatedFeatures});
                            }}
                            placeholder={`Feature ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              const updatedFeatures = selectedService.features.filter((_, i) => i !== index);
                              setSelectedService({...selectedService, features: updatedFeatures});
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-accent-forest hover:text-accent-forest-dark text-sm"
                        onClick={() => {
                          setSelectedService({
                            ...selectedService, 
                            features: [...selectedService.features, '']
                          });
                        }}
                      >
                        + Add Feature
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Display Order</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedService.order}
                      onChange={(e) => setSelectedService({
                        ...selectedService, 
                        order: parseInt(e.target.value) || selectedService.order
                      })}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-accent-forest focus:ring-accent-forest h-5 w-5 mr-2"
                        checked={selectedService.featured}
                        onChange={(e) => setSelectedService({...selectedService, featured: e.target.checked})}
                      />
                      <span>Feature this service</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedService(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest-dark flex items-center"
                  >
                    <FaSave className="mr-2" /> Save Service
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

export default ServicesManagement; 