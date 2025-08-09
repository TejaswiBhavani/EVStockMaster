import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Package, 
  MapPin, 
  DollarSign, 
  Truck, 
  Calendar,
  Wrench,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Info,
  Download,
  Edit,
  RotateCcw
} from 'lucide-react';

// Simple sparkline component for trends
const MiniSparkline = ({ data, color = '#3B82F6', width = 100, height = 30 }) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={data.length > 0 ? ((data.length - 1) / (data.length - 1)) * width : 0}
        cy={data.length > 0 ? height - ((data[data.length - 1] - min) / range) * height : 0}
        r="3"
        fill={color}
      />
    </svg>
  );
};

// Action button component
const ActionButton = ({ icon: Icon, label, onClick, variant = 'default', disabled = false }) => {
  const variants = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${variants[variant]}
      `}
    >
      <Icon size={16} />
      <span>{label}</span>
    </motion.button>
  );
};

// Specification row component
const SpecRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-3">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

// Main InspectorDrawer Component
const InspectorDrawer = ({ 
  isOpen, 
  onClose, 
  selectedPart, 
  className = "",
  onUpdateStock,
  onOrderMore,
  onMarkMaintenance 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!selectedPart) return null;

  // Calculate stock status and health
  const stockPercentage = (selectedPart.stock / (selectedPart.minStock * 2)) * 100;
  const isLowStock = selectedPart.stock < selectedPart.minStock;
  const isCriticalStock = selectedPart.stock < selectedPart.minStock * 0.5;
  
  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-amber-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'excellent': 
      case 'good': 
        return CheckCircle;
      case 'warning': 
      case 'critical': 
        return AlertTriangle;
      default: 
        return Info;
    }
  };

  const HealthIcon = getHealthIcon(selectedPart.health);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'history', label: 'History' },
    { id: 'actions', label: 'Actions' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`
              fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-lg
              shadow-2xl border-l border-white/20 z-50 overflow-hidden
              lg:relative lg:max-w-none lg:w-96
              ${className}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <selectedPart.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedPart.name}</h2>
                  <p className="text-sm text-gray-600">Part Inspector</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Status Banner */}
            <div className={`px-6 py-4 ${
              isCriticalStock 
                ? 'bg-red-50 border-b border-red-100' 
                : isLowStock 
                  ? 'bg-amber-50 border-b border-amber-100'
                  : 'bg-green-50 border-b border-green-100'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HealthIcon className={`w-5 h-5 ${getHealthColor(selectedPart.health)}`} />
                  <div>
                    <div className="font-medium text-gray-900 capitalize">
                      {isCriticalStock ? 'Critical Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedPart.stock} of {selectedPart.minStock} minimum
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{selectedPart.stock}</div>
                  <div className="text-xs text-gray-500">units</div>
                </div>
              </div>
              
              {/* Stock level bar */}
              <div className="mt-3">
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isCriticalStock 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : isLowStock 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, stockPercentage))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all
                      ${activeTab === tab.id 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedPart.description}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Unit Cost</div>
                        <div className="text-lg font-bold text-gray-900">
                          ${selectedPart.cost.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Total Value</div>
                        <div className="text-lg font-bold text-gray-900">
                          ${(selectedPart.cost * selectedPart.stock).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Trend */}
                  {selectedPart.trend && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Performance Trend</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600">Last 12 periods</span>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">+5.2%</span>
                          </div>
                        </div>
                        <MiniSparkline data={selectedPart.trend} color="#10B981" width={200} height={40} />
                      </div>
                    </div>
                  )}

                  {/* Location & Supplier */}
                  <div className="space-y-3">
                    <SpecRow label="Location" value={selectedPart.location} icon={MapPin} />
                    <SpecRow label="Supplier" value={selectedPart.supplier} icon={Truck} />
                    <SpecRow label="Last Updated" value={selectedPart.lastUpdated} icon={Calendar} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Technical Specifications</h3>
                  {selectedPart.specifications && Object.entries(selectedPart.specifications).map(([key, value]) => (
                    <SpecRow 
                      key={key} 
                      label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} 
                      value={value} 
                    />
                  ))}
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Stock replenished', details: '+15 units', time: '2 hours ago', type: 'success' },
                      { action: 'Maintenance scheduled', details: 'Routine inspection', time: '1 day ago', type: 'info' },
                      { action: 'Low stock alert', details: 'Below minimum threshold', time: '3 days ago', type: 'warning' },
                      { action: 'Quality check passed', details: 'All parameters normal', time: '1 week ago', type: 'success' }
                    ].map((event, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          event.type === 'success' ? 'bg-green-400' :
                          event.type === 'warning' ? 'bg-amber-400' :
                          event.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{event.action}</div>
                          <div className="text-xs text-gray-600">{event.details}</div>
                          <div className="text-xs text-gray-500 mt-1">{event.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'actions' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <ActionButton
                        icon={Package}
                        label="Update Stock Level"
                        onClick={() => onUpdateStock && onUpdateStock(selectedPart)}
                        variant="primary"
                      />
                      <ActionButton
                        icon={Truck}
                        label="Order More Units"
                        onClick={() => onOrderMore && onOrderMore(selectedPart)}
                        variant="success"
                      />
                      <ActionButton
                        icon={Wrench}
                        label="Schedule Maintenance"
                        onClick={() => onMarkMaintenance && onMarkMaintenance(selectedPart)}
                        variant="warning"
                      />
                      <ActionButton
                        icon={Download}
                        label="Export Report"
                        onClick={() => console.log('Export report for', selectedPart.name)}
                        variant="default"
                      />
                    </div>
                  </div>

                  {/* Emergency Actions */}
                  {(isLowStock || isCriticalStock) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Emergency Actions</h3>
                      <div className="space-y-3">
                        <ActionButton
                          icon={AlertTriangle}
                          label="Rush Order"
                          onClick={() => console.log('Rush order for', selectedPart.name)}
                          variant="danger"
                        />
                        <ActionButton
                          icon={RotateCcw}
                          label="Find Alternative Supplier"
                          onClick={() => console.log('Find alternative supplier for', selectedPart.name)}
                          variant="warning"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InspectorDrawer;