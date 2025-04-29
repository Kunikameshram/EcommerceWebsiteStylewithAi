import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Mic, User, Bot } from 'lucide-react';

const ChatGPTUI = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! How can I help you today?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    
    // Set typing indicator
    setIsTyping(true);
    
    try {
      const res = await fetch('http://3.137.162.97:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error contacting the server. Please try again later.'
      }]);
      console.error('Error sending message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
  };

  // Function to format message content with proper line breaks
  const formatMessage = (content) => {
    if (typeof content !== 'string') return content;
    
    // Split by newlines and map to elements with proper breaks
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-white">
     
      
      {/* Chat area */}
      <div className="flex-1 overflow-auto py-6 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1">
                  <Bot size={16} className="text-indigo-600" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm whitespace-pre-line ${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}
              >
                {formatMessage(message.content)}
              </div>
              
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ml-2 mt-1">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                <Bot size={16} className="text-indigo-600" />
              </div>
              <div className="bg-white rounded-2xl p-3 shadow-sm rounded-tl-none border border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="bg-white border-t border-indigo-100 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-4 pl-5 pr-24 rounded-full bg-gray-50 text-gray-800 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"
              placeholder="Message the AI assistant..."
            />
            <div className="absolute right-3 flex space-x-1">
              <button 
                type="button" 
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <Mic size={20} />
              </button>
              <button 
                type="submit" 
                className={`p-2 rounded-full ${
                  inputValue.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-200 text-gray-400'
                } transition-colors`}
                disabled={!inputValue.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
          <div className="text-xs text-center text-gray-400 mt-2">
            AI responses are generated based on your input
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTUI;