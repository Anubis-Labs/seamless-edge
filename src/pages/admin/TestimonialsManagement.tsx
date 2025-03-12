import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar, FaQuoteLeft, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';

interface Testimonial {
  id: number;
  client_name: string;
  client_location: string;
  project_type: string;
  content: string;
  rating: number;
  date: string;
  featured: boolean;
  approved: boolean;
}

const TestimonialsManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [filterProjectType, setFilterProjectType] = useState('');
  const [filterApproved, setFilterApproved] = useState<boolean | null>(null);
  
  // Mock data for development
  useEffect(() => {
    // In real implementation, this would fetch from Supabase
    const mockTestimonials: Testimonial[] = [
      {
        id: 1,
        client_name: 'John Smith',
        client_location: 'Seattle, WA',
        project_type: 'Kitchen Remodel',
        content: 'Seamless Edge did an outstanding job on our kitchen remodel. The attention to detail was impressive, and they completed the project on schedule. Our new kitchen is exactly what we envisioned!',
        rating: 5,
        date: '2023-12-10',
        featured: true,
        approved: true
      },
      {
        id: 2,
        client_name: 'Sarah Johnson',
        client_location: 'Portland, OR',
        project_type: 'Bathroom Renovation',
        content: 'We hired Seamless Edge for our bathroom renovation and couldn\'t be happier with the results. The team was professional, clean, and the quality of work exceeded our expectations.',
        rating: 5,
        date: '2023-11-15',
        featured: true,
        approved: true
      },
      {
        id: 3,
        client_name: 'Michael Chen',
        client_location: 'Bellevue, WA',
        project_type: 'Deck Construction',
        content: 'Our new deck is beautiful! The Seamless Edge team provided great suggestions during the design phase and executed the project flawlessly. We\'ve received many compliments from our neighbors.',
        rating: 4,
        date: '2023-10-22',
        featured: false,
        approved: true
      },
      {
        id: 4,
        client_name: 'Emily Davis',
        client_location: 'Tacoma, WA',
        project_type: 'Full Home Renovation',
        content: 'Working with Seamless Edge on our home renovation was a great experience. They guided us through the entire process and helped us stay within budget while still achieving the look we wanted.',
        rating: 5,
        date: '2023-09-05',
        featured: false,
        approved: true
      },
      {
        id: 5,
        client_name: 'Robert Wilson',
        client_location: 'Vancouver, WA',
        project_type: 'Basement Finishing',
        content: 'Seamless Edge transformed our unfinished basement into an amazing entertainment space. They worked efficiently and the quality of their work is outstanding.',
        rating: 4,
        date: '2023-08-18',
        featured: false,
        approved: false
      }
    ];
    
    // Load from localStorage or use mock data if not available
    const storedTestimonials = localStorage.getItem('seamlessedge_testimonials');
    const testimonialsData = storedTestimonials ? JSON.parse(storedTestimonials) : mockTestimonials;
    
    setTestimonials(testimonialsData);
    
    // Extract unique project types
    const uniqueProjectTypes = Array.from(new Set(testimonialsData.map((testimonial: Testimonial) => testimonial.project_type)));
    setProjectTypes(uniqueProjectTypes as string[]);
    
    setLoading(false);
    
    // Store mock data in localStorage for persistence during development
    if (!storedTestimonials) {
      localStorage.setItem('seamlessedge_testimonials', JSON.stringify(mockTestimonials));
    }
  }, []);
  
  const handleAddNew = () => {
    setSelectedTestimonial({
      id: Date.now(),
      client_name: '',
      client_location: '',
      project_type: '',
      content: '',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      featured: false,
      approved: false
    });
    setIsModalOpen(true);
  };
  
  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
      setTestimonials(updatedTestimonials);
      localStorage.setItem('seamlessedge_testimonials', JSON.stringify(updatedTestimonials));
    }
  };
  
  const handleToggleFeatured = (id: number) => {
    const updatedTestimonials = testimonials.map(testimonial => 
      testimonial.id === id ? { ...testimonial, featured: !testimonial.featured } : testimonial
    );
    setTestimonials(updatedTestimonials);
    localStorage.setItem('seamlessedge_testimonials', JSON.stringify(updatedTestimonials));
  };
  
  const handleToggleApproved = (id: number) => {
    const updatedTestimonials = testimonials.map(testimonial => 
      testimonial.id === id ? { ...testimonial, approved: !testimonial.approved } : testimonial
    );
    setTestimonials(updatedTestimonials);
    localStorage.setItem('seamlessedge_testimonials', JSON.stringify(updatedTestimonials));
  };
  
  const handleSaveTestimonial = (testimonial: Testimonial) => {
    let updatedTestimonials;
    
    if (testimonials.some(t => t.id === testimonial.id)) {
      // Update existing testimonial
      updatedTestimonials = testimonials.map(t => t.id === testimonial.id ? testimonial : t);
    } else {
      // Add new testimonial
      updatedTestimonials = [...testimonials, testimonial];
    }
    
    setTestimonials(updatedTestimonials);
    localStorage.setItem('seamlessedge_testimonials', JSON.stringify(updatedTestimonials));
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };
  
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.client_location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProjectType = filterProjectType === '' || testimonial.project_type === filterProjectType;
    
    const matchesApproved = filterApproved === null || testimonial.approved === filterApproved;
    
    return matchesSearch && matchesProjectType && matchesApproved;
  });

  return (
    <>
      <Helmet>
        <title>Testimonials Management | Seamless Edge Admin</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Testimonials Management</h1>
        <p className="text-gray-600">Manage client testimonials and reviews for your business.</p>
      </div>
      
      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search testimonials..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <select
            className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest"
            value={filterProjectType}
            onChange={(e) => setFilterProjectType(e.target.value)}
          >
            <option value="">All Project Types</option>
            {projectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest"
            value={filterApproved === null ? '' : filterApproved ? 'approved' : 'pending'}
            onChange={(e) => {
              if (e.target.value === '') setFilterApproved(null);
              else if (e.target.value === 'approved') setFilterApproved(true);
              else setFilterApproved(false);
            }}
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>
        
        <button
          onClick={handleAddNew}
          className="bg-accent-forest text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-accent-forest-dark transition-colors"
        >
          <FaPlus className="mr-2" /> Add New Testimonial
        </button>
      </div>
      
      {/* Testimonials List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-forest"></div>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <FaQuoteLeft className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">No Testimonials Found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm || filterProjectType || filterApproved !== null ? 'No testimonials match your filters.' : 'Start by adding your first testimonial.'}
          </p>
          {(searchTerm || filterProjectType || filterApproved !== null) && (
            <button 
              className="mt-4 text-accent-forest hover:text-accent-forest-dark"
              onClick={() => {
                setSearchTerm('');
                setFilterProjectType('');
                setFilterApproved(null);
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map(testimonial => (
            <div 
              key={testimonial.id} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${!testimonial.approved ? 'border-l-4 border-yellow-400' : ''}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{testimonial.client_name}</h3>
                    <div className="text-gray-500 text-sm">{testimonial.client_location}</div>
                  </div>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-${i < testimonial.rating ? 'yellow-500' : 'gray-300'}`}>★</span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4 relative">
                  <FaQuoteLeft className="text-gray-200 text-xl absolute top-2 left-2" />
                  <p className="text-gray-700 italic pl-6 pr-2">{testimonial.content}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">{testimonial.project_type}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(testimonial.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleApproved(testimonial.id)}
                      className={`p-1 rounded-full ${testimonial.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      title={testimonial.approved ? 'Approved' : 'Pending Approval'}
                    >
                      {testimonial.approved ? <FaCheck /> : <FaTimes />}
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(testimonial.id)}
                      className="p-1 rounded-full"
                      title={testimonial.featured ? 'Featured' : 'Not Featured'}
                    >
                      {testimonial.featured ? 
                        <FaStar className="text-yellow-500" /> : 
                        <FaRegStar className="text-gray-400" />
                      }
                    </button>
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Testimonial Edit/Add Modal */}
      {isModalOpen && selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {selectedTestimonial.id ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveTestimonial(selectedTestimonial);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Client Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedTestimonial.client_name}
                      onChange={(e) => setSelectedTestimonial({...selectedTestimonial, client_name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Client Location</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedTestimonial.client_location}
                      onChange={(e) => setSelectedTestimonial({...selectedTestimonial, client_location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Project Type</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedTestimonial.project_type}
                      onChange={(e) => setSelectedTestimonial({...selectedTestimonial, project_type: e.target.value})}
                      list="projectTypes"
                    />
                    <datalist id="projectTypes">
                      {projectTypes.map(type => (
                        <option key={type} value={type} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Date</label>
                    <input
                      type="date"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedTestimonial.date}
                      onChange={(e) => setSelectedTestimonial({...selectedTestimonial, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Testimonial Content</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={selectedTestimonial.content}
                      onChange={(e) => setSelectedTestimonial({...selectedTestimonial, content: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Rating</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="text-2xl focus:outline-none"
                          onClick={() => setSelectedTestimonial({...selectedTestimonial, rating})}
                        >
                          <span className={`${rating <= selectedTestimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-accent-forest focus:ring-accent-forest h-5 w-5 mr-2"
                        checked={selectedTestimonial.featured}
                        onChange={(e) => setSelectedTestimonial({...selectedTestimonial, featured: e.target.checked})}
                      />
                      <span>Feature this testimonial</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-accent-forest focus:ring-accent-forest h-5 w-5 mr-2"
                        checked={selectedTestimonial.approved}
                        onChange={(e) => setSelectedTestimonial({...selectedTestimonial, approved: e.target.checked})}
                      />
                      <span>Approved</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedTestimonial(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest-dark"
                  >
                    Save Testimonial
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

export default TestimonialsManagement; 