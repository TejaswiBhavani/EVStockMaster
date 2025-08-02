import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Interactive Controls System for 3D EV Model
 * Provides exploded views, cross-sections, and advanced camera controls
 */

// State-only hook for external use (no R3F hooks)
export const useModelInteractionState = () => {
  const [viewMode, setViewMode] = useState('assembled'); // assembled, exploded, cross-section
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [crossSectionPlane, setCrossSectionPlane] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);

  const toggleExplodedView = () => {
    if (viewMode === 'exploded') {
      setViewMode('assembled');
    } else {
      setViewMode('exploded');
    }
  };

  const toggleCrossSectionView = () => {
    setViewMode(viewMode === 'cross-section' ? 'assembled' : 'cross-section');
  };

  const focusOnSystem = (systemName) => {
    setSelectedSystem(systemName);
  };

  return {
    viewMode,
    selectedSystem,
    explodeFactor,
    crossSectionPlane,
    toggleExplodedView,
    toggleCrossSectionView,
    focusOnSystem,
    setAnimationSpeed,
    setCrossSectionPlane,
    setExplodeFactor
  };
};

// Canvas-internal hook that handles R3F animations
export const useModelInteraction = (controlState) => {
  const animationProgress = useRef(0);

  // Animation frame handler - only used inside Canvas
  useFrame((state, delta) => {
    if (controlState.viewMode === 'exploded') {
      // Smooth animation for exploded view
      animationProgress.current += delta * controlState.animationSpeed;
      const progress = Math.min(animationProgress.current, 1.0);
      controlState.setExplodeFactor(progress);
    } else if (controlState.viewMode === 'assembled') {
      // Smooth animation back to assembled
      animationProgress.current -= delta * controlState.animationSpeed;
      const progress = Math.max(animationProgress.current, 0);
      controlState.setExplodeFactor(progress);
    }
  });

  return {
    animationProgress
  };
};

//  Canvas-internal animation handler component
export const ModelAnimationHandler = ({ controlState }) => {
  const animationControls = useModelInteraction(controlState);
  return null; // This component just handles animations, no visual output
};

export const ExplodedGroupWrapper = ({ 
  children, 
  explodeDirection = [0, 1, 0], 
  explodeDistance = 2.0, 
  explodeFactor = 0,
  systemType = 'default'
}) => {
  const groupRef = useRef();
  const originalPosition = useRef([0, 0, 0]);

  useFrame(() => {
    if (groupRef.current) {
      const explodeVector = explodeDirection.map(axis => axis * explodeDistance * explodeFactor);
      groupRef.current.position.set(
        originalPosition.current[0] + explodeVector[0],
        originalPosition.current[1] + explodeVector[1],
        originalPosition.current[2] + explodeVector[2]
      );
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

export const CrossSectionPlane = ({ plane = 0, axis = 'x' }) => {
  const planeRef = useRef();

  useFrame(() => {
    if (planeRef.current) {
      // Update clipping plane position
      const position = [0, 0, 0];
      position[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = plane;
      planeRef.current.position.set(...position);
    }
  });

  return (
    <mesh ref={planeRef} visible={false}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial 
        color="#ff0000" 
        transparent 
        opacity={0.1} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const CameraPresets = {
  overview: { position: [8, 6, 8], target: [0, 0, 0] },
  frontView: { position: [6, 0, 0], target: [0, 0, 0] },
  rearView: { position: [-6, 0, 0], target: [0, 0, 0] },
  topView: { position: [0, 8, 0], target: [0, 0, 0] },
  bottomView: { position: [0, -8, 0], target: [0, 0, 0] },
  leftView: { position: [0, 0, 6], target: [0, 0, 0] },
  rightView: { position: [0, 0, -6], target: [0, 0, 0] },
  battery: { position: [0, -3, 4], target: [0, -1, 0] },
  motor: { position: [4, 0, 4], target: [1.8, -0.4, 0] },
  interior: { position: [2, 1, 2], target: [0, 0.5, 0] },
  chassis: { position: [6, -2, 6], target: [0, -1, 0] }
};

export const useCameraControls = (cameraRef, controlsRef) => {
  const animateToPreset = (presetName, duration = 2000) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const preset = CameraPresets[presetName];
    if (!preset) return;

    const startPos = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const endPos = new THREE.Vector3(...preset.position);
    const endTarget = new THREE.Vector3(...preset.target);

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing
      const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);

      // Interpolate position
      cameraRef.current.position.lerpVectors(startPos, endPos, easeProgress);
      controlsRef.current.target.lerpVectors(startTarget, endTarget, easeProgress);
      controlsRef.current.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return { animateToPreset };
};

export const AnimationSequences = {
  assemblySequence: [
    { system: 'chassis', delay: 0, duration: 1000, action: 'assemble' },
    { system: 'battery', delay: 500, duration: 1000, action: 'assemble' },
    { system: 'motor', delay: 1000, duration: 1000, action: 'assemble' },
    { system: 'brakes', delay: 1500, duration: 1000, action: 'assemble' },
    { system: 'body', delay: 2000, duration: 1000, action: 'assemble' },
    { system: 'interior', delay: 2500, duration: 1000, action: 'assemble' }
  ],
  
  disassemblySequence: [
    { system: 'interior', delay: 0, duration: 1000, action: 'explode' },
    { system: 'body', delay: 200, duration: 1000, action: 'explode' },
    { system: 'brakes', delay: 400, duration: 1000, action: 'explode' },
    { system: 'motor', delay: 600, duration: 1000, action: 'explode' },
    { system: 'battery', delay: 800, duration: 1000, action: 'explode' },
    { system: 'chassis', delay: 1000, duration: 1000, action: 'explode' }
  ]
};

export const useAnimationSequence = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const timeoutRefs = useRef([]);

  const playSequence = (sequence, onStepComplete) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentStep(0);

    sequence.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index);
        if (onStepComplete) {
          onStepComplete(step);
        }
        
        if (index === sequence.length - 1) {
          setIsPlaying(false);
        }
      }, step.delay);
      
      timeoutRefs.current.push(timeout);
    });
  };

  const stopSequence = () => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return {
    isPlaying,
    currentStep,
    playSequence,
    stopSequence
  };
};

// Canvas-internal performance optimizer
export const PerformanceOptimizer = () => {
  const [lodLevel, setLodLevel] = useState(0); // 0: high, 1: medium, 2: low
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());
  const fps = useRef(60);

  useFrame(() => {
    frameCount.current++;
    const now = Date.now();
    
    if (now - lastTime.current >= 1000) {
      fps.current = frameCount.current;
      frameCount.current = 0;
      lastTime.current = now;

      // Adjust LOD based on performance
      if (fps.current < 30 && lodLevel < 2) {
        setLodLevel(prev => prev + 1);
      } else if (fps.current > 50 && lodLevel > 0) {
        setLodLevel(prev => prev - 1);
      }
    }
  });

  return { lodLevel, fps: fps.current };
};

// State-only performance tracker for external use
export const usePerformanceTracker = () => {
  const [lodLevel, setLodLevel] = useState(0);
  const [fps, setFps] = useState(60);
  
  return { lodLevel, fps };
};