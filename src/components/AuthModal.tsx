'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Github, Chrome, Apple } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { mode, formData })
    // Add authentication logic here
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setFormData({ email: '', password: '', name: '', confirmPassword: '' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              className="auth-modal glass-effect relative max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Header */}
              <div className="p-8 pb-4">
                <motion.h2
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </motion.h2>
                <motion.p
                  className="text-white/70"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {mode === 'login' 
                    ? 'Sign in to your account to continue'
                    : 'Join thousands of educators creating amazing exams'
                  }
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 pb-8">
                <div className="space-y-4">
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="form-group"
                    >
                      <div className="input-wrapper">
                        <User className="input-icon" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="auth-input"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="form-group">
                    <div className="input-wrapper">
                      <Mail className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="auth-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-wrapper">
                      <Lock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="auth-input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="form-group"
                    >
                      <div className="input-wrapper">
                        <Lock className="input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="auth-input"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {mode === 'login' && (
                  <div className="flex justify-between items-center mt-4 mb-6">
                    <label className="flex items-center space-x-2 text-sm text-white/70">
                      <input type="checkbox" className="form-checkbox" />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="auth-submit-btn w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="px-8 pb-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-white/70">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Social Auth */}
              <div className="px-8 pb-8">
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    className="social-auth-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chrome className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="social-auth-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="social-auth-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Apple className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 pb-8 text-center">
                <p className="text-sm text-white/70">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}