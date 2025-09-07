import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Student } from "@/entities/all";

export default function CSVUpload({ onSuccess, onCancel }) {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please upload a CSV file");
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate required headers
      const requiredHeaders = ['full_name', 'email', 'major', 'academic_level'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setError(`Missing required columns: ${missingHeaders.join(', ')}`);
        setProcessing(false);
        return;
      }

      // Parse rows
      const students = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length === headers.length) {
          const student = {};
          headers.forEach((header, index) => {
            const value = values[index];
            if (header === 'gpa' && value) {
              student[header] = parseFloat(value);
            } else if (header === 'interests' && value) {
              student[header] = value.split(';').map(i => i.trim()).filter(Boolean);
            } else if (value) {
              student[header] = value;
            }
          });
          
          // Validate required fields
          if (student.full_name && student.email && student.major && student.academic_level) {
            students.push(student);
          }
        }
      }

      if (students.length === 0) {
        setError("No valid student records found in the CSV");
        setProcessing(false);
        return;
      }

      // Bulk create students
      await Student.bulkCreate(students);
      setSuccess(`Successfully imported ${students.length} students`);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error) {
      console.error("Error processing CSV:", error);
      setError("Error processing CSV file. Please check the format and try again.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = `full_name,email,student_id,major,academic_level,gpa,interests,career_goal
John Doe,john.doe@email.com,S12345,Computer Science,junior,3.75,programming;web development,Software Engineer
Jane Smith,jane.smith@email.com,S12346,Business Administration,senior,3.85,marketing;analytics,Marketing Manager`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Import Students from CSV</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Template Download */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Need a template?</p>
                  <p className="text-sm text-blue-700">Download our CSV template to get started</p>
                </div>
              </div>
              <Button variant="outline" onClick={downloadTemplate} className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? "border-blue-400 bg-blue-50" 
                  : "border-slate-300 hover:border-slate-400"
              } ${processing ? "opacity-50 pointer-events-none" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
              
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-slate-500" />
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {processing ? "Processing..." : "Upload CSV File"}
              </h3>
              <p className="text-slate-600 mb-4">
                {processing ? "Please wait while we import your students" : "Drag and drop your CSV file here, or click to browse"}
              </p>
              
              {!processing && (
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Select File
                </Button>
              )}
            </div>

            {/* Required Fields Info */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Required CSV Columns:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div>• full_name</div>
                <div>• email</div>
                <div>• major</div>
                <div>• academic_level</div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Optional: student_id, gpa, interests (semicolon-separated), career_goal
              </p>
            </div>

            {/* Status Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-emerald-200 bg-emerald-50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800">{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="border-t border-slate-200 flex justify-end">
            <Button variant="outline" onClick={onCancel} disabled={processing}>
              {success ? "Close" : "Cancel"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}