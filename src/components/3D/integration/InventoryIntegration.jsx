import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Inventory Integration System for 3D EV Model
 * Links 3D components to inventory database and provides real-time stock visualization
 */

// Mock inventory data - in production this would come from the actual database
const mockInventoryData = {
  // Battery System Components
  'battery-pack-main': { 
    id: 'BAT-001', 
    name: 'Main Battery Pack 100kWh', 
    stock: 45, 
    minStock: 10, 
    maxStock: 100, 
    cost: 15000, 
    supplier: 'BatteryTech Ltd',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  'battery-cell-2170': { 
    id: 'BAT-002', 
    name: 'Lithium-Ion Cell 2170', 
    stock: 2450, 
    minStock: 500, 
    maxStock: 5000, 
    cost: 12, 
    supplier: 'CellTech Corp',
    status: 'in-stock',
    quality: 'A+',
    lastUpdated: '2024-01-15T09:15:00Z'
  },
  'bms-controller': { 
    id: 'BAT-003', 
    name: 'Battery Management System', 
    stock: 23, 
    minStock: 5, 
    maxStock: 50, 
    cost: 850, 
    supplier: 'SmartBMS Inc',
    status: 'low-stock',
    quality: 'A',
    lastUpdated: '2024-01-15T11:45:00Z'
  },
  'cooling-plate': { 
    id: 'COL-001', 
    name: 'Battery Cooling Plate', 
    stock: 78, 
    minStock: 20, 
    maxStock: 150, 
    cost: 320, 
    supplier: 'ThermalTech',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-15T08:20:00Z'
  },
  
  // Motor System Components
  'motor-front': { 
    id: 'MOT-001', 
    name: 'Front Electric Motor 200HP', 
    stock: 34, 
    minStock: 8, 
    maxStock: 80, 
    cost: 8500, 
    supplier: 'MotorWorks Ltd',
    status: 'in-stock',
    quality: 'A+',
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  'motor-rear': { 
    id: 'MOT-002', 
    name: 'Rear Electric Motor 200HP', 
    stock: 29, 
    minStock: 8, 
    maxStock: 80, 
    cost: 8500, 
    supplier: 'MotorWorks Ltd',
    status: 'in-stock',
    quality: 'A+',
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  'stator-assembly': { 
    id: 'MOT-003', 
    name: 'Motor Stator Assembly', 
    stock: 67, 
    minStock: 15, 
    maxStock: 120, 
    cost: 2200, 
    supplier: 'Precision Motors',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-14T16:30:00Z'
  },
  'rotor-assembly': { 
    id: 'MOT-004', 
    name: 'Motor Rotor Assembly', 
    stock: 71, 
    minStock: 15, 
    maxStock: 120, 
    cost: 1800, 
    supplier: 'Precision Motors',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-14T16:30:00Z'
  },
  'permanent-magnets': { 
    id: 'MOT-005', 
    name: 'Neodymium Permanent Magnets', 
    stock: 156, 
    minStock: 50, 
    maxStock: 300, 
    cost: 45, 
    supplier: 'MagnetTech',
    status: 'in-stock',
    quality: 'A+',
    lastUpdated: '2024-01-15T07:45:00Z'
  },
  'inverter-controller': { 
    id: 'POW-001', 
    name: 'Motor Inverter Controller', 
    stock: 18, 
    minStock: 10, 
    maxStock: 60, 
    cost: 3200, 
    supplier: 'PowerElectronics Co',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-15T12:15:00Z'
  },

  // Chassis & Suspension
  'chassis-frame': { 
    id: 'CHA-001', 
    name: 'Monocoque Chassis Frame', 
    stock: 12, 
    minStock: 3, 
    maxStock: 25, 
    cost: 12000, 
    supplier: 'StructureTech',
    status: 'in-stock',
    quality: 'A+',
    lastUpdated: '2024-01-14T14:20:00Z'
  },
  'suspension-strut': { 
    id: 'SUS-001', 
    name: 'MacPherson Strut Assembly', 
    stock: 87, 
    minStock: 20, 
    maxStock: 150, 
    cost: 680, 
    supplier: 'SuspensionPro',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-15T09:30:00Z'
  },
  'control-arm': { 
    id: 'SUS-002', 
    name: 'Lower Control Arm', 
    stock: 143, 
    minStock: 40, 
    maxStock: 200, 
    cost: 245, 
    supplier: 'SuspensionPro',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-15T09:30:00Z'
  },

  // Braking System
  'brake-disc-front': { 
    id: 'BRK-001', 
    name: 'Front Brake Disc 350mm', 
    stock: 96, 
    minStock: 25, 
    maxStock: 180, 
    cost: 125, 
    supplier: 'BrakeMaster',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-15T11:00:00Z'
  },
  'brake-caliper': { 
    id: 'BRK-002', 
    name: '4-Piston Brake Caliper', 
    stock: 76, 
    minStock: 20, 
    maxStock: 140, 
    cost: 485, 
    supplier: 'BrakeMaster',
    status: 'in-stock',
    quality: 'A+',
    lastUpdated: '2024-01-15T11:00:00Z'
  },
  'abs-controller': { 
    id: 'BRK-003', 
    name: 'ABS/ESC Controller', 
    stock: 31, 
    minStock: 8, 
    maxStock: 70, 
    cost: 950, 
    supplier: 'SafetyTech',
    status: 'in-stock',
    quality: 'A+',
    lastUpdated: '2024-01-15T13:20:00Z'
  },

  // Body & Exterior
  'body-panel-front': { 
    id: 'BOD-001', 
    name: 'Front Body Panel Carbon Fiber', 
    stock: 38, 
    minStock: 10, 
    maxStock: 80, 
    cost: 1200, 
    supplier: 'CarbonWorks',
    status: 'in-stock',
    quality: 'A+',
    lastUpdated: '2024-01-14T15:45:00Z'
  },
  'windshield-glass': { 
    id: 'GLA-001', 
    name: 'Laminated Windshield Glass', 
    stock: 42, 
    minStock: 12, 
    maxStock: 85, 
    cost: 650, 
    supplier: 'AutoGlass Pro',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-15T08:45:00Z'
  },
  'led-headlight': { 
    id: 'LIG-001', 
    name: 'LED Headlight Assembly', 
    stock: 64, 
    minStock: 16, 
    maxStock: 120, 
    cost: 480, 
    supplier: 'LightTech',
    status: 'in-stock',
    quality: 'A',
    lastUpdated: '2024-01-15T10:15:00Z'
  }
};

export const getInventoryData = (componentId) => {
  return mockInventoryData[componentId] || null;
};

export const getStockStatus = (componentId) => {
  const item = mockInventoryData[componentId];
  if (!item) return 'unknown';
  
  if (item.stock <= item.minStock * 0.5) return 'critical';
  if (item.stock <= item.minStock) return 'low';
  if (item.stock >= item.maxStock * 0.9) return 'overstocked';
  return 'normal';
};

export const getStockColor = (status) => {
  const colors = {
    'normal': '#10b981',     // Green
    'low': '#f59e0b',        // Amber
    'critical': '#ef4444',   // Red
    'overstocked': '#3b82f6', // Blue
    'unknown': '#6b7280'     // Gray
  };
  return colors[status] || colors.unknown;
};

export const useInventoryVisualization = (selectedPart) => {
  const visualizationData = useMemo(() => {
    // Map 3D component parts to inventory items
    const componentMapping = {
      'battery': ['battery-pack-main', 'battery-cell-2170', 'bms-controller', 'cooling-plate'],
      'motor': ['motor-front', 'motor-rear', 'stator-assembly', 'rotor-assembly', 'permanent-magnets', 'inverter-controller'],
      'chassis': ['chassis-frame', 'suspension-strut', 'control-arm'],
      'brakes': ['brake-disc-front', 'brake-caliper', 'abs-controller'],
      'body': ['body-panel-front', 'windshield-glass', 'led-headlight'],
      'cooling-system': ['cooling-plate'],
      'bms': ['bms-controller'],
      'inverter': ['inverter-controller']
    };

    const components = componentMapping[selectedPart] || [];
    return components.map(componentId => ({
      ...getInventoryData(componentId),
      componentId,
      status: getStockStatus(componentId),
      color: getStockColor(getStockStatus(componentId))
    })).filter(Boolean);
  }, [selectedPart]);

  return visualizationData;
};

export const InventoryStatusIndicator = ({ componentId, position, visible = true }) => {
  const stockStatus = getStockStatus(componentId);
  const color = getStockColor(stockStatus);
  
  if (!visible) return null;

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial 
        color={color}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

export const SupplyChainVisualization = ({ selectedPart, showFlow = false }) => {
  const inventoryData = useInventoryVisualization(selectedPart);
  
  if (!showFlow || !inventoryData.length) return null;

  return (
    <group>
      {inventoryData.map((item, index) => {
        const radius = 2 + index * 0.5;
        const angle = (index / inventoryData.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={item.componentId} position={[x, 2, z]}>
            {/* Supplier node */}
            <mesh>
              <boxGeometry args={[0.3, 0.1, 0.2]} />
              <meshStandardMaterial 
                color={item.color}
                emissive={item.color}
                emissiveIntensity={0.2}
              />
            </mesh>
            
            {/* Flow line to center */}
            <mesh position={[-x/2, -1, -z/2]} rotation={[0, Math.atan2(z, x), 0]}>
              <cylinderGeometry args={[0.01, 0.01, Math.sqrt(x*x + z*z), 8]} />
              <meshStandardMaterial 
                color={item.color}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const AssemblySequenceVisualization = ({ step = 0, totalSteps = 10 }) => {
  const progress = step / totalSteps;
  
  return (
    <group position={[0, 3, 0]}>
      {/* Progress bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.1, 0.1]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      
      {/* Progress fill */}
      <mesh position={[-2 + (progress * 2), 0, 0]}>
        <boxGeometry args={[progress * 4, 0.12, 0.12]} />
        <meshStandardMaterial 
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Step indicators */}
      {Array.from({ length: totalSteps }, (_, i) => {
        const x = -2 + (i / (totalSteps - 1)) * 4;
        const completed = i < step;
        
        return (
          <mesh key={i} position={[x, 0.15, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color={completed ? "#10b981" : "#d1d5db"}
              emissive={completed ? "#047857" : "#000000"}
              emissiveIntensity={completed ? 0.3 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export const QualityMetricsVisualization = ({ componentId, position }) => {
  const inventoryData = getInventoryData(componentId);
  if (!inventoryData) return null;

  const qualityColors = {
    'A+': '#10b981', // Excellent - Green
    'A': '#3b82f6',  // Good - Blue  
    'B': '#f59e0b',  // Fair - Amber
    'C': '#ef4444'   // Poor - Red
  };

  const color = qualityColors[inventoryData.quality] || '#6b7280';

  return (
    <mesh position={position}>
      <ringGeometry args={[0.08, 0.12, 8]} />
      <meshBasicMaterial 
        color={color}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

export const CostAnalysisVisualization = ({ selectedSystem, showCosts = false }) => {
  const inventoryData = useInventoryVisualization(selectedSystem);
  
  if (!showCosts || !inventoryData.length) return null;

  const totalCost = inventoryData.reduce((sum, item) => sum + (item.cost * item.stock), 0);
  const averageCost = totalCost / inventoryData.length;

  return (
    <group position={[0, -3, 0]}>
      <mesh>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial 
          color="#1f2937" 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* Cost visualization bars */}
      {inventoryData.map((item, index) => {
        const height = (item.cost / Math.max(...inventoryData.map(i => i.cost))) * 0.4;
        const x = -0.8 + (index / (inventoryData.length - 1)) * 1.6;
        
        return (
          <mesh key={item.componentId} position={[x, height/2, 0.01]}>
            <boxGeometry args={[0.05, height, 0.02]} />
            <meshStandardMaterial 
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};