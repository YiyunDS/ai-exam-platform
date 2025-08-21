'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { clusterStudents, type ClusteringOptions } from '@/lib/clustering/algorithm'
import type { Student, Cluster } from '@/lib/types'

export default function ClustersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch clusters and students in parallel
      const [clustersResult, studentsResult] = await Promise.all([
        supabase
          .from('clusters')
          .select('*')
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('students')
          .select('*')
          .eq('teacher_id', user.id)
          .eq('active', true)
      ])

      if (clustersResult.error) {
        console.error('Error fetching clusters:', clustersResult.error)
        return
      }

      if (studentsResult.error) {
        console.error('Error fetching students:', studentsResult.error)
        return
      }

      setClusters(clustersResult.data || [])
      setStudents(studentsResult.data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateClusters = async (options: ClusteringOptions = {
    strategy: 'major_level',
    maxClusterSize: 15,
    minClusterSize: 5
  }) => {
    if (students.length === 0) {
      alert('You need to add students before generating clusters.')
      return
    }

    setGenerating(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Run clustering algorithm
      const clusteringResult = clusterStudents(students, options)

      if (clusteringResult.clusters.length === 0) {
        alert('Unable to create meaningful clusters. You may need more students or different criteria.')
        return
      }

      // Clear existing clusters
      await supabase
        .from('clusters')
        .delete()
        .eq('teacher_id', user.id)

      // Clear existing student-cluster relationships
      await supabase
        .from('student_clusters')
        .delete()
        .in('student_id', students.map(s => s.id))

      // Insert new clusters
      const newClusters = []
      for (const clusterData of clusteringResult.clusters) {
        const { data: cluster, error: clusterError } = await supabase
          .from('clusters')
          .insert({
            teacher_id: user.id,
            name: clusterData.name,
            description: clusterData.description,
            characteristics: clusterData.characteristics,
            clustering_criteria: clusterData.criteria,
            student_count: clusterData.studentIds.length,
            is_auto_generated: true
          })
          .select()
          .single()

        if (clusterError) {
          console.error('Error creating cluster:', clusterError)
          continue
        }

        newClusters.push(cluster)

        // Insert student-cluster relationships
        const studentClusterData = clusterData.studentIds.map(studentId => ({
          student_id: studentId,
          cluster_id: cluster.id,
          assigned_by: 'auto'
        }))

        const { error: relationError } = await supabase
          .from('student_clusters')
          .insert(studentClusterData)

        if (relationError) {
          console.error('Error creating student-cluster relationships:', relationError)
        }
      }

      // Log clustering job
      await supabase
        .from('clustering_jobs')
        .insert({
          teacher_id: user.id,
          status: 'completed',
          criteria: options,
          result: {
            clusters_created: clusteringResult.clusters.length,
            students_clustered: clusteringResult.summary.totalStudents - clusteringResult.summary.ungroupedStudents,
            summary: clusteringResult.summary
          }
        })

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          teacher_id: user.id,
          action: 'generated',
          resource_type: 'clusters',
          details: {
            cluster_count: clusteringResult.clusters.length,
            strategy: options.strategy,
            total_students: students.length
          }
        })

      setClusters(newClusters)
      
      alert(`Successfully created ${clusteringResult.clusters.length} clusters for ${clusteringResult.summary.totalStudents - clusteringResult.summary.ungroupedStudents} students!`)
    } catch (error) {
      console.error('Error generating clusters:', error)
      alert('Error generating clusters. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const getClusterColor = (index: number) => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-orange-100 border-orange-300 text-orange-800',
      'bg-pink-100 border-pink-300 text-pink-800',
      'bg-indigo-100 border-indigo-300 text-indigo-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-red-100 border-red-300 text-red-800'
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Student Clusters</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clusters...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Clusters</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => generateClusters()}
            disabled={generating || students.length === 0}
          >
            {generating ? 'Generating...' : 'Generate Clusters'}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{clusters.length}</div>
            <div className="text-sm text-gray-600">Total Clusters</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{students.length}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {clusters.reduce((sum, cluster) => sum + cluster.studentCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Students Clustered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {clusters.length > 0 ? Math.round(clusters.reduce((sum, cluster) => sum + cluster.studentCount, 0) / clusters.length) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Cluster Size</div>
          </CardContent>
        </Card>
      </div>

      {/* Clusters List */}
      {clusters.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {students.length === 0 ? (
              <div>
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium mb-2">No students to cluster</h3>
                <p className="text-gray-600 mb-6">
                  You need to add students before you can create clusters
                </p>
                <Link href="/dashboard/students">
                  <Button>Add Students</Button>
                </Link>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-lg font-medium mb-2">No clusters yet</h3>
                <p className="text-gray-600 mb-6">
                  Generate AI-powered student clusters to create personalized question groups
                </p>
                <Button onClick={() => generateClusters()} disabled={generating}>
                  {generating ? 'Generating...' : 'Generate First Clusters'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {clusters.map((cluster, index) => (
            <Card key={cluster.id} className={`border-l-4 ${getClusterColor(index).split(' ')[1]} ${getClusterColor(index).split(' ')[2]}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${getClusterColor(index).split(' ')[0]}`}></span>
                      {cluster.name}
                    </CardTitle>
                    <CardDescription>{cluster.description}</CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getClusterColor(index)}`}>
                    {cluster.studentCount} students
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Characteristics */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Characteristics</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {cluster.characteristics.averageGPA && (
                        <div>Average GPA: {cluster.characteristics.averageGPA.toFixed(2)}</div>
                      )}
                      <div>Learning Style: {cluster.characteristics.learningStyle}</div>
                      {cluster.characteristics.dominantMajor && (
                        <div>Primary Major: {cluster.characteristics.dominantMajor}</div>
                      )}
                    </div>
                  </div>

                  {/* Common Interests */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Common Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {cluster.characteristics.commonInterests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {interest}
                        </span>
                      ))}
                      {cluster.characteristics.commonInterests.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{cluster.characteristics.commonInterests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Major Distribution */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Major Distribution</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {Object.entries(cluster.characteristics.majorDistribution)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([major, count]) => (
                          <div key={major}>{major}: {count}</div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created {new Date(cluster.createdAt).toLocaleDateString()}
                      {cluster.isAutoGenerated && ' • AI Generated'}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/clusters/${cluster.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Clustering Options Info */}
      {students.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🤖 AI Clustering</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <p className="text-sm mb-4">
              Our AI automatically groups students based on academic major, level, GPA, and career interests 
              to create meaningful clusters for personalized question generation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Primary Strategy:</strong><br />
                Major + Academic Level
              </div>
              <div>
                <strong>Cluster Size:</strong><br />
                5-15 students per group
              </div>
              <div>
                <strong>Optimization:</strong><br />
                Similar interests & GPA ranges
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}