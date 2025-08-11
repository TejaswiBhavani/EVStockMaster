import React from 'react'
import KPICard from './KPICard'
import { formatNumber } from '../../utils/sankeyUtils'

/**
 * KPIRow component that displays a row of KPI cards
 * @param {Object} props
 * @param {Object} props.kpis - KPI data object
 * @param {number} props.kpis.totalVolume - Total volume metric
 * @param {number} props.kpis.numOEMs - Number of OEMs
 * @param {string} props.kpis.topMaterial - Top material by volume
 * @param {string} props.kpis.lastUpdated - Last update timestamp
 * @param {Function} props.onKPIClick - Callback for KPI clicks (no-op in Phase 1)
 */
export default function KPIRow({ 
  kpis = {}, 
  onKPIClick = () => {} 
}) {
  const {
    totalVolume = 0,
    numOEMs = 0,
    topMaterial = 'N/A',
    lastUpdated = new Date().toISOString()
  } = kpis

  // Format last updated date
  const formatLastUpdated = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Unknown'
    }
  }

  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Volume"
          value={formatNumber(totalVolume)}
          subtitle="Supply chain flow"
          clickable={true}
          onClick={() => onKPIClick('totalVolume', totalVolume)}
        />
        
        <KPICard
          title="# OEMs"
          value={numOEMs}
          subtitle="Original Equipment Manufacturers"
          clickable={true}
          onClick={() => onKPIClick('numOEMs', numOEMs)}
        />
        
        <KPICard
          title="Top Material"
          value={topMaterial}
          subtitle="By volume"
          clickable={true}
          onClick={() => onKPIClick('topMaterial', topMaterial)}
        />
        
        <KPICard
          title="Last Updated"
          value={formatLastUpdated(lastUpdated)}
          subtitle="Data refresh"
          clickable={false}
        />
      </div>
    </div>
  )
}