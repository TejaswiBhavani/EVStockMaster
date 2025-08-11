import React from 'react'
import { X, RotateCcw } from 'lucide-react'

/**
 * FilterBar component with sticky behavior and filter chips
 * @param {Object} props
 * @param {Array} props.selectedMaterials - Currently selected materials
 * @param {Array} props.selectedOEMs - Currently selected OEMs  
 * @param {number} props.minLinkThreshold - Minimum link threshold (0-100)
 * @param {Function} props.onMaterialsChange - Callback for materials change
 * @param {Function} props.onOEMsChange - Callback for OEMs change
 * @param {Function} props.onThresholdChange - Callback for threshold change
 * @param {Function} props.onReset - Callback for reset
 */
export default function FilterBar({
  selectedMaterials = [],
  selectedOEMs = [],
  minLinkThreshold = 0,
  onMaterialsChange = () => {},
  onOEMsChange = () => {},
  onThresholdChange = () => {},
  onReset = () => {}
}) {
  const availableMaterials = ['Lithium', 'Cobalt', 'Nickel']
  const availableOEMs = ['CATL', 'BYD', 'Tesla', 'VW Group', 'GM']

  const toggleMaterial = (material) => {
    if (selectedMaterials.includes(material)) {
      onMaterialsChange(selectedMaterials.filter(m => m !== material))
    } else {
      onMaterialsChange([...selectedMaterials, material])
    }
  }

  const toggleOEM = (oem) => {
    if (selectedOEMs.includes(oem)) {
      onOEMsChange(selectedOEMs.filter(o => o !== oem))
    } else {
      onOEMsChange([...selectedOEMs, oem])
    }
  }

  const removeMaterial = (material) => {
    onMaterialsChange(selectedMaterials.filter(m => m !== material))
  }

  const removeOEM = (oem) => {
    onOEMsChange(selectedOEMs.filter(o => o !== oem))
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Time Range Placeholder */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Time:</span>
            <select className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white">
              <option>Last 12 months</option>
              <option>Last 6 months</option>
              <option>Last 3 months</option>
            </select>
          </div>

          {/* Materials Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Materials:</span>
            <div className="relative">
              <select 
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
                onChange={(e) => {
                  if (e.target.value && !selectedMaterials.includes(e.target.value)) {
                    toggleMaterial(e.target.value)
                    e.target.value = ''
                  }
                }}
                value=""
              >
                <option value="">Add material...</option>
                {availableMaterials
                  .filter(material => !selectedMaterials.includes(material))
                  .map(material => (
                    <option key={material} value={material}>{material}</option>
                  ))
                }
              </select>
            </div>
          </div>

          {/* OEMs Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">OEMs:</span>
            <div className="relative">
              <select 
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
                onChange={(e) => {
                  if (e.target.value && !selectedOEMs.includes(e.target.value)) {
                    toggleOEM(e.target.value)
                    e.target.value = ''
                  }
                }}
                value=""
              >
                <option value="">Add OEM...</option>
                {availableOEMs
                  .filter(oem => !selectedOEMs.includes(oem))
                  .map(oem => (
                    <option key={oem} value={oem}>{oem}</option>
                  ))
                }
              </select>
            </div>
          </div>

          {/* Min Link Threshold */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Min Link:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minLinkThreshold}
                onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
                className="w-20"
                aria-label="Minimum link threshold percentage"
              />
              <span className="text-sm text-gray-600 w-8">{minLinkThreshold}%</span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            aria-label="Reset all filters"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* Active Filter Chips */}
        {(selectedMaterials.length > 0 || selectedOEMs.length > 0) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {/* Material Chips */}
            {selectedMaterials.map(material => (
              <span
                key={`material-${material}`}
                className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md"
              >
                {material}
                <button
                  onClick={() => removeMaterial(material)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                  aria-label={`Remove ${material} filter`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {/* OEM Chips */}
            {selectedOEMs.map(oem => (
              <span
                key={`oem-${oem}`}
                className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-green-100 text-green-800 rounded-md"
              >
                {oem}
                <button
                  onClick={() => removeOEM(oem)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                  aria-label={`Remove ${oem} filter`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}