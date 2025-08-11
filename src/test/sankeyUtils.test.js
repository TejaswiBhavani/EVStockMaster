import { describe, it, expect } from 'vitest'
import {
  getMaterialCategory,
  getMaterialColor,
  filterSankeyData,
  computeKPIs,
  exportLinksToCSV,
  formatNumber,
  getPercentage,
  truncateText,
  MATERIAL_COLORS
} from '../utils/sankeyUtils'

describe('sankeyUtils', () => {
  const mockData = {
    nodes: [
      { name: 'Lithium' },
      { name: 'Cobalt' },
      { name: 'Nickel' },
      { name: 'CATL' },
      { name: 'Tesla' }
    ],
    links: [
      { source: 'Lithium', target: 'CATL', value: 100 },
      { source: 'Cobalt', target: 'CATL', value: 50 },
      { source: 'Nickel', target: 'CATL', value: 75 },
      { source: 'CATL', target: 'Tesla', value: 225 }
    ]
  }

  describe('getMaterialCategory', () => {
    it('should categorize materials correctly', () => {
      expect(getMaterialCategory('Lithium')).toBe('Lithium')
      expect(getMaterialCategory('Cobalt')).toBe('Cobalt')
      expect(getMaterialCategory('Nickel')).toBe('Nickel')
      expect(getMaterialCategory('Tesla')).toBe('Other')
      expect(getMaterialCategory('CATL')).toBe('Other')
    })
  })

  describe('getMaterialColor', () => {
    it('should return correct colors for materials', () => {
      expect(getMaterialColor('Lithium')).toBe(MATERIAL_COLORS.Lithium)
      expect(getMaterialColor('Cobalt')).toBe(MATERIAL_COLORS.Cobalt)
      expect(getMaterialColor('Nickel')).toBe(MATERIAL_COLORS.Nickel)
      expect(getMaterialColor('Tesla')).toBe(MATERIAL_COLORS.Other)
    })
  })

  describe('filterSankeyData', () => {
    it('should filter data by materials and OEMs', () => {
      const filtered = filterSankeyData(mockData, ['Lithium'], ['CATL', 'Tesla'])
      
      // Should include links involving Lithium
      expect(filtered.links.some(link => link.source === 'Lithium')).toBe(true)
      
      // Should include nodes from filtered links
      expect(filtered.nodes.some(node => node.name === 'Lithium')).toBe(true)
      expect(filtered.nodes.some(node => node.name === 'CATL')).toBe(true)
    })

    it('should apply minimum threshold filtering', () => {
      const filtered = filterSankeyData(mockData, ['Lithium', 'Cobalt', 'Nickel'], ['CATL', 'Tesla'], 30)
      
      // Should exclude links below 30% of total (total = 450, 30% = 135)
      // Only CATL->Tesla (225) should remain
      expect(filtered.links.length).toBeLessThan(mockData.links.length)
    })

    it('should handle empty or invalid data', () => {
      expect(filterSankeyData(null)).toBeNull()
      expect(filterSankeyData({})).toEqual({})
      expect(filterSankeyData({ nodes: [], links: [] })).toEqual({ nodes: [], links: [] })
    })
  })

  describe('computeKPIs', () => {
    it('should compute correct KPIs', () => {
      const kpis = computeKPIs(mockData)
      
      expect(kpis.totalVolume).toBe(450) // Sum of all link values
      expect(kpis.numOEMs).toBeGreaterThan(0)
      expect(kpis.topMaterial).toBeDefined()
      expect(kpis.lastUpdated).toBeDefined()
    })

    it('should handle empty data', () => {
      const kpis = computeKPIs(null)
      
      expect(kpis.totalVolume).toBe(0)
      expect(kpis.numOEMs).toBe(0)
      expect(kpis.topMaterial).toBe('N/A')
    })
  })

  describe('exportLinksToCSV', () => {
    it('should export links to CSV format', () => {
      const csv = exportLinksToCSV(mockData.links)
      
      expect(csv).toContain('Source,Target,Value,Source Material,Target Material')
      expect(csv).toContain('Lithium')
      expect(csv).toContain('CATL')
    })

    it('should handle empty links', () => {
      expect(exportLinksToCSV([])).toBe('')
      expect(exportLinksToCSV(null)).toBe('')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with appropriate units', () => {
      expect(formatNumber(500)).toBe('500')
      expect(formatNumber(1500)).toBe('1.5K')
      expect(formatNumber(1500000)).toBe('1.5M')
      expect(formatNumber(1500000000)).toBe('1.5B')
    })
  })

  describe('getPercentage', () => {
    it('should calculate percentages correctly', () => {
      expect(getPercentage(25, 100)).toBe('25.0%')
      expect(getPercentage(33, 100, 2)).toBe('33.00%')
      expect(getPercentage(10, 0)).toBe('0%')
    })
  })

  describe('truncateText', () => {
    it('should truncate text correctly', () => {
      expect(truncateText('Short')).toBe('Short')
      expect(truncateText('This is a very long text that should be truncated', 10)).toBe('This is...')
      expect(truncateText('', 10)).toBe('')
      expect(truncateText(null, 10)).toBeNull()
    })
  })
})