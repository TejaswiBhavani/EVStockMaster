# Analytics UX Redesign Brief - Phase 1

## Overview
Revamp the Analytics UX to make the EV supply chain flow understandable at a glance, filterable, and accessible. This document outlines the Phase 1 implementation requirements and acceptance criteria.

## Current State
The existing Analytics page displays a large Sankey diagram with minimal context and controls, making it difficult to understand the flow and appear cluttered.

## Goals
1. Improve visual hierarchy and information architecture
2. Add filtering and interaction capabilities  
3. Enhance accessibility and usability
4. Maintain performance with existing tech stack

## Phase 1 Scope

### 1. Page Structure and Information Architecture
- **Sticky Global Filter Bar**: Time placeholder, Materials chips, OEMs chips, min-link threshold slider, Reset button
- **KPI Row**: Total Volume, # OEMs, Top Material, Last Updated (clickable-ready, no-op in P1)
- **Tab Navigation**: Supply Chain Flow (Sankey), Correlations (existing heatmap), Trends (placeholder)
- **Design**: Light, neutral surfaces; clear dividers; avoid heavy gradients

### 2. D3 Sankey Enhancements
- **Color Coding**: Links colored by source material category with consistent palette
- **Readability**: Proper label truncation and tooltips with exact values
- **Interactions**: 
  - Hover focus emphasizes hovered node/link and adjacency, de-emphasizes others
  - Click selection locks selection and emits onSelect callback
- **Legend**: Material color mapping
- **Export**: CSV for link data, SVG export (PNG optional in Phase 2)
- **Filtering**: Configurable min link percentage to reduce clutter (group small links as "Other")
- **Accessibility**: SVG role="img" with aria-label, focusable nodes with tabindex=0

### 3. Utility Functions
- Data filtering helpers (by materials and OEMs)
- KPI computation functions
- Export format handlers

## Technical Specifications

### Color Palette (Color-blind Aware)
- **Lithium**: #1f77b4
- **Cobalt**: #9467bd  
- **Nickel**: #2ca02c
- **Other**: #8c8c8c

### Technology Constraints
- Keep existing React/Vite, Tailwind CSS, d3-sankey stack
- No new heavy dependencies
- Maintain existing sample data structure

### File Structure
```
src/
├── components/
│   ├── analytics/
│   │   ├── FilterBar.jsx          # New: Global filter controls
│   │   ├── KPICard.jsx           # New: Individual KPI display
│   │   ├── KPIRow.jsx            # New: KPI container row
│   │   ├── Tabs.jsx              # New: Accessible tab navigation
│   │   └── Legend.jsx            # New: Material color legend
│   └── supplychain/
│       └── SupplyChainSankey.jsx # Enhanced: All Sankey improvements
├── pages/
│   └── AnalyticsPage.jsx         # Refactored: Integration layer
└── utils/
    └── sankeyUtils.js            # New: Data processing helpers
```

## Acceptance Criteria

### Layout & Navigation
- [ ] Sticky filter bar remains visible on scroll
- [ ] KPI row displays directly beneath filter bar
- [ ] Tabs switch views without page reload
- [ ] Responsive design maintains usability at 1440px+

### Sankey Visualization
- [ ] Legend renders with material color mapping
- [ ] Hover highlights node/link adjacency, dims others
- [ ] Click selects and locks path selection
- [ ] Labels readable without overlap at default zoom
- [ ] Tooltips show exact values and percentage of total
- [ ] CSV export downloads visible link data

### Filtering & Interaction
- [ ] Material/OEM chips affect Sankey display
- [ ] Reset button restores default state
- [ ] Min-link threshold affects visible links (groups small as "Other")
- [ ] All interactions respond within 100ms on sample dataset

### Accessibility (Partial)
- [ ] All controls keyboard operable
- [ ] SVG has descriptive aria-label
- [ ] Chart region has skip link target
- [ ] Focus indicators visible and logical

### Performance
- [ ] Hover tooltips render smoothly on sample dataset
- [ ] Tab switching completes within 200ms
- [ ] Filter application updates within 500ms

## Phase 2+ Out of Scope
- Right-side details drawer with data table
- Full keyboard graph traversal
- Advanced ARIA roles and descriptions
- Performance workers for massive graphs
- WebGL hybrid rendering
- PNG export functionality

## Testing Strategy
- **Manual Testing**: Verify all interactions, exports, and accessibility features
- **Unit Testing**: Utils functions for filtering and KPI computations
- **Integration Testing**: Component integration and data flow
- **Performance Testing**: Interaction responsiveness on sample data

## Implementation Notes
- Follow existing code style and patterns
- Add TODO comments for Phase 2 features
- Keep changes incremental and readable
- Maintain backward compatibility with existing data