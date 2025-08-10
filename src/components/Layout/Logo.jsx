import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Battery } from 'lucide-react'

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: {
      container: 'h-8',
      icon: 'w-5 h-5',
      text: 'text-lg font-bold',
      badge: 'w-2 h-2',
    },
    medium: {
      container: 'h-10',
      icon: 'w-6 h-6',
      text: 'text-xl font-bold',
      badge: 'w-2.5 h-2.5',
    },
    large: {
      container: 'h-12',
      icon: 'w-7 h-7',
      text: 'text-2xl font-bold',
      badge: 'w-3 h-3',
    },
  }

  const currentSize = sizeClasses[size]

  return (
    <motion.div
      className={`flex items-center space-x-3 ${currentSize.container} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {/* Logo Icon */}
      <div className="relative">
        <motion.div
          className="relative p-2 bg-gradient-to-br from-primary-500 via-secondary-500 to-electric-500 rounded-xl shadow-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Battery className={`${currentSize.icon} text-white`} />

          {/* Electric effect */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            initial={{ opacity: 0 }}
            whileHover={{
              opacity: 1,
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 40px rgba(59, 130, 246, 0.5)',
                '0 0 20px rgba(59, 130, 246, 0.3)',
              ],
            }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          />

          {/* Status indicator */}
          <div
            className={`absolute -top-1 -right-1 ${currentSize.badge} bg-neon-400 rounded-full border-2 border-white`}
          >
            <div className="w-full h-full bg-white rounded-full animate-pulse opacity-60"></div>
          </div>
        </motion.div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <motion.h1
          className={`${currentSize.text} heading-gradient leading-none`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          InvenAI
        </motion.h1>
        {size !== 'small' && (
          <motion.p
            className="text-xs text-gray-500 font-medium leading-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            EV Stock Master
          </motion.p>
        )}
      </div>

      {/* Animated spark effect on hover */}
      <motion.div
        className="absolute -z-10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Zap className="w-4 h-4 text-electric-400 absolute -top-2 -right-2 animate-pulse" />
      </motion.div>
    </motion.div>
  )
}

export default Logo
