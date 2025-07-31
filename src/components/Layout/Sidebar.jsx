import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Box, 
  Package, 
  Brain, 
  Settings, 
  Zap,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, isMobile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '3d-model', label: '3D Model', icon: Box },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'ai-summary', label: 'AI Summary', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-sidebar lg:hidden"
          style={{ zIndex: 25 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={isOpen ? "open" : "closed"}
        className={`
          fixed left-0 top-0 h-full w-72 glass-card border-r border-white/20 dark:border-dark-700/30 shadow-2xl z-sidebar backdrop-blur-xl
          ${isMobile ? 'lg:relative lg:translate-x-0' : ''}
        `}
        style={{ zIndex: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-electric-400 to-electric-500 rounded-2xl flex items-center justify-center shadow-xl glow-effect">
                  <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#f0f9ff" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" fillOpacity="0.1" stroke="url(#logoGradient)" strokeWidth="2"/>
                    <path d="M30 35 L50 20 L70 35 L65 40 L50 30 L35 40 Z" fill="url(#logoGradient)"/>
                    <path d="M25 45 L50 25 L75 45 L70 50 L50 35 L30 50 Z" fill="url(#logoGradient)" fillOpacity="0.8"/>
                    <path d="M20 55 L50 30 L80 55 L75 60 L50 40 L25 60 Z" fill="url(#logoGradient)" fillOpacity="0.6"/>
                    <circle cx="50" cy="65" r="8" fill="url(#logoGradient)"/>
                    <path d="M42 65 L50 55 L58 65" stroke="url(#logoGradient)" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-400 rounded-full border-2 border-white animate-bounce shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold heading-gradient">
                  InvenAI
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Smart Inventory</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-6 py-4 space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) onClose();
                  }}
                  className={`
                    sidebar-item w-full text-left relative group
                    ${isActive ? 'active' : ''}
                  `}
                  whileHover={{ x: 6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-xl mr-3 transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : 'bg-transparent group-hover:bg-white/10 dark:group-hover:bg-dark-600/50'
                    }`}>
                      <Icon className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                      }`} />
                    </div>
                    <span className={`font-semibold transition-colors ${
                      isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200 group-hover:text-primary-700 dark:group-hover:text-primary-300'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Enhanced Status Card */}
          <motion.div 
            className="mx-6 mb-4 p-5 bg-gradient-to-br from-neon-50 to-emerald-50 rounded-2xl border border-neon-200/50 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-400 to-neon-500 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-neon-800">System Status</p>
                <p className="text-xs text-neon-600 font-medium">All systems operational</p>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Footer */}
          <div className="p-6 border-t border-gray-200/50 dark:border-dark-700/50">
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">InvenAI v2.1.0</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">invenAI version is base version</p>
              <div className="flex justify-center mt-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-electric-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;