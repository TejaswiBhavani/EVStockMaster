import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X, 
  Clock,
  Package,
  Brain,
  Settings as SettingsIcon,
  Truck
} from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onNavigate }) => {
  const getIcon = (type, category) => {
    // First check category for more specific icons
    if (category === 'inventory') return Package;
    if (category === 'ai') return Brain;
    if (category === 'production') return Truck;
    if (category === 'system') return SettingsIcon;
    
    // Fallback to type-based icons
    switch (type) {
      case 'critical':
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      case 'info':
      default:
        return Info;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
          border: 'border-red-200 dark:border-red-700/50',
          icon: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
          title: 'text-red-900 dark:text-red-200',
          accent: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20',
          border: 'border-yellow-200 dark:border-yellow-700/50',
          icon: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
          title: 'text-yellow-900 dark:text-yellow-200',
          accent: 'bg-yellow-500'
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20',
          border: 'border-green-200 dark:border-green-700/50',
          icon: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
          title: 'text-green-900 dark:text-green-200',
          accent: 'bg-green-500'
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-800/20',
          border: 'border-blue-200 dark:border-blue-700/50',
          icon: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
          title: 'text-blue-900 dark:text-blue-200',
          accent: 'bg-blue-500'
        };
    }
  };

  const getActionButton = (category, type) => {
    switch (category) {
      case 'inventory':
        return {
          label: 'View Inventory',
          action: () => onNavigate?.('inventory'),
          icon: Package
        };
      case 'ai':
        return {
          label: 'View AI Insights',
          action: () => onNavigate?.('ai-summary'),
          icon: Brain
        };
      case 'production':
        return {
          label: 'View Dashboard',
          action: () => onNavigate?.('dashboard'),
          icon: SettingsIcon
        };
      default:
        return null;
    }
  };

  const actionButton = getActionButton(notification.category, notification.type);

  const Icon = getIcon(notification.type, notification.category);
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

  const getCategoryLabel = (category) => {
    const labels = {
      'inventory': 'Inventory',
      'ai': 'AI Insights',
      'production': 'Production',
      'system': 'System'
    };
    return labels[category] || category;
  };

  return (
    <motion.div
      layout
      className={`
        relative p-4 rounded-xl border transition-all duration-300 group
        ${styles.bg} ${styles.border}
        ${isUnread ? 'shadow-lg ring-1 ring-primary-200/50 dark:ring-primary-400/30' : 'shadow-md'}
        hover:shadow-xl hover:scale-[1.02] hover:ring-2 hover:ring-primary-300/30 dark:hover:ring-primary-400/40
      `}
    >
      {/* Unread indicator */}
      {isUnread && (
        <div className={`absolute left-0 top-4 bottom-4 w-1 ${styles.accent} rounded-r-full`} />
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2.5 rounded-xl ${styles.icon} shadow-sm border border-white/50 dark:border-dark-500/30`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${styles.title} ${isUnread ? 'font-bold' : ''} line-clamp-2 mb-1`}>
                {notification.title || 'Notification'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {notification.message}
              </p>
              
              {/* Metadata and Actions */}
              <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(notification.timestamp)}</span>
                  </div>
                  {notification.category && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-dark-700/60 px-2 py-1 rounded-full font-medium border border-gray-200/50 dark:border-dark-600/30">
                      {getCategoryLabel(notification.category)}
                    </span>
                  )}
                  {notification.type === 'critical' && (
                    <span className="text-xs text-red-700 dark:text-red-300 bg-red-200/50 dark:bg-red-900/30 px-2 py-1 rounded-full font-bold animate-pulse">
                      URGENT
                    </span>
                  )}
                </div>
                
                {/* Action Button */}
                {actionButton && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      actionButton.action();
                      if (isUnread) onMarkAsRead(notification.id);
                    }}
                    className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 border border-primary-200/30 dark:border-primary-700/30 hover:border-primary-300/50 dark:hover:border-primary-600/50"
                  >
                    <actionButton.icon className="w-3 h-3" />
                    <span>{actionButton.label}</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isUnread && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200"
                  title="Mark as read"
                >
                  <CheckCircle className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(notification.id)}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                title="Delete notification"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Priority indicator for critical notifications */}
      {notification.type === 'critical' && (
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default NotificationItem;