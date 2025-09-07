'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Home, FileText, BarChart2, Settings, User, Menu, Brain, Users, Activity, Sparkles, GraduationCap, HelpCircle, UserCheck, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { motion } from 'framer-motion'

const sidebarNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/students', label: 'Students', icon: Users },
  { href: '/dashboard/questions', label: 'Questions', icon: HelpCircle },
  { href: '/dashboard/groups', label: 'Student Groups', icon: UserCheck },
  { href: '/dashboard/exams', label: 'Exams', icon: FileText },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const Sidebar = () => (
    <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0 md:static md:h-auto`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-base">ExamAI</h2>
            <p className="text-xs text-gray-500">Personalized Assessments</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <div className="mb-8">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2 mb-2">
            PLATFORM
          </p>
          <nav className="space-y-1">
            {sidebarNavItems.map((item, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* AI Features Section */}
        <div className="mt-8">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2 mb-2">
            AI FEATURES
          </p>
          <div className="px-3 py-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-900 text-sm">Smart Clustering</span>
            </div>
            <p className="text-xs text-orange-700 leading-relaxed">
              AI automatically groups students by academic profile and interests
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-700 font-medium text-sm">T</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">Teacher</p>
            <p className="text-xs text-gray-500 truncate">Create personalized exams</p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">ExamAI</h1>
        </div>
      </header>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:ml-0">
        <div className="flex-1 overflow-auto pt-20 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
