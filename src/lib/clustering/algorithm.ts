import type { Student, Cluster } from '@/lib/types'

export interface ClusteringOptions {
  strategy: 'major_level' | 'gpa_interests' | 'custom'
  maxClusterSize: number
  minClusterSize: number
  gpaWeight?: number
  interestWeight?: number
  customCriteria?: Record<string, any>
}

export interface ClusterCharacteristics {
  averageGPA: number
  commonInterests: string[]
  learningStyle: string
  majorDistribution: Record<string, number>
  dominantMajor?: string
  dominantLevel?: string
}

export interface ClusteringResult {
  clusters: Array<{
    name: string
    description: string
    characteristics: ClusterCharacteristics
    studentIds: string[]
    criteria: Record<string, any>
  }>
  summary: {
    totalClusters: number
    totalStudents: number
    averageClusterSize: number
    ungroupedStudents: number
  }
}

/**
 * Main clustering function that groups students based on specified strategy
 */
export function clusterStudents(
  students: Student[],
  options: ClusteringOptions = {
    strategy: 'major_level',
    maxClusterSize: 15,
    minClusterSize: 5
  }
): ClusteringResult {
  if (students.length === 0) {
    return {
      clusters: [],
      summary: {
        totalClusters: 0,
        totalStudents: 0,
        averageClusterSize: 0,
        ungroupedStudents: 0
      }
    }
  }

  let clusters: Array<{
    name: string
    description: string
    characteristics: ClusterCharacteristics
    studentIds: string[]
    criteria: Record<string, any>
  }>

  switch (options.strategy) {
    case 'major_level':
      clusters = clusterByMajorAndLevel(students, options)
      break
    case 'gpa_interests':
      clusters = clusterByGPAAndInterests(students, options)
      break
    case 'custom':
      clusters = clusterByCustomCriteria(students, options)
      break
    default:
      clusters = clusterByMajorAndLevel(students, options)
  }

  // Filter out clusters that are too small and merge if possible
  clusters = optimizeClusterSizes(clusters, students, options)

  const totalStudentsInClusters = clusters.reduce((sum, cluster) => sum + cluster.studentIds.length, 0)
  const ungroupedStudents = students.length - totalStudentsInClusters

  return {
    clusters,
    summary: {
      totalClusters: clusters.length,
      totalStudents: students.length,
      averageClusterSize: clusters.length > 0 ? totalStudentsInClusters / clusters.length : 0,
      ungroupedStudents
    }
  }
}

/**
 * Cluster students primarily by major and academic level
 */
function clusterByMajorAndLevel(students: Student[], options: ClusteringOptions) {
  const groups = new Map<string, Student[]>()

  // Group by major + academic level
  students.forEach(student => {
    const key = `${student.major}_${student.academicLevel}`
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(student)
  })

  const clusters: Array<{
    name: string
    description: string
    characteristics: ClusterCharacteristics
    studentIds: string[]
    criteria: Record<string, any>
  }> = []

  groups.forEach((groupStudents, key) => {
    const [major, level] = key.split('_')
    
    // Split large groups if needed
    if (groupStudents.length > options.maxClusterSize) {
      const subClusters = splitLargeGroup(groupStudents, options.maxClusterSize)
      subClusters.forEach((subGroup, index) => {
        clusters.push({
          name: `${major} ${level}s${subClusters.length > 1 ? ` (Group ${index + 1})` : ''}`,
          description: `${level}-level ${major} students${subClusters.length > 1 ? ` - Group ${index + 1}` : ''}`,
          characteristics: calculateCharacteristics(subGroup),
          studentIds: subGroup.map(s => s.id),
          criteria: { major, academicLevel: level, groupIndex: index }
        })
      })
    } else if (groupStudents.length >= options.minClusterSize) {
      clusters.push({
        name: `${major} ${level}s`,
        description: `${level}-level ${major} students`,
        characteristics: calculateCharacteristics(groupStudents),
        studentIds: groupStudents.map(s => s.id),
        criteria: { major, academicLevel: level }
      })
    }
  })

  return clusters
}

/**
 * Cluster students by GPA ranges and common career interests
 */
