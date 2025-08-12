import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Package, Clock } from 'lucide-react'
import useSearchStore from '../../store/searchStore'

const UrgentAlerts = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { urgentParts, selectPartFromSearch, loadUrgentParts } = useSearchStore()

  // Refresh urgent parts every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadUrgentParts, 30000)
    return () => clearInterval(interval)
  }, [loadUrgentParts])

  const handlePartSelect = (partId) => {
    selectPartFromSearch(partId)
    setIsOpen(false)
  }

  if (urgentParts.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Urgent Alert Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-100 hover:bg-red-200 border border-red-300 shadow-lg rounded-lg p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-bold text-white">
                {urgentParts.length > 9 ? '9+' : urgentParts.length}
              </span>
            </motion.div>
          </div>
          <div className="text-sm">
            <div className="font-bold text-red-700">URGENT</div>
            <div className="text-xs text-red-600">Critical Stock</div>
          </div>
        </div>
      </motion.button>

      {/* Urgent Alerts Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-red-200 py-2 z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-red-100 bg-red-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <h3 className="text-sm font-bold text-red-800">Critical Stock Alerts</h3>
                    <p className="text-xs text-red-600">{urgentParts.length} parts need immediate attention</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-red-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Urgent Parts List */}
            <div className="max-h-64 overflow-y-auto">
              {urgentParts.map((part) => (
                <motion.button
                  key={part.id}
                  onClick={() => handlePartSelect(part.id)}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors group border-l-4 border-red-500"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-700 truncate">
                          {part.name}
                        </h4>
                        <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full">
                          {part.currentStock}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-gray-600">
                          Min: {part.minimumStock}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-red-500" />
                          <p className="text-xs text-red-600">
                            {Math.max(0, Math.floor((part.currentStock - part.minimumStock) / 2))} days left
                          </p>
                        </div>
                      </div>
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-red-600 h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.max(5, (part.currentStock / part.minimumStock) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-red-100 bg-red-50">
              <p className="text-xs text-red-600 text-center">
                Click on any part to locate it in the 3D model
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UrgentAlerts