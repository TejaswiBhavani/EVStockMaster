import { create } from 'zustand'
import { PartService } from '../services/partService'

const useSearchStore = create((set, get) => ({
  // Search state
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  searchError: null,
  totalResults: 0,

  // Part selection and zoom state
  selectedPartId: null,
  highlightedPartId: null,
  zoomToPart: null, // Will contain part coordinates for zoom
  urgentParts: [],

  // Actions
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    if (query.trim()) {
      get().performSearch(query)
    } else {
      set({ searchResults: [], totalResults: 0 })
    }
  },

  performSearch: async (query) => {
    set({ isSearching: true, searchError: null })
    
    try {
      const response = await PartService.searchParts(query)
      
      if (response.success) {
        set({
          searchResults: response.data,
          totalResults: response.totalResults,
          isSearching: false
        })
      } else {
        set({
          searchError: response.error || 'Search failed',
          isSearching: false,
          searchResults: [],
          totalResults: 0
        })
      }
    } catch (error) {
      set({
        searchError: error.message,
        isSearching: false,
        searchResults: [],
        totalResults: 0
      })
    }
  },

  selectPartFromSearch: (partId) => {
    const part = get().searchResults.find(p => p.id === partId)
    if (part && part.coordinates) {
      set({
        selectedPartId: partId,
        highlightedPartId: partId,
        zoomToPart: {
          coordinates: part.coordinates,
          partId: partId,
          timestamp: Date.now()
        }
      })
    }
  },

  setSelectedPart: (partId) => {
    set({ 
      selectedPartId: partId,
      highlightedPartId: partId 
    })
  },

  setHighlightedPart: (partId) => {
    set({ highlightedPartId: partId })
  },

  clearSelection: () => {
    set({
      selectedPartId: null,
      highlightedPartId: null,
      zoomToPart: null
    })
  },

  loadUrgentParts: async () => {
    try {
      const response = await PartService.getUrgentParts()
      if (response.success) {
        set({ urgentParts: response.data })
      }
    } catch (error) {
      console.error('Failed to load urgent parts:', error)
    }
  },

  // Clear zoom action after it's been processed
  clearZoomAction: () => {
    set({ zoomToPart: null })
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      searchResults: [],
      totalResults: 0,
      isSearching: false,
      searchError: null
    })
  }
}))

export default useSearchStore