
import React, { useState, useEffect } from "react";
import { Student } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import StudentTable from "../components/students/StudentTable";
import StudentForm from "../components/students/StudentForm";
import CSVUpload from "../components/students/CSVUpload";
import StudentStats from "../components/students/StudentStats";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    // Filter students directly in useEffect to avoid dependency issues
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(student =>
      student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchQuery]); // Dependencies are students and searchQuery

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await Student.list("-created_date");
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (studentData) => {
    try {
      if (editingStudent) {
        await Student.update(editingStudent.id, studentData);
      } else {
        await Student.create(studentData);
      }
      setShowAddForm(false);
      setEditingStudent(null);
      loadStudents(); // Reload students to reflect changes
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowAddForm(true);
  };

  const handleCSVSuccess = () => {
    setShowCSVUpload(false);
    loadStudents(); // Reload students after successful CSV upload
  };

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
              <h1 className="text-3xl font-bold text-slate-900">Students</h1>
              <p className="text-slate-600">Manage student profiles and academic data</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCSVUpload(true)}
              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <StudentStats students={students} isLoading={isLoading} />

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
        <StudentTable
          students={filteredStudents}
          isLoading={isLoading}
          onEdit={handleEdit}
        />

        {/* Modals */}
        <AnimatePresence>
          {showAddForm && (
            <StudentForm
              student={editingStudent}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowAddForm(false);
                setEditingStudent(null);
              }}
            />
          )}
          
          {showCSVUpload && (
            <CSVUpload
              onSuccess={handleCSVSuccess}
              onCancel={() => setShowCSVUpload(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
