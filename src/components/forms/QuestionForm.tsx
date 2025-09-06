'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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

  const watchedLearningObjectives = form.watch('learningObjectives')
  const watchedTags = form.watch('tags')
  const watchedSubject = form.watch('subject')
  const watchedDifficultyLevel = form.watch('difficultyLevel')
  const watchedQuestionType = form.watch('questionType')

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
      form.setValue('learningObjectives', [...watchedLearningObjectives, trimmedObjective])
      setLearningObjectiveInput('')
      setShowObjectiveSuggestions(false)
    }
  }

  const removeLearningObjective = (index: number) => {
    form.setValue('learningObjectives', watchedLearningObjectives.filter((_, i) => i !== index))
  }

  // Tags Management
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !watchedTags.includes(trimmedTag)) {
      form.setValue('tags', [...watchedTags, trimmedTag])
      setTagInput('')
      setShowTagSuggestions(false)
    }
  }

  const removeTag = (index: number) => {
    form.setValue('tags', watchedTags.filter((_, i) => i !== index))
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Basic Statistics Problem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject with Autocomplete */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <Popover open={showSubjectSuggestions} onOpenChange={setShowSubjectSuggestions}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Input
                            placeholder="e.g., Statistics"
                            {...field}
                            onFocus={() => setShowSubjectSuggestions(true)}
                            onChange={(e) => {
                              field.onChange(e)
                              setShowSubjectSuggestions(true)
                            }}
                          />
                        </FormControl>
                      </PopoverTrigger>
                      {filteredSubjects.length > 0 && (
                        <PopoverContent className="w-full p-0" align="start">
                          <div className="max-h-48 overflow-y-auto">
                            {filteredSubjects.slice(0, 5).map((subject) => (
                              <button
                                key={subject}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-accent focus:bg-accent"
                                onClick={() => {
                                  form.setValue('subject', subject)
                                  setShowSubjectSuggestions(false)
                                }}
                              >
                                {subject}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      )}
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Question Type and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="questionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {questionTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <FormField
                control={form.control}
                name="baselineQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baseline Question *</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4}
                        placeholder="Enter your baseline question that will be customized for different student groups..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {/* Learning Objectives */}
            <div className="space-y-2">
              <Label>Learning Objectives *</Label>
              
              {/* Current Objectives */}
              {watchedLearningObjectives.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {watchedLearningObjectives.map((objective, index) => (
                    <Badge key={index} variant="default" className="gap-1">
                      {objective}
                      <button
                        type="button"
                        onClick={() => removeLearningObjective(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
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
                    <Badge key={index} variant="outline" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
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
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}