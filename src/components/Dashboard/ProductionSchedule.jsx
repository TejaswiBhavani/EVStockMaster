import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react'
import { productionSchedule } from '../../data/mockData'

const ProductionSchedule = () => {
  const getStatusIcon = (status) => {
    const icons = {
      scheduled: PlayCircle,
      'in-progress': Clock,
      planned: Calendar,
      completed: CheckCircle,
    }
    return icons[status] || Calendar
  }

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'text-blue-600 bg-blue-100',
      'in-progress': 'text-yellow-600 bg-yellow-100',
      planned: 'text-gray-600 bg-gray-100',
      completed: 'text-green-600 bg-green-100',
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      low: 'border-l-green-500 bg-green-50',
    }
    return colors[priority] || 'border-l-gray-500 bg-gray-50'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Production Schedule</h2>
          <p className="text-sm text-gray-500 mt-1">Upcoming manufacturing plans</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          View All
        </motion.button>
      </div>

      <div className="space-y-4">
        {productionSchedule.map((item, index) => {
          const StatusIcon = getStatusIcon(item.status)
          const statusColor = getStatusColor(item.status)
          const priorityColor = getPriorityColor(item.priority)

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-l-4 ${priorityColor} rounded-lg p-4 hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${statusColor}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.model}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity} units</p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}
                >
                  {item.status.replace('-', ' ')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Start: {new Date(item.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>End: {new Date(item.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Progress bar for in-progress items */}
              {item.status === 'in-progress' && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Priority indicator */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <AlertCircle
                    className={`w-4 h-4 ${
                      item.priority === 'high'
                        ? 'text-red-500'
                        : item.priority === 'medium'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                    }`}
                  />
                  <span className="text-xs font-medium text-gray-600 capitalize">
                    {item.priority} Priority
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Team Alpha</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm font-medium text-gray-900">Schedule New</div>
            <div className="text-xs text-gray-500">Add production run</div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-sm font-medium text-gray-900">View Reports</div>
            <div className="text-xs text-gray-500">Production analytics</div>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ProductionSchedule
