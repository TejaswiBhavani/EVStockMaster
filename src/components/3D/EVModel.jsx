import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, PresentationControls, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const ModernEVModel = ({ onPartClick, selectedPart }) => {
  const groupRef = useRef();
  const wheelRefs = useRef([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003; // Subtle continuous rotation
    }
    
    // Rotate wheels for dynamic effect
    wheelRefs.current.forEach((wheel, index) => {
      if (wheel) {
        wheel.rotation.x += 0.02;
      }
    });
  });

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  // Get dynamic label based on selected part
  const getPartLabel = () => {
    if (!selectedPart) return "Interactive EV Model - Click any part to explore";
    
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
    
    return partLabels[selectedPart] || "EV Component Selected";
  };

  // Enhanced materials with better performance and realism
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'body' ? '#2563eb' : '#4facfe',
    metalness: 0.6,
    roughness: 0.3,
  }), [selectedPart]);
  
  const batteryMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'battery' ? '#0ea5e9' : '#00f2fe',
    metalness: 0.5,
    roughness: 0.4,
    emissive: selectedPart === 'battery' ? '#0ea5e9' : '#004d5c',
    emissiveIntensity: selectedPart === 'battery' ? 0.2 : 0.05,
  }), [selectedPart]);

  const motorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'motor' ? '#059669' : '#2dd4bf',
    metalness: 0.7,
    roughness: 0.2,
    emissive: selectedPart === 'motor' ? '#065f46' : '#0f766e',
    emissiveIntensity: selectedPart === 'motor' ? 0.15 : 0.03,
  }), [selectedPart]);

  const chargingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'charging-port' ? '#7c3aed' : '#a855f7',
    metalness: 0.6,
    roughness: 0.3,
    emissive: selectedPart === 'charging-port' ? '#5b21b6' : '#7c3aed',
    emissiveIntensity: selectedPart === 'charging-port' ? 0.3 : 0.1,
  }), [selectedPart]);

  const controlMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'control-unit' ? '#dc2626' : '#ef4444',
    metalness: 0.4,
    roughness: 0.5,
    emissive: selectedPart === 'control-unit' ? '#991b1b' : '#dc2626',
    emissiveIntensity: selectedPart === 'control-unit' ? 0.15 : 0.03,
  }), [selectedPart]);

  const coolingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: selectedPart === 'cooling-system' ? '#0284c7' : '#38bdf8',
    metalness: 0.5,
    roughness: 0.4,
    emissive: selectedPart === 'cooling-system' ? '#0369a1' : '#0ea5e9',
    emissiveIntensity: selectedPart === 'cooling-system' ? 0.15 : 0.05,
  }), [selectedPart]);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#1f2937',
    metalness: 0.3,
    roughness: 0.7,
  }), []);

  const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#9ca3af',
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#60a5fa',
    transparent: true,
    opacity: 0.4,
    metalness: 0.1,
    roughness: 0.05,
  }), []);

  const interiorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#374151',
    metalness: 0.1,
    roughness: 0.8,
  }), []);

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={[1.2, 1.2, 1.2]} position={[0, -0.8, 0]}>
        
        {/* Main Car Body - More realistic EV sedan shape */}
        <group onClick={() => handlePartClick('body')}>
          {/* Main chassis */}
          <Box
            position={[0, 0, 0]}
            scale={[4.5, 1.2, 2.2]}
            material={bodyMaterial}
          />
          
          {/* Car hood - slightly raised */}
          <Box
            position={[1.8, 0.15, 0]}
            scale={[1.0, 0.2, 2.0]}
            material={bodyMaterial}
          />
          
          {/* Car roof - sleek sedan profile */}
          <Box
            position={[0.2, 1.0, 0]}
            scale={[2.8, 0.3, 1.9]}
            material={bodyMaterial}
          />
          
          {/* Rear section */}
          <Box
            position={[-1.5, 0.2, 0]}
            scale={[1.2, 0.8, 2.0]}
            material={bodyMaterial}
          />
          
          {/* Front bumper */}
          <Box
            position={[2.3, -0.3, 0]}
            scale={[0.2, 0.6, 2.1]}
            material={bodyMaterial}
          />
          
          {/* Rear bumper */}
          <Box
            position={[-2.3, -0.3, 0]}
            scale={[0.2, 0.6, 2.1]}
            material={bodyMaterial}
          />
        </group>

        {/* Enhanced Battery Pack - Tesla-style flat pack */}
        <group onClick={() => handlePartClick('battery')}>
          <Box
            position={[0, -1.0, 0]}
            scale={[4.2, 0.3, 2.0]}
            material={batteryMaterial}
          />
          
          {/* Battery cells simulation */}
          {[-1.8, -0.6, 0.6, 1.8].map((x, index) => (
            <Box
              key={`battery-cell-${index}`}
              position={[x, -1.2, 0]}
              scale={[0.7, 0.15, 1.8]}
              material={batteryMaterial}
            />
          ))}
          
          {/* Battery cooling plates */}
          {[-1.0, 0, 1.0].map((x, index) => (
            <Box
              key={`cooling-plate-${index}`}
              position={[x, -1.35, 0]}
              scale={[0.8, 0.05, 1.9]}
              material={coolingMaterial}
            />
          ))}
        </group>

        {/* Dual Motor Setup - Front and Rear */}
        <group onClick={() => handlePartClick('motor')}>
          {/* Front motor */}
          <Cylinder
            position={[1.8, -0.4, 0]}
            args={[0.4, 0.4, 0.6, 16]}
            material={motorMaterial}
          />
          
          {/* Rear motor */}
          <Cylinder
            position={[-1.8, -0.4, 0]}
            args={[0.4, 0.4, 0.6, 16]}
            material={motorMaterial}
          />
          
          {/* Motor housing details */}
          <Box
            position={[1.8, -0.4, 0]}
            scale={[0.6, 0.6, 0.8]}
            material={motorMaterial}
          />
          <Box
            position={[-1.8, -0.4, 0]}
            scale={[0.6, 0.6, 0.8]}
            material={motorMaterial}
          />
        </group>

        {/* Advanced Charging Port */}
        <group onClick={() => handlePartClick('charging-port')}>
          <Box
            position={[-2.1, 0.3, 1.0]}
            scale={[0.2, 0.4, 0.3]}
            material={chargingMaterial}
          />
          
          {/* Charging port door */}
          <Box
            position={[-2.2, 0.3, 1.0]}
            scale={[0.05, 0.5, 0.4]}
            material={bodyMaterial}
          />
          
          {/* Charging indicator lights */}
          <Sphere
            position={[-2.05, 0.4, 1.0]}
            args={[0.03, 8, 8]}
            material={new THREE.MeshStandardMaterial({ 
              color: '#10b981', 
              emissive: '#10b981', 
              emissiveIntensity: 0.5 
            })}
          />
        </group>

        {/* Vehicle Control Unit */}
        <group onClick={() => handlePartClick('control-unit')}>
          <Box
            position={[0, 0.6, 0]}
            scale={[1.0, 0.4, 0.8]}
            material={controlMaterial}
          />
          
          {/* ECU components */}
          <Box
            position={[0.3, 0.6, 0]}
            scale={[0.3, 0.2, 0.3]}
            material={controlMaterial}
          />
          <Box
            position={[-0.3, 0.6, 0]}
            scale={[0.3, 0.2, 0.3]}
            material={controlMaterial}
          />
        </group>

        {/* Enhanced Cooling System */}
        <group onClick={() => handlePartClick('cooling-system')}>
          {/* Front radiator */}
          <Box
            position={[2.1, -0.2, 0]}
            scale={[0.2, 0.8, 1.6]}
            material={coolingMaterial}
          />
          
          {/* Cooling lines */}
          {[0.3, -0.3].map((y, index) => (
            <Cylinder
              key={`cooling-line-${index}`}
              position={[1.5, y, 0]}
              args={[0.03, 0.03, 1.0, 8]}
              rotation={[0, 0, Math.PI / 2]}
              material={coolingMaterial}
            />
          ))}
          
          {/* Heat exchanger */}
          <Box
            position={[1.0, -0.8, 0]}
            scale={[0.8, 0.2, 1.4]}
            material={coolingMaterial}
          />
        </group>

        {/* Suspension System */}
        <group onClick={() => handlePartClick('suspension')}>
          {[[-1.6, -1.2, 1.0], [1.6, -1.2, 1.0], [-1.6, -1.2, -1.0], [1.6, -1.2, -1.0]].map((position, index) => (
            <group key={`suspension-${index}`} position={position}>
              <Cylinder
                args={[0.08, 0.12, 0.6, 8]}
                material={new THREE.MeshStandardMaterial({ color: '#6b7280', metalness: 0.8 })}
              />
              <Sphere
                position={[0, 0.3, 0]}
                args={[0.1, 8, 8]}
                material={new THREE.MeshStandardMaterial({ color: '#374151', metalness: 0.7 })}
              />
            </group>
          ))}
        </group>

        {/* Enhanced Wheels with detailed rims */}
        {[[-1.6, -1.3, 1.2], [1.6, -1.3, 1.2], [-1.6, -1.3, -1.2], [1.6, -1.3, -1.2]].map((position, index) => (
          <group key={`wheel-${index}`} position={position}>
            {/* Tire */}
            <Cylinder
              ref={(el) => (wheelRefs.current[index] = el)}
              args={[0.7, 0.7, 0.4, 32]}
              rotation={[Math.PI / 2, 0, 0]}
              material={wheelMaterial}
            />
            
            {/* Rim */}
            <Cylinder
              args={[0.5, 0.5, 0.45, 16]}
              rotation={[Math.PI / 2, 0, 0]}
              material={rimMaterial}
            />
            
            {/* Rim spokes */}
            {[0, 1, 2, 3, 4].map((spoke) => (
              <Box
                key={`spoke-${index}-${spoke}`}
                position={[0, 0, 0]}
                scale={[0.05, 0.4, 0.05]}
                rotation={[0, 0, (spoke * Math.PI) / 2.5]}
                material={rimMaterial}
              />
            ))}
            
            {/* Center cap */}
            <Cylinder
              args={[0.15, 0.15, 0.5, 16]}
              rotation={[Math.PI / 2, 0, 0]}
              material={new THREE.MeshStandardMaterial({ 
                color: '#00f2fe', 
                metalness: 0.9, 
                emissive: '#004d5c',
                emissiveIntensity: 0.2
              })}
            />
          </group>
        ))}

        {/* Enhanced Glass Elements */}
        <group>
          {/* Windshield */}
          <Box
            position={[1.0, 0.8, 0]}
            scale={[0.8, 1.0, 1.8]}
            rotation={[0, 0, -0.2]}
            material={glassMaterial}
          />
          
          {/* Rear window */}
          <Box
            position={[-1.2, 0.8, 0]}
            scale={[0.6, 0.8, 1.8]}
            rotation={[0, 0, 0.15]}
            material={glassMaterial}
          />
          
          {/* Side windows */}
          <Box
            position={[0.3, 0.9, 1.15]}
            scale={[2.0, 0.6, 0.05]}
            material={glassMaterial}
          />
          <Box
            position={[0.3, 0.9, -1.15]}
            scale={[2.0, 0.6, 0.05]}
            material={glassMaterial}
          />
        </group>

        {/* Interior Details */}
        <group>
          {/* Dashboard */}
          <Box
            position={[1.2, 0.2, 0]}
            scale={[0.8, 0.3, 1.6]}
            material={interiorMaterial}
          />
          
          {/* Seats */}
          {[[0.5, 0.1, 0.4], [0.5, 0.1, -0.4], [-0.5, 0.1, 0.4], [-0.5, 0.1, -0.4]].map((position, index) => (
            <Box
              key={`seat-${index}`}
              position={position}
              scale={[0.4, 0.3, 0.4]}
              material={interiorMaterial}
            />
          ))}
          
          {/* Steering wheel */}
          <Cylinder
            position={[1.0, 0.4, 0.4]}
            args={[0.2, 0.2, 0.05, 16]}
            rotation={[0, 0, Math.PI / 2]}
            material={interiorMaterial}
          />
        </group>

        {/* Enhanced LED Lighting */}
        <group>
          {/* Front headlights - more realistic */}
          {[[-0.3, 0.2, 2.25], [0.3, 0.2, 2.25]].map((position, index) => (
            <group key={`headlight-${index}`} position={position}>
              <Sphere
                args={[0.15, 16, 16]}
                material={new THREE.MeshStandardMaterial({ 
                  color: '#ffffff',
                  emissive: '#60a5fa',
                  emissiveIntensity: 0.8,
                  metalness: 0.1,
                  roughness: 0.1
                })}
              />
              <Cylinder
                position={[0, 0, -0.1]}
                args={[0.12, 0.12, 0.1, 16]}
                material={new THREE.MeshStandardMaterial({ 
                  color: '#1e40af',
                  emissive: '#3b82f6',
                  emissiveIntensity: 0.5
                })}
              />
            </group>
          ))}
          
          {/* Rear lights */}
          {[[-0.4, 0.2, -2.25], [0.4, 0.2, -2.25]].map((position, index) => (
            <Box
              key={`taillight-${index}`}
              position={position}
              scale={[0.15, 0.1, 0.05]}
              material={new THREE.MeshStandardMaterial({ 
                color: '#dc2626',
                emissive: '#ef4444',
                emissiveIntensity: 0.6
              })}
            />
          ))}
          
          {/* Side mirrors */}
          {[[0.8, 0.8, 1.3], [0.8, 0.8, -1.3]].map((position, index) => (
            <Box
              key={`mirror-${index}`}
              position={position}
              scale={[0.2, 0.15, 0.1]}
              material={bodyMaterial}
            />
          ))}
        </group>

        {/* Door Handles and Details */}
        <group onClick={() => handlePartClick('doors')}>
          {[[0.5, 0.3, 1.15], [0.5, 0.3, -1.15], [-0.5, 0.3, 1.15], [-0.5, 0.3, -1.15]].map((position, index) => (
            <Box
              key={`door-handle-${index}`}
              position={position}
              scale={[0.15, 0.05, 0.05]}
              material={new THREE.MeshStandardMaterial({ 
                color: '#6b7280',
                metalness: 0.8,
                roughness: 0.2
              })}
            />
          ))}
        </group>

        {/* Brand Badge */}
        <Cylinder
          position={[0, 0.4, 2.2]}
          args={[0.1, 0.1, 0.02, 16]}
          material={new THREE.MeshStandardMaterial({ 
            color: '#00f2fe',
            emissive: '#004d5c',
            emissiveIntensity: 0.3,
            metalness: 0.9
          })}
        />

        {/* Dynamic Labels - Temporarily removed to fix rendering issues */}
        {/* Will add HTML overlays instead of 3D text */}
      </group>
    </Float>
  );
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-full w-full bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 rounded-2xl overflow-hidden relative shadow-2xl border border-gray-200"
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
          toneMappingExposure: 1.0
        }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Optimized Lighting Setup */}
        <ambientLight intensity={0.6} color="#f8fafc" />
        
        {/* Main directional light */}
        <directionalLight 
          position={[8, 8, 5]} 
          intensity={1.2} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={30}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
        
        {/* Fill lights for better illumination */}
        <pointLight 
          position={[-6, 4, -6]} 
          intensity={0.8} 
          color="#60a5fa"
          distance={15}
          decay={2}
        />
        
        <pointLight 
          position={[6, 4, 6]} 
          intensity={0.8} 
          color="#34d399"
          distance={15}
          decay={2}
        />
        
        {/* Rim light for dramatic effect */}
        <spotLight
          position={[0, 10, -8]}
          angle={0.3}
          penumbra={0.5}
          intensity={1.0}
          color="#a855f7"
          distance={20}
          decay={2}
        />
        
        {/* 3D Model with enhanced presentation controls */}
        <PresentationControls
          global
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 1200 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <ModernEVModel onPartClick={onPartSelect} selectedPart={selectedPart} />
        </PresentationControls>

        {/* Enhanced Orbit Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={15}
          minDistance={5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
          autoRotateSpeed={0.5}
          dampingFactor={0.05}
          enableDamping={true}
        />
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