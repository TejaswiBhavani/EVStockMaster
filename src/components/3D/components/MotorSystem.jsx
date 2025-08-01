import React, { useMemo, useRef } from 'react';
import { RoundedBox, Box, Cylinder, Torus, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MotorSystem = ({ selectedPart, onPartClick }) => {
  const frontRotorRef = useRef();
  const rearRotorRef = useRef();

  // Animate rotors
  useFrame((state) => {
    if (frontRotorRef.current) {
      frontRotorRef.current.rotation.x += 0.05;
    }
    if (rearRotorRef.current) {
      rearRotorRef.current.rotation.x += 0.05;
    }
  });

  const motorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'motor' ? '#059669' : '#2dd4bf',
    metalness: 0.7,
    roughness: 0.2,
    emissive: selectedPart === 'motor' ? '#065f46' : '#0f766e',
    emissiveIntensity: selectedPart === 'motor' ? 0.15 : 0.03,
  }), [selectedPart]);

  const statorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#6b7280',
    metalness: 0.8,
    roughness: 0.3,
  }), []);

  const rotorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#374151',
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const magnetMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#dc2626',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#991b1b',
    emissiveIntensity: 0.1,
  }), []);

  const copperMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ea580c',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#c2410c',
    emissiveIntensity: 0.05,
  }), []);

  const bearingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#9ca3af',
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  const createDetailedMotor = (position, isRear = false) => (
    <group position={position} onClick={() => handlePartClick('motor')}>
      {/* Motor housing - Enhanced with cooling fins */}
      <Cylinder
        args={[0.35, 0.40, 0.7, 24]}
        material={motorMaterial}
      />
      
      {/* Advanced cooling fins with realistic spacing */}
      {Array.from({ length: 12 }, (_, i) => (
        <RoundedBox
          key={`${isRear ? 'rear' : 'front'}-fin-${i}`}
          position={[0, 0, 0]}
          args={[0.015, 0.38, 0.75]}
          radius={0.005}
          rotation={[0, (i * Math.PI) / 6, 0]}
          material={motorMaterial}
        />
      ))}
      
      {/* Stator assembly with detailed windings */}
      <group>
        {/* Main stator housing */}
        <Cylinder
          args={[0.32, 0.32, 0.5, 24]}
          material={statorMaterial}
        />
        
        {/* Stator teeth (12 teeth for realistic motor) */}
        {Array.from({ length: 12 }, (_, i) => (
          <group key={`stator-tooth-${i}`} rotation={[0, (i * Math.PI * 2) / 12, 0]}>
            <RoundedBox
              position={[0.28, 0, 0]}
              args={[0.04, 0.45, 0.06]}
              radius={0.005}
              material={statorMaterial}
            />
            {/* Copper windings around each tooth */}
            {Array.from({ length: 3 }, (_, j) => (
              <Torus
                key={`winding-${i}-${j}`}
                position={[0.28, -0.15 + (j * 0.15), 0]}
                args={[0.03, 0.008, 4, 8]}
                rotation={[Math.PI / 2, 0, 0]}
                material={copperMaterial}
              />
            ))}
          </group>
        ))}
      </group>
      
      {/* Rotor assembly with permanent magnets */}
      <group ref={isRear ? rearRotorRef : frontRotorRef}>
        {/* Main rotor shaft */}
        <Cylinder
          args={[0.04, 0.04, 0.8, 16]}
          material={rotorMaterial}
        />
        
        {/* Rotor core */}
        <Cylinder
          args={[0.22, 0.22, 0.45, 16]}
          material={rotorMaterial}
        />
        
        {/* Permanent magnets (8 magnets in pairs) */}
        {Array.from({ length: 8 }, (_, i) => (
          <RoundedBox
            key={`magnet-${i}`}
            position={[0.18 * Math.cos((i * Math.PI * 2) / 8), 0, 0.18 * Math.sin((i * Math.PI * 2) / 8)]}
            args={[0.025, 0.4, 0.04]}
            radius={0.005}
            rotation={[0, (i * Math.PI * 2) / 8, 0]}
            material={magnetMaterial}
          />
        ))}
        
        {/* Rotor laminations */}
        {Array.from({ length: 8 }, (_, i) => (
          <Cylinder
            key={`lamination-${i}`}
            position={[0, -0.2 + (i * 0.05), 0]}
            args={[0.23, 0.23, 0.002, 16]}
            material={new THREE.MeshStandardMaterial({
              color: '#52525b',
              metalness: 0.7,
              roughness: 0.3,
            })}
          />
        ))}
      </group>
      
      {/* Ball bearings */}
      <Sphere
        position={[0, 0.35, 0]}
        args={[0.05, 12, 12]}
        material={bearingMaterial}
      />
      <Sphere
        position={[0, -0.35, 0]}
        args={[0.05, 12, 12]}
        material={bearingMaterial}
      />
      
      {/* Motor mount with isolation bushings */}
      <RoundedBox
        position={[0, -0.45, 0]}
        args={[0.6, 0.1, 0.6]}
        radius={0.02}
        material={motorMaterial}
      />
      
      {/* Vibration isolation bushings */}
      {[[-0.25, -0.5, -0.25], [0.25, -0.5, -0.25], [-0.25, -0.5, 0.25], [0.25, -0.5, 0.25]].map((pos, index) => (
        <Cylinder
          key={`bushing-${index}`}
          position={pos}
          args={[0.03, 0.03, 0.08, 8]}
          material={new THREE.MeshStandardMaterial({
            color: '#1f2937',
            metalness: 0.1,
            roughness: 0.9,
          })}
        />
      ))}
      
      {/* Power electronics housing */}
      <RoundedBox
        position={[0, 0.45, 0]}
        args={[0.5, 0.15, 0.4]}
        radius={0.02}
        material={new THREE.MeshStandardMaterial({
          color: '#374151',
          metalness: 0.6,
          roughness: 0.3,
        })}
      />
      
      {/* Cooling connections */}
      <Cylinder
        position={[0.3, 0.45, 0]}
        args={[0.02, 0.02, 0.1, 8]}
        rotation={[0, 0, Math.PI / 2]}
        material={new THREE.MeshStandardMaterial({
          color: '#3b82f6',
          metalness: 0.5,
          roughness: 0.4,
        })}
      />
      
      {/* Temperature sensors */}
      {[[0.15, 0.15, 0.15], [-0.15, 0.15, -0.15], [0.15, -0.15, -0.15], [-0.15, -0.15, 0.15]].map((pos, index) => (
        <Box
          key={`temp-sensor-${index}`}
          position={pos}
          scale={[0.02, 0.02, 0.04]}
          material={new THREE.MeshStandardMaterial({
            color: '#fbbf24',
            emissive: '#f59e0b',
            emissiveIntensity: 0.2,
          })}
        />
      ))}
    </group>
  );

  return (
    <group>
      {/* Front motor assembly */}
      {createDetailedMotor([1.8, -0.4, 0], false)}
      
      {/* Rear motor assembly */}
      {createDetailedMotor([-1.8, -0.4, 0], true)}
      
      {/* Enhanced drive shafts with CV joints */}
      {[
        [1.8, -0.4, 1.0],
        [1.8, -0.4, -1.0],
        [-1.8, -0.4, 1.0],
        [-1.8, -0.4, -1.0]
      ].map((position, index) => (
        <group key={`driveshaft-${index}`}>
          {/* Main drive shaft */}
          <Cylinder
            position={position}
            args={[0.05, 0.05, 0.4, 8]}
            rotation={[0, 0, Math.PI / 2]}
            material={new THREE.MeshStandardMaterial({ 
              color: '#4b5563', 
              metalness: 0.9, 
              roughness: 0.1 
            })}
          />
          
          {/* CV joint */}
          <Sphere
            position={[position[0], position[1], position[2] + (position[2] > 0 ? 0.25 : -0.25)]}
            args={[0.08, 8, 8]}
            material={new THREE.MeshStandardMaterial({ 
              color: '#374151', 
              metalness: 0.8, 
              roughness: 0.2 
            })}
          />
          
          {/* CV joint boot */}
          <Cylinder
            position={[position[0], position[1], position[2] + (position[2] > 0 ? 0.25 : -0.25)]}
            args={[0.06, 0.09, 0.12, 8]}
            material={new THREE.MeshStandardMaterial({ 
              color: '#1f2937', 
              metalness: 0.1, 
              roughness: 0.8 
            })}
          />
        </group>
      ))}
      
      {/* Power inverters for each motor */}
      {[[1.8, 0.2, 0], [-1.8, 0.2, 0]].map((position, index) => (
        <group key={`inverter-${index}`} onClick={() => handlePartClick('inverter')}>
          {/* Main inverter housing */}
          <RoundedBox
            position={position}
            args={[0.4, 0.25, 0.6]}
            radius={0.02}
            material={new THREE.MeshStandardMaterial({
              color: '#1f2937',
              metalness: 0.7,
              roughness: 0.3,
            })}
          />
          
          {/* Heat sink fins */}
          {Array.from({ length: 8 }, (_, i) => (
            <RoundedBox
              key={`heatsink-${i}`}
              position={[position[0], position[1] + 0.13, position[2] - 0.25 + (i * 0.07)]}
              args={[0.35, 0.02, 0.05]}
              radius={0.005}
              material={new THREE.MeshStandardMaterial({
                color: '#6b7280',
                metalness: 0.8,
                roughness: 0.2,
              })}
            />
          ))}
          
          {/* Power connectors */}
          <Box
            position={[position[0] + 0.22, position[1], position[2]]}
            scale={[0.08, 0.15, 0.4]}
            material={new THREE.MeshStandardMaterial({
              color: '#ef4444',
              metalness: 0.6,
              roughness: 0.4,
            })}
          />
          
          {/* Status LEDs */}
          {Array.from({ length: 3 }, (_, i) => (
            <Sphere
              key={`led-${i}`}
              position={[position[0] - 0.15, position[1] + 0.1, position[2] - 0.1 + (i * 0.1)]}
              args={[0.01, 6, 6]}
              material={new THREE.MeshStandardMaterial({
                color: i === 0 ? '#10b981' : i === 1 ? '#3b82f6' : '#f59e0b',
                emissive: i === 0 ? '#047857' : i === 1 ? '#1d4ed8' : '#d97706',
                emissiveIntensity: 0.5,
              })}
            />
          ))}
        </group>
      ))}
    </group>
  );
};

export default MotorSystem;