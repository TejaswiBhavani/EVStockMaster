import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Package, Brain } from 'lucide-react'
import { auth } from './config/firebase'
import { ThemeProvider } from './hooks/useTheme'
import Homepage from './components/Homepage/Homepage'
import ChatBot from './components/Chat/ChatBot'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import EVModel from './components/3D/EVModel'
import StatsCards from './components/Dashboard/StatsCards'
import PersonalizedWelcome from './components/Dashboard/PersonalizedWelcome'
import ProductionSchedule from './components/Dashboard/ProductionSchedule'
import InventoryTable from './components/Inventory/InventoryTable'
import AISummary from './components/InfoPanel/AISummary'
import InfoPanel from './components/InfoPanel/InfoPanel'
import SettingsPage from './components/Settings/SettingsPage'
import useResponsive from './hooks/useResponsive'

function App() {
  const [user, loading] = useAuthState(auth)
  const [showApp, setShowApp] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedPart, setSelectedPart] = useState(null)
  const [infoPanelOpen, setInfoPanelOpen] = useState(false)
  const { isMobile } = useResponsive()

  // Show loading while checking auth state (only if not in demo mode)
  if (loading && !demoMode) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-electric-50 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Loading InvenAI...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  // Show homepage if user is not authenticated or hasn't entered the app (and not in demo mode)
  if ((!user && !demoMode) || !showApp) {
    return (
      <ThemeProvider>
        <Homepage
          onEnterApp={() => {
            setShowApp(true)
            setDemoMode(true)
          }}
        />
        <ChatBot />
      </ThemeProvider>
    )
  }

  // Handle part selection from 3D model or inventory table
  const handlePartSelect = (partId) => {
    setSelectedPart(partId)
    setInfoPanelOpen(true)
  }

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Handle navigation from notifications
  const handleNotificationNavigate = (tab, itemId = null) => {
    setActiveTab(tab)
    // Could also handle itemId for deep linking in the future
    if (itemId) {
      console.log('Navigate to item:', itemId)
      // Future: implement deep linking to specific items
    }
  }

  // Handle info panel close
  const handleInfoPanelClose = () => {
    setInfoPanelOpen(false)
    setSelectedPart(null)
  }

  // Render main content based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <PersonalizedWelcome />
            <StatsCards />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ProductionSchedule />
              </div>
              <div className="modern-card p-6">
                <h3 className="text-xl font-bold heading-gradient mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.03, x: 5 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab('3d-model')}
                    className="w-full p-4 text-left modern-card border-0 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Box className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-primary-700">
                          View 3D Model
                        </div>
                        <div className="text-sm text-gray-500">Interactive EV visualization</div>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, x: 5 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab('inventory')}
                    className="w-full p-4 text-left modern-card border-0 hover:bg-gradient-to-r hover:from-electric-50 hover:to-neon-50 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-electric-500 to-neon-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-electric-700">
                          Manage Inventory
                        </div>
                        <div className="text-sm text-gray-500">Stock levels & orders</div>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, x: 5 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab('ai-summary')}
                    className="w-full p-4 text-left modern-card border-0 hover:bg-gradient-to-r hover:from-accent-50 hover:to-secondary-50 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-accent-700">
                          AI Insights
                        </div>
                        <div className="text-sm text-gray-500">Smart recommendations</div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case '3d-model':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
          >
            <div className="modern-card border-0 h-full min-h-[700px] overflow-hidden">
              <EVModel onPartSelect={handlePartSelect} selectedPart={selectedPart} />
            </div>
          </motion.div>
        )

      case 'inventory':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <InventoryTable onPartSelect={handlePartSelect} />
          </motion.div>
        )

      case 'ai-summary':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <AISummary />
            </div>
          </motion.div>
        )

      case 'settings':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SettingsPage />
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-background">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 dark:from-primary-400/20 dark:to-secondary-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-electric-200/30 to-neon-200/30 dark:from-electric-400/20 dark:to-neon-400/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 relative z-content ${
            sidebarOpen && !isMobile ? 'ml-72' : 'ml-0'
          }`}
        >
          {/* Header */}
          <Header
            onMenuClick={handleSidebarToggle}
            activeTab={activeTab}
            isMobile={isMobile}
            onNavigate={handleNotificationNavigate}
          />

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <div
              className={`transition-all duration-300 ${
                infoPanelOpen && !isMobile ? 'mr-96' : 'mr-0'
              }`}
            >
              <AnimatePresence mode="wait">{renderMainContent()}</AnimatePresence>
            </div>
          </main>
        </div>

        {/* Info Panel */}
        <InfoPanel
          isOpen={infoPanelOpen}
          onClose={handleInfoPanelClose}
          selectedPart={selectedPart}
          isMobile={isMobile}
        />

        {/* ChatBot */}
        <ChatBot />
      </div>
    </ThemeProvider>
  )
}

export default App
