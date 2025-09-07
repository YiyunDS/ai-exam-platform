'use client'

import React from 'react'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Brain,
  Award,
  Activity,
  Calendar,
  ChevronRight,
  BarChart,
  Clock,
  Target,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  icon: React.ComponentType<any>
  value: string
  label: string
  change: string
  color: string
}

interface RecentGeneration {
  id: number
  subject: string
  baseline: string
  groups: string[]
  timestamp: string
  status: 'completed' | 'generating' | 'failed'
}

const ProfessorDashboard: React.FC = () => {
  const stats: DashboardStats[] = [
    { 
      icon: FileText, 
      value: '1,256', 
      label: 'Questions Generated', 
      change: '+12%',
      color: '#4ECDC4' 
    },
    { 
      icon: Users, 
      value: '218', 
      label: 'Active Students', 
      change: '+5%',
      color: '#4F46E5' 
    },
    { 
      icon: Brain, 
      value: '6', 
      label: 'Student Groups', 
      change: '0',
      color: '#10B981' 
    },
    { 
      icon: Award, 
      value: '94%', 
      label: 'Engagement Rate', 
      change: '+8%',
      color: '#EC4899' 
    }
  ]

  const recentGenerations: RecentGeneration[] = [
    {
      id: 1,
      subject: 'Statistics',
      baseline: 'Calculate mean and standard deviation for investment data',
      groups: ['Finance', 'Marketing', 'Engineering'],
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      subject: 'Linear Algebra',
      baseline: 'Find eigenvalues of transformation matrix',
      groups: ['Engineering', 'Medicine'],
      timestamp: '5 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      subject: 'Probability',
      baseline: 'Calculate conditional probability for diagnosis',
      groups: ['Finance', 'Sports Science', 'Medicine'],
      timestamp: 'Yesterday',
      status: 'completed'
    },
    {
      id: 4,
      subject: 'Calculus',
      baseline: 'Optimize performance metrics using derivatives',
      groups: ['Engineering', 'Sports Science'],
      timestamp: '2 days ago',
      status: 'generating'
    }
  ]

  const groupEngagementData = [
    { name: 'Finance', code: 'FIN', engagement: 85, color: '#4F46E5' },
    { name: 'Marketing', code: 'MKT', engagement: 92, color: '#EC4899' },
    { name: 'Engineering', code: 'ENG', engagement: 78, color: '#10B981' },
    { name: 'Medicine', code: 'MED', engagement: 88, color: '#EF4444' },
    { name: 'Liberal Arts', code: 'ART', engagement: 75, color: '#A855F7' },
    { name: 'Sports Science', code: 'SPT', engagement: 95, color: '#F59E0B' }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'generating': return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      case 'failed': return <div className="w-2 h-2 bg-red-500 rounded-full" />
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Professor Smith</h1>
            <p className="text-white/80 text-lg">Here's your personalized question generation overview</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Exam
            </Button>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Brain className="h-4 w-4 mr-2" />
              Generate Questions
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className={`flex items-center gap-1 text-sm font-medium mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change === '0' ? 'text-gray-500' : 'text-red-600'
                  }`}>
                    {stat.change !== '0' && <TrendingUp className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Generations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                Recent Question Generations
              </CardTitle>
              <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGenerations.map((generation) => (
                <div 
                  key={generation.id} 
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(generation.status)}
                      <h3 className="font-semibold text-gray-900">{generation.subject}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{generation.baseline}</p>
                    <div className="flex gap-2 flex-wrap">
                      {generation.groups.map((group) => (
                        <span 
                          key={group} 
                          className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-700"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-500 mb-2">{generation.timestamp}</div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Activity className="h-5 w-5" />
              Student Engagement by Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupEngagementData.map((group) => (
                <div key={group.code} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <span className="text-gray-600">{group.engagement}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${group.engagement}%`,
                        backgroundColor: group.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Average Engagement</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(groupEngagementData.reduce((sum, g) => sum + g.engagement, 0) / groupEngagementData.length)}%
              </div>
              <div className="text-xs text-gray-500">
                +3% from last month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-teal-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
              <Sparkles className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="font-semibold mb-2">Generate New Questions</h3>
            <p className="text-sm text-gray-600 mb-4">Create personalized questions for your student groups</p>
            <Button className="w-full bg-teal-500 hover:bg-teal-600">
              Start Generator
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <BarChart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">View Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">Analyze question effectiveness and student performance</p>
            <Button variant="outline" className="w-full">
              Open Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Manage Groups</h3>
            <p className="text-sm text-gray-600 mb-4">Configure student groups and their interests</p>
            <Button variant="outline" className="w-full">
              Manage Groups
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfessorDashboard