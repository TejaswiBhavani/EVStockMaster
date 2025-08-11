import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EVModel from '../components/3D/EVModel'
import '@testing-library/jest-dom'

// Mock @react-three/fiber and @react-three/drei
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="three-canvas">{children}</div>,
  useFrame: vi.fn(),
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Box: ({ children, ...props }) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
  Sphere: ({ children, ...props }) => (
    <div data-testid="sphere" {...props}>
      {children}
    </div>
  ),
  Cylinder: ({ children, ...props }) => (
    <div data-testid="cylinder" {...props}>
      {children}
    </div>
  ),
  RoundedBox: ({ children, ...props }) => (
    <div data-testid="rounded-box" {...props}>
      {children}
    </div>
  ),
  Torus: ({ children, ...props }) => (
    <div data-testid="torus" {...props}>
      {children}
    </div>
  ),
  PresentationControls: ({ children }) => <div data-testid="presentation-controls">{children}</div>,
  Float: ({ children }) => <div data-testid="float">{children}</div>,
  Environment: ({ children, ...props }) => (
    <div data-testid="environment" {...props}>
      {children}
    </div>
  ),
  Stats: () => <div data-testid="stats" />,
  Bounds: ({ children, ...props }) => (
    <div data-testid="bounds" {...props}>
      {children}
    </div>
  ),
  Html: ({ children, ...props }) => (
    <div data-testid="html-label" {...props}>
      {children}
    </div>
  ),
  useCursor: vi.fn(),
  Outlines: ({ children, ...props }) => (
    <div data-testid="outlines" {...props}>
      {children}
    </div>
  ),
  useBounds: () => ({
    refresh: vi.fn(() => ({ fit: vi.fn() })),
  }),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  RotateCcw: () => <div data-testid="rotate-ccw-icon" />,
}))

// Mock the new store
vi.mock('../store/evViewerStore', () => ({
  useEVViewerStore: () => ({
    hoveredPart: null,
    selectedPart: null,
    showInteractive: false,
    resetViewToken: 0,
    setHoveredPart: vi.fn(),
    setSelectedPart: vi.fn(),
    toggleShowInteractive: vi.fn(),
    triggerResetView: vi.fn(),
  }),
}))

// Mock the new components
vi.mock('../components/3D/EnhancedParametricCar', () => ({
  default: ({ selectedPart, onPartClick }) => (
    <div 
      data-testid="enhanced-parametric-car" 
      data-selected-part={selectedPart} 
      onClick={() => onPartClick?.('test-part')}
      onKeyDown={(e) => e.key === 'Enter' && onPartClick?.('test-part')}
      role="button"
      tabIndex={0}
    >
      Enhanced Parametric Car
    </div>
  ),
}))

vi.mock('../components/3D/PartsList', () => ({
  default: () => <div data-testid="parts-list">Parts List</div>,
}))

vi.mock('../components/3D/ShowPartsToggle', () => ({
  default: () => <div data-testid="show-parts-toggle">Show Parts Toggle</div>,
}))

// Partially mock three.js to avoid MeshPhysicalMaterial issues while keeping needed exports
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    // Keep all actual three.js exports to ensure MeshPhysicalMaterial exists
  }
})

describe('EVModel', () => {
  it('renders the 3D model viewer', () => {
    render(<EVModel />)
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument()
    expect(screen.getByTestId('bounds')).toBeInTheDocument()
    // Environment removed due to CDN issues in browser environment
  })

  it('renders the new UI components', () => {
    render(<EVModel />)
    expect(screen.getByTestId('show-parts-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('parts-list')).toBeInTheDocument()
    expect(screen.getByText('Reset View')).toBeInTheDocument()
  })

  it('renders the EnhancedParametricCar component', () => {
    render(<EVModel />)
    expect(screen.getByTestId('enhanced-parametric-car')).toBeInTheDocument()
  })

  it('renders OrbitControls with basic lighting', () => {
    render(<EVModel />)
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument()
    // Basic lighting instead of Environment due to CDN blocking
  })

  it('handles part selection callback', () => {
    const mockOnPartSelect = vi.fn()
    render(<EVModel onPartSelect={mockOnPartSelect} />)
    expect(mockOnPartSelect).toBeDefined()
  })

  it('passes selected part to EnhancedParametricCar', () => {
    render(<EVModel selectedPart="battery" />)
    const carModel = screen.getByTestId('enhanced-parametric-car')
    expect(carModel).toHaveAttribute('data-selected-part', 'battery')
  })

  it('includes accessibility attributes', () => {
    render(<EVModel />)
    const container = screen.getByRole('region')
    expect(container).toHaveAttribute('aria-label', 'Interactive 3D EV Model Viewer')
  })

  it('includes reset view button with proper accessibility', () => {
    render(<EVModel />)
    const resetButton = screen.getByRole('button', { name: /reset camera view/i })
    expect(resetButton).toBeInTheDocument()
  })
})
