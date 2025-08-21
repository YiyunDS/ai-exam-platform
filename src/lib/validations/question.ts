import { z } from 'zod'

export const difficultyLevels = ['Easy', 'Medium', 'Hard'] as const
export const questionTypes = ['Multiple Choice', 'Short Answer', 'Essay', 'Problem Solving'] as const

export const questionSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  
  baselineQuestion: z.string()
    .min(10, 'Question must be at least 10 characters')
    .max(2000, 'Question must be less than 2000 characters')
    .trim(),
  
  difficultyLevel: z.enum(difficultyLevels, {
    errorMap: () => ({ message: 'Please select a valid difficulty level' })
  }),
  
  subject: z.string()
    .min(1, 'Subject is required')
    .max(255, 'Subject must be less than 255 characters')
    .trim(),
  
  learningObjectives: z.array(z.string().trim())
    .min(1, 'At least one learning objective is required')
    .refine(objectives => objectives.every(obj => obj.length > 0), {
      message: 'Learning objectives cannot be empty'
    }),
  
  questionType: z.enum(questionTypes, {
    errorMap: () => ({ message: 'Please select a valid question type' })
  }),
  
  tags: z.array(z.string().trim())
    .default([])
    .refine(tags => tags.every(tag => tag.length > 0), {
      message: 'Tags cannot be empty'
    }),
  
  metadata: z.record(z.any()).optional()
})

export type QuestionFormData = z.infer<typeof questionSchema>

export const customizationRequestSchema = z.object({
  clusterIds: z.array(z.string())
    .min(1, 'At least one cluster must be selected'),
  
  customizationLevel: z.enum(['high', 'medium', 'low'], {
    errorMap: () => ({ message: 'Please select a customization level' })
  }),
  
  preserveStructure: z.boolean().default(true),
  
  includeContext: z.boolean().default(true),
  
  additionalInstructions: z.string()
    .max(500, 'Additional instructions must be less than 500 characters')
    .optional()
})

export type CustomizationRequestData = z.infer<typeof customizationRequestSchema>

export const customizedQuestionReviewSchema = z.object({
  approved: z.boolean(),
  feedback: z.string()
    .max(1000, 'Feedback must be less than 1000 characters')
    .optional()
})

export type CustomizedQuestionReviewData = z.infer<typeof customizedQuestionReviewSchema>

// Common subjects for autocomplete
export const commonSubjects = [
  'Statistics',
  'Mathematics',
  'Finance',
  'Economics',
  'Marketing',
  'Business Administration',
  'Computer Science',
  'Data Science',
  'Accounting',
  'Management',
  'Operations Research',
  'Psychology',
  'Sociology',
  'Political Science',
  'History',
  'English',
  'Science',
  'Physics',
  'Chemistry',
  'Biology'
]

// Common learning objectives for suggestions
export const commonLearningObjectives = [
  'Calculate descriptive statistics',
  'Interpret data variation',
  'Apply statistical concepts',
  'Analyze probability distributions',
  'Evaluate financial performance',
  'Assess investment risk',
  'Analyze market dynamics',
  'Evaluate business strategies',
  'Apply marketing principles',
  'Analyze consumer behavior',
  'Solve mathematical problems',
  'Apply computational thinking',
  'Analyze data patterns',
  'Make data-driven decisions',
  'Evaluate research findings',
  'Apply theoretical concepts',
  'Analyze case studies',
  'Develop critical thinking',
  'Apply problem-solving skills',
  'Synthesize information'
]

// Common tags for suggestions
export const commonTags = [
  'statistics',
  'probability',
  'mean',
  'standard deviation',
  'correlation',
  'regression',
  'hypothesis testing',
  'confidence intervals',
  'finance',
  'investment',
  'portfolio',
  'risk assessment',
  'marketing',
  'consumer behavior',
  'market analysis',
  'brand management',
  'data analysis',
  'research methods',
  'case study',
  'problem solving',
  'critical thinking',
  'real world application'
]

// Validation helper functions
export function validateQuestionData(data: unknown): QuestionFormData {
  return questionSchema.parse(data)
}

export function validateCustomizationRequest(data: unknown): CustomizationRequestData {
  return customizationRequestSchema.parse(data)
}

export function validateQuestionReview(data: unknown): CustomizedQuestionReviewData {
  return customizedQuestionReviewSchema.parse(data)
}

// Question template interfaces
export interface QuestionTemplate {
  id: string
  name: string
  description: string
  category: string
  templateData: QuestionFormData
  isPublic: boolean
  usageCount: number
}

// AI customization interfaces
export interface CustomizationProgress {
  clusterId: string
  clusterName: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  customizedText?: string
  context?: string
  error?: string
  tokensUsed?: number
  processingTime?: number
}

export interface CustomizationJob {
  id: string
  questionId: string
  totalClusters: number
  completedClusters: number
  failedClusters: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: CustomizationProgress[]
  startedAt: Date
  completedAt?: Date
  totalTokensUsed: number
  totalCost: number
}

// Question difficulty guidelines
export const difficultyGuidelines = {
  'Easy': {
    description: 'Basic understanding and recall',
    characteristics: [
      'Simple concepts and terminology',
      'Direct application of formulas',
      'Minimal analysis required',
      'Clear, straightforward scenarios'
    ]
  },
  'Medium': {
    description: 'Application and analysis',
    characteristics: [
      'Multi-step problem solving',
      'Moderate analytical thinking',
      'Integration of concepts',
      'Real-world applications'
    ]
  },
  'Hard': {
    description: 'Synthesis and evaluation',
    characteristics: [
      'Complex problem solving',
      'Critical analysis required',
      'Multiple concept integration',
      'Ambiguous or open-ended scenarios'
    ]
  }
} as const

// Question type guidelines
export const questionTypeGuidelines = {
  'Multiple Choice': {
    description: 'Select the best answer from options',
    bestFor: ['Knowledge recall', 'Concept understanding', 'Quick assessment'],
    structure: 'Question stem with 3-5 answer choices'
  },
  'Short Answer': {
    description: 'Brief written response (1-3 sentences)',
    bestFor: ['Concept explanation', 'Quick calculations', 'Definition recall'],
    structure: 'Clear question requiring concise response'
  },
  'Essay': {
    description: 'Extended written response with analysis',
    bestFor: ['Critical thinking', 'Argument development', 'Complex analysis'],
    structure: 'Open-ended prompt requiring detailed response'
  },
  'Problem Solving': {
    description: 'Step-by-step mathematical or logical solution',
    bestFor: ['Calculations', 'Formula application', 'Analytical thinking'],
    structure: 'Problem statement with clear solution path'
  }
} as const