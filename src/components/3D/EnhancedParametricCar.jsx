import React, { useMemo } from 'react'
import { RoundedBox, Cylinder, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Enhanced parametric car that looks much more realistic than the original primitive version
 * Maintains identical part IDs for side panel integration
 * @param {Object} props - Component props
 * @param {string} props.selectedPart - Currently selected part ID  
 * @param {Function} props.onPartClick - Handler for part selection
 * @param {Function} props.onPointerMissed - Handler for clearing selection
 */
export default function EnhancedParametricCar({ selectedPart, onPartClick, onPointerMissed }) {
  // Enhanced materials with better realism
  const materials = useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial({
      color: selectedPart === 'body' ? '#2563eb' : '#1e40af',
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.0,
    }),
    bodySecondary: new THREE.MeshPhysicalMaterial({
      color: selectedPart === 'body' ? '#1d4ed8' : '#1e3a8a',
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.5,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#e0f2fe',
      transmission: 0.95,
      thickness: 0.1,
      roughness: 0.02,
      metalness: 0.0,
      reflectivity: 0.8,
      transparent: true,
      opacity: 0.1,
      ior: 1.5,
    }),
    headlight: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: selectedPart === 'headlights' ? '#93c5fd' : '#60a5fa',
      emissiveIntensity: selectedPart === 'headlights' ? 1.5 : 0.8,
      metalness: 0.1,
      roughness: 0.1,
    }),
    taillight: new THREE.MeshStandardMaterial({
      color: '#dc2626',
      emissive: selectedPart === 'taillights' ? '#ef4444' : '#b91c1c',
      emissiveIntensity: selectedPart === 'taillights' ? 1.2 : 0.9,
      metalness: 0.2,
      roughness: 0.2,
    }),
    wheelRim: new THREE.MeshPhysicalMaterial({
      color: selectedPart?.startsWith('wheel') ? '#60a5fa' : '#e2e8f0',
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0,
    }),
    tire: new THREE.MeshPhysicalMaterial({
      color: '#1f2937',
      roughness: 0.95,
      metalness: 0.05,
    }),
    battery: new THREE.MeshStandardMaterial({
      color: selectedPart === 'battery' ? '#f59e0b' : '#374151',
      metalness: 0.6,
      roughness: 0.4,
    }),
    chargingPort: new THREE.MeshStandardMaterial({
      color: selectedPart === 'charging-port' ? '#a855f7' : '#7c3aed',
      metalness: 0.9,
      roughness: 0.25,
    }),
    chrome: new THREE.MeshPhysicalMaterial({
      color: '#f1f5f9',
      metalness: 1.0,
      roughness: 0.05,
      envMapIntensity: 2.0,
    }),
    plastic: new THREE.MeshStandardMaterial({
      color: '#334155',
      metalness: 0.1,
      roughness: 0.8,
    }),
  }), [selectedPart])

  // Enhanced wheel component with realistic rim design
  const EnhancedWheel = ({ position, partId }) => {
    return (
      <group 
        position={position} 
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.(partId)
        }}
      >
        {/* Tire */}
        <Cylinder args={[0.35, 0.35, 0.15, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={materials.tire} attach="material" />
        </Cylinder>
        
        {/* Rim outer */}
        <Cylinder args={[0.3, 0.3, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]}>
          <primitive object={materials.wheelRim} attach="material" />
        </Cylinder>
        
        {/* Rim spokes */}
        {[0, 1, 2, 3, 4].map(i => (
          <Box 
            key={i} 
            args={[0.02, 0.25, 0.04]} 
            rotation={[0, 0, (i * Math.PI) / 5]}
            position={[0, 0, 0.05]}
          >
            <primitive object={materials.chrome} attach="material" />
          </Box>
        ))}
        
        {/* Center cap */}
        <Cylinder args={[0.08, 0.08, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.08]}>
          <primitive object={materials.chrome} attach="material" />
        </Cylinder>
      </group>
    )
  }

  return (
    <group onPointerMissed={onPointerMissed}>
      {/* Main body - more aerodynamic shape */}
      <RoundedBox 
        args={[3.2, 0.6, 1.6]} 
        radius={0.15} 
        smoothness={8} 
        position={[0, -0.2, 0]}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.('body')
        }}
      >
        <primitive object={materials.body} attach="material" />
      </RoundedBox>
      
      {/* Cabin - more realistic proportions */}
      <RoundedBox 
        args={[1.8, 0.7, 1.4]} 
        radius={0.25} 
        smoothness={12} 
        position={[0.2, 0.15, 0]}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.('body')
        }}
      >
        <primitive object={materials.body} attach="material" />
      </RoundedBox>

      {/* Hood */}
      <RoundedBox 
        args={[0.8, 0.15, 1.5]} 
        radius={0.08} 
        smoothness={6} 
        position={[1.0, 0.05, 0]}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.('body')
        }}
      >
        <primitive object={materials.bodySecondary} attach="material" />
      </RoundedBox>

      {/* Front bumper */}
      <RoundedBox 
        args={[0.3, 0.25, 1.4]} 
        radius={0.12} 
        smoothness={8} 
        position={[1.55, -0.15, 0]}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.('body')
        }}
      >
        <primitive object={materials.bodySecondary} attach="material" />
      </RoundedBox>

      {/* Rear bumper */}
      <RoundedBox 
        args={[0.25, 0.25, 1.4]} 
        radius={0.1} 
        smoothness={6} 
        position={[-1.45, -0.15, 0]}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.('body')
        }}
      >
        <primitive object={materials.bodySecondary} attach="material" />
      </RoundedBox>

      {/* Front grille */}
      <Box args={[0.05, 0.15, 0.8]} position={[1.65, -0.05, 0]}>
        <primitive object={materials.plastic} attach="material" />
      </Box>

      {/* Windshield */}
      <Box 
        args={[0.03, 0.6, 1.3]} 
        position={[0.7, 0.35, 0]} 
        rotation={[0, 0, -0.15]}
      >
        <primitive object={materials.glass} attach="material" />
      </Box>
      
      {/* Side windows */}
      <Box args={[1.3, 0.5, 0.03]} position={[0.1, 0.4, 0.67]}>
        <primitive object={materials.glass} attach="material" />
      </Box>
      <Box args={[1.3, 0.5, 0.03]} position={[0.1, 0.4, -0.67]}>
        <primitive object={materials.glass} attach="material" />
      </Box>

      {/* Rear window */}
      <Box 
        args={[0.03, 0.5, 1.2]} 
        position={[-0.6, 0.35, 0]} 
        rotation={[0, 0, 0.1]}
      >
        <primitive object={materials.glass} attach="material" />
      </Box>

      {/* Enhanced headlights with realistic shape */}
      <group 
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.('headlights')
        }}
      >
        <RoundedBox args={[0.15, 0.12, 0.25]} radius={0.05} position={[1.5, 0.05, 0.5]}>
          <primitive object={materials.headlight} attach="material" />
        </RoundedBox>
        <RoundedBox args={[0.15, 0.12, 0.25]} radius={0.05} position={[1.5, 0.05, -0.5]}>
          <primitive object={materials.headlight} attach="material" />
        </RoundedBox>
        
        {/* Headlight reflectors */}
        <Sphere args={[0.08]} position={[1.55, 0.05, 0.5]}>
          <primitive object={materials.chrome} attach="material" />
        </Sphere>
        <Sphere args={[0.08]} position={[1.55, 0.05, -0.5]}>
          <primitive object={materials.chrome} attach="material" />
        </Sphere>
      </group>

      {/* Enhanced taillights - full width LED bar style */}
      <group
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.('taillights')
        }}
      >
        <Box args={[0.08, 0.08, 1.4]} position={[-1.52, 0.1, 0]}>
          <primitive object={materials.taillight} attach="material" />
        </Box>
        
        {/* Individual taillight elements */}
        <RoundedBox args={[0.12, 0.15, 0.3]} radius={0.03} position={[-1.5, 0.05, 0.6]}>
          <primitive object={materials.taillight} attach="material" />
        </RoundedBox>
        <RoundedBox args={[0.12, 0.15, 0.3]} radius={0.03} position={[-1.5, 0.05, -0.6]}>
          <primitive object={materials.taillight} attach="material" />
        </RoundedBox>
      </group>

      {/* Enhanced wheels with realistic design */}
      <EnhancedWheel position={[1.0, -0.5, 0.75]} partId="wheel-fl" />
      <EnhancedWheel position={[1.0, -0.5, -0.75]} partId="wheel-fr" />
      <EnhancedWheel position={[-1.0, -0.5, 0.75]} partId="wheel-rl" />
      <EnhancedWheel position={[-1.0, -0.5, -0.75]} partId="wheel-rr" />

      {/* Enhanced battery pack */}
      <RoundedBox 
        args={[2.5, 0.15, 1.2]} 
        radius={0.05} 
        position={[0, -0.65, 0]}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.('battery')
        }}
      >
        <primitive object={materials.battery} attach="material" />
      </RoundedBox>

      {/* Battery cooling lines */}
      <Cylinder args={[0.02, 0.02, 2.2, 8]} position={[0.3, -0.62, 0]} rotation={[0, 0, Math.PI/2]}>
        <primitive object={materials.chrome} attach="material" />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 2.2, 8]} position={[-0.3, -0.62, 0]} rotation={[0, 0, Math.PI/2]}>
        <primitive object={materials.chrome} attach="material" />
      </Cylinder>

      {/* Charging port with better detail */}
      <group
        onPointerDown={(e) => {
          e.stopPropagation()
          onPartClick?.('charging-port')
        }}
      >
        <RoundedBox args={[0.15, 0.12, 0.15]} radius={0.02} position={[-1.2, 0.05, 0.75]}>
          <primitive object={materials.chargingPort} attach="material" />
        </RoundedBox>
        
        {/* Charging port cover */}
        <Box args={[0.18, 0.15, 0.02]} position={[-1.15, 0.05, 0.82]}>
          <primitive object={materials.bodySecondary} attach="material" />
        </Box>
      </group>

      {/* Side mirrors */}
      <Sphere args={[0.06]} position={[0.8, 0.3, 0.8]}>
        <primitive object={materials.plastic} attach="material" />
      </Sphere>
      <Sphere args={[0.06]} position={[0.8, 0.3, -0.8]}>
        <primitive object={materials.plastic} attach="material" />
      </Sphere>

      {/* Door handles */}
      <Cylinder args={[0.02, 0.02, 0.1, 8]} position={[0.5, 0.0, 0.78]} rotation={[Math.PI/2, 0, 0]}>
        <primitive object={materials.chrome} attach="material" />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.1, 8]} position={[0.5, 0.0, -0.78]} rotation={[Math.PI/2, 0, 0]}>
        <primitive object={materials.chrome} attach="material" />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.1, 8]} position={[-0.3, 0.0, 0.78]} rotation={[Math.PI/2, 0, 0]}>
        <primitive object={materials.chrome} attach="material" />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.1, 8]} position={[-0.3, 0.0, -0.78]} rotation={[Math.PI/2, 0, 0]}>
        <primitive object={materials.chrome} attach="material" />
      </Cylinder>

      {/* Antenna */}
      <Cylinder args={[0.01, 0.01, 0.2, 8]} position={[-0.5, 0.6, 0]}>
        <primitive object={materials.chrome} attach="material" />
      </Cylinder>
    </group>
  )
}