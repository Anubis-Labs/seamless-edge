import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaStar, FaRegStar, FaSearch, FaSpinner, FaPaperPlane, FaTimes, FaDownload, FaArchive } from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabaseService from '../../services/supabaseService';

// Interface matching Supabase messages table
interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  archived?: boolean;
  created_at: string;
}

// Local state extension for starred status
interface DisplayMessage extends Message {
    starred: boolean;
}

const MessagesManagement: React.FC = () => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // For individual actions
  const [isReplying, setIsReplying] = useState(false);     // For reply modal
  const [isExporting, setIsExporting] = useState(false);   // For export action
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<DisplayMessage | null>(null);
  const [filterRead, setFilterRead] = useState<string>('all'); // 'all', 'read', 'unread'
  const [filterArchived, setFilterArchived] = useState<string>('unarchived'); // 'all', 'archived', 'unarchived'
  const [replyContent, setReplyContent] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  // --- Starred State (Local Storage) --- 
  const loadStarredState = (): Record<number, boolean> => {
    const stored = localStorage.getItem('seamlessedge_starred_messages');
    try { return stored ? JSON.parse(stored) : {}; } catch { return {}; }
  };
  const saveStarredState = (starred: Record<number, boolean>) => {
    localStorage.setItem('seamlessedge_starred_messages', JSON.stringify(starred));
  };

  // --- Fetch Messages --- 
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await supabaseService.messages.getMessages();
      const starredMap = loadStarredState();
      const displayMessages: DisplayMessage[] = (data || []).map((msg: Message) => ({
          ...msg,
          starred: starredMap[msg.id] || false,
      }));
      setMessages(displayMessages);
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      setError('Failed to load messages.');
      toast.error('Failed to load messages.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // --- Actions --- 
  const handleMarkAsRead = async (id: number) => {
     const message = messages.find(m => m.id === id);
     if (!message || message.read || isProcessing) return; // Already read/not found/processing
 
     setIsProcessing(true);
     try {
       await supabaseService.messages.updateMessage(id, { read: true });
        // Optimistically update UI
        setMessages(prevMessages => 
            prevMessages.map(msg => 
                msg.id === id ? { ...msg, read: true } : msg
            )
        );
        if (selectedMessage?.id === id) {
            setSelectedMessage(prev => prev ? { ...prev, read: true } : null);
        }
        // toast.success('Marked as read'); // Optional success toast
     } catch (err: any) {
       console.error("Error marking as read:", err);
       toast.error(`Failed to mark as read: ${err.message}`);
     } finally {
       setIsProcessing(false);
     }
  };

  const handleDelete = async (id: number) => {
     if (!window.confirm('Are you sure you want to delete this message permanently?') || isProcessing) return;
     setIsProcessing(true);
     try {
       await supabaseService.messages.deleteMessage(id);
       toast.success('Message deleted permanently!');
       if (selectedMessage?.id === id) {
         setSelectedMessage(null);
       }
       setMessages(prev => prev.filter(msg => msg.id !== id));
     } catch (err: any) {
       console.error("Error deleting message:", err);
       toast.error(`Failed to delete: ${err.message}`);
     } finally {
       setIsProcessing(false);
     }
  };

  // --- Reply Action ---
  const openReplyModal = (message: DisplayMessage) => {
      setSelectedMessage(message);
      const originalMessage = `\n\n----- Original Message -----\nFrom: ${message.name} <${message.email}>\nDate: ${formatDate(message.created_at)}\nSubject: ${message.subject}\n\n${message.message}`;
      setReplyContent(`\n\n${originalMessage}`);
      setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) {
        toast.error('Reply content cannot be empty.');
        return;
    }
    setIsReplying(true);
    try {
        const response = await fetch('/api/send-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: selectedMessage.email,
                name: selectedMessage.name,
                subject: `Re: ${selectedMessage.subject}`,
                body: replyContent,
                originalMessageId: selectedMessage.id
            })
        });

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
             throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        toast.success('Reply sent successfully!');
        setShowReplyModal(false);
        setReplyContent('');
        if (!selectedMessage.read) {
            handleMarkAsRead(selectedMessage.id);
        }
    } catch (error: any) {
        console.error("Error sending reply:", error);
        toast.error(`Failed to send reply: ${error.message}`);
    } finally {
        setIsReplying(false);
    }
  };

  // --- Archive Action ---
  const handleToggleArchive = async (id: number, currentArchivedStatus: boolean) => {
    if (isProcessing) return;

    const actionText = currentArchivedStatus ? 'unarchive' : 'archive';
    if (!window.confirm(`Are you sure you want to ${actionText} this message?`)) return;

    setIsProcessing(true);
    try {
        await supabaseService.messages.updateMessage(id, { archived: !currentArchivedStatus });

        const updatedArchivedStatus = !currentArchivedStatus;
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === id ? { ...msg, archived: updatedArchivedStatus } : msg
            )
        );
        if (selectedMessage?.id === id) {
            setSelectedMessage(prev => prev ? { ...prev, archived: updatedArchivedStatus } : null);
            if (updatedArchivedStatus && filterArchived === 'unarchived') {
                setSelectedMessage(null);
            }
        }
        toast.success(`Message ${actionText}d successfully!`);
    } catch (err: any) {
        console.error(`Error ${actionText}ing message:`, err);
        toast.error(`Failed to ${actionText} message: ${err.message}. Make sure the 'archived' column exists.`);
    } finally {
        setIsProcessing(false);
    }
 };

  // --- Export Action ---
  // Helper function for proper CSV escaping
  const escapeCsvField = (field: any): string => {
    const stringField = String(field ?? ''); // Ensure it's a string, handle null/undefined
    // Escape double quotes by doubling them, and enclose in double quotes if it contains commas, double quotes, or newlines
    if (stringField.includes(',') || stringField.includes('\"') || stringField.includes('\n')) {
      return `\"${stringField.replace(/\"/g, '\"\"')}\"`; // Standard CSV escaping
    }
    return stringField; // Return as is if no special characters
  };

  const handleExportMessages = () => {
    if (isExporting) return;
    setIsExporting(true);
    toast.info('Preparing export...');

    try {
        // Use the currently filtered messages for export
        const messagesToExport = messages.filter(message => {
            const readStatus = filterRead === 'all' ? null : filterRead === 'read';
            const archiveStatus = filterArchived === 'all' ? null : filterArchived === 'archived';
            const matchesSearch = (
                message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesRead = readStatus === null || message.read === readStatus;
            const matchesArchived = archiveStatus === null || (message.archived ?? false) === archiveStatus;
            return matchesSearch && matchesRead && matchesArchived;
        });

        if (messagesToExport.length === 0) {
            toast.warn("No messages to export based on current filters.");
            setIsExporting(false);
            return;
        }

        // Define CSV Headers
        const headers = ['ID', 'Received At', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Read', 'Archived', 'Starred'];
        // Convert data to CSV rows using the escape helper
        const csvContent = [
            headers.join(','), // Header row
            ...messagesToExport.map(msg => [
                escapeCsvField(msg.id),
                escapeCsvField(formatDate(msg.created_at)), // Use helper
                escapeCsvField(msg.name),
                escapeCsvField(msg.email),
                escapeCsvField(msg.phone),
                escapeCsvField(msg.subject),
                escapeCsvField(msg.message), // Use helper
                escapeCsvField(msg.read),
                escapeCsvField(msg.archived ?? false),
                escapeCsvField(msg.starred)
            ].join(','))
        ].join('\n');

        // Create Blob and trigger download (logic remains the same)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `messages_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Messages exported successfully!');
    } catch (error: any) {
        console.error("Error exporting messages:", error);
        toast.error(`Export failed: ${error.message}`);
    } finally {
        setIsExporting(false);
    }
  };

  // --- Toggle Star (Local State) ---
  const handleToggleStar = (id: number) => {
    if (isProcessing) return;
    const starredMap = loadStarredState();
    const newStarredState = !starredMap[id];
    starredMap[id] = newStarredState;
    saveStarredState(starredMap);
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, starred: newStarredState } : msg));
    if (selectedMessage?.id === id) setSelectedMessage(prev => prev ? { ...prev, starred: newStarredState } : null);
  };

  // --- Filtering & Sorting --- 
  const filteredMessages = messages.filter(message => {
    const readStatus = filterRead === 'all' ? null : filterRead === 'read';
    const archiveStatus = filterArchived === 'all' ? null : filterArchived === 'archived';

    const matchesSearch = (
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRead = readStatus === null || message.read === readStatus;
    const matchesArchived = archiveStatus === null || (message.archived ?? false) === archiveStatus;

    return matchesSearch && matchesRead && matchesArchived;
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // --- Utility --- 
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleString(); } catch { return 'Invalid Date'; }
  };

  // --- Render --- 
  return (
    <>
      <Helmet><title>Messages | Admin</title></Helmet>

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Messages</h1>
          <p className="text-gray-600">Manage client messages.</p>
        </div>
        {/* Export Button */} 
        <button
          onClick={handleExportMessages}
          disabled={isLoading || isExporting}
          className={`px-4 py-2 text-sm rounded flex items-center ${isLoading || isExporting ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white transition`}
        >
          {isExporting ? <FaSpinner className="animate-spin mr-2" /> : <FaDownload className="mr-2" />} {isExporting ? 'Exporting...' : 'Export Visible'}
        </button>
      </div>
      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">{error}</div>)}

      {/* Main Layout: List | Detail */} 
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[70vh]">

          {/* Message List Panel */}
          <div className="col-span-1 border-r border-gray-200 flex flex-col">
            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="relative mb-3">
                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:opacity-50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isLoading} />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex text-sm space-x-2">
                 <select className="flex-1 py-1 px-2 border rounded-lg disabled:opacity-50" value={filterRead} onChange={(e) => setFilterRead(e.target.value)} disabled={isLoading}>
                     <option value="all">Read/Unread</option>
                     <option value="read">Read</option>
                     <option value="unread">Unread</option>
                 </select>
                 <select className="flex-1 py-1 px-2 border rounded-lg disabled:opacity-50" value={filterArchived} onChange={(e) => setFilterArchived(e.target.value)} disabled={isLoading}>
                     <option value="unarchived">Active</option>
                     <option value="archived">Archived</option>
                     <option value="all">All</option>
                 </select>
              </div>
            </div>

            {/* Message List Area */} 
            <div className="overflow-y-auto flex-grow">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500"><FaSpinner className="animate-spin h-6 w-6 mx-auto" /></div>
              ) : sortedMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No messages match filters.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {sortedMessages.map(message => (
                    <div 
                      key={message.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''} ${!message.read ? 'border-l-4 border-blue-500' : ''}`}
                      onClick={() => {
                          setSelectedMessage(message);
                          if (!message.read) handleMarkAsRead(message.id);
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-medium text-sm text-gray-800 truncate pr-2 ${!message.read ? 'font-bold' : ''}`}>{message.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleToggleStar(message.id); }} className="text-gray-400 hover:text-yellow-500 disabled:opacity-30" disabled={isProcessing} title={message.starred ? "Unstar" : "Star"}>
                          {message.starred ? <FaStar className="text-yellow-500" /> : <FaRegStar />}
                        </button>
                      </div>
                      <div className={`text-sm truncate ${!message.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{message.subject}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(message.created_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail Panel */}
          <div className="col-span-1 md:col-span-3 p-6 flex flex-col bg-gray-50">
            {selectedMessage ? (
              <>
                {/* Detail Header */}
                <div className="pb-4 mb-4 border-b border-gray-200 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{selectedMessage.subject}</h2>
                    <div className="text-sm text-gray-600">From: <span className="font-medium">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;</div>
                    {selectedMessage.phone && <div className="text-sm text-gray-600">Phone: {selectedMessage.phone}</div>}
                    <div className="text-xs text-gray-500 mt-1">Received: {formatDate(selectedMessage.created_at)}</div>
                    {selectedMessage.read && <span className="text-xs ml-2 px-1.5 py-0.5 rounded bg-green-100 text-green-700">Read</span>}
                    {selectedMessage.archived && <span className="text-xs ml-2 px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">Archived</span>}
                  </div>
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                     <button onClick={() => openReplyModal(selectedMessage)} className="p-2 rounded hover:bg-blue-100 text-blue-600 disabled:opacity-50" title="Reply" disabled={isProcessing}><FaReply /></button>
                     <button
                        onClick={() => handleToggleArchive(selectedMessage.id, selectedMessage.archived ?? false)}
                        className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
                        title={selectedMessage.archived ? 'Unarchive' : 'Archive'}
                        disabled={isProcessing}
                      >
                        {selectedMessage.archived ? <FaEnvelopeOpen /> : <FaArchive />}
                      </button>
                     <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 rounded hover:bg-red-100 text-red-600 disabled:opacity-50" title="Delete Permanently" disabled={isProcessing}><FaTrash /></button>
                  </div>
                </div>
                {/* Message Body */}
                <div className="flex-grow overflow-y-auto bg-white p-4 rounded border border-gray-200 shadow-sm mb-4">
                  <p className="whitespace-pre-wrap text-gray-800">{selectedMessage.message}</p>
                </div>
                 {/* Quick Reply Button (optional, could be removed if modal is preferred) */} 
                 <div className="mt-auto pt-4 border-t border-gray-200">
                      <button onClick={() => openReplyModal(selectedMessage)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={isProcessing || showReplyModal}>
                          <FaReply className="mr-2" /> Reply via Email
                      </button>
                 </div>
              </>
            ) : (
              // Placeholder when no message selected
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <FaEnvelope className="text-6xl mb-4" />
                <p>Select a message to view its details</p>
                {isLoading && <FaSpinner className="animate-spin h-6 w-6 mt-4" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */} 
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" aria-labelledby="reply-modal-title" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 id="reply-modal-title" className="text-xl font-semibold">Reply to: {selectedMessage.name}</h2>
              <button onClick={() => setShowReplyModal(false)} className="text-gray-400 hover:text-gray-600" disabled={isReplying}>
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto mb-4">
              <p className="text-sm text-gray-600 mb-2">To: {selectedMessage.email}</p>
              <p className="text-sm text-gray-600 mb-3">Subject: Re: {selectedMessage.subject}</p>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-3 border rounded min-h-[200px] focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Your reply..."
                disabled={isReplying}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowReplyModal(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100" disabled={isReplying}>
                Cancel
              </button>
              <button onClick={handleSendReply} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={isReplying || !replyContent.trim()}>
                {isReplying ? <FaSpinner className="animate-spin mr-2" /> : <FaPaperPlane className="mr-2" />} {isReplying ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesManagement; 