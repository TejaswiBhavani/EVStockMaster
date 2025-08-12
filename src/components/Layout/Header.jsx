import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../config/firebase'
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  Wifi,
  Battery,
  Settings,
  LogOut,
  Package,
  AlertTriangle,
  X,
} from 'lucide-react'
import NotificationCenter from '../Notifications/NotificationCenter'
import Logo from './Logo'
import useSearchStore from '../../store/searchStore'

const Header = ({ onMenuClick, activeTab, isMobile, onNavigate }) => {
  const [user] = useAuthState(auth)
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [unreadCount] = useState(3) // This would come from your notification state management
  const searchInputRef = useRef(null)

  // Search store integration
  const {
    searchQuery,
    searchResults,
    isSearching,
    totalResults,
    setSearchQuery,
    selectPartFromSearch,
    clearSearch
  } = useSearchStore()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false)
      }
      if (searchDropdownOpen && !event.target.closest('.search-dropdown-container')) {
        setSearchDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileDropdownOpen, searchDropdownOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
        setSearchDropdownOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchDropdownOpen(false)
        searchInputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value
    setSearchQuery(query)
    setSearchDropdownOpen(query.length > 0 || searchResults.length > 0)
  }

  // Handle search result selection
  const handleSearchResultSelect = (partId) => {
    selectPartFromSearch(partId)
    setSearchDropdownOpen(false)
    // Navigate to 3D model if not already there
    if (activeTab !== '3d-model') {
      onNavigate('3d-model')
    }
  }

  // Clear search
  const handleClearSearch = () => {
    clearSearch()
    setSearchDropdownOpen(false)
    searchInputRef.current?.focus()
  }

  const getPageTitle = (tab) => {
    const titles = {
      dashboard: 'Dashboard Overview',
      '3d-model': '3D Model Viewer',
      inventory: 'Inventory Management',
      'ai-summary': 'AI Analytics',
      settings: 'System Settings',
    }
    return titles[tab] || 'InvenAI'
  }

  // Helper function to get user display name with fallback
  const getUserDisplayName = () => {
    if (!user) return 'Guest User'

    // First try displayName (set during signup)
    if (user.displayName) {
      return user.displayName
    }

    // If no displayName, try to extract from email
    if (user.email) {
      const emailName = user.email.split('@')[0]
      // Capitalize first letter and handle dots/underscores
      return emailName
        .split(/[._]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    }

    // Final fallback
    return 'User'
  }

  // Helper function to get user role/title
  const getUserRole = () => {
    if (!user) return 'Please sign in'
    return 'Inventory Manager' // Could be enhanced to read from user profile
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`glass-card border-b border-white/20 dark:border-dark-700/30 backdrop-blur-xl px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg relative z-header ${
        notificationCenterOpen ? 'overflow-visible' : 'overflow-hidden'
      }`}
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
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Center Section - Enhanced Search */}
      <div className="hidden md:flex flex-1 max-w-lg mx-4 sm:mx-8 relative z-10 search-dropdown-container">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setSearchDropdownOpen(searchQuery.length > 0 || searchResults.length > 0)}
            placeholder="Search TATA EV parts, inventory, or insights..."
            className="input-modern w-full pl-12 pr-16 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 shadow-lg group-focus-within:shadow-xl"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {searchDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 py-2 z-dropdown max-h-96 overflow-y-auto"
            >
              {isSearching ? (
                <div className="px-4 py-3 text-center">
                  <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Searching parts...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {totalResults} part{totalResults !== 1 ? 's' : ''} found
                      {searchQuery && ` for "${searchQuery}"`}
                    </p>
                  </div>
                  {searchResults.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => handleSearchResultSelect(part.id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          part.urgentAlert 
                            ? 'bg-red-100 dark:bg-red-900/30' 
                            : 'bg-primary-100 dark:bg-primary-900/30'
                        }`}>
                          {part.urgentAlert ? (
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          ) : (
                            <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                              {part.name}
                            </h4>
                            {part.urgentAlert && (
                              <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                                URGENT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {part.id}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Stock: {part.currentStock}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {part.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              ) : searchQuery ? (
                <div className="px-4 py-3 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    No parts found for "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="px-4 py-3 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start typing to search TATA EV parts...
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
                transition={{ delay: 0.3, type: 'spring' }}
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
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {getUserRole()}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}
            />
          </motion.button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 py-2 z-dropdown"
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-700">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {getUserDisplayName()}
                </p>
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

      {/* Notification Center - Rendered via Portal */}
      {createPortal(
        <NotificationCenter
          isOpen={notificationCenterOpen}
          onClose={() => setNotificationCenterOpen(false)}
          onNavigate={onNavigate}
        />,
        document.body
      )}
    </motion.header>
  )
}

export default Header
