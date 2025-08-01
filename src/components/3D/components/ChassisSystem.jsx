import React, { useMemo } from 'react';
import { RoundedBox, Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const ChassisSystem = ({ selectedPart, onPartClick }) => {
  const chassisMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: selectedPart === 'chassis' ? '#4b5563' : '#6b7280',
    metalness: 0.8,
    roughness: 0.2,
    emissive: selectedPart === 'chassis' ? '#374151' : '#4b5563',
    emissiveIntensity: selectedPart === 'chassis' ? 0.1 : 0.02,
  }), [selectedPart]);

  const suspensionMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: selectedPart === 'suspension' ? '#7c3aed' : '#a855f7',
    metalness: 0.7,
    roughness: 0.3,
    emissive: selectedPart === 'suspension' ? '#5b21b6' : '#7c3aed',
    emissiveIntensity: selectedPart === 'suspension' ? 0.15 : 0.05,
  }), [selectedPart]);

  const springMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#dc2626',
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  const dampenerMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1f2937',
    metalness: 0.6,
    roughness: 0.4,
  }), []);

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  return (
    <group>
      {/* Monocoque chassis structure */}
      <group onClick={() => handlePartClick('chassis')}>
        {/* Main chassis rails */}
        <RoundedBox
          position={[0, -0.6, 0.9]}
          args={[4.5, 0.15, 0.12]}
          radius={0.02}
          material={chassisMaterial}
        />
        <RoundedBox
          position={[0, -0.6, -0.9]}
          args={[4.5, 0.15, 0.12]}
          radius={0.02}
          material={chassisMaterial}
        />
        
        {/* Cross members for structural rigidity */}
        {[-1.8, -0.9, 0, 0.9, 1.8].map((x, index) => (
          <RoundedBox
            key={`cross-member-${index}`}
            position={[x, -0.6, 0]}
            args={[0.1, 0.12, 1.9]}
            radius={0.02}
            material={chassisMaterial}
          />
        ))}
        
        {/* Front crash structure */}
        <group>
          {/* Main impact beam */}
          <RoundedBox
            position={[2.3, -0.4, 0]}
            args={[0.3, 0.2, 1.8]}
            radius={0.03}
            material={new THREE.MeshStandardMaterial({
              color: '#ef4444',
              metalness: 0.8,
              roughness: 0.2,
            })}
          />
          
          {/* Crumple zone elements */}
          {Array.from({ length: 5 }, (_, i) => (
            <RoundedBox
              key={`crumple-front-${i}`}
              position={[2.1 - (i * 0.15), -0.4, 0]}
              args={[0.08, 0.15, 1.6]}
              radius={0.02}
              material={new THREE.MeshStandardMaterial({
                color: '#fbbf24',
                metalness: 0.7,
                roughness: 0.3,
              })}
            />
          ))}
        </group>
        
        {/* Rear crash structure */}
        <group>
          {/* Main impact beam */}
          <RoundedBox
            position={[-2.3, -0.4, 0]}
            args={[0.3, 0.2, 1.8]}
            radius={0.03}
            material={new THREE.MeshStandardMaterial({
              color: '#ef4444',
              metalness: 0.8,
              roughness: 0.2,
            })}
          />
          
          {/* Crumple zone elements */}
          {Array.from({ length: 5 }, (_, i) => (
            <RoundedBox
              key={`crumple-rear-${i}`}
              position={[-2.1 + (i * 0.15), -0.4, 0]}
              args={[0.08, 0.15, 1.6]}
              radius={0.02}
              material={new THREE.MeshStandardMaterial({
                color: '#fbbf24',
                metalness: 0.7,
                roughness: 0.3,
              })}
            />
          ))}
        </group>
        
        {/* Side impact protection */}
        {[0.9, -0.9].map((z, index) => (
          <group key={`side-protection-${index}`}>
            {Array.from({ length: 3 }, (_, i) => (
              <RoundedBox
                key={`side-beam-${i}`}
                position={[-0.5 + (i * 0.5), -0.2, z]}
                args={[0.8, 0.08, 0.15]}
                radius={0.02}
                material={new THREE.MeshStandardMaterial({
                  color: '#059669',
                  metalness: 0.8,
                  roughness: 0.2,
                })}
              />
            ))}
          </group>
        ))}
        
        {/* A-pillar reinforcement */}
        {[0.85, -0.85].map((z, index) => (
          <RoundedBox
            key={`a-pillar-${index}`}
            position={[1.0, 0.2, z]}
            args={[0.1, 0.8, 0.12]}
            radius={0.02}
            material={chassisMaterial}
          />
        ))}
        
        {/* B-pillar reinforcement */}
        {[0.85, -0.85].map((z, index) => (
          <RoundedBox
            key={`b-pillar-${index}`}
            position={[0, 0.3, z]}
            args={[0.12, 1.0, 0.1]}
            radius={0.02}
            material={chassisMaterial}
          />
        ))}
        
        {/* Roof reinforcement */}
        <RoundedBox
          position={[0, 1.0, 0]}
          args={[2.8, 0.08, 0.1]}
          radius={0.02}
          material={chassisMaterial}
        />
      </group>
      
      {/* Advanced suspension system */}
      <group onClick={() => handlePartClick('suspension')}>
        {/* Front independent suspension */}
        {[[1.6, -1.2, 1.0], [1.6, -1.2, -1.0]].map((position, index) => (
          <group key={`front-suspension-${index}`} position={position}>
            {/* MacPherson strut */}
            <Cylinder
              args={[0.06, 0.08, 0.8, 12]}
              material={suspensionMaterial}
            />
            
            {/* Coil spring */}
            <group>
              {Array.from({ length: 12 }, (_, i) => (
                <Cylinder
                  key={`spring-coil-${i}`}
                  position={[0, 0.35 - (i * 0.06), 0]}
                  args={[0.1, 0.1, 0.02, 8]}
                  material={springMaterial}
                />
              ))}
            </group>
            
            {/* Shock absorber */}
            <Cylinder
              position={[0, 0, 0]}
              args={[0.04, 0.04, 0.6, 8]}
              material={dampenerMaterial}
            />
            
            {/* Upper control arm */}
            <RoundedBox
              position={[0.2, 0.3, 0]}
              args={[0.4, 0.06, 0.08]}
              radius={0.02}
              rotation={[0, 0, -0.2]}
              material={suspensionMaterial}
            />
            
            {/* Lower control arm */}
            <RoundedBox
              position={[0.3, -0.2, 0]}
              args={[0.6, 0.08, 0.1]}
              radius={0.02}
              rotation={[0, 0, 0.15]}
              material={suspensionMaterial}
            />
            
            {/* Ball joints */}
            <Sphere
              position={[0.4, 0.25, 0]}
              args={[0.04, 8, 8]}
              material={new THREE.MeshStandardMaterial({
                color: '#9ca3af',
                metalness: 0.9,
                roughness: 0.1,
              })}
            />
            <Sphere
              position={[0.5, -0.15, 0]}
              args={[0.05, 8, 8]}
              material={new THREE.MeshStandardMaterial({
                color: '#9ca3af',
                metalness: 0.9,
                roughness: 0.1,
              })}
            />
            
            {/* Anti-roll bar connection */}
            <Cylinder
              position={[0, -0.4, 0]}
              args={[0.02, 0.02, 0.15, 8]}
              rotation={[0, 0, Math.PI / 2]}
              material={suspensionMaterial}
            />
          </group>
        ))}
        
        {/* Rear independent suspension */}
        {[[-1.6, -1.2, 1.0], [-1.6, -1.2, -1.0]].map((position, index) => (
          <group key={`rear-suspension-${index}`} position={position}>
            {/* Multi-link suspension */}
            <Cylinder
              args={[0.06, 0.08, 0.7, 12]}
              material={suspensionMaterial}
            />
            
            {/* Air spring (adaptive) */}
            <Cylinder
              position={[0, 0.2, 0]}
              args={[0.08, 0.12, 0.25, 8]}
              material={new THREE.MeshStandardMaterial({
                color: '#1f2937',
                metalness: 0.2,
                roughness: 0.8,
              })}
            />
            
            {/* Adaptive damper */}
            <Cylinder
              position={[0, 0, 0]}
              args={[0.04, 0.04, 0.5, 8]}
              material={new THREE.MeshStandardMaterial({
                color: '#3b82f6',
                metalness: 0.7,
                roughness: 0.3,
              })}
            />
            
            {/* Multiple control arms for multi-link */}
            {[
              { pos: [0.25, 0.1, 0.05], rot: [0, 0, -0.1] },
              { pos: [0.3, -0.1, -0.05], rot: [0, 0, 0.15] },
              { pos: [0.2, -0.3, 0], rot: [0, 0, 0.3] },
            ].map((arm, i) => (
              <RoundedBox
                key={`rear-arm-${i}`}
                position={arm.pos}
                args={[0.5, 0.06, 0.08]}
                radius={0.02}
                rotation={arm.rot}
                material={suspensionMaterial}
              />
            ))}
            
            {/* Toe link */}
            <RoundedBox
              position={[0.15, -0.4, 0]}
              args={[0.3, 0.04, 0.06]}
              radius={0.01}
              material={suspensionMaterial}
            />
            
            {/* Camber link */}
            <RoundedBox
              position={[0.1, -0.25, 0.1]}
              args={[0.25, 0.04, 0.06]}
              radius={0.01}
              rotation={[0, 0.2, 0]}
              material={suspensionMaterial}
            />
          </group>
        ))}
        
        {/* Anti-roll bars */}
        {/* Front anti-roll bar */}
        <Cylinder
          position={[1.6, -1.5, 0]}
          args={[0.02, 0.02, 2.2, 8]}
          rotation={[0, 0, Math.PI / 2]}
          material={suspensionMaterial}
        />
        
        {/* Rear anti-roll bar */}
        <Cylinder
          position={[-1.6, -1.5, 0]}
          args={[0.02, 0.02, 2.2, 8]}
          rotation={[0, 0, Math.PI / 2]}
          material={suspensionMaterial}
        />
        
        {/* Suspension sensors */}
        {[
          [1.6, -1.0, 1.0],
          [1.6, -1.0, -1.0],
          [-1.6, -1.0, 1.0],
          [-1.6, -1.0, -1.0]
        ].map((position, index) => (
          <Box
            key={`suspension-sensor-${index}`}
            position={position}
            scale={[0.04, 0.04, 0.08]}
            material={new THREE.MeshStandardMaterial({
              color: '#f59e0b',
              emissive: '#d97706',
              emissiveIntensity: 0.3,
            })}
          />
        ))}
      </group>
      
      {/* Subframes */}
      <group>
        {/* Front subframe */}
        <RoundedBox
          position={[1.8, -0.8, 0]}
          args={[0.8, 0.1, 2.0]}
          radius={0.02}
          material={chassisMaterial}
        />
        
        {/* Rear subframe */}
        <RoundedBox
          position={[-1.8, -0.8, 0]}
          args={[0.8, 0.1, 2.0]}
          radius={0.02}
          material={chassisMaterial}
        />
        
        {/* Subframe bushings */}
        {[
          [1.4, -0.85, 0.8], [2.2, -0.85, 0.8],
          [1.4, -0.85, -0.8], [2.2, -0.85, -0.8],
          [-1.4, -0.85, 0.8], [-2.2, -0.85, 0.8],
          [-1.4, -0.85, -0.8], [-2.2, -0.85, -0.8]
        ].map((position, index) => (
          <Cylinder
            key={`subframe-bushing-${index}`}
            position={position}
            args={[0.04, 0.04, 0.06, 8]}
            material={new THREE.MeshStandardMaterial({
              color: '#1f2937',
              metalness: 0.1,
              roughness: 0.9,
            })}
          />
        ))}
      </group>
    </group>
  );
};

export default ChassisSystem;