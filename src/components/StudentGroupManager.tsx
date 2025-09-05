'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Download,
  Users,
  Tag,
  Save,
  X,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StudentGroup {
  id: string
  name: string
  icon: string
  color: string
  students: Student[]
  interests: string[]
  keywords: string[]
}

interface Student {
  id: string
  name: string
  email: string
  studentId: string
}

const StudentGroupManager: React.FC = () => {
  const [groups, setGroups] = useState<StudentGroup[]>([
    {
      id: 'finance',
      name: 'Finance',
      icon: '💰',
      color: '#4F46E5',
      students: [
        { id: '1', name: 'John Smith', email: 'john@email.com', studentId: 'F001' },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', studentId: 'F002' }
      ],
      interests: ['stocks', 'portfolio', 'investment', 'ROI', 'market analysis'],
      keywords: ['financial', 'monetary', 'economic', 'banking', 'trading']
    },
    {
      id: 'marketing',
      name: 'Marketing', 
      icon: '📊',
      color: '#EC4899',
      students: [
        { id: '3', name: 'Mike Chen', email: 'mike@email.com', studentId: 'M001' }
      ],
      interests: ['campaigns', 'analytics', 'customer behavior', 'brand management'],
      keywords: ['campaign', 'brand', 'customer', 'audience', 'conversion']
    },
    {
      id: 'engineering',
      name: 'Engineering',
      icon: '⚙️', 
      color: '#10B981',
      students: [],
      interests: ['systems', 'optimization', 'efficiency', 'innovation'],
      keywords: ['technical', 'system', 'process', 'engineering', 'optimization']
    }
  ])

  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [editingGroup, setEditingGroup] = useState<StudentGroup | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const availableIcons = ['💰', '📊', '⚙️', '🏥', '🎨', '🏃', '💻', '🔬', '📚', '🎭', '🎵', '⚖️']
  const availableColors = ['#4F46E5', '#EC4899', '#10B981', '#EF4444', '#A855F7', '#F59E0B', '#06B6D4', '#84CC16']

  const [newGroup, setNewGroup] = useState({
    name: '',
    icon: '💻',
    color: '#4F46E5',
    interests: '',
    keywords: '',
    csvData: ''
  })

  const handleAddGroup = () => {
    if (!newGroup.name.trim()) return

    const group: StudentGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      icon: newGroup.icon,
      color: newGroup.color,
      students: [],
      interests: newGroup.interests.split(',').map(s => s.trim()).filter(Boolean),
      keywords: newGroup.keywords.split(',').map(s => s.trim()).filter(Boolean)
    }

    // Process CSV data if provided
    if (newGroup.csvData.trim()) {
      const lines = newGroup.csvData.split('\n')
      const students: Student[] = []
      
      lines.slice(1).forEach((line, index) => { // Skip header
        const [name, email, studentId] = line.split(',').map(s => s.trim())
        if (name && email) {
          students.push({
            id: `${group.id}_${index}`,
            name,
            email,
            studentId: studentId || `S${String(index + 1).padStart(3, '0')}`
          })
        }
      })
      
      group.students = students
    }

    setGroups([...groups, group])
    setIsAddingGroup(false)
    setNewGroup({
      name: '',
      icon: '💻',
      color: '#4F46E5',
      interests: '',
      keywords: '',
      csvData: ''
    })
  }

  const handleEditGroup = (group: StudentGroup) => {
    setEditingGroup(group)
    setNewGroup({
      name: group.name,
      icon: group.icon,
      color: group.color,
      interests: group.interests.join(', '),
      keywords: group.keywords.join(', '),
      csvData: ''
    })
  }

  const handleUpdateGroup = () => {
    if (!editingGroup || !newGroup.name.trim()) return

    const updatedGroups = groups.map(group => 
      group.id === editingGroup.id 
        ? {
            ...group,
            name: newGroup.name,
            icon: newGroup.icon,
            color: newGroup.color,
            interests: newGroup.interests.split(',').map(s => s.trim()).filter(Boolean),
            keywords: newGroup.keywords.split(',').map(s => s.trim()).filter(Boolean)
          }
        : group
    )

    setGroups(updatedGroups)
    setEditingGroup(null)
    setNewGroup({
      name: '',
      icon: '💻',
      color: '#4F46E5',
      interests: '',
      keywords: '',
      csvData: ''
    })
  }

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId))
    setShowDeleteConfirm(null)
  }

  const exportGroups = () => {
    const csvContent = groups.map(group => 
      `${group.name},${group.students.length},${group.interests.join(';')}`
    ).join('\n')
    
    const blob = new Blob([`Group Name,Student Count,Interests\n${csvContent}`], { 
      type: 'text/csv' 
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_groups.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              Student Group Configuration
            </CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" onClick={exportGroups}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setIsAddingGroup(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Group
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Groups Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold">Group</th>
                  <th className="text-left p-4 font-semibold">Students</th>
                  <th className="text-left p-4 font-semibold">Keywords/Interests</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{group.icon}</div>
                        <div>
                          <div className="font-semibold">{group.name}</div>
                          <div 
                            className="w-4 h-4 rounded mt-1"
                            style={{ backgroundColor: group.color }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{group.students.length}</span>
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {group.interests.slice(0, 3).map((interest) => (
                          <span 
                            key={interest}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {interest}
                          </span>
                        ))}
                        {group.interests.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            +{group.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowDeleteConfirm(group.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Group Modal */}
      {(isAddingGroup || editingGroup) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingGroup ? 'Edit Group' : 'Add New Group'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setIsAddingGroup(false)
                    setEditingGroup(null)
                    setNewGroup({
                      name: '',
                      icon: '💻',
                      color: '#4F46E5',
                      interests: '',
                      keywords: '',
                      csvData: ''
                    })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Group Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Group Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>

              {/* Icon Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      className={`p-3 text-2xl border rounded-lg hover:bg-gray-50 ${
                        newGroup.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setNewGroup({ ...newGroup, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Color Theme</label>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        newGroup.color === color ? 'border-gray-800' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewGroup({ ...newGroup, color })}
                    />
                  ))}
                </div>
              </div>

              {/* Keywords & Interests */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  Keywords & Interests
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Enter comma-separated keywords...
e.g., programming, algorithms, software development, debugging"
                  value={newGroup.interests}
                  onChange={(e) => setNewGroup({ ...newGroup, interests: e.target.value })}
                />
              </div>

              {/* Student Roster CSV */}
              {isAddingGroup && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Student Roster (CSV)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <div className="text-sm text-gray-600 mb-2">
                      Paste CSV data or upload file
                    </div>
                    <div className="text-xs text-gray-500">
                      Format: Name, Email, Student ID
                    </div>
                    <textarea
                      className="w-full mt-4 p-3 border rounded-lg text-sm font-mono"
                      rows={4}
                      placeholder="Name,Email,Student ID
John Smith,john@email.com,CS001
Jane Doe,jane@email.com,CS002"
                      value={newGroup.csvData}
                      onChange={(e) => setNewGroup({ ...newGroup, csvData: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsAddingGroup(false)
                    setEditingGroup(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={editingGroup ? handleUpdateGroup : handleAddGroup}
                  disabled={!newGroup.name.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingGroup ? 'Update Group' : 'Save Group'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Group</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this group? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteGroup(showDeleteConfirm)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default StudentGroupManager