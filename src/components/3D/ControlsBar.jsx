import React from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  RotateCw,
  Move,
  Camera,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

const ControlsBar = ({
  onCameraReset,
  onToggleAutoRotate,
  onTogglePan,
  onScreenshot,
  autoRotate = false,
  enablePan = true,
  className = ""
}) => {
  
  const handleScreenshot = () => {
    // Future implementation: capture canvas screenshot
    if (onScreenshot) {
      onScreenshot();
    } else {
      // Fallback: simple screenshot attempt
      try {
        const canvas = document.querySelector('canvas');
        if (canvas) {
          const link = document.createElement('a');
          link.download = `evstockmaster-scene-${Date.now()}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      } catch (error) {
        console.warn('Screenshot failed:', error);
      }
    }
  };

  const controls = [
    {
      id: 'reset',
      icon: RotateCcw,
      label: 'Reset Camera',
      onClick: onCameraReset,
      tooltip: 'Reset camera to default position'
    },
    {
      id: 'autorotate',
      icon: autoRotate ? Eye : EyeOff,
      label: autoRotate ? 'Stop Auto Rotate' : 'Auto Rotate',
      onClick: onToggleAutoRotate,
      tooltip: autoRotate ? 'Disable automatic rotation' : 'Enable automatic rotation',
      active: autoRotate
    },
    {
      id: 'pan',
      icon: Move,
      label: enablePan ? 'Disable Pan' : 'Enable Pan',
      onClick: onTogglePan,
      tooltip: enablePan ? 'Disable camera panning' : 'Enable camera panning',
      active: enablePan
    },
    {
      id: 'screenshot',
      icon: Download,
      label: 'Screenshot',
      onClick: handleScreenshot,
      tooltip: 'Take a screenshot of the current view'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className={`absolute bottom-6 left-6 ${className}`}
    >
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
        <div className="flex items-center space-x-3">
          {/* Mini-map preview (placeholder) */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl border-2 border-white shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/3 left-0 right-0 h-px bg-gray-400"></div>
                <div className="absolute top-2/3 left-0 right-0 h-px bg-gray-400"></div>
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray-400"></div>
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-400"></div>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-gray-200"></div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            {controls.map(({ id, icon: Icon, label, onClick, tooltip, active }) => (
              <motion.button
                key={id}
                onClick={onClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  group relative p-3 rounded-xl transition-all duration-200
                  ${active 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                  }
                `}
                title={tooltip}
              >
                <Icon size={18} />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                    {tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-gray-200"></div>

          {/* Status Indicator */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">Live</span>
            </div>
            <div className="text-xs text-gray-500">WebGL 2.0</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🖱️</span>
              <span>Drag to rotate</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">🔍</span>
              <span>Scroll to zoom</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">👆</span>
              <span>Click parts</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">📱</span>
              <span>Pinch to scale</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ControlsBar;