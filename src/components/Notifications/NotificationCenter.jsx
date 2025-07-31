import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Filter, 
  Search, 
  CheckCircle, 
  Trash2, 
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import NotificationItem from './NotificationItem';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock notifications data
  useEffect(() => {
    const mockNotifications = [
      {
        id: '1',
        type: 'critical',
        title: 'Critical Stock Alert',
        message: 'Battery pack inventory is critically low (5 units remaining). Immediate reorder required.',
        category: 'inventory',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isRead: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'AI Insight Available',
        message: 'New demand forecast suggests 25% increase in motor requirements for next quarter.',
        category: 'ai',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false
      },
      {
        id: '3',
        type: 'info',
        title: 'Production Schedule Updated',
        message: 'Schedule updated for manufacturing line B. Review new timeline in dashboard.',
        category: 'production',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true
      },
      {
        id: '4',
        type: 'success',
        title: 'Supplier Delivery Confirmed',
        message: 'Charging port components delivery confirmed for tomorrow 9:00 AM.',
        category: 'production',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: false
      },
      {
        id: '5',
        type: 'warning',
        title: 'Cooling System Alert',
        message: 'Cooling system components approaching minimum threshold (12 units).',
        category: 'inventory',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isRead: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'critical' && notification.type === 'critical') ||
      (filter === notification.category);
    
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([]);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-notification"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white dark:bg-dark-800 shadow-2xl z-notification flex flex-col border-l border-gray-200 dark:border-dark-700"
        style={{ zIndex: 60 }}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                {unreadCount > 0 && (
                  <motion.div 
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.div>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'critical', label: 'Critical' },
              { key: 'inventory', label: 'Inventory' },
              { key: 'ai', label: 'AI' },
              { key: 'production', label: 'Production' }
            ].map(({ key, label }) => (
              <motion.button
                key={key}
                onClick={() => setFilter(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-colors shadow-sm ${
                  filter === key
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={unreadCount === 0}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={notifications.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-3 text-lg">
                  {searchTerm || filter !== 'all' 
                    ? 'No notifications match your filters' 
                    : 'No notifications'
                  }
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'You\'re all caught up! New notifications will appear here.'
                  }
                </p>
                {(searchTerm || filter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                    }}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800/50">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{filteredNotifications.length} of {notifications.length} notifications</span>
              <span className="flex items-center space-x-2">
                <span>{unreadCount} unread</span>
                {unreadCount > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default NotificationCenter;