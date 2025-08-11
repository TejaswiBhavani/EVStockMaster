import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import EVChassis from './parts/EVChassis'
import EVPowertrain from './parts/EVPowertrain'
import EVExterior from './parts/EVExterior'
import EVInterior from './parts/EVInterior'
import EVEffects from './parts/EVEffects'

const ModularEVModel = ({ onPartClick, selectedPart }) => {
  const groupRef = useRef()
  const [isCharging, setIsCharging] = useState(false)
  const [engineRunning, setEngineRunning] = useState(true)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003 // Subtle continuous rotation
    }
  })

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId)
    }

    // Toggle charging state when charging port is clicked
    if (partId === 'charging-port') {
      setIsCharging(!isCharging)
    }

    // Toggle engine state when motor is clicked
    if (partId === 'motor') {
      setEngineRunning(!engineRunning)
    }
  }

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={[1.2, 1.2, 1.2]} position={[0, -0.8, 0]} name="modular-ev-model">
        {/* Chassis and Body */}
        <EVChassis selectedPart={selectedPart} onPartClick={handlePartClick} />

        {/* Powertrain System */}
        <EVPowertrain selectedPart={selectedPart} onPartClick={handlePartClick} />

        {/* Exterior Elements */}
        <EVExterior selectedPart={selectedPart} onPartClick={handlePartClick} />

        {/* Interior Components */}
        <EVInterior selectedPart={selectedPart} onPartClick={handlePartClick} />

        {/* Visual Effects and Animations */}
        <EVEffects
          selectedPart={selectedPart}
          isCharging={isCharging}
          engineRunning={engineRunning}
        />
      </group>
    </Float>
  )
}

export default ModularEVModel
