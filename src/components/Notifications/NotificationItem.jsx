import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X, 
  Clock 
} from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'critical':
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-900 dark:text-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          title: 'text-yellow-900 dark:text-yellow-100'
        };
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100'
        };
    }
  };

  const Icon = getIcon(notification.type);
  const styles = getTypeStyles(notification.type);
  const isUnread = !notification.isRead;

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`
        p-3 sm:p-4 rounded-lg border transition-all duration-200
        ${styles.bg} ${styles.border}
        ${isUnread ? 'shadow-md ring-1 ring-primary-200/50 dark:ring-primary-800/50' : 'shadow-sm'}
        hover:shadow-lg hover:scale-[1.02]
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 p-1.5 rounded-lg ${styles.icon} bg-white/50 dark:bg-gray-800/50`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${styles.title} ${isUnread ? 'font-bold' : ''} line-clamp-2`}>
                {notification.title || 'Notification'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">
                {notification.message}
              </p>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(notification.timestamp)}</span>
                </div>
                {notification.category && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full font-medium">
                    {notification.category}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              {isUnread && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                  title="Mark as read"
                >
                  <CheckCircle className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(notification.id)}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                title="Delete notification"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Unread indicator */}
        {isUnread && (
          <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2 animate-pulse"></div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationItem;