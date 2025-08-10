import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SupplyChainSankey from '../components/supplychain/SupplyChainSankey'
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap'
import { THEMATIC_BASKETS } from '../utils/thematicBaskets'
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
  const [selectedBasket, setSelectedBasket] = useState('ChinaEV')
  const [correlationData, setCorrelationData] = useState({ symbols: sampleSymbols, matrix: sampleMatrix })
  const { messages, error } = useSSE('/api/alerts/stream')

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

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold heading-gradient">EV Ecosystem Analytics</h1>
        <p className="text-gray-600">Interactive supply chain and correlation analysis</p>
      </motion.div>

      {/* Real-time alerts display */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="modern-card p-4 border-l-4 border-blue-500"
        >
          <h3 className="font-semibold text-blue-800 mb-2">Live Updates</h3>
          <div className="text-sm text-gray-600">
            Latest: {messages[messages.length - 1]?.type} at {new Date(messages[messages.length - 1]?.ts * 1000).toLocaleTimeString()}
          </div>
        </motion.div>
      )}

      {/* Supply Chain Sankey */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="modern-card p-6"
      >
        <h2 className="text-xl font-semibold heading-gradient mb-4">EV Supply Chain Flow</h2>
        <p className="text-gray-600 mb-6">Material and component dependencies in the EV ecosystem</p>
        <div className="overflow-x-auto">
          <SupplyChainSankey data={sampleSankeyData} />
        </div>
      </motion.div>

      {/* Correlation Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="modern-card p-6"
      >
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
      </motion.div>

      {/* Thematic Baskets Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="modern-card p-6"
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