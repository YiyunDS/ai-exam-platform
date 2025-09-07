'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Users, HelpCircle, Brain } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="flex gap-3">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/dashboard/students/new">
          <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700">
            <Users className="w-4 h-4" />
            Add Student
          </Button>
        </Link>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/dashboard/questions/new">
          <Button variant="outline" className="flex items-center gap-2 hover:bg-emerald-50 hover:text-emerald-700">
            <HelpCircle className="w-4 h-4" />
            New Question
          </Button>
        </Link>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/dashboard/generator">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg">
            <Brain className="w-4 h-4" />
            AI Generate
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}