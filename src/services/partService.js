// Service for TATA EV parts data and analytics
import { evParts } from '../data/mockData.js'

// Mock API delay to simulate real API calls
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export class PartService {
  // Get all parts
  static async getAllParts() {
    await mockDelay(300)
    return {
      success: true,
      data: evParts,
      timestamp: new Date().toISOString()
    }
  }

  // Get specific part analytics
  static async getPartAnalytics(partId) {
    await mockDelay(400)
    
    const part = evParts.find(p => p.id === partId)
    if (!part) {
      return {
        success: false,
        error: 'Part not found',
        data: null
      }
    }

    // Generate real-time analytics
    const analytics = {
      ...part,
      realTimeData: {
        stockLevel: part.currentStock,
        reorderStatus: part.currentStock <= part.minimumStock ? 'URGENT' : 'OK',
        supplierStatus: 'ACTIVE',
        lastMovement: {
          type: 'OUT',
          quantity: Math.floor(Math.random() * 5) + 1,
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
        },
        usage: {
          daily: Math.floor(Math.random() * 10) + 2,
          weekly: Math.floor(Math.random() * 50) + 15,
          monthly: Math.floor(Math.random() * 200) + 60
        },
        trend: part.currentStock > part.minimumStock * 1.5 ? 'STABLE' : 
               part.currentStock > part.minimumStock ? 'DECLINING' : 'CRITICAL',
        daysUntilReorder: Math.max(0, Math.floor((part.currentStock - part.minimumStock) / 2)),
        cost: {
          unitCost: part.price,
          totalValue: part.price * part.currentStock,
          monthlySpend: part.price * Math.floor(Math.random() * 50)
        }
      },
      supplierDetails: {
        name: part.supplier,
        rating: 4.2 + Math.random() * 0.7,
        deliveryTime: `${Math.floor(Math.random() * 10) + 5}-${Math.floor(Math.random() * 10) + 15} days`,
        reliability: Math.floor(Math.random() * 15) + 85 + '%',
        contact: {
          phone: '+91 98765 43210',
          email: 'orders@tata-autoparts.com',
          location: 'Pune, Maharashtra'
        }
      }
    }

    return {
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    }
  }

  // Search parts by query
  static async searchParts(query) {
    await mockDelay(200)
    
    if (!query || query.trim().length === 0) {
      return {
        success: true,
        data: evParts,
        query: '',
        totalResults: evParts.length
      }
    }

    const searchTerm = query.toLowerCase().trim()
    
    const results = evParts.filter(part => {
      return (
        part.name.toLowerCase().includes(searchTerm) ||
        part.id.toLowerCase().includes(searchTerm) ||
        part.category.toLowerCase().includes(searchTerm) ||
        part.supplier.toLowerCase().includes(searchTerm) ||
        part.description.toLowerCase().includes(searchTerm)
      )
    })

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === searchTerm || a.id.toLowerCase() === searchTerm
      const bExact = b.name.toLowerCase() === searchTerm || b.id.toLowerCase() === searchTerm
      
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      // Secondary sort by stock level (critical items first)
      return a.urgentAlert === b.urgentAlert ? 0 : a.urgentAlert ? -1 : 1
    })

    return {
      success: true,
      data: results,
      query: searchTerm,
      totalResults: results.length,
      timestamp: new Date().toISOString()
    }
  }

  // Get parts with urgent alerts
  static async getUrgentParts() {
    await mockDelay(150)
    
    const urgentParts = evParts.filter(part => part.urgentAlert === true)
    
    return {
      success: true,
      data: urgentParts,
      totalUrgent: urgentParts.length,
      timestamp: new Date().toISOString()
    }
  }

  // Get part by coordinates (for 3D model interaction)
  static async getPartByCoordinates(x, y, z, tolerance = 0.5) {
    await mockDelay(100)
    
    const part = evParts.find(p => {
      const coords = p['coordinates']
      if (!coords) return false
      
      return Math.abs(coords[0] - x) <= tolerance &&
             Math.abs(coords[1] - y) <= tolerance &&
             Math.abs(coords[2] - z) <= tolerance
    })

    return {
      success: !!part,
      data: part || null,
      searchCoordinates: [x, y, z],
      timestamp: new Date().toISOString()
    }
  }
}

// Export individual functions for easier importing
export const {
  getAllParts,
  getPartAnalytics,
  searchParts,
  getUrgentParts,
  getPartByCoordinates
} = PartService