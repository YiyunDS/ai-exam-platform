'use client'

import React, { useState } from 'react'
import { 
  GitBranch, 
  CheckCircle, 
  BarChart,
  Eye,
  ArrowRight,
  Target,
  Info,
  Copy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StudentGroup {
  id: string
  name: string
  icon: string
  color: string
  students: number
}

interface QuestionVariation {
  question: string
  context: string
  adaptations: string[]
  difficulty: string
}

interface QuestionComparisonViewProps {
  baselineQuestion: string
  learningObjective: string
  variations: Record<string, QuestionVariation>
  studentGroups: StudentGroup[]
}

const QuestionComparisonView: React.FC<QuestionComparisonViewProps> = ({
  baselineQuestion,
  learningObjective,
  variations,
  studentGroups
}) => {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
  const [showDetailedComparison, setShowDetailedComparison] = useState(false)

  const toggleComparison = (groupId: string) => {
    if (selectedForComparison.includes(groupId)) {
      setSelectedForComparison(selectedForComparison.filter(id => id !== groupId))
    } else {
      setSelectedForComparison([...selectedForComparison, groupId])
    }
  }

  const exportComparison = () => {
    // Implementation for exporting comparison
    console.log('Exporting comparison...', { baselineQuestion, variations, selectedForComparison })
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Baseline Question Display */}
      <Card className="bg-gradient-to-br from-navy-800 to-navy-900 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/20 rounded-xl">
              <GitBranch className="h-8 w-8 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Original Baseline Question</h2>
              <p className="text-white/70 mt-1">Foundation for all personalized variations</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-4">
            <div className="text-lg leading-relaxed">
              {baselineQuestion}
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex gap-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-teal-400" />
                  <span className="text-white/90">Core Learning Objective Preserved</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart className="h-5 w-5 text-teal-400" />
                  <span className="text-white/90">Difficulty: Consistent Across All Versions</span>
                </div>
              </div>
            </div>
            
            {learningObjective && (
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-teal-400" />
                  <span className="font-medium text-white/90">Learning Objective:</span>
                </div>
                <p className="text-white/80">{learningObjective}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Context-Adapted Variations</CardTitle>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDetailedComparison(!showDetailedComparison)}
                disabled={selectedForComparison.length < 2}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showDetailedComparison ? 'Hide' : 'Show'} Detailed Comparison
              </Button>
              <Button onClick={exportComparison}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Export Variations
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(variations).map(([groupId, variation]) => {
              const group = studentGroups.find(g => g.id === groupId)
              if (!group) return null

              return (
                <div 
                  key={groupId} 
                  className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  style={{
                    borderTopColor: group.color,
                    borderTopWidth: '4px'
                  }}
                >
                  <div className="bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{group.icon}</div>
                        <div>
                          <h4 className="font-semibold">{group.name}</h4>
                          <div 
                            className="px-2 py-1 rounded-full text-xs font-bold text-white w-fit"
                            style={{ backgroundColor: group.color }}
                          >
                            {group.students} students
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(variation.question)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="text-sm font-medium text-gray-600 mb-2">Question Preview:</div>
                      <div className="text-gray-800 leading-relaxed">{variation.question}</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                          Context Adaptations:
                        </h5>
                        <ul className="space-y-1">
                          {variation.adaptations.map((adaptation, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-green-600 font-bold mt-0.5">✓</span>
                              {adaptation}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedForComparison.includes(groupId)}
                            onChange={() => toggleComparison(groupId)}
                            className="w-4 h-4 accent-teal-500"
                          />
                          <span className="text-sm text-gray-600">
                            Select for detailed comparison
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison Table */}
      {showDetailedComparison && selectedForComparison.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Info className="h-5 w-5" />
              Detailed Comparison Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold border-b-2 border-gray-200">
                      Aspect
                    </th>
                    {selectedForComparison.map(groupId => {
                      const group = studentGroups.find(g => g.id === groupId)
                      return (
                        <th key={groupId} className="text-left p-4 font-semibold border-b-2 border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{group?.icon}</span>
                            {group?.name}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 font-semibold bg-gray-50 border-b">Context</td>
                    {selectedForComparison.map(groupId => (
                      <td key={groupId} className="p-4 border-b">
                        {variations[groupId]?.context}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold bg-gray-50 border-b">Question Text</td>
                    {selectedForComparison.map(groupId => (
                      <td key={groupId} className="p-4 border-b">
                        <div className="max-w-xs">
                          {variations[groupId]?.question}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold bg-gray-50 border-b">Learning Objective</td>
                    {selectedForComparison.map(groupId => (
                      <td key={groupId} className="p-4 border-b">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Same as baseline
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold bg-gray-50 border-b">Difficulty</td>
                    {selectedForComparison.map(groupId => (
                      <td key={groupId} className="p-4 border-b">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          variations[groupId]?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          variations[groupId]?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          variations[groupId]?.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {variations[groupId]?.difficulty}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold bg-gray-50">Key Adaptations</td>
                    {selectedForComparison.map(groupId => (
                      <td key={groupId} className="p-4">
                        <ul className="space-y-1">
                          {variations[groupId]?.adaptations.slice(0, 2).map((adaptation, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-green-600 font-bold mt-0.5">•</span>
                              {adaptation}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedForComparison.length > 0 && (
        <div className="text-center py-4">
          <div className="text-sm text-gray-600 mb-4">
            {selectedForComparison.length} variation{selectedForComparison.length !== 1 ? 's' : ''} selected for comparison
          </div>
          {selectedForComparison.length < 2 && (
            <div className="text-sm text-gray-500">
              Select at least 2 variations to enable detailed comparison
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionComparisonView