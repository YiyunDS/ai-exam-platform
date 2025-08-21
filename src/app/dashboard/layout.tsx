'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import type { Teacher } from '@/lib/types'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }

        // Get teacher profile
        const { data: teacherData, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error || !teacherData) {
          // Try to create teacher profile if it doesn't exist
          const { error: createError } = await supabase
            .from('teachers')
            .insert({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || 'Teacher',
            })

          if (createError) {
            console.error('Error creating teacher profile:', createError)
            router.push('/login')
            return
          }

          // Fetch the newly created profile
          const { data: newTeacherData } = await supabase
            .from('teachers')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setTeacher(newTeacherData)
        } else {
          setTeacher(teacherData)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
                AI Exam Platform
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {teacher.name}
              </span>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            >
              <span>📊</span>
              Dashboard
            </Link>
            <Link
              href="/dashboard/students"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            >
              <span>👥</span>
              Students
            </Link>
            <Link
              href="/dashboard/clusters"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            >
              <span>🎯</span>
              Clusters
            </Link>
            <Link
              href="/dashboard/questions"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            >
              <span>❓</span>
              Questions
            </Link>
            <Link
              href="/dashboard/exams"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            >
              <span>📝</span>
              Exams
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            >
              <span>📈</span>
              Analytics
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}