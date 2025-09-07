'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading-skeleton'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Upload, 
  Search, 
  Users,
  Edit,
  Mail
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { Student } from '@/lib/types'
import StudentStats from '@/components/students/StudentStats'

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
    return <LoadingPage title="Students" actionLabel="Loading students..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-slate-900"
              >
                Students
              </motion.h1>
              <p className="text-slate-600 mt-1">Manage student profiles and academic data</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard/students/import">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Upload className="w-4 h-4" />
                  Import CSV
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard/students/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg">
                  <Plus className="w-4 h-4" />
                  Add Student
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats Overview */}
        <StudentStats students={students} isLoading={loading} />

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search students by name, major, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
            />
          </div>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardContent className="text-center py-12">
              {students.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No students yet</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Get started by adding students to your class or importing from a CSV file
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/dashboard/students/new">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Student
                      </Button>
                    </Link>
                    <Link href="/dashboard/students/import">
                      <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Import from CSV
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
                  <p className="text-slate-600 mb-4">No students match your search criteria</p>
                  <Button
                    variant="ghost"
                    onClick={() => setSearchTerm('')}
                    className="hover:bg-blue-50 hover:text-blue-700"
                  >
                    Clear search
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6"
          >
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                            <span className="text-white font-semibold text-lg">
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-slate-900">{student.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                              <span className="font-medium">{student.major}</span>
                              <span>•</span>
                              <span>{student.academicLevel}</span>
                              {student.gpa && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-600 font-medium">GPA: {student.gpa.toFixed(2)}</span>
                                </>
                              )}
                            </div>
                            {student.email && (
                              <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                                <Mail className="w-4 h-4" />
                                <span>{student.email}</span>
                              </div>
                            )}
                            {student.careerInterests.length > 0 && (
                              <div className="flex gap-2 mt-3 flex-wrap">
                                {student.careerInterests.slice(0, 3).map((interest, idx) => (
                                  <Badge key={idx} className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                                    {interest}
                                  </Badge>
                                ))}
                                {student.careerInterests.length > 3 && (
                                  <Badge className="bg-slate-100 text-slate-600 border-slate-200">
                                    +{student.careerInterests.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/students/${student.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}