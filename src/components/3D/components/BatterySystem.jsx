import React, { useMemo } from 'react';
import { RoundedBox, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const BatterySystem = ({ selectedPart, onPartClick }) => {
  // Enhanced battery materials with more realistic properties
  const batteryMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'battery' ? '#0ea5e9' : '#00f2fe',
    metalness: 0.5,
    roughness: 0.4,
    emissive: selectedPart === 'battery' ? '#0ea5e9' : '#004d5c',
    emissiveIntensity: selectedPart === 'battery' ? 0.2 : 0.05,
  }), [selectedPart]);

  const coolingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: selectedPart === 'cooling-system' ? '#0284c7' : '#38bdf8',
    metalness: 0.5,
    roughness: 0.4,
    emissive: selectedPart === 'cooling-system' ? '#0369a1' : '#0ea5e9',
    emissiveIntensity: selectedPart === 'cooling-system' ? 0.15 : 0.05,
  }), [selectedPart]);

  const bmsMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#2563eb', 
    metalness: 0.7, 
    roughness: 0.3,
    emissive: '#1e40af',
    emissiveIntensity: 0.1,
  }), []);

  const cellMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#10b981',
    metalness: 0.3,
    roughness: 0.6,
    emissive: '#047857',
    emissiveIntensity: 0.05,
  }), []);

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  return (
    <group onClick={() => handlePartClick('battery')}>
      {/* Main battery pack housing */}
      <RoundedBox
        position={[0, -1.0, 0]}
        args={[4.0, 0.25, 1.8]}
        radius={0.05}
        smoothness={6}
        material={batteryMaterial}
      />
      
      {/* Individual battery cell modules - Tesla 2170 style layout */}
      {Array.from({ length: 32 }, (_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const x = -1.75 + (col * 0.5);
        const z = -0.6 + (row * 0.4);
        
        return (
          <group key={`battery-cell-${i}`}>
            {/* Individual cylindrical cells */}
            {Array.from({ length: 6 }, (_, j) => (
              <Cylinder
                key={`cell-${i}-${j}`}
                position={[x, -1.18 + (j * 0.02), z]}
                args={[0.015, 0.015, 0.065, 8]}
                material={cellMaterial}
              />
            ))}
          </group>
        );
      })}
      
      {/* Battery module housing */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, index) => (
        <RoundedBox
          key={`battery-module-${index}`}
          position={[x, -1.18, 0]}
          args={[0.6, 0.12, 1.6]}
          radius={0.02}
          smoothness={4}
          material={batteryMaterial}
        />
      ))}
      
      {/* Advanced cooling system with detailed channels */}
      <group onClick={() => handlePartClick('cooling-system')}>
        {/* Cooling plates with thermal channels */}
        {[-1.0, 0, 1.0].map((x, index) => (
          <group key={`cooling-group-${index}`}>
            <RoundedBox
              position={[x, -1.3, 0]}
              args={[0.7, 0.03, 1.7]}
              radius={0.01}
              smoothness={3}
              material={coolingMaterial}
            />
            {/* Cooling channels */}
            {[-0.6, -0.2, 0.2, 0.6].map((z, j) => (
              <Cylinder
                key={`cooling-channel-${index}-${j}`}
                position={[x, -1.28, z]}
                args={[0.008, 0.008, 0.65, 6]}
                rotation={[0, 0, Math.PI / 2]}
                material={coolingMaterial}
              />
            ))}
          </group>
        ))}
        
        {/* Coolant inlet/outlet ports */}
        <Cylinder
          position={[2.0, -1.2, 0.5]}
          args={[0.03, 0.03, 0.1, 8]}
          material={coolingMaterial}
        />
        <Cylinder
          position={[2.0, -1.2, -0.5]}
          args={[0.03, 0.03, 0.1, 8]}
          material={coolingMaterial}
        />
      </group>
      
      {/* Battery Management System (BMS) with detailed components */}
      <group onClick={() => handlePartClick('bms')}>
        {/* Main BMS unit */}
        <RoundedBox
          position={[0, -0.85, 0]}
          args={[0.8, 0.08, 0.4]}
          radius={0.02}
          smoothness={4}
          material={bmsMaterial}
        />
        
        {/* BMS sensors on each module */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, index) => (
          <Box
            key={`bms-sensor-${index}`}
            position={[x, -1.05, 0.8]}
            scale={[0.08, 0.04, 0.06]}
            material={bmsMaterial}
          />
        ))}
        
        {/* Wiring harness */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, index) => (
          <Cylinder
            key={`wire-${index}`}
            position={[x * 0.5, -1.0, 0.8]}
            args={[0.005, 0.005, Math.abs(x) * 0.8, 4]}
            rotation={[0, 0, Math.PI / 2]}
            material={new THREE.MeshStandardMaterial({ color: '#ef4444' })}
          />
        ))}
      </group>
      
      {/* High voltage safety systems */}
      <group>
        {/* Emergency disconnect */}
        <RoundedBox
          position={[1.8, -0.9, 0]}
          args={[0.15, 0.15, 0.08]}
          radius={0.02}
          material={new THREE.MeshStandardMaterial({ 
            color: '#dc2626',
            emissive: '#991b1b',
            emissiveIntensity: 0.3
          })}
        />
        
        {/* HV warning labels */}
        {[[-1.8, -0.9, 0], [1.8, -0.9, 0.6], [1.8, -0.9, -0.6]].map((position, index) => (
          <Box
            key={`hv-warning-${index}`}
            position={position}
            scale={[0.08, 0.04, 0.01]}
            material={new THREE.MeshStandardMaterial({ 
              color: '#fbbf24',
              emissive: '#f59e0b',
              emissiveIntensity: 0.2
            })}
          />
        ))}
      </group>
      
      {/* Protective armor plating with reinforcement ribs */}
      <group>
        <RoundedBox
          position={[0, -1.35, 0]}
          args={[4.2, 0.05, 2.0]}
          radius={0.02}
          smoothness={4}
          material={new THREE.MeshStandardMaterial({ 
            color: '#374151', 
            metalness: 0.8, 
            roughness: 0.2
          })}
        />
        
        {/* Reinforcement ribs */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, index) => (
          <RoundedBox
            key={`rib-long-${index}`}
            position={[x, -1.37, 0]}
            args={[0.08, 0.02, 1.8]}
            radius={0.01}
            material={new THREE.MeshStandardMaterial({ 
              color: '#4b5563', 
              metalness: 0.9, 
              roughness: 0.1
            })}
          />
        ))}
        
        {[-0.8, -0.2, 0.2, 0.8].map((z, index) => (
          <RoundedBox
            key={`rib-cross-${index}`}
            position={[0, -1.37, z]}
            args={[3.8, 0.02, 0.06]}
            radius={0.01}
            material={new THREE.MeshStandardMaterial({ 
              color: '#4b5563', 
              metalness: 0.9, 
              roughness: 0.1
            })}
          />
        ))}
      </group>
    </group>
  );
};

export default BatterySystem;