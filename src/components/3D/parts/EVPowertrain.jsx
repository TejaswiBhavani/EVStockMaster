import React from 'react'
import { RoundedBox, Cylinder } from '@react-three/drei'

const EVPowertrain = ({ selectedPart, onPartClick }) => {
  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId)
    }
  }

  return (
    <group name="ev-powertrain">
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

      {/* Control Unit */}
      <RoundedBox
        position={[0, -0.1, 0]}
        args={[0.4, 0.2, 0.3]}
        radius={0.02}
        onClick={() => handlePartClick('control-unit')}
      >
        <meshStandardMaterial
          color={selectedPart === 'control-unit' ? '#e74c3c' : '#34495e'}
          metalness={0.8}
          roughness={0.2}
          emissive={selectedPart === 'control-unit' ? '#e74c3c' : '#2c3e50'}
          emissiveIntensity={selectedPart === 'control-unit' ? 0.3 : 0.1}
        />
      </RoundedBox>

      {/* Cooling System */}
      <RoundedBox
        position={[0, -0.45, 0.4]}
        args={[1.8, 0.1, 0.2]}
        radius={0.02}
        onClick={() => handlePartClick('cooling-system')}
      >
        <meshStandardMaterial
          color={selectedPart === 'cooling-system' ? '#3498db' : '#2980b9'}
          metalness={0.6}
          roughness={0.3}
          emissive={selectedPart === 'cooling-system' ? '#3498db' : '#1f4e79'}
          emissiveIntensity={selectedPart === 'cooling-system' ? 0.2 : 0.1}
        />
      </RoundedBox>
    </group>
  )
}

export default EVPowertrain
