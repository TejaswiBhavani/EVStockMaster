import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Menu, 
  X, 
  Maximize2, 
  Minimize2,
  BarChart3,
  Package,
  Eye,
  Target
} from 'lucide-react';
import Hero3D from '../3D/Hero3D';
import KPIDashboard from '../Dashboard/KPIDashboard';
import PartsCarousel from '../Dashboard/PartsCarousel';
import InspectorDrawer from '../UI/InspectorDrawer';
import useResponsive from '../../hooks/useResponsive';

const ImmersiveDashboard = ({ 
  onReturnToMenu,
  className = "" 
}) => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [dashboardMinimized, setDashboardMinimized] = useState(false);
  const [carouselVisible, setCarouselVisible] = useState(true);
  const [tourMode, setTourMode] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const { isMobile, isTablet } = useResponsive();

  // Tour sequence for parts
  const tourParts = [
    { id: 'chassis', name: 'Chassis & Frame', duration: 3000 },
    { id: 'battery', name: 'Battery Pack', duration: 3000 },
    { id: 'motor', name: 'Electric Motor', duration: 3000 },
    { id: 'charging-port', name: 'Charging Port', duration: 3000 },
    { id: 'suspension', name: 'Suspension System', duration: 3000 },
    { id: 'wheels', name: 'Wheels & Tires', duration: 3000 }
  ];

  // Handle part selection from 3D scene or carousel
  const handlePartSelect = (partData) => {
    setSelectedPart(partData);
    if (partData && !isMobile) {
      setInspectorOpen(true);
    }
  };

  // Handle opening dashboard from hero
  const handleOpenDashboard = () => {
    setDashboardMinimized(false);
    setCarouselVisible(true);
  };

  // Handle starting 3D tour
  const handleStartTour = () => {
    setTourMode(true);
    setCurrentTourStep(0);
    setCarouselVisible(false);
    setDashboardMinimized(true);
    // Start with first part
    if (tourParts.length > 0) {
      // Simulate selecting first part
      setTimeout(() => {
        handlePartSelect({
          id: tourParts[0].id,
          name: tourParts[0].name,
          description: 'Tour mode - automated part exploration',
          health: 'excellent',
          stock: 15,
          minStock: 10,
          cost: 12000
        });
      }, 1000);
    }
  };

  // Auto-advance tour
  useEffect(() => {
    if (tourMode && currentTourStep < tourParts.length) {
      const timer = setTimeout(() => {
        const nextStep = currentTourStep + 1;
        if (nextStep < tourParts.length) {
          setCurrentTourStep(nextStep);
          handlePartSelect({
            id: tourParts[nextStep].id,
            name: tourParts[nextStep].name,
            description: 'Tour mode - automated part exploration',
            health: 'excellent',
            stock: 15,
            minStock: 10,
            cost: 12000
          });
        } else {
          // End tour
          setTourMode(false);
          setCurrentTourStep(0);
          setCarouselVisible(true);
          setDashboardMinimized(false);
          setSelectedPart(null);
        }
      }, tourParts[currentTourStep]?.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [tourMode, currentTourStep]);

  // Handle inspector close
  const handleInspectorClose = () => {
    setInspectorOpen(false);
    if (!tourMode) {
      setSelectedPart(null);
    }
  };

  // Handle stock actions
  const handleUpdateStock = (part) => {
    console.log('Update stock for:', part.name);
    // Future: implement stock update modal
  };

  const handleOrderMore = (part) => {
    console.log('Order more:', part.name);
    // Future: implement order modal
  };

  const handleMarkMaintenance = (part) => {
    console.log('Schedule maintenance for:', part.name);
    // Future: implement maintenance modal
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 ${className}`}>
      {/* Main 3D Hero Stage */}
      <Hero3D
        onPartSelect={handlePartSelect}
        selectedPart={selectedPart}
        onOpenDashboard={handleOpenDashboard}
        onStartTour={handleStartTour}
        autoRotate={!selectedPart && !tourMode}
      />

      {/* Top Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-4 z-30"
      >
        <div className="flex items-center justify-between">
          <motion.button
            onClick={onReturnToMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-white/90 backdrop-blur-lg rounded-xl px-4 py-3 shadow-lg border border-white/20 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Menu size={18} />
            <span className="font-medium">Menu</span>
          </motion.button>

          <div className="flex items-center space-x-3">
            {/* Tour progress indicator */}
            {tourMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/90 backdrop-blur-lg rounded-xl px-4 py-3 shadow-lg border border-white/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900">
                    Tour: {currentTourStep + 1} of {tourParts.length}
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentTourStep + 1) / tourParts.length) * 100}%` }}
                    />
                  </div>
                  <motion.button
                    onClick={() => {
                      setTourMode(false);
                      setCurrentTourStep(0);
                      setCarouselVisible(true);
                      setDashboardMinimized(false);
                      setSelectedPart(null);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Dashboard toggle */}
            <motion.button
              onClick={() => setDashboardMinimized(!dashboardMinimized)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/20 text-gray-700 hover:text-gray-900 transition-colors"
              title={dashboardMinimized ? 'Show Dashboard' : 'Minimize Dashboard'}
            >
              {dashboardMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </motion.button>

            {/* Carousel toggle */}
            <motion.button
              onClick={() => setCarouselVisible(!carouselVisible)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/20 text-gray-700 hover:text-gray-900 transition-colors"
              title={carouselVisible ? 'Hide Parts Carousel' : 'Show Parts Carousel'}
            >
              {carouselVisible ? <Eye size={18} /> : <Package size={18} />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Overlay KPI Dashboard - Top Right */}
      <AnimatePresence>
        {!dashboardMinimized && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-20 right-4 z-20 max-w-sm"
          >
            <KPIDashboard isOverlay={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parts Carousel - Bottom */}
      <AnimatePresence>
        {carouselVisible && !tourMode && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-4 left-4 right-4 z-20"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <PartsCarousel
                onPartSelect={handlePartSelect}
                selectedPart={selectedPart}
                highlightLowStock={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inspector Drawer - Right Side */}
      <InspectorDrawer
        isOpen={inspectorOpen || (selectedPart && isMobile)}
        onClose={handleInspectorClose}
        selectedPart={selectedPart}
        onUpdateStock={handleUpdateStock}
        onOrderMore={handleOrderMore}
        onMarkMaintenance={handleMarkMaintenance}
        className={isMobile ? "z-50" : "z-30"}
      />

      {/* Health Map Indicator - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-6 z-20"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <Target className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-900">Health Map</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {/* Health status indicators */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-600">Good</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-xs text-gray-600">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-xs text-gray-600">Critical</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Real-time part status visualization
          </div>
        </div>
      </motion.div>

      {/* Mobile-specific touch instructions */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="bg-white/90 backdrop-blur-lg rounded-xl px-4 py-2 shadow-lg border border-white/20">
            <div className="text-sm text-gray-600 text-center">
              <span className="font-medium">📱 Pinch to zoom • Drag to rotate • Tap parts to inspect</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Performance indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>60 FPS • WebGL 2.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImmersiveDashboard;