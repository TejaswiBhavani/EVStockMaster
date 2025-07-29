import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Battery, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  CheckCircle,
  ArrowRight,
  Play,
  Menu,
  X
} from 'lucide-react';
import AuthModal from '../Auth/AuthModal';
import ChatBot from '../Chatbot/ChatBot';

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "AI-Powered Demand Forecasting",
      description: "95% accuracy in predicting EV component demand with advanced machine learning algorithms.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automated Inventory Optimization",
      description: "Eliminate stockouts and overstock with intelligent automated reorder points and supplier integration.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Real-time Stock Monitoring",
      description: "Live visibility into inventory levels with instant alerts and comprehensive dashboard analytics.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Supplier Integration",
      description: "Seamless connectivity with your supply chain partners for automated procurement workflows.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Battery className="w-8 h-8" />,
      title: "EV-Specific Components",
      description: "Specialized tracking for batteries, motors, charging systems, and control units with lifecycle management.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Compliance & Traceability",
      description: "Full audit trails and compliance reporting for automotive industry standards and regulations.",
      gradient: "from-emerald-500 to-blue-500"
    }
  ];

  const stats = [
    { number: "95%", label: "Forecast Accuracy" },
    { number: "40%", label: "Cost Reduction" },
    { number: "99.9%", label: "Uptime" },
    { number: "25+", label: "Countries Served" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f2027"/>
                      <stop offset="50%" stopColor="#203a43"/>
                      <stop offset="100%" stopColor="#2c5364"/>
                    </linearGradient>
                    <linearGradient id="elementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00f2fe"/>
                      <stop offset="100%" stopColor="#4facfe"/>
                    </linearGradient>
                  </defs>
                  <rect width="32" height="32" fill="url(#bgGradient)" rx="6" />
                  <circle cx="16" cy="11" r="5" fill="url(#elementGradient)" />
                  <path d="M13 16 L11 22 L13.5 22 L12 25 H20 L18.5 22 L21 22 L19 16 Z" fill="url(#elementGradient)" />
                  <path d="M16 17 L13 21 H15 L12 26 H17 L15 22 H18 Z" fill="#00f2fe" />
                  <path d="M13 13 Q16 11.5 19 13" stroke="#ffffff" strokeWidth="0.4" fill="none" />
                  <path d="M14 15 Q16 14 18 15" stroke="#ffffff" strokeWidth="0.4" fill="none" />
                  <line x1="9" y1="23" x2="13" y2="23" stroke="#ffffff" strokeWidth="0.5" />
                  <line x1="19" y1="23" x2="23" y2="23" stroke="#ffffff" strokeWidth="0.5" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InvenAI
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors">Demo</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openAuthModal('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Get Started
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-white border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors">Demo</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="text-left text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Revolutionizing{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EV Inventory
                </span>{' '}
                with Predictive Intelligence
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Eliminate stockouts and overstock with AI-powered inventory optimization 
                specifically designed for electric vehicle manufacturing. Ensure seamless 
                EV production with intelligent demand forecasting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openAuthModal('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play size={20} />
                  <span>Watch Demo</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Right Column - Interactive Demo Area */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Interactive EV Demo
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Battery className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 mb-4">3D EV Model Visualization</p>
                    <p className="text-sm text-gray-500">
                      Click on any component to see<br />
                      real-time inventory analytics
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Built for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EV Manufacturing
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed specifically for the unique challenges of electric vehicle inventory management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Optimize Your EV Inventory?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join leading EV manufacturers who've reduced inventory costs by 40% 
              with InvenAI's intelligent optimization platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('signup')}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Start Your Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <defs>
                    <linearGradient id="bgGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f2027"/>
                      <stop offset="50%" stopColor="#203a43"/>
                      <stop offset="100%" stopColor="#2c5364"/>
                    </linearGradient>
                    <linearGradient id="elementGradientFooter" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00f2fe"/>
                      <stop offset="100%" stopColor="#4facfe"/>
                    </linearGradient>
                  </defs>
                  <rect width="32" height="32" fill="url(#bgGradientFooter)" rx="6" />
                  <circle cx="16" cy="11" r="5" fill="url(#elementGradientFooter)" />
                  <path d="M13 16 L11 22 L13.5 22 L12 25 H20 L18.5 22 L21 22 L19 16 Z" fill="url(#elementGradientFooter)" />
                  <path d="M16 17 L13 21 H15 L12 26 H17 L15 22 H18 Z" fill="#00f2fe" />
                  <path d="M13 13 Q16 11.5 19 13" stroke="#ffffff" strokeWidth="0.4" fill="none" />
                  <path d="M14 15 Q16 14 18 15" stroke="#ffffff" strokeWidth="0.4" fill="none" />
                  <line x1="9" y1="23" x2="13" y2="23" stroke="#ffffff" strokeWidth="0.5" />
                  <line x1="19" y1="23" x2="23" y2="23" stroke="#ffffff" strokeWidth="0.5" />
                </svg>
              </div>
              <span className="text-2xl font-bold">InvenAI</span>
            </div>
            <p className="text-gray-400 mb-6">
              AI-powered inventory optimization for electric vehicle manufacturing
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 InvenAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
};

export default LandingPage;