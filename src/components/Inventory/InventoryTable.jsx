import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package
} from 'lucide-react';
import { evParts } from '../../data/mockData';

const InventoryTable = ({ onPartSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const getHealthIcon = (health) => {
    const icons = {
      'excellent': CheckCircle,
      'good': CheckCircle,
      'warning': AlertTriangle,
      'critical': XCircle
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

  const getStockStatus = (part) => {
    if (part.stock <= part.minStock * 0.5) return 'critical';
    if (part.stock <= part.minStock) return 'warning';
    if (part.stock >= part.maxStock * 0.8) return 'high';
    return 'normal';
  };

  const getStockColor = (status) => {
    const colors = {
      'critical': 'text-red-700 bg-red-100',
      'warning': 'text-yellow-700 bg-yellow-100',
      'high': 'text-blue-700 bg-blue-100',
      'normal': 'text-green-700 bg-green-100'
    };
    return colors[status] || 'text-gray-700 bg-gray-100';
  };

  const filteredParts = evParts
    .filter(part => 
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Inventory Management</h2>
            <p className="text-sm text-gray-500 mt-1">Monitor and manage EV component stock levels</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search parts, suppliers, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Part</span>
                  {sortBy === 'name' && (
                    <span className="text-primary-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Stock</span>
                  {sortBy === 'stock' && (
                    <span className="text-primary-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('supplier')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Supplier</span>
                  {sortBy === 'supplier' && (
                    <span className="text-primary-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('cost')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Cost</span>
                  {sortBy === 'cost' && (
                    <span className="text-primary-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParts.map((part, index) => {
              const HealthIcon = getHealthIcon(part.health);
              const healthColor = getHealthColor(part.health);
              const stockStatus = getStockStatus(part);
              const stockColor = getStockColor(stockStatus);
              
              return (
                <motion.tr
                  key={part.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-electric-500 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.name}</div>
                        <div className="text-sm text-gray-500">{part.location}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{part.stock}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockColor}`}>
                        {stockStatus}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Min: {part.minStock} | Max: {part.maxStock}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${healthColor}`}>
                      <HealthIcon className="w-3 h-3 mr-1" />
                      {part.health}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{part.supplier}</div>
                    <div className="text-sm text-gray-500">Last checked: {part.lastChecked}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{part.cost.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per unit</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onPartSelect(part.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredParts.length} of {evParts.length} parts
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;