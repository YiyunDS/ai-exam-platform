'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import type { Question } from '@/lib/types'

interface CustomizedQuestion {
  id: string
  questionId: string
  clusterId: string
  customizedText: string
  contextDescription: string
  status: 'pending_review' | 'approved' | 'rejected'
  customizationMetadata: any
  createdAt: string
  cluster?: {
    id: string
    name: string
    characteristics: any
  }
}

export default function QuestionReviewPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  const [question, setQuestion] = useState<Question | null>(null)
  const [customizedQuestions, setCustomizedQuestions] = useState<CustomizedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchQuestionAndCustomizations()
  }, [questionId])

  const fetchQuestionAndCustomizations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch question
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .eq('teacher_id', user.id)
        .single()

      if (questionError || !questionData) {
        console.error('Error fetching question:', questionError)
        router.push('/dashboard/questions')
        return
      }

      setQuestion(questionData)

      // Fetch customized questions with cluster info
      const { data: customizedData, error: customizedError } = await supabase
        .from('customized_questions')
        .select(`
          *,
          cluster:clusters(id, name, characteristics)
        `)
        .eq('question_id', questionId)
        .order('created_at', { ascending: false })

      if (customizedError) {
        console.error('Error fetching customized questions:', customizedError)
        return
      }

      setCustomizedQuestions(customizedData || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (customizedQuestionId: string, approved: boolean, feedback?: string) => {
    setProcessing(customizedQuestionId)

    try {
      const { error } = await supabase
        .from('customized_questions')
        .update({
          status: approved ? 'approved' : 'rejected',
          review_feedback: feedback,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', customizedQuestionId)

      if (error) {
        throw error
      }

      // Update local state
      setCustomizedQuestions(prev =>
        prev.map(cq =>
          cq.id === customizedQuestionId
            ? { ...cq, status: approved ? 'approved' : 'rejected' as const }
            : cq
        )
      )

      // Log activity
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('activity_logs')
          .insert({
            teacher_id: user.id,
            action: approved ? 'approved' : 'rejected',
            resource_type: 'customized_question',
            details: {
              question_id: questionId,
              customized_question_id: customizedQuestionId,
              feedback
            }
          })
      }
    } catch (error) {
      console.error('Error updating approval status:', error)
      alert('Error updating approval status. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const handleBulkApproval = async (approved: boolean) => {
    const pendingQuestions = customizedQuestions.filter(cq => cq.status === 'pending_review')
    
    for (const cq of pendingQuestions) {
      await handleApproval(cq.id, approved)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✓'
      case 'rejected':
        return '✗'
      case 'pending_review':
        return '⏳'
      default:
        return '❓'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/questions" className="text-blue-600 hover:text-blue-500">
            ← Back to Questions
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customizations...</p>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/questions" className="text-blue-600 hover:text-blue-500">
            ← Back to Questions
          </Link>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Question not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const pendingCount = customizedQuestions.filter(cq => cq.status === 'pending_review').length
  const approvedCount = customizedQuestions.filter(cq => cq.status === 'approved').length
  const rejectedCount = customizedQuestions.filter(cq => cq.status === 'rejected').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/questions" className="text-blue-600 hover:text-blue-500">
          ← Back to Questions
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Customizations</h1>
          <p className="text-gray-600 mt-1">Review and approve AI-generated question variations</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleBulkApproval(false)}
              disabled={processing !== null}
            >
              Reject All Pending
            </Button>
            <Button
              onClick={() => handleBulkApproval(true)}
              disabled={processing !== null}
            >
              Approve All Pending
            </Button>
          </div>
        )}
      </div>

      {/* Question Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Original Question</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{question.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span>{question.subject}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  question.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                  question.difficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {question.difficultyLevel}
                </span>
                <span>•</span>
                <span>{question.questionType}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800">{question.baselineQuestion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{customizedQuestions.length}</div>
            <div className="text-sm text-gray-600">Total Customizations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Customized Questions */}
      {customizedQuestions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-medium mb-2">No customizations yet</h3>
            <p className="text-gray-600 mb-6">
              Create customized versions of this question for your student clusters
            </p>
            <Link href={`/dashboard/questions/${questionId}/customize`}>
              <Button>Customize Question</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {customizedQuestions.map((customized) => (
            <Card key={customized.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {customized.cluster?.name || 'Unknown Cluster'}
                    </CardTitle>
                    {customized.contextDescription && (
                      <CardDescription>{customized.contextDescription}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customized.status)}`}>
                      {getStatusIcon(customized.status)} {customized.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Customized Question Text */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {customized.customizedText}
                    </p>
                  </div>

                  {/* Metadata */}
                  {customized.customizationMetadata && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-gray-50 rounded p-3">
                        <div className="font-medium text-gray-700">Customization Level</div>
                        <div className="text-gray-600 capitalize">
                          {customized.customizationMetadata.customizationLevel || 'Medium'}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="font-medium text-gray-700">Tokens Used</div>
                        <div className="text-gray-600">
                          {customized.customizationMetadata.tokensUsed || 'N/A'}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="font-medium text-gray-700">Processing Time</div>
                        <div className="text-gray-600">
                          {customized.customizationMetadata.processingTime || 'N/A'}ms
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="font-medium text-gray-700">Cost</div>
                        <div className="text-gray-600">
                          ${(customized.customizationMetadata.cost || 0).toFixed(4)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cluster Information */}
                  {customized.cluster && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-2">Target Cluster Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Students:</span> {customized.cluster.characteristics?.studentCount || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Avg GPA:</span> {customized.cluster.characteristics?.averageGPA?.toFixed(2) || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Major:</span> {customized.cluster.characteristics?.dominantMajor || 'Mixed'}
                        </div>
                      </div>
                      {customized.cluster.characteristics?.commonInterests && customized.cluster.characteristics.commonInterests.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">Common Interests:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {customized.cluster.characteristics.commonInterests.slice(0, 5).map((interest: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {customized.status === 'pending_review' && (
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => handleApproval(customized.id, false)}
                        disabled={processing === customized.id}
                        className="flex-1"
                      >
                        {processing === customized.id ? 'Processing...' : 'Reject'}
                      </Button>
                      <Button
                        onClick={() => handleApproval(customized.id, true)}
                        disabled={processing === customized.id}
                        className="flex-1"
                      >
                        {processing === customized.id ? 'Processing...' : 'Approve'}
                      </Button>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="text-xs text-gray-500 border-t pt-2">
                    Created: {new Date(customized.createdAt).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}