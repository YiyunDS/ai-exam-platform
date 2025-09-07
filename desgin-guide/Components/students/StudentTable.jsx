import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Mail, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const levelColors = {
  "freshman": "bg-green-100 text-green-800 border-green-200",
  "sophomore": "bg-blue-100 text-blue-800 border-blue-200",
  "junior": "bg-purple-100 text-purple-800 border-purple-200",
  "senior": "bg-orange-100 text-orange-800 border-orange-200",
  "graduate": "bg-red-100 text-red-800 border-red-200"
};

export default function StudentTable({ students, isLoading, onEdit }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <GraduationCap className="w-5 h-5" />
          Student Directory
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
                ) : students.length > 0 ? (
                  students.map((student) => (
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
                          onClick={() => onEdit(student)}
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
  );
}