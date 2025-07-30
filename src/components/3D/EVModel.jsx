import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { motion } from 'framer-motion';

const EVCarModel = ({ onPartClick }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const handlePartClick = (partId) => {
    if (onPartClick) {
      onPartClick(partId);
    }
  };

  return (
    <group ref={meshRef}>
      {/* Car Body */}
      <Box
        position={[0, 0, 0]}
        scale={[4, 1.5, 2]}
        onClick={() => handlePartClick('body')}
      >
        <meshStandardMaterial color="#2563eb" />
      </Box>

      {/* Battery Pack */}
      <Box
        position={[0, -1, 0]}
        scale={[3.5, 0.5, 1.8]}
        onClick={() => handlePartClick('battery')}
      >
        <meshStandardMaterial color="#059669" />
      </Box>

      {/* Electric Motor */}
      <Box
        position={[1.5, -0.5, 0]}
        scale={[0.8, 0.8, 0.8]}
        onClick={() => handlePartClick('motor')}
      >
        <meshStandardMaterial color="#dc2626" />
      </Box>

      {/* Charging Port */}
      <Box
        position={[-1.8, 0.2, 0.8]}
        scale={[0.3, 0.3, 0.2]}
        onClick={() => handlePartClick('charging-port')}
      >
        <meshStandardMaterial color="#7c3aed" />
      </Box>

      {/* Control Unit */}
      <Box
        position={[0, 0.5, 0]}
        scale={[1, 0.5, 0.8]}
        onClick={() => handlePartClick('control-unit')}
      >
        <meshStandardMaterial color="#ea580c" />
      </Box>

      {/* Wheels */}
      {[[-1.5, -1.2, 1], [1.5, -1.2, 1], [-1.5, -1.2, -1], [1.5, -1.2, -1]].map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}

      {/* Labels */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        EV Inventory Model
      </Text>
    </group>
  );
};

const EVModel = ({ onPartSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden"
    >
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <EVCarModel onPartClick={onPartSelect} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={3}
        />
      </Canvas>
    </motion.div>
  );
};

export default EVModel;