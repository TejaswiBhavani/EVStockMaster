import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Truck,
  Battery,
  Clock,
  CheckCircle
} from 'lucide-react';

// Simple Sparkline Component
const Sparkline = ({ data, color = '#3B82F6', width = 80, height = 30 }) => {
  const pathData = useMemo(() => {
    if (!data || data.length < 2) return '';
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    return data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [data, width, height]);

  if (!data || data.length < 2) {
    return <div className="w-20 h-8 bg-gray-100 rounded"></div>;
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      
      {/* Fill area */}
      <path
        d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
      
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Points */}
      {data.map((value, index) => {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            className="opacity-0 hover:opacity-100 transition-opacity"
          />
        );
      })}
    </svg>
  );
};

// KPI Card Component
const KPICard = ({ 
  title, 
  value, 
  trend, 
  trendData = [], 
  icon: Icon, 
  color = 'blue', 
  prefix = '', 
  suffix = '',
  description = '',
  alert = null
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      light: 'bg-blue-50',
      sparkline: '#3B82F6'
    },
    green: {
      bg: 'from-green-500 to-green-600',
      text: 'text-green-600',
      light: 'bg-green-50',
      sparkline: '#10B981'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      light: 'bg-purple-50',
      sparkline: '#8B5CF6'
    },
    amber: {
      bg: 'from-amber-500 to-amber-600',
      text: 'text-amber-600',
      light: 'bg-amber-50',
      sparkline: '#F59E0B'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      text: 'text-red-600',
      light: 'bg-red-50',
      sparkline: '#EF4444'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 relative overflow-hidden"
    >
      {/* Alert indicator */}
      {alert && (
        <div className="absolute top-4 right-4">
          <div className={`w-3 h-3 rounded-full ${alert.type === 'warning' ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`}></div>
        </div>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${colors.text}`} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

      {/* Value */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="text-3xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </span>
          {trend && (
            <div className={`flex items-center mt-1 ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'transform rotate-180' : ''}`} />
              <span className="text-sm font-medium">
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>

        {/* Sparkline */}
        {trendData.length > 0 && (
          <div className="flex-shrink-0">
            <Sparkline data={trendData} color={colors.sparkline} />
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* Alert message */}
      {alert && (
        <div className={`mt-3 p-2 rounded-lg ${
          alert.type === 'warning' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium">{alert.message}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Main KPI Dashboard Component
const KPIDashboard = ({ className = "", isOverlay = false }) => {
  const [kpiData, setKpiData] = useState({
    totalParts: { value: 0, trend: 0, data: [] },
    stockValue: { value: 0, trend: 0, data: [] },
    lowStock: { value: 0, trend: 0, data: [] },
    turnover: { value: 0, trend: 0, data: [] },
    nextRestock: { value: 0, trend: 0, data: [] },
    efficiency: { value: 0, trend: 0, data: [] }
  });

  // Simulate real-time data updates
  useEffect(() => {
    const generateTrendData = (baseValue, variance = 0.1) => {
      return Array.from({ length: 12 }, (_, i) => {
        const variation = (Math.random() - 0.5) * variance;
        return Math.max(0, baseValue * (1 + variation + Math.sin(i * 0.5) * 0.1));
      });
    };

    const updateData = () => {
      setKpiData({
        totalParts: {
          value: 15847,
          trend: 5.2,
          data: generateTrendData(15000, 0.05)
        },
        stockValue: {
          value: 2450000,
          trend: 3.8,
          data: generateTrendData(2400000, 0.08)
        },
        lowStock: {
          value: 23,
          trend: -12.5,
          data: generateTrendData(25, 0.3)
        },
        turnover: {
          value: 4.2,
          trend: 8.1,
          data: generateTrendData(4, 0.15)
        },
        nextRestock: {
          value: 3,
          trend: 0,
          data: generateTrendData(3, 0.1)
        },
        efficiency: {
          value: 94.5,
          trend: 2.1,
          data: generateTrendData(93, 0.02)
        }
      });
    };

    updateData();
    const interval = setInterval(updateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const kpis = [
    {
      id: 'total-parts',
      title: 'Total Parts',
      value: kpiData.totalParts.value,
      trend: kpiData.totalParts.trend,
      trendData: kpiData.totalParts.data,
      icon: Package,
      color: 'blue',
      description: 'All parts across inventory'
    },
    {
      id: 'stock-value',
      title: 'Stock Value',
      value: kpiData.stockValue.value,
      trend: kpiData.stockValue.trend,
      trendData: kpiData.stockValue.data,
      icon: DollarSign,
      color: 'green',
      prefix: '$',
      description: 'Total inventory valuation'
    },
    {
      id: 'low-stock',
      title: 'Low Stock Items',
      value: kpiData.lowStock.value,
      trend: kpiData.lowStock.trend,
      trendData: kpiData.lowStock.data,
      icon: AlertTriangle,
      color: 'amber',
      description: 'Items below minimum threshold',
      alert: kpiData.lowStock.value > 20 ? {
        type: 'warning',
        message: 'Review stock levels'
      } : null
    },
    {
      id: 'turnover',
      title: 'Turnover Rate',
      value: kpiData.turnover.value,
      trend: kpiData.turnover.trend,
      trendData: kpiData.turnover.data,
      icon: TrendingUp,
      color: 'purple',
      suffix: 'x',
      description: 'Inventory turnover ratio'
    },
    {
      id: 'next-restock',
      title: 'Next Restock',
      value: kpiData.nextRestock.value,
      trend: kpiData.nextRestock.trend,
      trendData: kpiData.nextRestock.data,
      icon: Truck,
      color: 'blue',
      suffix: ' days',
      description: 'Upcoming delivery schedule'
    },
    {
      id: 'efficiency',
      title: 'Efficiency',
      value: kpiData.efficiency.value,
      trend: kpiData.efficiency.trend,
      trendData: kpiData.efficiency.data,
      icon: CheckCircle,
      color: 'green',
      suffix: '%',
      description: 'Overall system efficiency'
    }
  ];

  const containerClasses = isOverlay 
    ? "absolute top-4 right-4 max-w-md"
    : "w-full max-w-6xl mx-auto";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${containerClasses} ${className}`}
    >
      {!isOverlay && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Real-time Dashboard
          </h2>
          <p className="text-gray-600">Live inventory metrics and performance indicators</p>
        </div>
      )}

      <div className={`grid gap-6 ${
        isOverlay 
          ? "grid-cols-1" 
          : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      }`}>
        {(isOverlay ? kpis.slice(0, 3) : kpis).map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Last updated indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-center"
      >
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default KPIDashboard;