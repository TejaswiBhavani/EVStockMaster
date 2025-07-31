import React, { useState, useEffect } from 'react';
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
  Battery,
  Settings,
  LogOut
} from 'lucide-react';
import NotificationCenter from '../Notifications/NotificationCenter';
import Logo from './Logo';

const Header = ({ onMenuClick, activeTab, isMobile }) => {
  const [user] = useAuthState(auth);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // This would come from your notification state management
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);
  
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
      className="glass-card border-b border-white/20 dark:border-dark-700/30 backdrop-blur-xl px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg relative overflow-hidden z-header"
      style={{ zIndex: 20 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-secondary-500/5 to-electric-500/5 dark:from-primary-400/10 dark:via-secondary-400/10 dark:to-electric-400/10"></div>
      
      {/* Left Section */}
      <div className="flex items-center space-x-4 sm:space-x-6 relative z-10">
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            className="p-2 sm:p-3 rounded-xl bg-white/50 dark:bg-dark-800/50 hover:bg-white/70 dark:hover:bg-dark-700/70 transition-all duration-200 shadow-lg lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>
        )}
        
        {/* Logo - visible on larger screens or when sidebar is closed */}
        {(isMobile || !isMobile) && (
          <div className="flex items-center">
            <Logo size="small" className="sm:hidden" />
            <Logo size="medium" className="hidden sm:flex lg:hidden" />
          </div>
        )}
        
        {/* Page Title - hidden on small screens when logo is shown */}
        <div className="hidden sm:block lg:block">
          <h1 className="text-xl sm:text-2xl font-bold heading-gradient">
            {getPageTitle(activeTab)}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
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
      <div className="hidden md:flex flex-1 max-w-lg mx-4 sm:mx-8 relative z-10">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search parts, inventory, or insights..."
            className="input-modern w-full pl-12 pr-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 shadow-lg group-focus-within:shadow-xl"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4 relative z-10">
        {/* Enhanced System Status */}
        <motion.div 
          className="hidden sm:flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 bg-gradient-to-r from-neon-50 to-emerald-50 rounded-xl border border-neon-200/50 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-neon-600" />
            <Battery className="w-3 h-3 sm:w-4 sm:h-4 text-neon-600" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-neon-700">Online</span>
          <div className="w-2 h-2 bg-neon-400 rounded-full animate-pulse"></div>
        </motion.div>

        {/* Enhanced Notifications */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setNotificationCenterOpen(true)}
          className="relative p-2 sm:p-3 rounded-xl bg-white/60 dark:bg-dark-800/60 hover:bg-white/80 dark:hover:bg-dark-700/80 transition-all duration-200 shadow-lg hover:shadow-xl group border border-white/30 dark:border-dark-600/30"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
          {unreadCount > 0 && (
            <>
              <motion.span 
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white dark:border-dark-800"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full animate-ping opacity-30"></div>
            </>
          )}
        </motion.button>

        {/* Enhanced User Profile */}
        <div className="relative profile-dropdown-container">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/50 dark:bg-dark-800/50 hover:bg-white/70 dark:hover:bg-dark-700/70 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30 dark:border-dark-600/30"
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 via-secondary-500 to-electric-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-neon-400 rounded-full border-2 border-white">
                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full m-0.5"></div>
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{getUserDisplayName()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{getUserRole()}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 py-2 z-dropdown"
              style={{ zIndex: 40 }}
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-700">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{getUserRole()}</p>
              </div>
              
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center space-x-3">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <button 
                onClick={() => auth.signOut()}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />
    </motion.header>
  );
};

export default Header;