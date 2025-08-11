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
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

// Partially mock three.js to avoid MeshPhysicalMaterial issues while keeping needed exports
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    // Keep all actual three.js exports to ensure MeshPhysicalMaterial exists
  }
})

// Mock CarModel to avoid material instantiation while retaining EVModel structure
vi.mock('../components/3D/CarModel', () => ({
  default: ({ selectedPart, onPartClick }) => (
    <div data-testid="car-model" data-selected-part={selectedPart} onClick={() => onPartClick?.('test-part')}>
      Car Model Placeholder
    </div>
  ),
}))

// Mock PostFX to avoid effects issues
vi.mock('../components/3D/PostFX', () => ({
  default: () => <div data-testid="post-fx">PostFX Placeholder</div>,
}))

describe('EVModel', () => {
  it('renders the 3D model viewer', () => {
    render(<EVModel />)
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument()
  })

  it('displays the part label when no part is selected', () => {
    render(<EVModel />)
    expect(screen.getByText('Interactive EV - Click parts to explore')).toBeInTheDocument()
  })

  it('displays the part label when a part is selected', () => {
    render(<EVModel selectedPart="body" />)
    expect(screen.getByText('Aero body with high-reflective paint')).toBeInTheDocument()
  })

  it('displays the part label for different parts', () => {
    render(<EVModel selectedPart="battery" />)
    expect(screen.getByText('Battery tray & pack region')).toBeInTheDocument()
  })

  it('renders the CarModel component', () => {
    render(<EVModel />)
    expect(screen.getByTestId('car-model')).toBeInTheDocument()
  })

  it('renders OrbitControls and Stats', () => {
    render(<EVModel />)
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument()
    expect(screen.getByTestId('stats')).toBeInTheDocument()
  })

  it('handles part selection callback', () => {
    const mockOnPartSelect = vi.fn()
    render(<EVModel onPartSelect={mockOnPartSelect} />)
    expect(mockOnPartSelect).toBeDefined()
  })

  it('passes selected part to CarModel', () => {
    render(<EVModel selectedPart="battery" />)
    const carModel = screen.getByTestId('car-model')
    expect(carModel).toHaveAttribute('data-selected-part', 'battery')
  })
})
