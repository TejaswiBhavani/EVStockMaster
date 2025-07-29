import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Layout/Sidebar';
import Header from './Layout/Header';
import EVModel from './3D/EVModel';
import StatsCards from './Dashboard/StatsCards';
import ProductionSchedule from './Dashboard/ProductionSchedule';
import InventoryTable from './Inventory/InventoryTable';
import AISummary from './InfoPanel/AISummary';
import InfoPanel from './InfoPanel/InfoPanel';
import ChatBot from './Chatbot/ChatBot';
import useResponsive from '../hooks/useResponsive';
import { useAuth } from '../contexts/AuthContext';

const DashboardApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPart, setSelectedPart] = useState(null);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const { isMobile } = useResponsive();
  const { currentUser } = useAuth();

  // Handle part selection from 3D model or inventory table
  const handlePartSelect = (partId) => {
    setSelectedPart(partId);
    setInfoPanelOpen(true);
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle info panel close
  const handleInfoPanelClose = () => {
    setInfoPanelOpen(false);
    setSelectedPart(null);
  };

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
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {currentUser?.displayName || 'User'}! 👋
              </h2>
              <p className="text-blue-100">
                Your intelligent EV inventory management system is ready. 
                Monitor your stock levels, view AI insights, and optimize your supply chain.
              </p>
            </div>

            <StatsCards />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ProductionSchedule />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('3d-model')}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">View 3D Model</div>
                    <div className="text-sm text-gray-500">Interactive EV visualization</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('inventory')}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Manage Inventory</div>
                    <div className="text-sm text-gray-500">Stock levels & orders</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('ai-summary')}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">AI Insights</div>
                    <div className="text-sm text-gray-500">Smart recommendations</div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case '3d-model':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full min-h-[600px]">
              <EVModel 
                onPartSelect={handlePartSelect} 
                selectedPart={selectedPart}
              />
            </div>
          </motion.div>
        );

      case 'inventory':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InventoryTable onPartSelect={handlePartSelect} />
          </motion.div>
        );

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
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900">{currentUser?.displayName || 'User'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{currentUser?.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Real-time Updates</label>
                        <p className="text-sm text-gray-500">Enable live data synchronization</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">AI Recommendations</label>
                        <p className="text-sm text-gray-500">Show intelligent insights</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
      }`}>
        {/* Header */}
        <Header
          onMenuClick={handleSidebarToggle}
          activeTab={activeTab}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className={`transition-all duration-300 ${
            infoPanelOpen && !isMobile ? 'mr-96' : 'mr-0'
          }`}>
            <AnimatePresence mode="wait">
              {renderMainContent()}
            </AnimatePresence>
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

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
};

export default DashboardApp;