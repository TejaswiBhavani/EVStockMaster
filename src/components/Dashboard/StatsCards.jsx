import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Activity,
  Clock
} from 'lucide-react';
import { dashboardStats } from '../../data/mockData';

const StatsCards = () => {
  const stats = [
    {
      id: 1,
      title: 'Total Parts',
      value: dashboardStats.totalParts,
      change: '+2.5%',
      changeType: 'positive',
      icon: Package,
      color: 'blue',
      description: 'Active inventory items'
    },
    {
      id: 2,
      title: 'Low Stock Alerts',
      value: dashboardStats.lowStock,
      change: '+1',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'yellow',
      description: 'Items below threshold'
    },
    {
      id: 3,
      title: 'Critical Items',
      value: dashboardStats.criticalAlerts,
      change: 'Urgent',
      changeType: 'critical',
      icon: TrendingUp,
      color: 'red',
      description: 'Immediate attention needed'
    },
    {
      id: 4,
      title: 'Inventory Value',
      value: `₹${(dashboardStats.totalValue / 100000).toFixed(1)}L`,
      change: '+5.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green',
      description: 'Total stock value'
    },
    {
      id: 5,
      title: 'Efficiency Score',
      value: `${dashboardStats.efficiency}%`,
      change: '+3.1%',
      changeType: 'positive',
      icon: Activity,
      color: 'purple',
      description: 'Operational efficiency'
    },
    {
      id: 6,
      title: 'Last Updated',
      value: new Date(dashboardStats.lastUpdated).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      change: 'Live',
      changeType: 'neutral',
      icon: Clock,
      color: 'gray',
      description: 'Real-time sync'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
      yellow: 'from-yellow-500 to-yellow-600 text-yellow-600 bg-yellow-50',
      red: 'from-red-500 to-red-600 text-red-600 bg-red-50',
      green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
      purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50',
      gray: 'from-gray-500 to-gray-600 text-gray-600 bg-gray-50'
    };
    return colors[color] || colors.blue;
  };

  const getChangeColor = (changeType) => {
    const colors = {
      positive: 'text-green-600 bg-green-100',
      negative: 'text-red-600 bg-red-100',
      critical: 'text-red-700 bg-red-200 animate-pulse',
      neutral: 'text-gray-600 bg-gray-100'
    };
    return colors[changeType] || colors.neutral;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = getColorClasses(stat.color);
        const changeColorClasses = getChangeColor(stat.changeType);
        
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${changeColorClasses}`}>
                {stat.change}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-700">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>

            {/* Progress bar for efficiency */}
            {stat.id === 5 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dashboardStats.efficiency}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                  />
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;