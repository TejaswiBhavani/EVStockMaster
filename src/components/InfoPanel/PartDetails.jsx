import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Truck,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Info
} from 'lucide-react';
import { evParts } from '../../data/mockData';

const PartDetails = ({ partId }) => {
  const part = evParts.find(p => p.id === partId);

  if (!part) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Select a part to view details</p>
        </div>
      </div>
    );
  }

  const getHealthIcon = (health) => {
    const icons = {
      'excellent': CheckCircle,
      'good': CheckCircle,
      'warning': AlertTriangle,
      'critical': AlertTriangle
    };
    return icons[health] || CheckCircle;
  };

  const getHealthColor = (health) => {
    const colors = {
      'excellent': 'text-green-600 bg-green-100',
      'good': 'text-blue-600 bg-blue-100',
      'warning': 'text-yellow-600 bg-yellow-100',
      'critical': 'text-red-600 bg-red-100'
    };
    return colors[health] || 'text-gray-600 bg-gray-100';
  };

  const getStockStatus = () => {
    if (part.stock <= part.minStock * 0.5) return { status: 'Critical', color: 'text-red-600 bg-red-100' };
    if (part.stock <= part.minStock) return { status: 'Low', color: 'text-yellow-600 bg-yellow-100' };
    if (part.stock >= part.maxStock * 0.8) return { status: 'High', color: 'text-blue-600 bg-blue-100' };
    return { status: 'Normal', color: 'text-green-600 bg-green-100' };
  };

  const HealthIcon = getHealthIcon(part.health);
  const healthColor = getHealthColor(part.health);
  const stockStatus = getStockStatus();
  const stockPercentage = (part.stock / part.maxStock) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-200">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-electric-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{part.name}</h2>
        <p className="text-gray-500 mt-1">Part ID: {part.id.toUpperCase()}</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Stock Level</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
              {stockStatus.status}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{part.stock}</div>
          <div className="text-sm text-gray-500">of {part.maxStock} max</div>
          
          {/* Stock Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stockPercentage}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={`h-2 rounded-full ${
                  stockPercentage <= 25 ? 'bg-red-500' :
                  stockPercentage <= 50 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Health Status</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${healthColor}`}>
              <HealthIcon className="w-3 h-3 inline mr-1" />
              {part.health}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {part.health === 'excellent' ? '100%' :
             part.health === 'good' ? '85%' :
             part.health === 'warning' ? '65%' : '30%'}
          </div>
          <div className="text-sm text-gray-500">Quality score</div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Info className="w-5 h-5 mr-2 text-primary-600" />
          Part Information
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Location</span>
            </div>
            <span className="text-sm text-gray-900">{part.location}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Unit Cost</span>
            </div>
            <span className="text-sm text-gray-900">₹{part.cost.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Supplier</span>
            </div>
            <span className="text-sm text-gray-900">{part.supplier}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Last Checked</span>
            </div>
            <span className="text-sm text-gray-900">{part.lastChecked}</span>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
          Specifications
        </h3>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          {Object.entries(part.specifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-sm text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          Reorder Stock
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          View History
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PartDetails;