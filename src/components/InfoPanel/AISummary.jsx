import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { aiInsights } from '../../data/mockData';

const AISummary = ({ partId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate AI processing time
    const timer = setTimeout(() => {
      if (partId && aiInsights.partSpecific[partId]) {
        setInsights(aiInsights.partSpecific[partId]);
      } else {
        setInsights(aiInsights.overall);
      }
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [partId]);

  const LoadingComponent = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-6 h-6 text-primary-600 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900">AI Analysis in Progress</p>
        <p className="text-sm text-gray-500 mt-1">Processing inventory data...</p>
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary-600 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'text-green-600 bg-green-100';
    if (confidence >= 85) return 'text-blue-600 bg-blue-100';
    if (confidence >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRecommendationIcon = (recommendation) => {
    if (recommendation.toLowerCase().includes('urgent') || recommendation.toLowerCase().includes('critical')) {
      return AlertTriangle;
    }
    if (recommendation.toLowerCase().includes('optimal') || recommendation.toLowerCase().includes('excellent')) {
      return CheckCircle;
    }
    return Lightbulb;
  };

  const getRecommendationColor = (recommendation) => {
    if (recommendation.toLowerCase().includes('urgent') || recommendation.toLowerCase().includes('critical')) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    if (recommendation.toLowerCase().includes('optimal') || recommendation.toLowerCase().includes('excellent')) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-200">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">AI Analysis</h2>
        <p className="text-gray-500 mt-1">
          {partId ? `Analysis for ${partId.replace('-', ' ')}` : 'Overall Inventory Insights'}
        </p>
      </div>

      {/* Confidence Score */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">Analysis Confidence</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(insights.confidence)}`}>
            {insights.confidence}%
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${insights.confidence}%` }}
            transition={{ delay: 0.3, duration: 1 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
          Executive Summary
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-primary-600" />
          AI Recommendations
        </h3>

        <div className="space-y-3">
          {insights.recommendations.map((recommendation, index) => {
            const RecommendationIcon = getRecommendationIcon(recommendation);
            const colorClass = getRecommendationColor(recommendation);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${colorClass}`}
              >
                <div className="flex items-start space-x-3">
                  <RecommendationIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{recommendation}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Insights Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Trend Analysis</span>
          </div>
          <div className="text-lg font-bold text-blue-900">
            {partId ? 'Stable' : 'Improving'}
          </div>
          <div className="text-xs text-blue-600">30-day trend</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Optimization</span>
          </div>
          <div className="text-lg font-bold text-green-900">87%</div>
          <div className="text-xs text-green-600">Efficiency score</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium flex items-center justify-center space-x-2"
        >
          <Brain className="w-4 h-4" />
          <span>Generate Detailed Report</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Schedule AI Analysis
        </motion.button>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last analysis: {new Date().toLocaleTimeString()}</span>
          <span>Next update: 15 min</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AISummary;