import { describe, it, expect } from 'vitest'
import { evParts } from '../data/mockData'

describe('Mock Data', () => {
  it('should have EV parts data available', () => {
    expect(evParts).toBeDefined()
    expect(Array.isArray(evParts)).toBe(true)
  })

  it('should have properly structured EV parts', () => {
    if (evParts.length > 0) {
      const item = evParts[0]
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('currentStock')
      expect(item).toHaveProperty('minimumStock')
    }
  })

  it('should have at least some EV parts', () => {
    expect(evParts.length).toBeGreaterThan(0)
  })
})

describe('Data Validation', () => {
  it('should have valid stock numbers', () => {
    evParts.forEach(item => {
      if (item.currentStock !== undefined) {
        expect(typeof item.currentStock).toBe('number')
        expect(item.currentStock).toBeGreaterThanOrEqual(0)
      }
    })
  })

  it('should have valid minimum stock levels', () => {
    evParts.forEach(item => {
      if (item.minimumStock !== undefined) {
        expect(typeof item.minimumStock).toBe('number')
        expect(item.minimumStock).toBeGreaterThanOrEqual(0)
      }
    })
  })
})