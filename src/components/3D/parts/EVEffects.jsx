import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, RoundedBox } from '@react-three/drei';

const EVEffects = ({ selectedPart, isCharging, engineRunning }) => {
  const chargingRef = useRef();
  const engineRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Charging effect animation
    if (chargingRef.current && isCharging) {
      chargingRef.current.material.emissiveIntensity = 0.5 + Math.sin(time * 4) * 0.3;
    }
    
    // Engine running effect
    if (engineRef.current && engineRunning) {
      engineRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 6) * 0.2;
    }
  });

  return (
    <group name="ev-effects">
      {/* Charging Effect */}
      {isCharging && (
        <group position={[-1.2, 0.15, 0.6]}>
          {/* Charging indicator light */}
          <Sphere
            ref={chargingRef}
            args={[0.05, 16, 16]}
            position={[0.15, 0, 0]}
          >
            <meshStandardMaterial 
              color="#10b981" 
              emissive="#10b981"
              emissiveIntensity={0.8}
              transparent={true}
              opacity={0.8}
            />
          </Sphere>
          
          {/* Charging particles */}
          {[...Array(5)].map((_, index) => (
            <Sphere
              key={`charging-particle-${index}`}
              args={[0.01, 8, 8]}
              position={[
                0.2 + Math.sin(Date.now() * 0.01 + index) * 0.1,
                Math.cos(Date.now() * 0.01 + index) * 0.05,
                Math.sin(Date.now() * 0.008 + index) * 0.05
              ]}
            >
              <meshStandardMaterial 
                color="#34d399" 
                emissive="#34d399"
                emissiveIntensity={0.6}
                transparent={true}
                opacity={0.7}
              />
            </Sphere>
          ))}
        </group>
      )}

      {/* Engine/Motor Running Effect */}
      {engineRunning && (
        <group>
          {/* Motor heat effect */}
          <Sphere
            ref={engineRef}
            args={[0.3, 16, 16]}
            position={[0.8, -0.25, 0]}
          >
            <meshStandardMaterial 
              color="#06d6a0" 
              emissive="#06d6a0"
              emissiveIntensity={0.3}
              transparent={true}
              opacity={0.2}
            />
          </Sphere>
          
          <Sphere
            args={[0.3, 16, 16]}
            position={[-0.8, -0.25, 0]}
          >
            <meshStandardMaterial 
              color="#06d6a0" 
              emissive="#06d6a0"
              emissiveIntensity={0.3}
              transparent={true}
              opacity={0.2}
            />
          </Sphere>
        </group>
      )}

      {/* Battery Status Indicator */}
      <RoundedBox
        position={[0, -0.5, 0]}
        args={[0.1, 0.02, 0.05]}
        radius={0.01}
      >
        <meshStandardMaterial 
          color={isCharging ? "#10b981" : "#3b82f6"} 
          emissive={isCharging ? "#10b981" : "#3b82f6"}
          emissiveIntensity={isCharging ? 0.6 : 0.3}
        />
      </RoundedBox>

      {/* Power Flow Lines */}
      {engineRunning && (
        <group>
          {/* Power lines from battery to motors */}
          <RoundedBox
            position={[0.4, -0.4, 0]}
            args={[0.8, 0.01, 0.02]}
            radius={0.005}
          >
            <meshStandardMaterial 
              color="#fbbf24" 
              emissive="#fbbf24"
              emissiveIntensity={0.4}
            />
          </RoundedBox>
          
          <RoundedBox
            position={[-0.4, -0.4, 0]}
            args={[0.8, 0.01, 0.02]}
            radius={0.005}
          >
            <meshStandardMaterial 
              color="#fbbf24" 
              emissive="#fbbf24"
              emissiveIntensity={0.4}
            />
          </RoundedBox>
        </group>
      )}

      {/* Status Lights */}
      <group position={[0, 0.8, 0]}>
        {/* System Status */}
        <Sphere
          args={[0.02, 8, 8]}
          position={[-0.1, 0, 0]}
        >
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#10b981"
            emissiveIntensity={0.5}
          />
        </Sphere>
        
        {/* Charging Status */}
        <Sphere
          args={[0.02, 8, 8]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial 
            color={isCharging ? "#fbbf24" : "#6b7280"} 
            emissive={isCharging ? "#fbbf24" : "#374151"}
            emissiveIntensity={isCharging ? 0.6 : 0.1}
          />
        </Sphere>
        
        {/* Engine Status */}
        <Sphere
          args={[0.02, 8, 8]}
          position={[0.1, 0, 0]}
        >
          <meshStandardMaterial 
            color={engineRunning ? "#3b82f6" : "#6b7280"} 
            emissive={engineRunning ? "#3b82f6" : "#374151"}
            emissiveIntensity={engineRunning ? 0.6 : 0.1}
          />
        </Sphere>
        
        {/* Selected Part Highlight */}
        {selectedPart && (
          <Sphere
            args={[0.02, 8, 8]}
            position={[0.2, 0, 0]}
          >
            <meshStandardMaterial 
              color="#ff6b6b" 
              emissive="#ff6b6b"
              emissiveIntensity={0.8}
            />
          </Sphere>
        )}
      </group>
    </group>
  );
};

export default EVEffects;