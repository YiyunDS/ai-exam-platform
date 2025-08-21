import { openai, DEFAULT_MODEL, calculateCost } from './client'
import { 
  generateCustomizationPrompt, 
  generateBatchCustomizationPrompt,
  getMajorContext 
} from './prompts'
import type { AICustomizationRequest } from '@/lib/types'
import type { Cluster } from '@/lib/types'

export interface CustomizationResult {
  clusterId: string
  customizedText: string
  context: string
  tokensUsed: number
  processingTime: number
  cost: number
  success: boolean
  error?: string
}

export interface BatchCustomizationResult {
  results: CustomizationResult[]
  totalTokensUsed: number
  totalCost: number
  successCount: number
  failureCount: number
  processingTime: number
}

/**
 * Customize a single question for a specific cluster
 */
export async function customizeQuestionForCluster(
  request: AICustomizationRequest
): Promise<CustomizationResult> {
  const startTime = Date.now()
  
  try {
    const prompt = generateCustomizationPrompt(request)
    
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content creator who specializes in transforming generic academic questions into contextually relevant, engaging questions for specific student groups. Always maintain the same learning objectives and difficulty level.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const processingTime = Date.now() - startTime
    const tokensUsed = completion.usage?.total_tokens || 0
    const cost = calculateCost(DEFAULT_MODEL, 
      completion.usage?.prompt_tokens || 0, 
      completion.usage?.completion_tokens || 0
    )

    const customizedText = completion.choices[0]?.message?.content?.trim()
    
    if (!customizedText) {
      throw new Error('No customized question generated')
    }

    // Generate context description
    const majorContext = getMajorContext(request.clusterProfile.major)
    const contextDescription = `${request.clusterProfile.major} ${request.clusterProfile.academicLevel}s - ${majorContext.scenarios[0]}`

    return {
      clusterId: '', // Will be set by caller
      customizedText,
      context: contextDescription,
      tokensUsed,
      processingTime,
      cost,
      success: true
    }
  } catch (error: any) {
    const processingTime = Date.now() - startTime
    
    return {
      clusterId: '',
      customizedText: '',
      context: '',
      tokensUsed: 0,
      processingTime,
      cost: 0,
      success: false,
      error: error.message || 'Unknown error occurred'
    }
  }
}

/**
 * Customize a question for multiple clusters using batch processing
 */
