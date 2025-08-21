'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { parseCSV } from '@/lib/utils'
import { 
  validateCSVStudentData, 
  transformCSVToStudent,
  type CSVStudentData 
} from '@/lib/validations/student'

interface CSVImportFormProps {
  onImport: (students: any[]) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

interface ParsedRow {
  data: any
  errors: string[]
  isValid: boolean
}

export function CSVImportForm({ onImport, onCancel, isLoading }: CSVImportFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedRow[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload')
  const [headers, setHeaders] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const requiredFields = {
    name: 'Name',
    major: 'Major',
    academic_level: 'Academic Level'
  }

  const optionalFields = {
    email: 'Email',
    gpa: 'GPA',
    career_interests: 'Career Interests (comma-separated)'
  }

  const allFields = { ...requiredFields, ...optionalFields }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    parseFile(selectedFile)
  }

  const parseFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const csvText = e.target?.result as string
      const rows = parseCSV(csvText)
      
      if (rows.length === 0) {
        alert('CSV file is empty')
        return
      }

      const headers = rows[0]
      setHeaders(headers)
      
      // Auto-detect column mappings
      const autoMapping: Record<string, string> = {}
      Object.keys(allFields).forEach(field => {
        const lowerField = field.toLowerCase().replace('_', ' ')
        const matchingHeader = headers.find(header => 
          header.toLowerCase().includes(lowerField) ||
          lowerField.includes(header.toLowerCase())
        )
        if (matchingHeader) {
          autoMapping[field] = matchingHeader
        }
      })
      
      setMapping(autoMapping)
      setStep('map')
    }
    reader.readAsText(file)
  }

  const handleMapping = () => {
    if (!file) return

    // Validate that all required fields are mapped
    const missingRequired = Object.keys(requiredFields).filter(field => !mapping[field])
    if (missingRequired.length > 0) {
      alert(`Please map these required fields: ${missingRequired.map(f => requiredFields[f as keyof typeof requiredFields]).join(', ')}`)
      return
    }

    // Parse data with mapping
    const reader = new FileReader()
    reader.onload = (e) => {
      const csvText = e.target?.result as string
      const rows = parseCSV(csvText)
      const dataRows = rows.slice(1) // Skip header row

      const parsed: ParsedRow[] = dataRows.map((row, index) => {
        try {
          // Map CSV columns to our data structure
          const mappedData: any = {}
          Object.entries(mapping).forEach(([field, csvColumn]) => {
            const columnIndex = headers.indexOf(csvColumn)
            if (columnIndex !== -1) {
              mappedData[field] = row[columnIndex] || ''
            }
          })

          // Validate the mapped data
          const validatedData = validateCSVStudentData(mappedData)
          const transformedData = transformCSVToStudent(validatedData)

          return {
            data: { ...transformedData, rowNumber: index + 2 },
            errors: [],
            isValid: true
          }
        } catch (error: any) {
          return {
            data: { rowNumber: index + 2 },
            errors: error.errors?.map((e: any) => e.message) || [error.message],
            isValid: false
          }
        }
      })

      setParsedData(parsed)
      setStep('preview')
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    const validStudents = parsedData
      .filter(row => row.isValid)
      .map(row => row.data)

    await onImport(validStudents)
  }

  const resetForm = () => {
    setFile(null)
    setParsedData([])
    setMapping({})
    setStep('upload')
    setHeaders([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validCount = parsedData.filter(row => row.isValid).length
  const errorCount = parsedData.filter(row => !row.isValid).length

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Import Students from CSV</CardTitle>
        <CardDescription>
          Upload a CSV file with student information to bulk import students
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'upload' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="csvFile">Select CSV File</Label>
              <Input
                ref={fileInputRef}
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="mt-2"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">CSV Format Requirements</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Required columns:</strong> Name, Major, Academic Level</p>
                <p><strong>Optional columns:</strong> Email, GPA, Career Interests</p>
                <p><strong>Academic Level values:</strong> Freshman, Sophomore, Junior, Senior</p>
                <p><strong>GPA format:</strong> Number between 0.0 and 4.0</p>
                <p><strong>Career Interests:</strong> Comma-separated values</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Sample CSV Format</h3>
              <pre className="text-xs text-gray-600 overflow-x-auto">
{`Name,Email,Major,Academic Level,GPA,Career Interests
John Doe,john@email.com,Computer Science,Junior,3.5,"Software Engineering, Data Science"
Jane Smith,jane@email.com,Finance,Senior,3.8,"Investment Banking, Financial Analysis"
Bob Johnson,,Marketing,Sophomore,3.2,"Digital Marketing, Brand Management"`}
              </pre>
            </div>
          </div>
        )}

        {step === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Map CSV Columns</h3>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Choose Different File
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Map your CSV columns to the required student fields. Required fields are marked with *.
            </p>

            <div className="grid gap-4">
              {Object.entries(allFields).map(([field, label]) => (
                <div key={field} className="grid grid-cols-3 gap-4 items-center">
                  <Label className="text-sm font-medium">
                    {label} {requiredFields[field as keyof typeof requiredFields] ? '*' : ''}
                  </Label>
                  <select
                    value={mapping[field] || ''}
                    onChange={(e) => setMapping(prev => ({ ...prev, [field]: e.target.value }))}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">-- Select Column --</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-500">
                    {mapping[field] ? `→ ${mapping[field]}` : 'Not mapped'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleMapping}>
                Continue to Preview
              </Button>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Import Preview</h3>
              <Button variant="outline" onClick={() => setStep('map')}>
                Adjust Mapping
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{validCount}</div>
                <div className="text-sm text-green-800">Valid Students</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-red-800">Errors</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{parsedData.length}</div>
                <div className="text-sm text-blue-800">Total Rows</div>
              </div>
            </div>

            {errorCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Errors Found</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {parsedData
                    .filter(row => !row.isValid)
                    .slice(0, 10)
                    .map((row, index) => (
                      <div key={index} className="text-sm text-red-800">
                        <strong>Row {row.data.rowNumber}:</strong> {row.errors.join(', ')}
                      </div>
                    ))}
                  {parsedData.filter(row => !row.isValid).length > 10 && (
                    <div className="text-sm text-red-600">
                      ... and {parsedData.filter(row => !row.isValid).length - 10} more errors
                    </div>
                  )}
                </div>
              </div>
            )}

            {validCount > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Sample Valid Students</h4>
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Major</th>
                        <th className="text-left p-2">Level</th>
                        <th className="text-left p-2">GPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData
                        .filter(row => row.isValid)
                        .slice(0, 5)
                        .map((row, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{row.data.name}</td>
                            <td className="p-2">{row.data.major}</td>
                            <td className="p-2">{row.data.academicLevel}</td>
                            <td className="p-2">{row.data.gpa || 'N/A'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleImport}
                disabled={validCount === 0 || isLoading}
              >
                {isLoading ? 'Importing...' : `Import ${validCount} Students`}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Start Over
              </Button>
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}