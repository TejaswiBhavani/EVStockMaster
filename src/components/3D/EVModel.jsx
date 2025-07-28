import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Individual EV Part Component
const EVPart = ({ position, size, color, label, partId, onPartClick, isSelected, isHovered, onHover }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.rotation.y += 0.02;
        meshRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
      } else if (isHovered) {
        meshRef.current.scale.setScalar(1.05);
      } else {
        meshRef.current.scale.setScalar(1);
        meshRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <group>
      <Box
        ref={meshRef}
        position={position}
        args={size}
        onClick={() => onPartClick(partId)}
        onPointerOver={() => onHover(partId)}
        onPointerOut={() => onHover(null)}
      >
        <meshStandardMaterial 
          color={isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : color}
          transparent
          opacity={0.8}
        />
      </Box>
      {(isSelected || isHovered) && (
        <Text
          position={[position[0], position[1] + size[1]/2 + 0.5, position[2]]}
          fontSize={0.3}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

// Main EV Model Component
const EVModelScene = ({ onPartSelect, selectedPart }) => {
  const [hoveredPart, setHoveredPart] = useState(null);
  
  const evParts = [
    {
      id: 'battery',
      label: 'Battery Pack',
      position: [0, -1, 0],
      size: [3, 0.5, 2],
      color: '#10b981'
    },
    {
      id: 'motor',
      label: 'Electric Motor',
      position: [0, 0, -1],
      size: [1.5, 1, 1.5],
      color: '#f59e0b'
    },
    {
      id: 'chassis',
      label: 'Chassis Frame',
      position: [0, -0.5, 0],
      size: [4, 0.2, 2.5],
      color: '#6b7280'
    },
    {
      id: 'wheels',
      label: 'Wheels',
      position: [0, -1.2, 0],
      size: [0.3, 0.3, 0.3],
      color: '#374151'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      position: [0, 0.5, 1],
      size: [2, 0.3, 0.2],
      color: '#1f2937'
    },
    {
      id: 'seats',
      label: 'Seats',
      position: [0, 0, 0.5],
      size: [1.8, 0.8, 0.8],
      color: '#7c3aed'
    }
  ];

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {evParts.map((part) => (
        <EVPart
          key={part.id}
          partId={part.id}
          label={part.label}
          position={part.position}
          size={part.size}
          color={part.color}
          onPartClick={onPartSelect}
          isSelected={selectedPart === part.id}
          isHovered={hoveredPart === part.id}
          onHover={setHoveredPart}
        />
      ))}
      
      {/* Additional wheels */}
      <EVPart
        partId="wheels"
        label=""
        position={[1.5, -1.2, 1]}
        size={[0.3, 0.3, 0.3]}
        color="#374151"
        onPartClick={onPartSelect}
        isSelected={selectedPart === 'wheels'}
        isHovered={hoveredPart === 'wheels'}
        onHover={setHoveredPart}
      />
      <EVPart
        partId="wheels"
        label=""
        position={[-1.5, -1.2, 1]}
        size={[0.3, 0.3, 0.3]}
        color="#374151"
        onPartClick={onPartSelect}
        isSelected={selectedPart === 'wheels'}
        isHovered={hoveredPart === 'wheels'}
        onHover={setHoveredPart}
      />
      <EVPart
        partId="wheels"
        label=""
        position={[1.5, -1.2, -1]}
        size={[0.3, 0.3, 0.3]}
        color="#374151"
        onPartClick={onPartSelect}
        isSelected={selectedPart === 'wheels'}
        isHovered={hoveredPart === 'wheels'}
        onHover={setHoveredPart}
      />
      <EVPart
        partId="wheels"
        label=""
        position={[-1.5, -1.2, -1]}
        size={[0.3, 0.3, 0.3]}
        color="#374151"
        onPartClick={onPartSelect}
        isSelected={selectedPart === 'wheels'}
        isHovered={hoveredPart === 'wheels'}
        onHover={setHoveredPart}
      />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
      />
    </>
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
          </div>
        </div>

        {/* Part Info Overlay */}
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs"
          >
            <h4 className="font-semibold text-gray-800 mb-1">Selected Part</h4>
            <p className="text-sm text-primary-600 capitalize">{selectedPart.replace('-', ' ')}</p>
            <p className="text-xs text-gray-500 mt-1">Click the info panel for details</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EVModel;