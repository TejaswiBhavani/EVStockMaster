import React from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
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
  const [user] = useAuthState(auth);
  
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

  // Helper function to get user display name with fallback
  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    
    // First try displayName (set during signup)
    if (user.displayName) {
      return user.displayName;
    }
    
    // If no displayName, try to extract from email
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Capitalize first letter and handle dots/underscores
      return emailName.split(/[._]/).map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');
    }
    
    // Final fallback
    return 'User';
  };

  // Helper function to get user role/title
  const getUserRole = () => {
    if (!user) return 'Please sign in';
    return 'Inventory Manager'; // Could be enhanced to read from user profile
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card border-b border-white/20 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-lg relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-secondary-500/5 to-electric-500/5"></div>
      
      {/* Left Section */}
      <div className="flex items-center space-x-6 relative z-10">
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            className="p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-200 shadow-lg lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}
        
        <div>
          <h1 className="text-2xl font-bold heading-gradient">
            {getPageTitle(activeTab)}
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Center Section - Enhanced Search */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8 relative z-10">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search parts, inventory, or insights..."
            className="input-modern w-full pl-12 pr-4 py-3 text-sm placeholder-gray-400 shadow-lg group-focus-within:shadow-xl"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 relative z-10">
        {/* Enhanced System Status */}
        <motion.div 
          className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-neon-50 to-emerald-50 rounded-xl border border-neon-200/50 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-neon-600" />
            <Battery className="w-4 h-4 text-neon-600" />
          </div>
          <span className="text-sm font-bold text-neon-700">Online</span>
          <div className="w-2 h-2 bg-neon-400 rounded-full animate-pulse"></div>
        </motion.div>

        {/* Enhanced Notifications */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-200 shadow-lg hover:shadow-xl group"
        >
          <Bell className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
          <motion.span 
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            3
          </motion.span>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full animate-ping opacity-30"></div>
        </motion.button>

        {/* Enhanced User Profile */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white/70 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-secondary-500 to-electric-500 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-400 rounded-full border-2 border-white">
              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
            </div>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-gray-900">{getUserDisplayName()}</p>
            <p className="text-xs text-gray-600 font-medium">{getUserRole()}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;