import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse, isGeminiConfigured } from '../../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I\'m your Seamless Edge Assistant. How can I help you with your drywall project in Calgary today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false); // Set to false initially for demo mode
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if Gemini API is configured on component mount
  useEffect(() => {
    const isConfigured = isGeminiConfigured() && import.meta.env.VITE_GEMINI_API_KEY !== 'DEMO_MODE';
    setApiConfigured(isConfigured);
    if (!isConfigured) {
      console.warn('Gemini API is not configured. Chatbot will use fallback responses.');
      // Add a message to indicate API is in demo mode
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: 'Note: I\'m currently running in demo mode with pre-programmed responses.',
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    }
  }, []);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Quick reply options
  const quickReplies = [
    { id: 'quote', text: 'Get a quick quote' },
    { id: 'services', text: 'What services do you offer?' },
    { id: 'location', text: 'Where do you service in Alberta?' },
    { id: 'contact', text: 'Schedule a consultation' },
  ];

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (inputValue.trim() === '' || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const userQuery = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    try {
      // If Gemini API is configured, use it. Otherwise, fall back to static responses
      let botResponse: string;
      
      if (apiConfigured) {
        // Use Gemini API
        botResponse = await generateChatResponse(userQuery);
      } else {
        // Fallback to static responses
        const lowercaseInput = userQuery.toLowerCase();
        
        if (lowercaseInput.includes('quote') || lowercaseInput.includes('cost') || lowercaseInput.includes('price')) {
          botResponse = 'I\'d be happy to help you get a quote for your Calgary drywall project! Could you tell me about your project, including the approximate square footage?';
        } else if (lowercaseInput.includes('service') || lowercaseInput.includes('offer')) {
          botResponse = 'We offer a complete range of drywall services throughout Calgary and surrounding areas, including boarding, taping, mudding, sanding, and custom textures. Would you like more details about any specific service?';
        } else if (lowercaseInput.includes('contact') || lowercaseInput.includes('appointment') || lowercaseInput.includes('schedule')) {
          botResponse = 'I can help you schedule a consultation with our Calgary team! Please provide your preferred date and time, and our team will confirm availability.';
        } else if (lowercaseInput.includes('calgary') || lowercaseInput.includes('alberta') || lowercaseInput.includes('location') || lowercaseInput.includes('area')) {
          botResponse = 'We are based in Calgary, Alberta and serve the entire Calgary region including Airdrie, Cochrane, Chestermere, and Okotoks. For locations beyond Airdrie, additional travel fees may apply. Our team primarily focuses on the Calgary metro area to ensure prompt service.';
        } else {
          botResponse = 'Thanks for reaching out! Our Calgary-based team specializes in all aspects of drywall installation and finishing. Can you tell me more about your specific needs or questions?';
        }
      }
      
      // Add bot response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again or contact our Calgary office directly at (403) 555-7890.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (replyText: string) => {
    setInputValue(replyText);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const initiateCall = () => {
    alert('This would connect you with a representative. For now, please call our Calgary office at (403) 555-7890 directly.');
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl overflow-hidden z-40 flex flex-col"
          >
            {/* Chat header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <h3 className="font-medium">Seamless Edge Assistant</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Calgary</span>
              </div>
              <button 
                onClick={initiateCall}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2"
                aria-label="Start voice call"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3/4 p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white shadow rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className={`text-xs block mt-1 ${message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white p-3 rounded-lg shadow rounded-bl-none flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick replies */}
            <div className="p-2 bg-gray-50 border-t border-gray-200 flex overflow-x-auto space-x-2">
              {quickReplies.map(reply => (
                <button
                  key={reply.id}
                  onClick={() => handleQuickReply(reply.text)}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm whitespace-nowrap hover:bg-gray-100"
                >
                  {reply.text}
                </button>
              ))}
            </div>
            
            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded-r-lg hover:bg-opacity-90 disabled:opacity-50"
                  disabled={inputValue.trim() === '' || isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot; 