import React from 'react';
import { RoundedBox, Cylinder } from '@react-three/drei';

const EVInterior = ({ selectedPart, onPartClick }) => {
  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  return (
    <group name="ev-interior">
      {/* Dashboard */}
      <RoundedBox
        position={[0.8, 0.1, 0]}
        args={[0.2, 0.1, 1.0]}
        radius={0.02}
        onClick={() => handlePartClick('dashboard')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'dashboard' ? '#f59e0b' : '#1f2937'} 
          metalness={0.3}
          roughness={0.7}
          emissive={selectedPart === 'dashboard' ? '#f59e0b' : '#374151'}
          emissiveIntensity={selectedPart === 'dashboard' ? 0.2 : 0.05}
        />
      </RoundedBox>

      {/* Steering Wheel */}
      <group position={[0.8, 0.2, 0.2]}>
        <Cylinder
          args={[0.15, 0.15, 0.03, 16]}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={() => handlePartClick('steering')}
        >
          <meshStandardMaterial 
            color={selectedPart === 'steering' ? '#ef4444' : '#374151'} 
            metalness={0.2}
            roughness={0.8}
          />
        </Cylinder>
        
        {/* Steering column */}
        <Cylinder
          args={[0.02, 0.02, 0.15, 8]}
          position={[0, -0.1, 0]}
        >
          <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
        </Cylinder>
      </group>

      {/* Seats */}
      {/* Driver Seat */}
      <group position={[0, 0, 0.3]}>
        {/* Seat base */}
        <RoundedBox
          position={[0, -0.2, 0]}
          args={[0.4, 0.1, 0.4]}
          radius={0.02}
          onClick={() => handlePartClick('seats')}
        >
          <meshStandardMaterial 
            color={selectedPart === 'seats' ? '#8b5cf6' : '#4b5563'} 
            metalness={0.1}
            roughness={0.9}
          />
        </RoundedBox>
        
        {/* Seat back */}
        <RoundedBox
          position={[0.1, 0.1, 0]}
          args={[0.08, 0.4, 0.3]}
          radius={0.02}
          onClick={() => handlePartClick('seats')}
        >
          <meshStandardMaterial 
            color={selectedPart === 'seats' ? '#8b5cf6' : '#4b5563'} 
            metalness={0.1}
            roughness={0.9}
          />
        </RoundedBox>
      </group>

      {/* Passenger Seat */}
      <group position={[0, 0, -0.3]}>
        {/* Seat base */}
        <RoundedBox
          position={[0, -0.2, 0]}
          args={[0.4, 0.1, 0.4]}
          radius={0.02}
          onClick={() => handlePartClick('seats')}
        >
          <meshStandardMaterial 
            color={selectedPart === 'seats' ? '#8b5cf6' : '#4b5563'} 
            metalness={0.1}
            roughness={0.9}
          />
        </RoundedBox>
        
        {/* Seat back */}
        <RoundedBox
          position={[0.1, 0.1, 0]}
          args={[0.08, 0.4, 0.3]}
          radius={0.02}
          onClick={() => handlePartClick('seats')}
        >
          <meshStandardMaterial 
            color={selectedPart === 'seats' ? '#8b5cf6' : '#4b5563'} 
            metalness={0.1}
            roughness={0.9}
          />
        </RoundedBox>
      </group>

      {/* Center Console */}
      <RoundedBox
        position={[0, -0.1, 0]}
        args={[0.3, 0.15, 0.2]}
        radius={0.02}
        onClick={() => handlePartClick('console')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'console' ? '#06d6a0' : '#1f2937'} 
          metalness={0.4}
          roughness={0.6}
          emissive={selectedPart === 'console' ? '#06d6a0' : '#374151'}
          emissiveIntensity={selectedPart === 'console' ? 0.1 : 0.02}
        />
      </RoundedBox>

      {/* Display Screen */}
      <RoundedBox
        position={[0.7, 0.25, 0]}
        args={[0.05, 0.2, 0.3]}
        radius={0.01}
        onClick={() => handlePartClick('display')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'display' ? '#3b82f6' : '#000000'} 
          metalness={0.1}
          roughness={0.1}
          emissive={selectedPart === 'display' ? '#3b82f6' : '#1f2937'}
          emissiveIntensity={selectedPart === 'display' ? 0.5 : 0.3}
        />
      </RoundedBox>
    </group>
  );
};

export default EVInterior;