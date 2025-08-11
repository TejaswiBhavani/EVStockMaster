import React from 'react'
import { MATERIAL_COLORS } from '../../utils/sankeyUtils'

/**
 * Legend component for material color mapping
 * @param {Object} props
 * @param {Object} props.colorMap - Custom color mapping (optional)
 * @param {string} props.title - Legend title
 * @param {string} props.className - Additional CSS classes
 */
export default function Legend({
  colorMap = MATERIAL_COLORS,
  title = 'Materials',
  className = ''
}) {
  const entries = Object.entries(colorMap)
  
  if (!entries.length) return null

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {entries.map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}