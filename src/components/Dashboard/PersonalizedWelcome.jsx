import React from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import { Sun, Moon, Coffee, Zap } from 'lucide-react';

const PersonalizedWelcome = () => {
  const [user] = useAuthState(auth);
  
  // Helper function to get user's first name with fallback
  const getUserFirstName = () => {
    if (!user) return 'Guest';
    
    // First try displayName (set during signup)
    if (user.displayName) {
      const firstName = user.displayName.split(' ')[0];
      return firstName;
    }
    
    // If no displayName, try to extract from email
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Handle dots/underscores and capitalize
      const firstName = emailName.split(/[._]/)[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }
    
    // Final fallback
    return 'User';
  };

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sun, color: 'from-yellow-400 to-orange-500' };
    if (hour < 17) return { text: 'Good afternoon', icon: Coffee, color: 'from-blue-400 to-blue-600' };
    if (hour < 21) return { text: 'Good evening', icon: Zap, color: 'from-purple-400 to-purple-600' };
    return { text: 'Good evening', icon: Moon, color: 'from-indigo-400 to-purple-600' };
  };

  const firstName = getUserFirstName();
  const greeting = getTimeBasedGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary-50 via-secondary-50 to-electric-50 rounded-xl p-6 mb-8 border border-white/50 shadow-lg"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${greeting.color} flex items-center justify-center shadow-lg`}
        >
          <GreetingIcon className="w-8 h-8 text-white" />
        </motion.div>
        
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-1"
          >
            {greeting.text}, {firstName}! 👋
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 font-medium"
          >
            Welcome back to your InvenAI dashboard. Here's your latest inventory overview.
          </motion.p>
        </div>

        {/* Live status indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center space-x-2 px-3 py-2 bg-white/70 rounded-lg"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Live</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PersonalizedWelcome;