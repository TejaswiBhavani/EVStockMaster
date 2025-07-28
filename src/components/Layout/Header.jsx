import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Wifi,
  Battery
} from 'lucide-react';

const Header = ({ onMenuClick, activeTab, isMobile }) => {
  const getPageTitle = (tab) => {
    const titles = {
      'dashboard': 'Dashboard Overview',
      '3d-model': '3D Model Viewer',
      'inventory': 'Inventory Management',
      'ai-summary': 'AI Analytics',
      'settings': 'System Settings'
    };
    return titles[tab] || 'InvenAI';
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}
        
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle(activeTab)}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search parts, inventory, or insights..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* System Status Indicators */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
          <Wifi className="w-4 h-4 text-green-600" />
          <Battery className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-700">Online</span>
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </motion.button>

        {/* User Profile */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-electric-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-900">Rajesh Kumar</p>
            <p className="text-xs text-gray-500">Inventory Manager</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;