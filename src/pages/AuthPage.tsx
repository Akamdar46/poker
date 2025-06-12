import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { validateEmail, validatePassword } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const { login, signup, resetPassword, loading } = useAuth()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (mode === 'signup') {
        const passwordValidation = validatePassword(formData.password)
        if (!passwordValidation.isValid) {
          newErrors.password = passwordValidation.errors[0]
        }
      }
    }

    if (mode === 'signup' && !formData.username) {
      newErrors.username = 'Username is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
        })
      } else if (mode === 'signup') {
        await signup({
          email: formData.email,
          password: formData.password,
          username: formData.username,
        })
      } else if (mode === 'reset') {
        await resetPassword(formData.email)
        setResetEmailSent(true)
      }
    } catch (error: any) {
      setErrors({ submit: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (resetEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-success-500" />
            </div>
            <h2 className="text-3xl font-bold text-white">Check your email</h2>
            <p className="mt-2 text-gray-400">
              We've sent a password reset link to {formData.email}
            </p>
            <button
              onClick={() => {
                setMode('login')
                setResetEmailSent(false)
                setFormData({ email: '', password: '', username: '' })
              }}
              className="mt-4 text-primary-400 hover:text-primary-300"
            >
              Back to login
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'reset' && 'Reset your password'}
          </h2>
          <p className="mt-2 text-gray-400">
            {mode === 'login' && 'Welcome back! Please sign in to continue.'}
            {mode === 'signup' && 'Join thousands of players improving their game.'}
            {mode === 'reset' && 'Enter your email to receive a reset link.'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input pl-10 ${errors.email ? 'border-error-500' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-400">{errors.email}</p>
              )}
            </div>

            {/* Username (signup only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`input pl-10 ${errors.username ? 'border-error-500' : ''}`}
                    placeholder="Choose a username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-error-400">{errors.username}</p>
                )}
              </div>
            )}

            {/* Password */}
            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`input pl-10 pr-10 ${errors.password ? 'border-error-500' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-400">{errors.password}</p>
                )}
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-error-500/20 border border-error-500/50 rounded-lg">
              <p className="text-error-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isSubmitting || loading) && <LoadingSpinner size="sm" />}
            <span>
              {mode === 'login' && 'Sign in'}
              {mode === 'signup' && 'Create account'}
              {mode === 'reset' && 'Send reset link'}
            </span>
          </button>

          {/* Mode Switching */}
          <div className="text-center space-y-2">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  Forgot your password?
                </button>
                <div>
                  <span className="text-gray-400 text-sm">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div>
                <span className="text-gray-400 text-sm">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <button
                
                type="button"
                onClick={() => setMode('login')}
                className="text-primary-400 hover:text-primary-300 text-sm"
              >
                Back to login
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AuthPage