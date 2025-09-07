'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingPage } from '@/components/ui/loading-skeleton'
import { 
  Plus, 
  Search, 
  HelpCircle,
  Filter,
  Edit,
  Eye,
  Settings,
  Calendar,
  Layers
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { Question } from '@/lib/types'
import QuestionStats from '@/components/questions/QuestionStats'

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

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success'
      case 'Medium': return 'warning'
      case 'Hard': return 'error'
      default: return 'gray'
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
    return <LoadingPage title="Questions" actionLabel="Loading questions..." />
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-slate-900"
              >
                Question Bank
              </motion.h1>
              <p className="text-slate-600 mt-1">Create and manage your examination questions</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard/questions/new">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center gap-2 shadow-lg transition-all">
                  <Plus className="w-4 h-4" />
                  Create Question
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats Overview */}
        <QuestionStats questions={questions} isLoading={loading} />

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search questions by title, content, subject, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="h-10 pl-10 pr-8 rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm text-sm min-w-[140px] appearance-none"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="h-10 pl-10 pr-8 rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm text-sm min-w-[140px] appearance-none"
                  >
                    <option value="">All Levels</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardContent className="text-center py-12">
              {questions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No questions yet</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Create your first question to start building personalized assessments for your students
                  </p>
                  <Link href="/dashboard/questions/new">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Question
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No questions found</h3>
                  <p className="text-slate-600 mb-4">No questions match your search criteria</p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedSubject('')
                      setSelectedDifficulty('')
                    }}
                    className="hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6"
          >
            {filteredQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white text-xl">{getQuestionTypeIcon(question.questionType)}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-slate-900">{question.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                              <span className="font-medium">{question.subject}</span>
                              <span>•</span>
                              <Badge 
                                variant={
                                  question.difficultyLevel === 'Easy' ? 'beginner' :
                                  question.difficultyLevel === 'Medium' ? 'intermediate' :
                                  'advanced'
                                }
                              >
                                {question.difficultyLevel}
                              </Badge>
                              <span>•</span>
                              <Badge 
                                variant={
                                  question.questionType === 'Multiple Choice' ? 'multiple-choice' :
                                  question.questionType === 'Short Answer' ? 'short-answer' :
                                  question.questionType === 'Essay' ? 'essay' :
                                  'problem-solving'
                                }
                              >
                                {question.questionType}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                          <p className="text-slate-700 text-sm leading-relaxed">
                            {question.baselineQuestion.length > 200
                              ? `${question.baselineQuestion.substring(0, 200)}...`
                              : question.baselineQuestion
                            }
                          </p>
                        </div>

                        {/* Learning Objectives */}
                        {question.learningObjectives.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Learning Objectives:</p>
                            <div className="flex flex-wrap gap-2">
                              {question.learningObjectives.slice(0, 3).map((objective, idx) => (
                                <Badge key={idx} className="bg-blue-50 text-blue-700 border-blue-200">
                                  {objective}
                                </Badge>
                              ))}
                              {question.learningObjectives.length > 3 && (
                                <Badge className="bg-slate-100 text-slate-600">
                                  +{question.learningObjectives.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {question.tags.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {question.tags.slice(0, 5).map((tag, idx) => (
                                <Badge key={idx} className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                              {question.tags.length > 5 && (
                                <Badge className="bg-slate-100 text-slate-600 text-xs">
                                  +{question.tags.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Created {new Date(question.createdAt).toLocaleDateString()}</span>
                            </div>
                            {question.usageCount > 0 && (
                              <div className="flex items-center gap-1">
                                <Layers className="w-4 h-4" />
                                <span>Used {question.usageCount} times</span>
                              </div>
                            )}
                            {question.isTemplate && (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs">
                                Template
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Link href={`/dashboard/questions/${question.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/dashboard/questions/${question.id}/customize`}>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Customize
                          </Button>
                        </Link>
                        <Link href={`/dashboard/questions/${question.id}/review`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quick Start Guide */}
        {questions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6" />
                  Getting Started with Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        Create Baseline Questions
                      </h4>
                      <p className="text-sm leading-relaxed">
                        Start with generic questions that cover your learning objectives. 
                        These will be the foundation for AI customization.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        AI Customization
                      </h4>
                      <p className="text-sm leading-relaxed">
                        Our AI will transform your baseline questions into personalized versions 
                        for each student cluster while maintaining the same difficulty level.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-emerald-900">Best Practices</h4>
                    <ul className="text-sm space-y-2 list-none">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></span>
                        Use clear, specific question titles
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></span>
                        Define explicit learning objectives
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></span>
                        Add relevant tags for easy searching
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></span>
                        Choose appropriate difficulty levels
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></span>
                        Write questions that can be contextualized
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}