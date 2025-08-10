import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Brain, ChevronLeft, ChevronRight } from 'lucide-react'
import PartDetails from './PartDetails'
import AISummary from './AISummary'

const InfoPanel = ({ isOpen, onClose, selectedPart, isMobile }) => {
  const [activeTab, setActiveTab] = useState('details')

  const panelVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  const tabs = [
    {
      id: 'details',
      label: 'Part Details',
      icon: Package,
      component: PartDetails,
    },
    {
      id: 'ai-summary',
      label: 'AI Summary',
      icon: Brain,
      component: AISummary,
    },
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || PartDetails

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={onClose}
            />
          )}

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`
              fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden
              ${isMobile ? 'lg:relative lg:shadow-lg' : ''}
            `}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-electric-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-electric-500 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Information Panel</h2>
                    <p className="text-sm text-gray-500">
                      {selectedPart ? `Selected: ${selectedPart}` : 'No part selected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!isMobile && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id

                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-all
                        ${
                          isActive
                            ? 'text-primary-600 bg-white border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ActiveComponent partId={selectedPart} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>InvenAI v2.1.0</span>
                  <span>Real-time data</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default InfoPanel
