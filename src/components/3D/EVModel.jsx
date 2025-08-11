import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Bounds } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import EnhancedParametricCar from './EnhancedParametricCar'
import { useEVViewerStore } from '../../store/evViewerStore'
import PartsList from './PartsList'
import ShowPartsToggle from './ShowPartsToggle'
import { RotateCcw } from 'lucide-react'

const EVModel = ({ onPartSelect, selectedPart }) => {
  const { triggerResetView } = useEVViewerStore()

  const handlePartClick = (id) => {
    onPartSelect?.(id)
  }

  const handleResetView = () => {
    triggerResetView()
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.6, ease: 'easeOut' }} 
      className="three-model-container h-full w-full rounded-2xl overflow-hidden relative shadow-2xl border border-gray-200 bg-gray-50" 
      style={{ minHeight: '700px' }}
      role="region"
      aria-label="Interactive 3D EV Model Viewer"
    >
      <Canvas 
        frameloop="demand"
        dpr={[1, 1.75]}
        camera={{ position: [3.2, 1.6, 4.2], fov: 45 }} 
        gl={(renderer) => {
          renderer.outputColorSpace = THREE.SRGBColorSpace
          renderer.toneMapping = THREE.ACESFilmicToneMapping
          renderer.toneMappingExposure = 1.0
          return renderer
        }}
        shadows 
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#f7f7f8']} />
        
        {/* Basic lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        <Bounds fit observe margin={1.2} clip>
          <EnhancedParametricCar 
            selectedPart={selectedPart} 
            onPartClick={handlePartClick} 
          />
        </Bounds>
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.08} 
          makeDefault 
        />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4">
        <ShowPartsToggle />
      </div>
      
      <div className="absolute top-4 right-4">
        <button
          onClick={handleResetView}
          aria-label="Reset camera view"
          className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-lg p-3 hover:bg-white/95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center gap-2 text-sm">
            <RotateCcw className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-medium">Reset View</span>
          </div>
        </button>
      </div>
      
      <div className="absolute bottom-4 right-4">
        <PartsList />
      </div>
    </motion.div>
  )
}

export default EVModel
