import { describe, it, expect } from 'vitest'
import { inventoryData } from '../../data/mockData'

describe('Mock Data', () => {
  it('should have inventory data available', () => {
    expect(inventoryData).toBeDefined()
    expect(Array.isArray(inventoryData)).toBe(true)
  })

  it('should have properly structured inventory items', () => {
    if (inventoryData.length > 0) {
      const item = inventoryData[0]
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('stock')
      expect(item).toHaveProperty('minStock')
    }
  })

  it('should have at least some inventory items', () => {
    expect(inventoryData.length).toBeGreaterThan(0)
  })
})

describe('Data Validation', () => {
  it('should have valid stock numbers', () => {
    inventoryData.forEach(item => {
      if (item.stock !== undefined) {
        expect(typeof item.stock).toBe('number')
        expect(item.stock).toBeGreaterThanOrEqual(0)
      }
    })
  })

  it('should have valid minimum stock levels', () => {
    inventoryData.forEach(item => {
      if (item.minStock !== undefined) {
        expect(typeof item.minStock).toBe('number')
        expect(item.minStock).toBeGreaterThanOrEqual(0)
      }
    })
  })
})