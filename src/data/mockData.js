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
      weight: '540 kg'
    }
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
      weight: '85 kg'
    }
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
      weight: '2.5 kg'
    }
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
      weight: '1.2 kg'
    }
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
      weight: '12 kg'
    }
  }
];

export const dashboardStats = [
  {
    title: 'Total Parts',
    value: '1,247',
    change: '+12%',
    changeType: 'positive',
    icon: 'Package'
  },
  {
    title: 'Low Stock Items',
    value: '23',
    change: '-8%',
    changeType: 'negative',
    icon: 'AlertTriangle'
  },
  {
    title: 'Orders This Month',
    value: '342',
    change: '+23%',
    changeType: 'positive',
    icon: 'ShoppingCart'
  },
  {
    title: 'Efficiency Score',
    value: '94%',
    change: '+2%',
    changeType: 'positive',
    icon: 'TrendingUp'
  }
];

export const productionSchedule = [
  {
    id: 1,
    model: 'Model X Pro',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    status: 'In Progress',
    progress: 65,
    team: 'Team Alpha',
    priority: 'High'
  },
  {
    id: 2,
    model: 'Model S Standard',
    startDate: '2024-01-22',
    endDate: '2024-01-28',
    status: 'Scheduled',
    progress: 0,
    team: 'Team Beta',
    priority: 'Medium'
  },
  {
    id: 3,
    model: 'Model Y Compact',
    startDate: '2024-01-18',
    endDate: '2024-01-24',
    status: 'Completed',
    progress: 100,
    team: 'Team Gamma',
    priority: 'High'
  }
];

export const aiInsights = [
  {
    id: 1,
    type: 'warning',
    title: 'Battery Pack Stock Alert',
    message: 'Battery pack inventory is running low. Recommend ordering 150 units within the next 5 days.',
    timestamp: '2024-01-15T10:30:00Z',
    confidence: 92
  },
  {
    id: 2,
    type: 'info',
    title: 'Seasonal Demand Prediction',
    message: 'Electric motor demand expected to increase by 25% in Q2 based on historical data.',
    timestamp: '2024-01-15T09:15:00Z',
    confidence: 85
  },
  {
    id: 3,
    type: 'success',
    title: 'Optimization Opportunity',
    message: 'Implementing just-in-time delivery for charging ports could reduce storage costs by 18%.',
    timestamp: '2024-01-15T08:45:00Z',
    confidence: 78
  }
];

export default {
  evParts,
  dashboardStats,
  productionSchedule,
  aiInsights
};