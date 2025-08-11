/**
 * Utility functions for Sankey diagram data processing, filtering, and KPI computation
 */

// Material color palette (color-blind aware)
export const MATERIAL_COLORS = {
  'Lithium': '#1f77b4',
  'Cobalt': '#9467bd', 
  'Nickel': '#2ca02c',
  'Other': '#8c8c8c'
}

// Default materials for filtering
export const DEFAULT_MATERIALS = ['Lithium', 'Cobalt', 'Nickel']

// Default OEMs for filtering  
export const DEFAULT_OEMS = ['CATL', 'BYD', 'Tesla', 'VW Group', 'GM']

/**
 * Get material category from node name
 * @param {string} nodeName - Name of the node
 * @returns {string} Material category
 */
export function getMaterialCategory(nodeName) {
  if (nodeName.includes('Lithium') || nodeName === 'Lithium') return 'Lithium'
  if (nodeName.includes('Cobalt') || nodeName === 'Cobalt') return 'Cobalt'
  if (nodeName.includes('Nickel') || nodeName === 'Nickel') return 'Nickel'
  return 'Other'
}

/**
 * Get color for a material or node
 * @param {string} materialOrNode - Material name or node name
 * @returns {string} Hex color code
 */
export function getMaterialColor(materialOrNode) {
  const category = getMaterialCategory(materialOrNode)
  return MATERIAL_COLORS[category] || MATERIAL_COLORS.Other
}

/**
 * Filter Sankey data by selected materials and OEMs
 * @param {Object} data - Original Sankey data {nodes, links}
 * @param {Array} selectedMaterials - Array of selected material names
 * @param {Array} selectedOEMs - Array of selected OEM names
 * @param {number} minLinkPercent - Minimum link percentage to include (0-100)
 * @returns {Object} Filtered Sankey data
 */
export function filterSankeyData(data, selectedMaterials = DEFAULT_MATERIALS, selectedOEMs = DEFAULT_OEMS, minLinkPercent = 0) {
  if (!data || !data.nodes || !data.links) return data

  // Calculate total value for percentage thresholding
  const totalValue = data.links.reduce((sum, link) => sum + link.value, 0)
  const minLinkValue = (minLinkPercent / 100) * totalValue

  // Filter links by materials, OEMs, and minimum threshold
  const filteredLinks = data.links.filter(link => {
    const sourceMaterial = getMaterialCategory(link.source)
    const targetMaterial = getMaterialCategory(link.target)
    
    // Check if link involves selected materials
    const involvesMaterial = selectedMaterials.includes(sourceMaterial) || 
                           selectedMaterials.includes(targetMaterial) ||
                           selectedMaterials.includes(link.source) ||
                           selectedMaterials.includes(link.target)
    
    // Check if link involves selected OEMs
    const involvesOEM = selectedOEMs.includes(link.source) || 
                       selectedOEMs.includes(link.target)
    
    // Check minimum threshold
    const meetsThreshold = link.value >= minLinkValue

    return involvesMaterial && involvesOEM && meetsThreshold
  })

  // Group small links under threshold into "Other" node
  const smallLinks = data.links.filter(link => link.value < minLinkValue)
  const otherValue = smallLinks.reduce((sum, link) => sum + link.value, 0)

  // Get unique nodes from filtered links
  const usedNodeNames = new Set()
  filteredLinks.forEach(link => {
    usedNodeNames.add(link.source)
    usedNodeNames.add(link.target)
  })

  // Add "Other" node if there are small links
  if (otherValue > 0) {
    usedNodeNames.add('Other')
  }

  // Filter nodes to only include those used in filtered links
  const filteredNodes = data.nodes.filter(node => usedNodeNames.has(node.name))

  // Add "Other" node if needed
  if (otherValue > 0 && !filteredNodes.find(node => node.name === 'Other')) {
    filteredNodes.push({ name: 'Other' })
  }

  return {
    nodes: filteredNodes,
    links: filteredLinks
  }
}

/**
 * Compute KPIs from Sankey data
 * @param {Object} data - Sankey data {nodes, links}
 * @returns {Object} KPI metrics
 */
export function computeKPIs(data) {
  if (!data || !data.nodes || !data.links) {
    return {
      totalVolume: 0,
      numOEMs: 0,
      topMaterial: 'N/A',
      lastUpdated: new Date().toISOString()
    }
  }

  // Calculate total volume
  const totalVolume = data.links.reduce((sum, link) => sum + link.value, 0)

  // Count OEMs (assuming OEMs are in the right side of the flow)
  const oemNodes = data.nodes.filter(node => 
    DEFAULT_OEMS.includes(node.name) || 
    node.name.includes('Tesla') || 
    node.name.includes('VW') || 
    node.name.includes('GM') ||
    node.name.includes('CATL') ||
    node.name.includes('BYD')
  )
  const numOEMs = oemNodes.length

  // Find top material by volume
  const materialVolumes = {}
  data.links.forEach(link => {
    const sourceMaterial = getMaterialCategory(link.source)
    if (DEFAULT_MATERIALS.includes(sourceMaterial)) {
      materialVolumes[sourceMaterial] = (materialVolumes[sourceMaterial] || 0) + link.value
    }
  })

  const topMaterial = Object.entries(materialVolumes)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'

  return {
    totalVolume,
    numOEMs,
    topMaterial,
    lastUpdated: new Date().toISOString()
  }
}

/**
 * Export Sankey links to CSV format
 * @param {Array} links - Array of link objects
 * @returns {string} CSV formatted string
 */
export function exportLinksToCSV(links) {
  if (!links || !links.length) return ''

  const headers = ['Source', 'Target', 'Value', 'Source Material', 'Target Material']
  const csvRows = [headers.join(',')]

  links.forEach(link => {
    const row = [
      `"${link.source}"`,
      `"${link.target}"`, 
      link.value,
      `"${getMaterialCategory(link.source)}"`,
      `"${getMaterialCategory(link.target)}"`
    ]
    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}

/**
 * Download CSV data as file
 * @param {string} csvData - CSV formatted string
 * @param {string} filename - Filename for download
 */
export function downloadCSV(csvData, filename = 'sankey-links.csv') {
  const blob = new Blob([csvData], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Export SVG element as downloadable file
 * @param {SVGElement} svgElement - SVG DOM element
 * @param {string} filename - Filename for download
 */
export function downloadSVG(svgElement, filename = 'sankey-diagram.svg') {
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgElement)
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Truncate text to fit width with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 20) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Format number with appropriate units (K, M, B)
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 1) {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(decimals) + 'B'
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(decimals) + 'M'
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(decimals) + 'K'
  }
  return value.toString()
}

/**
 * Get percentage of total for a value
 * @param {number} value - Individual value
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Percentage string
 */
export function getPercentage(value, total, decimals = 1) {
  if (!total || total === 0) return '0%'
  return ((value / total) * 100).toFixed(decimals) + '%'
}