export async function customizeQuestionForClusters(
  baselineQuestion: string,
  clusters: Array<{
    id: string
    name: string
    characteristics: {
      averageGPA: number
      commonInterests: string[]
      dominantMajor?: string
      dominantLevel?: string
    }
  }>,
  options: {
    preserveStructure?: boolean
    includeContext?: boolean
    customizationLevel?: 'high' | 'medium' | 'low'
  } = {}
): Promise<BatchCustomizationResult> {
  const startTime = Date.now()
  const results: CustomizationResult[] = []

  // Process clusters individually for better error handling and progress tracking
  for (const cluster of clusters) {
    try {
      const clusterProfile = {
        major: cluster.characteristics.dominantMajor || 'General',
        academicLevel: cluster.characteristics.dominantLevel || 'Junior',
        careerInterests: cluster.characteristics.commonInterests,
        averageGPA: cluster.characteristics.averageGPA
      }

      const constraints = {
        maintainDifficulty: true,
        includeRealWorldContext: options.includeContext !== false,
        preserveLearningObjectives: true,
        preserveStructure: options.preserveStructure !== false
      }

      const request: AICustomizationRequest = {
        baselineQuestion,
        clusterProfile,
        constraints
      }

      const result = await customizeQuestionForCluster(request)
      result.clusterId = cluster.id
      
      results.push(result)

      // Add a small delay to avoid rate limiting
      if (results.length < clusters.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error: any) {
      results.push({
        clusterId: cluster.id,
        customizedText: '',
        context: '',
        tokensUsed: 0,
        processingTime: 0,
        cost: 0,
        success: false,
        error: error.message || 'Failed to customize for this cluster'
      })
    }
  }

  const totalProcessingTime = Date.now() - startTime
  const totalTokensUsed = results.reduce((sum, result) => sum + result.tokensUsed, 0)
  const totalCost = results.reduce((sum, result) => sum + result.cost, 0)
  const successCount = results.filter(result => result.success).length
  const failureCount = results.length - successCount

  return {
    results,
    totalTokensUsed,
    totalCost,
    successCount,
    failureCount,
    processingTime: totalProcessingTime
  }
}

/**
 * Generate multiple variations of a customized question
 */
export async function generateQuestionVariations(
  customizedQuestion: string,
  clusterProfile: {
    major: string
    academicLevel: string
    careerInterests: string[]
    averageGPA: number
  },
  count: number = 3
): Promise<string[]> {
  try {
    const prompt = `
Generate ${count} different variations of the following customized question while maintaining the same learning objectives, difficulty level, and contextual relevance:

Original Question: "${customizedQuestion}"

Student Profile:
- Major: ${clusterProfile.major}
- Academic Level: ${clusterProfile.academicLevel}
- Career Interests: ${clusterProfile.careerInterests.join(', ')}
- Average GPA: ${clusterProfile.averageGPA.toFixed(2)}

Requirements:
1. Keep the same mathematical/technical requirements
2. Maintain the same difficulty level
3. Use different but relevant professional scenarios
4. Ensure each variation is distinct but equivalent

Return ONLY the variations, separated by "---" (three dashes).
`

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating equivalent question variations while maintaining difficulty and learning objectives.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (!response) {
      throw new Error('No variations generated')
    }

    const variations = response
      .split('---')
      .map(variation => variation.trim())
      .filter(variation => variation.length > 0)

    return variations.slice(0, count)
  } catch (error) {
    console.error('Error generating question variations:', error)
    return []
  }
}

/**
 * Validate that a customized question maintains the same difficulty as the original
 */
export async function validateQuestionDifficulty(
  originalQuestion: string,
  customizedQuestion: string,
  expectedDifficulty: 'Easy' | 'Medium' | 'Hard'
): Promise<{
  isValid: boolean
  detectedDifficulty: string
  confidence: number
  explanation: string
}> {
  try {
    const prompt = `
Analyze the difficulty level of the following two questions and determine if they are equivalent:

Original Question: "${originalQuestion}"
Customized Question: "${customizedQuestion}"
Expected Difficulty: ${expectedDifficulty}

Please assess:
1. Do both questions require the same level of cognitive complexity?
2. Are the mathematical/analytical requirements equivalent?
3. Is the customized question at the same difficulty level as the original?

Provide your analysis in this format:
DIFFICULTY: [Easy/Medium/Hard]
CONFIDENCE: [0-100]%
EQUIVALENT: [Yes/No]
EXPLANATION: [Brief explanation of your assessment]
`

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert in educational assessment and question difficulty analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (!response) {
      throw new Error('No analysis generated')
    }

    // Parse the response
    const difficultyMatch = response.match(/DIFFICULTY:\s*(\w+)/)
    const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)/)
    const equivalentMatch = response.match(/EQUIVALENT:\s*(\w+)/)
    const explanationMatch = response.match(/EXPLANATION:\s*(.+)/)

    const detectedDifficulty = difficultyMatch?.[1] || 'Unknown'
    const confidence = parseInt(confidenceMatch?.[1] || '0')
    const isEquivalent = equivalentMatch?.[1]?.toLowerCase() === 'yes'
    const explanation = explanationMatch?.[1] || 'No explanation provided'

    return {
      isValid: isEquivalent && detectedDifficulty === expectedDifficulty,
      detectedDifficulty,
      confidence,
      explanation
    }
  } catch (error) {
    console.error('Error validating question difficulty:', error)
    return {
      isValid: false,
      detectedDifficulty: 'Unknown',
      confidence: 0,
      explanation: 'Error occurred during validation'
    }
  }
}

/**
 * Generate context-appropriate answer choices for multiple choice questions
 */
export async function generateAnswerChoices(
  customizedQuestion: string,
  correctAnswer: string,
  clusterProfile: {
    major: string
    academicLevel: string
    careerInterests: string[]
  },
  numChoices: number = 4
): Promise<string[]> {
  try {
    const prompt = `
Generate ${numChoices - 1} plausible but incorrect answer choices for the following multiple choice question. The choices should be contextually appropriate for ${clusterProfile.major} ${clusterProfile.academicLevel} students.

Question: "${customizedQuestion}"
Correct Answer: "${correctAnswer}"

Requirements:
1. Make distractors plausible but clearly incorrect
2. Use terminology appropriate for ${clusterProfile.major} students
3. Avoid obviously wrong answers
4. Make choices similar in format and length

Return only the ${numChoices - 1} incorrect choices, one per line.
`

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating effective multiple choice distractors for educational assessments.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (!response) {
      throw new Error('No answer choices generated')
    }

    const incorrectChoices = response
      .split('\n')
      .map(choice => choice.trim())
      .filter(choice => choice.length > 0)
      .slice(0, numChoices - 1)

    // Combine with correct answer and shuffle
    const allChoices = [correctAnswer, ...incorrectChoices]
    
    // Simple shuffle
    for (let i = allChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]]
    }

    return allChoices
  } catch (error) {
    console.error('Error generating answer choices:', error)
    return [correctAnswer]
  }
}