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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={isOpen ? "open" : "closed"}
        className={`
          fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50
          ${isMobile ? 'lg:relative lg:translate-x-0' : ''}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 gradient-electric rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-electric-600 bg-clip-text text-transparent">
                  InvenAI
                </h1>
                <p className="text-xs text-gray-500">Smart Inventory</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
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
                    sidebar-item w-full text-left
                    ${isActive ? 'active' : ''}
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-2 w-2 h-2 bg-primary-500 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Status Card */}
          <div className="p-4 m-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">System Status</p>
                <p className="text-xs text-green-600">All systems operational</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">InvenAI v2.1.0</p>
              <p className="text-xs text-gray-400">© 2025 TATA Motors</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;