'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import type { Teacher } from '@/lib/types'
import { 
  LayoutDashboard, 
  Sparkles, 
  FileStack, 
  Database,
  Settings,
  Bell,
  User
} from 'lucide-react'

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-navy-900 min-h-screen flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-navy-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="AI Exam Generator"
                  width={32}
                  height={32}
                  className="rounded"
                />
              </div>
              <span className="text-white font-semibold text-lg">AI Exam Pro</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-primary hover:text-white group"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/exams/new"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-primary hover:text-white group"
            >
              <Sparkles className="h-5 w-5" />
              New Exam
            </Link>
            <Link
              href="/dashboard/exams"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-primary hover:text-white group"
            >
              <FileStack className="h-5 w-5" />
              My Exams
            </Link>
            <Link
              href="/dashboard/questions"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-primary hover:text-white group"
            >
              <Database className="h-5 w-5" />
              Question Bank
            </Link>
            
            {/* Divider */}
            <div className="h-px bg-navy-700 my-4"></div>
            
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-all hover:bg-primary hover:text-white group"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold text-navy-900">AI Exam Pro</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-navy-900">
                    {teacher.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}