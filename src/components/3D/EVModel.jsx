import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, PresentationControls, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const ModernEVModel = ({ onPartClick, selectedPart }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005; // Slow continuous rotation
    }
  });

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  // Get dynamic label based on selected part
  const getPartLabel = () => {
    if (!selectedPart) return "Interactive EV Model";
    
    const partLabels = {
      'battery': 'High-Performance Lithium-Ion Battery Pack',
      'motor': 'High-Efficiency Electric Motor',
      'charging-port': 'Fast Charging Port (CCS Type 2)',
      'control-unit': 'Vehicle Control Unit',
      'cooling-system': 'Battery Thermal Management System'
    };
    
    return partLabels[selectedPart] || "EV Component Selected";
  };

  // Create materials with enhanced lighting and consistent electric theme
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#4facfe', // Electric blue to match favicon
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
  }), []);
  
  const batteryMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#00f2fe', // Primary electric color from favicon
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#00f2fe',
    emissiveIntensity: selectedPart === 'battery' ? 0.4 : 0.2,
    envMapIntensity: 1.2,
    clearcoat: 0.8,
    transmission: 0.1,
    thickness: 0.5
  }), [selectedPart]);

  const motorMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#2dd4bf', // Complementary electric teal
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#0f766e',
    emissiveIntensity: selectedPart === 'motor' ? 0.3 : 0.15,
    envMapIntensity: 1.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  }), [selectedPart]);

  const chargingMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#00f2fe', // Match primary electric color
    metalness: 0.7,
    roughness: 0.2,
    emissive: '#00f2fe',
    emissiveIntensity: selectedPart === 'charging-port' ? 0.6 : 0.4,
    envMapIntensity: 1.0,
    iridescence: 1.0,
    iridescenceIOR: 1.3,
  }), [selectedPart]);

  const controlMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#5eead4', // Light electric blue-green
    metalness: 0.6,
    roughness: 0.3,
    emissive: '#14b8a6',
    emissiveIntensity: selectedPart === 'control-unit' ? 0.2 : 0.1,
    envMapIntensity: 1.0,
    transmission: 0.2,
    thickness: 0.8,
  }), [selectedPart]);

  const coolingMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#38bdf8', // Cool blue for cooling system
    metalness: 0.7,
    roughness: 0.25,
    emissive: '#0ea5e9',
    emissiveIntensity: selectedPart === 'cooling-system' ? 0.3 : 0.15,
    envMapIntensity: 1.1,
    clearcoat: 0.6,
  }), [selectedPart]);

  const wheelMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#0f172a', // Dark color for contrast
    metalness: 0.8,
    roughness: 0.4,
    envMapIntensity: 0.8
  }), []);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={[1.5, 1.5, 1.5]} position={[0, -0.5, 0]}>
        {/* Enhanced Car Body - More realistic EV shape */}
        <Box
          position={[0, 0, 0]}
          scale={[4.2, 1.5, 2.0]}
          onClick={() => handlePartClick('body')}
          material={bodyMaterial}
        />
        
        {/* Car Roof - Separate for better realism */}
        <Box
          position={[0.3, 0.8, 0]}
          scale={[3.0, 0.4, 1.8]}
          onClick={() => handlePartClick('body')}
          material={bodyMaterial}
        />

        {/* Enhanced Battery Pack - More realistic position and size */}
        <Box
          position={[0, -1.1, 0]}
          scale={[3.8, 0.5, 1.8]}
          onClick={() => handlePartClick('battery')}
          material={batteryMaterial}
        />
        
        {/* Secondary battery cells */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, index) => (
          <Box
            key={index}
            position={[x, -1.3, 0]}
            scale={[0.6, 0.2, 1.6]}
            onClick={() => handlePartClick('battery')}
            material={batteryMaterial}
          />
        ))}

        {/* Enhanced Electric Motor - Dual motor setup */}
        <Cylinder
          position={[1.6, -0.6, 0]}
          args={[0.5, 0.5, 0.8, 16]}
          onClick={() => handlePartClick('motor')}
          material={motorMaterial}
        />
        <Cylinder
          position={[-1.6, -0.6, 0]}
          args={[0.5, 0.5, 0.8, 16]}
          onClick={() => handlePartClick('motor')}
          material={motorMaterial}
        />

        {/* Enhanced Charging Port - More realistic position */}
        <Box
          position={[-2.1, 0.2, 0.8]}
          scale={[0.3, 0.3, 0.2]}
          onClick={() => handlePartClick('charging-port')}
          material={chargingMaterial}
        />
        
        {/* Charging port cover */}
        <Box
          position={[-2.2, 0.2, 0.8]}
          scale={[0.1, 0.4, 0.3]}
          onClick={() => handlePartClick('charging-port')}
          material={bodyMaterial}
        />

        {/* Enhanced Control Unit */}
        <Box
          position={[0, 0.8, 0]}
          scale={[1.2, 0.6, 1]}
          onClick={() => handlePartClick('control-unit')}
          material={controlMaterial}
        />

        {/* Cooling System - Radiator/heat exchanger */}
        <Box
          position={[2.0, -0.8, 0]}
          scale={[0.3, 0.8, 1.5]}
          onClick={() => handlePartClick('cooling-system')}
          material={coolingMaterial}
        />
        
        {/* Cooling pipes */}
        {[0.2, -0.2].map((y, index) => (
          <Cylinder
            key={index}
            position={[1.7, y, 0]}
            args={[0.05, 0.05, 1.2, 8]}
            rotation={[0, 0, Math.PI / 2]}
            onClick={() => handlePartClick('cooling-system')}
            material={coolingMaterial}
          />
        ))}

        {/* Enhanced Wheels with rotation */}
        {[[-1.8, -1.5, 1.2], [1.8, -1.5, 1.2], [-1.8, -1.5, -1.2], [1.8, -1.5, -1.2]].map((position, index) => (
          <group key={index} position={position}>
            <Cylinder
              args={[0.6, 0.6, 0.4, 32]}
              rotation={[Math.PI / 2, 0, 0]}
              material={wheelMaterial}
            />
            {/* Wheel rims */}
            <Cylinder
              args={[0.3, 0.3, 0.45, 16]}
              rotation={[Math.PI / 2, 0, 0]}
              material={new THREE.MeshStandardMaterial({ 
                color: '#9ca3af',
                metalness: 0.9,
                roughness: 0.1
              })}
            />
          </group>
        ))}

        {/* Windshield - Electric blue tint */}
        <Box
          position={[1.3, 0.5, 0]}
          scale={[0.6, 1.0, 1.6]}
          material={new THREE.MeshStandardMaterial({ 
            color: '#00f2fe',
            transparent: true,
            opacity: 0.2,
            metalness: 0.1,
            roughness: 0.05
          })}
        />

        {/* LED Headlights - Electric blue theme */}
        {[[-0.4, 0.1, 2.1], [0.4, 0.1, 2.1]].map((position, index) => (
          <Sphere
            key={index}
            position={position}
            args={[0.12, 16, 16]}
            material={new THREE.MeshStandardMaterial({ 
              color: '#ffffff',
              emissive: '#00f2fe',
              emissiveIntensity: 0.8
            })}
          />
        ))}
        
        {/* Front grille/badge */}
        <Box
          position={[0, 0.3, 2.0]}
          scale={[0.8, 0.3, 0.05]}
          material={new THREE.MeshStandardMaterial({ 
            color: '#0f172a',
            metalness: 0.9,
            roughness: 0.1
          })}
        />

        {/* Dynamic Labels */}
        <Text
          position={[0, 4, 0]}
          fontSize={0.8}
          color="#00f2fe"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          InvenAI EV Model
        </Text>

        {/* Dynamic Part Label */}
        <Text
          position={[0, -3.5, 0]}
          fontSize={0.4}
          color={selectedPart ? "#4facfe" : "#94a3b8"}
          anchorX="center"
          anchorY="middle"
        >
          {getPartLabel()}
        </Text>
      </group>
    </Float>
  );
};

