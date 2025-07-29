import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm Inven, your AI assistant for EV inventory management. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Intelligent keyword-based responses for EV inventory
  const getIntelligentResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Pricing inquiries
    if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
      return "Our InvenAI platform offers flexible pricing tiers:\n\n• **Starter**: $99/month - Perfect for small EV manufacturers\n• **Professional**: $299/month - Advanced analytics and forecasting\n• **Enterprise**: Custom pricing - Full optimization suite with dedicated support\n\nWould you like to schedule a demo to see which plan fits your needs?";
    }
    
    // Feature inquiries
    if (message.includes('feature') || message.includes('capability') || message.includes('what can')) {
      return "InvenAI provides comprehensive EV inventory management:\n\n🤖 **AI-Powered Forecasting** - 95% accuracy in demand prediction\n📊 **Real-time Monitoring** - Live stock levels and alerts\n⚡ **Automated Optimization** - Eliminate stockouts and overstock\n🔗 **Supplier Integration** - Seamless connectivity with your supply chain\n📋 **Compliance Tracking** - Full traceability for EV components\n\nWhich feature interests you most?";
    }
    
    // Demo requests
    if (message.includes('demo') || message.includes('try') || message.includes('test')) {
      return "I'd be happy to arrange a personalized demo for you! Our interactive demo showcases:\n\n• Live 3D EV model visualization\n• Real-time inventory analytics\n• AI-powered demand forecasting\n• Supplier integration workflow\n\nThe demo takes about 15 minutes and can be customized to your specific EV manufacturing needs. Would you like me to connect you with our demo team?";
    }
    
    // Technical questions
    if (message.includes('integrate') || message.includes('api') || message.includes('technical')) {
      return "InvenAI offers robust technical integration:\n\n🔌 **REST APIs** - Easy integration with existing ERP systems\n📡 **Real-time Webhooks** - Instant data synchronization\n🛡️ **Enterprise Security** - SOC 2 compliant with data encryption\n☁️ **Cloud Infrastructure** - 99.9% uptime guarantee\n📱 **Mobile SDKs** - iOS and Android support\n\nOur technical team provides full onboarding support. What systems are you looking to integrate with?";
    }
    
    // Inventory specific questions
    if (message.includes('inventory') || message.includes('stock') || message.includes('parts')) {
      return "InvenAI specializes in EV component inventory management:\n\n🔋 **Battery Management** - Track cell health, capacity, and lifecycle\n⚡ **Motor Components** - Monitor performance and maintenance schedules\n🔌 **Charging Systems** - Optimize charging infrastructure inventory\n🧠 **Control Units** - Manage ECU and software component versions\n❄️ **Cooling Systems** - Track thermal management components\n\nOur AI analyzes usage patterns to predict exactly when you'll need more components. Which EV parts are most critical for your operation?";
    }
    
    // Company/about questions
    if (message.includes('company') || message.includes('about') || message.includes('who')) {
      return "InvenAI is the leading AI-powered inventory optimization platform specifically designed for electric vehicle manufacturing.\n\n🚗 **Industry Focus** - 100% dedicated to EV manufacturing\n🏆 **Proven Results** - 40% reduction in inventory costs for our clients\n🌍 **Global Reach** - Serving EV manufacturers across 25+ countries\n🔬 **Innovation** - Cutting-edge AI algorithms trained on EV-specific data\n\nWe understand the unique challenges of EV production and have built our platform to address them specifically. What challenges is your team facing with inventory management?";
    }
    
    // Support/help questions
    if (message.includes('help') || message.includes('support') || message.includes('contact')) {
      return "I'm here to help! Here are the ways you can get support:\n\n💬 **Live Chat** - Available 24/7 for immediate assistance\n📧 **Email Support** - Technical queries answered within 2 hours\n📞 **Phone Support** - Dedicated account managers for enterprise clients\n📚 **Knowledge Base** - Comprehensive guides and tutorials\n🎓 **Training Programs** - Onboarding and advanced user training\n\nWhat specific area would you like help with today?";
    }
    
    // Default intelligent response
    return "That's an interesting question about EV inventory management! While I can provide information about:\n\n• Platform features and capabilities\n• Pricing and demo requests\n• Technical integration details\n• EV-specific inventory challenges\n\nI'd love to connect you with one of our EV inventory specialists who can give you detailed answers. Would you like me to arrange a consultation, or is there a specific aspect of inventory management you'd like to explore?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: getIntelligentResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content) => {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '• ');
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 60 : 500
            }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Inven AI Assistant</h3>
                  <p className="text-xs text-blue-100">EV Inventory Expert</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:text-blue-100 transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-blue-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`flex-shrink-0 p-2 rounded-full ${
                          message.type === 'user' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div 
                            className="text-sm"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMessageContent(message.content) 
                            }}
                          />
                          <div className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2 max-w-xs">
                        <div className="flex-shrink-0 p-2 rounded-full bg-purple-100 text-purple-600">
                          <Bot size={16} />
                        </div>
                        <div className="p-3 rounded-2xl bg-gray-100 text-gray-800">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about EV inventory management..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;