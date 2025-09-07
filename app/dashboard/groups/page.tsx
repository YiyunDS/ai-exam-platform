'use client'

import React from 'react'
import { UserCheck, Sparkles, Refresh, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function GroupsPage() {
  // Sample data matching the design screenshots
  const groups = [
    {
      id: 'psychological-professionals',
      name: 'Psychological Professionals',
      description: 'A group of psychology students with a focus on cognitive and social sciences...',
      primaryMajor: 'Psychology',
      academicLevel: 'Senior',
      averageGPA: 3.70,
      commonInterests: ['cognitive psychology', 'neuroscience', 'therapy'],
      careerThemes: 'Clinical Psychologist',
      students: ['David Park'],
      studentCount: 1,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'business-strategists', 
      name: 'Business Strategists',
      description: 'Seniors with a background in business administration, preparing for careers in...',
      primaryMajor: 'Business Administration', 
      academicLevel: 'Senior',
      averageGPA: 3.60,
      commonInterests: ['marketing', 'entrepreneurship', 'finance'],
      careerThemes: 'Business Consultant',
      students: ['Michael Chen'],
      studentCount: 1,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'engineering-innovators',
      name: 'Engineering Innovators', 
      description: 'Students in engineering fields who are focused on practical applications and...',
      primaryMajor: 'Mechanical Engineering',
      academicLevel: 'Sophomore', 
      averageGPA: 3.90,
      commonInterests: ['robotics', 'renewable energy', '3D printing'],
      careerThemes: 'Robotics Engineer',
      students: ['Sarah Johnson'], 
      studentCount: 1,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'tech-enthusiasts',
      name: 'Tech Enthusiasts',
      description: 'Students with a keen interest in technology and computer science, excelling in their...',
      primaryMajor: 'Computer Science',
      academicLevel: 'Junior',
      averageGPA: 3.65,
      commonInterests: ['artificial intelligence', 'web development', 'cybersecurity'],
      careerThemes: 'Software Developer',
      students: ['Lisa Thompson', 'Emma Rodriguez'],
      studentCount: 2,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-slate-900"
              >
                Student Groups
              </motion.h1>
              <p className="text-slate-600 mt-1">AI-powered student clustering for personalized exams</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2 hover:bg-purple-50 hover:text-purple-700">
              <Refresh className="w-4 h-4" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              Generate Groups
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-slate-900">5</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">AI Groups</p>
                <p className="text-3xl font-bold text-slate-900">4</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Grouped Students</p>
                <p className="text-3xl font-bold text-slate-900">5</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Unassigned</p>
                <p className="text-3xl font-bold text-slate-900">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group h-full">
                <CardContent className="p-6">
                  {/* Progress Bar */}
                  <div className={`w-full h-1 bg-gradient-to-r ${group.color} rounded-full mb-6`} />
                  
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{group.name}</h3>
                      <span className="text-sm font-medium text-slate-600">{group.studentCount} students</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{group.description}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Primary Major</span>
                      <Badge variant="info">{group.primaryMajor}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Academic Level</span>
                      <Badge variant={group.academicLevel.toLowerCase() as any}>{group.academicLevel}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Average GPA</span>
                      <span className="text-sm font-semibold text-slate-900">{group.averageGPA}</span>
                    </div>
                  </div>

                  {/* Common Interests */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Common Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {group.commonInterests.map((interest) => (
                        <Badge key={interest} variant="purple" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Career Themes */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Career Themes</p>
                    <Badge variant="success">{group.careerThemes}</Badge>
                  </div>

                  {/* Students */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Students</p>
                    <div className="space-y-2">
                      {group.students.map((student, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${group.color} rounded-full flex items-center justify-center`}>
                            <span className="text-white font-semibold text-sm">
                              {student.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-900">{student}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}