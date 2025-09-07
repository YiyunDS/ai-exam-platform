import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, TrendingUp, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function StudentStats({ students, isLoading }) {
  const getStats = () => {
    if (isLoading || !students.length) {
      return {
        total: 0,
        majors: 0,
        avgGpa: 0,
        levels: 0
      };
    }

    const uniqueMajors = new Set(students.map(s => s.major)).size;
    const uniqueLevels = new Set(students.map(s => s.academic_level)).size;
    const avgGpa = students
      .filter(s => s.gpa)
      .reduce((sum, s) => sum + s.gpa, 0) / students.filter(s => s.gpa).length;

    return {
      total: students.length,
      majors: uniqueMajors,
      avgGpa: avgGpa || 0,
      levels: uniqueLevels
    };
  };

  const stats = getStats();

  const statCards = [
    {
      title: "Total Students",
      value: stats.total,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Different Majors",
      value: stats.majors,
      icon: BookOpen,
      color: "bg-emerald-500"
    },
    {
      title: "Average GPA",
      value: stats.avgGpa.toFixed(2),
      icon: TrendingUp,
      color: "bg-purple-500"
    },
    {
      title: "Academic Levels",
      value: stats.levels,
      icon: GraduationCap,
      color: "bg-amber-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}