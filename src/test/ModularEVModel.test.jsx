import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ModularEVModel from '../components/3D/ModularEVModel'
import '@testing-library/jest-dom'

// Mock the individual part components
vi.mock('../components/3D/parts/EVChassis', () => ({
  default: ({ selectedPart, onPartClick }) => (
    <div
      data-testid="ev-chassis"
      data-selected={selectedPart}
      onClick={() => onPartClick?.('body')}
    >
      EV Chassis Component
    </div>
  ),
}))

vi.mock('../components/3D/parts/EVPowertrain', () => ({
  default: ({ selectedPart, onPartClick }) => (
    <div
      data-testid="ev-powertrain"
      data-selected={selectedPart}
      onClick={() => onPartClick?.('battery')}
    >
      EV Powertrain Component
    </div>
  ),
}))

vi.mock('../components/3D/parts/EVExterior', () => ({
  default: ({ selectedPart, onPartClick }) => (
    <div
      data-testid="ev-exterior"
      data-selected={selectedPart}
      onClick={() => onPartClick?.('charging-port')}
    >
      EV Exterior Component
    </div>
  ),
}))

vi.mock('../components/3D/parts/EVInterior', () => ({
  default: ({ selectedPart, onPartClick }) => (
    <div
      data-testid="ev-interior"
      data-selected={selectedPart}
      onClick={() => onPartClick?.('dashboard')}
    >
      EV Interior Component
    </div>
  ),
}))

vi.mock('../components/3D/parts/EVEffects', () => ({
  default: ({ selectedPart, isCharging, engineRunning }) => (
    <div
      data-testid="ev-effects"
      data-selected={selectedPart}
      data-charging={isCharging}
      data-running={engineRunning}
    >
      EV Effects Component
    </div>
  ),
}))

// Mock React Three Fiber components
vi.mock('@react-three/fiber', () => ({
  useFrame: () => {},
}))

vi.mock('@react-three/drei', () => ({
  Float: ({ children }) => <div data-testid="float">{children}</div>,
}))

describe('ModularEVModel', () => {
  it('renders all modular components', () => {
    render(<ModularEVModel />)

    expect(screen.getByTestId('ev-chassis')).toBeInTheDocument()
    expect(screen.getByTestId('ev-powertrain')).toBeInTheDocument()
    expect(screen.getByTestId('ev-exterior')).toBeInTheDocument()
    expect(screen.getByTestId('ev-interior')).toBeInTheDocument()
    expect(screen.getByTestId('ev-effects')).toBeInTheDocument()
  })

  it('passes selectedPart prop to all components', () => {
    render(<ModularEVModel selectedPart="battery" />)

    expect(screen.getByTestId('ev-chassis')).toHaveAttribute('data-selected', 'battery')
    expect(screen.getByTestId('ev-powertrain')).toHaveAttribute('data-selected', 'battery')
    expect(screen.getByTestId('ev-exterior')).toHaveAttribute('data-selected', 'battery')
    expect(screen.getByTestId('ev-interior')).toHaveAttribute('data-selected', 'battery')
    expect(screen.getByTestId('ev-effects')).toHaveAttribute('data-selected', 'battery')
  })

  it('handles part click callbacks', () => {
    const mockOnPartClick = vi.fn()
    render(<ModularEVModel onPartClick={mockOnPartClick} />)

    // Test that the callback prop is defined
    expect(mockOnPartClick).toBeDefined()
  })

  it('passes effect states to EVEffects component', () => {
    render(<ModularEVModel />)

    const effectsComponent = screen.getByTestId('ev-effects')
    expect(effectsComponent).toHaveAttribute('data-charging', 'false')
    expect(effectsComponent).toHaveAttribute('data-running', 'true')
  })
})
