import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, ExternalLink } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider, domainUtils } from '../../config/firebase';

const AuthModal = ({ isOpen, onClose, mode, setMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDomainHelp, setShowDomainHelp] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowDomainHelp(false);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Update the user's display name with first and last name
        if (formData.firstName || formData.lastName) {
          const displayName = `${formData.firstName} ${formData.lastName}`.trim();
          await updateProfile(userCredential.user, {
            displayName: displayName
          });
        }
      }
      onClose();
    } catch (error) {
      console.error('Authentication error:', error);
      console.log('Current domain info:', domainUtils.getCurrentDomainInfo());
      
      // Provide user-friendly error messages
      let errorMessage = error.message;
      let shouldShowDomainHelp = false;
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/internal-error') {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
        shouldShowDomainHelp = domainUtils.isDomainLikelyUnauthorized();
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for authentication.';
        shouldShowDomainHelp = true;
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network connection issue. Please check your internet and try again.';
      } else {
        // For other errors, check if it might be domain-related
        shouldShowDomainHelp = domainUtils.isDomainLikelyUnauthorized();
        if (shouldShowDomainHelp) {
          errorMessage = 'Authentication failed. This might be due to an unauthorized domain.';
        }
      }
      
      setError(errorMessage);
      setShowDomainHelp(shouldShowDomainHelp);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    setShowDomainHelp(false);

    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error) {
      console.error('Google authentication error:', error);
      console.log('Current domain info:', domainUtils.getCurrentDomainInfo());
      
      // Provide user-friendly error messages
      let errorMessage = error.message;
      let shouldShowDomainHelp = false;
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/internal-error') {
        errorMessage = 'Google sign-in temporarily unavailable. Please try email sign-in.';
        shouldShowDomainHelp = domainUtils.isDomainLikelyUnauthorized();
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for authentication.';
        shouldShowDomainHelp = true;
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Please allow popups and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network connection issue. Please check your internet and try again.';
      } else {
        // For other errors, check if it might be domain-related
        shouldShowDomainHelp = domainUtils.isDomainLikelyUnauthorized();
        if (shouldShowDomainHelp) {
          errorMessage = 'Authentication failed. This might be due to an unauthorized domain.';
        }
      }
      
      setError(errorMessage);
      setShowDomainHelp(shouldShowDomainHelp);
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-gradient-to-br from-dark-900 to-dark-800 border border-electric-400/20 rounded-2xl p-8 w-full max-w-md shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-400 to-electric-500 bg-clip-text text-transparent">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-electric-400/30 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors mb-4 text-white hover:border-electric-400/50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-dark-900 to-dark-800 text-gray-300">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-400" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-electric-400 focus:border-transparent"
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-400" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-electric-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-electric-400 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 bg-dark-800 border border-dark-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-electric-400 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-electric-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-electric-400 focus:border-transparent"
                  required
                />
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-400/20 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{error}</div>
                    {showDomainHelp && (
                      <div className="mt-2 pt-2 border-t border-red-400/20">
                        <div className="text-xs text-red-300 mb-2">
                          <strong>Domain Authorization Required:</strong>
                        </div>
                        <div className="text-xs text-red-300 mb-2">
                          Current domain: <code className="bg-red-900/30 px-1 py-0.5 rounded">{domainUtils.getCurrentDomainInfo().origin}</code>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.open(domainUtils.getFirebaseConsoleAuthURL(), '_blank')}
                          className="inline-flex items-center space-x-1 text-xs text-red-300 hover:text-red-200 underline"
                        >
                          <span>Open Firebase Console</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <div className="text-xs text-red-300 mt-1">
                          Add your domain to Authentication → Settings → Authorized domains
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-electric-400 to-electric-500 text-dark-900 py-3 px-4 rounded-lg hover:from-electric-500 hover:to-electric-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <span className="text-gray-300">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-electric-400 hover:text-electric-500 font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;