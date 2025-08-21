'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

interface ExamData {
  id: string
  title: string
  description: string
  instructions: string
  timeLimit: number
  totalPoints: number
  status: string
  createdAt: string
  examQuestions: Array<{
    orderIndex: number
    points: number
    customizedQuestion: {
      customizedText: string
      contextDescription: string
      question: {
        title: string
        questionType: string
        difficultyLevel: string
        subject: string
      }
      cluster: {
        name: string
      }
    }
  }>
}

export default function ExamPreviewPage() {
  const params = useParams()
  const examId = params.id as string
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExamData()
  }, [examId])

  const fetchExamData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          exam_questions!inner(
            order_index,
            points,
            customized_question:customized_questions(
              customized_text,
              context_description,
              question:questions(
                title,
                question_type,
                difficulty_level,
                subject
              ),
              cluster:clusters(name)
            )
          )
        `)
        .eq('id', examId)
        .eq('teacher_id', user.id)
        .single()

      if (error || !data) {
        console.error('Error fetching exam:', error)
        return
      }

      // Transform the data structure
      const transformedData: ExamData = {
        ...data,
        examQuestions: data.exam_questions.map((eq: any) => ({
          orderIndex: eq.order_index,
          points: eq.points,
          customizedQuestion: {
            customizedText: eq.customized_question.customized_text,
            contextDescription: eq.customized_question.context_description,
            question: {
              title: eq.customized_question.question.title,
              questionType: eq.customized_question.question.question_type,
              difficultyLevel: eq.customized_question.question.difficulty_level,
              subject: eq.customized_question.question.subject
            },
            cluster: {
              name: eq.customized_question.cluster.name
            }
          }
        }))
      }

      setExamData(transformedData)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAnswerSpaceLines = (questionType: string, points: number) => {
    switch (questionType) {
      case 'Short Answer':
        return Math.min(Math.max(2, Math.ceil(points / 3)), 6)
      case 'Essay':
        return Math.min(Math.max(8, Math.ceil(points / 2)), 20)
      case 'Problem Solving':
        return Math.min(Math.max(4, Math.ceil(points / 2)), 15)
      case 'Multiple Choice':
        return 0 // No lines needed for multiple choice
      default:
        return 4
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/exams" className="text-blue-600 hover:text-blue-500">
            ← Back to Exams
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam preview...</p>
        </div>
      </div>
    )
  }

  if (!examData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/exams" className="text-blue-600 hover:text-blue-500">
            ← Back to Exams
          </Link>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Exam not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sortedQuestions = examData.examQuestions.sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams" className="text-blue-600 hover:text-blue-500">
          ← Back to Exams
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exam Preview</h1>
          <p className="text-gray-600 mt-1">Student view of your exam</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/exams/${examId}`}>
            <Button variant="outline">Edit Exam</Button>
          </Link>
          {examData.status === 'published' && (
            <Link href={`/dashboard/exams/${examId}/export`}>
              <Button>Export PDF</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Exam Paper */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Exam Header */}
          <div className="border-b-2 border-gray-300 p-8">
            <h1 className="text-3xl font-bold text-center mb-6">{examData.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Time Limit:</strong> {examData.timeLimit} minutes
              </div>
              <div>
                <strong>Total Points:</strong> {examData.totalPoints}
              </div>
              <div>
                <strong>Number of Questions:</strong> {examData.examQuestions.length}
              </div>
              <div>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </div>
            </div>

            {examData.description && (
              <div className="mt-4">
                <strong>Description:</strong> {examData.description}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="p-8 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">Instructions:</h2>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {examData.instructions}
            </p>
          </div>

          {/* Student Information */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Student Information:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b border-gray-400 pb-1">
                <span className="text-sm text-gray-600">Name:</span>
              </div>
              <div className="border-b border-gray-400 pb-1">
                <span className="text-sm text-gray-600">Student ID:</span>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="p-8 space-y-8">
            {sortedQuestions.map((examQuestion, index) => {
              const questionNumber = index + 1
              const question = examQuestion.customizedQuestion
              const answerLines = getAnswerSpaceLines(question.question.questionType, examQuestion.points)

              return (
                <div key={questionNumber} className="border-b border-gray-200 pb-8 last:border-b-0">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Question {questionNumber}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(question.question.difficultyLevel)}`}>
                        {question.question.difficultyLevel}
                      </span>
                      <span className="text-sm font-medium">
                        ({examQuestion.points} points)
                      </span>
                    </div>
                  </div>

                  {/* Question Type and Subject */}
                  <div className="text-sm text-gray-600 mb-2">
                    {question.question.questionType} • {question.question.subject} • {question.cluster.name}
                  </div>

                  {/* Context */}
                  {question.contextDescription && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                      <p className="text-sm text-blue-800 italic">
                        <strong>Context:</strong> {question.contextDescription}
                      </p>
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                      {question.customizedText}
                    </p>
                  </div>

                  {/* Answer Space */}
                  <div className="mt-4">
                    {question.question.questionType === 'Multiple Choice' ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Select the best answer:</p>
                        <div className="grid grid-cols-1 gap-2 ml-4">
                          {['A)', 'B)', 'C)', 'D)'].map((option, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <span className="font-mono text-sm">{option}</span>
                              <div className="border-b border-gray-400 flex-1 pb-1"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Answer:</p>
                        <div className="space-y-2">
                          {Array.from({ length: answerLines }, (_, i) => (
                            <div key={i} className="border-b border-gray-400 h-6"></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 p-4 text-center text-sm text-gray-600">
            <p>End of Exam - Please review your answers before submitting</p>
          </div>
        </div>
      </div>

      {/* Preview Notes */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">📋 Preview Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800">
          <ul className="space-y-1 list-disc list-inside text-sm">
            <li>This preview shows how the exam will appear to students</li>
            <li>Answer spaces are automatically sized based on question type and point value</li>
            <li>Multiple choice questions include standard A-D options</li>
            <li>Question context and metadata are displayed for reference</li>
            <li>Export to PDF for final formatting and distribution</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}