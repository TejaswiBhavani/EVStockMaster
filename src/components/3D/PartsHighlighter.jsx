import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Mock GLTF model - we'll use the existing modular components for now
// but structure it as if we're loading a GLTF model
import ModularEVModel from './ModularEVModel';

// Parts mapping for the EV model
const PARTS_MAP = {
  'chassis': {
    name: 'Chassis & Frame',
    description: 'Advanced carbon fiber chassis with integrated battery mounting',
    meshNames: ['chassis', 'frame', 'body'],
    color: '#3B82F6', // blue
    stock: 12,
    health: 'Excellent',
    lastUpdated: '2 hours ago'
  },
  'battery': {
    name: 'Battery Pack',
    description: 'High-performance lithium-ion battery system - 100kWh capacity',
    meshNames: ['battery', 'battery-pack', 'cells'],
    color: '#10B981', // emerald
    stock: 8,
    health: 'Good',
    lastUpdated: '1 hour ago'
  },
  'motor': {
    name: 'Electric Motor',
    description: 'Dual motor setup with 400HP combined output',
    meshNames: ['motor', 'motor-front', 'motor-rear'],
    color: '#8B5CF6', // purple
    stock: 15,
    health: 'Excellent',
    lastUpdated: '30 minutes ago'
  },
  'charging-port': {
    name: 'Charging Port',
    description: 'Fast charging CCS Type 2 connector (350kW capability)',
    meshNames: ['charging-port', 'connector'],
    color: '#F59E0B', // amber
    stock: 25,
    health: 'Good',
    lastUpdated: '45 minutes ago'
  },
  'wheels': {
    name: 'Wheels & Tires',
    description: 'Low rolling resistance tires with regenerative braking',
    meshNames: ['wheel', 'wheels', 'tire', 'rim'],
    color: '#6B7280', // gray
    stock: 32,
    health: 'Excellent',
    lastUpdated: '3 hours ago'
  },
  'suspension': {
    name: 'Suspension System',
    description: 'Adaptive air suspension with dynamic damping',
    meshNames: ['suspension', 'shock', 'spring'],
    color: '#EF4444', // red
    stock: 6,
    health: 'Warning',
    lastUpdated: '4 hours ago'
  }
};

// Highlighted Part Component
const HighlightedPart = ({ partId, isSelected, position = [0, 0, 0] }) => {
  const meshRef = useRef();
  const part = PARTS_MAP[partId];
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (!part) return null;

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={part.color}
          emissive={isSelected ? part.color : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glow effect when selected */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial 
            color={part.color}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  );
};

// Main PartsHighlighter Component
const PartsHighlighter = ({ onPartSelect, selectedPart }) => {
  const groupRef = useRef();
  const [hoveredPart, setHoveredPart] = useState(null);
  const [highlightedParts, setHighlightedParts] = useState(new Set());

  // Handle part click
  const handlePartClick = (partId) => {
    const partData = PARTS_MAP[partId];
    if (partData && onPartSelect) {
      onPartSelect({
        id: partId,
        ...partData
      });
    }
  };

  // Handle part hover
  const handlePartHover = (partId, isHovering) => {
    setHoveredPart(isHovering ? partId : null);
    document.body.style.cursor = isHovering ? 'pointer' : 'default';
  };

  // Auto-rotation when no part is selected
  useFrame((state) => {
    if (groupRef.current && !selectedPart) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Highlight parts based on health status
  useEffect(() => {
    const warningParts = new Set();
    Object.entries(PARTS_MAP).forEach(([partId, part]) => {
      if (part.health === 'Warning' || part.stock < 10) {
        warningParts.add(partId);
      }
    });
    setHighlightedParts(warningParts);
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group 
        ref={groupRef} 
        scale={[1.4, 1.4, 1.4]} 
        position={[0, -1, 0]}
      >
        {/* Use existing modular EV model as base */}
        <ModularEVModel 
          onPartClick={handlePartClick}
          selectedPart={selectedPart?.id}
        />

        {/* Overlay clickable zones and highlights for parts */}
        <group name="parts-overlay">
          {Object.entries(PARTS_MAP).map(([partId, part], index) => {
            const angle = (index / Object.keys(PARTS_MAP).length) * Math.PI * 2;
            const radius = 2.5;
            const position = [
              Math.cos(angle) * radius,
              0.5 + Math.sin(index) * 0.5,
              Math.sin(angle) * radius
            ];

            return (
              <group
                key={partId}
                onPointerOver={() => handlePartHover(partId, true)}
                onPointerOut={() => handlePartHover(partId, false)}
                onClick={() => handlePartClick(partId)}
              >
                <HighlightedPart
                  partId={partId}
                  isSelected={selectedPart?.id === partId || hoveredPart === partId}
                  position={position}
                />
                
                {/* Health status indicators */}
                {highlightedParts.has(partId) && (
                  <mesh position={[position[0], position[1] + 0.8, position[2]]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial 
                      color={part.health === 'Warning' ? '#F59E0B' : '#EF4444'}
                      emissive={part.health === 'Warning' ? '#F59E0B' : '#EF4444'}
                      emissiveIntensity={0.8}
                    />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>

        {/* Particle effects for selected part */}
        {selectedPart && (
          <group>
            {/* Add sparkle effects around selected part */}
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const radius = 1.5;
              return (
                <mesh 
                  key={i}
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(Date.now() * 0.001 + i) * 0.5,
                    Math.sin(angle) * radius
                  ]}
                >
                  <sphereGeometry args={[0.02, 4, 4]} />
                  <meshBasicMaterial 
                    color="#60A5FA"
                    emissive="#60A5FA"
                    emissiveIntensity={0.8}
                  />
                </mesh>
              );
            })}
          </group>
        )}
      </group>
    </Float>
  );
};

// Hook for GLTF model loading (future implementation)
export const useEVModel = (modelPath) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Future: Load GLTF model with Draco compression
    // For now, we'll use the existing modular components
    setLoading(false);
  }, [modelPath]);

  return { model, loading, error };
};

export default PartsHighlighter;