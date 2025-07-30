import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, PresentationControls, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const ModernEVModel = ({ onPartClick }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  // Create materials with enhanced lighting and consistent electric theme
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#4facfe', // Electric blue to match favicon
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.0,
  }), []);
  
  const batteryMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#00f2fe', // Primary electric color from favicon
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#00f2fe',
    emissiveIntensity: 0.2
  }), []);

  const motorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#2dd4bf', // Complementary electric teal
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#0f766e',
    emissiveIntensity: 0.15
  }), []);

  const chargingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#00f2fe', // Match primary electric color
    metalness: 0.7,
    roughness: 0.2,
    emissive: '#00f2fe',
    emissiveIntensity: 0.4
  }), []);

  const controlMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#5eead4', // Light electric blue-green
    metalness: 0.6,
    roughness: 0.3,
    emissive: '#14b8a6',
    emissiveIntensity: 0.1
  }), []);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#0f172a', // Dark color for contrast
    metalness: 0.8,
    roughness: 0.4
  }), []);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
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

        {/* Updated Labels with electric theme */}
        <Text
          position={[0, 3, 0]}
          fontSize={0.6}
          color="#00f2fe"
          anchorX="center"
          anchorY="middle"
        >
          EVStockMaster
        </Text>

        {/* Part Labels */}
        <Text
          position={[0, -2.5, 0]}
          fontSize={0.3}
          color="#4facfe"
          anchorX="center"
          anchorY="middle"
        >
          High-Performance EV Battery
        </Text>
      </group>
    </Float>
  );
};

const EVModel = ({ onPartSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden relative shadow-2xl"
    >
      {/* Electric Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-400/10 via-electric-500/10 to-electric-400/10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-electric-400/5 to-transparent"></div>
      
      {/* 3D Scene */}
      <Canvas 
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        shadows
        dpr={[1, 2]}
      >
        {/* Enhanced Lighting with electric theme */}
        <ambientLight intensity={0.6} color="#f0fdff" />
        <pointLight 
          position={[10, 10, 10]} 
          intensity={1.2} 
          color="#00f2fe"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight 
          position={[-10, 5, -10]} 
          intensity={0.8} 
          color="#4facfe"
        />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#00f2fe"
          castShadow
        />
        
        {/* 3D Model */}
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
        >
          <ModernEVModel onPartClick={onPartSelect} />
        </PresentationControls>

        {/* Enhanced Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={25}
          minDistance={5}
          maxPolarAngle={Math.PI / 2}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <motion.div 
          className="glass-card p-4 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-2">Interactive 3D Model</h3>
          <p className="text-sm text-gray-600 mb-3">Click on parts to view details</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Body & Chassis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Battery Pack</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Electric Motor</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-card p-3 pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-700">Model Status</div>
            <div className="flex items-center justify-center mt-1 space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Live</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
        <motion.div 
          className="glass-card px-6 py-3 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-4 text-sm text-gray-600">
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