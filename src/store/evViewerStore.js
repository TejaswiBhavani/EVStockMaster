import { create } from 'zustand'

/**
 * Zustand store for EV viewer state management
 * Handles part selection, hover states, and UI toggles
 */
export const useEVViewerStore = create((set) => ({
  // Current hovered part ID
  hoveredPart: null,
  
  // Currently selected part ID
  selectedPart: null,
  
  // Whether to show interactive part indicators
  showInteractive: false,
  
  // Reset view token for triggering camera resets
  resetViewToken: 0,
  
  // Actions
  setHoveredPart: (id) => set({ hoveredPart: id }),
  
  setSelectedPart: (id) => set({ selectedPart: id }),
  
  toggleShowInteractive: () => set((state) => ({ 
    showInteractive: !state.showInteractive 
  })),
  
  triggerResetView: () => set((state) => ({ 
    resetViewToken: state.resetViewToken + 1,
    selectedPart: null
  }))
}))