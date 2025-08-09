import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Battery, 
  Zap, 
  Cog, 
  Shield,
  Circle, // Using Circle instead of Wheel
  Car,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

// Parts data with extended information
const PARTS_DATA = [
  {
    id: 'chassis',
    name: 'Chassis & Frame',
    description: 'Advanced carbon fiber chassis with integrated battery mounting points',
    icon: Car,
    image: '/api/placeholder/300/200',
    stock: 12,
    minStock: 5,
    cost: 15000,
    supplier: 'AeroCarbon Industries',
    health: 'excellent',
    lastUpdated: '2 hours ago',
    location: 'Warehouse A-12',
    specifications: {
      material: 'Carbon Fiber Composite',
      weight: '180 kg',
      dimensions: '4.8m x 1.9m x 1.2m',
      certification: 'ISO 26262'
    },
    trend: [85, 87, 82, 90, 88, 91, 89, 93, 90, 92, 89, 94]
  },
  {
    id: 'battery',
    name: 'Battery Pack',
    description: 'High-performance lithium-ion battery system with 100kWh capacity',
    icon: Battery,
    image: '/api/placeholder/300/200',
    stock: 8,
    minStock: 10,
    cost: 25000,
    supplier: 'PowerCell Solutions',
    health: 'good',
    lastUpdated: '1 hour ago',
    location: 'Secure Storage B-5',
    specifications: {
      capacity: '100 kWh',
      chemistry: 'Li-ion NMC',
      voltage: '400V',
      cycleLife: '2000+ cycles'
    },
    trend: [92, 89, 91, 88, 90, 87, 89, 86, 88, 85, 87, 89]
  },
  {
    id: 'motor',
    name: 'Electric Motor',
    description: 'Dual motor setup with 400HP combined output and regenerative braking',
    icon: Zap,
    image: '/api/placeholder/300/200',
    stock: 15,
    minStock: 8,
    cost: 12000,
    supplier: 'ElectroMotors Pro',
    health: 'excellent',
    lastUpdated: '30 minutes ago',
    location: 'Assembly Line C-3',
    specifications: {
      power: '400 HP',
      torque: '500 Nm',
      efficiency: '95%',
      cooling: 'Liquid Cooled'
    },
    trend: [88, 91, 89, 93, 91, 94, 92, 96, 94, 97, 95, 98]
  },
  {
    id: 'charging-port',
    name: 'Charging Port',
    description: 'Fast charging CCS Type 2 connector with 350kW capability',
    icon: Zap,
    image: '/api/placeholder/300/200',
    stock: 25,
    minStock: 15,
    cost: 800,
    supplier: 'ChargeTech Systems',
    health: 'good',
    lastUpdated: '45 minutes ago',
    location: 'Parts Rack D-8',
    specifications: {
      standard: 'CCS Type 2',
      maxPower: '350 kW',
      voltage: '800V DC',
      protection: 'IP67'
    },
    trend: [76, 78, 82, 79, 81, 85, 83, 87, 85, 89, 87, 91]
  },
  {
    id: 'suspension',
    name: 'Suspension System',
    description: 'Adaptive air suspension with dynamic damping control',
    icon: Cog,
    image: '/api/placeholder/300/200',
    stock: 6,
    minStock: 12,
    cost: 8500,
    supplier: 'SuspensionTech Ltd',
    health: 'warning',
    lastUpdated: '4 hours ago',
    location: 'Warehouse E-15',
    specifications: {
      type: 'Air Suspension',
      adjustment: 'Electronic',
      travel: '120mm',
      loadCapacity: '2000 kg'
    },
    trend: [95, 92, 89, 86, 83, 80, 77, 74, 71, 68, 65, 62]
  },
  {
    id: 'wheels',
    name: 'Wheels & Tires',
    description: 'Low rolling resistance tires with regenerative braking integration',
    icon: Circle,
    image: '/api/placeholder/300/200',
    stock: 32,
    minStock: 20,
    cost: 1200,
    supplier: 'EcoTire Dynamics',
    health: 'excellent',
    lastUpdated: '3 hours ago',
    location: 'Tire Storage F-2',
    specifications: {
      size: '245/45 R20',
      type: 'Low Rolling Resistance',
      material: 'Silica Compound',
      warranty: '80,000 km'
    },
    trend: [89, 91, 88, 92, 90, 94, 91, 96, 93, 98, 95, 99]
  }
];

