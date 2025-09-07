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
  Activity
} from 'lucide-react'

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
          students: 125,
          questions: 48,
          groups: 6,
          exams: 12
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome to ExamAI
            </h1>
            <p className="text-gray-600 mt-1">Transform your exams with AI-powered personalization</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/students/import">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Students
              </Button>
            </Link>
            <Link href="/dashboard/questions/new">
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Question
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-2xl font-semibold text-gray-900">{isLoading ? '-' : stats.students}</p>
                  <p className="text-sm text-green-600">+12% this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Questions</p>
                  <p className="text-2xl font-semibold text-gray-900">{isLoading ? '-' : stats.questions}</p>
                  <p className="text-sm text-green-600">Growing collection</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Groups</p>
                  <p className="text-2xl font-semibold text-gray-900">{isLoading ? '-' : stats.groups}</p>
                  <p className="text-sm text-green-600">Auto-generated</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Exams Created</p>
                  <p className="text-2xl font-semibold text-gray-900">{isLoading ? '-' : stats.exams}</p>
                  <p className="text-sm text-green-600">Personalized</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* AI Features Highlight */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 text-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">AI-Powered Personalization</h3>
                    <p className="text-blue-100 text-sm">Make every exam relevant to each student</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-100 text-sm">Smart student clustering by academic profile</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-100 text-sm">Context-aware question customization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-100 text-sm">Consistent difficulty across all versions</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/dashboard/students">
                    <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      Manage Students
                    </Button>
                  </Link>
                  <Link href="/dashboard/groups">
                    <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      View Groups
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="bg-white border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">New question: Algorithm Complexity Anal...</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Computer Science</span>
                        <span>Sep 6</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">New question: Market Strategy Developm...</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Business Administration</span>
                        <span>Sep 6</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">New question: Stress Analysis Problem</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Mechanical Engineering</span>
                        <span>Sep 6</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">New student: Lisa Thompson</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Computer Science</span>
                        <span>Sep 6</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">New student: David Park</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Psychology</span>
                        <span>Sep 6</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Getting Started Guide */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Getting Started</CardTitle>
            <p className="text-gray-600 text-sm">Follow these steps to create your first personalized exam</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Add Students</h3>
                <p className="text-sm text-gray-600">Upload student profiles with academic info</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-green-50">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Create Questions</h3>
                <p className="text-sm text-gray-600">Build your question bank with templates</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-purple-50">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Generate Groups</h3>
                <p className="text-sm text-gray-600">Let AI cluster students automatically</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-orange-50">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-semibold text-sm">4</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Build Exams</h3>
                <p className="text-sm text-gray-600">Create personalized assessments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}