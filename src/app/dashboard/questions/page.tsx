'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import type { Question } from '@/lib/types'

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching questions:', error)
        return
      }

      setQuestions(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.baselineQuestion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSubject = !selectedSubject || question.subject === selectedSubject
    const matchesDifficulty = !selectedDifficulty || question.difficultyLevel === selectedDifficulty

    return matchesSearch && matchesSubject && matchesDifficulty
  })

  const subjects = [...new Set(questions.map(q => q.subject))].sort()
  const difficulties = ['Easy', 'Medium', 'Hard']

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'Multiple Choice': return '🔘'
      case 'Short Answer': return '✏️'
      case 'Essay': return '📝'
      case 'Problem Solving': return '🧮'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Questions</h1>
          <Button disabled>Create Question</Button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Questions</h1>
        <Link href="/dashboard/questions/new">
          <Button>Create Question</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search questions by title, content, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
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
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{subjects.length}</div>
            <div className="text-sm text-gray-600">Subjects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {questions.reduce((sum, q) => sum + (q.usageCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Usage</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {questions.filter(q => q.isTemplate).length}
            </div>
            <div className="text-sm text-gray-600">Templates</div>
          </CardContent>
        </Card>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {questions.length === 0 ? (
              <div>
                <div className="text-6xl mb-4">❓</div>
                <h3 className="text-lg font-medium mb-2">No questions yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first question to start building personalized assessments
                </p>
                <Link href="/dashboard/questions/new">
                  <Button>Create First Question</Button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">No questions match your search</p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSubject('')
                    setSelectedDifficulty('')
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
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getQuestionTypeIcon(question.questionType)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{question.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{question.subject}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(question.difficultyLevel)}`}>
                            {question.difficultyLevel}
                          </span>
                          <span>•</span>
                          <span>{question.questionType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {question.baselineQuestion.length > 200
                          ? `${question.baselineQuestion.substring(0, 200)}...`
                          : question.baselineQuestion
                        }
                      </p>
                    </div>

                    {/* Learning Objectives */}
                    {question.learningObjectives.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">Learning Objectives:</p>
                        <div className="flex flex-wrap gap-1">
                          {question.learningObjectives.slice(0, 3).map((objective, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              {objective}
                            </span>
                          ))}
                          {question.learningObjectives.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{question.learningObjectives.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {question.tags.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {question.tags.slice(0, 5).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                          {question.tags.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{question.tags.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>Created {new Date(question.createdAt).toLocaleDateString()}</span>
                        {question.usageCount > 0 && (
                          <span>Used {question.usageCount} times</span>
                        )}
                        {question.isTemplate && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            Template
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/dashboard/questions/${question.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/dashboard/questions/${question.id}/customize`}>
                      <Button size="sm">
                        Customize
                      </Button>
                    </Link>
                    <Link href={`/dashboard/questions/${question.id}/review`}>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Start Guide */}
      {questions.length === 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🚀 Getting Started with Questions</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">1. Create Baseline Questions</h4>
                <p className="text-sm mb-4">
                  Start with generic questions that cover your learning objectives. 
                  These will be the foundation for AI customization.
                </p>
                
                <h4 className="font-medium mb-2">2. AI Customization</h4>
                <p className="text-sm">
                  Our AI will transform your baseline questions into personalized versions 
                  for each student cluster while maintaining the same difficulty level.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Use clear, specific question titles</li>
                  <li>Define explicit learning objectives</li>
                  <li>Add relevant tags for easy searching</li>
                  <li>Choose appropriate difficulty levels</li>
                  <li>Write questions that can be contextualized</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}