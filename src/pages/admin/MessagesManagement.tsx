import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  FaEnvelope, 
  FaEnvelopeOpen, 
  FaTrash, 
  FaReply, 
  FaStar, 
  FaRegStar, 
  FaExclamationCircle,
  FaSearch,
  FaFilter,
  FaFileDownload,
  FaWindows
} from 'react-icons/fa';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  starred: boolean;
  created_at: string;
  status: 'new' | 'replied' | 'archived';
}

const MessagesManagement: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [filterRead, setFilterRead] = useState<boolean | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isOutlookConnected, setIsOutlookConnected] = useState(false);
  const [isOutlookModalOpen, setIsOutlookModalOpen] = useState(false);
  const [outlookEmail, setOutlookEmail] = useState('');
  const [outlookPassword, setOutlookPassword] = useState('');
  
  // Mock data for development
  useEffect(() => {
    // In real implementation, this would fetch from Supabase
    const mockMessages: Message[] = [
      {
        id: 1,
        name: 'John Smith',
        email: 'johnsmith@example.com',
        phone: '(206) 555-1234',
        subject: 'Kitchen Remodel Quote',
        message: 'Hello, I\'m interested in getting a quote for a complete kitchen remodel. We have a 200 sq ft kitchen that needs new cabinets, countertops, and appliances. When would be a good time to schedule a consultation?',
        read: true,
        starred: true,
        created_at: '2023-12-10T09:23:45Z',
        status: 'replied'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarahjohnson@example.com',
        phone: '(360) 555-5678',
        subject: 'Bathroom Renovation Timeline',
        message: 'I\'m planning a bathroom renovation and would like to know your typical timeline for completing such projects. Do you handle permits as well? Thank you!',
        read: false,
        starred: false,
        created_at: '2023-12-12T14:57:33Z',
        status: 'new'
      },
      {
        id: 3,
        name: 'Michael Davis',
        email: 'michael.davis@example.com',
        phone: '(425) 555-9876',
        subject: 'Deck Construction Estimate',
        message: 'We\'re looking to build a new deck in our backyard, approximately 400 sq ft. Could you provide a rough estimate for the cost? We\'re hoping to start the project in early spring.',
        read: false,
        starred: true,
        created_at: '2023-12-13T11:32:10Z',
        status: 'new'
      },
      {
        id: 4,
        name: 'Emily Wilson',
        email: 'emily.wilson@example.com',
        phone: '(206) 555-4321',
        subject: 'Home Addition Consultation',
        message: 'We\'re considering adding a master bedroom suite to our home. Do you offer architectural design services as well as construction? I\'d like to schedule a consultation to discuss options.',
        read: true,
        starred: false,
        created_at: '2023-12-08T16:45:22Z',
        status: 'archived'
      },
      {
        id: 5,
        name: 'Robert Chen',
        email: 'robert.chen@example.com',
        phone: '(253) 555-7890',
        subject: 'Basement Finishing',
        message: 'I have an unfinished basement that I\'d like to convert into a recreational space with a bathroom. Could someone from your team come take a look and provide an estimate?',
        read: false,
        starred: false,
        created_at: '2023-12-14T08:12:59Z',
        status: 'new'
      }
    ];
    
    // Load from localStorage or use mock data if not available
    const storedMessages = localStorage.getItem('seamlessedge_messages');
    const messagesData = storedMessages ? JSON.parse(storedMessages) : mockMessages;
    
    setMessages(messagesData);
    setLoading(false);
    
    // Store mock data in localStorage for persistence during development
    if (!storedMessages) {
      localStorage.setItem('seamlessedge_messages', JSON.stringify(mockMessages));
    }
    
    // Check if Outlook is connected
    const outlookConfig = localStorage.getItem('outlook_config');
    if (outlookConfig) {
      setIsOutlookConnected(true);
      const config = JSON.parse(outlookConfig);
      setOutlookEmail(config.email);
    }
  }, []);
  
  const handleMarkAsRead = (id: number) => {
    const updatedMessages = messages.map(message => 
      message.id === id ? { ...message, read: true } : message
    );
    setMessages(updatedMessages);
    localStorage.setItem('seamlessedge_messages', JSON.stringify(updatedMessages));
  };
  
  const handleToggleStar = (id: number) => {
    const updatedMessages = messages.map(message => 
      message.id === id ? { ...message, starred: !message.starred } : message
    );
    setMessages(updatedMessages);
    localStorage.setItem('seamlessedge_messages', JSON.stringify(updatedMessages));
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const updatedMessages = messages.filter(message => message.id !== id);
      setMessages(updatedMessages);
      localStorage.setItem('seamlessedge_messages', JSON.stringify(updatedMessages));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };
  
  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setIsReplyModalOpen(true);
  };
  
  const handleSendReply = () => {
    if (!selectedMessage || !replyMessage.trim()) return;
    
    // In a real implementation, this would send the email through Outlook API
    // and then update the message status in the database
    
    // For now, just update the message status
    const updatedMessages = messages.map(message => 
      message.id === selectedMessage.id ? { ...message, status: 'replied' as const } : message
    );
    
    setMessages(updatedMessages);
    localStorage.setItem('seamlessedge_messages', JSON.stringify(updatedMessages));
    
    // Close modal and reset
    setIsReplyModalOpen(false);
    setReplyMessage('');
    setSelectedMessage(prevSelected => 
      prevSelected?.id === selectedMessage.id 
        ? { ...prevSelected, status: 'replied' } 
        : prevSelected
    );
    
    // Show confirmation
    alert('Reply sent successfully' + (isOutlookConnected ? ' via Microsoft Outlook' : ''));
  };
  
  const handleArchive = (id: number) => {
    const updatedMessages = messages.map(message => 
      message.id === id ? { ...message, status: 'archived' as const } : message
    );
    setMessages(updatedMessages);
    localStorage.setItem('seamlessedge_messages', JSON.stringify(updatedMessages));
    
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, status: 'archived' });
    }
  };
  
  const handleExportMessages = () => {
    // In a real implementation, this would generate a CSV or Excel file
    const csvContent = [
      ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Created At'],
      ...messages.map(msg => [
        msg.id,
        msg.name,
        msg.email,
        msg.phone,
        msg.subject,
        msg.message,
        msg.status,
        msg.created_at
      ])
    ].map(e => e.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'messages_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleConnectOutlook = () => {
    // In a real implementation, this would use OAuth to connect to Microsoft Outlook
    // For demo purposes, we'll just store the email in localStorage
    
    localStorage.setItem('outlook_config', JSON.stringify({
      email: outlookEmail,
      // In a real app, we would never store passwords in localStorage
      // This is just for demo purposes
    }));
    
    setIsOutlookConnected(true);
    setIsOutlookModalOpen(false);
    alert('Microsoft Outlook connected successfully! Email will now be sent through your Outlook account.');
  };
  
  const handleDisconnectOutlook = () => {
    if (window.confirm('Are you sure you want to disconnect Microsoft Outlook?')) {
      localStorage.removeItem('outlook_config');
      setIsOutlookConnected(false);
      setOutlookEmail('');
      setOutlookPassword('');
    }
  };
  
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRead = filterRead === null || message.read === filterRead;
    
    const matchesStatus = filterStatus === '' || message.status === filterStatus;
    
    return matchesSearch && matchesRead && matchesStatus;
  });
  
  // Sort by date (newest first)
  const sortedMessages = [...filteredMessages].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <>
      <Helmet>
        <title>Messages Management | Seamless Edge Admin</title>
      </Helmet>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages Management</h1>
          <p className="text-gray-600">Manage and respond to messages from clients and potential clients.</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-3">
          <button 
            onClick={() => setIsOutlookModalOpen(true)}
            className={`flex items-center px-4 py-2 rounded-lg border ${
              isOutlookConnected 
                ? 'bg-blue-100 text-blue-700 border-blue-300' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FaWindows className="mr-2" />
            {isOutlookConnected ? 'Outlook Connected' : 'Connect Outlook'}
          </button>
          
          <button
            onClick={handleExportMessages}
            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <FaFileDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Messages List - Left Panel */}
          <div className="col-span-1 border-r min-h-[600px] max-h-[800px] overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <div className="flex text-sm space-x-2">
                <select
                  className="py-1 pl-2 pr-6 text-sm border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                
                <select
                  className="py-1 pl-2 pr-6 text-sm border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest"
                  value={filterRead === null ? '' : filterRead ? 'read' : 'unread'}
                  onChange={(e) => {
                    if (e.target.value === '') setFilterRead(null);
                    else if (e.target.value === 'read') setFilterRead(true);
                    else setFilterRead(false);
                  }}
                >
                  <option value="">All Messages</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-forest"></div>
              </div>
            ) : sortedMessages.length === 0 ? (
              <div className="p-8 text-center">
                <FaEnvelope className="text-gray-300 text-5xl mx-auto mb-3" />
                <p className="text-gray-500">No messages found</p>
              </div>
            ) : (
              <div className="divide-y">
                {sortedMessages.map(message => (
                  <div 
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''} ${!message.read ? 'border-l-4 border-accent-forest' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read) {
                        handleMarkAsRead(message.id);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{message.name}</span>
                      <div className="flex items-center space-x-1">
                        {message.status === 'new' && (
                          <span className="inline-block w-2 h-2 bg-accent-forest rounded-full"></span>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStar(message.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {message.starred ? 
                            <FaStar className="text-yellow-500" /> : 
                            <FaRegStar />
                          }
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 font-medium truncate">{message.subject}</div>
                    <div className="text-xs text-gray-500 mt-1 flex justify-between">
                      <span>{new Date(message.created_at).toLocaleDateString()}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        message.status === 'new' 
                          ? 'bg-green-100 text-green-800' 
                          : message.status === 'replied' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.status === 'new' ? 'New' : 
                         message.status === 'replied' ? 'Replied' : 'Archived'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Message Detail - Right Panel */}
          <div className="col-span-1 md:col-span-3 p-6 min-h-[600px] flex flex-col">
            {selectedMessage ? (
              <>
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedMessage.subject}</h2>
                    <div className="mt-1 text-sm text-gray-600">
                      From: <span className="font-medium">{selectedMessage.name}</span> ({selectedMessage.email})
                    </div>
                    <div className="text-sm text-gray-600">
                      Phone: {selectedMessage.phone}
                    </div>
                    <div className="text-sm text-gray-500">
                      Received: {new Date(selectedMessage.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleArchive(selectedMessage.id)}
                      disabled={selectedMessage.status === 'archived'}
                      className={`p-2 rounded-lg ${
                        selectedMessage.status === 'archived'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Archive"
                    >
                      <FaEnvelopeOpen />
                    </button>
                    <button
                      onClick={() => handleReply(selectedMessage)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      title="Reply"
                    >
                      <FaReply />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg flex-grow mb-4">
                  <p className="whitespace-pre-line">{selectedMessage.message}</p>
                </div>
                
                {selectedMessage.status === 'replied' && (
                  <div className="border-t pt-4 mt-auto">
                    <div className="text-sm text-gray-500 mb-2">
                      ✓ Replied
                    </div>
                  </div>
                )}
                
                {selectedMessage.status === 'new' && (
                  <div className="mt-auto pt-4 border-t">
                    <button
                      onClick={() => handleReply(selectedMessage)}
                      className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest-dark flex items-center"
                    >
                      <FaReply className="mr-2" /> Reply to this message
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <FaEnvelope className="text-gray-300 text-6xl mb-4" />
                <h3 className="text-xl font-medium mb-2">Select a message</h3>
                <p>Click on a message from the list to view its contents</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reply Modal */}
      {isReplyModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Reply to {selectedMessage.name}</h2>
              
              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <div className="font-medium">To: {selectedMessage.email}</div>
                <div className="font-medium">Subject: RE: {selectedMessage.subject}</div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Your Reply</label>
                <textarea
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                ></textarea>
              </div>
              
              {isOutlookConnected && (
                <div className="mb-6 bg-blue-50 p-4 rounded-lg flex items-center">
                  <FaWindows className="text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-blue-800">Reply will be sent via Microsoft Outlook</div>
                    <div className="text-sm text-blue-700">Connected account: {outlookEmail}</div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsReplyModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim()}
                  className={`px-4 py-2 bg-accent-forest text-white rounded-lg flex items-center ${
                    !replyMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-forest-dark'
                  }`}
                >
                  <FaReply className="mr-2" /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Outlook Connect Modal */}
      {isOutlookModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {isOutlookConnected ? 'Microsoft Outlook Connected' : 'Connect Microsoft Outlook'}
                </h2>
                <button
                  onClick={() => setIsOutlookModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              {isOutlookConnected ? (
                <div>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                      <FaWindows className="text-blue-600 mr-3 text-xl" />
                      <div>
                        <div className="font-medium text-blue-800">Connected to Microsoft Outlook</div>
                        <div className="text-sm text-blue-700">{outlookEmail}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    All email replies to messages will be sent through your connected Microsoft Outlook account.
                  </p>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleDisconnectOutlook}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      Disconnect Account
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-6">
                    Connect your Microsoft Outlook account to send email replies directly from the admin panel.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Outlook Email Address</label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={outlookEmail}
                        onChange={(e) => setOutlookEmail(e.target.value)}
                        placeholder="your.email@outlook.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Password</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={outlookPassword}
                        onChange={(e) => setOutlookPassword(e.target.value)}
                        placeholder="••••••••••••"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        In a production environment, you would connect using OAuth for better security.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleConnectOutlook}
                      disabled={!outlookEmail || !outlookPassword}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center ${
                        !outlookEmail || !outlookPassword ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                    >
                      <FaWindows className="mr-2" /> Connect Outlook
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesManagement; 