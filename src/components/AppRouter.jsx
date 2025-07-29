import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from '../components/Landing/LandingPage';
import DashboardApp from './DashboardApp';

const AppRouter = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4">
            <svg viewBox="0 0 32 32" className="w-full h-full animate-pulse">
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f2027"/>
                  <stop offset="50%" stopColor="#203a43"/>
                  <stop offset="100%" stopColor="#2c5364"/>
                </linearGradient>
                <linearGradient id="elementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f2fe"/>
                  <stop offset="100%" stopColor="#4facfe"/>
                </linearGradient>
              </defs>
              <rect width="32" height="32" fill="url(#bgGradient)" rx="6" />
              <circle cx="16" cy="11" r="5" fill="url(#elementGradient)" />
              <path d="M13 16 L11 22 L13.5 22 L12 25 H20 L18.5 22 L21 22 L19 16 Z" fill="url(#elementGradient)" />
              <path d="M16 17 L13 21 H15 L12 26 H17 L15 22 H18 Z" fill="#00f2fe" />
              <path d="M13 13 Q16 11.5 19 13" stroke="#ffffff" strokeWidth="0.4" fill="none" />
              <path d="M14 15 Q16 14 18 15" stroke="#ffffff" strokeWidth="0.4" fill="none" />
              <line x1="9" y1="23" x2="13" y2="23" stroke="#ffffff" strokeWidth="0.5" />
              <line x1="19" y1="23" x2="23" y2="23" stroke="#ffffff" strokeWidth="0.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            InvenAI
          </h2>
          <p className="text-gray-600">Loading your intelligent inventory platform...</p>
        </motion.div>
      </div>
    );
  }

  return currentUser ? <DashboardApp /> : <LandingPage />;
};

export default AppRouter;