'use client'

import React, { useState } from 'react'
import { 
  Brain, 
  Users, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  BookOpen,
  Target,
  Lightbulb,
  RefreshCw,
  Settings,
  Info,
  Eye,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StudentGroup {
  id: string
  name: string
  icon: string
  color: string
  students: number
  interests: string[]
  keywords: string[]
}

interface GeneratedVariation {
  question: string
  context: string
  preservedObjective: string
  difficulty: string
  adaptations: string[]
}

const PersonalizedQuestionGenerator: React.FC = () => {
  const [baselineQuestion, setBaselineQuestion] = useState('')
  const [learningObjective, setLearningObjective] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [generatedVariations, setGeneratedVariations] = useState<Record<string, GeneratedVariation>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')

  // Student groups with educational context
  const studentGroups: StudentGroup[] = [
    { 
      id: 'finance', 
      name: 'Finance', 
      icon: '💰', 
      color: '#4F46E5', 
      students: 45,
      interests: ['portfolio', 'investment', 'ROI', 'market analysis', 'risk management'],
      keywords: ['financial', 'monetary', 'economic', 'banking', 'trading']
    },
    { 
      id: 'marketing', 
      name: 'Marketing', 
      icon: '📊', 
      color: '#EC4899', 
      students: 38,
      interests: ['campaigns', 'analytics', 'customer behavior', 'brand management', 'digital marketing'],
      keywords: ['campaign', 'brand', 'customer', 'audience', 'conversion']
    },
    { 
      id: 'engineering', 
      name: 'Engineering', 
      icon: '⚙️', 
      color: '#10B981', 
      students: 52,
      interests: ['systems', 'optimization', 'efficiency', 'innovation', 'problem-solving'],
      keywords: ['technical', 'system', 'process', 'engineering', 'optimization']
    },
    { 
      id: 'medicine', 
      name: 'Medicine', 
      icon: '🏥', 
      color: '#EF4444', 
      students: 29,
      interests: ['patient care', 'diagnosis', 'treatment', 'clinical research', 'healthcare'],
      keywords: ['patient', 'clinical', 'treatment', 'medical', 'health']
    },
    { 
      id: 'arts', 
      name: 'Liberal Arts', 
      icon: '🎨', 
      color: '#A855F7', 
      students: 33,
      interests: ['creativity', 'culture', 'history', 'literature', 'critical thinking'],
      keywords: ['cultural', 'artistic', 'creative', 'historical', 'literary']
    },
    { 
      id: 'sports', 
      name: 'Sports Science', 
      icon: '🏃', 
      color: '#F59E0B', 
      students: 21,
      interests: ['performance', 'athletics', 'fitness', 'biomechanics', 'sports psychology'],
      keywords: ['athletic', 'performance', 'training', 'sports', 'fitness']
    }
  ]

  const handleGenerateVariations = async () => {
    setIsGenerating(true)
    
    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const variations: Record<string, GeneratedVariation> = {}
    selectedGroups.forEach(groupId => {
      const group = studentGroups.find(g => g.id === groupId)!
      variations[groupId] = {
        question: generateContextualQuestion(baselineQuestion, group),
        context: `Adapted for ${group.name} students with relevant industry examples`,
        preservedObjective: learningObjective,
        difficulty: difficulty,
        adaptations: [
          'Industry-specific terminology',
          'Relevant real-world scenarios',
          'Same mathematical concepts',
          'Consistent difficulty level'
        ]
      }
    })
    
    setGeneratedVariations(variations)
    setIsGenerating(false)
    setActiveTab('generate')
  }

  const generateContextualQuestion = (baseline: string, group: StudentGroup): string => {
    const contextMap: Record<string, string> = {
      'Finance': 'Analyze the following portfolio returns and calculate the mean and standard deviation for investment risk assessment:',
      'Marketing': 'Examine these campaign performance metrics and calculate the mean and standard deviation for ROI analysis:',
      'Engineering': 'Review these system efficiency measurements and calculate the mean and standard deviation for quality control:',
      'Medicine': 'Analyze these patient recovery time data points and calculate the mean and standard deviation for treatment evaluation:',
      'Liberal Arts': 'Study these historical population data points and calculate the mean and standard deviation for demographic analysis:',
      'Sports Science': 'Evaluate these athletic performance scores and calculate the mean and standard deviation for training assessment:'
    }
    
    if (baseline.toLowerCase().includes('calculate') && baseline.toLowerCase().includes('mean')) {
      return contextMap[group.name] + ' [5, 20, 40, 65, 90]'
    }
    
    return baseline + ` (Contextualized for ${group.name} students)`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  const totalStudents = selectedGroups.reduce((sum, groupId) => {
    const group = studentGroups.find(g => g.id === groupId)
    return sum + (group?.students || 0)
  }, 0)

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-navy-800 to-navy-900 border-0 text-white">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-teal-500/20 rounded-2xl">
                <Brain className="h-12 w-12 text-teal-400" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold mb-2">
                  Personalized Question Generator
                </CardTitle>
                <p className="text-white/80 text-lg">
                  Create contextually relevant questions for different student groups while maintaining learning objectives
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{studentGroups.reduce((sum, g) => sum + g.students, 0)}</div>
                <div className="text-sm text-white/60">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{studentGroups.length}</div>
                <div className="text-sm text-white/60">Groups</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1,256</div>
                <div className="text-sm text-white/60">Generated</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BookOpen className="h-5 w-5" />
              Baseline Question
              <Button variant="ghost" size="sm" className="ml-auto">
                <Info className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Learning Objective */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Target className="h-4 w-4" />
                Learning Objective
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., Understanding statistical measures of central tendency"
                value={learningObjective}
                onChange={(e) => setLearningObjective(e.target.value)}
              />
            </div>

            {/* Original Question */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lightbulb className="h-4 w-4" />
                Original Question
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Enter your baseline question here...&#10;Example: Calculate the mean and standard deviation for: 5, 20, 40, 65, 90"
                value={baselineQuestion}
                onChange={(e) => setBaselineQuestion(e.target.value)}
              />
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Difficulty Level</label>
              <div className="grid grid-cols-4 gap-2">
                {['easy', 'medium', 'hard', 'expert'].map((level) => (
                  <button
                    key={level}
                    className={`p-3 rounded-lg border-2 font-medium capitalize transition-all ${
                      difficulty === level
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'border-gray-200 hover:border-teal-500'
                    }`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Groups Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4" />
                Select Student Groups
                {selectedGroups.length > 0 && (
                  <span className="text-teal-600">({totalStudents} students selected)</span>
                )}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studentGroups.map((group) => (
                  <label
                    key={group.id}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedGroups.includes(group.id)
                        ? 'border-2 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      borderColor: selectedGroups.includes(group.id) ? group.color : undefined,
                      backgroundColor: selectedGroups.includes(group.id) ? `${group.color}10` : undefined
                    }}
                  >
                    <input
                      type="checkbox"
                      className="absolute opacity-0"
                      checked={selectedGroups.includes(group.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGroups([...selectedGroups, group.id])
                        } else {
                          setSelectedGroups(selectedGroups.filter(id => id !== group.id))
                        }
                      }}
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg">
                        {group.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{group.name}</div>
                        <div className="text-sm text-gray-500">{group.students} students</div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${
                      selectedGroups.includes(group.id) 
                        ? 'bg-white border-2' 
                        : 'border-gray-300'
                    }`}
                      style={{ borderColor: selectedGroups.includes(group.id) ? group.color : undefined }}
                    >
                      {selectedGroups.includes(group.id) && (
                        <Check className="h-4 w-4" style={{ color: group.color }} />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3"
              onClick={handleGenerateVariations}
              disabled={!baselineQuestion.trim() || selectedGroups.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Generating Personalized Questions...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Variations ({selectedGroups.length} groups)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  className={`px-3 py-1 rounded transition-all ${
                    activeTab === 'generate' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('generate')}
                >
                  Generated Variations
                </button>
                <button
                  className={`px-3 py-1 rounded transition-all ${
                    activeTab === 'preview' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('preview')}
                >
                  Preview
                </button>
              </div>
              {Object.keys(generatedVariations).length > 0 && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {Object.keys(generatedVariations).length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto">
                  <Sparkles className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Variations Yet</h3>
                  <p className="text-gray-600">Select student groups and generate personalized questions</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(generatedVariations).map(([groupId, variation]) => {
                  const group = studentGroups.find(g => g.id === groupId)!
                  return (
                    <div 
                      key={groupId} 
                      className="border-l-4 bg-gray-50 rounded-lg p-4 space-y-3"
                      style={{ borderLeftColor: group.color }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{group.icon}</div>
                          <div>
                            <h3 className="font-semibold">{group.name}</h3>
                            <p className="text-sm text-gray-500">{group.students} students</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(variation.question)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                          Personalized Question:
                        </label>
                        <p className="text-gray-900 leading-relaxed">{variation.question}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-green-600">
                          <Target className="h-4 w-4" />
                          <span>Same Learning Objective</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {difficulty}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview for Students
                        </Button>
                        <Button size="sm" className="flex-1 bg-teal-500 hover:bg-teal-600">
                          Add to Exam
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PersonalizedQuestionGenerator