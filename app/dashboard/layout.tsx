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
    <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out bg-white/95 backdrop-blur-sm border-r border-slate-200 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0 md:static md:h-auto`}>
      {/* Header */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">ExamAI</h2>
            <p className="text-xs text-slate-500 font-medium">Personalized Assessments</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
            Platform
          </p>
          <nav className="space-y-1">
            {sidebarNavItems.map((item, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group mb-1 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 shadow-sm' 
                        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-blue-600' : ''
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              )
            })}
          </nav>
        </div>

        {/* AI Features Section */}
        <div className="mt-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
            AI Features
          </p>
          <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-amber-900 text-sm">Smart Clustering</span>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              AI automatically groups students by academic profile and interests
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
            <span className="text-slate-700 font-semibold text-sm">T</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 text-sm truncate">Teacher</p>
            <p className="text-xs text-slate-500 truncate">Create personalized exams</p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">ExamAI</h1>
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
