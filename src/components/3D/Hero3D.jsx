import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PresentationControls,
  useProgress,
  Html,
  Stats
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import PartsHighlighter from './PartsHighlighter';
import ControlsBar from './ControlsBar';

// Loading component for 3D scene
const Loader = () => {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <motion.div 
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-bold text-gray-800 mb-2">Loading EV Model</div>
        <div className="text-sm text-gray-600">{progress.toFixed(0)}% loaded</div>
        <div className="w-64 bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </motion.div>
    </Html>
  );
};

// Hero titles and taglines
const HeroOverlay = ({ onOpenDashboard, onStartTour, selectedPart }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Main Hero Content - Top Center */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
            EVStockMaster
          </h1>
          <p className="text-xl text-gray-700 font-medium mb-8 bg-white/80 backdrop-blur-sm rounded-full px-8 py-3 shadow-lg">
            Immersive 3D Inventory Management for Electric Vehicles
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center">
            <motion.button
              onClick={onOpenDashboard}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-400"
            >
              Open Dashboard
            </motion.button>
            
            <motion.button
              onClick={onStartTour}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-800 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200"
            >
              3D Parts Tour
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Selected Part Info - Right Side */}
      <AnimatePresence>
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 pointer-events-auto max-w-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 capitalize">
                  {selectedPart.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedPart.description}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">i</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Stock Level</span>
                <span className="text-sm font-medium text-green-600">{selectedPart.stock || 'Available'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Health Status</span>
                <span className="text-sm font-medium text-blue-600">{selectedPart.health || 'Excellent'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-gray-700">{selectedPart.lastUpdated || '2 hours ago'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Hero3D = ({ 
  onPartSelect, 
  selectedPart, 
  onOpenDashboard, 
  onStartTour,
  autoRotate = true 
}) => {
  const controlsRef = useRef();
  const [cameraControls, setCameraControls] = useState({
    autoRotate: autoRotate,
    enablePan: true,
    enableZoom: true
  });

  // Handle part selection from 3D scene
  const handlePartSelect = (partData) => {
    if (onPartSelect) {
      onPartSelect(partData);
    }
  };

  // Handle camera controls from ControlsBar
  const handleCameraReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleToggleAutoRotate = () => {
    setCameraControls(prev => ({
      ...prev,
      autoRotate: !prev.autoRotate
    }));
  };

  const handleTogglePan = () => {
    setCameraControls(prev => ({
      ...prev,
      enablePan: !prev.enablePan
    }));
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        className="w-full h-full"
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.8} color="#f8fafc" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Additional fill lights for better visibility */}
        <pointLight 
          position={[-8, 6, -8]} 
          intensity={0.8} 
          color="#60a5fa"
          distance={20}
          decay={2}
        />
        
        <pointLight 
          position={[8, 6, 8]} 
          intensity={0.8} 
          color="#34d399"
          distance={20}
          decay={2}
        />
        
        {/* Ground plane for shadows */}
        <mesh receiveShadow position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial transparent opacity={0.2} />
        </mesh>

        {/* 3D Model with Presentation Controls */}
        <PresentationControls
          global
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 1200 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <Suspense fallback={<Loader />}>
            <PartsHighlighter 
              onPartSelect={handlePartSelect}
              selectedPart={selectedPart}
            />
          </Suspense>
        </PresentationControls>

        {/* Camera Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={cameraControls.enablePan}
          enableZoom={cameraControls.enableZoom}
          enableRotate={true}
          maxDistance={20}
          minDistance={3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          autoRotate={cameraControls.autoRotate}
          autoRotateSpeed={0.8}
          dampingFactor={0.05}
          enableDamping={true}
        />

        {/* Performance Stats (dev mode) */}
        {process.env.NODE_ENV === 'development' && <Stats />}
      </Canvas>

      {/* UI Overlays */}
      <HeroOverlay 
        onOpenDashboard={onOpenDashboard}
        onStartTour={onStartTour}
        selectedPart={selectedPart}
      />

      {/* Camera Controls Bar */}
      <ControlsBar
        onCameraReset={handleCameraReset}
        onToggleAutoRotate={handleToggleAutoRotate}
        onTogglePan={handleTogglePan}
        autoRotate={cameraControls.autoRotate}
        enablePan={cameraControls.enablePan}
      />
    </div>
  );
};

export default Hero3D;