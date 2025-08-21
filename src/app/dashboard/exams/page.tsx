'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

interface Exam {
  id: string
  title: string
  description: string
  instructions: string
  timeLimit: number
  totalQuestions: number
  totalPoints: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          exam_questions(count)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching exams:', error)
        return
      }

      // Transform data to include question counts
      const transformedData = (data || []).map(exam => ({
        ...exam,
        totalQuestions: exam.exam_questions?.[0]?.count || 0,
        totalPoints: exam.total_points || 0
      }))

      setExams(transformedData)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !selectedStatus || exam.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return '🟢'
      case 'draft': return '🟡'
      case 'archived': return '⚫'
      default: return '❓'
    }
  }

  const formatTimeLimit = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Exams</h1>
          <Button disabled>Create Exam</Button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exams</h1>
        <Link href="/dashboard/exams/new">
          <Button>Create Exam</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search exams by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{exams.length}</div>
            <div className="text-sm text-gray-600">Total Exams</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {exams.filter(e => e.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {exams.filter(e => e.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {exams.reduce((sum, e) => sum + e.totalQuestions, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      {filteredExams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {exams.length === 0 ? (
              <div>
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium mb-2">No exams yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first exam using your customized questions
                </p>
                <Link href="/dashboard/exams/new">
                  <Button>Create First Exam</Button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">No exams match your search</p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedStatus('')
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📝</span>
                      <div>
                        <h3 className="font-semibold text-lg">{exam.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(exam.status)}`}>
                            {getStatusIcon(exam.status)} {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                          </span>
                          <span>•</span>
                          <span>{exam.totalQuestions} questions</span>
                          <span>•</span>
                          <span>{exam.totalPoints} points</span>
                          <span>•</span>
                          <span>{formatTimeLimit(exam.timeLimit)}</span>
                        </div>
                      </div>
                    </div>

                    {exam.description && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {exam.description.length > 200
                            ? `${exam.description.substring(0, 200)}...`
                            : exam.description
                          }
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>Created {new Date(exam.createdAt).toLocaleDateString()}</span>
                        <span>Updated {new Date(exam.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/dashboard/exams/${exam.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/dashboard/exams/${exam.id}/preview`}>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </Link>
                    {exam.status === 'published' && (
                      <Link href={`/dashboard/exams/${exam.id}/export`}>
                        <Button size="sm">
                          Export
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Start Guide */}
      {exams.length === 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🚀 Getting Started with Exams</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">1. Create Questions</h4>
                <p className="text-sm mb-4">
                  Start by creating baseline questions and customizing them for your student clusters.
                </p>
                
                <h4 className="font-medium mb-2">2. Build Exams</h4>
                <p className="text-sm">
                  Combine your approved customized questions into comprehensive exams 
                  tailored for specific student groups.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Set clear exam instructions and time limits</li>
                  <li>Balance question types and difficulty levels</li>
                  <li>Review all questions before publishing</li>
                  <li>Export to PDF for offline distribution</li>
                  <li>Track exam performance and analytics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}