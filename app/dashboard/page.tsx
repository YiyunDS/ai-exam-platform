'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Users, FileText, Sparkles, ArrowRight, Target, BarChart, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ModernCard } from '@/components/ModernCard'

export default function DashboardPage() {
  const stats = [
    { icon: FileText, value: '1,256', label: 'Questions Generated', change: '+12%' },
    { icon: Users, value: '218', label: 'Active Students', change: '+5%' },
    { icon: Target, value: '6', label: 'Student Groups', change: '0' },
    { icon: BarChart, value: '94%', label: 'Engagement Rate', change: '+8%' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div 
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-4 md:p-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Welcome back, Dr. Smith
            </h1>
            <p className="text-white/90 text-base md:text-lg mb-6 max-w-2xl">
              Transform your teaching with AI-powered personalized question generation. 
              Create contextually relevant exams tailored to each student group while maintaining 
              consistent learning objectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/generator" className="btn-primary">
                <Brain className="h-5 w-5 mr-2" />
                Start Generating Questions
              </Link>
              <Link href="/dashboard/groups" className="btn-secondary">
                <Users className="h-5 w-5 mr-2" />
                Manage Student Groups
              </Link>
            </div>
          </motion.div>
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-blue-300/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="h-16 w-16 text-white" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899']
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <ModernCard className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <motion.div 
                      className="text-xl sm:text-2xl font-bold text-gray-900 mb-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-2">{stat.label}</div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </div>
                  </div>
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${colors[index]}20` }}
                  >
                    <stat.icon className="h-6 w-6" style={{ color: colors[index] }} />
                  </div>
                </div>
              </ModernCard>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/dashboard/generator">
            <ModernCard className="p-6 text-center group cursor-pointer">
              <motion.div 
                className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-fit mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Brain className="h-8 w-8 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">AI Question Generator</h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
                Create personalized questions adapted to each student group's context and interests
              </p>
              <div className="flex items-center justify-center text-blue-600 font-medium text-sm md:text-base group-hover:gap-2 transition-all">
                Generate Questions
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </ModernCard>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link href="/dashboard/groups">
            <ModernCard className="p-6 text-center group cursor-pointer">
              <motion.div 
                className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full w-fit mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Users className="h-8 w-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Manage Student Groups</h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
                Configure student groups with their majors, interests, and keywords for better contextualization
              </p>
              <div className="flex items-center justify-center text-green-600 font-medium text-sm md:text-base group-hover:gap-2 transition-all">
                Manage Groups
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </ModernCard>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link href="/dashboard/analytics">
            <ModernCard className="p-6 text-center group cursor-pointer">
              <motion.div 
                className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-fit mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <BarChart className="h-8 w-8 text-purple-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">View Analytics</h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
                Track question effectiveness, student engagement, and generation analytics
              </p>
              <div className="flex items-center justify-center text-purple-600 font-medium text-sm md:text-base group-hover:gap-2 transition-all">
                View Analytics
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </ModernCard>
          </Link>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <ModernCard>
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <motion.div 
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-2 bg-green-200 rounded-lg flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">Generated 5 question variations for Finance group</p>
                  <p className="text-sm text-gray-600">Statistics exam - 2 hours ago</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-2 bg-blue-200 rounded-lg flex-shrink-0">
                  <Users className="h-4 w-4 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">Added 15 students to Engineering group</p>
                  <p className="text-sm text-gray-600">CSV import - 5 hours ago</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-2 bg-purple-200 rounded-lg flex-shrink-0">
                  <FileText className="h-4 w-4 text-purple-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">Created new exam template</p>
                  <p className="text-sm text-gray-600">Linear Algebra exam - Yesterday</p>
                </div>
              </motion.div>
            </div>
          </div>
        </ModernCard>
      </motion.div>
    </div>
  )
}