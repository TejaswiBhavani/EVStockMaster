import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Component for individual EV parts
const EVPart = ({ position, color, size = [1, 1, 1], name, partId, onSelect, isSelected }) => {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (mesh.current) {
      if (hovered || isSelected) {
        mesh.current.rotation.y += delta * 0.5;
        mesh.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        mesh.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onClick={() => onSelect(partId)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={isSelected ? '#ff6b6b' : hovered ? '#4ecdc4' : color}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html position={[0, size[1] / 2 + 0.5, 0]} center>
          <div className="bg-white px-3 py-1 rounded-lg shadow-lg border text-sm font-medium">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};

// Main EV Model Component
const EVModel3D = ({ onPartSelect, selectedPart }) => {
  const evParts = [
    {
      id: 'battery-pack-001',
      name: 'Battery Pack',
      position: [0, -1.5, 0],
      color: '#3b82f6',
      size: [3, 0.5, 2]
    },
    {
      id: 'motor-001', 
      name: 'Electric Motor',
      position: [0, 0, -1],
      color: '#10b981',
      size: [1.5, 1.5, 1]
    },
    {
      id: 'chassis-001',
      name: 'Chassis Frame',
      position: [0, -0.5, 0],
      color: '#6b7280',
      size: [4, 0.3, 2.5]
    },
    {
      id: 'charging-port-001',
      name: 'Charging Port',
      position: [2, 0, 1],
      color: '#f59e0b',
      size: [0.3, 0.3, 0.3]
    },
    {
      id: 'control-unit-001',
      name: 'Control Unit',
      position: [1, 0.5, 0],
      color: '#8b5cf6',
      size: [0.8, 0.4, 0.6]
    },
    {
      id: 'cooling-system-001',
      name: 'Cooling System',
      position: [-1, 0, 0.5],
      color: '#06b6d4',
      size: [1, 0.6, 0.8]
    }
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      
      {evParts.map((part) => (
        <EVPart
          key={part.id}
          partId={part.id}
          name={part.name}
          position={part.position}
          color={part.color}
          size={part.size}
          onSelect={onPartSelect}
          isSelected={selectedPart === part.id}
        />
      ))}
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
      />
    </>
  );
};

// Main EVModel Component
const EVModel = ({ onPartSelect, selectedPart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full relative"
    >
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Interactive EV Model</h3>
        <p className="text-sm text-gray-600">Click on parts to view details</p>
      </div>

      {/* Controls Info */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <p className="text-xs text-gray-600">
          <strong>Controls:</strong><br />
          Mouse: Rotate • Scroll: Zoom • Right-click: Pan
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <EVModel3D onPartSelect={onPartSelect} selectedPart={selectedPart} />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Parts Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Battery Pack</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span>Electric Motor</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Chassis</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span>Charging Port</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-violet-500 rounded"></div>
            <span>Control Unit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span>Cooling System</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EVModel;