import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaRobot, FaPaperPlane, FaRegQuestionCircle } from 'react-icons/fa';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm the Seamless Edge AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested questions
  const suggestedQuestions = [
    "What areas do you serve?",
    "How much does drywall installation cost?",
    "How long does a typical project take?",
    "What type of finishes do you offer?",
    "Do you offer free estimates?"
  ];

  // Scroll to bottom of messages when new one is added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const generateResponse = (question: string): string => {
    // Simple response mapping
    const responses: Record<string, string> = {
      "what areas do you serve": "We proudly serve Calgary and surrounding areas throughout Alberta.",
      "how much does drywall installation cost": "Drywall installation typically costs between $2-$5 per square foot, depending on the project specifications. For an accurate quote, try our instant quote calculator!",
      "how long does a typical project take": "A typical residential drywall project takes 5-7 days from start to finish, including installation, taping, mudding, and finishing.",
      "what type of finishes do you offer": "We offer a variety of finishes including smooth, textured, knockdown, orange peel, and custom artistic textures. Check our gallery to see examples!",
      "do you offer free estimates": "Yes! We offer free, no-obligation estimates for all drywall projects. You can request one through our online form or by calling us."
    };

    // Default responses for unknown questions
    const defaultResponses = [
      "That's a great question! For more specific information, please contact our team directly at (403) 555-7890.",
      "Thanks for your question. While I don't have all the details, our experienced team would be happy to discuss this with you. Feel free to reach out via our contact page.",
      "I appreciate your interest! For the most accurate information about this, I'd recommend scheduling a consultation with our experts.",
      "Great question! The answer depends on your specific project details. Our team would be happy to provide a customized response if you contact us."
    ];

    // Check for a match in our responses (case insensitive)
    const normalizedQuestion = question.toLowerCase();
    for (const key in responses) {
      if (normalizedQuestion.includes(key)) {
        return responses[key];
      }
    }

    // If no match, return a random default response
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Generate and add AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    // Add user message with suggested question
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Generate and add AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(question),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className={`ai-assistant ${className}`}>
      {/* Chat button */}
      {!isOpen && (
        <motion.button
          onClick={handleOpen}
          className="fixed z-50 bottom-6 right-6 bg-accent-forest text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-accent-forest/90 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <FaRobot className="text-xl" />
        </motion.button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Chat header */}
              <div className="p-4 bg-accent-navy text-white flex justify-between items-center">
                <div className="flex items-center">
                  <div className="rounded-full bg-white/20 w-9 h-9 flex items-center justify-center mr-3">
                    <FaRobot className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-heading font-medium text-lg">Seamless Edge Assistant</h3>
                    <p className="text-xs text-white/80">Ask me about our services</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-full hover:bg-white/20 w-8 h-8 flex items-center justify-center transition-colors duration-200"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>

              {/* Messages container */}
              <div className="flex-grow p-4 overflow-y-auto max-h-[400px] bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.sender === 'user'
                          ? 'bg-accent-forest text-white rounded-tr-none'
                          : 'bg-white border border-gray-200 shadow-sm text-gray-700 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 block text-right mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="rounded-lg px-4 py-2 bg-white border border-gray-200 shadow-sm text-gray-700 rounded-tl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested questions */}
              {messages.length < 3 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 flex items-center">
                    <FaRegQuestionCircle className="mr-1" /> Suggested questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input area */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question here..."
                    className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:ring-accent-forest focus:border-accent-forest text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={inputValue.trim() === ''}
                    className="bg-accent-forest text-white rounded-r-md px-4 py-2 font-medium hover:bg-accent-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  This is a demo assistant with limited responses. For complex questions, please contact us directly.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant; 