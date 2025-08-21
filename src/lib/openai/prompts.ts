import { AICustomizationRequest } from '@/lib/types'

export const QUESTION_CUSTOMIZATION_PROMPT = `
You are an expert educational content creator who specializes in transforming generic academic questions into contextually relevant, engaging questions that relate to students' career interests and academic backgrounds.

Your task is to take a baseline question and customize it for a specific group of students while maintaining the same learning objectives, difficulty level, and core academic concepts.

BASELINE QUESTION:
{baselineQuestion}

STUDENT GROUP PROFILE:
- Major: {major}
- Academic Level: {academicLevel}
- Average GPA: {averageGPA}
- Primary Career Interests: {careerInterests}
- Learning Style: {learningStyle}

CUSTOMIZATION REQUIREMENTS:
1. MAINTAIN DIFFICULTY: The customized question must have the same difficulty level as the original
2. PRESERVE LEARNING OBJECTIVES: All core learning objectives must remain intact
3. ADD RELEVANT CONTEXT: Include real-world scenarios that relate to the students' career interests
4. USE APPROPRIATE TERMINOLOGY: Use industry-specific terms and concepts familiar to students in this major
5. MAINTAIN STRUCTURE: Keep the same question format and expected answer type

EXAMPLE TRANSFORMATION:
Original: "Calculate the mean and standard deviation for: 5, 20, 40, 65, 90"
For Finance Students: "A portfolio manager is analyzing monthly returns for a diversified fund. Calculate the mean return and standard deviation for the following monthly returns: 5%, 20%, 40%, 65%, 90%. This analysis will help determine the fund's risk profile for potential investors."

GUIDELINES:
- Use specific scenarios from {major} field
- Include industry context that {academicLevel} students would understand
- Make the problem feel like something they might encounter in their career
- Keep mathematical/technical requirements identical
- Add just enough context to make it engaging without making it overly complex

Provide ONLY the customized question text. Do not include explanations, solutions, or additional commentary.

CUSTOMIZED QUESTION:
`

export const BATCH_CUSTOMIZATION_PROMPT = `
You are an expert educational content creator. Transform the following baseline question into contextually relevant versions for different student groups while maintaining identical learning objectives and difficulty.

BASELINE QUESTION:
{baselineQuestion}

STUDENT GROUPS:
{clusterProfiles}

For each group, create a customized version that:
1. Maintains the exact same difficulty and learning objectives
2. Uses relevant industry context and terminology
3. Feels like a real-world scenario they might encounter in their career
4. Keeps the same mathematical/technical requirements

Return a JSON object with this structure:
{
  "customizations": [
    {
      "clusterId": "cluster_id",
      "customizedText": "The customized question text",
      "context": "Brief description of the industry context used"
    }
  ]
}

Provide ONLY the JSON response, no additional text.
`

export const CLUSTERING_ANALYSIS_PROMPT = `
You are an educational data analyst. Analyze the following student data and provide insights about natural groupings for personalized learning.

STUDENT DATA:
{studentData}

Analyze and provide:
1. Suggested clustering strategy
2. Optimal cluster characteristics
3. Learning style patterns
4. Recommended group sizes

Focus on academic major, level, GPA ranges, and career interests to create meaningful groups for personalized question generation.

Provide a structured analysis with actionable clustering recommendations.
`

