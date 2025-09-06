"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Mail, Lock, Github, Chrome, Apple } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
})

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password confirmation is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

interface LoginFormProps {
  mode?: 'login' | 'signup'
  onModeChange?: (mode: 'login' | 'signup') => void
  onSubmit?: (data: LoginFormValues | SignupFormValues, mode: 'login' | 'signup') => void
}

export function LoginForm({ 
  mode = 'login', 
  onModeChange,
  onSubmit 
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [currentMode, setCurrentMode] = useState(mode)

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const currentForm = currentMode === 'login' ? loginForm : signupForm

  const handleSubmit = (data: LoginFormValues | SignupFormValues) => {
    onSubmit?.(data, currentMode)
    console.log('Form submitted:', { mode: currentMode, data })
  }

  const toggleMode = () => {
    const newMode = currentMode === 'login' ? 'signup' : 'login'
    setCurrentMode(newMode)
    onModeChange?.(newMode)
    
    // Reset forms when switching modes
    loginForm.reset()
    signupForm.reset()
  }

  const handleSocialAuth = (provider: 'google' | 'github' | 'apple') => {
    console.log(`${provider} authentication initiated`)
    // Implement social auth logic here
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {currentMode === 'login' ? 'Welcome back' : 'Create account'}
        </CardTitle>
        <CardDescription className="text-center">
          {currentMode === 'login' 
            ? 'Sign in to your account to continue'
            : 'Join thousands of educators creating amazing exams'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
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
                      <Input 
                        placeholder="Enter your full name" 
                        {...field} 
                      />
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
                      <FormLabel className="text-sm font-normal">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Button variant="link" className="px-0 font-normal">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full">
              {currentMode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSocialAuth('google')}
            className="w-full"
          >
            <Chrome className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSocialAuth('github')}
            className="w-full"
          >
            <Github className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSocialAuth('apple')}
            className="w-full"
          >
            <Apple className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          {currentMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <Button variant="link" onClick={toggleMode} className="p-0 font-normal">
            {currentMode === 'login' ? 'Sign up' : 'Sign in'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}