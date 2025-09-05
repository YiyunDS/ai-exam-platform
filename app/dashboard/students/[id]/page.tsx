'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StudentForm } from '@/components/forms/StudentForm'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import type { Student } from '@/lib/types'
import type { StudentFormData } from '@/lib/validations/student'

interface StudentEditPageProps {
  params: {
    id: string
  }
}

export default function StudentEditPage({ params }: StudentEditPageProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchStudent()
  }, [params.id])

  const fetchStudent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', params.id)
        .eq('teacher_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching student:', error)
        router.push('/dashboard/students')
        return
      }

      setStudent(data)
    } catch (error) {
      console.error('Error:', error)
      router.push('/dashboard/students')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: StudentFormData) => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('students')
        .update({
          name: data.name,
          email: data.email || null,
          major: data.major,
          academic_level: data.academicLevel,
          gpa: data.gpa || null,
          career_interests: data.careerInterests,
          additional_info: data.additionalInfo || {}
        })
        .eq('id', params.id)
        .eq('teacher_id', user.id)

      if (error) {
        throw error
      }

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          teacher_id: user.id,
          action: 'updated',
          resource_type: 'student',
          resource_id: params.id,
          details: { student_name: data.name, method: 'manual' }
        })

      router.push('/dashboard/students')
    } catch (error) {
      console.error('Error updating student:', error)
      alert('Error updating student. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Soft delete by setting active to false
      const { error } = await supabase
        .from('students')
        .update({ active: false })
        .eq('id', params.id)
        .eq('teacher_id', user.id)

      if (error) {
        throw error
      }

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          teacher_id: user.id,
          action: 'deleted',
          resource_type: 'student',
          resource_id: params.id,
          details: { student_name: student?.name, method: 'manual' }
        })

      router.push('/dashboard/students')
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Error deleting student. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/students')
  }

  if (loading) {
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading student...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!student) {
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
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Student not found</h2>
          <p className="text-gray-600 mt-2">The student you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/students"
          className="text-blue-600 hover:text-blue-500"
        >
          ← Back to Students
        </Link>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting || isLoading}
        >
          {isDeleting ? 'Deleting...' : 'Delete Student'}
        </Button>
      </div>

      <div className="flex justify-center">
        <StudentForm
          student={student}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}