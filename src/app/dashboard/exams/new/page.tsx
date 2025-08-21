'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

interface Question {
  id: string
  title: string
  baselineQuestion: string
  subject: string
  difficultyLevel: string
  questionType: string
  learningObjectives: string[]
}

interface CustomizedQuestion {
  id: string
  questionId: string
  clusterId: string
  customizedText: string
  contextDescription: string
  status: string
  question: Question
  cluster: {
    id: string
    name: string
  }
}

interface ExamQuestion {
  customizedQuestionId: string
  points: number
  orderIndex: number
  customizedQuestion: CustomizedQuestion
}

export default function NewExamPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [customizedQuestions, setCustomizedQuestions] = useState<CustomizedQuestion[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<ExamQuestion[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedCluster, setSelectedCluster] = useState('')
  const [clusters, setClusters] = useState<Array<{id: string, name: string}>>([])
  
  // Form data
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    instructions: 'Read each question carefully and provide your best answer. Show your work for calculation problems.',
    timeLimit: 120, // minutes
  })

  useEffect(() => {
    fetchCustomizedQuestions()
    fetchClusters()
  }, [])

  const fetchCustomizedQuestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('customized_questions')
        .select(`
          *,
          question:questions(*),
          cluster:clusters(id, name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching customized questions:', error)
        return
      }

      setCustomizedQuestions(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchClusters = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('clusters')
        .select('id, name')
        .eq('teacher_id', user.id)
        .eq('status', 'active')

      if (error) {
        console.error('Error fetching clusters:', error)
        return
      }

      setClusters(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filteredQuestions = customizedQuestions.filter(cq => {
    const matchesSearch = cq.question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cq.customizedText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || cq.question.subject === selectedSubject
    const matchesCluster = !selectedCluster || cq.clusterId === selectedCluster
    const notSelected = !selectedQuestions.find(sq => sq.customizedQuestionId === cq.id)

    return matchesSearch && matchesSubject && matchesCluster && notSelected
  })

  const subjects = [...new Set(customizedQuestions.map(cq => cq.question.subject))].sort()

  const addQuestion = (customizedQuestion: CustomizedQuestion) => {
    const newExamQuestion: ExamQuestion = {
      customizedQuestionId: customizedQuestion.id,
      points: getDefaultPoints(customizedQuestion.question.difficultyLevel),
      orderIndex: selectedQuestions.length,
      customizedQuestion
    }
    setSelectedQuestions([...selectedQuestions, newExamQuestion])
  }

  const removeQuestion = (customizedQuestionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(sq => sq.customizedQuestionId !== customizedQuestionId))
  }

  const updateQuestionPoints = (customizedQuestionId: string, points: number) => {
    setSelectedQuestions(selectedQuestions.map(sq =>
      sq.customizedQuestionId === customizedQuestionId
        ? { ...sq, points }
        : sq
    ))
  }

  const moveQuestion = (customizedQuestionId: string, direction: 'up' | 'down') => {
    const currentIndex = selectedQuestions.findIndex(sq => sq.customizedQuestionId === customizedQuestionId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= selectedQuestions.length) return

    const newQuestions = [...selectedQuestions]
    const [movedQuestion] = newQuestions.splice(currentIndex, 1)
    newQuestions.splice(newIndex, 0, movedQuestion)

    // Update order indices
    newQuestions.forEach((sq, index) => {
      sq.orderIndex = index
    })

    setSelectedQuestions(newQuestions)
  }

  const getDefaultPoints = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 5
      case 'Medium': return 10
      case 'Hard': return 15
      default: return 10
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

  const totalPoints = selectedQuestions.reduce((sum, sq) => sum + sq.points, 0)

  const handleSubmit = async () => {
    if (!examData.title.trim() || selectedQuestions.length === 0) {
      alert('Please provide an exam title and add at least one question.')
      return
    }

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Create exam
      const { data: examResult, error: examError } = await supabase
        .from('exams')
        .insert({
          teacher_id: user.id,
          title: examData.title,
          description: examData.description,
          instructions: examData.instructions,
          time_limit: examData.timeLimit,
          total_points: totalPoints,
          status: 'draft'
        })
        .select()
        .single()

      if (examError) throw examError

      // Add questions to exam
      const examQuestions = selectedQuestions.map(sq => ({
        exam_id: examResult.id,
        customized_question_id: sq.customizedQuestionId,
        points: sq.points,
        order_index: sq.orderIndex
      }))

      const { error: questionsError } = await supabase
        .from('exam_questions')
        .insert(examQuestions)

      if (questionsError) throw questionsError

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          teacher_id: user.id,
          action: 'created',
          resource_type: 'exam',
          details: {
            exam_id: examResult.id,
            exam_title: examData.title,
            question_count: selectedQuestions.length,
            total_points: totalPoints
          }
        })

      router.push(`/dashboard/exams/${examResult.id}`)
    } catch (error) {
      console.error('Error creating exam:', error)
      alert('Error creating exam. Please try again.')
    } finally {
      setIsLoading(false)
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
          <h1 className="text-3xl font-bold">Create New Exam</h1>
          <p className="text-gray-600 mt-1">Build an exam using your approved customized questions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Exam Setup */}
        <div className="space-y-6">
          {/* Exam Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title *</Label>
                <Input
                  id="title"
                  value={examData.title}
                  onChange={(e) => setExamData({...examData, title: e.target.value})}
                  placeholder="e.g., Midterm Exam - Statistics"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={examData.description}
                  onChange={(e) => setExamData({...examData, description: e.target.value})}
                  placeholder="Brief description of the exam content and objectives..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={examData.timeLimit}
                  onChange={(e) => setExamData({...examData, timeLimit: parseInt(e.target.value) || 120})}
                  min="15"
                  max="480"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <textarea
                  id="instructions"
                  value={examData.instructions}
                  onChange={(e) => setExamData({...examData, instructions: e.target.value})}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Selected Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Selected Questions ({selectedQuestions.length})</CardTitle>
                  <CardDescription>Total Points: {totalPoints}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedQuestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No questions selected yet. Choose questions from the available list.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedQuestions.map((examQuestion, index) => (
                    <div key={examQuestion.customizedQuestionId} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">#{index + 1}</span>
                            <span className="text-sm font-medium">
                              {examQuestion.customizedQuestion.question.title}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(examQuestion.customizedQuestion.question.difficultyLevel)}`}>
                              {examQuestion.customizedQuestion.question.difficultyLevel}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {examQuestion.customizedQuestion.cluster.name}
                          </p>
                          <p className="text-sm text-gray-800 line-clamp-2">
                            {examQuestion.customizedQuestion.customizedText.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Input
                            type="number"
                            value={examQuestion.points}
                            onChange={(e) => updateQuestionPoints(examQuestion.customizedQuestionId, parseInt(e.target.value) || 0)}
                            className="w-16 text-center"
                            min="1"
                            max="50"
                          />
                          <span className="text-sm text-gray-500">pts</span>
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveQuestion(examQuestion.customizedQuestionId, 'up')}
                              disabled={index === 0}
                              className="h-6 w-6 p-0"
                            >
                              ↑
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveQuestion(examQuestion.customizedQuestionId, 'down')}
                              disabled={index === selectedQuestions.length - 1}
                              className="h-6 w-6 p-0"
                            >
                              ↓
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeQuestion(examQuestion.customizedQuestionId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Question Selection */}
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Available Questions</CardTitle>
              <CardDescription>
                Select from your approved customized questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <select
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Clusters</option>
                  {clusters.map(cluster => (
                    <option key={cluster.id} value={cluster.id}>{cluster.name}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Question List */}
          <Card className="max-h-96 overflow-y-auto">
            <CardContent className="pt-6">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {customizedQuestions.length === 0 ? (
                    <div>
                      <p className="mb-4">No approved customized questions found.</p>
                      <Link href="/dashboard/questions">
                        <Button>Create Questions</Button>
                      </Link>
                    </div>
                  ) : (
                    <p>No questions match your search criteria.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuestions.map((cq) => (
                    <div key={cq.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{cq.question.title}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(cq.question.difficultyLevel)}`}>
                              {cq.question.difficultyLevel}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {cq.question.subject} • {cq.cluster.name}
                          </p>
                          <p className="text-sm text-gray-800 line-clamp-2">
                            {cq.customizedText.substring(0, 150)}...
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addQuestion(cq)}
                          className="ml-4"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !examData.title.trim() || selectedQuestions.length === 0}
          className="flex-1"
          size="lg"
        >
          {isLoading ? 'Creating Exam...' : 'Create Exam'}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/exams')}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}