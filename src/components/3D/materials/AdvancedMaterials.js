import * as THREE from 'three';

/**
 * Advanced material system for ultra-realistic EV model rendering
 * Implements physically based rendering (PBR) with realistic automotive materials
 */

export class AdvancedMaterials {
  constructor() {
    // Initialize texture loader for future HDR environment maps
    try {
      this.textureLoader = new THREE.TextureLoader();
      this.cubeTextureLoader = new THREE.CubeTextureLoader();
    } catch (error) {
      // Handle test environment where THREE might be mocked
      console.warn('TextureLoader not available:', error.message);
      this.textureLoader = null;
      this.cubeTextureLoader = null;
    }
    
    // Cache for materials to improve performance
    this.materialCache = new Map();
  }

  /**
   * Creates a carbon fiber material with realistic weave pattern
   */
  createCarbonFiberMaterial(selected = false) {
    const key = `carbon-fiber-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: selected ? '#1a1a1a' : '#2d2d2d',
      metalness: 0.1,
      roughness: 0.3,
      // Simulate carbon fiber reflectance
      envMapIntensity: 1.2,
      // Add subtle emission for selected state
      emissive: selected ? '#1a1a1a' : '#000000',
      emissiveIntensity: selected ? 0.1 : 0,
    });

    // TODO: Add procedural carbon fiber texture when needed
    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates automotive paint material with multiple layers
   */
  createAutomotivePaint(baseColor, selected = false, options = {}) {
    const key = `auto-paint-${baseColor}-${selected}-${JSON.stringify(options)}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const {
      metallic = false,
      pearlescent = false,
      clearcoat = true,
      flakes = false
    } = options;

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      metalness: metallic ? 0.9 : 0.1,
      roughness: clearcoat ? 0.1 : 0.4,
      envMapIntensity: clearcoat ? 1.5 : 0.8,
      emissive: selected ? new THREE.Color(baseColor).multiplyScalar(0.1) : '#000000',
      emissiveIntensity: selected ? 0.15 : 0,
    });

    // Add clearcoat properties for modern automotive finish
    if (clearcoat) {
      material.clearcoat = 1.0;
      material.clearcoatRoughness = 0.03;
    }

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates realistic glass material with proper transmission
   */
  createGlassMaterial(tint = '#ffffff', opacity = 0.9, selected = false) {
    const key = `glass-${tint}-${opacity}-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tint),
      transparent: true,
      opacity: selected ? Math.min(opacity + 0.1, 1.0) : opacity,
      metalness: 0.0,
      roughness: 0.05,
      envMapIntensity: 1.0,
      transmission: 0.95, // Glass transmission
      thickness: 0.1,
      ior: 1.5, // Index of refraction for glass
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates metallic material for various EV components
   */
  createMetallicMaterial(baseColor, roughness = 0.2, selected = false) {
    const key = `metallic-${baseColor}-${roughness}-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      metalness: 0.9,
      roughness: roughness,
      envMapIntensity: 1.2,
      emissive: selected ? new THREE.Color(baseColor).multiplyScalar(0.1) : '#000000',
      emissiveIntensity: selected ? 0.1 : 0,
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates plastic material for interior components
   */
  createPlasticMaterial(baseColor, finish = 'matte', selected = false) {
    const key = `plastic-${baseColor}-${finish}-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const roughnessMap = {
      'matte': 0.9,
      'satin': 0.5,
      'gloss': 0.1
    };

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      metalness: 0.0,
      roughness: roughnessMap[finish] || 0.5,
      envMapIntensity: finish === 'gloss' ? 0.8 : 0.3,
      emissive: selected ? new THREE.Color(baseColor).multiplyScalar(0.05) : '#000000',
      emissiveIntensity: selected ? 0.1 : 0,
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates rubber material for tires and seals
   */
  createRubberMaterial(baseColor = '#1a1a1a', selected = false) {
    const key = `rubber-${baseColor}-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      metalness: 0.0,
      roughness: 0.95,
      envMapIntensity: 0.1,
      emissive: selected ? '#1a1a1a' : '#000000',
      emissiveIntensity: selected ? 0.05 : 0,
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates leather material for interior surfaces
   */
  createLeatherMaterial(baseColor = '#8b4513', selected = false) {
    const key = `leather-${baseColor}-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      metalness: 0.0,
      roughness: 0.7,
      envMapIntensity: 0.3,
      emissive: selected ? new THREE.Color(baseColor).multiplyScalar(0.05) : '#000000',
      emissiveIntensity: selected ? 0.08 : 0,
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates fabric material for seats and interior
   */
  createFabricMaterial(baseColor = '#4a5568', selected = false) {
    const key = `fabric-${baseColor}-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      metalness: 0.0,
      roughness: 0.9,
      envMapIntensity: 0.2,
      emissive: selected ? new THREE.Color(baseColor).multiplyScalar(0.03) : '#000000',
      emissiveIntensity: selected ? 0.06 : 0,
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates LED material with realistic emission
   */
  createLEDMaterial(color = '#ffffff', intensity = 1.0) {
    const key = `led-${color}-${intensity}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.0,
      roughness: 0.1,
      emissive: new THREE.Color(color),
      emissiveIntensity: intensity,
      transparent: true,
      opacity: 0.8,
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates battery cell material with realistic properties
   */
  createBatteryCellMaterial(selected = false) {
    const key = `battery-cell-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: selected ? '#0ea5e9' : '#10b981',
      metalness: 0.3,
      roughness: 0.6,
      envMapIntensity: 0.5,
      emissive: selected ? '#0369a1' : '#047857',
      emissiveIntensity: selected ? 0.15 : 0.05,
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates circuit board material for electronic components
   */
  createCircuitBoardMaterial(selected = false) {
    const key = `circuit-board-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: selected ? '#16a34a' : '#059669',
      metalness: 0.1,
      roughness: 0.8,
      envMapIntensity: 0.3,
      emissive: selected ? '#166534' : '#064e3b',
      emissiveIntensity: selected ? 0.1 : 0.03,
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Creates copper wiring material
   */
  createCopperMaterial(selected = false) {
    const key = `copper-${selected}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    const material = new THREE.MeshStandardMaterial({
      color: selected ? '#ea580c' : '#c2410c',
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0,
      emissive: selected ? '#9a3412' : '#000000',
      emissiveIntensity: selected ? 0.05 : 0,
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Updates material selection state
   */
  updateMaterialSelection(material, selected) {
    if (selected) {
      material.emissiveIntensity = Math.max(material.emissiveIntensity, 0.1);
    } else {
      material.emissiveIntensity = Math.min(material.emissiveIntensity, 0.05);
    }
  }

  /**
   * Sets up HDR environment mapping for realistic reflections
   */
  setupEnvironmentMapping(scene, renderer) {
    try {
      // TODO: Load HDRI environment map
      // For now, create a simple environment
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      // Create a simple gradient environment
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x87ceeb); // Sky blue
      
      const envMap = pmremGenerator.fromScene(envScene).texture;
      scene.environment = envMap;
      
      pmremGenerator.dispose();
    } catch (error) {
      console.warn('Environment mapping setup failed:', error.message);
    }
  }

  /**
   * Cleanup materials to prevent memory leaks
   */
  dispose() {
    this.materialCache.forEach(material => {
      material.dispose();
    });
    this.materialCache.clear();
  }
}

// Export a singleton instance
export const advancedMaterials = new AdvancedMaterials();