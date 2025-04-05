import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '../../lib/supabaseClient';
import { 
  FaDatabase, 
  FaTable, 
  FaList, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaSearch,
  FaArrowLeft,
  FaDownload,
  FaChevronRight,
  FaChevronDown
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface DatabaseTable {
  schema_name: string;
  table_name: string;
  table_type?: string;
}

interface Column {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default?: string;
}

interface Record {
  [key: string]: any;
}

const DatabaseExplorer: React.FC = () => {
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [editedRecord, setEditedRecord] = useState<Record>({});
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Fetch all tables from the database
  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use SQL query instead of direct table access since information_schema is a special schema
        const { data, error } = await supabase.rpc('get_tables', {});
        
        if (error) {
          // Fall back to manually getting tables from public schema
          try {
            // Get all tables from public schema directly
            const { data: tables, error: tablesError } = await supabase
              .from('_tables')
              .select('*');
              
            if (tablesError) {
              // Final fallback - just get tables we know exist
              const knownTables = [
                'gallery',
                'testimonials',
                'blog',
                'services',
                'messages',
                'users',
                'bookings',
                'jobs',
                'applications'
              ];
              
              setTables(knownTables.map(tableName => ({
                schema_name: 'public',
                table_name: tableName
              })));
              return;
            }
            
            setTables(tables.map((table: any) => ({
              schema_name: 'public',
              table_name: table.name
            })));
          } catch (fallbackErr) {
            throw error; // If fallback fails, throw original error
          }
        } else {
          setTables(data.map((table: any) => ({
            schema_name: 'public',
            table_name: table.table_name
          })));
        }
      } catch (err: any) {
        console.error('Error fetching tables:', err);
        setError(`Failed to fetch database tables: ${err.message}`);
        toast.error('Failed to load database tables');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTables();
  }, []);
  
  // Fetch table columns when a table is selected
  useEffect(() => {
    if (!selectedTable) return;
    
    const fetchTableStructure = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to query for column info using an RPC function
        const { data, error } = await supabase.rpc('get_column_info', {
          target_table: selectedTable
        });
        
        if (error) {
          // If RPC fails, fallback to direct table query to infer columns
          const { data: sampleData, error: sampleError } = await supabase
            .from(selectedTable)
            .select('*')
            .limit(1);
            
          if (sampleError) throw sampleError;
          
          if (sampleData && sampleData.length > 0) {
            // Extract column names from the first record
            const columnNames = Object.keys(sampleData[0]);
            
            // Create column objects with basic info
            const inferredColumns = columnNames.map(name => ({
              table_name: selectedTable,
              column_name: name,
              data_type: typeof sampleData[0][name] === 'number' ? 'integer' : 
                       typeof sampleData[0][name] === 'boolean' ? 'boolean' : 'text',
              is_nullable: 'YES' // Assume nullable by default
            }));
            
            setColumns(inferredColumns);
          } else {
            // If no data, create a minimal column set with just 'id'
            setColumns([{
              table_name: selectedTable,
              column_name: 'id',
              data_type: 'integer',
              is_nullable: 'NO'
            }]);
          }
        } else {
          setColumns(data || []);
        }
        
        setCurrentPage(1); // Reset pagination when table changes
      } catch (err: any) {
        console.error(`Error fetching structure for table ${selectedTable}:`, err);
        setError(`Failed to fetch table structure: ${err.message}`);
        toast.error('Failed to load table structure');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTableStructure();
  }, [selectedTable]);
  
  // Fetch records when table, page, or search changes
  useEffect(() => {
    if (!selectedTable || columns.length === 0) return;
    
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Start building the query
        let query = supabase.from(selectedTable).select('*', { count: 'exact' });
        
        // Apply search filter if provided
        if (searchQuery) {
          const searchableColumns = columns
            .filter(col => ['text', 'varchar', 'char', 'name'].includes(col.data_type))
            .map(col => col.column_name);
          
          if (searchableColumns.length > 0) {
            const searchConditions = searchableColumns.map(
              col => `${col}.ilike.%${searchQuery}%`
            ).join(',');
            
            query = query.or(searchConditions);
          }
        }
        
        // Apply pagination
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;
        
        // Execute query with pagination
        let result;
        try {
          result = await query
            .range(from, to)
            .order('id', { ascending: false });
        } catch (orderError) {
          // If ordering by id fails, try without ordering
          console.warn('Order by id failed, trying without ordering', orderError);
          result = await query.range(from, to);
        }
        
        const { data, error, count } = result;
        
        if (error) throw error;
        
        setRecords(data || []);
        setTotalRecords(count || 0);
      } catch (err: any) {
        console.error(`Error fetching records from ${selectedTable}:`, err);
        setError(`Failed to fetch records: ${err.message}`);
        toast.error('Failed to load records');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecords();
  }, [selectedTable, currentPage, pageSize, searchQuery, columns]);
  
  // Handle table selection
  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setSelectedRecord(null);
    setIsCreatingNew(false);
    setEditedRecord({});
    setSearchQuery('');
  };
  
  // Handle record selection for editing
  const handleEditRecord = (record: Record) => {
    setSelectedRecord(record);
    setEditedRecord({ ...record });
    setIsCreatingNew(false);
  };
  
  // Handle creating a new record
  const handleCreateNewRecord = () => {
    setSelectedRecord(null);
    // Initialize with default values based on columns
    const newRecord: Record = {};
    columns.forEach(col => {
      if (col.column_default) {
        // Try to parse the default value if it's a function call (like nextval)
        if (col.column_default.includes('nextval')) {
          // For sequences, leave blank as they'll be auto-assigned
          newRecord[col.column_name] = '';
        } else {
          // For static defaults, use the value
          newRecord[col.column_name] = col.column_default.replace(/'/g, '');
        }
      } else if (col.data_type === 'boolean') {
        newRecord[col.column_name] = false;
      } else if (col.data_type.includes('timestamp')) {
        newRecord[col.column_name] = new Date().toISOString();
      } else if (col.data_type === 'jsonb') {
        newRecord[col.column_name] = '[]';
      } else {
        newRecord[col.column_name] = '';
      }
    });
    
    setEditedRecord(newRecord);
    setIsCreatingNew(true);
  };
  
  // Handle field changes in the edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditedRecord(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numValue = value === '' ? null : Number(value);
      setEditedRecord(prev => ({ ...prev, [name]: numValue }));
    } else {
      setEditedRecord(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle saving a record (create or update)
  const handleSaveRecord = async () => {
    if (!selectedTable) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // For JSON/JSONB fields, parse strings to objects
      const dataToSubmit = { ...editedRecord };
      
      // Find JSON/JSONB columns
      const jsonColumns = columns.filter(col => 
        col.data_type === 'json' || col.data_type === 'jsonb'
      ).map(col => col.column_name);
      
      // Parse JSON strings to objects
      jsonColumns.forEach(colName => {
        if (typeof dataToSubmit[colName] === 'string') {
          try {
            dataToSubmit[colName] = JSON.parse(dataToSubmit[colName]);
          } catch (e) {
            // If parsing fails, leave as is (may cause validation error)
            console.warn(`Failed to parse JSON for column ${colName}:`, e);
          }
        }
      });
      
      // Remove empty strings for nullable fields
      Object.keys(dataToSubmit).forEach(key => {
        const column = columns.find(col => col.column_name === key);
        if (column?.is_nullable === 'YES' && dataToSubmit[key] === '') {
          dataToSubmit[key] = null;
        }
      });
      
      if (isCreatingNew) {
        // Create new record
        const { data, error } = await supabase
          .from(selectedTable)
          .insert(dataToSubmit)
          .select();
        
        if (error) throw error;
        
        toast.success('Record created successfully!');
        
        // Update state with new record
        if (data && data.length > 0) {
          setRecords(prevRecords => [data[0], ...prevRecords]);
          setTotalRecords(prev => prev + 1);
        }
      } else if (selectedRecord) {
        // Update existing record
        // Find the primary key (assuming 'id')
        const primaryKeyName = 'id'; // This should be improved to find the actual PK
        const primaryKeyValue = selectedRecord[primaryKeyName];
        
        const { data, error } = await supabase
          .from(selectedTable)
          .update(dataToSubmit)
          .eq(primaryKeyName, primaryKeyValue)
          .select();
        
        if (error) throw error;
        
        toast.success('Record updated successfully!');
        
        // Update state with edited record
        if (data && data.length > 0) {
          setRecords(prevRecords => 
            prevRecords.map(record => 
              record[primaryKeyName] === primaryKeyValue ? data[0] : record
            )
          );
        }
      }
      
      // Reset state
      setSelectedRecord(null);
      setIsCreatingNew(false);
      setEditedRecord({});
    } catch (err: any) {
      console.error('Error saving record:', err);
      setError(`Failed to save record: ${err.message}`);
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle cancelling edit/create
  const handleCancelEdit = () => {
    setSelectedRecord(null);
    setIsCreatingNew(false);
    setEditedRecord({});
  };
  
  // Handle deleting a record
  const handleDeleteRecord = async (record: Record) => {
    if (!selectedTable) return;
    
    // Simple confirmation
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Find the primary key (assuming 'id')
      const primaryKeyName = 'id'; // This should be improved to find the actual PK
      const primaryKeyValue = record[primaryKeyName];
      
      const { error } = await supabase
        .from(selectedTable)
        .delete()
        .eq(primaryKeyName, primaryKeyValue);
      
      if (error) throw error;
      
      // Update state
      setRecords(prevRecords => 
        prevRecords.filter(r => r[primaryKeyName] !== primaryKeyValue)
      );
      setTotalRecords(prev => prev - 1);
      
      toast.success('Record deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting record:', err);
      toast.error(`Failed to delete record: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle exporting table data
  const handleExportTable = async () => {
    if (!selectedTable) return;
    
    setIsLoading(true);
    
    try {
      // Fetch all records from the table
      const { data, error } = await supabase
        .from(selectedTable)
        .select('*');
      
      if (error) throw error;
      
      // Convert to JSON string
      const jsonStr = JSON.stringify(data, null, 2);
      
      // Create a download link
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTable}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success(`Exported ${data.length} records from ${selectedTable}`);
    } catch (err: any) {
      console.error('Error exporting table:', err);
      toast.error(`Failed to export: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / pageSize);
  
  // Get a formatted display value for a field based on its type
  const getDisplayValue = (value: any, columnName: string) => {
    if (value === null || value === undefined) return 'NULL';
    
    const column = columns.find(col => col.column_name === columnName);
    
    if (!column) return String(value);
    
    if (column.data_type === 'json' || column.data_type === 'jsonb') {
      return typeof value === 'object' ? JSON.stringify(value) : value;
    } else if (column.data_type.includes('timestamp')) {
      return value ? new Date(value).toLocaleString() : '';
    } else if (column.data_type === 'boolean') {
      return value ? 'Yes' : 'No';
    } else if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return String(value);
  };
  
  // Render field editor based on column type
  const renderFieldEditor = (columnName: string, value: any) => {
    const column = columns.find(col => col.column_name === columnName);
    
    if (!column) return null;
    
    // Common props for all inputs
    const commonProps = {
      id: columnName,
      name: columnName,
      value: value === null ? '' : value,
      onChange: handleInputChange,
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100",
      disabled: isSaving,
    };
    
    if (column.data_type === 'boolean') {
      return (
        <select
          {...commonProps}
          value={value === null ? '' : String(value)}
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    } else if (column.data_type === 'json' || column.data_type === 'jsonb') {
      // JSON editor (simple textarea for now)
      return (
        <textarea
          {...commonProps}
          value={typeof value === 'object' ? JSON.stringify(value, null, 2) : (value || '')}
          rows={5}
        />
      );
    } else if (column.data_type.includes('timestamp')) {
      // Date/time editor
      return (
        <input
          type="datetime-local"
          {...commonProps}
          value={value ? new Date(value).toISOString().slice(0, 16) : ''}
        />
      );
    } else if (column.data_type === 'integer' || column.data_type === 'bigint' || column.data_type === 'numeric') {
      // Number editor
      return (
        <input
          type="number"
          {...commonProps}
          step={column.data_type === 'numeric' ? '0.01' : '1'}
        />
      );
    } else if (column.data_type === 'text' && column.column_name.includes('content')) {
      // Larger text area for content fields
      return (
        <textarea
          {...commonProps}
          rows={8}
        />
      );
    } else {
      // Default text input for all other types
      return (
        <input
          type="text"
          {...commonProps}
        />
      );
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Database Explorer | Seamless Edge Admin</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Database Explorer</h1>
        <p className="text-gray-600">View and manage data in your Supabase database tables.</p>
        {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">{error}</div>}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaDatabase className="mr-2 text-accent-forest" /> Database Tables
            </h2>
            
            {isLoading && !selectedTable ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-2xl text-accent-forest" />
              </div>
            ) : (
              <div className="space-y-1">
                {tables.map((table) => (
                  <button
                    key={table.table_name}
                    onClick={() => handleTableSelect(table.table_name)}
                    className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                      selectedTable === table.table_name
                        ? 'bg-accent-forest text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaTable className="mr-2" /> {table.table_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {!selectedTable ? (
            // No table selected - show welcome screen
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaDatabase className="mx-auto text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Database Explorer</h2>
              <p className="text-gray-600 mb-6">Select a table from the list to view and manage its data.</p>
            </div>
          ) : (
            <>
              {/* Table Viewer/Editor */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Table Header with controls */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <FaTable className="mr-2 text-accent-forest" /> {selectedTable}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {totalRecords} record{totalRecords !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleCreateNewRecord}
                        className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest-dark transition-colors flex items-center disabled:opacity-50"
                        disabled={isLoading || isSaving}
                      >
                        <FaPlus className="mr-2" /> New Record
                      </button>
                      
                      <button
                        onClick={handleExportTable}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                        disabled={isLoading || isSaving}
                      >
                        <FaDownload className="mr-2" /> Export
                      </button>
                    </div>
                  </div>
                  
                  {/* Search & Pagination Controls */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="w-full sm:w-auto relative">
                      <input
                        type="text"
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100"
                        disabled={isLoading}
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages || 1}
                      </span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                        disabled={isLoading}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      
                      <div className="flex items-center">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1 || isLoading}
                          className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50"
                        >
                          &lt;
                        </button>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage >= totalPages || isLoading}
                          className="px-2 py-1 rounded border border-gray-300 ml-1 disabled:opacity-50"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Record Viewer - Only show when not editing/creating */}
                {!selectedRecord && !isCreatingNew && (
                  <div className="overflow-x-auto">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-16">
                        <FaSpinner className="animate-spin text-3xl text-accent-forest" />
                      </div>
                    ) : records.length === 0 ? (
                      <div className="text-center py-16">
                        <FaList className="mx-auto text-5xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-600">No records found</h3>
                        <p className="text-gray-500 mt-2">
                          {searchQuery ? 'Try a different search query or' : 'Start by'} adding a new record.
                        </p>
                        <button
                          onClick={handleCreateNewRecord}
                          className="mt-4 px-4 py-2 bg-accent-forest text-white rounded-lg inline-flex items-center"
                        >
                          <FaPlus className="mr-2" /> Add Record
                        </button>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {columns.slice(0, 6).map(column => (
                              <th
                                key={column.column_name}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {column.column_name}
                              </th>
                            ))}
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {records.map((record, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {columns.slice(0, 6).map(column => (
                                <td key={column.column_name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {getDisplayValue(record[column.column_name], column.column_name)}
                                </td>
                              ))}
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleEditRecord(record)}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                  disabled={isSaving}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord(record)}
                                  className="text-red-600 hover:text-red-900"
                                  disabled={isSaving}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
                
                {/* Record Editor */}
                {(selectedRecord || isCreatingNew) && (
                  <div className="p-6">
                    <div className="mb-6 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {isCreatingNew ? 'Create New Record' : 'Edit Record'}
                      </h3>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isSaving}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {columns.map(column => (
                        <div key={column.column_name}>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={column.column_name}>
                            {column.column_name}
                            <span className="ml-1 text-xs text-gray-500">
                              ({column.data_type}{column.is_nullable === 'YES' ? ', nullable' : ''})
                            </span>
                          </label>
                          {renderFieldEditor(column.column_name, editedRecord[column.column_name])}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3 disabled:opacity-50"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveRecord}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-forest hover:bg-accent-forest-dark disabled:opacity-50 flex items-center"
                        disabled={isSaving}
                      >
                        {isSaving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                        {isSaving ? 'Saving...' : 'Save Record'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DatabaseExplorer; 