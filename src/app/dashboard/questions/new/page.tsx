'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QuestionForm } from '@/components/forms/QuestionForm'
import { supabase } from '@/lib/supabase/client'
import type { QuestionFormData } from '@/lib/validations/question'

export default function NewQuestionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: QuestionFormData) => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('questions')
        .insert({
          teacher_id: user.id,
          title: data.title,
          baseline_question: data.baselineQuestion,
          difficulty_level: data.difficultyLevel,
          subject: data.subject,
          learning_objectives: data.learningObjectives,
          question_type: data.questionType,
          tags: data.tags,
          metadata: data.metadata || {},
          is_template: false,
          usage_count: 0
        })

      if (error) {
        throw error
      }

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          teacher_id: user.id,
          action: 'created',
          resource_type: 'question',
          details: { 
            question_title: data.title, 
            subject: data.subject,
            difficulty: data.difficultyLevel,
            type: data.questionType
          }
        })

      router.push('/dashboard/questions')
    } catch (error) {
      console.error('Error creating question:', error)
      alert('Error creating question. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/questions')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/questions"
          className="text-blue-600 hover:text-blue-500"
        >
          ← Back to Questions
        </Link>
      </div>

      <div className="flex justify-center">
        <QuestionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}