// Mock data for the EV Inventory Management System

export const evParts = [
  {
    id: 'battery',
    name: 'Lithium-Ion Battery Pack',
    category: 'Power System',
    currentStock: 245,
    minimumStock: 100,
    price: 8500,
    supplier: 'Tesla Energy',
    lastUpdated: '2024-01-15',
    status: 'In Stock',
    description: 'High-capacity lithium-ion battery pack for electric vehicles',
    specifications: {
      capacity: '75 kWh',
      voltage: '400V',
      weight: '540 kg',
    },
  },
  {
    id: 'motor',
    name: 'Electric Motor',
    category: 'Drivetrain',
    currentStock: 180,
    minimumStock: 75,
    price: 3200,
    supplier: 'Bosch Automotive',
    lastUpdated: '2024-01-14',
    status: 'In Stock',
    description: 'High-efficiency electric motor for vehicle propulsion',
    specifications: {
      power: '150 kW',
      torque: '310 Nm',
      weight: '85 kg',
    },
  },
  {
    id: 'charging-port',
    name: 'Fast Charging Port',
    category: 'Charging System',
    currentStock: 320,
    minimumStock: 150,
    price: 450,
    supplier: 'ChargePoint Inc.',
    lastUpdated: '2024-01-13',
    status: 'In Stock',
    description: 'CCS Type 2 fast charging port',
    specifications: {
      maxPower: '150 kW',
      voltage: '800V',
      weight: '2.5 kg',
    },
  },
  {
    id: 'control-unit',
    name: 'Vehicle Control Unit',
    category: 'Electronics',
    currentStock: 90,
    minimumStock: 50,
    price: 1200,
    supplier: 'Continental AG',
    lastUpdated: '2024-01-12',
    status: 'Low Stock',
    description: 'Central control unit for vehicle systems',
    specifications: {
      processor: 'ARM Cortex-A78',
      memory: '16 GB',
      weight: '1.2 kg',
    },
  },
  {
    id: 'cooling-system',
    name: 'Battery Cooling System',
    category: 'Thermal Management',
    currentStock: 160,
    minimumStock: 80,
    price: 850,
    supplier: 'Valeo Thermal',
    lastUpdated: '2024-01-11',
    status: 'In Stock',
    description: 'Liquid cooling system for battery thermal management',
    specifications: {
      coolant: 'Glycol-based',
      flowRate: '15 L/min',
      weight: '12 kg',
    },
  },
]

export const dashboardStats = [
  {
    title: 'Total Parts',
    value: '1,247',
    change: '+12%',
    changeType: 'positive',
    icon: 'Package',
  },
  {
    title: 'Low Stock Items',
    value: '23',
    change: '-8%',
    changeType: 'negative',
    icon: 'AlertTriangle',
  },
  {
    title: 'Orders This Month',
    value: '342',
    change: '+23%',
    changeType: 'positive',
    icon: 'ShoppingCart',
  },
  {
    title: 'Efficiency Score',
    value: '94%',
    change: '+2%',
    changeType: 'positive',
    icon: 'TrendingUp',
  },
]

export const productionSchedule = [
  {
    id: 1,
    model: 'Model X Pro',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    status: 'In Progress',
    progress: 65,
    team: 'Team Alpha',
    priority: 'High',
  },
  {
    id: 2,
    model: 'Model S Standard',
    startDate: '2024-01-22',
    endDate: '2024-01-28',
    status: 'Scheduled',
    progress: 0,
    team: 'Team Beta',
    priority: 'Medium',
  },
  {
    id: 3,
    model: 'Model Y Compact',
    startDate: '2024-01-18',
    endDate: '2024-01-24',
    status: 'Completed',
    progress: 100,
    team: 'Team Gamma',
    priority: 'High',
  },
]

export const aiInsights = {
  overall: {
    confidence: 94,
    summary:
      'Your EV inventory management system is performing excellently with 94% efficiency. Current stock levels are well-balanced across all major components. The battery pack inventory requires attention within the next week, while electric motor and charging port stocks are optimal for the next 6-8 weeks of production.',
    recommendations: [
      'Place urgent order for 150 battery packs within 5 days to maintain production continuity',
      'Optimize storage layout for charging ports to reduce handling time by 15%',
      'Implement predictive maintenance schedule for cooling systems to prevent unexpected downtime',
      'Consider bulk purchasing agreement with Bosch Automotive for electric motors to reduce unit costs by 8%',
    ],
  },
  partSpecific: {
    battery: {
      confidence: 96,
      summary:
        'Battery pack inventory is at critical threshold with 245 units remaining. Based on current production rate of 25 units per day, stock will be depleted in 9.8 days. Supplier lead time is 8-12 weeks, making immediate action essential.',
      recommendations: [
        'URGENT: Place order for 300 battery packs immediately to cover production needs',
        'Negotiate expedited delivery with Tesla Energy for faster turnaround',
        'Implement temperature monitoring in battery storage area to maintain optimal conditions',
        'Review minimum stock threshold - current 100 units may be too low for 8-week lead times',
      ],
    },
    motor: {
      confidence: 91,
      summary:
        'Electric motor inventory is healthy with 180 units in stock. Current consumption rate is 12 units per day, providing 15 days of coverage. Bosch Automotive has consistent 4-6 week delivery times.',
      recommendations: [
        'Maintain current stock levels - no immediate action required',
        'Schedule next order in 2 weeks for optimal inventory turnover',
        'Explore volume discount opportunities with Bosch for Q2 orders',
        'Verify motor storage conditions to prevent moisture damage',
      ],
    },
    'charging-port': {
      confidence: 88,
      summary:
        'Charging port inventory is well-stocked with 320 units available. Daily usage averages 8 units, providing 40 days of coverage. ChargePoint Inc. has reliable 2-3 week delivery schedule.',
      recommendations: [
        'Current stock levels are optimal for next 6 weeks',
        'Monitor CCS Type 2 compatibility requirements for upcoming model changes',
        'Consider implementing vendor-managed inventory for non-critical charging accessories',
        'Schedule quality inspection for oldest stock to ensure connector integrity',
      ],
    },
    'control-unit': {
      confidence: 85,
      summary:
        'Vehicle control units are approaching minimum threshold with 90 units remaining. These critical components have no substitutes and Continental AG requires 6-8 week lead times.',
      recommendations: [
        'Place order for 100 control units within 72 hours to avoid production delays',
        'Establish backup supplier relationship to reduce dependency risk',
        'Increase minimum stock threshold to 75 units due to long lead times',
        'Implement secure storage protocols for these high-value electronic components',
      ],
    },
    'cooling-system': {
      confidence: 93,
      summary:
        'Battery cooling system inventory is stable with 160 units in stock. Usage rate is 6 units per day, providing 26 days of coverage. Valeo Thermal maintains good delivery performance.',
      recommendations: [
        'Current inventory levels are appropriate for next month',
        'Schedule preventive maintenance check on glycol-based coolant quality',
        'Review seasonal demand patterns - cooling system usage increases 20% in summer',
        'Evaluate opportunities for system integration to reduce component count',
      ],
    },
  },
}

export default {
  evParts,
  dashboardStats,
  productionSchedule,
  aiInsights,
}
