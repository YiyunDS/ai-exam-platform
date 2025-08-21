'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { generateExamPDF, generateAnswerKeyPDF, downloadPDF, openPDFInNewTab } from '@/lib/utils/pdfExport'

interface ExamData {
  id: string
  title: string
  description: string
  instructions: string
  timeLimit: number
  totalPoints: number
  status: string
  createdAt: string
  teacher: {
    name: string
    email: string
  }
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

export default function ExamExportPage() {
  const params = useParams()
  const examId = params.id as string
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState<string | null>(null)

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
          ),
          teacher:profiles(full_name, email)
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
        teacher: {
          name: data.teacher?.full_name || 'Unknown Teacher',
          email: data.teacher?.email || ''
        },
        examQuestions: data.exam_questions.map((eq: Record<string, any>) => ({
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

  const handleExportExam = async (format: 'download' | 'preview') => {
    if (!examData) return

    setExporting('exam')
    try {
      const pdf = generateExamPDF({
        title: examData.title,
        description: examData.description,
        instructions: examData.instructions,
        timeLimit: examData.timeLimit,
        totalPoints: examData.totalPoints,
        questions: examData.examQuestions,
        teacher: examData.teacher,
        createdAt: examData.createdAt
      })

      if (format === 'download') {
        downloadPDF(pdf, `${examData.title.replace(/[^a-zA-Z0-9]/g, '_')}_Exam.pdf`)
      } else {
        openPDFInNewTab(pdf)
      }

      // Log activity
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('activity_logs')
          .insert({
            teacher_id: user.id,
            action: 'exported',
            resource_type: 'exam',
            details: {
              exam_id: examId,
              export_type: 'pdf',
              export_format: format
            }
          })
      }
    } catch (error) {
      console.error('Error exporting exam:', error)
      alert('Error exporting exam. Please try again.')
    } finally {
      setExporting(null)
    }
  }

  const handleExportAnswerKey = async (format: 'download' | 'preview') => {
    if (!examData) return

    setExporting('answer-key')
    try {
      const pdf = generateAnswerKeyPDF({
        title: examData.title,
        description: examData.description,
        instructions: examData.instructions,
        timeLimit: examData.timeLimit,
        totalPoints: examData.totalPoints,
        questions: examData.examQuestions,
        teacher: examData.teacher,
        createdAt: examData.createdAt
      })

      if (format === 'download') {
        downloadPDF(pdf, `${examData.title.replace(/[^a-zA-Z0-9]/g, '_')}_Answer_Key.pdf`)
      } else {
        openPDFInNewTab(pdf)
      }

      // Log activity
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('activity_logs')
          .insert({
            teacher_id: user.id,
            action: 'exported',
            resource_type: 'exam',
            details: {
              exam_id: examId,
              export_type: 'answer_key_pdf',
              export_format: format
            }
          })
      }
    } catch (error) {
      console.error('Error exporting answer key:', error)
      alert('Error exporting answer key. Please try again.')
    } finally {
      setExporting(null)
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
          <p className="mt-4 text-gray-600">Loading exam...</p>
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

  const examStats = {
    totalQuestions: examData.examQuestions.length,
    totalPoints: examData.totalPoints,
    averagePoints: examData.totalPoints / examData.examQuestions.length,
    questionTypes: [...new Set(examData.examQuestions.map(eq => eq.customizedQuestion.question.questionType))],
    subjects: [...new Set(examData.examQuestions.map(eq => eq.customizedQuestion.question.subject))],
    clusters: [...new Set(examData.examQuestions.map(eq => eq.customizedQuestion.cluster.name))],
    difficulties: {
      Easy: examData.examQuestions.filter(eq => eq.customizedQuestion.question.difficultyLevel === 'Easy').length,
      Medium: examData.examQuestions.filter(eq => eq.customizedQuestion.question.difficultyLevel === 'Medium').length,
      Hard: examData.examQuestions.filter(eq => eq.customizedQuestion.question.difficultyLevel === 'Hard').length
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams" className="text-blue-600 hover:text-blue-500">
          ← Back to Exams
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Export Exam</h1>
          <p className="text-gray-600 mt-1">Generate PDF versions of your exam for distribution</p>
        </div>
      </div>

      {/* Exam Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{examData.title}</CardTitle>
          <CardDescription>
            {examData.description || 'No description provided'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Exam Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Time Limit:</span>
                  <span>{examData.timeLimit} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Points:</span>
                  <span>{examData.totalPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span>{examStats.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Points/Question:</span>
                  <span>{examStats.averagePoints.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    examData.status === 'published' ? 'bg-green-100 text-green-800' :
                    examData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {examData.status.charAt(0).toUpperCase() + examData.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Question Distribution</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">By Difficulty:</span>
                  <div className="ml-4 mt-1">
                    <div className="flex justify-between">
                      <span>Easy:</span>
                      <span>{examStats.difficulties.Easy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium:</span>
                      <span>{examStats.difficulties.Medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hard:</span>
                      <span>{examStats.difficulties.Hard}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Subjects:</span>
                  <div className="ml-4 mt-1">
                    {examStats.subjects.map(subject => (
                      <div key={subject} className="text-xs bg-gray-100 rounded px-2 py-1 inline-block mr-1 mb-1">
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Student Clusters:</span>
                  <div className="ml-4 mt-1">
                    {examStats.clusters.map(cluster => (
                      <div key={cluster} className="text-xs bg-blue-100 rounded px-2 py-1 inline-block mr-1 mb-1">
                        {cluster}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Exam */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📝 Student Exam
            </CardTitle>
            <CardDescription>
              Generate the exam for student distribution with answer spaces
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Includes:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                <li>Complete exam questions</li>
                <li>Student information section</li>
                <li>Answer spaces based on question type</li>
                <li>Instructions and time limit</li>
                <li>Point values for each question</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExportExam('preview')}
                disabled={exporting === 'exam'}
                variant="outline"
                className="flex-1"
              >
                {exporting === 'exam' ? 'Generating...' : 'Preview'}
              </Button>
              <Button
                onClick={() => handleExportExam('download')}
                disabled={exporting === 'exam'}
                className="flex-1"
              >
                {exporting === 'exam' ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Key */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔑 Answer Key
            </CardTitle>
            <CardDescription>
              Generate the instructor answer key with grading rubrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Includes:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                <li>Question summaries</li>
                <li>Answer spaces for grading notes</li>
                <li>Point distribution breakdown</li>
                <li>Grading rubric guidelines</li>
                <li>Question metadata and context</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExportAnswerKey('preview')}
                disabled={exporting === 'answer-key'}
                variant="outline"
                className="flex-1"
              >
                {exporting === 'answer-key' ? 'Generating...' : 'Preview'}
              </Button>
              <Button
                onClick={() => handleExportAnswerKey('download')}
                disabled={exporting === 'answer-key'}
                className="flex-1"
              >
                {exporting === 'answer-key' ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Export Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Best Practices</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Preview before downloading to check formatting</li>
                <li>Download both student exam and answer key</li>
                <li>Print test copies before distribution</li>
                <li>Keep digital copies for record keeping</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Technical Notes</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>PDFs are optimized for standard 8.5x11&quot; paper</li>
                <li>Questions automatically paginate to avoid splitting</li>
                <li>Answer spaces scale based on question type and points</li>
                <li>All exports include exam metadata and branding</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}