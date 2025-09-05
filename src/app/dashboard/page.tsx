'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Users, FileText, Sparkles, ArrowRight, Target, BarChart, TrendingUp } from 'lucide-react'
import Link from 'next/link'

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
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-4 md:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Exam Pro</h1>
            <p className="text-white/80 text-base md:text-lg mb-6 max-w-2xl">
              Transform your teaching with AI-powered personalized question generation. 
              Create contextually relevant exams tailored to each student group while maintaining 
              consistent learning objectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/generator">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white w-full sm:w-auto">
                  <Brain className="h-5 w-5 mr-2" />
                  Start Generating Questions
                </Button>
              </Link>
              <Link href="/dashboard/groups">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                  <Users className="h-5 w-5 mr-2" />
                  Manage Student Groups
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-teal-500/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-16 w-16 text-teal-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-teal-100 rounded-xl w-fit">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
          <Link href="/dashboard/generator">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-teal-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                <Brain className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="mb-2">AI Question Generator</CardTitle>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Create personalized questions adapted to each student group's context and interests
              </p>
              <div className="flex items-center justify-center text-teal-600 font-medium text-sm md:text-base">
                Generate Questions
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
          <Link href="/dashboard/groups">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="mb-2">Manage Student Groups</CardTitle>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Configure student groups with their majors, interests, and keywords for better contextualization
              </p>
              <div className="flex items-center justify-center text-blue-600 font-medium text-sm md:text-base">
                Manage Groups
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
          <Link href="/dashboard/analytics">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <BarChart className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="mb-2">View Analytics</CardTitle>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Track question effectiveness, student engagement, and generation analytics
              </p>
              <div className="flex items-center justify-center text-purple-600 font-medium text-sm md:text-base">
                View Analytics
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Sparkles className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Generated 5 question variations for Finance group</p>
                <p className="text-sm text-gray-600">Statistics exam - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Added 15 students to Engineering group</p>
                <p className="text-sm text-gray-600">CSV import - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Created new exam template</p>
                <p className="text-sm text-gray-600">Linear Algebra exam - Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}