import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Individual EV Part Component
const EVPart = ({ position, size, color, label, partId, onPartClick, isSelected, isHovered, onHover, rotation = [0, 0, 0] }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
      } else if (isHovered) {
        meshRef.current.scale.setScalar(1.05);
        meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime) * 0.05;
      } else {
        meshRef.current.scale.setScalar(1);
        meshRef.current.rotation.set(...rotation);
      }
    }
  });

  return (
    <group>
      <Box
        ref={meshRef}
        position={position}
        rotation={rotation}
        args={size}
        onClick={() => onPartClick(partId)}
        onPointerOver={() => onHover(partId)}
        onPointerOut={() => onHover(null)}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : color}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.1}
        />
      </Box>
      {(isSelected || isHovered) && (
        <Text
          position={[position[0], position[1] + size[1]/2 + 0.5, position[2]]}
          fontSize={0.25}
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

// EV Car Body Component
const EVCarBody = ({ selectedPart, hoveredPart, onPartSelect, setHoveredPart }) => {
  const evParts = [
    {
      id: 'battery',
      label: 'Battery Pack',
      position: [0, -0.8, 0],
      size: [3.5, 0.4, 2],
      color: '#10b981',
      rotation: [0, 0, 0]
    },
    {
      id: 'motor',
      label: 'Electric Motor',
      position: [0, -0.2, -0.8],
      size: [1.2, 0.8, 1.2],
      color: '#f59e0b',
      rotation: [0, 0, 0]
    },
    {
      id: 'chassis',
      label: 'Chassis Frame',
      position: [0, -0.4, 0],
      size: [4, 0.15, 2.5],
      color: '#6b7280',
      rotation: [0, 0, 0]
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      position: [0, 0.3, 1.2],
      size: [2.5, 0.2, 0.15],
      color: '#1f2937',
      rotation: [0, 0, 0]
    },
    {
      id: 'seats',
      label: 'Seats',
      position: [0, 0, 0.3],
      size: [1.8, 0.6, 0.8],
      color: '#7c3aed',
      rotation: [0, 0, 0]
    },
    {
      id: 'charging-port',
      label: 'Charging Port',
      position: [-1.8, 0, 1],
      size: [0.3, 0.3, 0.2],
      color: '#06b6d4',
      rotation: [0, 0, 0]
    }
  ];

  // Wheel positions
  const wheelPositions = [
    [1.4, -1, 1],    // Front right
    [-1.4, -1, 1],   // Front left
    [1.4, -1, -1],   // Rear right
    [-1.4, -1, -1]   // Rear left
  ];

  return (
    <group>
      {/* Main EV Parts */}
      {evParts.map((part) => (
        <EVPart
          key={part.id}
          partId={part.id}
          label={part.label}
          position={part.position}
          size={part.size}
          color={part.color}
          rotation={part.rotation}
          onPartClick={onPartSelect}
          isSelected={selectedPart === part.id}
          isHovered={hoveredPart === part.id}
          onHover={setHoveredPart}
        />
      ))}
      
      {/* Wheels */}
      {wheelPositions.map((position, index) => (
        <EVPart
          key={`wheel-${index}`}
          partId="wheels"
          label={index === 0 ? "Wheels" : ""}
          position={position}
          size={[0.25, 0.6, 0.6]}
          color="#374151"
          rotation={[Math.PI / 2, 0, 0]}
          onPartClick={onPartSelect}
          isSelected={selectedPart === 'wheels'}
          isHovered={hoveredPart === 'wheels'}
          onHover={setHoveredPart}
        />
      ))}
      
      {/* Car Body Shell */}
      <Box
        position={[0, 0.2, 0]}
        args={[3.8, 1.2, 2.3]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#e5e7eb"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.8}
        />
      </Box>
      
      {/* Ground Shadow */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={4}
      />
    </group>
  );
};

// Main EV Model Component
const EVModelScene = ({ onPartSelect, selectedPart }) => {
  const [hoveredPart, setHoveredPart] = useState(null);

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#60a5fa" />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* EV Car */}
      <EVCarBody
        onPartClick={onPartSelect}
        isSelected={selectedPart === 'wheels'}
        isHovered={hoveredPart === 'wheels'}
        isSelected={selectedPart === 'wheels'}
        isHovered={hoveredPart === 'wheels'}
        setHoveredPart={setHoveredPart}
      
      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
        autoRotate={!selectedPart && !hoveredPart}
        autoRotateSpeed={0.5}
      />
    </group>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading 3D Model...</p>
      <p className="text-sm text-gray-500 mt-2">Initializing EV components</p>
    </div>
  </div>
);

// Main EVModel Component
const EVModel = ({ onPartSelect, selectedPart }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden shadow-lg"
    >
      <div className="h-full relative">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 60 }}
          style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}
        >
          <EVModelScene onPartSelect={onPartSelect} selectedPart={selectedPart} />
        </Canvas>
        
        {/* Controls Overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-2">3D Controls</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>🖱️ Click & drag to rotate</p>
            <p>🔍 Scroll to zoom</p>
            <p>👆 Click parts to select</p>
            <p>🔄 Auto-rotate when idle</p>
          </div>
        </div>

        {/* Part Info Overlay */}
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            camera={{ position: [6, 4, 6], fov: 50 }}
            shadows
            style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}
          >
            <h4 className="font-semibold text-gray-800 mb-1">Selected Part</h4>
            <p className="text-sm text-primary-600 capitalize">
              {selectedPart.replace('-', ' ').replace('_', ' ')}
            </p>
            <p className="text-xs text-gray-500 mt-1">Click the info panel for details</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EVModel;