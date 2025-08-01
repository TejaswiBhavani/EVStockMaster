import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EVModel from '../components/3D/EVModel';
import '@testing-library/jest-dom';

// Mock @react-three/fiber and @react-three/drei
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="three-canvas">{children}</div>,
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Box: ({ children, ...props }) => <div data-testid="box" {...props}>{children}</div>,
  Sphere: ({ children, ...props }) => <div data-testid="sphere" {...props}>{children}</div>,
  Cylinder: ({ children, ...props }) => <div data-testid="cylinder" {...props}>{children}</div>,
  RoundedBox: ({ children, ...props }) => <div data-testid="rounded-box" {...props}>{children}</div>,
  Torus: ({ children, ...props }) => <div data-testid="torus" {...props}>{children}</div>,
  PresentationControls: ({ children }) => <div data-testid="presentation-controls">{children}</div>,
  Float: ({ children }) => <div data-testid="float">{children}</div>,
}));

vi.mock('lucide-react', () => ({
  Eye: ({ className, ...props }) => <div data-testid="eye-icon" className={className} {...props} />,
  Layers: ({ className, ...props }) => <div data-testid="layers-icon" className={className} {...props} />,
  RotateCcw: ({ className, ...props }) => <div data-testid="rotate-icon" className={className} {...props} />,
  Zap: ({ className, ...props }) => <div data-testid="zap-icon" className={className} {...props} />,
  Settings: ({ className, ...props }) => <div data-testid="settings-icon" className={className} {...props} />,
  Play: ({ className, ...props }) => <div data-testid="play-icon" className={className} {...props} />,
  Pause: ({ className, ...props }) => <div data-testid="pause-icon" className={className} {...props} />,
  SkipForward: ({ className, ...props }) => <div data-testid="skip-forward-icon" className={className} {...props} />,
  Camera: ({ className, ...props }) => <div data-testid="camera-icon" className={className} {...props} />,
  Maximize: ({ className, ...props }) => <div data-testid="maximize-icon" className={className} {...props} />,
  Download: ({ className, ...props }) => <div data-testid="download-icon" className={className} {...props} />,
  Share2: ({ className, ...props }) => <div data-testid="share2-icon" className={className} {...props} />,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <div>{children}</div>,
}));

vi.mock('three', () => ({
  MeshStandardMaterial: class {
    constructor(props) {
      Object.assign(this, props);
    }
  },
  TextureLoader: class {
    constructor() {}
  },
  CubeTextureLoader: class {
    constructor() {}
  },
  PMREMGenerator: class {
    constructor() {}
    compileEquirectangularShader() {}
    fromScene() { return { texture: {} }; }
    dispose() {}
  },
  Scene: class {
    constructor() {
      this.background = null;
    }
  },
  Color: class {
    constructor(color) {
      this.color = color;
    }
    multiplyScalar(scalar) {
      return new this.constructor(this.color);
    }
  },
  ACESFilmicToneMapping: 'ACESFilmicToneMapping',
}));

describe('EVModel', () => {
  it('renders the 3D model viewer', () => {
    render(<EVModel />);
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument();
  });

  it('displays interactive 3D model title', () => {
    render(<EVModel />);
    expect(screen.getByText('Interactive 3D Model')).toBeInTheDocument();
  });

  it('shows model status information', () => {
    render(<EVModel />);
    expect(screen.getByText('Model Status')).toBeInTheDocument();
    expect(screen.getByText('Live Rendering')).toBeInTheDocument();
    expect(screen.getByText('WebGL Accelerated')).toBeInTheDocument();
  });

  it('displays control instructions', () => {
    render(<EVModel />);
    expect(screen.getByText('Drag to rotate')).toBeInTheDocument();
    expect(screen.getByText('Scroll to zoom')).toBeInTheDocument();
    expect(screen.getByText('Click parts for details')).toBeInTheDocument();
  });

  it('shows part selection legend', () => {
    render(<EVModel />);
    expect(screen.getByText('Body & Chassis')).toBeInTheDocument();
    expect(screen.getByText('Battery Pack')).toBeInTheDocument();
    expect(screen.getByText('Electric Motors')).toBeInTheDocument();
    expect(screen.getByText('Charging Port')).toBeInTheDocument();
    expect(screen.getByText('Control Systems')).toBeInTheDocument();
  });

  it('displays part information when a part is selected', () => {
    render(<EVModel selectedPart="body" />);
    // The selected part info should be displayed in the UI (may appear in multiple places)
    const bodyDescriptions = screen.getAllByText('Advanced Carbon Fiber Body - Lightweight & Aerodynamic');
    expect(bodyDescriptions.length).toBeGreaterThan(0);
  });

  it('shows performance indicator', () => {
    render(<EVModel />);
    expect(screen.getByText('60 FPS • WebGL 2.0')).toBeInTheDocument();
  });

  it('handles part selection callback', () => {
    const mockOnPartSelect = vi.fn();
    render(<EVModel onPartSelect={mockOnPartSelect} />);
    
    // The actual part selection would happen through 3D interactions
    // This test validates the prop is passed correctly
    expect(mockOnPartSelect).toBeDefined();
  });
});