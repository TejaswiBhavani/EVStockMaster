import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your InvenAI assistant. I can help you with inventory management, EV parts information, and analytics. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY

      // Check if we have a valid API key
      if (!apiKey || apiKey === 'demo-key' || apiKey === 'your-gemini-api-key-here') {
        throw new Error('API key not configured')
      }

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

Current inventory status:
- Battery Packs: 245 units (minimum: 100)
- Electric Motors: 180 units (minimum: 75)
- Charging Ports: 320 units (minimum: 150)
- Control Units: 90 units (minimum: 50)
- Cooling Systems: 160 units (minimum: 80)

Please provide detailed, actionable insights for this query: "${inputMessage}"

Format your response to be practical and specific to EV manufacturing operations.`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: enhancedPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
              topP: 0.8,
              topK: 40,
            },
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        const botResponse = {
          id: Date.now() + 1,
          text: data.candidates[0].content.parts[0].text,
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
      } else {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      console.warn('Gemini API unavailable:', error.message)

      // Enhanced fallback responses for EV inventory management
      const fallbackResponses = {
        battery:
          '🔋 **Battery Pack Analysis**: Current stock: 245 units (healthy above minimum of 100). Lithium-ion batteries require storage at 15-25°C and <60% humidity. With Tesla Energy as supplier, lead times are 8-12 weeks. **Recommendations**: Monitor thermal conditions, maintain 2-3 month buffer stock, check for capacity degradation quarterly.',
        motor:
          '⚡ **Electric Motor Status**: Stock: 180 units (good buffer above minimum 75). Bosch motors (150kW, 310Nm) require climate-controlled storage. **Key insights**: 4-6 week delivery window, store upright to prevent bearing damage, quarterly inspection recommended. Consider predictive maintenance integration.',
        charging:
          '🔌 **Charging Infrastructure**: Current stock: 320 CCS Type 2 ports (excellent coverage above minimum 150). ChargePoint units support 150kW fast charging. **Maintenance notes**: Replace connectors every 10,000 cycles, ensure IP67 protection, monitor for wear patterns.',
        control:
          '🖥️ **Control Unit Critical Alert**: Stock: 90 units (approaching minimum 50). ARM Cortex-A78 units from Continental AG have 6-8 week lead times with no substitutes. **Action required**: Place order within 72 hours, establish backup supplier, increase minimum threshold to 75 units.',
        cooling:
          '❄️ **Cooling System Status**: Stock: 160 units (stable above minimum 80). Valeo glycol-based systems essential for battery thermal management. **Monitoring**: Check coolant quality, seasonal demand increases 20% in summer, 15L/min flow rate optimal.',
        inventory:
          '📊 **Comprehensive Inventory Overview**: Total value ~₹3.2M. **Critical actions needed**: 1) Battery reorder urgent (9 days stock), 2) Control units low (order in 72hrs), 3) Other components stable. **Optimization**: ABC analysis shows batteries 68% of value - prioritize just-in-time.',
        forecast:
          '📈 **EV Market Forecast**: Industry growth 20-30% annually. **Key trends**: Solid-state batteries emerging, 350kW+ charging standards, autonomous systems requiring more sensors. **Planning**: Increase battery capacity planning, evaluate silicon carbide electronics.',
        cost: '💰 **Cost Optimization Strategy**: Current breakdown - Batteries: 68%, Motors: 18%, Others: 14%. **Opportunities**: 1) Volume discounts (batteries), 2) Local sourcing (reduce logistics 15%), 3) Vendor-managed inventory (low-value items), 4) Total cost of ownership analysis.',
        supplier:
          '🤝 **Supplier Performance**: **Top suppliers**: Tesla Energy (batteries), Bosch (motors), Continental (control), ChargePoint (charging), Valeo (cooling). **KPIs**: Delivery reliability >95%, lead time consistency, quality metrics. **Risk**: Diversify critical component suppliers.',
        stock:
          '📦 **Stock Level Intelligence**: **Critical items**: Battery (9 days), Control units (18 days). **Healthy**: Motors (15 days), Charging (40 days), Cooling (26 days). **Actions**: Implement dynamic reorder points, safety stock optimization, lead time monitoring.',
        api: '⚠️ **AI Assistant Status**: Currently running in offline mode. For full AI capabilities including real-time analysis, predictive insights, and personalized recommendations, please configure your Gemini API key in the environment settings. Contact your system administrator to enable advanced AI features.',
        default:
          "🤖 **InvenAI Assistant**: I'm operating in intelligent offline mode with comprehensive EV inventory knowledge. I can help with: **Stock analysis**, **Demand forecasting**, **Supplier management**, **Cost optimization**, **Quality control**, **Maintenance scheduling**. Try asking about specific parts (battery, motor, charging, control, cooling) or processes!",
      }

      const query = inputMessage.toLowerCase()
      let responseText = fallbackResponses.default

      // Check for API configuration issues
      if (query.includes('api') || query.includes('not working') || query.includes('offline')) {
        responseText = fallbackResponses.api
      }
      // Part-specific responses
      else if (query.includes('battery') || query.includes('lithium'))
        responseText = fallbackResponses.battery
      else if (
        query.includes('motor') ||
        (query.includes('electric') && !query.includes('electric vehicle'))
      )
        responseText = fallbackResponses.motor
      else if (query.includes('charg') || query.includes('port'))
        responseText = fallbackResponses.charging
      else if (query.includes('control') || query.includes('ecu') || query.includes('unit'))
        responseText = fallbackResponses.control
      else if (query.includes('cool') || query.includes('thermal'))
        responseText = fallbackResponses.cooling
      // Process-specific responses
      else if (
        query.includes('inventory') ||
        query.includes('overview') ||
        query.includes('summary')
      )
        responseText = fallbackResponses.inventory
      else if (query.includes('stock') || query.includes('level') || query.includes('quantity'))
        responseText = fallbackResponses.stock
      else if (query.includes('forecast') || query.includes('demand') || query.includes('predict'))
        responseText = fallbackResponses.forecast
      else if (
        query.includes('cost') ||
        query.includes('price') ||
        query.includes('budget') ||
        query.includes('money')
      )
        responseText = fallbackResponses.cost
      else if (query.includes('supplier') || query.includes('vendor') || query.includes('delivery'))
        responseText = fallbackResponses.supplier

      const errorMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const chatVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 },
  }

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
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
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
                      <div
                        className={`flex items-start space-x-2 max-w-xs ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            message.sender === 'user'
                              ? 'bg-primary-500'
                              : 'bg-gradient-to-r from-primary-500 to-electric-500'
                          }`}
                        >
                          {message.sender === 'user' ? (
                            <User className="w-3 h-3 text-white" />
                          ) : (
                            <Bot className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div
                          className={`px-3 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
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
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.2s' }}
                            ></div>
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
  )
}

export default ChatBot
