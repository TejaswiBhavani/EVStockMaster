import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PresentationControls, Stats, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ModularEVModel from './ModularEVModel';

const EnhancedEVModel = ({ onPartClick, selectedPart }) => {
  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  return <ModularEVModel onPartClick={handlePartClick} selectedPart={selectedPart} />;
};

const EVModel = ({ onPartSelect, selectedPart }) => {
  // Helper function for part descriptions
  const getPartLabel = (partId) => {
    if (!partId) return "Interactive EV Model - Click any part to explore";
    
    const partLabels = {
      'body': 'Advanced Carbon Fiber Body - Lightweight & Aerodynamic',
      'battery': 'High-Performance Lithium-Ion Battery Pack - 100kWh',
      'motor': 'Dual Electric Motors - 400HP Combined Output',
      'charging-port': 'Fast Charging Port - CCS Type 2 (350kW)',
      'control-unit': 'AI-Powered Vehicle Control Unit',
      'cooling-system': 'Advanced Battery Thermal Management System',
      'suspension': 'Adaptive Air Suspension System',
      'brakes': 'Regenerative Braking System',
      'doors': 'Smart Entry Falcon Wing Doors'
    };
    
    return partLabels[partId] || "EV Component Selected";
  };

  // Debug logging to check component mounting
  React.useEffect(() => {
    console.log("✅ 3D Model Viewer initialized");
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      console.log("✅ WebGL supported");
    } else {
      console.error("❌ WebGL not supported");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="three-model-container h-full w-full bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 rounded-2xl overflow-hidden relative shadow-2xl border border-gray-200"
      style={{ 
        minHeight: '700px',
        height: '100%',
        width: '100%',
        display: 'block',
        position: 'relative'
      }}
    >
      {/* Electric Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-400/5 via-electric-500/5 to-electric-400/5"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
      
      {/* 3D Scene - Enhanced Setup */}
      <Canvas 
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          preserveDrawingBuffer: true
        }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '600px',
          display: 'block',
          background: 'transparent'
        }}
        onCreated={(state) => {
          console.log("✅ 3D Canvas initialized successfully");
        }}
        onError={(error) => {
          console.error("❌ Canvas error:", error);
        }}
      >
        {/* Enhanced Lighting Setup with Environment */}
        <ambientLight intensity={0.4} color="#f8fafc" />
        
        {/* HDRI Environment for realistic reflections - Optional for dev */}
        {process.env.NODE_ENV !== 'test' && <Environment preset="city" background={false} />}
        
        {/* Main directional light */}
        <directionalLight 
          position={[8, 8, 5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={30}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* Fill lights for better illumination */}
        <pointLight 
          position={[-6, 4, -6]} 
          intensity={1.0} 
          color="#60a5fa"
          distance={15}
          decay={2}
        />
        
        <pointLight 
          position={[6, 4, 6]} 
          intensity={1.0} 
          color="#34d399"
          distance={15}
          decay={2}
        />
        
        {/* Rim light for dramatic effect */}
        <spotLight
          position={[0, 10, -8]}
          angle={0.3}
          penumbra={0.5}
          intensity={1.2}
          color="#a855f7"
          distance={20}
          decay={2}
          castShadow
        />
        
        {/* Ground plane for shadows */}
        <mesh receiveShadow position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial transparent opacity={0.3} />
        </mesh>
        
        {/* 3D Model with enhanced presentation controls */}
        <PresentationControls
          global
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 1200 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <EnhancedEVModel onPartClick={onPartSelect} selectedPart={selectedPart} />
        </PresentationControls>

        {/* Enhanced Orbit Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={15}
          minDistance={3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
          autoRotateSpeed={0.5}
          dampingFactor={0.05}
          enableDamping={true}
        />
        
        {/* Performance Stats (dev mode) */}
        {process.env.NODE_ENV === 'development' && <Stats />}
      </Canvas>

      {/* UI Overlay - Enhanced and Responsive */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 pointer-events-auto max-w-sm"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interactive 3D Model
            </h3>
          </div>
          <p className="text-sm text-gray-700 mb-4">Click on parts to view detailed information</p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Body & Chassis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Battery Pack</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Electric Motors</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Charging Port</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Control Systems</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 pointer-events-auto"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center">
            <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Model Status
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Rendering</span>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              WebGL Accelerated
            </div>
          </div>
        </motion.div>
      </div>

      {/* Selected Part Information Panel */}
      {selectedPart && (
        <motion.div 
          className="absolute top-20 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 pointer-events-auto max-w-md"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 20 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900 capitalize">
                {selectedPart.replace('-', ' ')}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {getPartLabel(selectedPart)}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Efficiency</span>
              <span className="text-sm font-medium text-blue-600">98.5%</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Last Maintenance</span>
              <span className="text-sm font-medium text-gray-700">2 days ago</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl border border-white/20 pointer-events-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-8 text-sm text-gray-700 font-medium">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🖱️</span>
              <span>Drag to rotate</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔍</span>
              <span>Scroll to zoom</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">👆</span>
              <span>Click parts for details</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">✨</span>
              <span>Auto-rotate enabled</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Indicator */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <motion.div 
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          60 FPS • WebGL 2.0
        </motion.div>
      </div>

      {/* Model Title Overlay - Center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            InvenAI EV Model
          </h2>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-xl border border-white/20">
            <p className="text-lg text-gray-700 font-medium">
              {selectedPart ? getPartLabel(selectedPart) : "Interactive EV Model - Click any part to explore"}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EVModel;