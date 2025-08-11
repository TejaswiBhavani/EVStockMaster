import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stats } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import CarModel from './CarModel'
import PostFX from './PostFX'

const EVModel = ({ onPartSelect, selectedPart }) => {
  const getPartLabel = (partId) => {
    if (!partId) return 'Interactive EV - Click parts to explore'
    const labels = {
      body: 'Aero body with high-reflective paint',
      battery: 'Battery tray & pack region',
      'charging-port': 'CCS/NACS charging port',
      'headlights': 'LED matrix headlights',
      'taillights': 'Full-width LED bar',
      'wheel-fl': 'Front-left wheel & rim',
      'wheel-fr': 'Front-right wheel & rim',
      'wheel-rl': 'Rear-left wheel & rim',
      'wheel-rr': 'Rear-right wheel & rim',
    }
    return labels[partId] || 'EV Component Selected'
  }

  const handlePartClick = (id) => {
    onPartSelect?.(id)
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="three-model-container h-full w-full bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 rounded-2xl overflow-hidden relative shadow-2xl border border-gray-200" style={{ minHeight: '700px' }}>
      <Canvas camera={{ position: [7.5, 4.5, 8.5], fov: 50 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, preserveDrawingBuffer: true }} shadows dpr={[1, 2]} performance={{ min: 0.6 }}>
        <color attach="background" args={['#f0f4f8']} />
        <hemisphereLight intensity={0.5} />
        <spotLight position={[6, 8, 5]} angle={0.35} penumbra={0.6} intensity={1.5} castShadow />
        <directionalLight position={[-6, 6, -5]} intensity={0.8} />
        <group position={[0, -0.6, 0]} rotation={[0, 0.25, 0]} onPointerMissed={() => handlePartClick(null)}>
          <CarModel selectedPart={selectedPart} onPartClick={handlePartClick} />
        </group>
        <OrbitControls enablePan={false} minDistance={4} maxDistance={14} />
        <Stats />
      </Canvas>
      <div className="absolute left-4 bottom-4 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-md border border-gray-200 shadow-md text-sm">
        {getPartLabel(selectedPart)}
      </div>
    </motion.div>
  )
}

export default EVModel
