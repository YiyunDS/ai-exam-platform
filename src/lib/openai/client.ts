import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Default model for cost efficiency
export const DEFAULT_MODEL = 'gpt-4o-mini'

// Pricing per 1M tokens (as of 2024)
export const TOKEN_PRICING = {
  'gpt-4o-mini': {
    input: 0.15,  // $0.15 per 1M input tokens
    output: 0.60, // $0.60 per 1M output tokens
  },
  'gpt-4o': {
    input: 2.50,
    output: 10.00,
  },
} as const

// Calculate cost for token usage
export function calculateCost(
  model: keyof typeof TOKEN_PRICING,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = TOKEN_PRICING[model]
  if (!pricing) return 0
  
  const inputCost = (inputTokens / 1_000_000) * pricing.input
  const outputCost = (outputTokens / 1_000_000) * pricing.output
  
  return inputCost + outputCost
}