// Health status colors and icons
const getHealthStatus = (health, stock, minStock) => {
  if (stock < minStock) {
    return {
      status: 'critical',
      color: 'red',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    };
  }
  
  switch (health) {
    case 'excellent':
      return {
        status: 'excellent',
        color: 'green',
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        borderColor: 'border-green-200'
      };
    case 'good':
      return {
        status: 'good',
        color: 'blue',
        icon: CheckCircle,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200'
      };
    case 'warning':
      return {
        status: 'warning',
        color: 'amber',
        icon: Clock,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-200'
      };
    default:
      return {
        status: 'unknown',
        color: 'gray',
        icon: Clock,
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-600',
        borderColor: 'border-gray-200'
      };
  }
};

// Individual Part Card Component
const PartCard = ({ part, isSelected, onClick, isHighlighted }) => {
  const healthInfo = getHealthStatus(part.health, part.stock, part.minStock);
  const IconComponent = part.icon;
  const HealthIcon = healthInfo.icon;
  
  return (
    <motion.div
      layout
      onClick={() => onClick(part)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative flex-shrink-0 w-80 bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl 
        border-2 cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'border-blue-500 ring-4 ring-blue-200' 
          : isHighlighted 
            ? `${healthInfo.borderColor} ring-2 ring-opacity-50`
            : 'border-white/20 hover:border-blue-300'
        }
      `}
    >
      {/* Health indicator */}
      <div className="absolute top-4 right-4">
        <div className={`p-2 rounded-full ${healthInfo.bgColor}`}>
          <HealthIcon className={`w-4 h-4 ${healthInfo.textColor}`} />
        </div>
      </div>

      {/* Part icon and basic info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{part.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{part.description}</p>
        </div>
      </div>

      {/* Stock information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Current Stock</div>
          <div className={`text-2xl font-bold ${
            part.stock < part.minStock ? 'text-red-600' : 'text-gray-900'
          }`}>
            {part.stock}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Min Required</div>
          <div className="text-2xl font-bold text-gray-600">{part.minStock}</div>
        </div>
      </div>

      {/* Progress bar for stock level */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Stock Level</span>
          <span>{Math.round((part.stock / (part.minStock * 2)) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              part.stock < part.minStock 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : part.stock < part.minStock * 1.5
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                  : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${Math.min(100, (part.stock / (part.minStock * 2)) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Additional info */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-gray-500">Cost</div>
          <div className="font-medium">${part.cost.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500">Location</div>
          <div className="font-medium">{part.location}</div>
        </div>
      </div>

      {/* Last updated */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Updated: {part.lastUpdated}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

// Main PartsCarousel Component
const PartsCarousel = ({ 
  onPartSelect, 
  selectedPart, 
  highlightLowStock = false,
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Handle scroll position updates
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateScrollButtons);
      return () => scrollContainer.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Handle part selection
  const handlePartSelect = (part) => {
    if (onPartSelect) {
      onPartSelect(part);
    }
  };

  // Filter and highlight parts
  const partsToShow = highlightLowStock 
    ? PARTS_DATA.sort((a, b) => {
        const aIsLow = a.stock < a.minStock;
        const bIsLow = b.stock < b.minStock;
        if (aIsLow && !bIsLow) return -1;
        if (!aIsLow && bIsLow) return 1;
        return 0;
      })
    : PARTS_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Parts Spotlight</h3>
          <p className="text-gray-600">Interactive parts overview with real-time status</p>
        </div>
        
        {/* Filter toggle */}
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => highlightLowStock && onPartSelect ? onPartSelect() : null}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              highlightLowStock
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {highlightLowStock ? 'Low Stock Filter Active' : 'Show All Parts'}
          </motion.button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left scroll button */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/95 backdrop-blur-lg rounded-full shadow-xl border border-white/20 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right scroll button */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/95 backdrop-blur-lg rounded-full shadow-xl border border-white/20 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Parts Cards Container */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {partsToShow.map((part) => (
            <PartCard
              key={part.id}
              part={part}
              isSelected={selectedPart?.id === part.id}
              isHighlighted={highlightLowStock && part.stock < part.minStock}
              onClick={handlePartSelect}
            />
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-gray-900">{PARTS_DATA.length}</div>
          <div className="text-sm text-gray-600">Total Parts</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-green-600">
            {PARTS_DATA.filter(p => p.stock >= p.minStock).length}
          </div>
          <div className="text-sm text-gray-600">In Stock</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-amber-600">
            {PARTS_DATA.filter(p => p.stock < p.minStock).length}
          </div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-blue-600">
            ${PARTS_DATA.reduce((sum, part) => sum + (part.cost * part.stock), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PartsCarousel;