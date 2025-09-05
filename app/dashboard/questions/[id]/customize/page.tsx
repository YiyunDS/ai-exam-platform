'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { customizeQuestionForClusters } from '@/lib/openai/questionCustomization'
import type { Question, Cluster } from '@/lib/types'
import type { CustomizationRequestData } from '@/lib/validations/question'

interface CustomizationResult {
  clusterId: string
  customizedText: string
  context: string
  tokensUsed: number
  processingTime: number
  cost: number
  success: boolean
  error?: string
}

export default function QuestionCustomizePage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  const [question, setQuestion] = useState<Question | null>(null)
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [selectedClusters, setSelectedClusters] = useState<string[]>([])
  const [customizationLevel, setCustomizationLevel] = useState<'high' | 'medium' | 'low'>('medium')
  const [preserveStructure, setPreserveStructure] = useState(true)
  const [includeContext, setIncludeContext] = useState(true)
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [customizationResults, setCustomizationResults] = useState<CustomizationResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestionAndClusters()
  }, [questionId])

  const fetchQuestionAndClusters = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch question
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .eq('teacher_id', user.id)
        .single()

      if (questionError || !questionData) {
        console.error('Error fetching question:', questionError)
        router.push('/dashboard/questions')
        return
      }

      setQuestion(questionData)

      // Fetch available clusters
      const { data: clustersData, error: clustersError } = await supabase
        .from('clusters')
        .select('*')
        .eq('teacher_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (clustersError) {
        console.error('Error fetching clusters:', clustersError)
        return
      }

      setClusters(clustersData || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClusterSelection = (clusterId: string) => {
    setSelectedClusters(prev => 
      prev.includes(clusterId)
        ? prev.filter(id => id !== clusterId)
        : [...prev, clusterId]
    )
  }

  const handleSelectAll = () => {
    setSelectedClusters(clusters.map(c => c.id))
  }

  const handleDeselectAll = () => {
    setSelectedClusters([])
  }

  const handleCustomize = async () => {
    if (!question || selectedClusters.length === 0) return

    setIsCustomizing(true)
    setShowResults(false)

    try {
      // Prepare cluster data for AI customization
      const selectedClusterData = clusters
        .filter(cluster => selectedClusters.includes(cluster.id))
        .map(cluster => ({
          id: cluster.id,
          name: cluster.name,
          characteristics: {
            averageGPA: cluster.characteristics?.averageGPA || 3.0,
            commonInterests: cluster.characteristics?.commonInterests || [],
            dominantMajor: cluster.characteristics?.dominantMajor || 'General',
            dominantLevel: cluster.characteristics?.dominantLevel || 'Junior'
          }
        }))

      // Call OpenAI customization
      const result = await customizeQuestionForClusters(
        question.baselineQuestion,
        selectedClusterData,
        {
          preserveStructure,
          includeContext,
          customizationLevel
        }
      )

      setCustomizationResults(result.results)
      
      // Save results to database
      for (const customizationResult of result.results) {
        if (customizationResult.success) {
          await supabase
            .from('customized_questions')
            .insert({
              question_id: questionId,
              cluster_id: customizationResult.clusterId,
              customized_text: customizationResult.customizedText,
              context_description: customizationResult.context,
              customization_metadata: {
                customizationLevel,
                preserveStructure,
                includeContext,
                additionalInstructions,
                tokensUsed: customizationResult.tokensUsed,
                processingTime: customizationResult.processingTime,
                cost: customizationResult.cost
              },
              status: 'pending_review'
            })
        }
      }

      // Update question usage count
      await supabase
        .from('questions')
        .update({ 
          usage_count: (question.usageCount || 0) + result.successCount 
        })
        .eq('id', questionId)

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          teacher_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'customized',
          resource_type: 'question',
          details: {
            question_id: questionId,
            clusters_count: selectedClusters.length,
            success_count: result.successCount,
            failure_count: result.failureCount,
            total_tokens: result.totalTokensUsed,
            total_cost: result.totalCost
          }
        })

      setShowResults(true)
    } catch (error) {
      console.error('Error customizing question:', error)
      alert('Error customizing question. Please try again.')
    } finally {
      setIsCustomizing(false)
    }
  }

  const getClusterInfo = (cluster: Cluster) => {
    const chars = cluster.characteristics
    return `${chars?.studentCount || 0} students • Avg GPA: ${chars?.averageGPA?.toFixed(2) || 'N/A'} • ${chars?.dominantMajor || 'Mixed majors'}`
  }

  const getCustomizationLevelDescription = (level: string) => {
    switch (level) {
      case 'high':
        return 'Maximum contextualization with industry-specific scenarios'
      case 'medium':
        return 'Balanced approach with relevant examples and terminology'
      case 'low':
        return 'Minimal changes, focus on terminology and simple context'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/questions" className="text-blue-600 hover:text-blue-500">
            ← Back to Questions
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/questions" className="text-blue-600 hover:text-blue-500">
            ← Back to Questions
          </Link>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Question not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/questions" className="text-blue-600 hover:text-blue-500">
          ← Back to Questions
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customize Question</h1>
          <p className="text-gray-600 mt-1">Generate personalized versions for your student clusters</p>
        </div>
      </div>

      {/* Question Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{question.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span>{question.subject}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  question.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                  question.difficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {question.difficultyLevel}
                </span>
                <span>•</span>
                <span>{question.questionType}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800">{question.baselineQuestion}</p>
            </div>
            {question.learningObjectives.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</p>
                <div className="flex flex-wrap gap-2">
                  {question.learningObjectives.map((objective, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                      {objective}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <>
          {/* Cluster Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Student Clusters</CardTitle>
                  <CardDescription>
                    Choose which student groups you want to create customized questions for
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                    Deselect All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {clusters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No student clusters found.</p>
                  <Link href="/dashboard/students">
                    <Button>Create Student Clusters</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedClusters.includes(cluster.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleClusterSelection(cluster.id)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedClusters.includes(cluster.id)}
                          onChange={() => handleClusterSelection(cluster.id)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{cluster.name}</h4>
                          <p className="text-sm text-gray-600">{getClusterInfo(cluster)}</p>
                          {cluster.characteristics?.commonInterests && cluster.characteristics.commonInterests.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {cluster.characteristics.commonInterests.slice(0, 3).map((interest, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    {interest}
                                  </span>
                                ))}
                                {cluster.characteristics.commonInterests.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    +{cluster.characteristics.commonInterests.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Customization Settings</CardTitle>
              <CardDescription>
                Configure how the AI should adapt your question for each cluster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customization Level */}
              <div className="space-y-3">
                <Label>Customization Level</Label>
                <div className="space-y-3">
                  {(['high', 'medium', 'low'] as const).map((level) => (
                    <div key={level} className="flex items-start gap-3">
                      <input
                        type="radio"
                        id={level}
                        name="customizationLevel"
                        value={level}
                        checked={customizationLevel === level}
                        onChange={(e) => setCustomizationLevel(e.target.value as 'high' | 'medium' | 'low')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor={level} className="font-medium capitalize cursor-pointer">
                          {level} Customization
                        </label>
                        <p className="text-sm text-gray-600">
                          {getCustomizationLevelDescription(level)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="preserveStructure"
                    checked={preserveStructure}
                    onChange={(e) => setPreserveStructure(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <label htmlFor="preserveStructure" className="font-medium cursor-pointer">
                      Preserve Question Structure
                    </label>
                    <p className="text-sm text-gray-600">
                      Keep the original format and organization of the question
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="includeContext"
                    checked={includeContext}
                    onChange={(e) => setIncludeContext(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <label htmlFor="includeContext" className="font-medium cursor-pointer">
                      Include Real-World Context
                    </label>
                    <p className="text-sm text-gray-600">
                      Add industry-specific scenarios and professional contexts
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Instructions */}
              <div className="space-y-2">
                <Label htmlFor="additionalInstructions">
                  Additional Instructions (Optional)
                </Label>
                <textarea
                  id="additionalInstructions"
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Any specific requirements or constraints for the customization..."
                  rows={3}
                  maxLength={500}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <p className="text-xs text-gray-500">
                  {additionalInstructions.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customize Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleCustomize}
              disabled={selectedClusters.length === 0 || isCustomizing}
              className="flex-1"
              size="lg"
            >
              {isCustomizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Customizing Questions...
                </>
              ) : (
                `Customize for ${selectedClusters.length} Cluster${selectedClusters.length !== 1 ? 's' : ''}`
              )}
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/questions')}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        /* Customization Results */
        <Card>
          <CardHeader>
            <CardTitle>Customization Results</CardTitle>
            <CardDescription>
              Review your customized questions before adding them to your collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {customizationResults.filter(r => r.success).length}
                  </div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {customizationResults.filter(r => !r.success).length}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {customizationResults.reduce((sum, r) => sum + r.tokensUsed, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Tokens Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${customizationResults.reduce((sum, r) => sum + r.cost, 0).toFixed(4)}
                  </div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
              </div>

              {/* Individual Results */}
              <div className="space-y-4">
                {customizationResults.map((result) => {
                  const cluster = clusters.find(c => c.id === result.clusterId)
                  return (
                    <Card key={result.clusterId} className={result.success ? '' : 'border-red-200'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {cluster?.name || 'Unknown Cluster'}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                ✓ Success
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                                ✗ Failed
                              </span>
                            )}
                          </div>
                        </div>
                        {result.context && (
                          <CardDescription>{result.context}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {result.success ? (
                          <div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                              <p className="text-gray-800 leading-relaxed">
                                {result.customizedText}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Tokens: {result.tokensUsed}</span>
                              <span>Cost: ${result.cost.toFixed(4)}</span>
                              <span>Time: {result.processingTime}ms</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-red-600">
                            <p>Error: {result.error}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => router.push('/dashboard/questions')}
                  className="flex-1"
                >
                  View All Questions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false)
                    setCustomizationResults([])
                    setSelectedClusters([])
                  }}
                >
                  Customize Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}