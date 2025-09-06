'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Copy, Check, Grid, List, ChevronDown, Filter, 
  BarChart3, Target, Users, Clock, BookOpen, 
  Sparkles, Eye, ThumbsUp, ThumbsDown, MoreHorizontal,
  Search, SlidersHorizontal
} from 'lucide-react'

interface Question {
  id: string
  title: string
  content: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  targetGroup: string
  estimatedTime: number
  learningObjectives: string[]
  variations: {
    original: string
    personalized: string[]
  }
  metrics: {
    engagement: number
    difficulty_rating: number
    completion_rate: number
    student_feedback: number
  }
  tags: string[]
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    title: 'Database Normalization',
    content: 'Explain the concept of database normalization and provide an example of converting a table from 1NF to 3NF.',
    difficulty: 'Medium',
    category: 'Computer Science',
    targetGroup: 'Software Engineering Students',
    estimatedTime: 15,
    learningObjectives: ['Understanding normalization', 'Apply normalization rules', 'Design efficient databases'],
    variations: {
      original: 'Explain the concept of database normalization and provide an example of converting a table from 1NF to 3NF.',
      personalized: [
        'As a software engineering student building your first web application, explain how database normalization would help optimize your user management system. Show how to convert a denormalized user table from 1NF to 3NF.',
        'Imagine you\'re developing a music streaming app like Spotify. Explain database normalization and demonstrate converting a song/artist table from 1NF to 3NF to avoid data redundancy.',
        'For your capstone project\'s e-commerce platform, describe database normalization principles and show the process of normalizing a product catalog table from 1NF to 3NF.'
      ]
    },
    metrics: {
      engagement: 87,
      difficulty_rating: 3.2,
      completion_rate: 78,
      student_feedback: 4.3
    },
    tags: ['Database', 'Normalization', 'SQL', 'Design']
  },
  {
    id: '2',
    title: 'Algorithm Complexity',
    content: 'Analyze the time complexity of the following sorting algorithms: bubble sort, merge sort, and quick sort.',
    difficulty: 'Hard',
    category: 'Computer Science',
    targetGroup: 'Data Structures Students',
    estimatedTime: 20,
    learningObjectives: ['Understand Big O notation', 'Compare algorithm efficiency', 'Choose appropriate algorithms'],
    variations: {
      original: 'Analyze the time complexity of the following sorting algorithms: bubble sort, merge sort, and quick sort.',
      personalized: [
        'You\'re optimizing a social media feed algorithm. Compare the time complexity of bubble sort, merge sort, and quick sort when processing millions of posts.',
        'For a competitive gaming leaderboard system, analyze which sorting algorithm (bubble sort, merge sort, quick sort) would be most efficient for real-time rankings.',
        'When building a recommendation engine for an e-commerce site, evaluate the time complexity trade-offs between bubble sort, merge sort, and quick sort for product ranking.'
      ]
    },
    metrics: {
      engagement: 72,
      difficulty_rating: 4.1,
      completion_rate: 65,
      student_feedback: 4.0
    },
    tags: ['Algorithms', 'Complexity', 'Sorting', 'Performance']
  }
]

export default function QuestionComparison() {
  const [questions] = useState<Question[]>(sampleQuestions)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})
  const [activeVariation, setActiveVariation] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterDifficulty, setFilterDifficulty] = useState('All')

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  const getVariationText = (question: Question, index: number) => {
    if (index === 0) return question.variations.original
    return question.variations.personalized[index - 1] || question.variations.original
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'All' || question.category === filterCategory
    const matchesDifficulty = filterDifficulty === 'All' || question.difficulty === filterDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="question-comparison-container">
      {/* Header */}
      <div className="comparison-header">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Comparison</h1>
            <p className="text-gray-600">Compare original questions with AI-generated variations</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="comparison-search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
            
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Grid/List */}
      <div className={`questions-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
        <AnimatePresence>
          {filteredQuestions.map((question) => (
            <motion.div
              key={question.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="question-card"
            >
              {/* Card Header */}
              <div className="card-header">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="question-title">{question.title}</h3>
                    <p className="question-meta">
                      {question.category} • {question.targetGroup}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`difficulty-badge ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <button className="more-button">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="metrics-row">
                  <div className="metric">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span>{question.metrics.engagement}% engagement</span>
                  </div>
                  <div className="metric">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>{question.estimatedTime}min</span>
                  </div>
                  <div className="metric">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span>{question.metrics.completion_rate}% completion</span>
                  </div>
                </div>
              </div>

              {/* Question Variations */}
              <div className="variations-container">
                {/* Variation Selector */}
                <div className="variation-selector">
                  <button 
                    className={`variation-tab ${(activeVariation[question.id] || 0) === 0 ? 'active' : ''}`}
                    onClick={() => setActiveVariation(prev => ({ ...prev, [question.id]: 0 }))}
                  >
                    Original
                  </button>
                  {question.variations.personalized.map((_, index) => (
                    <button
                      key={index}
                      className={`variation-tab ${(activeVariation[question.id] || 0) === index + 1 ? 'active' : ''}`}
                      onClick={() => setActiveVariation(prev => ({ ...prev, [question.id]: index + 1 }))}
                    >
                      Variation {index + 1}
                    </button>
                  ))}
                </div>

                {/* Question Content */}
                <div className="question-content">
                  <div className="content-text">
                    {getVariationText(question, activeVariation[question.id] || 0)}
                  </div>
                  
                  <div className="content-actions">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(
                        getVariationText(question, activeVariation[question.id] || 0),
                        `${question.id}-${activeVariation[question.id] || 0}`
                      )}
                      className="copy-button"
                    >
                      {copiedStates[`${question.id}-${activeVariation[question.id] || 0}`] ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </motion.button>
                    
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    
                    <button className="action-button">
                      <ThumbsUp className="w-4 h-4" />
                      Like
                    </button>
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="learning-objectives">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</h4>
                <div className="objectives-list">
                  {question.learningObjectives.map((objective, index) => (
                    <span key={index} className="objective-tag">
                      <Target className="w-3 h-3" />
                      {objective}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="question-tags">
                {question.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredQuestions.length === 0 && (
        <div className="empty-state">
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No questions found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}
    </div>
  )
}