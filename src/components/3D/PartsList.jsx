import React from 'react'
import { useEVViewerStore } from '../../store/evViewerStore'
import { INTERACTIVE_PARTS } from '../../theme/threeTokens'

/**
 * Parts list component for selecting different EV components
 * Shows all interactive parts with selection state
 */
export default function PartsList() {
  const { selectedPart, setSelectedPart } = useEVViewerStore()
  
  const mainParts = [
    INTERACTIVE_PARTS.battery,
    INTERACTIVE_PARTS.motor,
    INTERACTIVE_PARTS.wheels,
    INTERACTIVE_PARTS.headlights,
    INTERACTIVE_PARTS.taillights
  ]

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-lg border border-gray-200 shadow-lg p-4 min-w-48">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">EV Components</h3>
      <div className="space-y-2">
        {mainParts.map((part) => (
          <button
            key={part.id}
            onClick={() => setSelectedPart(selectedPart === part.id ? null : part.id)}
            aria-pressed={selectedPart === part.id}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              selectedPart === part.id
                ? 'bg-green-100 text-green-800 border border-green-300 shadow-sm'
                : 'hover:bg-gray-100 text-gray-700 border border-transparent'
            }`}
          >
            <div className="font-medium">{part.name}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
              {part.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}