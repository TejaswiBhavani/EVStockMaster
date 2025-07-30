import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  BarChart3, 
  Brain, 
  Shield, 
  Truck, 
  Users,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import AuthModal from '../Auth/AuthModal';

const Homepage = ({ onEnterApp }) => {
  const [user] = useAuthState(auth);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [stats, setStats] = useState({ users: 0, parts: 0, savings: 0 });

  useEffect(() => {
    // Animate stats on load
    const timer = setTimeout(() => {
      setStats({ users: 2500, parts: 15000, savings: 35 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Smart insights and predictive analytics for optimal inventory management',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Real-time Dashboard',
      description: 'Monitor inventory levels, track performance, and get instant alerts',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Truck,
      title: 'Supply Chain Optimization',
      description: 'Streamline your supply chain with intelligent demand forecasting',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with Firebase authentication and data protection',
      color: 'from-red-500 to-orange-500'
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-dark-900/80 backdrop-blur-md border-b border-electric-400/20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-electric-400 to-electric-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-dark-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-electric-400 to-electric-500 bg-clip-text text-transparent">
                  InvenAI
                </h1>
                <p className="text-xs text-gray-400">Smart Inventory</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">Welcome, {user.displayName || user.email}</span>
                  <button
                    onClick={onEnterApp}
                    className="px-4 py-2 bg-gradient-to-r from-electric-400 to-electric-500 text-dark-900 rounded-lg hover:from-electric-500 hover:to-electric-600 transition-all duration-200 font-medium"
                  >
                    Enter App
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                    className="px-4 py-2 text-gray-300 hover:text-electric-400 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                    className="px-4 py-2 bg-gradient-to-r from-electric-400 to-electric-500 text-dark-900 rounded-lg hover:from-electric-500 hover:to-electric-600 transition-all duration-200 font-medium"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Smart Inventory for
              <span className="bg-gradient-to-r from-electric-400 to-electric-500 bg-clip-text text-transparent">
                {' '}EV Manufacturing
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Revolutionize your electric vehicle manufacturing with AI-powered inventory management, 
              real-time analytics, and intelligent demand forecasting.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              {user ? (
                <button
                  onClick={onEnterApp}
                  className="px-8 py-4 bg-gradient-to-r from-electric-400 to-electric-500 text-dark-900 rounded-xl hover:shadow-xl hover:from-electric-500 hover:to-electric-600 transition-all duration-300 flex items-center space-x-2 text-lg font-medium"
                >
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                    className="px-8 py-4 bg-gradient-to-r from-electric-400 to-electric-500 text-dark-900 rounded-xl hover:shadow-xl hover:from-electric-500 hover:to-electric-600 transition-all duration-300 flex items-center space-x-2 text-lg font-medium"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onEnterApp}
                    className="px-8 py-4 border border-electric-400/30 text-gray-300 rounded-xl hover:bg-dark-700 hover:border-electric-400/50 transition-all duration-200 flex items-center space-x-2 text-lg font-medium"
                  >
                    <Play className="w-5 h-5" />
                    <span>Continue as Demo</span>
                  </button>
                </>
              )}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-electric-400 to-electric-500 bg-clip-text text-transparent mb-2">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-electric-400 to-electric-500 bg-clip-text text-transparent mb-2">
                {stats.parts.toLocaleString()}+
              </div>
              <div className="text-gray-400">Parts Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {stats.savings}%
              </div>
              <div className="text-gray-400">Cost Reduction</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800/50 border-t border-electric-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features for Modern Manufacturing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to optimize your EV manufacturing inventory in one intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-dark-700/50 border border-electric-400/20 hover:bg-dark-700/70 hover:border-electric-400/30 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-electric-400 to-electric-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-dark-900 mb-6">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-xl text-dark-800 mb-8">
            Join thousands of manufacturers who trust InvenAI for their inventory optimization needs.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                className="px-8 py-4 bg-dark-900 text-white rounded-xl hover:bg-dark-800 transition-colors flex items-center space-x-2 text-lg font-medium"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border border-dark-900/30 text-dark-900 rounded-xl hover:bg-dark-900/10 transition-colors text-lg font-medium">
                Schedule Demo
              </button>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center space-x-6 text-dark-800">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-12 border-t border-electric-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-electric-400 to-electric-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-dark-900" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-electric-400 to-electric-500 bg-clip-text text-transparent">InvenAI</span>
              </div>
              <p className="text-gray-400">
                Smart inventory management for the future of EV manufacturing.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-electric-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-electric-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-electric-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-electric-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-electric-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-electric-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-electric-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-electric-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-electric-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-electric-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-electric-400 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-electric-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-electric-400/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 InvenAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
        setMode={(mode) => setAuthModal({ ...authModal, mode })}
      />
    </div>
  );
};

export default Homepage;