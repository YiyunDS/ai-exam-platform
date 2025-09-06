'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, Apple } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
})

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

interface ImprovedAuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
  onSubmit?: (data: LoginFormValues | SignupFormValues, mode: 'login' | 'signup') => void
}

export function ImprovedAuthModal({ 
  isOpen, 
  onClose, 
  defaultMode = 'login',
  onSubmit 
}: ImprovedAuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [currentMode, setCurrentMode] = useState(defaultMode)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const currentForm = currentMode === 'login' ? loginForm : signupForm

  const getPasswordStrength = (password: string) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 25
    return strength
  }

  const handleSubmit = async (data: LoginFormValues | SignupFormValues) => {
    setIsLoading(true)
    try {
      await onSubmit?.(data, currentMode)
      console.log('Form submitted:', { mode: currentMode, data })
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Authentication error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    const newMode = currentMode === 'login' ? 'signup' : 'login'
    setCurrentMode(newMode)
    
    // Reset forms when switching modes
    loginForm.reset()
    signupForm.reset()
    setShowPassword(false)
  }

  const handleSocialAuth = async (provider: 'google' | 'github' | 'apple') => {
    setSocialLoading(provider)
    try {
      console.log(`${provider} authentication initiated`)
      // Simulate social auth delay
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`${provider} auth error:`, error)
    } finally {
      setSocialLoading(null)
    }
  }

  const passwordValue = currentMode === 'signup' ? signupForm.watch('password') : ''
  const passwordStrength = getPasswordStrength(passwordValue || '')

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <SheetTitle className="text-2xl">
              {currentMode === 'login' ? 'Welcome back' : 'Create account'}
            </SheetTitle>
            <SheetDescription className="text-center mt-2">
              {currentMode === 'login' 
                ? 'Sign in to your account to continue'
                : 'Join thousands of educators creating amazing exams'
              }
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Social Auth Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleSocialAuth('google')}
              disabled={!!socialLoading}
              className="relative"
            >
              {socialLoading === 'google' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
              ) : (
                <Chrome className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSocialAuth('github')}
              disabled={!!socialLoading}
              className="relative"
            >
              {socialLoading === 'github' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
              ) : (
                <Github className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSocialAuth('apple')}
              disabled={!!socialLoading}
              className="relative"
            >
              {socialLoading === 'apple' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
              ) : (
                <Apple className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <Form {...currentForm}>
            <form onSubmit={currentForm.handleSubmit(handleSubmit)} className="space-y-4">
              {currentMode === 'signup' && (
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Enter your full name" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={currentForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="email"
                          placeholder="Enter your email" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={currentForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password" 
                          className="pl-10 pr-10"
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {currentMode === 'signup' && passwordValue && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Password strength</span>
                          <span className={`${passwordStrength >= 75 ? 'text-green-600' : passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {passwordStrength >= 75 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                          </span>
                        </div>
                        <Progress value={passwordStrength} className="h-2" />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {currentMode === 'signup' && (
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentMode === 'login' && (
                <div className="flex items-center justify-between">
                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="rounded border border-input"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Button variant="link" className="px-0 font-normal h-auto">
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                    {currentMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  currentMode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>
          </Form>

          {/* Mode Toggle */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {currentMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <Button variant="link" onClick={toggleMode} className="p-0 font-normal h-auto">
                {currentMode === 'login' ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>

          {/* Terms for signup */}
          {currentMode === 'signup' && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Button variant="link" className="p-0 h-auto text-xs">
                  Terms of Service
                </Button>
                {' '}and{' '}
                <Button variant="link" className="p-0 h-auto text-xs">
                  Privacy Policy
                </Button>
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ImprovedAuthModal