const EVModel = ({ onPartSelect, selectedPart }) => {
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
      
      {/* 3D Scene */}
      <Canvas 
        camera={{ position: [10, 8, 10], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        shadows
        dpr={[1, 2]}
      >
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.8} color="#ffffff" />
        
        {/* Key Light - Main illumination */}
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* Fill Light - Electric theme */}
        <pointLight 
          position={[-8, 6, -8]} 
          intensity={1.2} 
          color="#00f2fe"
          distance={20}
          decay={2}
        />
        
        {/* Rim Light - Highlights edges */}
        <pointLight 
          position={[5, 8, -10]} 
          intensity={1.5} 
          color="#4facfe"
          distance={25}
          decay={2}
        />
        
        {/* Accent Light - Electric glow */}
        <spotLight
          position={[0, 12, 8]}
          angle={0.4}
          penumbra={0.8}
          intensity={1.8}
          color="#00f2fe"
          distance={30}
          decay={2}
        />
        
        {/* Environment-style lighting */}
        <pointLight 
          position={[0, -5, 0]} 
          intensity={0.6} 
          color="#0ea5e9"
          distance={15}
        />
        
        {/* 3D Model */}
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
        >
          <ModernEVModel onPartClick={onPartSelect} selectedPart={selectedPart} />
        </PresentationControls>

        {/* Enhanced Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={8}
          maxPolarAngle={Math.PI / 2}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-2">Interactive 3D Model</h3>
          <p className="text-sm text-gray-700 mb-3">Click on parts to view details</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
              <span className="text-gray-700">Body & Chassis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-electric-400 to-electric-500 rounded-full"></div>
              <span className="text-gray-700">Battery Pack</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-neon-500 to-neon-600 rounded-full"></div>
              <span className="text-gray-700">Electric Motor</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50 pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">Model Status</div>
            <div className="flex items-center justify-center mt-1 space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-700">Live</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-white/50 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-4 text-sm text-gray-700 font-medium">
            <span>🖱️ Drag to rotate</span>
            <span>🔍 Scroll to zoom</span>
            <span>👆 Click parts to inspect</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EVModel;