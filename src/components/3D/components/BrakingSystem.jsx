import React, { useMemo } from 'react';
import { RoundedBox, Box, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

const BrakingSystem = ({ selectedPart, onPartClick }) => {
  const brakeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: selectedPart === 'brakes' ? '#dc2626' : '#ef4444',
    metalness: 0.6,
    roughness: 0.3,
    emissive: selectedPart === 'brakes' ? '#991b1b' : '#dc2626',
    emissiveIntensity: selectedPart === 'brakes' ? 0.15 : 0.05,
  }), [selectedPart]);

  const discMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4a5568',
    metalness: 0.8,
    roughness: 0.4,
  }), []);

  const padMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2d3748',
    metalness: 0.3,
    roughness: 0.8,
  }), []);

  const fluidMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3b82f6',
    metalness: 0.2,
    roughness: 0.6,
    transparent: true,
    opacity: 0.8,
  }), []);

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  const createBrakeAssembly = (position, isRear = false) => (
    <group position={position} onClick={() => handlePartClick('brakes')}>
      {/* Brake disc - larger for front, smaller for rear */}
      <Cylinder
        args={isRear ? [0.25, 0.25, 0.02, 32] : [0.32, 0.32, 0.025, 32]}
        rotation={[Math.PI / 2, 0, 0]}
        material={discMaterial}
      />
      
      {/* Disc cooling vanes */}
      {Array.from({ length: isRear ? 24 : 32 }, (_, i) => (
        <RoundedBox
          key={`cooling-vane-${i}`}
          position={[
            (isRear ? 0.2 : 0.26) * Math.cos((i * Math.PI * 2) / (isRear ? 24 : 32)),
            0,
            (isRear ? 0.2 : 0.26) * Math.sin((i * Math.PI * 2) / (isRear ? 24 : 32))
          ]}
          args={[0.01, 0.02, 0.04]}
          radius={0.002}
          rotation={[0, (i * Math.PI * 2) / (isRear ? 24 : 32), 0]}
          material={discMaterial}
        />
      ))}
      
      {/* Disc mounting points */}
      {Array.from({ length: 5 }, (_, i) => (
        <Cylinder
          key={`disc-bolt-${i}`}
          position={[
            0.15 * Math.cos((i * Math.PI * 2) / 5),
            0,
            0.15 * Math.sin((i * Math.PI * 2) / 5)
          ]}
          args={[0.008, 0.008, 0.03, 8]}
          rotation={[Math.PI / 2, 0, 0]}
          material={new THREE.MeshStandardMaterial({
            color: '#374151',
            metalness: 0.9,
            roughness: 0.1,
          })}
        />
      ))}
      
      {/* Brake caliper */}
      <RoundedBox
        position={[0, -0.4, 0]}
        args={isRear ? [0.12, 0.08, 0.25] : [0.15, 0.1, 0.32]}
        radius={0.02}
        material={brakeMaterial}
      />
      
      {/* Caliper pistons */}
      {Array.from({ length: isRear ? 2 : 4 }, (_, i) => (
        <Cylinder
          key={`piston-${i}`}
          position={[
            0.05,
            -0.4,
            isRear ? -0.06 + (i * 0.12) : -0.12 + (i * 0.08)
          ]}
          args={[0.02, 0.02, 0.04, 8]}
          rotation={[0, 0, Math.PI / 2]}
          material={new THREE.MeshStandardMaterial({
            color: '#6b7280',
            metalness: 0.8,
            roughness: 0.2,
          })}
        />
      ))}
      
      {/* Brake pads */}
      <RoundedBox
        position={[0.08, -0.4, 0]}
        args={isRear ? [0.02, 0.06, 0.2] : [0.025, 0.08, 0.25]}
        radius={0.005}
        material={padMaterial}
      />
      <RoundedBox
        position={[-0.08, -0.4, 0]}
        args={isRear ? [0.02, 0.06, 0.2] : [0.025, 0.08, 0.25]}
        radius={0.005}
        material={padMaterial}
      />
      
      {/* Caliper bracket */}
      <RoundedBox
        position={[0, -0.5, 0]}
        args={isRear ? [0.18, 0.04, 0.3] : [0.22, 0.05, 0.38]}
        radius={0.02}
        material={new THREE.MeshStandardMaterial({
          color: '#374151',
          metalness: 0.7,
          roughness: 0.3,
        })}
      />
      
      {/* Brake fluid line */}
      <Cylinder
        position={[0.1, -0.3, 0.15]}
        args={[0.008, 0.008, 0.2, 6]}
        rotation={[Math.PI / 4, 0, 0]}
        material={fluidMaterial}
      />
      
      {/* Wear sensor */}
      <Box
        position={[0.12, -0.35, isRear ? 0.08 : 0.12]}
        scale={[0.02, 0.02, 0.06]}
        material={new THREE.MeshStandardMaterial({
          color: '#f59e0b',
          emissive: '#d97706',
          emissiveIntensity: 0.2,
        })}
      />
      
      {/* Temperature sensor */}
      <Box
        position={[0, -0.32, isRear ? -0.08 : -0.12]}
        scale={[0.025, 0.025, 0.04]}
        material={new THREE.MeshStandardMaterial({
          color: '#ef4444',
          emissive: '#dc2626',
          emissiveIntensity: 0.3,
        })}
      />
      
      {/* For front brakes, add dust shield */}
      {!isRear && (
        <Cylinder
          position={[0, 0, 0]}
          args={[0.35, 0.35, 0.001, 32]}
          rotation={[Math.PI / 2, 0, 0]}
          material={new THREE.MeshStandardMaterial({
            color: '#1f2937',
            metalness: 0.5,
            roughness: 0.6,
          })}
        />
      )}
    </group>
  );

  return (
    <group>
      {/* Individual brake assemblies for each wheel */}
      {/* Front brakes - larger, more complex */}
      {createBrakeAssembly([1.7, -1.25, 1.15], false)}
      {createBrakeAssembly([1.7, -1.25, -1.15], false)}
      
      {/* Rear brakes - smaller, simpler */}
      {createBrakeAssembly([-1.7, -1.25, 1.15], true)}
      {createBrakeAssembly([-1.7, -1.25, -1.15], true)}
      
      {/* Brake master cylinder */}
      <group position={[0.8, 0.3, 0.4]} onClick={() => handlePartClick('brake-master')}>
        <Cylinder
          args={[0.04, 0.04, 0.15, 12]}
          material={brakeMaterial}
        />
        
        {/* Brake fluid reservoir */}
        <RoundedBox
          position={[0, 0.1, 0]}
          args={[0.08, 0.06, 0.06]}
          radius={0.01}
          material={new THREE.MeshStandardMaterial({
            color: '#1f2937',
            metalness: 0.1,
            roughness: 0.8,
            transparent: true,
            opacity: 0.7,
          })}
        />
        
        {/* Brake fluid */}
        <RoundedBox
          position={[0, 0.1, 0]}
          args={[0.06, 0.04, 0.04]}
          radius={0.005}
          material={fluidMaterial}
        />
        
        {/* Brake booster */}
        <Cylinder
          position={[-0.15, 0, 0]}
          args={[0.08, 0.08, 0.12, 16]}
          material={new THREE.MeshStandardMaterial({
            color: '#374151',
            metalness: 0.6,
            roughness: 0.4,
          })}
        />
      </group>
      
      {/* Brake lines - realistic routing */}
      <group>
        {/* Main brake lines to each wheel */}
        {[
          { start: [0.8, 0.25, 0.4], end: [1.7, -1.15, 1.15], color: '#3b82f6' },
          { start: [0.8, 0.25, 0.4], end: [1.7, -1.15, -1.15], color: '#10b981' },
          { start: [0.8, 0.25, 0.4], end: [-1.7, -1.15, 1.15], color: '#f59e0b' },
          { start: [0.8, 0.25, 0.4], end: [-1.7, -1.15, -1.15], color: '#ef4444' },
        ].map((line, index) => {
          const distance = Math.sqrt(
            Math.pow(line.end[0] - line.start[0], 2) +
            Math.pow(line.end[1] - line.start[1], 2) +
            Math.pow(line.end[2] - line.start[2], 2)
          );
          
          return (
            <Cylinder
              key={`brake-line-${index}`}
              position={[
                (line.start[0] + line.end[0]) / 2,
                (line.start[1] + line.end[1]) / 2,
                (line.start[2] + line.end[2]) / 2
              ]}
              args={[0.006, 0.006, distance, 6]}
              rotation={[
                Math.atan2(line.end[1] - line.start[1], 
                  Math.sqrt(Math.pow(line.end[0] - line.start[0], 2) + Math.pow(line.end[2] - line.start[2], 2))),
                Math.atan2(line.end[2] - line.start[2], line.end[0] - line.start[0]),
                0
              ]}
              material={new THREE.MeshStandardMaterial({
                color: line.color,
                metalness: 0.2,
                roughness: 0.8,
              })}
            />
          );
        })}
      </group>
      
      {/* ABS/ESC unit */}
      <group position={[0.5, -0.2, 0]} onClick={() => handlePartClick('abs-system')}>
        <RoundedBox
          args={[0.25, 0.15, 0.2]}
          radius={0.02}
          material={new THREE.MeshStandardMaterial({
            color: '#1f2937',
            metalness: 0.6,
            roughness: 0.3,
          })}
        />
        
        {/* ABS pump */}
        <Cylinder
          position={[0, 0.1, 0]}
          args={[0.03, 0.03, 0.08, 8]}
          material={new THREE.MeshStandardMaterial({
            color: '#6b7280',
            metalness: 0.8,
            roughness: 0.2,
          })}
        />
        
        {/* Electronic control unit */}
        <RoundedBox
          position={[0, -0.05, 0]}
          args={[0.15, 0.08, 0.12]}
          radius={0.01}
          material={new THREE.MeshStandardMaterial({
            color: '#059669',
            metalness: 0.7,
            roughness: 0.3,
          })}
        />
        
        {/* Status LEDs */}
        {Array.from({ length: 4 }, (_, i) => (
          <Box
            key={`abs-led-${i}`}
            position={[-0.06 + (i * 0.04), 0.05, 0.11]}
            scale={[0.008, 0.008, 0.002]}
            material={new THREE.MeshStandardMaterial({
              color: i < 2 ? '#10b981' : '#f59e0b',
              emissive: i < 2 ? '#047857' : '#d97706',
              emissiveIntensity: 0.5,
            })}
          />
        ))}
      </group>
      
      {/* Electronic parking brake actuators (rear wheels) */}
      {[[-1.7, -1.35, 1.15], [-1.7, -1.35, -1.15]].map((position, index) => (
        <group key={`epb-${index}`} position={position}>
          <RoundedBox
            args={[0.08, 0.08, 0.12]}
            radius={0.01}
            material={new THREE.MeshStandardMaterial({
              color: '#7c3aed',
              metalness: 0.6,
              roughness: 0.3,
            })}
          />
          
          {/* Electric motor */}
          <Cylinder
            position={[0, 0, 0.08]}
            args={[0.025, 0.025, 0.04, 8]}
            material={new THREE.MeshStandardMaterial({
              color: '#374151',
              metalness: 0.7,
              roughness: 0.2,
            })}
          />
        </group>
      ))}
      
      {/* Regenerative braking components (integrated with motors) */}
      <group>
        {/* Regen brake controllers */}
        {[[1.8, 0.1, 0], [-1.8, 0.1, 0]].map((position, index) => (
          <RoundedBox
            key={`regen-controller-${index}`}
            position={position}
            args={[0.12, 0.08, 0.15]}
            radius={0.01}
            material={new THREE.MeshStandardMaterial({
              color: '#10b981',
              metalness: 0.6,
              roughness: 0.3,
              emissive: '#047857',
              emissiveIntensity: 0.1,
            })}
          />
        ))}
      </group>
    </group>
  );
};

export default BrakingSystem;