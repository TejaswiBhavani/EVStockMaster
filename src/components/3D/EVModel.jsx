import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, RoundedBox, Cylinder, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Enhanced EV Part Component with realistic geometries
const EVPart = ({ position, size, color, label, partId, onPartClick, isSelected, isHovered, onHover, type = 'box', metalness = 0.3, roughness = 0.4 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.rotation.y += 0.015;
        meshRef.current.scale.setScalar(1.08 + Math.sin(state.clock.elapsedTime * 3) * 0.03);
      } else if (isHovered) {
        meshRef.current.scale.setScalar(1.04);
      } else {
        meshRef.current.scale.setScalar(1);
        meshRef.current.rotation.y = 0;
      }
    }
  });

  const renderGeometry = () => {
    const baseProps = {
      ref: meshRef,
      position: position,
      onClick: () => onPartClick(partId),
      onPointerOver: () => onHover(partId),
      onPointerOut: () => onHover(null)
    };

    const material = (
      <meshStandardMaterial 
        color={isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : color}
        metalness={isSelected || isHovered ? 0.7 : metalness}
        roughness={isSelected || isHovered ? 0.2 : roughness}
        transparent
        opacity={0.9}
        emissive={isSelected ? '#1e40af' : isHovered ? '#2563eb' : '#000000'}
        emissiveIntensity={isSelected ? 0.1 : isHovered ? 0.05 : 0}
      />
    );

    switch (type) {
      case 'rounded':
        return (
          <RoundedBox {...baseProps} args={size} radius={0.1} smoothness={4}>
            {material}
          </RoundedBox>
        );
      case 'cylinder':
        return (
          <Cylinder {...baseProps} args={[size[0], size[1], size[2], 32]}>
            {material}
          </Cylinder>
        );
      case 'sphere':
        return (
          <Sphere {...baseProps} args={[size[0], 32, 32]}>
            {material}
          </Sphere>
        );
      default:
        return (
          <RoundedBox {...baseProps} args={size} radius={0.05} smoothness={2}>
            {material}
          </RoundedBox>
        );
    }
  };

  return (
    <group>
      {renderGeometry()}
      {(isSelected || isHovered) && (
        <Text
          position={[position[0], position[1] + (size[1] || size[0]) + 0.8, position[2]]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

// Enhanced EV Model Scene with realistic car structure
const EVModelScene = ({ onPartSelect, selectedPart }) => {
  const [hoveredPart, setHoveredPart] = useState(null);
  
  // Realistic EV parts with better proportions and geometries
  const evParts = [
    // Main chassis/body
    {
      id: 'chassis',
      label: 'Chassis Frame',
      position: [0, 0, 0],
      size: [5, 1.2, 2.2],
      color: '#e5e7eb',
      type: 'rounded',
      metalness: 0.8,
      roughness: 0.2
    },
    // Battery pack (underneath)
    {
      id: 'battery',
      label: 'Battery Pack',
      position: [0, -0.8, 0],
      size: [4.2, 0.4, 1.8],
      color: '#10b981',
      type: 'rounded',
      metalness: 0.6,
      roughness: 0.3
    },
    // Electric motor (front)
    {
      id: 'motor',
      label: 'Electric Motor',
      position: [1.8, -0.3, 0],
      size: [1.2, 0.8, 1.2],
      color: '#f59e0b',
      type: 'cylinder',
      metalness: 0.9,
      roughness: 0.1
    },
    // Windshield
    {
      id: 'windshield',
      label: 'Windshield',
      position: [0.5, 0.8, 0],
      size: [1.5, 1, 2],
      color: '#60a5fa',
      type: 'rounded',
      metalness: 0.1,
      roughness: 0.0
    },
    // Dashboard/interior
    {
      id: 'dashboard',
      label: 'Dashboard',
      position: [0.8, 0.2, 0],
      size: [1.8, 0.3, 1.8],
      color: '#1f2937',
      type: 'rounded',
      metalness: 0.2,
      roughness: 0.6
    },
    // Seats
    {
      id: 'seats',
      label: 'Seats',
      position: [-0.3, 0.1, 0],
      size: [1.6, 0.6, 1.6],
      color: '#7c3aed',
      type: 'rounded',
      metalness: 0.1,
      roughness: 0.8
    },
    // Rear section
    {
      id: 'rear',
      label: 'Rear Section',
      position: [-1.8, 0.1, 0],
      size: [1.4, 0.8, 2],
      color: '#e5e7eb',
      type: 'rounded',
      metalness: 0.7,
      roughness: 0.3
    }
  ];

  // Enhanced wheels data
  const wheels = [
    { position: [1.8, -1, 1.2], id: 'front-right' },
    { position: [1.8, -1, -1.2], id: 'front-left' },
    { position: [-1.8, -1, 1.2], id: 'rear-right' },
    { position: [-1.8, -1, -1.2], id: 'rear-left' }
  ];

  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, 8, -5]} intensity={0.6} />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#60a5fa" />
      <pointLight position={[0, -2, -5]} intensity={0.4} color="#f59e0b" />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#1e293b', 15, 25]} />
      
      {/* Main EV parts */}
      {evParts.map((part) => (
        <EVPart
          key={part.id}
          partId={part.id}
          label={part.label}
          position={part.position}
          size={part.size}
          color={part.color}
          type={part.type}
          metalness={part.metalness}
          roughness={part.roughness}
          onPartClick={onPartSelect}
          isSelected={selectedPart === part.id}
          isHovered={hoveredPart === part.id}
          onHover={setHoveredPart}
        />
      ))}
      
      {/* Enhanced wheels with realistic appearance */}
      {wheels.map((wheel, index) => (
        <EVPart
          key={`wheel-${index}`}
          partId="wheels"
          label={index === 0 ? "Wheels" : ""}
          position={wheel.position}
          size={[0.35, 0.2, 0.35]}
          color="#374151"
          type="cylinder"
          metalness={0.8}
          roughness={0.2}
          onPartClick={onPartSelect}
          isSelected={selectedPart === 'wheels'}
          isHovered={hoveredPart === 'wheels'}
          onHover={setHoveredPart}
        />
      ))}

      {/* Headlights */}
      <EVPart
        partId="headlights"
        label="Headlights"
        position={[2.6, 0.1, 0.8]}
        size={[0.15]}
        color="#f0f9ff"
        type="sphere"
        metalness={0.9}
        roughness={0.1}
        onPartClick={onPartSelect}
        isSelected={selectedPart === 'headlights'}
        isHovered={hoveredPart === 'headlights'}
        onHover={setHoveredPart}
      />
      <EVPart
        partId="headlights"
        label=""
        position={[2.6, 0.1, -0.8]}
        size={[0.15]}
        color="#f0f9ff"
        type="sphere"
        metalness={0.9}
        roughness={0.1}
        onPartClick={onPartSelect}
        isSelected={selectedPart === 'headlights'}
        isHovered={hoveredPart === 'headlights'}
        onHover={setHoveredPart}
      />
      
      {/* Enhanced orbit controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={6}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Enhanced Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 m-auto border-4 border-transparent border-t-blue-400 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-gray-700 font-semibold text-lg">Loading 3D Model...</p>
      <p className="text-sm text-gray-500 mt-2">Initializing enhanced EV components</p>
      <div className="mt-4 w-48 mx-auto bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
      </div>
    </div>
  </div>
);

// Enhanced Main EVModel Component
const EVModel = ({ onPartSelect, selectedPart }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-xl"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-xl overflow-hidden shadow-2xl border border-blue-200"
    >
      <div className="h-full relative">
        <Canvas
          camera={{ position: [8, 4, 8], fov: 50 }}
          style={{ 
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)'
          }}
          shadows
        >
          <EVModelScene onPartSelect={onPartSelect} selectedPart={selectedPart} />
        </Canvas>
        
        {/* Enhanced Controls Overlay */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20"
        >
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            3D Controls
          </h3>
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🖱️</span>
              <span>Click & drag to rotate</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔍</span>
              <span>Scroll to zoom</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">👆</span>
              <span>Click parts to inspect</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Part Info Overlay */}
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-xl max-w-xs border border-white/20"
          >
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <h4 className="font-bold text-gray-800">Selected Component</h4>
            </div>
            <p className="text-lg font-semibold text-blue-600 capitalize mb-1">
              {selectedPart.replace('-', ' ').replace('_', ' ')}
            </p>
            <p className="text-xs text-gray-500">
              ✨ Enhanced 3D visualization active
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                💡 Click the info panel for detailed specifications
              </p>
            </div>
          </motion.div>
        )}

        {/* Performance indicator */}
        <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-xs text-white/80">🚀 WebGL Enhanced</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EVModel;