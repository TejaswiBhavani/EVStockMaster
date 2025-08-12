import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  MapPin,
  DollarSign,
  Calendar,
  Truck,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Info,
  AlertTriangle,
  Phone,
  Mail,
  Star,
  Clock,
  BarChart3
} from 'lucide-react'
import { PartService } from '../../services/partService'

const PartDetails = ({ partId }) => {
  const [partData, setPartData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!partId) {
      setPartData(null)
      return
    }

    const loadPartAnalytics = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await PartService.getPartAnalytics(partId)
        if (response.success) {
          setPartData(response.data)
        } else {
          setError(response.error)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPartAnalytics()
  }, [partId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading part analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!partData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Select a TATA EV part to view analytics</p>
        </div>
      </div>
    )
  }

  const { realTimeData, supplierDetails } = partData
  const stockPercentage = Math.max(5, (partData.currentStock / (partData.minimumStock * 3)) * 100)
  
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'CRITICAL': return 'text-red-600'
      case 'DECLINING': return 'text-yellow-600' 
      case 'STABLE': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'CRITICAL': return AlertTriangle
      case 'DECLINING': return TrendingDown
      case 'STABLE': return CheckCircle
      default: return Info
    }
  }

  const TrendIcon = getTrendIcon(realTimeData.trend)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* TATA Part Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{partData.name}</h3>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-600">{partData.id}</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {partData.category}
                </span>
              </div>
            </div>
          </div>
          {partData.urgentAlert && (
            <div className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>URGENT</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Stock Analytics */}
      <div className="modern-card p-4">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <span>Live Stock Analytics</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{realTimeData.stockLevel}</div>
            <div className="text-sm text-gray-600">Current Stock</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTrendColor(realTimeData.trend)}`}>
              {realTimeData.daysUntilReorder}
            </div>
            <div className="text-sm text-gray-600">Days to Reorder</div>
          </div>
        </div>

        {/* Stock Level Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              realTimeData.trend === 'CRITICAL' ? 'bg-red-500' :
              realTimeData.trend === 'DECLINING' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${stockPercentage}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className={`flex items-center space-x-1 ${getTrendColor(realTimeData.trend)}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="font-medium">{realTimeData.trend}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            realTimeData.reorderStatus === 'URGENT' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {realTimeData.reorderStatus}
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="modern-card p-4">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary-600" />
          <span>Usage Patterns</span>
        </h4>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{realTimeData.usage.daily}</div>
            <div className="text-xs text-gray-600">Daily</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{realTimeData.usage.weekly}</div>
            <div className="text-xs text-gray-600">Weekly</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{realTimeData.usage.monthly}</div>
            <div className="text-xs text-gray-600">Monthly</div>
          </div>
        </div>
      </div>

      {/* Cost Information */}
      <div className="modern-card p-4">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-primary-600" />
          <span>Cost Analysis</span>
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Unit Cost</span>
            <span className="font-medium">₹{realTimeData.cost.unitCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Value</span>
            <span className="font-medium">₹{realTimeData.cost.totalValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly Spend</span>
            <span className="font-medium">₹{realTimeData.cost.monthlySpend.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* TATA Supplier Details */}
      <div className="modern-card p-4">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Truck className="w-5 h-5 text-primary-600" />
          <span>TATA Supplier Network</span>
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{supplierDetails.name}</div>
              <div className="text-sm text-gray-600 flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{supplierDetails.contact.location}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{supplierDetails.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-gray-600">Delivery Time</div>
              <div className="font-medium">{supplierDetails.deliveryTime}</div>
            </div>
            <div>
              <div className="text-gray-600">Reliability</div>
              <div className="font-medium">{supplierDetails.reliability}</div>
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{supplierDetails.contact.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-3 h-3" />
              <span>{supplierDetails.contact.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part Specifications */}
      <div className="modern-card p-4">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Info className="w-5 h-5 text-primary-600" />
          <span>Technical Specifications</span>
        </h4>
        
        <div className="space-y-3">
          {Object.entries(partData.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <p className="text-sm text-gray-600">{partData.description}</p>
        </div>
      </div>

      {/* Last Movement */}
      <div className="modern-card p-4">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          <span>Recent Activity</span>
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Last Movement</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              realTimeData.lastMovement.type === 'OUT' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {realTimeData.lastMovement.type} ({realTimeData.lastMovement.quantity})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Last Updated</span>
            <span className="text-sm font-medium">
              {new Date(realTimeData.lastMovement.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PartDetails