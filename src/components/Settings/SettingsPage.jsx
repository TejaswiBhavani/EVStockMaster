import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import { useTheme } from '../../hooks/useTheme';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Palette, 
  Clock, 
  Ruler, 
  Eye, 
  Zap,
  Trash2,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

const SettingsPage = () => {
  const [user] = useAuthState(auth);
  const { theme, changeTheme, isDark } = useTheme();
  const [settings, setSettings] = useState({
    // Application Preferences
    notifications: {
      lowStock: true,
      aiInsights: true,
      productionUpdates: true,
      systemAnnouncements: true
    },
    dataRefreshInterval: 15,
    units: 'metric',
    
    // 3D Model Preferences
    defaultView: 'perspective',
    animationSpeed: 1,
    highlightColor: '#00f2fe',
    
    // AI Assistant Preferences
    aiVerbosity: 'standard',
    aiConfidenceThreshold: 0.7
  });

  const handleSettingChange = (category, key, value) => {
    if (category) {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleSaveSettings = () => {
    // Here you would typically save to Firebase or your backend
    console.log('Saving settings:', settings);
    // Show success notification
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion requested');
    }
  };

  const getThemeIcon = (themeType) => {
    switch (themeType) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
      default: return Monitor;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold heading-gradient mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Customize your InvenAI experience</p>
      </div>

      {/* User Profile Management */}
      <motion.div 
        className="modern-card p-6 dark:bg-dark-800 dark:border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <User className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
          User Profile Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              className="input-modern w-full dark:bg-dark-700 dark:border-dark-600 dark:text-white"
              placeholder="Enter your display name"
              defaultValue={user?.displayName || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                className="input-modern w-full pl-10 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                value={user?.email || 'Not signed in'}
                readOnly
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <button className="btn-secondary flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <button className="btn-secondary text-sm">Upload Photo</button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={handleDeleteAccount}
            className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </motion.div>

      {/* Application Preferences */}
      <motion.div 
        className="modern-card p-6 dark:bg-dark-800 dark:border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Palette className="w-5 h-5 mr-3 text-secondary-600 dark:text-secondary-400" />
          Application Preferences
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Selection</label>
            <div className="space-y-3">
              {['light', 'dark', 'system'].map((themeOption) => {
                const IconComponent = getThemeIcon(themeOption);
                return (
                  <motion.label 
                    key={themeOption} 
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={themeOption}
                      checked={theme === themeOption}
                      onChange={(e) => changeTheme(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium capitalize">{themeOption} Mode</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {themeOption === 'system' ? 'Follow system preference' : 
                         themeOption === 'light' ? 'Light appearance' : 'Dark appearance'}
                      </p>
                    </div>
                    {theme === themeOption && (
                      <motion.div
                        layoutId="themeCheck"
                        className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                        initial={false}
                      />
                    )}
                  </motion.label>
                );
              })}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notification Preferences
            </label>
            <div className="space-y-3">
              {Object.entries({
                lowStock: 'Low Stock Alerts',
                aiInsights: 'AI Insight Updates', 
                productionUpdates: 'Production Schedule Changes',
                systemAnnouncements: 'System Announcements'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications[key]}
                    onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Data Refresh Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Data Refresh Interval
            </label>
            <select
              value={settings.dataRefreshInterval}
              onChange={(e) => handleSettingChange(null, 'dataRefreshInterval', parseInt(e.target.value))}
              className="input-modern w-full dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            >
              <option value={5}>Every 5 minutes</option>
              <option value={15}>Every 15 minutes</option>
              <option value={30}>Every 30 minutes</option>
              <option value={0}>Manual refresh only</option>
            </select>
          </div>

          {/* Units of Measurement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Ruler className="w-4 h-4 mr-2" />
              Units of Measurement
            </label>
            <div className="space-y-2">
              {['metric', 'imperial'].map((unit) => (
                <label key={unit} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="units"
                    value={unit}
                    checked={settings.units === unit}
                    onChange={(e) => handleSettingChange(null, 'units', e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{unit}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3D Model Preferences */}
      <motion.div 
        className="modern-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Eye className="w-5 h-5 mr-3 text-electric-600" />
          3D Model Preferences
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default View */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Default View</label>
            <select
              value={settings.defaultView}
              onChange={(e) => handleSettingChange(null, 'defaultView', e.target.value)}
              className="input-modern w-full"
            >
              <option value="perspective">Perspective View</option>
              <option value="top">Top View</option>
              <option value="side">Side View</option>
              <option value="front">Front View</option>
            </select>
          </div>

          {/* Animation Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Animation Speed: {settings.animationSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.animationSpeed}
              onChange={(e) => handleSettingChange(null, 'animationSpeed', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Highlight Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Highlight Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.highlightColor}
                onChange={(e) => handleSettingChange(null, 'highlightColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <span className="text-sm text-gray-600">{settings.highlightColor}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Assistant Preferences */}
      <motion.div 
        className="modern-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-3 text-accent-600" />
          AI Assistant Preferences
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Response Verbosity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">AI Response Verbosity</label>
            <div className="space-y-2">
              {['concise', 'standard', 'detailed'].map((verbosity) => (
                <label key={verbosity} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="aiVerbosity"
                    value={verbosity}
                    checked={settings.aiVerbosity === verbosity}
                    onChange={(e) => handleSettingChange(null, 'aiVerbosity', e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm text-gray-700 capitalize">{verbosity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* AI Confidence Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              AI Confidence Threshold: {Math.round(settings.aiConfidenceThreshold * 100)}%
            </label>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.1"
              value={settings.aiConfidenceThreshold}
              onChange={(e) => handleSettingChange(null, 'aiConfidenceThreshold', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Less Strict</span>
              <span>More Strict</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleSaveSettings}
          className="btn-primary flex items-center space-x-2 px-8 py-3"
        >
          <Save className="w-5 h-5" />
          <span>Save Settings</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;