// Mock data for EV parts and inventory
export const evParts = [
  {
    id: 'battery',
    name: 'Battery Pack',
    stock: 12,
    minStock: 5,
    maxStock: 50,
    health: 'excellent',
    lastChecked: '2025-01-24',
    supplier: 'BatteryTech Ltd',
    cost: 15000,
    location: 'Warehouse A-1',
    specifications: {
      capacity: '40.5 kWh',
      voltage: '350V',
      weight: '348 kg',
      warranty: '8 years'
    }
  },
  {
    id: 'motor',
    name: 'Electric Motor',
    stock: 8,
    minStock: 3,
    maxStock: 25,
    health: 'good',
    lastChecked: '2025-01-23',
    supplier: 'MotorCorp India',
    cost: 8500,
    location: 'Warehouse B-2',
    specifications: {
      power: '129 PS',
      torque: '245 Nm',
      type: 'Permanent Magnet Synchronous',
      efficiency: '95%'
    }
  },
  {
    id: 'chassis',
    name: 'Chassis Frame',
    stock: 15,
    minStock: 8,
    maxStock: 30,
    health: 'excellent',
    lastChecked: '2025-01-24',
    supplier: 'SteelWorks Pvt Ltd',
    cost: 12000,
    location: 'Warehouse C-1',
    specifications: {
      material: 'High-strength steel',
      weight: '280 kg',
      length: '3993 mm',
      width: '1811 mm'
    }
  },
  {
    id: 'wheels',
    name: 'Alloy Wheels',
    stock: 32,
    minStock: 20,
    maxStock: 80,
    health: 'good',
    lastChecked: '2025-01-22',
    supplier: 'WheelTech Solutions',
    cost: 2500,
    location: 'Warehouse D-3',
    specifications: {
      size: '16 inch',
      material: 'Aluminum alloy',
      weight: '18 kg each',
      finish: 'Diamond cut'
    }
  },
  {
    id: 'dashboard',
    name: 'Digital Dashboard',
    stock: 6,
    minStock: 10,
    maxStock: 25,
    health: 'warning',
    lastChecked: '2025-01-21',
    supplier: 'TechDisplay Inc',
    cost: 3500,
    location: 'Warehouse E-1',
    specifications: {
      screen: '10.25 inch TFT',
      resolution: '1920x720',
      connectivity: 'Android Auto, Apple CarPlay',
      features: 'Voice commands, Navigation'
    }
  },
  {
    id: 'seats',
    name: 'Premium Seats',
    stock: 4,
    minStock: 12,
    maxStock: 40,
    health: 'critical',
    lastChecked: '2025-01-20',
    supplier: 'ComfortSeats Ltd',
    cost: 4200,
    location: 'Warehouse F-2',
    specifications: {
      material: 'Premium leatherette',
      features: 'Height adjustment, Lumbar support',
      color: 'Dual tone',
      ventilation: 'Available'
    }
  }
];

export const productionSchedule = [
  {
    id: 1,
    model: 'Nexon EV Max',
    quantity: 150,
    startDate: '2025-01-25',
    endDate: '2025-01-30',
    status: 'scheduled',
    priority: 'high'
  },
  {
    id: 2,
    model: 'Tigor EV',
    quantity: 100,
    startDate: '2025-01-28',
    endDate: '2025-02-02',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: 3,
    model: 'Nexon EV Prime',
    quantity: 200,
    startDate: '2025-02-01',
    endDate: '2025-02-08',
    status: 'planned',
    priority: 'high'
  }
];

export const aiInsights = {
  overall: {
    confidence: 94,
    summary: "Inventory levels are generally healthy with 2 critical alerts requiring immediate attention. Battery pack supply is optimal, but seat inventory needs urgent restocking.",
    recommendations: [
      "Reorder premium seats immediately - current stock below minimum threshold",
      "Schedule dashboard component delivery within 5 days",
      "Battery pack levels are excellent - no action needed",
      "Consider increasing motor inventory buffer for upcoming production"
    ]
  },
  partSpecific: {
    battery: {
      confidence: 98,
      summary: "Battery pack inventory is in excellent condition with optimal stock levels. Recent quality checks show 100% pass rate.",
      recommendations: [
        "Current stock sufficient for next 3 weeks of production",
        "Quality metrics exceed industry standards",
        "Consider negotiating bulk pricing for next quarter"
      ]
    },
    motor: {
      confidence: 92,
      summary: "Electric motor stock is adequate but approaching reorder point. Quality remains consistent.",
      recommendations: [
        "Schedule reorder within 10 days",
        "Monitor production demand closely",
        "Supplier delivery time is reliable at 7 days"
      ]
    },
    chassis: {
      confidence: 96,
      summary: "Chassis frame inventory is well-stocked with excellent quality metrics.",
      recommendations: [
        "Stock levels optimal for current production",
        "Quality control passing at 99.2%",
        "No immediate action required"
      ]
    },
    wheels: {
      confidence: 89,
      summary: "Wheel inventory is healthy with good stock rotation.",
      recommendations: [
        "Current stock sufficient for 2 weeks",
        "Monitor for seasonal demand variations",
        "Consider alternative suppliers for cost optimization"
      ]
    },
    dashboard: {
      confidence: 85,
      summary: "Dashboard components showing warning levels. Quality is good but stock needs attention.",
      recommendations: [
        "Reorder within 5 days to avoid stockout",
        "Current supplier has 3-day lead time",
        "Consider increasing safety stock levels"
      ]
    },
    seats: {
      confidence: 91,
      summary: "Critical stock shortage detected. Immediate action required to prevent production delays.",
      recommendations: [
        "URGENT: Place emergency order today",
        "Contact backup suppliers for faster delivery",
        "Review minimum stock levels policy"
      ]
    }
  }
};

export const dashboardStats = {
  totalParts: 6,
  lowStock: 2,
  criticalAlerts: 1,
  totalValue: 2840000,
  efficiency: 87,
  lastUpdated: '2025-01-24T10:30:00Z'
};