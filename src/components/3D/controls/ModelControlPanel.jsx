import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Layers, 
  RotateCcw, 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  SkipForward,
  Camera,
  Maximize,
  Download,
  Share2
} from 'lucide-react';

const ModelControlPanel = ({ 
  controls, 
  onViewModeChange, 
  onCameraPreset, 
  onAnimationControl,
  onExport 
}) => {
  const {
    viewMode,
    selectedSystem,
    explodeFactor,
    crossSectionPlane,
    toggleExplodedView,
    toggleCrossSectionView,
    focusOnSystem,
    setAnimationSpeed,
    setCrossSectionPlane
  } = controls;

  const viewModes = [
    { id: 'assembled', label: 'Assembled', icon: Eye },
    { id: 'exploded', label: 'Exploded', icon: Layers },
    { id: 'cross-section', label: 'Cross Section', icon: RotateCcw }
  ];

  const cameraPresets = [
    { id: 'overview', label: 'Overview', icon: Camera },
    { id: 'frontView', label: 'Front View', icon: Camera },
    { id: 'battery', label: 'Battery Focus', icon: Zap },
    { id: 'motor', label: 'Motor Focus', icon: Settings },
    { id: 'interior', label: 'Interior', icon: Eye }
  ];

  const systems = [
    { id: 'battery', label: 'Battery System', color: 'bg-blue-500' },
    { id: 'motor', label: 'Motor System', color: 'bg-green-500' },
    { id: 'chassis', label: 'Chassis', color: 'bg-gray-500' },
    { id: 'brakes', label: 'Braking System', color: 'bg-red-500' },
    { id: 'cooling-system', label: 'Cooling', color: 'bg-cyan-500' },
    { id: 'body', label: 'Body & Exterior', color: 'bg-indigo-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 max-w-xs z-10"
    >
      <div className="space-y-6">
        {/* View Mode Controls */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            View Mode
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {viewModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (mode.id === 'exploded') toggleExplodedView();
                    else if (mode.id === 'cross-section') toggleCrossSectionView();
                    else onViewModeChange(mode.id);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    viewMode === mode.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Exploded View Controls */}
        <AnimatePresence>
          {viewMode === 'exploded' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="text-sm font-medium text-gray-700 mb-2">Explosion Factor</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={explodeFactor}
                  onChange={(e) => {/* Controlled by animation */}}
                  className="w-full accent-blue-500"
                />
                <div className="text-xs text-gray-500 text-center">
                  {Math.round(explodeFactor * 100)}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cross Section Controls */}
        <AnimatePresence>
          {viewMode === 'cross-section' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="text-sm font-medium text-gray-700 mb-2">Section Plane</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={crossSectionPlane}
                  onChange={(e) => setCrossSectionPlane(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="text-xs text-gray-500 text-center">
                  Position: {crossSectionPlane.toFixed(1)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Focus */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Layers className="w-4 h-4 mr-2" />
            Focus System
          </h3>
          <div className="grid grid-cols-1 gap-1">
            {systems.map((system) => (
              <motion.button
                key={system.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => focusOnSystem(system.id)}
                className={`flex items-center space-x-2 px-2 py-1.5 rounded-md text-xs transition-all ${
                  selectedSystem === system.id
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${system.color}`} />
                <span>{system.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Camera Presets */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Camera
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {cameraPresets.map((preset) => (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCameraPreset(preset.id)}
                className="flex flex-col items-center space-y-1 px-2 py-2 rounded-md text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
              >
                <preset.icon className="w-3 h-3" />
                <span className="text-center leading-tight">{preset.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Animation Controls */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Play className="w-4 h-4 mr-2" />
            Animation
          </h3>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAnimationControl('assembly')}
              className="flex-1 flex items-center justify-center space-x-1 px-2 py-2 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Assembly</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAnimationControl('disassembly')}
              className="flex-1 flex items-center justify-center space-x-1 px-2 py-2 bg-orange-500 text-white rounded-md text-xs hover:bg-orange-600 transition-colors"
            >
              <SkipForward className="w-3 h-3" />
              <span>Explode</span>
            </motion.button>
          </div>
        </div>

        {/* Export & Share */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </h3>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExport('screenshot')}
              className="flex-1 flex items-center justify-center space-x-1 px-2 py-2 bg-purple-500 text-white rounded-md text-xs hover:bg-purple-600 transition-colors"
            >
              <Camera className="w-3 h-3" />
              <span>Screenshot</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExport('share')}
              className="flex-1 flex items-center justify-center space-x-1 px-2 py-2 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors"
            >
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelControlPanel;