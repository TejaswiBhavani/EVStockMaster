import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SupplyChainSankey from '../components/supplychain/SupplyChainSankey'
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap'
import FilterBar from '../components/analytics/FilterBar'
import KPIRow from '../components/analytics/KPIRow'
import Tabs from '../components/analytics/Tabs'
import Legend from '../components/analytics/Legend'
import { THEMATIC_BASKETS } from '../utils/thematicBaskets'
import { 
  filterSankeyData, 
  computeKPIs, 
  DEFAULT_MATERIALS, 
  DEFAULT_OEMS 
} from '../utils/sankeyUtils'
import { useSSE } from '../hooks/useSSE'

// Sample data for Sankey diagram
const sampleSankeyData = {
  nodes: [
    { name: 'Raw Materials' },
    { name: 'Battery Cells' },
    { name: 'Battery Packs' },
    { name: 'EV Assembly' },
    { name: 'Lithium' },
    { name: 'Cobalt' },
    { name: 'Nickel' },
    { name: 'CATL' },
    { name: 'BYD' },
    { name: 'Tesla' },
    { name: 'VW Group' },
    { name: 'GM' }
  ],
  links: [
    { source: 'Lithium', target: 'Battery Cells', value: 30 },
    { source: 'Cobalt', target: 'Battery Cells', value: 20 },
    { source: 'Nickel', target: 'Battery Cells', value: 25 },
    { source: 'Battery Cells', target: 'CATL', value: 35 },
    { source: 'Battery Cells', target: 'BYD', value: 25 },
    { source: 'CATL', target: 'Tesla', value: 20 },
    { source: 'CATL', target: 'VW Group', value: 15 },
    { source: 'BYD', target: 'EV Assembly', value: 25 },
    { source: 'Tesla', target: 'EV Assembly', value: 20 },
    { source: 'VW Group', target: 'EV Assembly', value: 15 },
    { source: 'GM', target: 'EV Assembly', value: 10 }
  ]
}

// Sample correlation data
const sampleSymbols = ['TSLA', 'NIO', 'XPEV', 'LI', 'RIVN']
const sampleMatrix = [
  [1.0, 0.3, 0.2, 0.1, 0.4],
  [0.3, 1.0, 0.7, 0.6, 0.2],
  [0.2, 0.7, 1.0, 0.8, 0.1],
  [0.1, 0.6, 0.8, 1.0, 0.0],
  [0.4, 0.2, 0.1, 0.0, 1.0]
]

