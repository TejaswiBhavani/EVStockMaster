import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useEVViewerStore } from '../../store/evViewerStore'

/**
 * Toggle button for showing/hiding interactive part indicators
 * Reveals labels and outlines for all clickable parts
 */
export default function ShowPartsToggle() {
  const { showInteractive, toggleShowInteractive } = useEVViewerStore()
  
  return (
    <button
      onClick={toggleShowInteractive}
      aria-label={showInteractive ? 'Hide interactive parts' : 'Show interactive parts'}
      className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-lg p-3 hover:bg-white/95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="flex items-center gap-2 text-sm">
        {showInteractive ? (
          <EyeOff className="w-4 h-4 text-gray-600" />
        ) : (
          <Eye className="w-4 h-4 text-gray-600" />
        )}
        <span className="text-gray-700 font-medium">
          {showInteractive ? 'Hide Parts' : 'Show Parts'}
        </span>
      </div>
    </button>
  )
}