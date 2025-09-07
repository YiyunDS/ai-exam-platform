import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, HelpCircle, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Student, Question, Exam } from "@/entities/all";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      const [recentStudents, recentQuestions, recentExams] = await Promise.all([
        Student.list("-created_date", 3),
        Question.list("-created_date", 3),
        Exam.list("-created_date", 3)
      ]);

      const allActivities = [
        ...recentStudents.map(student => ({
          id: student.id,
          type: "student",
          title: `New student: ${student.full_name}`,
          subtitle: student.major,
          created_date: student.created_date,
          icon: Users,
          color: "bg-blue-500"
        })),
        ...recentQuestions.map(question => ({
          id: question.id,
          type: "question",
          title: `New question: ${question.title}`,
          subtitle: question.subject,
          created_date: question.created_date,
          icon: HelpCircle,
          color: "bg-emerald-500"
        })),
        ...recentExams.map(exam => ({
          id: exam.id,
          type: "exam",
          title: `New exam: ${exam.title}`,
          subtitle: exam.subject,
          created_date: exam.created_date,
          icon: FileText,
          color: "bg-amber-500"
        }))
      ];

      // Sort by creation date and take the 5 most recent
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .slice(0, 5);

      setActivities(sortedActivities);
    } catch (error) {
      console.error("Error loading recent activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center`}>
                <activity.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {activity.subtitle}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {format(new Date(activity.created_date), "MMM d")}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-8">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm">No recent activity yet</p>
            <p className="text-xs text-slate-400 mt-1">Start by adding students or questions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}