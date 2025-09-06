'use client'

import React, { useState } from 'react'
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
  Sparkles,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DashboardStats {
  icon: React.ComponentType<any>
  value: string
  label: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  color: string
}

interface RecentGeneration {
  id: number
  subject: string
  baseline: string
  groups: string[]
  timestamp: string
  status: 'completed' | 'generating' | 'failed'
  questionsGenerated: number
}

interface Student {
  id: number
  name: string
  email: string
  major: string
  academicLevel: string
  gpa: number
  questionsCompleted: number
  averageScore: number
  lastActive: string
}

const ImprovedProfessorDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')

  const stats: DashboardStats[] = [
    { 
      icon: FileText, 
      value: '1,256', 
      label: 'Questions Generated', 
      change: '+12%',
      changeType: 'positive',
      color: 'hsl(var(--chart-1))' 
    },
    { 
      icon: Users, 
      value: '218', 
      label: 'Active Students', 
      change: '+5%',
      changeType: 'positive',
      color: 'hsl(var(--chart-2))' 
    },
    { 
      icon: Brain, 
      value: '6', 
      label: 'Student Groups', 
      change: '0',
      changeType: 'neutral',
      color: 'hsl(var(--chart-3))' 
    },
    { 
      icon: Award, 
      value: '94%', 
      label: 'Engagement Rate', 
      change: '+8%',
      changeType: 'positive',
      color: 'hsl(var(--chart-4))' 
    }
  ]

  const recentGenerations: RecentGeneration[] = [
    {
      id: 1,
      subject: 'Statistics',
      baseline: 'Calculate mean and standard deviation for investment data',
      groups: ['Finance', 'Marketing', 'Engineering'],
      timestamp: '2 hours ago',
      status: 'completed',
      questionsGenerated: 15
    },
    {
      id: 2,
      subject: 'Linear Algebra',
      baseline: 'Find eigenvalues of transformation matrix',
      groups: ['Engineering', 'Medicine'],
      timestamp: '5 hours ago',
      status: 'completed',
      questionsGenerated: 10
    },
    {
      id: 3,
      subject: 'Probability',
      baseline: 'Calculate conditional probability for diagnosis',
      groups: ['Finance', 'Sports Science', 'Medicine'],
      timestamp: 'Yesterday',
      status: 'generating',
      questionsGenerated: 8
    },
    {
      id: 4,
      subject: 'Calculus',
      baseline: 'Optimize performance metrics using derivatives',
      groups: ['Engineering', 'Sports Science'],
      timestamp: '2 days ago',
      status: 'completed',
      questionsGenerated: 12
    }
  ]

  const students: Student[] = [
    {
      id: 1,
      name: 'Emma Thompson',
      email: 'emma.t@university.edu',
      major: 'Computer Science',
      academicLevel: 'Junior',
      gpa: 3.8,
      questionsCompleted: 45,
      averageScore: 87,
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'm.chen@university.edu',
      major: 'Finance',
      academicLevel: 'Senior',
      gpa: 3.6,
      questionsCompleted: 38,
      averageScore: 82,
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      major: 'Medicine',
      academicLevel: 'Graduate',
      gpa: 3.9,
      questionsCompleted: 52,
      averageScore: 91,
      lastActive: '3 hours ago'
    },
    {
      id: 4,
      name: 'David Rodriguez',
      email: 'd.rodriguez@university.edu',
      major: 'Engineering',
      academicLevel: 'Sophomore',
      gpa: 3.4,
      questionsCompleted: 28,
      averageScore: 78,
      lastActive: '5 hours ago'
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      completed: 'default',
      generating: 'secondary',
      failed: 'destructive'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getChangeIcon = (changeType: string) => {
    if (changeType === 'positive') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (changeType === 'negative') return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
    return <Activity className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Professor Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and track student progress</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Question
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {getChangeIcon(stat.changeType)}
                    <span>{stat.change} from last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Question Generations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Recent Question Generations
                  </CardTitle>
                  <CardDescription>Your latest AI-generated questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {recentGenerations.map((gen) => (
                        <div key={gen.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold">{gen.subject}</h4>
                              {getStatusBadge(gen.status)}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {gen.baseline}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex flex-wrap gap-1">
                                {gen.groups.map((group) => (
                                  <Badge key={group} variant="outline" className="text-xs">
                                    {group}
                                  </Badge>
                                ))}
                              </div>
                              <span>{gen.timestamp}</span>
                            </div>
                            {gen.status === 'generating' && (
                              <Progress value={65} className="mt-2 h-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Create New Question Set
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Import Students (CSV)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    Manage Student Groups
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart className="h-4 w-4 mr-2" />
                    View Performance Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Assessment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Students Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage your students and track their progress</CardDescription>
                <div className="flex gap-2 pt-4">
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Major</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.major}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.academicLevel}</Badge>
                        </TableCell>
                        <TableCell>{student.gpa}</TableCell>
                        <TableCell>{student.questionsCompleted}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{student.averageScore}%</span>
                            <Progress value={student.averageScore} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{student.lastActive}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            {/* Questions Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Question Bank</CardTitle>
                <CardDescription>Manage your question library and generation history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Question Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced question management features coming soon
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Tab */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Student performance analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Trends</CardTitle>
                  <CardDescription>Track student engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Engagement tracking coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ImprovedProfessorDashboard