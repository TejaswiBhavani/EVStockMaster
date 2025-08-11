import React, { useMemo } from 'react'
import { RoundedBox, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import Wheel from './parts/Wheel'

export default function CarModel({ selectedPart, onPartClick }) {
  const paint = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: selectedPart === 'body' ? '#2563eb' : '#0ea5e9',
    metalness: 0.95,
    roughness: 0.25,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.2
  }), [selectedPart])

  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#93c5fd',
    transmission: 0.9,
    thickness: 0.15,
    roughness: 0.05,
    metalness: 0.0,
    reflectivity: 0.7,
    transparent: true,
    opacity: 0.95
  }), [])

  return (
    <group name="car-model">
      {/* Main body */}
      <RoundedBox args={[2.8, 0.5, 1.4]} radius={0.12} smoothness={6} position={[0, -0.25, 0]} onClick={() => onPartClick?.('body')}>
        <primitive object={paint} attach="material" />
      </RoundedBox>
      
      {/* Cabin */}
      <RoundedBox args={[1.6, 0.6, 1.3]} radius={0.3} smoothness={8} position={[0.1, 0.05, 0]} onClick={() => onPartClick?.('body')}>
        <primitive object={paint} attach="material" />
      </RoundedBox>

      {/* Glass - windshield */}
      <mesh position={[0.5, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.5, 1.18]} />
        <primitive object={glass} attach="material" />
      </mesh>
      
      {/* Glass - side windows */}
      <mesh position={[-0.15, 0.3, 0.58]}>
        <boxGeometry args={[1.1, 0.42, 0.02]} />
        <primitive object={glass} attach="material" />
      </mesh>
      <mesh position={[-0.15, 0.3, -0.58]}>
        <boxGeometry args={[1.1, 0.42, 0.02]} />
        <primitive object={glass} attach="material" />
      </mesh>

      {/* Headlights */}
      <mesh position={[1.35, 0.0, 0.42]} onClick={() => onPartClick?.('headlights')}>
        <boxGeometry args={[0.1, 0.08, 0.18]} />
        <meshStandardMaterial color="#ffffff" emissive={selectedPart === 'headlights' ? '#93c5fd' : '#60a5fa'} emissiveIntensity={selectedPart === 'headlights' ? 1.2 : 0.6} />
      </mesh>
      <mesh position={[1.35, 0.0, -0.42]} onClick={() => onPartClick?.('headlights')}>
        <boxGeometry args={[0.1, 0.08, 0.18]} />
        <meshStandardMaterial color="#ffffff" emissive={selectedPart === 'headlights' ? '#93c5fd' : '#60a5fa'} emissiveIntensity={selectedPart === 'headlights' ? 1.2 : 0.6} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-1.35, 0.05, 0]} onClick={() => onPartClick?.('taillights')}>
        <boxGeometry args={[0.08, 0.08, 1.2]} />
        <meshStandardMaterial color="#ef4444" emissive={selectedPart === 'taillights' ? '#ef4444' : '#b91c1c'} emissiveIntensity={selectedPart === 'taillights' ? 1.1 : 0.7} />
      </mesh>

      {/* Wheels */}
      <Wheel position={[0.95, -0.5, 0.7]} selected={selectedPart === 'wheel-fl'} onClick={() => onPartClick?.('wheel-fl')} />
      <Wheel position={[0.95, -0.5, -0.7]} selected={selectedPart === 'wheel-fr'} onClick={() => onPartClick?.('wheel-fr')} />
      <Wheel position={[-0.95, -0.5, 0.7]} selected={selectedPart === 'wheel-rl'} onClick={() => onPartClick?.('wheel-rl')} />
      <Wheel position={[-0.95, -0.5, -0.7]} selected={selectedPart === 'wheel-rr'} onClick={() => onPartClick?.('wheel-rr')} />

      {/* Battery tray */}
      <Cylinder args={[0.05, 0.05, 2.0, 16]} position={[0, -0.55, 0]} onClick={() => onPartClick?.('battery')}>
        <meshStandardMaterial color={selectedPart === 'battery' ? '#f59e0b' : '#334155'} metalness={0.6} roughness={0.4} />
      </Cylinder>

      {/* Charging port */}
      <mesh position={[-1.1, 0.05, 0.7]} onClick={() => onPartClick?.('charging-port')}>
        <boxGeometry args={[0.12, 0.1, 0.12]} />
        <meshStandardMaterial color={selectedPart === 'charging-port' ? '#a855f7' : '#7c3aed'} metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  )
}