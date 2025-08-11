import React, { useMemo, useRef, useEffect } from 'react'
import { RoundedBox, Cylinder, Sphere, Box, Html, useCursor, Outlines, useBounds } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useEVViewerStore } from '../../store/evViewerStore'
import { THREE_TOKENS, INTERACTIVE_PARTS } from '../../theme/threeTokens'

/**
 * Enhanced parametric car with realistic materials, interaction system, and accessibility
 * Features hover outlines, selection states, labels, and camera focusing
 * @param {Object} props - Component props
 * @param {string} props.selectedPart - Currently selected part ID  
 * @param {Function} props.onPartClick - Handler for part selection
 * @param {Function} props.onPointerMissed - Handler for clearing selection
 */
export default function EnhancedParametricCar({ selectedPart, onPartClick, onPointerMissed }) {
  const boundsRef = useRef()
  const bounds = useBounds()
  const groupRef = useRef()
  
  const { 
    hoveredPart, 
    setHoveredPart, 
    setSelectedPart, 
    showInteractive,
    resetViewToken 
  } = useEVViewerStore()

  // Set cursor based on hover state
  useCursor(!!hoveredPart, 'pointer', 'auto')

  // Handle reset view
  useEffect(() => {
    if (resetViewToken > 0 && bounds) {
      bounds.refresh(groupRef.current).fit()
    }
  }, [resetViewToken, bounds])

  // Enhanced materials using tokens
  const materials = useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial({
      color: THREE_TOKENS.paint.base,
      metalness: THREE_TOKENS.paint.metalness,
      roughness: THREE_TOKENS.paint.roughness,
      clearcoat: THREE_TOKENS.paint.clearcoat,
      clearcoatRoughness: THREE_TOKENS.paint.clearcoatRoughness,
      envMapIntensity: 2.0,
    }),
    bodySecondary: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(THREE_TOKENS.paint.base).multiplyScalar(0.9),
      metalness: THREE_TOKENS.paint.metalness * 0.9,
      roughness: THREE_TOKENS.paint.roughness + 0.05,
      clearcoat: THREE_TOKENS.paint.clearcoat * 0.8,
      clearcoatRoughness: THREE_TOKENS.paint.clearcoatRoughness + 0.04,
      envMapIntensity: 1.5,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: THREE_TOKENS.glass.color,
      transmission: THREE_TOKENS.glass.transmission,
      thickness: THREE_TOKENS.glass.thickness,
      roughness: THREE_TOKENS.glass.roughness,
      metalness: 0.0,
      reflectivity: 0.8,
      transparent: true,
      opacity: THREE_TOKENS.glass.opacity,
      ior: THREE_TOKENS.glass.ior,
    }),
    headlight: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: THREE_TOKENS.lights.head.emissive,
      emissiveIntensity: THREE_TOKENS.lights.head.intensity,
      metalness: 0.1,
      roughness: 0.1,
    }),
    taillight: new THREE.MeshStandardMaterial({
      color: '#dc2626',
      emissive: THREE_TOKENS.lights.tail.emissive,
      emissiveIntensity: THREE_TOKENS.lights.tail.intensity,
      metalness: 0.2,
      roughness: 0.2,
    }),
    wheelRim: new THREE.MeshPhysicalMaterial({
      color: THREE_TOKENS.rimMetal.color,
      metalness: THREE_TOKENS.rimMetal.metalness,
      roughness: THREE_TOKENS.rimMetal.roughness,
      envMapIntensity: 1.0,
    }),
    tire: new THREE.MeshPhysicalMaterial({
      color: THREE_TOKENS.tire.color,
      roughness: THREE_TOKENS.tire.roughness,
      metalness: THREE_TOKENS.tire.metalness,
    }),
    battery: new THREE.MeshStandardMaterial({
      color: '#374151',
      metalness: 0.6,
      roughness: 0.4,
    }),
    motor: new THREE.MeshStandardMaterial({
      color: '#1f2937',
      metalness: 0.8,
      roughness: 0.3,
    }),
    chargingPort: new THREE.MeshStandardMaterial({
      color: '#7c3aed',
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
  }), [])

  // Use frame to apply dimming effect to non-selected parts
  useFrame(() => {
    if (!groupRef.current) return
    
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material && child.userData.partId) {
        const isSelected = child.userData.partId === selectedPart
        const targetOpacity = selectedPart && !isSelected ? 0.35 : 1.0
        
        if (child.material.opacity !== undefined) {
          child.material.opacity = THREE.MathUtils.lerp(
            child.material.opacity, 
            targetOpacity, 
            0.1
          )
          child.material.transparent = targetOpacity < 1.0
        }
      }
    })
  })

  // Interactive part component with hover/selection/click handling
  const InteractivePart = ({ children, partId, position, onPartSelect }) => {
    const meshRef = useRef()
    const isHovered = hoveredPart === partId
    const isSelected = selectedPart === partId
    const partInfo = INTERACTIVE_PARTS[partId]
    
    const handlePointerEnter = (e) => {
      e.stopPropagation()
      setHoveredPart(partId)
    }
    
    const handlePointerLeave = (e) => {
      e.stopPropagation()
      setHoveredPart(null)
    }
    
    const handleClick = (e) => {
      e.stopPropagation()
      const newSelected = selectedPart === partId ? null : partId
      setSelectedPart(newSelected)
      onPartClick?.(newSelected)
      
      // Focus camera on selected part
      if (newSelected && bounds && meshRef.current) {
        bounds.refresh(meshRef.current).fit()
      }
    }

    return (
      <group
        ref={meshRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handleClick}
        userData={{ partId }}
      >
        {children}
        
        {/* Outlines for hover and selection */}
        {(isHovered || isSelected) && (
          <Outlines
            thickness={isSelected ? 0.03 : 0.02}
            color={isSelected ? THREE_TOKENS.interact.selectOutline : THREE_TOKENS.interact.hoverOutline}
          />
        )}
        
        {/* Labels for hovered parts or when showInteractive is enabled */}
        {partInfo && (isHovered || showInteractive) && (
          <Html
            position={[0, 0.8, 0]}
            center
            distanceFactor={8}
            occlude
            transform
            sprite
          >
            <div 
              className="px-2 py-1 rounded text-xs font-medium pointer-events-none"
              style={{
                backgroundColor: THREE_TOKENS.interact.labelBg,
                color: THREE_TOKENS.interact.labelText,
                border: `1px solid ${isSelected ? THREE_TOKENS.interact.selectOutline : THREE_TOKENS.interact.hoverOutline}`
              }}
            >
              {partInfo.name}
            </div>
          </Html>
        )}
      </group>
    )
  }
  // Enhanced wheel component with realistic rim design
  const EnhancedWheel = ({ position, partId }) => {
    return (
      <InteractivePart partId="wheels" position={position}>
        <group position={position}>
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
      </InteractivePart>
    )
  }

  return (
    <group ref={groupRef} onPointerMissed={onPointerMissed}>
      {/* Main body - more aerodynamic shape */}
      <InteractivePart partId="body">
        <RoundedBox 
          args={[3.2, 0.6, 1.6]} 
          radius={0.15} 
          smoothness={8} 
          position={[0, -0.2, 0]}
        >
          <primitive object={materials.body} attach="material" />
        </RoundedBox>
        
        {/* Cabin - more realistic proportions */}
        <RoundedBox 
          args={[1.8, 0.7, 1.4]} 
          radius={0.25} 
          smoothness={12} 
          position={[0.2, 0.15, 0]}
        >
          <primitive object={materials.body} attach="material" />
        </RoundedBox>

        {/* Hood */}
        <RoundedBox 
          args={[0.8, 0.15, 1.5]} 
          radius={0.08} 
          smoothness={6} 
          position={[1.0, 0.05, 0]}
        >
          <primitive object={materials.bodySecondary} attach="material" />
        </RoundedBox>

        {/* Front bumper */}
        <RoundedBox 
          args={[0.3, 0.25, 1.4]} 
          radius={0.12} 
          smoothness={8} 
          position={[1.55, -0.15, 0]}
        >
          <primitive object={materials.bodySecondary} attach="material" />
        </RoundedBox>

        {/* Rear bumper */}
        <RoundedBox 
          args={[0.25, 0.25, 1.4]} 
          radius={0.1} 
          smoothness={6} 
          position={[-1.45, -0.15, 0]}
        >
          <primitive object={materials.bodySecondary} attach="material" />
        </RoundedBox>

        {/* Front grille */}
        <Box args={[0.05, 0.15, 0.8]} position={[1.65, -0.05, 0]}>
          <primitive object={materials.plastic} attach="material" />
        </Box>

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
      </InteractivePart>

      {/* Glass elements - separate to maintain transparency */}
      <group>
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
      </group>

      {/* Enhanced headlights with realistic shape */}
      <InteractivePart partId="headlights">
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
      </InteractivePart>

      {/* Enhanced taillights - full width LED bar style */}
      <InteractivePart partId="taillights">
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
      </InteractivePart>

      {/* Enhanced wheels with realistic design */}
      <EnhancedWheel position={[1.0, -0.5, 0.75]} partId="wheel-fl" />
      <EnhancedWheel position={[1.0, -0.5, -0.75]} partId="wheel-fr" />
      <EnhancedWheel position={[-1.0, -0.5, 0.75]} partId="wheel-rl" />
      <EnhancedWheel position={[-1.0, -0.5, -0.75]} partId="wheel-rr" />

      {/* Enhanced battery pack */}
      <InteractivePart partId="battery">
        <RoundedBox 
          args={[2.5, 0.15, 1.2]} 
          radius={0.05} 
          position={[0, -0.65, 0]}
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
      </InteractivePart>

      {/* Electric motor */}
      <InteractivePart partId="motor">
        <Cylinder 
          args={[0.25, 0.25, 0.4, 16]} 
          rotation={[0, 0, Math.PI/2]} 
          position={[-0.8, -0.4, 0]}
        >
          <primitive object={materials.motor} attach="material" />
        </Cylinder>
        
        {/* Motor housing details */}
        <Box args={[0.3, 0.15, 0.15]} position={[-0.8, -0.4, 0.2]}>
          <primitive object={materials.plastic} attach="material" />
        </Box>
        <Box args={[0.3, 0.15, 0.15]} position={[-0.8, -0.4, -0.2]}>
          <primitive object={materials.plastic} attach="material" />
        </Box>
        
        {/* Drive shaft */}
        <Cylinder args={[0.03, 0.03, 0.6, 8]} rotation={[0, 0, Math.PI/2]} position={[-0.8, -0.5, 0]}>
          <primitive object={materials.chrome} attach="material" />
        </Cylinder>
      </InteractivePart>

      {/* Charging port with better detail */}
      <InteractivePart partId="charging-port">
        <RoundedBox args={[0.15, 0.12, 0.15]} radius={0.02} position={[-1.2, 0.05, 0.75]}>
          <primitive object={materials.chargingPort} attach="material" />
        </RoundedBox>
        
        {/* Charging port cover */}
        <Box args={[0.18, 0.15, 0.02]} position={[-1.15, 0.05, 0.82]}>
          <primitive object={materials.bodySecondary} attach="material" />
        </Box>
      </InteractivePart>
    </group>
  )
}