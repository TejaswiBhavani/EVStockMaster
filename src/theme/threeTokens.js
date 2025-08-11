/**
 * Material and interaction tokens for 3D EV model
 * Defines realistic material properties and interaction colors
 */

export const THREE_TOKENS = {
  paint: {
    base: '#3a3f47',
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    metalness: 0.95,
    roughness: 0.18
  },
  glass: {
    color: '#dbeafe',
    transmission: 0.9,
    roughness: 0.03,
    thickness: 0.12,
    ior: 1.5,
    opacity: 0.15
  },
  rimMetal: {
    color: '#d1d5db',
    metalness: 0.92,
    roughness: 0.18
  },
  tire: {
    color: '#1f2937',
    metalness: 0.05,
    roughness: 0.95
  },
  lights: {
    head: {
      emissive: '#8ecaff',
      intensity: 1.2
    },
    tail: {
      emissive: '#ef4444',
      intensity: 1.0
    }
  },
  interact: {
    hoverOutline: '#60a5fa',
    selectOutline: '#22c55e',
    labelBg: 'rgba(17,24,39,0.85)',
    labelText: '#e5e7eb'
  }
}

// Interactive parts registry for consistent part identification
export const INTERACTIVE_PARTS = {
  battery: {
    id: 'battery',
    name: 'Battery Pack',
    description: 'High-capacity lithium-ion battery system'
  },
  motor: {
    id: 'motor',
    name: 'Electric Motor',
    description: 'High-efficiency electric drive motor'
  },
  wheels: {
    id: 'wheels',
    name: 'Wheels',
    description: 'Aerodynamic alloy wheels with low rolling resistance tires'
  },
  headlights: {
    id: 'headlights',
    name: 'Headlights',
    description: 'LED matrix adaptive headlight system'
  },
  taillights: {
    id: 'taillights',
    name: 'Taillights',
    description: 'Full-width LED taillight bar'
  },
  body: {
    id: 'body',
    name: 'Body Panels',
    description: 'Aerodynamic carbon fiber body with premium paint finish'
  },
  'charging-port': {
    id: 'charging-port',
    name: 'Charging Port',
    description: 'Universal charging port with CCS/NACS compatibility'
  }
}