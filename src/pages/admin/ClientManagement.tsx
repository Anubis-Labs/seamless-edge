import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaSpinner, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabaseService from '../../services/supabaseService';

// Interface for Client data (based on admin-setup.md)
interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  notes?: string | null;
  status?: string | null; // e.g., 'Lead', 'Active', 'Inactive'
  created_at?: string;
  last_interaction?: string | null;
}

// Interface for the form data
interface ClientFormData extends Omit<Client, 'id' | 'created_at' | 'last_interaction'> {
    id?: number | null; // ID is optional for new clients
}

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // Filter by status
  
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientFormData | null>(null);
  const [isNewClient, setIsNewClient] = useState(false);

  // Fetch clients
  const fetchClients = useCallback(async (filters: Record<string, any> = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await supabaseService.clients.getClients(filters);
      setClients(data || []);
    } catch (err: any) {
      console.error("Error fetching clients:", err);
      setError('Failed to load clients.');
      toast.error('Failed to load clients.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients({ search: searchTerm, status: filterStatus });
  }, [fetchClients, searchTerm, filterStatus]); // Refetch when filters change

  // Open modal for adding a new client
  const handleAddNew = () => {
    setEditingClient({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        notes: '',
        status: 'Lead', // Default status
    });
    setIsNewClient(true);
    setShowModal(true);
    setError(null); // Clear previous modal errors
  };

  // Open modal for editing an existing client
  const handleEdit = (client: Client) => {
    setEditingClient({ ...client }); // Populate form with client data
    setIsNewClient(false);
    setShowModal(true);
    setError(null); // Clear previous modal errors
  };

   // Handle input changes in the modal form
   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
     const { name, value } = e.target;
     if (editingClient) {
       setEditingClient(prev => prev ? { ...prev, [name]: value } : null);
     }
   };

  // Save new or updated client
  const handleSaveClient = async () => {
    if (!editingClient) return;

    setIsSaving(true);
    setError(null);

    // Basic validation
    if (!editingClient.first_name || !editingClient.last_name || !editingClient.email) {
        toast.error("Please fill in First Name, Last Name, and Email.");
        setIsSaving(false);
        return;
    }

    try {
        const { id, ...clientData } = editingClient; // Separate ID from other data

        if (isNewClient) {
            await supabaseService.clients.createClient(clientData);
            toast.success('Client created successfully!');
        } else if (id) {
            await supabaseService.clients.updateClient(id, clientData);
            toast.success('Client updated successfully!');
        }
        setShowModal(false);
        setEditingClient(null);
        await fetchClients({ search: searchTerm, status: filterStatus }); // Refetch with current filters
    } catch (err: any) {
        console.error("Error saving client:", err);
        toast.error(`Failed to save client: ${err.message}`);
        setError(`Failed to save: ${err.message}`); // Show error in modal
    } finally {
        setIsSaving(false);
    }
  };

  // Delete client
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete client "${name}"? This action cannot be undone.`)) return;
    
    // Note: Use a different loading state if needed to avoid blocking UI during delete
    setIsLoading(true); 
    try {
      await supabaseService.clients.deleteClient(id);
      toast.success('Client deleted successfully!');
      await fetchClients({ search: searchTerm, status: filterStatus }); // Refetch with current filters
    } catch (err: any) {
      console.error("Error deleting client:", err);
      toast.error(`Failed to delete client: ${err.message}`);
      setError(`Failed to delete client: ${err.message}`); // Show error on main page
    } finally {
      setIsLoading(false);
    }
  };

  // Simple date formatting
  const formatDate = (dateString?: string | null) => {
      if (!dateString) return 'N/A';
      try { return new Date(dateString).toLocaleDateString(); } catch { return 'Invalid Date'; }
  }

  // Possible client statuses (could be fetched or configured elsewhere)
  const clientStatuses = ['Lead', 'Active', 'Inactive', 'Prospect'];

  return (
    <>
      <Helmet><title>Client Management | Admin</title></Helmet>

      {/* Header */} 
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold font-heading text-accent-navy mb-2">Client Management</h1>
            <p className="text-gray-600">Manage your client database and interactions.</p>
        </div>
         <button onClick={handleAddNew} className="mt-4 md:mt-0 bg-accent-forest text-white px-4 py-2 rounded-lg hover:bg-accent-forest-dark transition-colors flex items-center disabled:opacity-50" disabled={isLoading || isSaving}>
           <FaPlus className="mr-2" /> Add New Client
         </button>
      </div>
      {error && !showModal && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>)}

      {/* Filters */} 
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow min-w-[200px]">
            <input type="text" placeholder="Search name, email..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:opacity-50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isLoading}/>
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative min-w-[150px]">
             <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:opacity-50" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} disabled={isLoading}>
                <option value="">All Statuses</option>
                {clientStatuses.map(status => <option key={status} value={status}>{status}</option>)}
             </select>
          </div>
           <button onClick={() => { setSearchTerm(''); setFilterStatus(''); }} className="text-sm text-gray-600 hover:text-accent-navy disabled:opacity-50" disabled={isLoading}>Clear Filters</button>
      </div>

      {/* Client List Table */} 
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        {isLoading ? (
            <div className="py-12 text-center text-gray-500 flex items-center justify-center"><FaSpinner className="animate-spin h-8 w-8 mr-3" />Loading clients...</div>
        ) : clients.length === 0 ? (
            <div className="py-12 text-center text-gray-500"><FaUser className="mx-auto text-4xl text-gray-300 mb-2"/>No clients found.</div>
        ) : (
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Contact</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Created</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {clients.map(client => (
                        <tr key={client.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{client.first_name} {client.last_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div><FaEnvelope className="inline mr-1"/> {client.email}</div>
                                {client.phone && <div><FaPhone className="inline mr-1"/> {client.phone}</div>}
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {client.city}{client.city && client.state ? ', ' : ''}{client.state}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'Active' ? 'bg-green-100 text-green-800' : client.status === 'Lead' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {client.status || 'N/A'}
                                </span>
                             </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(client.created_at)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleEdit(client)} className="text-indigo-600 hover:text-indigo-900 mr-3 disabled:opacity-50" disabled={isSaving}><FaEdit/></button>
                                <button onClick={() => handleDelete(client.id, `${client.first_name} ${client.last_name}`)} className="text-red-600 hover:text-red-900 disabled:opacity-50" disabled={isSaving}><FaTrash/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>

      {/* Add/Edit Client Modal */}
      {showModal && editingClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Modal Header */} 
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">{isNewClient ? 'Add New Client' : 'Edit Client'}</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                 {/* Modal Form */} 
                 <form onSubmit={(e) => { e.preventDefault(); handleSaveClient(); }} className="p-6 overflow-y-auto flex-grow">
                    {error && showModal && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>)}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        {/* Form Fields */} 
                        <div><label className="block text-sm font-medium text-gray-700">First Name*</label><input type="text" name="first_name" value={editingClient.first_name} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required disabled={isSaving} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Last Name*</label><input type="text" name="last_name" value={editingClient.last_name} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required disabled={isSaving} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Email*</label><input type="email" name="email" value={editingClient.email} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required disabled={isSaving} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Phone</label><input type="tel" name="phone" value={editingClient.phone} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" disabled={isSaving} /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Address</label><input type="text" name="address" value={editingClient.address || ''} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" disabled={isSaving} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">City</label><input type="text" name="city" value={editingClient.city || ''} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" disabled={isSaving} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">State</label><input type="text" name="state" value={editingClient.state || ''} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" disabled={isSaving} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">ZIP Code</label><input type="text" name="zip" value={editingClient.zip || ''} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" disabled={isSaving} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Status</label><select name="status" value={editingClient.status || ''} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" disabled={isSaving}><option value="">Select Status</option>{clientStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Notes</label><textarea name="notes" rows={3} value={editingClient.notes || ''} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" disabled={isSaving}></textarea></div>
                    </div>
                     {/* Modal Footer */} 
                    <div className="pt-6 border-t flex justify-end gap-3">
                         <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled={isSaving}>Cancel</button>
                         <button type="submit" className="px-4 py-2 bg-accent-forest text-white rounded-md hover:bg-accent-forest-dark flex items-center disabled:opacity-50" disabled={isSaving}>
                             {isSaving ? <FaSpinner className="animate-spin mr-2"/> : null}
                             {isNewClient ? 'Create Client' : 'Save Changes'}
                         </button>
                    </div>
                </form>
             </div>
          </div>
      )}
    </>
  );
};

export default ClientManagement; 