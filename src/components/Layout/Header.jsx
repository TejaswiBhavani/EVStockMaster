import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Wifi,
  Battery,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuClick, activeTab, isMobile }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();

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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm relative"
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500">Inventory Manager</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.button>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
                
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;