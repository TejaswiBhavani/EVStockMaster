import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function CorrelationHeatmap({ symbols, matrix, size = 480 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!symbols?.length || !matrix?.length) return
    const n = symbols.length
    const cellSize = Math.max(16, Math.floor(size / (n + 2)))
    const width = (n + 2) * cellSize
    const height = (n + 2) * cellSize

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const color = d3.scaleSequential(d3.interpolateRdBu).domain([1, -1])

    const g = svg.append('g').attr('transform', `translate(${cellSize}, ${cellSize})`)

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        g.append('rect')
          .attr('x', j * cellSize)
          .attr('y', i * cellSize)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('rx', 2)
          .attr('fill', color(matrix[i][j]))
          .attr('opacity', i === j ? 0.4 : 1.0)
      }
    }

    const axis = svg.append('g').style('font', '12px sans-serif')
    axis.selectAll('text.row')
      .data(symbols)
      .join('text')
      .attr('x', 2)
      .attr('y', (_, i) => (i + 1.5) * cellSize)
      .attr('text-anchor', 'start')
      .text(d => d)

    axis.selectAll('text.col')
      .data(symbols)
      .join('text')
      .attr('transform', (_, i) => `translate(${(i + 1.5) * cellSize}, ${cellSize - 6}) rotate(-45)`) 
      .attr('text-anchor', 'end')
      .text(d => d)
  }, [symbols, matrix, size])

  return <svg ref={ref} className="w-full h-auto" />
}