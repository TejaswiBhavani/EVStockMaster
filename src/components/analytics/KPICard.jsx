import React from 'react'

/**
 * KPICard component for displaying individual KPI metrics
 * @param {Object} props
 * @param {string} props.title - KPI title
 * @param {string|number} props.value - KPI value
 * @param {string} props.subtitle - Optional subtitle
 * @param {boolean} props.clickable - Whether the KPI is clickable
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
export default function KPICard({
  title,
  value,
  subtitle,
  clickable = false,
  onClick = () => {},
  className = ''
}) {
  const baseClasses = "p-4 bg-white border border-gray-200 rounded-lg"
  const interactiveClasses = clickable ? "cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors" : ""
  
  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={clickable ? onClick : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
      aria-label={clickable ? `${title}: ${value}. Click for details` : undefined}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}