function clusterByGPAAndInterests(students: Student[], options: ClusteringOptions) {
  const gpaWeight = options.gpaWeight || 0.4
  const interestWeight = options.interestWeight || 0.6

  // First, group by major to maintain subject relevance
  const majorGroups = new Map<string, Student[]>()
  students.forEach(student => {
    if (!majorGroups.has(student.major)) {
      majorGroups.set(student.major, [])
    }
    majorGroups.get(student.major)!.push(student)
  })

  const clusters: Array<{
    name: string
    description: string
    characteristics: ClusterCharacteristics
    studentIds: string[]
    criteria: Record<string, any>
  }> = []

  majorGroups.forEach((majorStudents, major) => {
    if (majorStudents.length < options.minClusterSize) return

    // Define GPA ranges
    const gpaRanges = [
      { min: 3.5, max: 4.0, label: 'High Performers' },
      { min: 3.0, max: 3.49, label: 'Strong Students' },
      { min: 2.5, max: 2.99, label: 'Developing Students' },
      { min: 0, max: 2.49, label: 'At-Risk Students' }
    ]

    // Group by GPA range
    gpaRanges.forEach(range => {
      const rangeStudents = majorStudents.filter(s => 
        s.gpa !== undefined && s.gpa >= range.min && s.gpa <= range.max
      )

      if (rangeStudents.length >= options.minClusterSize) {
        // Further group by common interests within GPA range
        const interestGroups = groupByCommonInterests(rangeStudents)
        
        if (interestGroups.length > 1) {
          interestGroups.forEach((group, index) => {
            if (group.students.length >= options.minClusterSize) {
              clusters.push({
                name: `${major} ${range.label} - ${group.commonInterest}`,
                description: `${major} students (GPA ${range.min}-${range.max}) interested in ${group.commonInterest}`,
                characteristics: calculateCharacteristics(group.students),
                studentIds: group.students.map(s => s.id),
                criteria: { 
                  major, 
                  gpaRange: range, 
                  commonInterest: group.commonInterest,
                  strategy: 'gpa_interests'
                }
              })
            }
          })
        } else {
          clusters.push({
            name: `${major} ${range.label}`,
            description: `${major} students with GPA ${range.min}-${range.max}`,
            characteristics: calculateCharacteristics(rangeStudents),
            studentIds: rangeStudents.map(s => s.id),
            criteria: { major, gpaRange: range, strategy: 'gpa_interests' }
          })
        }
      }
    })
  })

  return clusters
}

/**
 * Cluster students using custom criteria
 */
function clusterByCustomCriteria(students: Student[], options: ClusteringOptions) {
  // This is a placeholder for custom clustering logic
  // In practice, this would implement specific business rules
  return clusterByMajorAndLevel(students, options)
}

/**
 * Split a large group into smaller subgroups
 */
function splitLargeGroup(students: Student[], maxSize: number): Student[][] {
  const subGroups: Student[][] = []
  
  // Sort by GPA (if available) to ensure balanced distribution
  const sortedStudents = [...students].sort((a, b) => {
    if (a.gpa === undefined && b.gpa === undefined) return 0
    if (a.gpa === undefined) return 1
    if (b.gpa === undefined) return -1
    return b.gpa - a.gpa
  })

  // Distribute students evenly across subgroups
  const numGroups = Math.ceil(students.length / maxSize)
  for (let i = 0; i < numGroups; i++) {
    subGroups.push([])
  }

  sortedStudents.forEach((student, index) => {
    const groupIndex = index % numGroups
    subGroups[groupIndex].push(student)
  })

  return subGroups.filter(group => group.length > 0)
}

/**
 * Group students by their most common career interests
 */
function groupByCommonInterests(students: Student[]): Array<{
  commonInterest: string
  students: Student[]
}> {
  // Count interest frequency
  const interestCounts = new Map<string, number>()
  students.forEach(student => {
    student.careerInterests.forEach(interest => {
      interestCounts.set(interest, (interestCounts.get(interest) || 0) + 1)
    })
  })

  // Find most common interests
  const commonInterests = Array.from(interestCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([interest]) => interest)

  if (commonInterests.length === 0) {
    return [{ commonInterest: 'General', students }]
  }

  // Group students by their primary interest
  const groups = new Map<string, Student[]>()
  const ungrouped: Student[] = []

  students.forEach(student => {
    const primaryInterest = student.careerInterests.find(interest => 
      commonInterests.includes(interest)
    )

    if (primaryInterest) {
      if (!groups.has(primaryInterest)) {
        groups.set(primaryInterest, [])
      }
      groups.get(primaryInterest)!.push(student)
    } else {
      ungrouped.push(student)
    }
  })

  const result = Array.from(groups.entries()).map(([interest, students]) => ({
    commonInterest: interest,
    students
  }))

  // Add ungrouped students to the largest group or create a general group
  if (ungrouped.length > 0) {
    if (result.length > 0) {
      const largestGroup = result.reduce((max, group) => 
        group.students.length > max.students.length ? group : max
      )
      largestGroup.students.push(...ungrouped)
    } else {
      result.push({ commonInterest: 'General', students: ungrouped })
    }
  }

  return result
}

