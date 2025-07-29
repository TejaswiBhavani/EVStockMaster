import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Zap, Battery, Gauge, Palette } from 'lucide-react';
import * as THREE from 'three';

// Enhanced EV Part Component with different geometries
const EVPart = ({ position, size, color, label, partId, onPartClick, isSelected, isHovered, onHover, shape = 'box', customParams = {} }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.rotation.y += 0.02;
        meshRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
      } else if (isHovered) {
        meshRef.current.scale.setScalar(1.05);
      } else {
        meshRef.current.scale.setScalar(1);
        meshRef.current.rotation.y = 0;
      }
    }
  });

  const renderShape = () => {
    const material = (
      <meshStandardMaterial 
        color={isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : color}
        transparent
        opacity={0.8}
        metalness={customParams.metalness || 0.2}
        roughness={customParams.roughness || 0.4}
      />
    );

    switch (shape) {
      case 'cylinder':
        return (
          <Cylinder
            ref={meshRef}
            position={position}
            args={[size[0], size[1], size[2]]}
            onClick={() => onPartClick(partId)}
            onPointerOver={() => onHover(partId)}
            onPointerOut={() => onHover(null)}
          >
            {material}
          </Cylinder>
        );
      case 'sphere':
        return (
          <Sphere
            ref={meshRef}
            position={position}
            args={[size[0]]}
            onClick={() => onPartClick(partId)}
            onPointerOver={() => onHover(partId)}
            onPointerOut={() => onHover(null)}
          >
            {material}
          </Sphere>
        );
      default:
        return (
          <Box
            ref={meshRef}
            position={position}
            args={size}
            onClick={() => onPartClick(partId)}
            onPointerOver={() => onHover(partId)}
            onPointerOut={() => onHover(null)}
          >
            {material}
          </Box>
        );
    }
  };

  return (
    <group>
      {renderShape()}
      {(isSelected || isHovered) && (
        <Text
          position={[position[0], position[1] + (shape === 'sphere' ? size[0] + 0.5 : size[1]/2 + 0.5), position[2]]}
          fontSize={0.3}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

// Main EV Model Component with customizable parameters
const EVModelScene = ({ onPartSelect, selectedPart, modelParams }) => {
  const [hoveredPart, setHoveredPart] = useState(null);
  
  const getEvParts = () => {
    const baseScale = modelParams.scale || 1;
    const batteryCapacity = modelParams.batteryCapacity || 75; // kWh
    const motorPower = modelParams.motorPower || 300; // HP
    const wheelSize = modelParams.wheelSize || 18; // inches
    const colorScheme = modelParams.colorScheme || 'blue';
    
    // Color schemes
    const colorSchemes = {
      blue: { primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa' },
      green: { primary: '#10b981', secondary: '#047857', accent: '#34d399' },
      red: { primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' },
      purple: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
      orange: { primary: '#f97316', secondary: '#ea580c', accent: '#fb923c' }
    };
    
    const colors = colorSchemes[colorScheme] || colorSchemes.blue;
    
    // Calculate dynamic sizes based on parameters
    const batterySize = [3 * baseScale, (0.3 + batteryCapacity / 200) * baseScale, 2 * baseScale];
    const motorSize = [(1.2 + motorPower / 400) * baseScale, (0.8 + motorPower / 500) * baseScale, (1.2 + motorPower / 400) * baseScale];
    const wheelRadius = (0.15 + wheelSize / 120) * baseScale;
    
    return [
      {
        id: 'battery',
        label: `Battery Pack (${batteryCapacity} kWh)`,
        position: [0, -1 * baseScale, 0],
        size: batterySize,
        color: colors.primary,
        shape: 'box',
        customParams: { metalness: 0.6, roughness: 0.2 }
      },
      {
        id: 'motor',
        label: `Electric Motor (${motorPower} HP)`,
        position: [0, 0, -1 * baseScale],
        size: motorSize,
        color: colors.secondary,
        shape: 'cylinder',
        customParams: { metalness: 0.8, roughness: 0.1 }
      },
      {
        id: 'chassis',
        label: 'Chassis Frame',
        position: [0, -0.5 * baseScale, 0],
        size: [4 * baseScale, 0.2 * baseScale, 2.5 * baseScale],
        color: '#6b7280',
        shape: 'box',
        customParams: { metalness: 0.9, roughness: 0.3 }
      },
      {
        id: 'charging-port',
        label: 'Charging Port',
        position: [2 * baseScale, 0.5 * baseScale, 1.2 * baseScale],
        size: [0.3 * baseScale, 0.3 * baseScale, 0.1 * baseScale],
        color: colors.accent,
        shape: 'box',
        customParams: { metalness: 0.7, roughness: 0.2 }
      },
      {
        id: 'dashboard',
        label: 'Dashboard & Controls',
        position: [0, 0.5 * baseScale, 1 * baseScale],
        size: [2 * baseScale, 0.3 * baseScale, 0.2 * baseScale],
        color: '#1f2937',
        shape: 'box',
        customParams: { metalness: 0.3, roughness: 0.7 }
      },
      {
        id: 'seats',
        label: 'Interior Seats',
        position: [0, 0, 0.5 * baseScale],
        size: [1.8 * baseScale, 0.8 * baseScale, 0.8 * baseScale],
        color: '#7c3aed',
        shape: 'box',
        customParams: { metalness: 0.1, roughness: 0.8 }
      },
      {
        id: 'cooling-system',
        label: 'Cooling System',
        position: [0, 0.8 * baseScale, -1.5 * baseScale],
        size: [1.5 * baseScale, 0.4 * baseScale, 0.6 * baseScale],
        color: '#06b6d4',
        shape: 'box',
        customParams: { metalness: 0.5, roughness: 0.3 }
      }
    ];
  };

  const evParts = getEvParts();
  const wheelRadius = (0.15 + (modelParams.wheelSize || 18) / 120) * (modelParams.scale || 1);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {evParts.map((part) => (
        <EVPart
          key={part.id}
          partId={part.id}
          label={part.label}
          position={part.position}
          size={part.size}
          color={part.color}
          shape={part.shape}
          customParams={part.customParams}
          onPartClick={onPartSelect}
          isSelected={selectedPart === part.id}
          isHovered={hoveredPart === part.id}
          onHover={setHoveredPart}
        />
      ))}
      
      {/* Dynamic wheels based on wheel size parameter */}
      {[
        [1.5, -1.2, 1],
        [-1.5, -1.2, 1],
        [1.5, -1.2, -1],
        [-1.5, -1.2, -1]
      ].map((position, index) => (
        <EVPart
          key={`wheel-${index}`}
          partId="wheels"
          label={index === 0 ? `Wheels (${modelParams.wheelSize || 18}")` : ""}
          position={position.map(p => p * (modelParams.scale || 1))}
          size={[wheelRadius]}
          color="#374151"
          shape="cylinder"
          customParams={{ metalness: 0.7, roughness: 0.4 }}
          onPartClick={onPartSelect}
          isSelected={selectedPart === 'wheels'}
          isHovered={hoveredPart === 'wheels'}
          onHover={setHoveredPart}
        />
      ))}
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
      />
    </>
  );
};

// Parameter Control Panel Component
const ParameterPanel = ({ modelParams, onParamChange, isVisible, onToggle }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 w-72 z-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              EV Parameters
            </h3>
            <button
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Scale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Gauge className="w-4 h-4 mr-1" />
                Vehicle Scale
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={modelParams.scale || 1}
                onChange={(e) => onParamChange('scale', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">
                {((modelParams.scale || 1) * 100).toFixed(0)}%
              </div>
            </div>

            {/* Battery Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Battery className="w-4 h-4 mr-1" />
                Battery Capacity (kWh)
              </label>
              <input
                type="range"
                min="40"
                max="150"
                step="5"
                value={modelParams.batteryCapacity || 75}
                onChange={(e) => onParamChange('batteryCapacity', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">
                {modelParams.batteryCapacity || 75} kWh
              </div>
            </div>

            {/* Motor Power */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                Motor Power (HP)
              </label>
              <input
                type="range"
                min="150"
                max="600"
                step="25"
                value={modelParams.motorPower || 300}
                onChange={(e) => onParamChange('motorPower', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">
                {modelParams.motorPower || 300} HP
              </div>
            </div>

            {/* Wheel Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wheel Size (inches)
              </label>
              <input
                type="range"
                min="16"
                max="22"
                step="1"
                value={modelParams.wheelSize || 18}
                onChange={(e) => onParamChange('wheelSize', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">
                {modelParams.wheelSize || 18}"
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Palette className="w-4 h-4 mr-1" />
                Color Scheme
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['blue', 'green', 'red', 'purple', 'orange'].map((color) => (
                  <button
                    key={color}
                    onClick={() => onParamChange('colorScheme', color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      (modelParams.colorScheme || 'blue') === color 
                        ? 'border-gray-800' 
                        : 'border-gray-300'
                    }`}
                    style={{
                      backgroundColor: {
                        blue: '#3b82f6',
                        green: '#10b981',
                        red: '#ef4444',
                        purple: '#8b5cf6',
                        orange: '#f97316'
                      }[color]
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Preset Configurations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onParamChange('preset', 'economy')}
                  className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Economy
                </button>
                <button
                  onClick={() => onParamChange('preset', 'performance')}
                  className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Performance
                </button>
                <button
                  onClick={() => onParamChange('preset', 'luxury')}
                  className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  Luxury
                </button>
                <button
                  onClick={() => onParamChange('preset', 'commercial')}
                  className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  Commercial
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading 3D Model...</p>
      <p className="text-sm text-gray-500 mt-2">Initializing EV components</p>
    </div>
  </div>
);

// Main EVModel Component with enhanced controls
const EVModel = ({ onPartSelect, selectedPart }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showParameterPanel, setShowParameterPanel] = useState(false);
  const [modelParams, setModelParams] = useState({
    scale: 1,
    batteryCapacity: 75,
    motorPower: 300,
    wheelSize: 18,
    colorScheme: 'blue'
  });

  const handleParamChange = (param, value) => {
    if (param === 'preset') {
      const presets = {
        economy: {
          scale: 0.8,
          batteryCapacity: 50,
          motorPower: 180,
          wheelSize: 16,
          colorScheme: 'green'
        },
        performance: {
          scale: 1.2,
          batteryCapacity: 100,
          motorPower: 500,
          wheelSize: 20,
          colorScheme: 'red'
        },
        luxury: {
          scale: 1.3,
          batteryCapacity: 120,
          motorPower: 400,
          wheelSize: 21,
          colorScheme: 'purple'
        },
        commercial: {
          scale: 1.5,
          batteryCapacity: 80,
          motorPower: 250,
          wheelSize: 18,
          colorScheme: 'blue'
        }
      };
      setModelParams(presets[value]);
    } else {
      setModelParams(prev => ({ ...prev, [param]: value }));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden shadow-lg relative"
    >
      <div className="h-full relative">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 60 }}
          style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}
        >
          <EVModelScene 
            onPartSelect={onPartSelect} 
            selectedPart={selectedPart}
            modelParams={modelParams}
          />
        </Canvas>
        
        {/* Controls Overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-2">3D Controls</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>🖱️ Click & drag to rotate</p>
            <p>🔍 Scroll to zoom</p>
            <p>👆 Click parts to select</p>
          </div>
          <button
            onClick={() => setShowParameterPanel(!showParameterPanel)}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center"
          >
            <Settings className="w-3 h-3 mr-1" />
            Parameters
          </button>
        </div>

        {/* Parameter Panel */}
        <ParameterPanel
          modelParams={modelParams}
          onParamChange={handleParamChange}
          isVisible={showParameterPanel}
          onToggle={() => setShowParameterPanel(!showParameterPanel)}
        />

        {/* Part Info Overlay */}
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs"
          >
            <h4 className="font-semibold text-gray-800 mb-1">Selected Part</h4>
            <p className="text-sm text-primary-600 capitalize">{selectedPart.replace('-', ' ')}</p>
            <p className="text-xs text-gray-500 mt-1">Click the info panel for details</p>
          </motion.div>
        )}

        {/* Model Stats Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
        >
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Current Configuration</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Battery: {modelParams.batteryCapacity} kWh</p>
            <p>Motor: {modelParams.motorPower} HP</p>
            <p>Wheels: {modelParams.wheelSize}"</p>
            <p>Scale: {((modelParams.scale || 1) * 100).toFixed(0)}%</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EVModel;