import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { sankey as d3sankey, sankeyLinkHorizontal } from 'd3-sankey'

export default function SupplyChainSankey({ data, width = 900, height = 420 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!data || !data.nodes?.length) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const sankey = d3sankey()
      .nodeId(d => d.name)
      .nodeWidth(16)
      .nodePadding(14)
      .extent([[1, 1], [width - 1, height - 6]])

    const graph = sankey({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d })),
    })

    const color = d3.scaleOrdinal(d3.schemeTableau10)

    svg.attr('viewBox', `0 0 ${width} ${height}`)

    svg.append('g')
      .selectAll('rect')
      .data(graph.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => Math.max(1, d.y1 - d.y0))
      .attr('width', d => d.x1 - d.x0)
      .attr('rx', 4)
      .attr('fill', d => color(d.name))
      .append('title')
      .text(d => `${d.name}\n${d.value}`)

    svg.append('g')
      .attr('fill', 'none')
      .selectAll('g')
      .data(graph.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => color(d.source.name))
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', d => Math.max(1, d.width))
      .append('title')
      .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`)

    svg.append('g')
      .style('font', '12px sans-serif')
      .selectAll('text')
      .data(graph.nodes)
      .join('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .text(d => d.name)
  }, [data, width, height])

  return <svg ref={ref} className="w-full h-auto" />
}