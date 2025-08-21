'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import type { Student } from '@/lib/types'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching students:', error)
        return
      }

      setStudents(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Students</h1>
          <Button disabled>Add Student</Button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/students/import">
            <Button variant="outline">Import CSV</Button>
          </Link>
          <Link href="/dashboard/students/new">
            <Button>Add Student</Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search students by name, major, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {students.length === 0 ? (
              <div>
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium mb-2">No students yet</h3>
                <p className="text-gray-600 mb-6">
                  Get started by adding students to your class
                </p>
                <div className="flex gap-2 justify-center">
                  <Link href="/dashboard/students/new">
                    <Button>Add First Student</Button>
                  </Link>
                  <Link href="/dashboard/students/import">
                    <Button variant="outline">Import from CSV</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">No students match your search</p>
                <Button
                  variant="ghost"
                  onClick={() => setSearchTerm('')}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{student.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{student.major}</span>
                          <span>•</span>
                          <span>{student.academicLevel}</span>
                          {student.gpa && (
                            <>
                              <span>•</span>
                              <span>GPA: {student.gpa.toFixed(2)}</span>
                            </>
                          )}
                        </div>
                        {student.email && (
                          <p className="text-sm text-gray-500 mt-1">{student.email}</p>
                        )}
                        {student.careerInterests.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {student.careerInterests.slice(0, 3).map((interest, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {interest}
                              </span>
                            ))}
                            {student.careerInterests.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{student.careerInterests.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/students/${student.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Class Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {new Set(students.map(s => s.major)).size}
                </div>
                <div className="text-sm text-gray-600">Majors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(students.map(s => s.academicLevel)).size}
                </div>
                <div className="text-sm text-gray-600">Academic Levels</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {students.filter(s => s.gpa && s.gpa >= 3.5).length}
                </div>
                <div className="text-sm text-gray-600">High Performers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}