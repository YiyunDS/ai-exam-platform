'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  studentSchema, 
  type StudentFormData, 
  academicLevels, 
  commonMajors, 
  commonCareerInterests 
} from '@/lib/validations/student'
import type { Student } from '@/lib/types'

interface StudentFormProps {
  student?: Student
  onSubmit: (data: StudentFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function StudentForm({ student, onSubmit, onCancel, isLoading }: StudentFormProps) {
  const [careerInterestInput, setCareerInterestInput] = useState('')
  const [showMajorSuggestions, setShowMajorSuggestions] = useState(false)
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false)

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
      email: student?.email || '',
      major: student?.major || '',
      academicLevel: student?.academicLevel || 'Freshman',
      gpa: student?.gpa || undefined,
      careerInterests: student?.careerInterests || [],
      additionalInfo: student?.additionalInfo || {}
    }
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form
  const watchedCareerInterests = watch('careerInterests')
  const watchedMajor = watch('major')

  const handleFormSubmit = async (data: StudentFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const addCareerInterest = (interest: string) => {
    const trimmedInterest = interest.trim()
    if (trimmedInterest && !watchedCareerInterests.includes(trimmedInterest)) {
      setValue('careerInterests', [...watchedCareerInterests, trimmedInterest])
      setCareerInterestInput('')
      setShowInterestSuggestions(false)
    }
  }

  const removeCareerInterest = (index: number) => {
    setValue('careerInterests', watchedCareerInterests.filter((_, i) => i !== index))
  }

  const handleCareerInterestKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCareerInterest(careerInterestInput)
    }
  }

  const filteredMajors = commonMajors.filter(major =>
    major.toLowerCase().includes(watchedMajor.toLowerCase())
  )

  const filteredInterests = commonCareerInterests.filter(interest =>
    interest.toLowerCase().includes(careerInterestInput.toLowerCase()) &&
    !watchedCareerInterests.includes(interest)
  )

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {student ? 'Edit Student' : 'Add New Student'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john.doe@university.edu"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Major with Autocomplete */}
          <div className="space-y-2 relative">
            <Label htmlFor="major">Major *</Label>
            <Input
              id="major"
              {...register('major')}
              placeholder="Computer Science"
              onFocus={() => setShowMajorSuggestions(true)}
              onBlur={() => setTimeout(() => setShowMajorSuggestions(false), 200)}
              onChange={(e) => {
                register('major').onChange(e)
                setShowMajorSuggestions(true)
              }}
            />
            {showMajorSuggestions && filteredMajors.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredMajors.slice(0, 5).map((major) => (
                  <button
                    key={major}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                    onMouseDown={() => {
                      setValue('major', major)
                      setShowMajorSuggestions(false)
                    }}
                  >
                    {major}
                  </button>
                ))}
              </div>
            )}
            {errors.major && (
              <p className="text-sm text-red-600">{errors.major.message}</p>
            )}
          </div>

          {/* Academic Level */}
          <div className="space-y-2">
            <Label htmlFor="academicLevel">Academic Level *</Label>
            <select
              id="academicLevel"
              {...register('academicLevel')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {academicLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.academicLevel && (
              <p className="text-sm text-red-600">{errors.academicLevel.message}</p>
            )}
          </div>

          {/* GPA */}
          <div className="space-y-2">
            <Label htmlFor="gpa">GPA (Optional)</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              {...register('gpa', { valueAsNumber: true })}
              placeholder="3.75"
            />
            {errors.gpa && (
              <p className="text-sm text-red-600">{errors.gpa.message}</p>
            )}
          </div>

          {/* Career Interests */}
          <div className="space-y-2">
            <Label>Career Interests</Label>
            
            {/* Current Interests */}
            {watchedCareerInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {watchedCareerInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeCareerInterest(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Interest Input */}
            <div className="relative">
              <Input
                value={careerInterestInput}
                onChange={(e) => {
                  setCareerInterestInput(e.target.value)
                  setShowInterestSuggestions(true)
                }}
                onKeyPress={handleCareerInterestKeyPress}
                onFocus={() => setShowInterestSuggestions(true)}
                onBlur={() => setTimeout(() => setShowInterestSuggestions(false), 200)}
                placeholder="Add career interest..."
              />
              <Button
                type="button"
                onClick={() => addCareerInterest(careerInterestInput)}
                disabled={!careerInterestInput.trim()}
                className="absolute right-1 top-1 h-8 px-3"
                size="sm"
              >
                Add
              </Button>
            </div>

            {/* Interest Suggestions */}
            {showInterestSuggestions && careerInterestInput && filteredInterests.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredInterests.slice(0, 5).map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                    onMouseDown={() => addCareerInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            )}

            {errors.careerInterests && (
              <p className="text-sm text-red-600">{errors.careerInterests.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : (student ? 'Update Student' : 'Add Student')}
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
  )
}