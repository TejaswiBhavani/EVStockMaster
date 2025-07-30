import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your InvenAI assistant. I can help you with inventory management, EV parts information, and analytics. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Enhanced prompt for better EV inventory management responses
      const enhancedPrompt = `You are InvenAI, an advanced AI assistant specialized in Electric Vehicle (EV) manufacturing inventory management and supply chain optimization. You have expertise in:

- EV battery technology and thermal management systems
- Electric motor specifications and performance optimization
- Charging infrastructure and port configurations
- Supply chain logistics for automotive components
- Inventory optimization strategies and demand forecasting
- Quality control and compliance in EV manufacturing
- Cost analysis and procurement strategies

Context: You're helping manage inventory for an EV manufacturing facility that produces electric vehicles with components like lithium-ion battery packs, electric motors, charging ports, control units, and cooling systems.

Please provide detailed, actionable insights for this query: "${inputMessage}"

Format your response to be practical and specific to EV manufacturing operations.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY || 'demo-key'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancedPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = {
          id: Date.now() + 1,
          text: data.candidates[0].content.parts[0].text,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.warn('Gemini API unavailable:', error.message);
      
      // Enhanced fallback responses for EV inventory management
      const fallbackResponses = {
        'battery': "Based on current industry standards, lithium-ion battery packs typically have a 5-8 year lifespan and should be monitored for thermal management. Recommend maintaining stock levels at 2-3 months of production demand with proper storage at 15-25°C.",
        'motor': "Electric motors require minimal maintenance but proper inventory tracking is crucial. Stock electric motors in climate-controlled environments and maintain a 1-2 month buffer stock. Consider motor efficiency ratings (>90%) when procuring.",
        'charging': "Fast charging infrastructure is critical for EV adoption. Maintain adequate stock of CCS Type 2 ports and ensure compatibility with 150kW+ charging standards. Monitor connector wear and replace every 10,000 charge cycles.",
        'inventory': "For optimal EV manufacturing inventory management: 1) Implement just-in-time delivery for high-value components like batteries, 2) Maintain 2-week safety stock for critical parts, 3) Use demand forecasting based on production schedules, 4) Monitor supplier lead times closely.",
        'forecast': "EV market demand is growing 20-30% annually. Plan inventory levels accordingly with focus on battery capacity increases and charging speed improvements. Consider seasonal variations in EV sales (higher in Q4, lower in Q1).",
        'cost': "Cost optimization strategies: 1) Negotiate volume discounts for battery packs (typically 40-50% of vehicle cost), 2) Consider local sourcing to reduce logistics costs, 3) Implement vendor-managed inventory for non-critical components, 4) Track total cost of ownership, not just unit price.",
        'default': "I'm currently operating in offline mode with limited capabilities. For comprehensive EV inventory insights, I can help with: stock level optimization, demand forecasting, supplier management, cost analysis, and quality control strategies. Please specify your particular area of interest."
      };
      
      const query = inputMessage.toLowerCase();
      let responseText = fallbackResponses.default;
      
      if (query.includes('battery') || query.includes('lithium')) responseText = fallbackResponses.battery;
      else if (query.includes('motor') || query.includes('electric')) responseText = fallbackResponses.motor;
      else if (query.includes('charg') || query.includes('port')) responseText = fallbackResponses.charging;
      else if (query.includes('inventory') || query.includes('stock')) responseText = fallbackResponses.inventory;
      else if (query.includes('forecast') || query.includes('demand')) responseText = fallbackResponses.forecast;
      else if (query.includes('cost') || query.includes('price') || query.includes('budget')) responseText = fallbackResponses.cost;

      const errorMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const chatVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-electric-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-electric-50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-electric-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">InvenAI Assistant</h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-primary-500' 
                            : 'bg-gradient-to-r from-primary-500 to-electric-500'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-3 h-3 text-white" />
                          ) : (
                            <Bot className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className={`px-3 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-electric-500 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about inventory, parts, or analytics..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      disabled={isTyping}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
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