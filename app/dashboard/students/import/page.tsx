'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CSVImportForm } from '@/components/forms/CSVImportForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

export default function ImportStudentsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [importResult, setImportResult] = useState<{
    imported: number
    skipped: number
    errors: Array<{ row: number; error: string }>
  } | null>(null)
  const router = useRouter()

  const handleImport = async (students: any[]) => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      let imported = 0
      let skipped = 0
      const errors: Array<{ row: number; error: string }> = []

      // Process students in batches to avoid overwhelming the database
      const batchSize = 10
      for (let i = 0; i < students.length; i += batchSize) {
        const batch = students.slice(i, i + batchSize)
        
        for (const student of batch) {
          try {
            // Check if student already exists
            const { data: existingStudent } = await supabase
              .from('students')
              .select('id')
              .eq('teacher_id', user.id)
              .eq('name', student.name)
              .eq('major', student.major)
              .eq('active', true)
              .single()

            if (existingStudent) {
              skipped++
              errors.push({
                row: student.rowNumber,
                error: 'Student with same name and major already exists'
              })
              continue
            }

            // Insert new student
            const { error } = await supabase
              .from('students')
              .insert({
                teacher_id: user.id,
                name: student.name,
                email: student.email || null,
                major: student.major,
                academic_level: student.academicLevel,
                gpa: student.gpa || null,
                career_interests: student.careerInterests || [],
                additional_info: {}
              })

            if (error) {
              errors.push({
                row: student.rowNumber,
                error: error.message
              })
              skipped++
            } else {
              imported++
            }
          } catch (error: any) {
            errors.push({
              row: student.rowNumber,
              error: error.message
            })
            skipped++
          }
        }
      }

      // Log import activity
      await supabase
        .from('student_import_logs')
        .insert({
          teacher_id: user.id,
          filename: 'csv_import',
          total_rows: students.length,
          imported_count: imported,
          error_count: skipped,
          errors: errors,
          status: 'completed'
        })

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          teacher_id: user.id,
          action: 'imported',
          resource_type: 'students',
          details: { 
            imported_count: imported, 
            total_count: students.length,
            method: 'csv' 
          }
        })

      setImportResult({ imported, skipped, errors })
    } catch (error) {
      console.error('Error importing students:', error)
      alert('Error importing students. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/students')
  }

  if (importResult) {
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
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">Import Complete</CardTitle>
              <CardDescription className="text-center">
                Your student import has finished processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                  <div className="text-sm text-green-800">Imported</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{importResult.skipped}</div>
                  <div className="text-sm text-yellow-800">Skipped</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {importResult.imported + importResult.skipped}
                  </div>
                  <div className="text-sm text-blue-800">Total</div>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-2">Issues Found</h3>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-800">
                        <strong>Row {error.row}:</strong> {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Link href="/dashboard/students">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                    View All Students
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setImportResult(null)
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Import More Students
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
        <CSVImportForm
          onImport={handleImport}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}