'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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

  const watchedCareerInterests = form.watch('careerInterests')
  const watchedMajor = form.watch('major')

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
      form.setValue('careerInterests', [...watchedCareerInterests, trimmedInterest])
      setCareerInterestInput('')
      setShowInterestSuggestions(false)
    }
  }

  const removeCareerInterest = (index: number) => {
    form.setValue('careerInterests', watchedCareerInterests.filter((_, i) => i !== index))
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@university.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Major with Autocomplete */}
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Major *</FormLabel>
                  <Popover open={showMajorSuggestions} onOpenChange={setShowMajorSuggestions}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Input
                          placeholder="Computer Science"
                          {...field}
                          onFocus={() => setShowMajorSuggestions(true)}
                          onChange={(e) => {
                            field.onChange(e)
                            setShowMajorSuggestions(true)
                          }}
                        />
                      </FormControl>
                    </PopoverTrigger>
                    {filteredMajors.length > 0 && (
                      <PopoverContent className="w-full p-0" align="start">
                        <div className="max-h-48 overflow-y-auto">
                          {filteredMajors.slice(0, 5).map((major) => (
                            <button
                              key={major}
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-accent focus:bg-accent"
                              onClick={() => {
                                form.setValue('major', major)
                                setShowMajorSuggestions(false)
                              }}
                            >
                              {major}
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

            {/* Academic Level */}
            <FormField
              control={form.control}
              name="academicLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {academicLevels.map((level) => (
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

            {/* GPA */}
            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GPA (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      placeholder="3.75"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          {/* Career Interests */}
          <div className="space-y-2">
            <Label>Career Interests</Label>
            
            {/* Current Interests */}
            {watchedCareerInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {watchedCareerInterests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeCareerInterest(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
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
              <Popover open={showInterestSuggestions} onOpenChange={setShowInterestSuggestions}>
                <PopoverTrigger asChild>
                  <div />
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="max-h-48 overflow-y-auto">
                    {filteredInterests.slice(0, 5).map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-accent focus:bg-accent"
                        onMouseDown={() => addCareerInterest(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
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
        </Form>
      </CardContent>
    </Card>
  )
}