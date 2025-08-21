'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  questionSchema, 
  type QuestionFormData, 
  difficultyLevels, 
  questionTypes,
  commonSubjects,
  commonLearningObjectives,
  commonTags,
  difficultyGuidelines,
  questionTypeGuidelines
} from '@/lib/validations/question'
import type { Question } from '@/lib/types'

interface QuestionFormProps {
  question?: Question
  onSubmit: (data: QuestionFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function QuestionForm({ question, onSubmit, onCancel, isLoading }: QuestionFormProps) {
  const [learningObjectiveInput, setLearningObjectiveInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false)
  const [showObjectiveSuggestions, setShowObjectiveSuggestions] = useState(false)
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: question?.title || '',
      baselineQuestion: question?.baselineQuestion || '',
      difficultyLevel: question?.difficultyLevel || 'Medium',
      subject: question?.subject || '',
      learningObjectives: question?.learningObjectives || [],
      questionType: question?.questionType || 'Problem Solving',
      tags: question?.tags || [],
      metadata: question?.metadata || {}
    }
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form
  const watchedLearningObjectives = watch('learningObjectives')
  const watchedTags = watch('tags')
  const watchedSubject = watch('subject')
  const watchedDifficultyLevel = watch('difficultyLevel')
  const watchedQuestionType = watch('questionType')

  const handleFormSubmit = async (data: QuestionFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // Learning Objectives Management
  const addLearningObjective = (objective: string) => {
    const trimmedObjective = objective.trim()
    if (trimmedObjective && !watchedLearningObjectives.includes(trimmedObjective)) {
      setValue('learningObjectives', [...watchedLearningObjectives, trimmedObjective])
      setLearningObjectiveInput('')
      setShowObjectiveSuggestions(false)
    }
  }

  const removeLearningObjective = (index: number) => {
    setValue('learningObjectives', watchedLearningObjectives.filter((_, i) => i !== index))
  }

  // Tags Management
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !watchedTags.includes(trimmedTag)) {
      setValue('tags', [...watchedTags, trimmedTag])
      setTagInput('')
      setShowTagSuggestions(false)
    }
  }

  const removeTag = (index: number) => {
    setValue('tags', watchedTags.filter((_, i) => i !== index))
  }

  // Handle key presses for inputs
  const handleObjectiveKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addLearningObjective(learningObjectiveInput)
    }
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  // Filter suggestions
  const filteredSubjects = commonSubjects.filter(subject =>
    subject.toLowerCase().includes(watchedSubject.toLowerCase())
  )

  const filteredObjectives = commonLearningObjectives.filter(objective =>
    objective.toLowerCase().includes(learningObjectiveInput.toLowerCase()) &&
    !watchedLearningObjectives.includes(objective)
  )

  const filteredTags = commonTags.filter(tag =>
    tag.toLowerCase().includes(tagInput.toLowerCase()) &&
    !watchedTags.includes(tag)
  )

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>
            {question ? 'Edit Question' : 'Create New Question'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Question Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Basic Statistics Problem"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Subject with Autocomplete */}
            <div className="space-y-2 relative">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                {...register('subject')}
                placeholder="e.g., Statistics"
                onFocus={() => setShowSubjectSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSubjectSuggestions(false), 200)}
                onChange={(e) => {
                  register('subject').onChange(e)
                  setShowSubjectSuggestions(true)
                }}
              />
              {showSubjectSuggestions && filteredSubjects.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredSubjects.slice(0, 5).map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                      onMouseDown={() => {
                        setValue('subject', subject)
                        setShowSubjectSuggestions(false)
                      }}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
              {errors.subject && (
                <p className="text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            {/* Question Type and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionType">Question Type *</Label>
                <select
                  id="questionType"
                  {...register('questionType')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {questionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.questionType && (
                  <p className="text-sm text-red-600">{errors.questionType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level *</Label>
                <select
                  id="difficultyLevel"
                  {...register('difficultyLevel')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.difficultyLevel && (
                  <p className="text-sm text-red-600">{errors.difficultyLevel.message}</p>
                )}
              </div>
            </div>

            {/* Guidelines Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  {watchedQuestionType} Guidelines
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  {questionTypeGuidelines[watchedQuestionType].description}
                </p>
                <div className="text-xs text-blue-700">
                  <strong>Best for:</strong> {questionTypeGuidelines[watchedQuestionType].bestFor.join(', ')}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  {watchedDifficultyLevel} Difficulty
                </h4>
                <p className="text-sm text-green-800 mb-2">
                  {difficultyGuidelines[watchedDifficultyLevel].description}
                </p>
                <div className="text-xs text-green-700">
                  {difficultyGuidelines[watchedDifficultyLevel].characteristics.join(' • ')}
                </div>
              </div>
            </div>

            {/* Baseline Question */}
            <div className="space-y-2">
              <Label htmlFor="baselineQuestion">Baseline Question *</Label>
              <textarea
                id="baselineQuestion"
                {...register('baselineQuestion')}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter your baseline question that will be customized for different student groups..."
              />
              {errors.baselineQuestion && (
                <p className="text-sm text-red-600">{errors.baselineQuestion.message}</p>
              )}
            </div>

            {/* Learning Objectives */}
            <div className="space-y-2">
              <Label>Learning Objectives *</Label>
              
              {/* Current Objectives */}
              {watchedLearningObjectives.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {watchedLearningObjectives.map((objective, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded"
                    >
                      {objective}
                      <button
                        type="button"
                        onClick={() => removeLearningObjective(index)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Objective Input */}
              <div className="relative">
                <Input
                  value={learningObjectiveInput}
                  onChange={(e) => {
                    setLearningObjectiveInput(e.target.value)
                    setShowObjectiveSuggestions(true)
                  }}
                  onKeyPress={handleObjectiveKeyPress}
                  onFocus={() => setShowObjectiveSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowObjectiveSuggestions(false), 200)}
                  placeholder="Add learning objective..."
                />
                <Button
                  type="button"
                  onClick={() => addLearningObjective(learningObjectiveInput)}
                  disabled={!learningObjectiveInput.trim()}
                  className="absolute right-1 top-1 h-8 px-3"
                  size="sm"
                >
                  Add
                </Button>
              </div>

              {/* Objective Suggestions */}
              {showObjectiveSuggestions && learningObjectiveInput && filteredObjectives.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredObjectives.slice(0, 5).map((objective) => (
                    <button
                      key={objective}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                      onMouseDown={() => addLearningObjective(objective)}
                    >
                      {objective}
                    </button>
                  ))}
                </div>
              )}

              {errors.learningObjectives && (
                <p className="text-sm text-red-600">{errors.learningObjectives.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags (Optional)</Label>
              
              {/* Current Tags */}
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {watchedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 text-gray-600 hover:text-gray-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Tag Input */}
              <div className="relative">
                <Input
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value)
                    setShowTagSuggestions(true)
                  }}
                  onKeyPress={handleTagKeyPress}
                  onFocus={() => setShowTagSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                  placeholder="Add tag..."
                />
                <Button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  disabled={!tagInput.trim()}
                  className="absolute right-1 top-1 h-8 px-3"
                  size="sm"
                >
                  Add
                </Button>
              </div>

              {/* Tag Suggestions */}
              {showTagSuggestions && tagInput && filteredTags.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredTags.slice(0, 5).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                      onMouseDown={() => addTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {errors.tags && (
                <p className="text-sm text-red-600">{errors.tags.message}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Saving...' : (question ? 'Update Question' : 'Create Question')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}