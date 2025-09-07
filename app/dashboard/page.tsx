'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  HelpCircle, 
  UserCheck, 
  FileText, 
  TrendingUp, 
  Sparkles,
  Plus,
  Brain,
  Target,
  Upload,
  Activity,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'

import StatsCard from '@/components/dashboard/StatsCard'
import QuickActions from '@/components/dashboard/QuickActions'

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    questions: 0,
    groups: 0,
    exams: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats({
          students: 5,
          questions: 4,
          groups: 0,
          exams: 0
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-slate-900"
            >
              Welcome to ExamAI
            </motion.h1>
            <p className="text-slate-600 mt-2">Transform your exams with AI-powered personalization</p>
          </div>
          <QuickActions />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Students"
            value={stats.students}
            icon={Users}
            color="bg-blue-500"
            trend="+12% this month"
            isLoading={isLoading}
          />
          <StatsCard
            title="Questions"
            value={stats.questions}
            icon={HelpCircle}
            color="bg-emerald-500"
            trend="Growing collection"
            isLoading={isLoading}
          />
          <StatsCard
            title="AI Groups"
            value={stats.groups}
            icon={UserCheck}
            color="bg-purple-500"
            trend="Auto-generated"
            isLoading={isLoading}
          />
          <StatsCard
            title="Exams Created"
            value={stats.exams}
            icon={FileText}
            color="bg-amber-500"
            trend="Personalized"
            isLoading={isLoading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Features Highlight */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8" />
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AI-Powered Personalization</h3>
                    <p className="text-indigo-100 text-sm">Make every exam relevant to each student</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-indigo-200" />
                    <span className="text-indigo-100">Smart student clustering by academic profile</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-200" />
                    <span className="text-indigo-100">Context-aware question customization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-indigo-200" />
                    <span className="text-indigo-100">Consistent difficulty across all versions</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link href="/dashboard/students">
                    <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all">
                      Manage Students
                    </Button>
                  </Link>
                  <Link href="/dashboard/groups">
                    <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all">
                      View Groups
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300 h-fit">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">New question: Algorithm Complexity Anal...</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Computer Science</span>
                        <span className="text-xs text-slate-500">Sep 6</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">New question: Market Strategy Developm...</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Business Administration</span>
                        <span className="text-xs text-slate-500">Sep 6</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">New question: Stress Analysis Problem</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Mechanical Engineering</span>
                        <span className="text-xs text-slate-500">Sep 6</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">New student: Lisa Thompson</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Computer Science</span>
                        <span className="text-xs text-slate-500">Sep 6</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">New student: David Park</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Psychology</span>
                        <span className="text-xs text-slate-500">Sep 6</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Getting Started Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Getting Started</h3>
                <p className="text-slate-600">Follow these steps to create your first personalized exam</p>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Add Students</h3>
                  <p className="text-sm text-slate-600">Upload student profiles with academic info</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Create Questions</h3>
                  <p className="text-sm text-slate-600">Build your question bank with templates</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Generate Groups</h3>
                  <p className="text-sm text-slate-600">Let AI cluster students automatically</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Build Exams</h3>
                  <p className="text-sm text-slate-600">Create personalized assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}