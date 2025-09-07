'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  HelpCircle, 
  BookOpen, 
  Target, 
  TrendingUp,
  Star,
  Layers
} from 'lucide-react'

interface Question {
  id: string
  title: string
  subject: string
  difficultyLevel: string
  questionType: string
  baselineQuestion: string
  learningObjectives: string[]
  tags: string[]
  usageCount?: number
  isTemplate: boolean
  createdAt: string
}

interface QuestionStatsProps {
  questions: Question[]
  isLoading?: boolean
}

export default function QuestionStats({ questions, isLoading }: QuestionStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const subjects = new Set(questions.map(q => q.subject))
  const totalUsage = questions.reduce((sum, q) => sum + (q.usageCount || 0), 0)
  const templates = questions.filter(q => q.isTemplate)

  const stats = [
    {
      title: 'Total Questions',
      value: questions.length,
      icon: HelpCircle,
      color: 'bg-blue-500',
      trend: `${questions.length} created`,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Subjects',
      value: subjects.size,
      icon: BookOpen,
      color: 'bg-emerald-500',
      trend: 'Different topics',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Total Usage',
      value: totalUsage,
      icon: Target,
      color: 'bg-purple-500',
      trend: 'Times used',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Templates',
      value: templates.length,
      icon: Star,
      color: 'bg-amber-500',
      trend: 'Reusable',
      gradient: 'from-amber-500 to-amber-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}