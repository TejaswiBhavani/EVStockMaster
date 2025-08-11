import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { sankey as d3sankey, sankeyLinkHorizontal } from 'd3-sankey'
import { Download, FileText } from 'lucide-react'
import { 
  getMaterialColor, 
  truncateText, 
  formatNumber, 
  getPercentage, 
  exportLinksToCSV, 
  downloadCSV, 
  downloadSVG 
} from '../../utils/sankeyUtils'

export default function SupplyChainSankey({ 
  data, 
  width = 900, 
  height = 420,
  onNodeSelect = () => {},
  onLinkSelect = () => {}
}) {
  const ref = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedLink, setSelectedLink] = useState(null)
  const [hoveredElement, setHoveredElement] = useState(null)

  useEffect(() => {
    if (!data || !data.nodes?.length) return
    
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    // Calculate total volume for percentages
    const totalVolume = data.links.reduce((sum, link) => sum + link.value, 0)

    const sankey = d3sankey()
      .nodeId(d => d.name)
      .nodeWidth(16)
      .nodePadding(14)
      .extent([[1, 1], [width - 1, height - 6]])

    const graph = sankey({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d })),
    })

    // Set up SVG with accessibility
    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', `Supply chain flow diagram showing ${graph.nodes.length} nodes and ${graph.links.length} links`)

    // Add skip link for accessibility
    svg.append('desc')
      .text('Interactive supply chain flow diagram. Use tab to navigate through nodes and links.')

    // Create tooltip div
    const tooltip = d3.select('body').selectAll('.sankey-tooltip')
      .data([0])
      .join('div')
      .attr('class', 'sankey-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')

    // Helper function to get opacity based on selection/hover state
    const getElementOpacity = (element, elementType) => {
      if (!hoveredElement && !selectedNode && !selectedLink) return 1
      
      if (selectedNode || selectedLink) {
        // Selection mode - show selected and adjacent elements
        if (elementType === 'node') {
          if (selectedNode && element.name === selectedNode.name) return 1
          if (selectedLink && (element.name === selectedLink.source.name || element.name === selectedLink.target.name)) return 1
          return 0.3
        } else if (elementType === 'link') {
          if (selectedLink && element === selectedLink) return 1
          if (selectedNode && (element.source.name === selectedNode.name || element.target.name === selectedNode.name)) return 1
          return 0.3
        }
      } else if (hoveredElement) {
        // Hover mode - show hovered and adjacent elements
        const { element: hovered, type: hoveredType } = hoveredElement
        if (elementType === 'node') {
          if (element.name === hovered.name) return 1
          if (hoveredType === 'link' && (element.name === hovered.source.name || element.name === hovered.target.name)) return 1
          if (hoveredType === 'node') {
            // Show adjacent nodes
            const isAdjacent = graph.links.some(link => 
              (link.source.name === hovered.name && link.target.name === element.name) ||
              (link.target.name === hovered.name && link.source.name === element.name)
            )
            return isAdjacent ? 1 : 0.3
          }
          return 0.3
        } else if (elementType === 'link') {
          if (element === hovered) return 1
          if (hoveredType === 'node' && (element.source.name === hovered.name || element.target.name === hovered.name)) return 1
          return 0.3
        }
      }
      return 1
    }

    // Draw links
    const links = svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => getMaterialColor(d.source.name))
      .attr('stroke-opacity', d => getElementOpacity(d, 'link'))
      .attr('stroke-width', d => Math.max(1, d.width))
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        setHoveredElement({ element: d, type: 'link' })
        tooltip
          .html(`
            <strong>${d.source.name} → ${d.target.name}</strong><br/>
            Volume: ${formatNumber(d.value)}<br/>
            ${getPercentage(d.value, totalVolume)} of total flow
          `)
          .style('visibility', 'visible')
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px')
      })
      .on('mouseout', function() {
        setHoveredElement(null)
        tooltip.style('visibility', 'hidden')
      })
      .on('click', function(event, d) {
        event.stopPropagation()
        setSelectedLink(selectedLink === d ? null : d)
        setSelectedNode(null)
        onLinkSelect(selectedLink === d ? null : d)
      })

    // Draw nodes
    const nodes = svg.append('g')
      .selectAll('rect')
      .data(graph.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => Math.max(1, d.y1 - d.y0))
      .attr('width', d => d.x1 - d.x0)
      .attr('rx', 4)
      .attr('fill', d => getMaterialColor(d.name))
      .attr('opacity', d => getElementOpacity(d, 'node'))
      .attr('stroke', d => selectedNode && d.name === selectedNode.name ? '#333' : 'none')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .attr('tabindex', 0)
      .on('mouseover', function(event, d) {
        setHoveredElement({ element: d, type: 'node' })
        tooltip
          .html(`
            <strong>${d.name}</strong><br/>
            Total flow: ${formatNumber(d.value || 0)}<br/>
            ${getPercentage(d.value || 0, totalVolume)} of total volume
          `)
          .style('visibility', 'visible')
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px')
      })
      .on('mouseout', function() {
        setHoveredElement(null)
        tooltip.style('visibility', 'hidden')
      })
      .on('click', function(event, d) {
        event.stopPropagation()
        setSelectedNode(selectedNode && selectedNode.name === d.name ? null : d)
        setSelectedLink(null)
        onNodeSelect(selectedNode && selectedNode.name === d.name ? null : d)
      })
      .on('keydown', function(event, d) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setSelectedNode(selectedNode && selectedNode.name === d.name ? null : d)
          setSelectedLink(null)
          onNodeSelect(selectedNode && selectedNode.name === d.name ? null : d)
        }
      })

    // Draw labels
    const labels = svg.append('g')
      .style('font', '12px sans-serif')
      .selectAll('text')
      .data(graph.nodes)
      .join('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .attr('fill', '#374151')
      .attr('opacity', d => getElementOpacity(d, 'node'))
      .text(d => truncateText(d.name, 15))
      .style('pointer-events', 'none')

    // Clear selection when clicking on empty space
    svg.on('click', function() {
      setSelectedNode(null)
      setSelectedLink(null)
      onNodeSelect(null)
      onLinkSelect(null)
    })

    // Update opacities when hover/selection state changes
    const updateOpacities = () => {
      nodes.attr('opacity', d => getElementOpacity(d, 'node'))
      links.attr('stroke-opacity', d => getElementOpacity(d, 'link'))
      labels.attr('opacity', d => getElementOpacity(d, 'node'))
      nodes.attr('stroke', d => selectedNode && d.name === selectedNode.name ? '#333' : 'none')
    }

    // Watch for state changes
    updateOpacities()

  }, [data, width, height, selectedNode, selectedLink, hoveredElement, onNodeSelect, onLinkSelect])

  const handleExportCSV = () => {
    if (!data || !data.links) return
    const csvData = exportLinksToCSV(data.links)
    downloadCSV(csvData, 'supply-chain-links.csv')
  }

  const handleExportSVG = () => {
    const svgElement = ref.current
    if (svgElement) {
      downloadSVG(svgElement, 'supply-chain-diagram.svg')
    }
  }

  return (
    <div className="relative">
      {/* Export Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition-colors"
          title="Export link data as CSV"
        >
          <FileText size={12} />
          CSV
        </button>
        <button
          onClick={handleExportSVG}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition-colors"
          title="Export diagram as SVG"
        >
          <Download size={12} />
          SVG
        </button>
      </div>

      {/* Main SVG */}
      <svg ref={ref} className="w-full h-auto" />

      {/* Selection Info */}
      {(selectedNode || selectedLink) && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">Selected:</h4>
          {selectedNode && (
            <p className="text-sm text-blue-800">
              Node: <strong>{selectedNode.name}</strong> 
              {selectedNode.value && ` (Volume: ${formatNumber(selectedNode.value)})`}
            </p>
          )}
          {selectedLink && (
            <p className="text-sm text-blue-800">
              Link: <strong>{selectedLink.source.name} → {selectedLink.target.name}</strong> 
              (Volume: {formatNumber(selectedLink.value)})
            </p>
          )}
        </div>
      )}
    </div>
  )
}