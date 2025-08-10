import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, RoundedBox, Sphere, Cylinder, Torus } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

const SimpleCar = ({ onPartClick, selectedPart }) => {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01 // Slow rotation
    }
  })

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId)
    }
  }

  return (
    <group ref={groupRef} scale={[1, 1, 1]} position={[0, 0, 0]}>
      {/* Car Body - Modern EV design with smooth curves */}
      <RoundedBox
        position={[0, 0, 0]}
        args={[2.8, 0.8, 1.4]}
        radius={0.1}
        smoothness={8}
        onClick={() => handlePartClick('body')}
      >
        <meshStandardMaterial
          color={selectedPart === 'body' ? '#ff6b6b' : '#4facfe'}
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Car Roof - Sleeker profile */}
      <RoundedBox
        position={[0, 0.55, 0]}
        args={[1.8, 0.2, 1.2]}
        radius={0.08}
        smoothness={6}
        onClick={() => handlePartClick('body')}
      >
        <meshStandardMaterial
          color={selectedPart === 'body' ? '#ff6b6b' : '#4facfe'}
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Hood section */}
      <RoundedBox
        position={[1.0, 0.05, 0]}
        args={[0.8, 0.15, 1.3]}
        radius={0.06}
        smoothness={6}
        onClick={() => handlePartClick('body')}
      >
        <meshStandardMaterial
          color={selectedPart === 'body' ? '#ff6b6b' : '#4facfe'}
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Battery Pack - Realistic flat design */}
      <RoundedBox
        position={[0, -0.6, 0]}
        args={[2.5, 0.2, 1.2]}
        radius={0.04}
        smoothness={6}
        onClick={() => handlePartClick('battery')}
      >
        <meshStandardMaterial
          color={selectedPart === 'battery' ? '#ff9f43' : '#00f2fe'}
          metalness={0.7}
          roughness={0.1}
          emissive={selectedPart === 'battery' ? '#ff9f43' : '#004d5c'}
          emissiveIntensity={selectedPart === 'battery' ? 0.3 : 0.1}
        />
      </RoundedBox>

      {/* Electric Motors - Front and Rear */}
      <Cylinder
        position={[0.8, -0.25, 0]}
        args={[0.25, 0.25, 0.4, 12]}
        onClick={() => handlePartClick('motor')}
      >
        <meshStandardMaterial
          color={selectedPart === 'motor' ? '#26de81' : '#2dd4bf'}
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      <Cylinder
        position={[-0.8, -0.25, 0]}
        args={[0.25, 0.25, 0.4, 12]}
        onClick={() => handlePartClick('motor')}
      >
        <meshStandardMaterial
          color={selectedPart === 'motor' ? '#26de81' : '#2dd4bf'}
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      {/* Wheels - More realistic with rims */}
      {[
        [-1.0, -0.65, 0.7],
        [1.0, -0.65, 0.7],
        [-1.0, -0.65, -0.7],
        [1.0, -0.65, -0.7],
      ].map((position, index) => (
        <group key={`wheel-${index}`} position={position}>
          {/* Tire */}
          <Cylinder args={[0.35, 0.35, 0.25, 16]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#2c3e50" metalness={0.3} roughness={0.7} />
          </Cylinder>

          {/* Rim */}
          <Cylinder args={[0.25, 0.25, 0.27, 12]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
          </Cylinder>

          {/* Center cap */}
          <Cylinder args={[0.08, 0.08, 0.28, 8]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color="#00f2fe"
              metalness={0.9}
              emissive="#004d5c"
              emissiveIntensity={0.2}
            />
          </Cylinder>
        </group>
      ))}

      {/* Modern LED Headlights */}
      <RoundedBox position={[1.4, 0.1, 0.35]} args={[0.08, 0.08, 0.06]} radius={0.02}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#60a5fa"
          emissiveIntensity={0.6}
          metalness={0.1}
          roughness={0.1}
        />
      </RoundedBox>

      <RoundedBox position={[1.4, 0.1, -0.35]} args={[0.08, 0.08, 0.06]} radius={0.02}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#60a5fa"
          emissiveIntensity={0.6}
          metalness={0.1}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Sleek Taillights */}
      <RoundedBox position={[-1.4, 0.1, 0.35]} args={[0.06, 0.06, 0.04]} radius={0.02}>
        <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.7} />
      </RoundedBox>

      <RoundedBox position={[-1.4, 0.1, -0.35]} args={[0.06, 0.06, 0.04]} radius={0.02}>
        <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.7} />
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

      {/* Side Windows */}
      <RoundedBox position={[0.2, 0.45, 0.72]} args={[1.2, 0.3, 0.02]} radius={0.03}>
        <meshStandardMaterial
          color="#60a5fa"
          transparent={true}
          opacity={0.4}
          metalness={0.1}
          roughness={0.05}
        />
      </RoundedBox>

      <RoundedBox position={[0.2, 0.45, -0.72]} args={[1.2, 0.3, 0.02]} radius={0.03}>
        <meshStandardMaterial
          color="#60a5fa"
          transparent={true}
          opacity={0.4}
          metalness={0.1}
          roughness={0.05}
        />
      </RoundedBox>

      {/* Windshield */}
      <RoundedBox
        position={[0.6, 0.45, 0]}
        args={[0.4, 0.5, 1.3]}
        radius={0.05}
        rotation={[0, 0, -0.1]}
      >
        <meshStandardMaterial
          color="#60a5fa"
          transparent={true}
          opacity={0.3}
          metalness={0.1}
          roughness={0.05}
        />
      </RoundedBox>
    </group>
  )
}

const SimpleEVModel = ({ onPartSelect, selectedPart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="h-full w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl overflow-hidden relative"
    >
      <Canvas camera={{ position: [5, 3, 5], fov: 60 }} gl={{ antialias: true }}>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#4facfe" intensity={0.5} />

        {/* 3D Model */}
        <SimpleCar onPartClick={onPartSelect} selectedPart={selectedPart} />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={10}
          minDistance={3}
        />
      </Canvas>
    </motion.div>
  )
}

export default SimpleEVModel
