// API Service Layer for LLM Integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface GenerationPayload {
  baselineQuestion: string
  learningObjective: string
  difficulty: string
  selectedGroups: string[]
}

interface QuestionVariation {
  question: string
  context: string
  adaptations: string[]
  difficulty: string
  confidence: number
}

interface StudentGroup {
  id: string
  name: string
  icon: string
  color: string
  students: number
  interests: string[]
  keywords: string[]
}

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export const QuestionGeneratorService = {
  // Generate personalized question variations
  async generateVariations(payload: GenerationPayload): Promise<Record<string, QuestionVariation>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          baseline_question: payload.baselineQuestion,
          learning_objective: payload.learningObjective,
          difficulty: payload.difficulty,
          student_groups: payload.selectedGroups,
          generation_params: {
            temperature: 0.7,
            max_tokens: 200,
            preserve_difficulty: true,
            maintain_objective: true,
            context_adaptation: true
          }
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Generation failed')
      }
      
      const data: ApiResponse<{ variations: Record<string, QuestionVariation> }> = await response.json()
      return data.data.variations
    } catch (error) {
      console.error('Error generating variations:', error)
      throw error
    }
  },

  // Get available student groups for a course
  async getStudentGroups(courseId?: string): Promise<StudentGroup[]> {
    try {
      const url = courseId ? 
        `${API_BASE_URL}/api/courses/${courseId}/groups` : 
        `${API_BASE_URL}/api/student-groups`
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch student groups')
      }
      
      const data: ApiResponse<{ groups: StudentGroup[] }> = await response.json()
      return data.data.groups
    } catch (error) {
      console.error('Error fetching student groups:', error)
      throw error
    }
  },

  // Save generated questions to an exam
  async saveToExam(examId: string, questions: Record<string, QuestionVariation>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/exams/${examId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ 
          questions: Object.entries(questions).map(([groupId, variation]) => ({
            group_id: groupId,
            ...variation
          }))
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save questions')
      }
    } catch (error) {
      console.error('Error saving questions:', error)
      throw error
    }
  },

  // Analyze question effectiveness and usage
  async analyzeEffectiveness(questionId: string): Promise<{
    usageCount: number
    averageScore: number
    studentFeedback: number
    groupPerformance: Record<string, number>
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}/analyze`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to analyze question effectiveness')
      }
      
      const data: ApiResponse<any> = await response.json()
      return data.data.analysis
    } catch (error) {
      console.error('Error analyzing question:', error)
      throw error
    }
  },

  // Get dashboard analytics
  async getDashboardStats(): Promise<{
    questionsGenerated: number
    activeStudents: number
    studentGroups: number
    engagementRate: number
    recentGenerations: any[]
    groupEngagement: Record<string, number>
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      
      const data: ApiResponse<any> = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  // Create or update student group
  async saveStudentGroup(group: Partial<StudentGroup>): Promise<StudentGroup> {
    try {
      const method = group.id ? 'PUT' : 'POST'
      const url = group.id ? 
        `${API_BASE_URL}/api/student-groups/${group.id}` : 
        `${API_BASE_URL}/api/student-groups`

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(group)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save student group')
      }
      
      const data: ApiResponse<{ group: StudentGroup }> = await response.json()
      return data.data.group
    } catch (error) {
      console.error('Error saving student group:', error)
      throw error
    }
  },

  // Delete student group
  async deleteStudentGroup(groupId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student-groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete student group')
      }
    } catch (error) {
      console.error('Error deleting student group:', error)
      throw error
    }
  },

  // Batch import students via CSV
  async importStudentsCsv(groupId: string, csvData: string): Promise<{
    imported: number
    errors: string[]
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student-groups/${groupId}/import-csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ csv_data: csvData })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to import students')
      }
      
      const data: ApiResponse<any> = await response.json()
      return data.data
    } catch (error) {
      console.error('Error importing students:', error)
      throw error
    }
  }
}

// Helper function to get authentication token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// Error handling utility
export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// Request retry utility with exponential backoff
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        break
      }
      
      // Exponential backoff with jitter
      const waitTime = delay * Math.pow(2, attempt - 1) + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw lastError!
}