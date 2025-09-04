'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Bell, Home, FileText, BarChart2, Settings, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const sidebarNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/exams', label: 'My Exams', icon: FileText },
  { href: '/dashboard/questions', label: 'Question Bank', icon: BarChart2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const Sidebar = () => (
    <aside className="w-64 flex-shrink-0 bg-navy-800 text-white flex flex-col">
      <div className="h-20 flex items-center px-6 gap-3 border-b border-navy-700">
        <Image
          src="/logo.png"
          alt="ExamGen AI"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="text-xl font-bold">ExamGen AI</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              }`}>
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar & Header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden h-20 flex justify-between items-center px-6 bg-white border-b">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ExamGen AI"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold">ExamGen AI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        {/* Mobile Sidebar Panel */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        <div className={`md:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
