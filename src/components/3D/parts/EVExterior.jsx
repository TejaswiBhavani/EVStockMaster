import React from 'react';
import { RoundedBox } from '@react-three/drei';

const EVExterior = ({ selectedPart, onPartClick }) => {
  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  return (
    <group name="ev-exterior">
      {/* Modern LED Headlights */}
      <RoundedBox
        position={[1.4, 0.1, 0.35]}
        args={[0.08, 0.08, 0.06]}
        radius={0.02}
        onClick={() => handlePartClick('headlights')}
      >
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={selectedPart === 'headlights' ? '#60a5fa' : '#3b82f6'} 
          emissiveIntensity={selectedPart === 'headlights' ? 0.8 : 0.6}
          metalness={0.1}
          roughness={0.1}
        />
      </RoundedBox>

      <RoundedBox
        position={[1.4, 0.1, -0.35]}
        args={[0.08, 0.08, 0.06]}
        radius={0.02}
        onClick={() => handlePartClick('headlights')}
      >
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={selectedPart === 'headlights' ? '#60a5fa' : '#3b82f6'} 
          emissiveIntensity={selectedPart === 'headlights' ? 0.8 : 0.6}
          metalness={0.1}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Sleek Taillights */}
      <RoundedBox
        position={[-1.4, 0.1, 0.35]}
        args={[0.06, 0.06, 0.04]}
        radius={0.02}
        onClick={() => handlePartClick('taillights')}
      >
        <meshStandardMaterial 
          color="#dc2626" 
          emissive={selectedPart === 'taillights' ? '#ef4444' : '#dc2626'} 
          emissiveIntensity={selectedPart === 'taillights' ? 0.9 : 0.7}
        />
      </RoundedBox>

      <RoundedBox
        position={[-1.4, 0.1, -0.35]}
        args={[0.06, 0.06, 0.04]}
        radius={0.02}
        onClick={() => handlePartClick('taillights')}
      >
        <meshStandardMaterial 
          color="#dc2626" 
          emissive={selectedPart === 'taillights' ? '#ef4444' : '#dc2626'} 
          emissiveIntensity={selectedPart === 'taillights' ? 0.9 : 0.7}
        />
      </RoundedBox>

      {/* Charging Port - Modern design */}
      <RoundedBox
        position={[-1.2, 0.15, 0.6]}
        args={[0.08, 0.15, 0.15]}
        radius={0.02}
        onClick={() => handlePartClick('charging-port')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'charging-port' ? '#a855f7' : '#7c3aed'} 
          metalness={0.8}
          roughness={0.1}
          emissive={selectedPart === 'charging-port' ? '#a855f7' : '#5b21b6'}
          emissiveIntensity={selectedPart === 'charging-port' ? 0.4 : 0.2}
        />
      </RoundedBox>

      {/* Door Handles */}
      <RoundedBox
        position={[0.2, 0.0, 0.72]}
        args={[0.1, 0.04, 0.02]}
        radius={0.01}
        onClick={() => handlePartClick('doors')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'doors' ? '#f59e0b' : '#6b7280'} 
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      <RoundedBox
        position={[0.2, 0.0, -0.72]}
        args={[0.1, 0.04, 0.02]}
        radius={0.01}
        onClick={() => handlePartClick('doors')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'doors' ? '#f59e0b' : '#6b7280'} 
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Side Mirrors */}
      <RoundedBox
        position={[0.8, 0.3, 0.8]}
        args={[0.06, 0.04, 0.08]}
        radius={0.01}
        onClick={() => handlePartClick('mirrors')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'mirrors' ? '#10b981' : '#374151'} 
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>

      <RoundedBox
        position={[0.8, 0.3, -0.8]}
        args={[0.06, 0.04, 0.08]}
        radius={0.01}
        onClick={() => handlePartClick('mirrors')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'mirrors' ? '#10b981' : '#374151'} 
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>
    </group>
  );
};

export default EVExterior;