/**
 * Calculate characteristics for a group of students
 */
function calculateCharacteristics(students: Student[]): ClusterCharacteristics {
  const validGPAs = students.filter(s => s.gpa !== undefined).map(s => s.gpa!)
  const averageGPA = validGPAs.length > 0 ? validGPAs.reduce((sum, gpa) => sum + gpa, 0) / validGPAs.length : 0

  // Count interests
  const interestCounts = new Map<string, number>()
  students.forEach(student => {
    student.careerInterests.forEach(interest => {
      interestCounts.set(interest, (interestCounts.get(interest) || 0) + 1)
    })
  })

  const commonInterests = Array.from(interestCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([interest]) => interest)

  // Count majors
  const majorCounts = new Map<string, number>()
  students.forEach(student => {
    majorCounts.set(student.major, (majorCounts.get(student.major) || 0) + 1)
  })

  const majorDistribution = Object.fromEntries(majorCounts)
  const dominantMajor = Array.from(majorCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  // Determine learning style based on major and interests
  const learningStyle = determineLearningStyle(students, commonInterests)

  return {
    averageGPA,
    commonInterests,
    learningStyle,
    majorDistribution,
    dominantMajor
  }
}

/**
 * Determine learning style based on student data
 */
function determineLearningStyle(students: Student[], commonInterests: string[]): string {
  const majors = students.map(s => s.major)
  const hasQuantitative = majors.some(major => 
    ['Finance', 'Economics', 'Mathematics', 'Statistics', 'Computer Science', 'Engineering'].includes(major)
  )
  const hasCreative = majors.some(major => 
    ['Marketing', 'Art', 'English', 'Communications'].includes(major)
  )
  const hasAnalytical = commonInterests.some(interest => 
    interest.toLowerCase().includes('analysis') || 
    interest.toLowerCase().includes('research') ||
    interest.toLowerCase().includes('data')
  )

  if (hasQuantitative && hasAnalytical) return 'Analytical'
  if (hasCreative) return 'Creative'
  if (hasQuantitative) return 'Quantitative'
  if (hasAnalytical) return 'Research-Oriented'
  return 'Practical'
}

/**
 * Optimize cluster sizes by merging small clusters or splitting large ones
 */
function optimizeClusterSizes(
  clusters: Array<{
    name: string
    description: string
    characteristics: ClusterCharacteristics
    studentIds: string[]
    criteria: Record<string, any>
  }>,
  allStudents: Student[],
  options: ClusteringOptions
) {
  const optimized = [...clusters]

  // Remove clusters that are too small
  const validClusters = optimized.filter(cluster => 
    cluster.studentIds.length >= options.minClusterSize
  )

  // Try to merge small clusters with similar characteristics
  const finalClusters = mergeSimilarClusters(validClusters, allStudents, options)

  return finalClusters
}

/**
 * Merge clusters with similar characteristics
 */
function mergeSimilarClusters(
  clusters: Array<{
    name: string
    description: string
    characteristics: ClusterCharacteristics
    studentIds: string[]
    criteria: Record<string, any>
  }>,
  allStudents: Student[],
  options: ClusteringOptions
) {
  // Simple implementation: merge clusters with same dominant major and similar GPA ranges
  const merged = new Map<string, any>()

  clusters.forEach(cluster => {
    const key = cluster.characteristics.dominantMajor || 'general'
    
    if (!merged.has(key)) {
      merged.set(key, cluster)
    } else {
      const existing = merged.get(key)
      const combinedSize = existing.studentIds.length + cluster.studentIds.length
      
      if (combinedSize <= options.maxClusterSize) {
        // Merge clusters
        existing.studentIds.push(...cluster.studentIds)
        existing.name = `${cluster.characteristics.dominantMajor} Mixed Group`
        existing.description = `Combined ${cluster.characteristics.dominantMajor} students`
        
        // Recalculate characteristics
        const combinedStudents = allStudents.filter(s => 
          existing.studentIds.includes(s.id)
        )
        existing.characteristics = calculateCharacteristics(combinedStudents)
      } else {
        // Keep as separate cluster with modified name
        cluster.name += ` (Group ${Array.from(merged.values()).filter(c => 
          c.characteristics.dominantMajor === cluster.characteristics.dominantMajor
        ).length + 1})`
        merged.set(`${key}_${cluster.studentIds[0]}`, cluster)
      }
    }
  })

  return Array.from(merged.values())
}