import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, RoundedBox, Sphere, Cylinder, Torus, PresentationControls, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const ModernEVModel = ({ onPartClick, selectedPart }) => {
  const groupRef = useRef();
  const wheelRefs = useRef([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003; // Subtle continuous rotation
    }
    
    // Rotate wheels for dynamic effect
    wheelRefs.current.forEach((wheel, index) => {
      if (wheel) {
        wheel.rotation.x += 0.02;
      }
    });
  });

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  // Get dynamic label based on selected part
  const getPartLabel = () => {
    if (!selectedPart) return "Interactive EV Model - Click any part to explore";
    
    const partLabels = {
      'body': 'Advanced Carbon Fiber Body - Lightweight & Aerodynamic',
      'battery': 'High-Performance Lithium-Ion Battery Pack - 100kWh',
      'motor': 'Dual Electric Motors - 400HP Combined Output',
      'charging-port': 'Fast Charging Port - CCS Type 2 (350kW)',
      'control-unit': 'AI-Powered Vehicle Control Unit',
      'cooling-system': 'Advanced Battery Thermal Management System',
      'suspension': 'Adaptive Air Suspension System',
      'brakes': 'Regenerative Braking System',
      'doors': 'Smart Entry Falcon Wing Doors'
    };
    
    return partLabels[selectedPart] || "EV Component Selected";
  };

  // Enhanced materials with better performance and realism
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'body' ? '#2563eb' : '#4facfe',
    metalness: 0.6,
    roughness: 0.3,
  }), [selectedPart]);
  
  const batteryMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'battery' ? '#0ea5e9' : '#00f2fe',
    metalness: 0.5,
    roughness: 0.4,
    emissive: selectedPart === 'battery' ? '#0ea5e9' : '#004d5c',
    emissiveIntensity: selectedPart === 'battery' ? 0.2 : 0.05,
  }), [selectedPart]);

  const motorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'motor' ? '#059669' : '#2dd4bf',
    metalness: 0.7,
    roughness: 0.2,
    emissive: selectedPart === 'motor' ? '#065f46' : '#0f766e',
    emissiveIntensity: selectedPart === 'motor' ? 0.15 : 0.03,
  }), [selectedPart]);

  const chargingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'charging-port' ? '#7c3aed' : '#a855f7',
    metalness: 0.6,
    roughness: 0.3,
    emissive: selectedPart === 'charging-port' ? '#5b21b6' : '#7c3aed',
    emissiveIntensity: selectedPart === 'charging-port' ? 0.3 : 0.1,
  }), [selectedPart]);

  const controlMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: selectedPart === 'control-unit' ? '#dc2626' : '#ef4444',
    metalness: 0.4,
    roughness: 0.5,
    emissive: selectedPart === 'control-unit' ? '#991b1b' : '#dc2626',
    emissiveIntensity: selectedPart === 'control-unit' ? 0.15 : 0.03,
  }), [selectedPart]);

  const coolingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: selectedPart === 'cooling-system' ? '#0284c7' : '#38bdf8',
    metalness: 0.5,
    roughness: 0.4,
    emissive: selectedPart === 'cooling-system' ? '#0369a1' : '#0ea5e9',
    emissiveIntensity: selectedPart === 'cooling-system' ? 0.15 : 0.05,
  }), [selectedPart]);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#1f2937',
    metalness: 0.3,
    roughness: 0.7,
  }), []);

  const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#9ca3af',
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#60a5fa',
    transparent: true,
    opacity: 0.4,
    metalness: 0.1,
    roughness: 0.05,
  }), []);

  const interiorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#374151',
    metalness: 0.1,
    roughness: 0.8,
  }), []);

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={[1.2, 1.2, 1.2]} position={[0, -0.8, 0]}>
        
        {/* Main Car Body - More realistic EV sedan shape with smooth curves */}
        <group onClick={() => handlePartClick('body')}>
          {/* Main chassis - lower and more streamlined */}
          <RoundedBox
            position={[0, -0.1, 0]}
            args={[4.8, 1.0, 2.1]}
            radius={0.15}
            smoothness={10}
            material={bodyMaterial}
          />
          
          {/* Car hood - sleek and aerodynamic */}
          <RoundedBox
            position={[1.9, 0.05, 0]}
            args={[1.2, 0.18, 2.0]}
            radius={0.08}
            smoothness={8}
            material={bodyMaterial}
          />
          
          {/* Car roof - curved sedan profile */}
          <RoundedBox
            position={[0.1, 0.85, 0]}
            args={[2.6, 0.25, 1.8]}
            radius={0.12}
            smoothness={10}
            material={bodyMaterial}
          />
          
          {/* A-pillar curves */}
          <RoundedBox
            position={[1.0, 0.6, 0.85]}
            args={[0.6, 0.4, 0.08]}
            radius={0.04}
            smoothness={6}
            material={bodyMaterial}
          />
          <RoundedBox
            position={[1.0, 0.6, -0.85]}
            args={[0.6, 0.4, 0.08]}
            radius={0.04}
            smoothness={6}
            material={bodyMaterial}
          />
          
          {/* Rear section - streamlined trunk */}
          <RoundedBox
            position={[-1.6, 0.1, 0]}
            args={[1.4, 0.7, 1.9]}
            radius={0.1}
            smoothness={8}
            material={bodyMaterial}
          />
          
          {/* Front bumper - curved and aerodynamic */}
          <RoundedBox
            position={[2.45, -0.35, 0]}
            args={[0.15, 0.5, 2.0]}
            radius={0.08}
            smoothness={6}
            material={bodyMaterial}
          />
          
          {/* Rear bumper - sleek design */}
          <RoundedBox
            position={[-2.45, -0.35, 0]}
            args={[0.15, 0.5, 2.0]}
            radius={0.08}
            smoothness={6}
            material={bodyMaterial}
          />
          
          {/* Side skirts for aerodynamics */}
          <RoundedBox
            position={[0, -0.65, 1.15]}
            args={[3.5, 0.15, 0.1]}
            radius={0.05}
            smoothness={4}
            material={bodyMaterial}
          />
          <RoundedBox
            position={[0, -0.65, -1.15]}
            args={[3.5, 0.15, 0.1]}
            radius={0.05}
            smoothness={4}
            material={bodyMaterial}
          />
          
          {/* Front air intake - realistic grille */}
          <RoundedBox
            position={[2.35, -0.1, 0]}
            args={[0.05, 0.3, 1.2]}
            radius={0.02}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#1a1a1a" 
              metalness={0.8} 
              roughness={0.2}
            />
          </RoundedBox>
          
          {/* Rear spoiler for aerodynamics */}
          <RoundedBox
            position={[-2.2, 0.95, 0]}
            args={[0.2, 0.08, 1.4]}
            radius={0.04}
            smoothness={4}
            material={bodyMaterial}
          />
        </group>

        {/* Enhanced Battery Pack - Tesla-style flat pack with realistic structure */}
        <group onClick={() => handlePartClick('battery')}>
          {/* Main battery pack housing */}
          <RoundedBox
            position={[0, -1.0, 0]}
            args={[4.0, 0.25, 1.8]}
            radius={0.05}
            smoothness={6}
            material={batteryMaterial}
          />
          
          {/* Battery cell modules - realistic layout */}
          {[-1.5, -0.5, 0.5, 1.5].map((x, index) => (
            <RoundedBox
              key={`battery-module-${index}`}
              position={[x, -1.18, 0]}
              args={[0.6, 0.12, 1.6]}
              radius={0.02}
              smoothness={4}
              material={batteryMaterial}
            />
          ))}
          
          {/* Battery cooling plates - thermal management */}
          {[-1.0, 0, 1.0].map((x, index) => (
            <RoundedBox
              key={`cooling-plate-${index}`}
              position={[x, -1.3, 0]}
              args={[0.7, 0.03, 1.7]}
              radius={0.01}
              smoothness={3}
              material={coolingMaterial}
            />
          ))}
          
          {/* Battery management system */}
          <RoundedBox
            position={[0, -0.85, 0]}
            args={[0.8, 0.08, 0.4]}
            radius={0.02}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#2563eb" 
              metalness={0.7} 
              roughness={0.3}
              emissive="#1e40af"
              emissiveIntensity={0.1}
            />
          </RoundedBox>
          
          {/* Protective armor plating */}
          <RoundedBox
            position={[0, -1.35, 0]}
            args={[4.2, 0.05, 2.0]}
            radius={0.02}
            smoothness={4}
          >
            <meshStandardMaterial 
              color="#374151" 
              metalness={0.8} 
              roughness={0.2}
            />
          </RoundedBox>
        </group>

        {/* Dual Motor Setup - Realistic electric motor design */}
        <group onClick={() => handlePartClick('motor')}>
          {/* Front motor assembly */}
          <group position={[1.8, -0.4, 0]}>
            {/* Motor housing */}
            <Cylinder
              args={[0.35, 0.45, 0.7, 16]}
              material={motorMaterial}
            />
            {/* Motor cooling fins */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <RoundedBox
                key={`front-fin-${i}`}
                position={[0, 0, 0]}
                args={[0.02, 0.4, 0.8]}
                radius={0.01}
                rotation={[0, (i * Math.PI) / 3, 0]}
                material={motorMaterial}
              />
            ))}
            {/* Motor mount */}
            <RoundedBox
              position={[0, -0.45, 0]}
              args={[0.6, 0.1, 0.6]}
              radius={0.02}
              material={motorMaterial}
            />
          </group>
          
          {/* Rear motor assembly */}
          <group position={[-1.8, -0.4, 0]}>
            {/* Motor housing */}
            <Cylinder
              args={[0.35, 0.45, 0.7, 16]}
              material={motorMaterial}
            />
            {/* Motor cooling fins */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <RoundedBox
                key={`rear-fin-${i}`}
                position={[0, 0, 0]}
                args={[0.02, 0.4, 0.8]}
                radius={0.01}
                rotation={[0, (i * Math.PI) / 3, 0]}
                material={motorMaterial}
              />
            ))}
            {/* Motor mount */}
            <RoundedBox
              position={[0, -0.45, 0]}
              args={[0.6, 0.1, 0.6]}
              radius={0.02}
              material={motorMaterial}
            />
          </group>
          
          {/* Drive shafts */}
          <Cylinder
            position={[1.8, -0.4, 1.0]}
            args={[0.05, 0.05, 0.4, 8]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color="#4b5563" metalness={0.9} roughness={0.1} />
          </Cylinder>
          <Cylinder
            position={[1.8, -0.4, -1.0]}
            args={[0.05, 0.05, 0.4, 8]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color="#4b5563" metalness={0.9} roughness={0.1} />
          </Cylinder>
          <Cylinder
            position={[-1.8, -0.4, 1.0]}
            args={[0.05, 0.05, 0.4, 8]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color="#4b5563" metalness={0.9} roughness={0.1} />
          </Cylinder>
          <Cylinder
            position={[-1.8, -0.4, -1.0]}
            args={[0.05, 0.05, 0.4, 8]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color="#4b5563" metalness={0.9} roughness={0.1} />
          </Cylinder>
        </group>

        {/* Advanced Charging Port */}
        <group onClick={() => handlePartClick('charging-port')}>
          <Box
            position={[-2.1, 0.3, 1.0]}
            scale={[0.2, 0.4, 0.3]}
            material={chargingMaterial}
          />
          
          {/* Charging port door */}
          <Box
            position={[-2.2, 0.3, 1.0]}
            scale={[0.05, 0.5, 0.4]}
            material={bodyMaterial}
          />
          
          {/* Charging indicator lights */}
          <Sphere
            position={[-2.05, 0.4, 1.0]}
            args={[0.03, 8, 8]}
            material={new THREE.MeshStandardMaterial({ 
              color: '#10b981', 
              emissive: '#10b981', 
              emissiveIntensity: 0.5 
            })}
          />
        </group>

        {/* Vehicle Control Unit */}
        <group onClick={() => handlePartClick('control-unit')}>
          <Box
            position={[0, 0.6, 0]}
            scale={[1.0, 0.4, 0.8]}
            material={controlMaterial}
          />
          
          {/* ECU components */}
          <Box
            position={[0.3, 0.6, 0]}
            scale={[0.3, 0.2, 0.3]}
            material={controlMaterial}
          />
          <Box
            position={[-0.3, 0.6, 0]}
            scale={[0.3, 0.2, 0.3]}
            material={controlMaterial}
          />
        </group>

        {/* Enhanced Cooling System */}
        <group onClick={() => handlePartClick('cooling-system')}>
          {/* Front radiator */}
          <Box
            position={[2.1, -0.2, 0]}
            scale={[0.2, 0.8, 1.6]}
            material={coolingMaterial}
          />
          
          {/* Cooling lines */}
          {[0.3, -0.3].map((y, index) => (
            <Cylinder
              key={`cooling-line-${index}`}
              position={[1.5, y, 0]}
              args={[0.03, 0.03, 1.0, 8]}
              rotation={[0, 0, Math.PI / 2]}
              material={coolingMaterial}
            />
          ))}
          
          {/* Heat exchanger */}
          <Box
            position={[1.0, -0.8, 0]}
            scale={[0.8, 0.2, 1.4]}
            material={coolingMaterial}
          />
        </group>

        {/* Suspension System */}
        <group onClick={() => handlePartClick('suspension')}>
          {[[-1.6, -1.2, 1.0], [1.6, -1.2, 1.0], [-1.6, -1.2, -1.0], [1.6, -1.2, -1.0]].map((position, index) => (
            <group key={`suspension-${index}`} position={position}>
              <Cylinder
                args={[0.08, 0.12, 0.6, 8]}
                material={new THREE.MeshStandardMaterial({ color: '#6b7280', metalness: 0.8 })}
              />
              <Sphere
                position={[0, 0.3, 0]}
                args={[0.1, 8, 8]}
                material={new THREE.MeshStandardMaterial({ color: '#374151', metalness: 0.7 })}
              />
            </group>
          ))}
        </group>

        {/* Enhanced Wheels with realistic rims and better proportions */}
        {[[-1.7, -1.25, 1.15], [1.7, -1.25, 1.15], [-1.7, -1.25, -1.15], [1.7, -1.25, -1.15]].map((position, index) => (
          <group key={`wheel-${index}`} position={position}>
            {/* Main tire - more realistic proportions */}
            <Cylinder
              ref={(el) => (wheelRefs.current[index] = el)}
              args={[0.65, 0.65, 0.35, 32]}
              rotation={[Math.PI / 2, 0, 0]}
              material={wheelMaterial}
            />
            
            {/* Tire sidewall details */}
            <Torus
              args={[0.65, 0.05, 8, 32]}
              position={[0, 0, 0.15]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial color="#2d3748" metalness={0.1} roughness={0.9} />
            </Torus>
            <Torus
              args={[0.65, 0.05, 8, 32]}
              position={[0, 0, -0.15]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial color="#2d3748" metalness={0.1} roughness={0.9} />
            </Torus>
            
            {/* Main rim */}
            <Cylinder
              args={[0.45, 0.45, 0.38, 16]}
              rotation={[Math.PI / 2, 0, 0]}
              material={rimMaterial}
            />
            
            {/* Rim spokes - modern 5-spoke design */}
            {[0, 1, 2, 3, 4].map((spoke) => (
              <RoundedBox
                key={`spoke-${index}-${spoke}`}
                position={[0, 0, 0]}
                args={[0.04, 0.35, 0.04]}
                radius={0.02}
                rotation={[0, 0, (spoke * Math.PI * 2) / 5]}
                material={rimMaterial}
              />
            ))}
            
            {/* Inner rim detail */}
            <Cylinder
              args={[0.35, 0.35, 0.4, 16]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial 
                color="#9ca3af" 
                metalness={0.7} 
                roughness={0.3}
              />
            </Cylinder>
            
            {/* Center cap with EV logo */}
            <Cylinder
              args={[0.12, 0.12, 0.42, 16]}
              rotation={[Math.PI / 2, 0, 0]}
              material={new THREE.MeshStandardMaterial({ 
                color: '#00f2fe', 
                metalness: 0.9, 
                emissive: '#004d5c',
                emissiveIntensity: 0.3
              })}
            />
            
            {/* Brake disc behind rim */}
            <Cylinder
              args={[0.28, 0.28, 0.02, 32]}
              position={[0, 0, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial 
                color="#4a5568" 
                metalness={0.8} 
                roughness={0.4}
              />
            </Cylinder>
            
            {/* Brake caliper */}
            <RoundedBox
              position={[0, -0.4, 0]}
              args={[0.15, 0.08, 0.25]}
              radius={0.02}
            >
              <meshStandardMaterial 
                color="#dc2626" 
                metalness={0.6} 
                roughness={0.3}
              />
            </RoundedBox>
          </group>
        ))}

        {/* Enhanced Glass Elements with realistic curvature */}
        <group>
          {/* Windshield - curved and realistic */}
          <RoundedBox
            position={[1.0, 0.75, 0]}
            args={[0.75, 0.9, 1.7]}
            radius={0.1}
            rotation={[0, 0, -0.15]}
            material={glassMaterial}
          />
          
          {/* Rear window - curved */}
          <RoundedBox
            position={[-1.3, 0.75, 0]}
            args={[0.55, 0.7, 1.7]}
            radius={0.08}
            rotation={[0, 0, 0.12]}
            material={glassMaterial}
          />
          
          {/* Side windows - curved for aerodynamics */}
          <RoundedBox
            position={[0.3, 0.85, 1.08]}
            args={[1.8, 0.55, 0.03]}
            radius={0.05}
            material={glassMaterial}
          />
          <RoundedBox
            position={[0.3, 0.85, -1.08]}
            args={[1.8, 0.55, 0.03]}
            radius={0.05}
            material={glassMaterial}
          />
          
          {/* Quarter windows */}
          <RoundedBox
            position={[-0.8, 0.85, 1.08]}
            args={[0.6, 0.4, 0.03]}
            radius={0.04}
            material={glassMaterial}
          />
          <RoundedBox
            position={[-0.8, 0.85, -1.08]}
            args={[0.6, 0.4, 0.03]}
            radius={0.04}
            material={glassMaterial}
          />
          
          {/* Sunroof */}
          <RoundedBox
            position={[0.2, 1.08, 0]}
            args={[1.2, 0.03, 0.8]}
            radius={0.02}
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

        {/* Interior Details - Modern EV cabin */}
        <group>
          {/* Dashboard - futuristic design */}
          <RoundedBox
            position={[1.1, 0.15, 0]}
            args={[0.7, 0.25, 1.5]}
            radius={0.05}
            material={interiorMaterial}
          />
          
          {/* Center console with touchscreen */}
          <RoundedBox
            position={[0.8, 0.3, 0]}
            args={[0.02, 0.4, 0.6]}
            radius={0.01}
          >
            <meshStandardMaterial 
              color="#1f2937" 
              metalness={0.1} 
              roughness={0.1}
              emissive="#60a5fa"
              emissiveIntensity={0.1}
            />
          </RoundedBox>
          
          {/* Modern bucket seats */}
          {[[0.4, 0.05, 0.35], [0.4, 0.05, -0.35], [-0.4, 0.05, 0.35], [-0.4, 0.05, -0.35]].map((position, index) => (
            <group key={`seat-${index}`} position={position}>
              {/* Seat base */}
              <RoundedBox
                args={[0.35, 0.25, 0.35]}
                radius={0.02}
                material={interiorMaterial}
              />
              {/* Seat back */}
              <RoundedBox
                position={[0, 0.3, -0.05]}
                args={[0.35, 0.5, 0.08]}
                radius={0.02}
                material={interiorMaterial}
              />
              {/* Headrest */}
              <RoundedBox
                position={[0, 0.65, 0]}
                args={[0.25, 0.15, 0.08]}
                radius={0.02}
                material={interiorMaterial}
              />
            </group>
          ))}
          
          {/* Steering wheel - modern design */}
          <group position={[0.9, 0.35, 0.35]}>
            <Torus
              args={[0.18, 0.03, 8, 16]}
              rotation={[0, 0, Math.PI / 2]}
              material={interiorMaterial}
            />
            {/* Steering wheel center */}
            <Cylinder
              args={[0.08, 0.08, 0.02, 16]}
              rotation={[0, 0, Math.PI / 2]}
              material={new THREE.MeshStandardMaterial({
                color: '#00f2fe',
                emissive: '#004d5c',
                emissiveIntensity: 0.2
              })}
            />
          </group>
          
          {/* Center armrest */}
          <RoundedBox
            position={[0, 0.1, 0]}
            args={[0.8, 0.08, 0.15]}
            radius={0.02}
            material={interiorMaterial}
          />
        </group>

        {/* Enhanced LED Lighting System */}
        <group>
          {/* Modern LED headlights - sleek design */}
          {[[-0.4, 0.15, 2.35], [0.4, 0.15, 2.35]].map((position, index) => (
            <group key={`headlight-${index}`} position={position}>
              {/* Main headlight housing */}
              <RoundedBox
                args={[0.25, 0.12, 0.08]}
                radius={0.02}
                material={new THREE.MeshStandardMaterial({ 
                  color: '#f8fafc',
                  emissive: '#60a5fa',
                  emissiveIntensity: 0.6,
                  metalness: 0.1,
                  roughness: 0.1
                })}
              />
              {/* LED strips */}
              <RoundedBox
                position={[0, 0.08, 0.05]}
                args={[0.2, 0.02, 0.01]}
                radius={0.005}
                material={new THREE.MeshStandardMaterial({ 
                  color: '#ffffff',
                  emissive: '#60a5fa',
                  emissiveIntensity: 1.0
                })}
              />
              {/* Inner lens */}
              <Sphere
                args={[0.08, 12, 12]}
                position={[0, 0, 0.04]}
                material={new THREE.MeshStandardMaterial({ 
                  color: '#e0f2fe',
                  emissive: '#3b82f6',
                  emissiveIntensity: 0.4,
                  transparent: true,
                  opacity: 0.8
                })}
              />
            </group>
          ))}
          
          {/* Sleek LED taillights */}
          {[[-0.5, 0.15, -2.35], [0.5, 0.15, -2.35]].map((position, index) => (
            <group key={`taillight-${index}`} position={position}>
              {/* Main taillight */}
              <RoundedBox
                args={[0.2, 0.08, 0.05]}
                radius={0.02}
                material={new THREE.MeshStandardMaterial({ 
                  color: '#dc2626',
                  emissive: '#ef4444',
                  emissiveIntensity: 0.7,
                  metalness: 0.2,
                  roughness: 0.1
                })}
              />
              {/* LED accent strip */}
              <RoundedBox
                position={[0, 0.05, 0.03]}
                args={[0.15, 0.01, 0.01]}
                radius={0.005}
                material={new THREE.MeshStandardMaterial({ 
                  color: '#ffffff',
                  emissive: '#ef4444',
                  emissiveIntensity: 1.2
                })}
              />
            </group>
          ))}
          
          {/* Side marker lights */}
          {[[1.8, 0.3, 1.1], [1.8, 0.3, -1.1], [-1.8, 0.3, 1.1], [-1.8, 0.3, -1.1]].map((position, index) => (
            <Sphere
              key={`marker-${index}`}
              position={position}
              args={[0.03, 8, 8]}
              material={new THREE.MeshStandardMaterial({ 
                color: index < 2 ? '#fbbf24' : '#dc2626',
                emissive: index < 2 ? '#f59e0b' : '#ef4444',
                emissiveIntensity: 0.8
              })}
            />
          ))}
          
          {/* Modern side mirrors with integrated turn signals */}
          {[[0.8, 0.75, 1.25], [0.8, 0.75, -1.25]].map((position, index) => (
            <group key={`mirror-${index}`} position={position}>
              {/* Mirror housing */}
              <RoundedBox
                args={[0.18, 0.12, 0.08]}
                radius={0.02}
                material={bodyMaterial}
              />
              {/* Mirror glass */}
              <RoundedBox
                position={[0.05, 0, 0]}
                args={[0.02, 0.1, 0.06]}
                radius={0.01}
                material={new THREE.MeshStandardMaterial({
                  color: '#374151',
                  metalness: 0.9,
                  roughness: 0.1
                })}
              />
              {/* Turn signal */}
              <Sphere
                position={[0, 0.08, 0]}
                args={[0.02, 8, 8]}
                material={new THREE.MeshStandardMaterial({ 
                  color: '#fbbf24',
                  emissive: '#f59e0b',
                  emissiveIntensity: 0.6
                })}
              />
            </group>
          ))}
        </group>

        {/* Door Handles and Details - Modern flush design */}
        <group onClick={() => handlePartClick('doors')}>
          {[[0.5, 0.25, 1.12], [0.5, 0.25, -1.12], [-0.5, 0.25, 1.12], [-0.5, 0.25, -1.12]].map((position, index) => (
            <group key={`door-handle-${index}`} position={position}>
              {/* Modern flush door handle */}
              <RoundedBox
                args={[0.12, 0.04, 0.03]}
                radius={0.01}
                material={new THREE.MeshStandardMaterial({ 
                  color: '#6b7280',
                  metalness: 0.8,
                  roughness: 0.2
                })}
              />
              {/* Door handle recess */}
              <RoundedBox
                position={[0, 0, -0.02]}
                args={[0.14, 0.06, 0.01]}
                radius={0.01}
                material={bodyMaterial}
              />
            </group>
          ))}
          
          {/* Door frames */}
          {[[0.8, 0.6, 1.13], [0.8, 0.6, -1.13], [-0.3, 0.6, 1.13], [-0.3, 0.6, -1.13]].map((position, index) => (
            <RoundedBox
              key={`door-frame-${index}`}
              position={position}
              args={[1.2, 0.8, 0.02]}
              radius={0.05}
              material={new THREE.MeshStandardMaterial({
                color: '#1f2937',
                metalness: 0.7,
                roughness: 0.3
              })}
            />
          ))}
        </group>

        {/* Brand Badge */}
        <Cylinder
          position={[0, 0.4, 2.2]}
          args={[0.1, 0.1, 0.02, 16]}
          material={new THREE.MeshStandardMaterial({ 
            color: '#00f2fe',
            emissive: '#004d5c',
            emissiveIntensity: 0.3,
            metalness: 0.9
          })}
        />

        {/* Dynamic Labels - Temporarily removed to fix rendering issues */}
        {/* Will add HTML overlays instead of 3D text */}
      </group>
    </Float>
  );
};

const EVModel = ({ onPartSelect, selectedPart }) => {
  // Helper function for part descriptions
  const getPartLabel = (partId) => {
    if (!partId) return "Interactive EV Model - Click any part to explore";
    
    const partLabels = {
      'body': 'Advanced Carbon Fiber Body - Lightweight & Aerodynamic',
      'battery': 'High-Performance Lithium-Ion Battery Pack - 100kWh',
      'motor': 'Dual Electric Motors - 400HP Combined Output',
      'charging-port': 'Fast Charging Port - CCS Type 2 (350kW)',
      'control-unit': 'AI-Powered Vehicle Control Unit',
      'cooling-system': 'Advanced Battery Thermal Management System',
      'suspension': 'Adaptive Air Suspension System',
      'brakes': 'Regenerative Braking System',
      'doors': 'Smart Entry Falcon Wing Doors'
    };
    
    return partLabels[partId] || "EV Component Selected";
  };

  // Debug logging to check component mounting
  React.useEffect(() => {
    console.log("✅ 3D Model Viewer initialized");
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      console.log("✅ WebGL supported");
    } else {
      console.error("❌ WebGL not supported");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="three-model-container h-full w-full bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 rounded-2xl overflow-hidden relative shadow-2xl border border-gray-200"
      style={{ 
        minHeight: '700px',
        height: '100%',
        width: '100%',
        display: 'block',
        position: 'relative'
      }}
    >
      {/* Electric Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-400/5 via-electric-500/5 to-electric-400/5"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
      
      {/* 3D Scene - Enhanced Setup */}
      <Canvas 
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          preserveDrawingBuffer: true
        }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '600px',
          display: 'block',
          background: 'transparent'
        }}
        onCreated={(state) => {
          console.log("✅ 3D Canvas initialized successfully");
        }}
        onError={(error) => {
          console.error("❌ Canvas error:", error);
        }}
      >
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.8} color="#f8fafc" />
        
        {/* Main directional light */}
        <directionalLight 
          position={[8, 8, 5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={30}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
        
        {/* Fill lights for better illumination */}
        <pointLight 
          position={[-6, 4, -6]} 
          intensity={1.0} 
          color="#60a5fa"
          distance={15}
          decay={2}
        />
        
        <pointLight 
          position={[6, 4, 6]} 
          intensity={1.0} 
          color="#34d399"
          distance={15}
          decay={2}
        />
        
        {/* Rim light for dramatic effect */}
        <spotLight
          position={[0, 10, -8]}
          angle={0.3}
          penumbra={0.5}
          intensity={1.2}
          color="#a855f7"
          distance={20}
          decay={2}
        />
        
        {/* 3D Model with enhanced presentation controls */}
        <PresentationControls
          global
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 1200 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <ModernEVModel onPartClick={onPartSelect} selectedPart={selectedPart} />
        </PresentationControls>

        {/* Enhanced Orbit Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={15}
          minDistance={3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
          autoRotateSpeed={0.5}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Canvas>

      {/* UI Overlay - Enhanced and Responsive */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 pointer-events-auto max-w-sm"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interactive 3D Model
            </h3>
          </div>
          <p className="text-sm text-gray-700 mb-4">Click on parts to view detailed information</p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Body & Chassis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Battery Pack</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Electric Motors</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Charging Port</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Control Systems</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 pointer-events-auto"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center">
            <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Model Status
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Rendering</span>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              WebGL Accelerated
            </div>
          </div>
        </motion.div>
      </div>

      {/* Selected Part Information Panel */}
      {selectedPart && (
        <motion.div 
          className="absolute top-20 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 pointer-events-auto max-w-md"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 20 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900 capitalize">
                {selectedPart.replace('-', ' ')}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {getPartLabel(selectedPart)}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Efficiency</span>
              <span className="text-sm font-medium text-blue-600">98.5%</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Last Maintenance</span>
              <span className="text-sm font-medium text-gray-700">2 days ago</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl border border-white/20 pointer-events-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-8 text-sm text-gray-700 font-medium">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🖱️</span>
              <span>Drag to rotate</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔍</span>
              <span>Scroll to zoom</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">👆</span>
              <span>Click parts for details</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">✨</span>
              <span>Auto-rotate enabled</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Indicator */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <motion.div 
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          60 FPS • WebGL 2.0
        </motion.div>
      </div>

      {/* Model Title Overlay - Center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            InvenAI EV Model
          </h2>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 shadow-xl border border-white/20">
            <p className="text-lg text-gray-700 font-medium">
              {selectedPart ? getPartLabel(selectedPart) : "Interactive EV Model - Click any part to explore"}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EVModel;