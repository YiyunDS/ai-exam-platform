'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StudentForm } from '@/components/forms/StudentForm'
import { supabase } from '@/lib/supabase/client'
import type { StudentFormData } from '@/lib/validations/student'

export default function NewStudentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: StudentFormData) => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('students')
        .insert({
          teacher_id: user.id,
          name: data.name,
          email: data.email || null,
          major: data.major,
          academic_level: data.academicLevel,
          gpa: data.gpa || null,
          career_interests: data.careerInterests,
          additional_info: data.additionalInfo || {}
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
          resource_type: 'student',
          details: { student_name: data.name, method: 'manual' }
        })

      router.push('/dashboard/students')
    } catch (error) {
      console.error('Error creating student:', error)
      
      // More specific error messages
      let errorMessage = 'Error creating student. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('auth')) {
          errorMessage = 'Authentication error. Please sign in again.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('Missing Supabase')) {
          errorMessage = 'Database configuration error. Please contact support.'
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/students')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/students"
          className="text-blue-600 hover:text-blue-500"
        >
          ← Back to Students
        </Link>
      </div>

      <div className="flex justify-center">
        <StudentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}