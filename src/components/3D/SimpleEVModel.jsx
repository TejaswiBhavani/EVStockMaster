import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const SimpleCar = ({ onPartClick, selectedPart }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // Slow rotation
    }
  });

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  return (
    <group ref={groupRef} scale={[1, 1, 1]} position={[0, 0, 0]}>
      {/* Car Body */}
      <Box
        position={[0, 0, 0]}
        scale={[3, 1, 1.5]}
        onClick={() => handlePartClick('body')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'body' ? '#ff6b6b' : '#4facfe'} 
          metalness={0.5}
          roughness={0.2}
        />
      </Box>

      {/* Car Roof */}
      <Box
        position={[0, 0.7, 0]}
        scale={[2, 0.3, 1.3]}
        onClick={() => handlePartClick('body')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'body' ? '#ff6b6b' : '#4facfe'} 
          metalness={0.5}
          roughness={0.2}
        />
      </Box>

      {/* Battery Pack */}
      <Box
        position={[0, -0.8, 0]}
        scale={[2.8, 0.3, 1.3]}
        onClick={() => handlePartClick('battery')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'battery' ? '#ff9f43' : '#00f2fe'} 
          metalness={0.7}
          roughness={0.1}
          emissive={selectedPart === 'battery' ? '#ff9f43' : '#004d5c'}
          emissiveIntensity={selectedPart === 'battery' ? 0.3 : 0.1}
        />
      </Box>

      {/* Motors */}
      <Cylinder
        position={[1, -0.3, 0]}
        args={[0.3, 0.3, 0.5, 16]}
        onClick={() => handlePartClick('motor')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'motor' ? '#26de81' : '#2dd4bf'} 
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      <Cylinder
        position={[-1, -0.3, 0]}
        args={[0.3, 0.3, 0.5, 16]}
        onClick={() => handlePartClick('motor')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'motor' ? '#26de81' : '#2dd4bf'} 
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      {/* Wheels */}
      {[[-1.2, -0.8, 0.8], [1.2, -0.8, 0.8], [-1.2, -0.8, -0.8], [1.2, -0.8, -0.8]].map((position, index) => (
        <Cylinder
          key={index}
          position={position}
          args={[0.4, 0.4, 0.3, 16]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#2c3e50" metalness={0.3} roughness={0.7} />
        </Cylinder>
      ))}

      {/* Headlights */}
      <Sphere
        position={[1.5, 0, 0.4]}
        args={[0.1, 16, 16]}
      >
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#60a5fa" 
          emissiveIntensity={0.5}
        />
      </Sphere>

      <Sphere
        position={[1.5, 0, -0.4]}
        args={[0.1, 16, 16]}
      >
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#60a5fa" 
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Charging Port */}
      <Box
        position={[-1.5, 0.2, 0.7]}
        scale={[0.1, 0.2, 0.2]}
        onClick={() => handlePartClick('charging-port')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'charging-port' ? '#a855f7' : '#7c3aed'} 
          metalness={0.8}
          roughness={0.1}
          emissive={selectedPart === 'charging-port' ? '#a855f7' : '#5b21b6'}
          emissiveIntensity={selectedPart === 'charging-port' ? 0.4 : 0.2}
        />
      </Box>
    </group>
  );
};

const SimpleEVModel = ({ onPartSelect, selectedPart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="h-full w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl overflow-hidden relative"
    >
      <Canvas 
        camera={{ position: [5, 3, 5], fov: 60 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#4facfe" intensity={0.5} />

        {/* 3D Model */}
        <SimpleCar onPartClick={onPartSelect} selectedPart={selectedPart} />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={10}
          minDistance={3}
        />
      </Canvas>
    </motion.div>
  );
};

export default SimpleEVModel;