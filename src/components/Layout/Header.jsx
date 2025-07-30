import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Wifi,
  Battery,
  Edit3,
  LogOut,
  Settings
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import UserProfileEdit from '../Auth/UserProfileEdit';

const Header = ({ onMenuClick, activeTab, isMobile, userProfile, onProfileUpdate }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowProfileDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileEdit = () => {
    setShowProfileEdit(true);
    setShowProfileDropdown(false);
  };

  const getUserDisplayInfo = () => {
    if (!userProfile) {
      return {
        name: 'User',
        role: 'Loading...',
        photoURL: null
      };
    }

    return {
      name: userProfile.displayName || userProfile.email?.split('@')[0] || 'User',
      role: userProfile.role || 'Set your role',
      photoURL: userProfile.photoURL
    };
  };

  const { name, role, photoURL } = getUserDisplayInfo();

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
        <div className="relative">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white/70 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
          >
            <div className="relative">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-secondary-500 to-electric-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-400 rounded-full border-2 border-white">
                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-gray-900">{name}</p>
              <p className="text-xs text-gray-600 font-medium">{role}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </motion.div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
            >
              {/* Profile Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Profile"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-600">{userProfile?.email}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleProfileEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setShowProfileDropdown(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Sign Out */}
              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && userProfile && (
        <UserProfileEdit
          isOpen={showProfileEdit}
          onClose={() => setShowProfileEdit(false)}
          userProfile={userProfile}
          onUpdate={onProfileUpdate}
        />
      )}

      {/* Click Outside Handler */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;