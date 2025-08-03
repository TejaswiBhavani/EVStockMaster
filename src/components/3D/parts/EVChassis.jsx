import React from 'react';
import { RoundedBox, Cylinder } from '@react-three/drei';

const EVChassis = ({ selectedPart, onPartClick }) => {
  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  return (
    <group name="ev-chassis">
      {/* Car Body - Modern EV design with smooth curves */}
      <RoundedBox
        position={[0, 0, 0]}
        args={[2.8, 0.8, 1.4]}
        radius={0.1}
        smoothness={8}
        onClick={() => handlePartClick('body')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'body' ? '#ff6b6b' : '#4facfe'} 
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Car Roof - Sleeker profile */}
      <RoundedBox
        position={[0, 0.55, 0]}
        args={[1.8, 0.2, 1.2]}
        radius={0.08}
        smoothness={6}
        onClick={() => handlePartClick('body')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'body' ? '#ff6b6b' : '#4facfe'} 
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Hood section */}
      <RoundedBox
        position={[1.0, 0.05, 0]}
        args={[0.8, 0.15, 1.3]}
        radius={0.06}
        smoothness={6}
        onClick={() => handlePartClick('body')}
      >
        <meshStandardMaterial 
          color={selectedPart === 'body' ? '#ff6b6b' : '#4facfe'} 
          metalness={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Wheels - More realistic with rims */}
      {[[-1.0, -0.65, 0.7], [1.0, -0.65, 0.7], [-1.0, -0.65, -0.7], [1.0, -0.65, -0.7]].map((position, index) => (
        <group key={`wheel-${index}`} position={position}>
          {/* Tire */}
          <Cylinder
            args={[0.35, 0.35, 0.25, 16]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#2c3e50" metalness={0.3} roughness={0.7} />
          </Cylinder>
          
          {/* Rim */}
          <Cylinder
            args={[0.25, 0.25, 0.27, 12]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
          </Cylinder>
          
          {/* Center cap */}
          <Cylinder
            args={[0.08, 0.08, 0.28, 8]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial 
              color="#00f2fe" 
              metalness={0.9} 
              emissive="#004d5c"
              emissiveIntensity={0.2}
            />
          </Cylinder>
        </group>
      ))}

      {/* Side Windows */}
      <RoundedBox
        position={[0.2, 0.45, 0.72]}
        args={[1.2, 0.3, 0.02]}
        radius={0.03}
      >
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent={true} 
          opacity={0.4} 
          metalness={0.1} 
          roughness={0.05}
        />
      </RoundedBox>

      <RoundedBox
        position={[0.2, 0.45, -0.72]}
        args={[1.2, 0.3, 0.02]}
        radius={0.03}
      >
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent={true} 
          opacity={0.4} 
          metalness={0.1} 
          roughness={0.05}
        />
      </RoundedBox>

      {/* Windshield */}
      <RoundedBox
        position={[0.6, 0.45, 0]}
        args={[0.4, 0.5, 1.3]}
        radius={0.05}
        rotation={[0, 0, -0.1]}
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
  );
};

export default EVChassis;