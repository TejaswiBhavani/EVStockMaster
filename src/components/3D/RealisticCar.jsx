import React, { useMemo, useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import EnhancedParametricCar from './EnhancedParametricCar'

/**
 * RealisticCar component that attempts to load a GLB model with fallback to enhanced parametric car
 * @param {Object} props - Component props
 * @param {string} props.selectedPart - Currently selected part ID
 * @param {Function} props.onPartClick - Handler for part selection
 * @param {string} props.modelUrl - Optional override for model URL
 */
export default function RealisticCar({ selectedPart, onPartClick, modelUrl }) {
  const [shouldUseFallback, setShouldUseFallback] = useState(false)
  const groupRef = useRef()
  
  // Get model URL from environment or use default
  const carModelUrl = modelUrl || import.meta.env.VITE_CAR_MODEL_URL || '/models/ev_sedan.glb'
  
  // Always call useGLTF hook but handle errors gracefully
  let scene, error
  try {
    const gltfResult = useGLTF(carModelUrl, true)
    scene = gltfResult.scene
    error = gltfResult.error
  } catch (e) {
    console.log('GLB loading failed, falling back to parametric car:', e)
    error = e
  }
  
  // If there's an error, switch to fallback
  useEffect(() => {
    if (error && !shouldUseFallback) {
      console.log('GLB model failed to load, using enhanced parametric fallback:', error)
      setShouldUseFallback(true)
    }
  }, [error, shouldUseFallback])

  // Part mapping from mesh names to normalized part IDs
  const partMapping = useMemo(() => ({
    // Body parts
    'body': 'body',
    'chassis': 'body',
    'car_body': 'body',
    
    // Doors
    'door_fl': 'body',
    'door_fr': 'body', 
    'door_rl': 'body',
    'door_rr': 'body',
    'door_front_left': 'body',
    'door_front_right': 'body',
    'door_rear_left': 'body',
    'door_rear_right': 'body',
    
    // Hood and trunk
    'hood': 'body',
    'trunk': 'body',
    'bonnet': 'body',
    'boot': 'body',
    
    // Wheels
    'wheel_fl': 'wheel-fl',
    'wheel_fr': 'wheel-fr', 
    'wheel_rl': 'wheel-rl',
    'wheel_rr': 'wheel-rr',
    'wheel_front_left': 'wheel-fl',
    'wheel_front_right': 'wheel-fr',
    'wheel_rear_left': 'wheel-rl',
    'wheel_rear_right': 'wheel-rr',
    
    // Lights
    'headlight_l': 'headlights',
    'headlight_r': 'headlights',
    'headlight_left': 'headlights',
    'headlight_right': 'headlights',
    'headlights': 'headlights',
    'taillight_l': 'taillights',
    'taillight_r': 'taillights',
    'taillight_left': 'taillights',
    'taillight_right': 'taillights',
    'taillights': 'taillights',
    
    // Glass
    'glass': 'body',
    'windshield': 'body',
    'window': 'body',
    
    // EV specific parts
    'battery': 'battery',
    'battery_pack': 'battery',
    'motor_front': 'body',
    'motor_rear': 'body',
    'charge_port': 'charging-port',
    'charging_port': 'charging-port',
  }), [])

  // Enhanced materials for realistic appearance
  const materials = useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial({
      color: selectedPart === 'body' ? '#2563eb' : '#1e40af',
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.0,
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
    wheel: new THREE.MeshPhysicalMaterial({
      color: '#374151',
      metalness: 0.8,
      roughness: 0.3,
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
  }), [selectedPart])

  // Apply materials and setup interactions when scene loads
  useEffect(() => {
    if (!scene || error || shouldUseFallback) return

    scene.traverse((child) => {
      if (child.isMesh) {
        const meshName = child.name.toLowerCase()
        const partId = Object.keys(partMapping).find(key => 
          meshName.includes(key.toLowerCase())
        )
        
        if (partId) {
          const normalizedPartId = partMapping[partId]
          
          // Apply appropriate material based on mesh type
          if (meshName.includes('glass') || meshName.includes('window') || meshName.includes('windshield')) {
            child.material = materials.glass
          } else if (meshName.includes('headlight')) {
            child.material = materials.headlight
          } else if (meshName.includes('taillight')) {
            child.material = materials.taillight
          } else if (meshName.includes('wheel')) {
            child.material = materials.wheel
          } else if (meshName.includes('battery')) {
            child.material = materials.battery
          } else if (meshName.includes('charge')) {
            child.material = materials.chargingPort
          } else {
            child.material = materials.body
          }
          
          // Add interaction handlers
          child.userData.partId = normalizedPartId
          child.userData.interactive = true
          
          // Enhance cursor and add larger hit box for better interaction
          child.cursor = 'pointer'
          
          // Create invisible larger hit box for better pointer interaction
          const hitBox = child.clone()
          hitBox.scale.multiplyScalar(1.2)
          hitBox.material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            visible: false
          })
          hitBox.userData.partId = normalizedPartId
          hitBox.userData.isHitBox = true
          child.parent.add(hitBox)
        }
        
        // Enable shadows
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene, error, shouldUseFallback, materials, partMapping])

  // Handle pointer down events (more reliable than onClick)
  const handlePointerDown = (event) => {
    event.stopPropagation()
    
    const object = event.object
    const partId = object.userData.partId
    
    if (partId && onPartClick) {
      onPartClick(partId)
    }
  }

  // Handle scene pointer missed for clearing selection
  const handlePointerMissed = () => {
    if (onPartClick) {
      onPartClick(null)
    }
  }

  // If GLB failed to load or we decided to use fallback, show enhanced parametric fallback
  if (shouldUseFallback || error) {
    return (
      <EnhancedParametricCar 
        selectedPart={selectedPart} 
        onPartClick={onPartClick}
        onPointerMissed={handlePointerMissed}
      />
    )
  }

  // If GLB is still loading, show loading placeholder
  if (!scene) {
    return (
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[2, 1, 4]} />
          <meshStandardMaterial color="#94a3b8" transparent opacity={0.5} />
        </mesh>
      </group>
    )
  }

  // Render the loaded GLB model
  return (
    <group 
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMissed={handlePointerMissed}
    >
      <primitive 
        object={scene} 
        scale={[1, 1, 1]}
        position={[0, 0, 0]}
      />
    </group>
  )
}

// Optionally preload the GLB (will silently fail if file doesn't exist)
// We wrap this in a try-catch to prevent any startup errors
try {
  const defaultModelUrl = import.meta.env.VITE_CAR_MODEL_URL || '/models/ev_sedan.glb'
  useGLTF.preload(defaultModelUrl)
} catch (error) {
  console.log('GLB preload failed (will use fallback):', error)
}