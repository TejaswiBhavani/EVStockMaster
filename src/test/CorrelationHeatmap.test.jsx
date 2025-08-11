import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap'

describe('CorrelationHeatmap', () => {
  it('renders without crashing', () => {
    const symbols = ['TSLA', 'NIO', 'XPEV']
    const matrix = [
      [1.0, 0.3, 0.2],
      [0.3, 1.0, 0.7],
      [0.2, 0.7, 1.0]
    ]
    
    render(<CorrelationHeatmap symbols={symbols} matrix={matrix} />)
    // Basic smoke test - if it renders without throwing, we're good
    expect(true).toBe(true)
  })
  
  it('handles empty data gracefully', () => {
    render(<CorrelationHeatmap symbols={[]} matrix={[]} />)
    // Should not crash with empty data
  })
})