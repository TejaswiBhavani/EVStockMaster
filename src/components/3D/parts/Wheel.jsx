import React from 'react'
import { Cylinder, Torus } from '@react-three/drei'

export default function Wheel({ position = [0, 0, 0], selected = false, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Torus args={[0.33, 0.08, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#1f2937" roughness={0.9} metalness={0.1} />
      </Torus>
      <Cylinder args={[0.28, 0.28, 0.02, 24]} rotation={[0, 0, 0]}>
        <meshPhysicalMaterial color={selected ? '#60a5fa' : '#cbd5e1'} metalness={0.9} roughness={0.2} />
      </Cylinder>
      {[0, 1, 2, 3, 4].map(i => (
        <Cylinder key={i} args={[0.01, 0.01, 0.26, 8]} rotation={[0, 0, (i * Math.PI) / 5]}>
          <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.3} />
        </Cylinder>
      ))}
    </group>
  )
}