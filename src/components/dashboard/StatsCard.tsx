'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LucideIcon, TrendingUp } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: string
  trend: string
  isLoading?: boolean
}

export default function StatsCard({ title, value, icon: Icon, color, trend, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <TrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}