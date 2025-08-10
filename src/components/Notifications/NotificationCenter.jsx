import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Filter,
  Search,
  CheckCircle,
  Trash2,
  X,
  AlertTriangle,
  Info,
  Settings,
  Clock,
} from 'lucide-react'
import NotificationItem from './NotificationItem'

const NotificationCenter = ({ isOpen, onClose, onNavigate }) => {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Load notifications from localStorage or use mock data
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const saved = localStorage.getItem('invenai-notifications')
        if (saved) {
          const parsedNotifications = JSON.parse(saved)
          // Validate and set notifications
          if (Array.isArray(parsedNotifications)) {
            setNotifications(parsedNotifications)
            return
          }
        }
      } catch (error) {
        console.warn('Failed to load notifications from localStorage:', error)
      }

      // Fallback to mock notifications
      const mockNotifications = [
        {
          id: '1',
          type: 'critical',
          title: 'Critical Stock Alert',
          message:
            'Battery pack inventory is critically low (5 units remaining). Immediate reorder required.',
          category: 'inventory',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          isRead: false,
          itemId: 'battery-pack-001', // For potential deep linking
        },
        {
          id: '2',
          type: 'warning',
          title: 'AI Insight Available',
          message:
            'New demand forecast suggests 25% increase in motor requirements for next quarter.',
          category: 'ai',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
          itemId: 'forecast-q2-2025',
        },
        {
          id: '3',
          type: 'info',
          title: 'Production Schedule Updated',
          message: 'Schedule updated for manufacturing line B. Review new timeline in dashboard.',
          category: 'production',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          itemId: 'line-b-schedule',
        },
        {
          id: '4',
          type: 'success',
          title: 'Supplier Delivery Confirmed',
          message: 'Charging port components delivery confirmed for tomorrow 9:00 AM.',
          category: 'production',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          itemId: 'delivery-charging-ports',
        },
        {
          id: '5',
          type: 'warning',
          title: 'Cooling System Alert',
          message: 'Cooling system components approaching minimum threshold (12 units).',
          category: 'inventory',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          itemId: 'cooling-system-components',
        },
      ]
      setNotifications(mockNotifications)
      // Save to localStorage
      localStorage.setItem('invenai-notifications', JSON.stringify(mockNotifications))
    }

    loadNotifications()
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      try {
        localStorage.setItem('invenai-notifications', JSON.stringify(notifications))
      } catch (error) {
        console.warn('Failed to save notifications to localStorage:', error)
      }
    }
  }, [notifications])

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'critical' && notification.type === 'critical') ||
      filter === notification.category

    const matchesSearch =
      searchTerm === '' ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const handleNavigate = (tab, itemId = null) => {
    if (onNavigate) {
      onNavigate(tab, itemId)
      onClose() // Close notification panel after navigation
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([])
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay - Positioned to not interfere with header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-notification-overlay"
        style={{
          top: '5.5rem', // Start below header to preserve all header interactions
        }}
        onClick={onClose}
      />

      {/* Notification Panel - Enhanced mobile and desktop positioning */}
      <motion.div
        initial={{ opacity: 0, x: 400, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 400, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-2 sm:right-4 w-full max-w-sm sm:max-w-md modern-card flex flex-col z-notification shadow-2xl border-0 notification-panel"
        style={{
          top: '5.5rem', // Consistent with overlay positioning
          maxHeight: 'calc(100vh - 6.5rem)', // Account for header height and spacing
        }}
      >
        {/* Header - Consistent with app design */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-r from-primary-50 to-electric-50 dark:from-primary-900/20 dark:to-electric-900/20 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-electric-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-dark-700/50 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Search Bar - Consistent styling */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern w-full pl-10 pr-4 py-2.5 text-sm"
            />
          </div>

          {/* Filter Tabs - Modern design */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              {
                key: 'critical',
                label: 'Critical',
                count: notifications.filter((n) => n.type === 'critical').length,
              },
              {
                key: 'inventory',
                label: 'Inventory',
                count: notifications.filter((n) => n.category === 'inventory').length,
              },
            ].map(({ key, label, count }) => (
              <motion.button
                key={key}
                onClick={() => setFilter(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  filter === key
                    ? 'bg-gradient-to-r from-primary-500 to-electric-500 text-white shadow-lg'
                    : 'bg-white/60 dark:bg-dark-700/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-dark-600/80 border border-gray-200/50 dark:border-dark-600/50'
                }`}
              >
                {label}
                {count > 0 && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                      filter === key
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-dark-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-dark-700 bg-gray-50/50 dark:bg-dark-800/50">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20"
              disabled={unreadCount === 0}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark all read</span>
            </motion.button>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-all duration-200"
                title="Notification Settings"
              >
                <Settings className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAll}
                className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={notifications.length === 0}
                title="Clear All Notifications"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    onNavigate={handleNavigate}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-600 dark:to-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-2 text-lg">
                  {searchTerm || filter !== 'all'
                    ? 'No notifications match your filters'
                    : 'No notifications'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                  {searchTerm || filter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : "You're all caught up! New notifications will appear here."}
                </p>
                {(searchTerm || filter !== 'all') && (
                  <motion.button
                    onClick={() => {
                      setSearchTerm('')
                      setFilter('all')
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-ghost text-sm"
                  >
                    Clear filters
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Stats - Consistent with app design */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-dark-700 bg-gradient-to-r from-gray-50/80 to-primary-50/80 dark:from-dark-800/50 dark:to-primary-900/20 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>
                    {filteredNotifications.length} of {notifications.length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>
                    Last updated:{' '}
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {unreadCount} unread
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}

export default NotificationCenter
