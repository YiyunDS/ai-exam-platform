'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingPage } from '@/components/ui/loading-skeleton'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

interface DashboardStats {
  totalStudents: number
  totalClusters: number
  totalQuestions: number
  totalExams: number
  recentActivity: Array<{
    id: string
    action: string
    resourceType: string
    details: any
    createdAt: string
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch all stats in parallel
        const [
          studentsResult,
          clustersResult,
          questionsResult,
          examsResult,
          activityResult
        ] = await Promise.all([
          supabase
            .from('students')
            .select('id', { count: 'exact' })
            .eq('teacher_id', user.id)
            .eq('active', true),
          supabase
            .from('clusters')
            .select('id', { count: 'exact' })
            .eq('teacher_id', user.id),
          supabase
            .from('questions')
            .select('id', { count: 'exact' })
            .eq('teacher_id', user.id),
          supabase
            .from('exams')
            .select('id', { count: 'exact' })
            .eq('teacher_id', user.id),
          supabase
            .from('activity_logs')
            .select('*')
            .eq('teacher_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
        ])

        setStats({
          totalStudents: studentsResult.count || 0,
          totalClusters: clustersResult.count || 0,
          totalQuestions: questionsResult.count || 0,
          totalExams: examsResult.count || 0,
          recentActivity: activityResult.data || []
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingPage title="Dashboard" actionLabel="Loading dashboard..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/students">
          <Button>Add Students</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-gray-500">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Student Clusters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClusters || 0}</div>
            <p className="text-xs text-gray-500">AI-generated groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalQuestions || 0}</div>
            <p className="text-xs text-gray-500">In question bank</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalExams || 0}</div>
            <p className="text-xs text-gray-500">Created exams</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>👥</span>
              Manage Students
            </CardTitle>
            <CardDescription>
              Import, add, or organize your student data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/students" className="block">
                <Button variant="outline" className="w-full">
                  View All Students
                </Button>
              </Link>
              <Link href="/dashboard/students/import" className="block">
                <Button variant="ghost" className="w-full">
                  Import from CSV
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎯</span>
              AI Clustering
            </CardTitle>
            <CardDescription>
              Let AI group students for personalized questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/clusters" className="block">
                <Button variant="outline" className="w-full">
                  View Clusters
                </Button>
              </Link>
              <Button variant="ghost" className="w-full" disabled={!stats?.totalStudents}>
                Generate New Clusters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>❓</span>
              Create Questions
            </CardTitle>
            <CardDescription>
              Build your question bank and customize for clusters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/questions/new" className="block">
                <Button variant="outline" className="w-full">
                  Create Question
                </Button>
              </Link>
              <Link href="/dashboard/questions" className="block">
                <Button variant="ghost" className="w-full">
                  View Question Bank
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest actions on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">
                      {activity.action} {activity.resourceType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p className="text-sm">Start by adding students or creating questions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      {!stats?.totalStudents && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🚀 Getting Started</CardTitle>
            <CardDescription className="text-blue-700">
              Welcome to AI Exam Platform! Here&apos;s how to get started:
            </CardDescription>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                <Link href="/dashboard/students" className="underline hover:text-blue-600">
                  Add your students
                </Link>
                {' '}manually or import from CSV
              </li>
              <li>Let AI automatically group students into clusters</li>
              <li>Create baseline questions for your subjects</li>
              <li>Generate personalized versions using AI</li>
              <li>Build and export customized exams</li>
            </ol>
            <div className="mt-4">
              <Link href="/dashboard/students">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start with Students
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}