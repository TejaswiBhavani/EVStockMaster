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

  // Create materials with enhanced lighting
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#3b82f6',
    metalness: 0.8,
    roughness: 0.2,
  }), []);
  
  const batteryMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#10b981',
    metalness: 0.6,
    roughness: 0.3,
    emissive: '#064e3b',
    emissiveIntensity: 0.1
  }), []);

  const motorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#ef4444',
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#7f1d1d',
    emissiveIntensity: 0.2
  }), []);

  const chargingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#8b5cf6',
    metalness: 0.7,
    roughness: 0.2,
    emissive: '#581c87',
    emissiveIntensity: 0.3
  }), []);

  const controlMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#f59e0b',
    metalness: 0.5,
    roughness: 0.4,
    emissive: '#92400e',
    emissiveIntensity: 0.1
  }), []);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#374151',
    metalness: 0.8,
    roughness: 0.6
  }), []);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Enhanced Car Body */}
        <Box
          position={[0, 0, 0]}
          scale={[4.5, 1.8, 2.2]}
          onClick={() => handlePartClick('body')}
          material={bodyMaterial}
        />

        {/* Enhanced Battery Pack with glow effect */}
        <Box
          position={[0, -1.2, 0]}
          scale={[4, 0.6, 2]}
          onClick={() => handlePartClick('battery')}
          material={batteryMaterial}
        />

        {/* Enhanced Electric Motor */}
        <Cylinder
          position={[1.8, -0.5, 0]}
          args={[0.6, 0.6, 1, 16]}
          onClick={() => handlePartClick('motor')}
          material={motorMaterial}
        />

        {/* Enhanced Charging Port */}
        <Box
          position={[-2, 0.3, 1]}
          scale={[0.4, 0.4, 0.3]}
          onClick={() => handlePartClick('charging-port')}
          material={chargingMaterial}
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

        {/* Windshield */}
        <Box
          position={[1.5, 0.5, 0]}
          scale={[0.8, 1.2, 1.8]}
          material={new THREE.MeshStandardMaterial({ 
            color: '#60a5fa',
            transparent: true,
            opacity: 0.3,
            metalness: 0.1,
            roughness: 0.1
          })}
        />

        {/* Headlights */}
        {[[-0.5, 0.2, 2.3], [0.5, 0.2, 2.3]].map((position, index) => (
          <Sphere
            key={index}
            position={position}
            args={[0.15, 16, 16]}
            material={new THREE.MeshStandardMaterial({ 
              color: '#ffffff',
              emissive: '#e5e7eb',
              emissiveIntensity: 0.5
            })}
          />
        ))}

        {/* Floating Label */}
        <Text
          position={[0, 3, 0]}
          fontSize={0.6}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
        >
          Next-Gen EV Model
        </Text>

        {/* Part Labels */}
        <Text
          position={[0, -2.5, 0]}
          fontSize={0.3}
          color="#059669"
          anchorX="center"
          anchorY="middle"
        >
          High-Performance Battery
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
      className="h-full w-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-2xl overflow-hidden relative shadow-2xl"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-electric-500/10"></div>
      
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
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.6} color="#f0f9ff" />
        <pointLight 
          position={[10, 10, 10]} 
          intensity={1.2} 
          color="#3b82f6"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight 
          position={[-10, 5, -10]} 
          intensity={0.8} 
          color="#8b5cf6"
        />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#06b6d4"
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