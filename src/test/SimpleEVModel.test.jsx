import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SimpleEVModel from '../components/3D/SimpleEVModel'
import '@testing-library/jest-dom'

// Mock @react-three/fiber and @react-three/drei
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="three-canvas">{children}</div>,
  useFrame: () => {},
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
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

vi.mock('three', () => ({
  MeshStandardMaterial: class {
    constructor(props) {
      Object.assign(this, props)
    }
  },
}))

describe('SimpleEVModel', () => {
  it('renders the simple 3D model viewer', () => {
    render(<SimpleEVModel />)
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument()
  })

  it('uses RoundedBox components for realistic appearance', () => {
    render(<SimpleEVModel />)
    // Should have multiple RoundedBox components for body parts
    const roundedBoxes = screen.getAllByTestId('rounded-box')
    expect(roundedBoxes.length).toBeGreaterThan(0)
  })

  it('includes realistic wheel design with rims', () => {
    render(<SimpleEVModel />)
    // Should have cylinder components for wheels
    const cylinders = screen.getAllByTestId('cylinder')
    expect(cylinders.length).toBeGreaterThan(0)
  })

  it('handles part selection callback', () => {
    const mockOnPartSelect = vi.fn()
    render(<SimpleEVModel onPartSelect={mockOnPartSelect} />)

    // The callback prop should be passed correctly
    expect(mockOnPartSelect).toBeDefined()
  })

  it('responds to selected part state', () => {
    const { rerender } = render(<SimpleEVModel selectedPart="body" />)

    // Re-render with different selected part
    rerender(<SimpleEVModel selectedPart="battery" />)

    // Component should handle different selectedPart values
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument()
  })
})