export default function AnalyticsPage() {
  // Filter state
  const [selectedMaterials, setSelectedMaterials] = useState(DEFAULT_MATERIALS)
  const [selectedOEMs, setSelectedOEMs] = useState(DEFAULT_OEMS)
  const [minLinkThreshold, setMinLinkThreshold] = useState(0)
  
  // UI state
  const [activeTab, setActiveTab] = useState('supplychain')
  const [selectedBasket, setSelectedBasket] = useState('ChinaEV')
  const [correlationData, setCorrelationData] = useState({ symbols: sampleSymbols, matrix: sampleMatrix })
  
  // Data state
  const [filteredSankeyData, setFilteredSankeyData] = useState(sampleSankeyData)
  const [kpis, setKPIs] = useState({})
  
  const { messages } = useSSE('/api/alerts/stream')

  // Filter and compute data when filters change
  useEffect(() => {
    const filtered = filterSankeyData(sampleSankeyData, selectedMaterials, selectedOEMs, minLinkThreshold)
    setFilteredSankeyData(filtered)
    
    const computedKPIs = computeKPIs(filtered)
    setKPIs(computedKPIs)
  }, [selectedMaterials, selectedOEMs, minLinkThreshold])

  const fetchCorrelations = async (symbols) => {
    try {
      const response = await fetch('/api/correlations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(symbols)
      })
      const data = await response.json()
      setCorrelationData(data)
    } catch (err) {
      console.warn('Failed to fetch correlations, using sample data')
    }
  }

  useEffect(() => {
    const basketSymbols = THEMATIC_BASKETS[selectedBasket] || sampleSymbols
    fetchCorrelations(basketSymbols)
  }, [selectedBasket])

  // Reset filters to defaults
  const handleResetFilters = () => {
    setSelectedMaterials(DEFAULT_MATERIALS)
    setSelectedOEMs(DEFAULT_OEMS)
    setMinLinkThreshold(0)
  }

  // Handle KPI clicks (no-op in Phase 1)
  const handleKPIClick = (type, value) => {
    console.log(`KPI clicked: ${type} = ${value}`)
    // TODO: Open details drawer in Phase 2
  }

  // Handle node/link selection (no-op in Phase 1)
  const handleNodeSelect = (node) => {
    console.log('Node selected:', node)
    // TODO: Open details drawer in Phase 2
  }

  const handleLinkSelect = (link) => {
    console.log('Link selected:', link)
    // TODO: Open details drawer in Phase 2
  }

  // Tab configuration
  const tabs = [
    {
      id: 'supplychain',
      label: 'Supply Chain Flow',
      content: (
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-xl font-semibold heading-gradient mb-2">EV Supply Chain Flow</h2>
                <p className="text-gray-600">Material and component dependencies in the EV ecosystem</p>
              </div>
              <SupplyChainSankey 
                data={filteredSankeyData}
                onNodeSelect={handleNodeSelect}
                onLinkSelect={handleLinkSelect}
              />
            </div>
            <div className="lg:w-64">
              <Legend />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'correlations',
      label: 'Correlations',
      content: (
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold heading-gradient">Stock Correlation Matrix</h2>
              <p className="text-gray-600 mt-1">Correlation analysis for selected thematic basket</p>
            </div>
            <select 
              value={selectedBasket}
              onChange={(e) => setSelectedBasket(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            >
              {Object.keys(THEMATIC_BASKETS).map(basket => (
                <option key={basket} value={basket}>{basket}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-center">
            <CorrelationHeatmap 
              symbols={correlationData.symbols} 
              matrix={correlationData.matrix} 
              size={400}
            />
          </div>
        </div>
      )
    },
    {
      id: 'trends',
      label: 'Trends',
      content: (
        <div className="p-6 text-center">
          <div className="py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Trends Analysis</h2>
            <p className="text-gray-600 mb-4">Historical trends and forecasting</p>
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Coming in Phase 2</p>
              <p className="text-sm text-gray-400 mt-1">Time series analysis and predictive modeling</p>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 px-6 py-6"
      >
        <h1 className="text-3xl font-bold heading-gradient">EV Ecosystem Analytics</h1>
        <p className="text-gray-600 mt-1">Interactive supply chain and correlation analysis</p>
      </motion.div>

      {/* Real-time alerts display */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <h3 className="font-semibold text-blue-800 mb-2">Live Updates</h3>
          <div className="text-sm text-blue-600">
            Latest: {messages[messages.length - 1]?.type} at {new Date(messages[messages.length - 1]?.ts * 1000).toLocaleTimeString()}
          </div>
        </motion.div>
      )}

      {/* Filter Bar */}
      <FilterBar
        selectedMaterials={selectedMaterials}
        selectedOEMs={selectedOEMs}
        minLinkThreshold={minLinkThreshold}
        onMaterialsChange={setSelectedMaterials}
        onOEMsChange={setSelectedOEMs}
        onThresholdChange={setMinLinkThreshold}
        onReset={handleResetFilters}
      />

      {/* KPI Row */}
      <KPIRow 
        kpis={kpis}
        onKPIClick={handleKPIClick}
      />

      {/* Main Content with Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white"
      >
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </motion.div>

      {/* Thematic Baskets Overview (moved to bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-6 my-6 bg-white rounded-lg border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold heading-gradient mb-4">Thematic Investment Baskets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(THEMATIC_BASKETS).map(([name, symbols]) => (
            <div key={name} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{name}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {symbols.join(', ')}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {symbols.length} symbols
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}