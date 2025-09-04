'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (data.user) {
        // Check if teacher profile exists
        const { data: teacher, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (teacherError && teacherError.code !== 'PGRST116') {
          setError('Error loading teacher profile')
          return
        }

        if (!teacher) {
          // Create teacher profile if it doesn't exist
          const { error: createError } = await supabase
            .from('teachers')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || 'Teacher',
            })

          if (createError) {
            setError('Error creating teacher profile')
            return
          }
        }

        router.push('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</CardTitle>
        <CardDescription className="text-gray-500 font-light text-lg">
          Sign in to your AI Exam Platform account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your-email@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-3 text-lg font-medium" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-light">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-black hover:text-gray-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 font-light">
            ← Back to homepage
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}