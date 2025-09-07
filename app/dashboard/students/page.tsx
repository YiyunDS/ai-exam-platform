'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoadingPage } from '@/components/ui/loading-skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Plus, 
  Upload, 
  Users,
  Search,
  Pencil,
  Mail,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Target
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
// import { supabase } from '@/lib/supabase/client'
// import type { Student } from '@/lib/types'

// Sample data matching the screenshots exactly
const levelColors = {
  "freshman": "bg-green-100 text-green-800 border-green-200",
  "sophomore": "bg-blue-100 text-blue-800 border-blue-200", 
  "junior": "bg-purple-100 text-purple-800 border-purple-200",
  "senior": "bg-orange-100 text-orange-800 border-orange-200",
  "graduate": "bg-red-100 text-red-800 border-red-200"
};

const sampleStudents = [
  {
    id: 1,
    full_name: "David Park",
    email: "david.park@university.edu",
    student_id: "PSY2024004",
    major: "Psychology",
    academic_level: "senior",
    gpa: 3.70,
    group_id: null
  },
  {
    id: 2,
    full_name: "Lisa Thompson", 
    email: "lisa.thompson@university.edu",
    student_id: "CS2024005",
    major: "Computer Science",
    academic_level: "freshman",
    gpa: 3.50,
    group_id: null
  },
  {
    id: 3,
    full_name: "Emma Rodriguez",
    email: "emma.rodriguez@university.edu", 
    student_id: "CS2024001",
    major: "Computer Science",
    academic_level: "junior",
    gpa: 3.80,
    group_id: null
  },
  {
    id: 4,
    full_name: "Michael Chen",
    email: "michael.chen@university.edu",
    student_id: "BUS2024002", 
    major: "Business Administration",
    academic_level: "senior",
    gpa: 3.60,
    group_id: null
  },
  {
    id: 5,
    full_name: "Sarah Johnson",
    email: "sarah.johnson@university.edu",
    student_id: "ENG2024003",
    major: "Mechanical Engineering", 
    academic_level: "sophomore",
    gpa: 3.90,
    group_id: null
  }
];

export default function StudentsPage() {
  const [students, setStudents] = useState(sampleStudents)
  const [filteredStudents, setFilteredStudents] = useState(sampleStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students)
      return
    }

    const filtered = students.filter(student =>
      student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredStudents(filtered)
  }, [students, searchQuery])

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Students</h1>
              <p className="text-slate-600">Manage student profiles and academic data</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-slate-900">{students.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Different Majors</p>
                <p className="text-3xl font-bold text-slate-900">{new Set(students.map(s => s.major)).size}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Average GPA</p>
                <p className="text-3xl font-bold text-slate-900">3.70</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Academic Levels</p>
                <p className="text-3xl font-bold text-slate-900">4</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search students by name, email, major, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
            />
          </div>
        </div>

        {/* Students Table */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-bold text-slate-900">Student Directory</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Student</TableHead>
                    <TableHead className="font-semibold text-slate-700">ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Major</TableHead>
                    <TableHead className="font-semibold text-slate-700">Level</TableHead>
                    <TableHead className="font-semibold text-slate-700">GPA</TableHead>
                    <TableHead className="font-semibold text-slate-700">Group</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Skeleton className="w-10 h-10 rounded-full" />
                              <div>
                                <Skeleton className="h-4 w-32 mb-1" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <motion.tr
                          key={student.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {student.full_name?.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{student.full_name}</p>
                                <div className="flex items-center gap-1 text-slate-500">
                                  <Mail className="w-3 h-3" />
                                  <span className="text-sm">{student.email}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                              {student.student_id}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-slate-900">{student.major}</span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={`${levelColors[student.academic_level]} border capitalize`}
                            >
                              {student.academic_level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-slate-900">
                              {student.gpa ? student.gpa.toFixed(2) : "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {student.group_id ? (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                {student.group_id}
                              </Badge>
                            ) : (
                              <span className="text-slate-400 text-sm">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <GraduationCap className="w-12 h-12 text-slate-300" />
                            <div>
                              <p className="text-slate-600 font-medium">No students found</p>
                              <p className="text-slate-400 text-sm">Add students to get started</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}