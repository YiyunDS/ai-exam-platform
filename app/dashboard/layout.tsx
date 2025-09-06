'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Bell, Home, FileText, BarChart2, Settings, User, Menu, X, Brain, Users, Activity, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { motion } from 'framer-motion'

const sidebarNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/generator', label: 'AI Generator', icon: Brain },
  { href: '/dashboard/exams', label: 'My Exams', icon: FileText },
  { href: '/dashboard/questions', label: 'Question Bank', icon: BarChart2 },
  { href: '/dashboard/groups', label: 'Student Groups', icon: Users },
  { href: '/dashboard/analytics', label: 'Analytics', icon: Activity },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const Sidebar = () => (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''} bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col relative overflow-hidden md:w-64 md:flex-shrink-0 md:relative md:translate-x-0 md:z-auto`}>
      {/* Background orb for sidebar */}
      <div className="absolute top-20 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
      
      <div className="h-20 flex items-center px-6 gap-3 border-b border-white/10">
        <motion.div
          className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Brain className="h-6 w-6 text-white" />
        </motion.div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ExamGen AI
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
        {sidebarNavItems.map(({ href, label, icon: Icon }, index) => {
          const isActive = pathname === href
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-300 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">{label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>
      
      {/* User profile section */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">Dr. Smith</div>
            <div className="text-xs text-gray-400 truncate">Professor</div>
          </div>
          <Bell className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </aside>
  )

  return (
    <div className="app-layout bg-gray-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none"></div>
      
      {/* Mobile Header */}
      <header className="mobile-header md:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ExamGen AI
          </span>
        </div>
        <button 
          className="mobile-menu-button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Overlay for mobile */}
      <div 
        className={`overlay ${isSidebarOpen ? 'active' : ''} md:hidden`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={`main-content ${!isSidebarOpen ? '' : ''} md:with-sidebar`}>
        <div className="p-6 md:p-10 relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
