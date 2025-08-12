import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Bounds } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import EnhancedParametricCar from './EnhancedParametricCar'
import { useEVViewerStore } from '../../store/evViewerStore'
import useSearchStore from '../../store/searchStore'
import PartsList from './PartsList'
import ShowPartsToggle from './ShowPartsToggle'
import UrgentAlerts from './UrgentAlerts'
import { RotateCcw } from 'lucide-react'

const EVModel = ({ onPartSelect, selectedPart }) => {
  const { triggerResetView } = useEVViewerStore()
  const { 
    zoomToPart, 
    clearZoomAction, 
    highlightedPartId,
    setSelectedPart,
    loadUrgentParts 
  } = useSearchStore()
  
  const controlsRef = useRef()
  const cameraRef = useRef()

  // Load urgent parts on mount
  useEffect(() => {
    loadUrgentParts()
  }, [loadUrgentParts])

  // Handle search-triggered zoom to part
  useEffect(() => {
    if (zoomToPart && controlsRef.current && cameraRef.current) {
      const { coordinates } = zoomToPart
      const [x, y, z] = coordinates
      
      // Calculate optimal camera position (offset from the part)
      const offset = 3
      const targetPosition = new THREE.Vector3(x + offset, y + 1, z + offset)
      const lookAtPosition = new THREE.Vector3(x, y, z)
      
      // Smooth camera transition
      const duration = 1500 // ms
      const startPosition = cameraRef.current.position.clone()
      const startTime = performance.now()
      
      const animateCamera = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Use easing function for smooth animation
        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        const easedProgress = easeInOutCubic(progress)
        
        // Interpolate camera position
        cameraRef.current.position.lerpVectors(startPosition, targetPosition, easedProgress)
        
        // Set camera to look at the part
        cameraRef.current.lookAt(lookAtPosition)
        controlsRef.current.target.lerp(lookAtPosition, easedProgress)
        controlsRef.current.update()
        
        if (progress < 1) {
          requestAnimationFrame(animateCamera)
        } else {
          clearZoomAction()
        }
      }
      
      requestAnimationFrame(animateCamera)
    }
  }, [zoomToPart, clearZoomAction])

  const handlePartClick = (id) => {
    setSelectedPart(id)
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
        onCreated={({ camera, controls }) => {
          cameraRef.current = camera
          controlsRef.current = controls
        }}
      >
        <color attach="background" args={['#f7f7f8']} />
        
        {/* Enhanced lighting setup for TATA branding */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        <Bounds fit observe margin={1.2} clip>
          <EnhancedParametricCar 
            selectedPart={highlightedPartId || selectedPart} 
            onPartClick={handlePartClick} 
          />
        </Bounds>
        
        <OrbitControls 
          ref={controlsRef}
          enableDamping 
          dampingFactor={0.08} 
          makeDefault 
        />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4">
        <ShowPartsToggle />
      </div>
      
      <div className="absolute top-4 right-4 flex space-x-2">
        <UrgentAlerts />
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

      {/* TATA Branding */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-lg px-4 py-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800">TATA Motors</div>
              <div className="text-xs text-gray-600">Electric Vehicle</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EVModel