// Helper function to format prompt with variables
export function formatPrompt(template: string, variables: Record<string, any>): string {
  let formatted = template
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`
    formatted = formatted.replace(new RegExp(placeholder, 'g'), String(value))
  }
  
  return formatted
}

// Generate question customization prompt
export function generateCustomizationPrompt(request: AICustomizationRequest): string {
  const { baselineQuestion, clusterProfile, constraints } = request
  
  const variables = {
    baselineQuestion,
    major: clusterProfile.major,
    academicLevel: clusterProfile.academicLevel,
    averageGPA: clusterProfile.averageGPA.toFixed(2),
    careerInterests: clusterProfile.careerInterests.join(', '),
    learningStyle: clusterProfile.learningStyle || 'analytical',
  }
  
  return formatPrompt(QUESTION_CUSTOMIZATION_PROMPT, variables)
}

// Generate batch customization prompt
export function generateBatchCustomizationPrompt(
  baselineQuestion: string,
  clusterProfiles: Array<{
    clusterId: string
    major: string
    academicLevel: string
    careerInterests: string[]
    averageGPA: number
  }>
): string {
  const formattedProfiles = clusterProfiles.map(profile => 
    `Cluster ${profile.clusterId}: ${profile.major} ${profile.academicLevel}s (GPA: ${profile.averageGPA.toFixed(2)}, Interests: ${profile.careerInterests.join(', ')})`
  ).join('\n')
  
  return formatPrompt(BATCH_CUSTOMIZATION_PROMPT, {
    baselineQuestion,
    clusterProfiles: formattedProfiles
  })
}

// Question types and their specific prompting strategies
export const QUESTION_TYPE_STRATEGIES = {
  'Multiple Choice': {
    preserveStructure: 'Keep all answer choices with the same logical structure',
    contextIntegration: 'Integrate context into the question stem and answer choices',
  },
  'Short Answer': {
    preserveStructure: 'Maintain the expected answer format and length',
    contextIntegration: 'Embed context naturally into the question scenario',
  },
  'Essay': {
    preserveStructure: 'Keep the same analytical requirements and scope',
    contextIntegration: 'Create a relevant case study or scenario to analyze',
  },
  'Problem Solving': {
    preserveStructure: 'Maintain identical mathematical/technical requirements',
    contextIntegration: 'Wrap the problem in a relevant professional scenario',
  },
} as const

// Difficulty level guidelines
export const DIFFICULTY_GUIDELINES = {
  'Easy': 'Use straightforward scenarios with minimal additional complexity',
  'Medium': 'Include moderate industry context without overwhelming details',
  'Hard': 'Create complex, realistic scenarios that challenge application skills',
} as const

// Academic level considerations
export const ACADEMIC_LEVEL_CONTEXT = {
  'Freshman': 'Use introductory-level industry concepts and basic terminology',
  'Sophomore': 'Include intermediate concepts students would encounter in core courses',
  'Junior': 'Apply advanced concepts from major-specific coursework',
  'Senior': 'Use senior-level analysis and real-world complexity',
} as const

// Major-specific context libraries
export const MAJOR_CONTEXTS = {
  'Finance': {
    scenarios: ['portfolio management', 'risk assessment', 'investment analysis', 'financial planning'],
    terminology: ['returns', 'volatility', 'diversification', 'market analysis'],
    roles: ['portfolio manager', 'financial analyst', 'investment advisor', 'risk manager'],
  },
  'Marketing': {
    scenarios: ['campaign analysis', 'market research', 'brand management', 'consumer behavior'],
    terminology: ['conversion rates', 'market share', 'customer acquisition', 'ROI'],
    roles: ['marketing manager', 'data analyst', 'brand strategist', 'digital marketer'],
  },
  'Economics': {
    scenarios: ['economic modeling', 'policy analysis', 'market dynamics', 'economic forecasting'],
    terminology: ['elasticity', 'market equilibrium', 'economic indicators', 'growth models'],
    roles: ['economic analyst', 'policy researcher', 'consultant', 'economist'],
  },
  'Business Administration': {
    scenarios: ['operations management', 'strategic planning', 'performance analysis', 'decision making'],
    terminology: ['KPIs', 'operational efficiency', 'strategic objectives', 'business metrics'],
    roles: ['business analyst', 'operations manager', 'consultant', 'project manager'],
  },
  'Computer Science': {
    scenarios: ['algorithm analysis', 'system design', 'data analysis', 'software optimization'],
    terminology: ['complexity', 'algorithms', 'data structures', 'performance metrics'],
    roles: ['software engineer', 'data scientist', 'systems analyst', 'developer'],
  },
} as const

// Get context suggestions for a major
export function getMajorContext(major: string) {
  const normalizedMajor = major as keyof typeof MAJOR_CONTEXTS
  return MAJOR_CONTEXTS[normalizedMajor] || MAJOR_CONTEXTS['Business Administration']
}