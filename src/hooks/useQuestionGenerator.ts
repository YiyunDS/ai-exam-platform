import { useState, useCallback } from 'react'
import { QuestionGeneratorService, withRetry } from '@/services/questionGenerator'

interface GenerationParams {
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

interface UseQuestionGeneratorReturn {
  isGenerating: boolean
  generatedVariations: Record<string, QuestionVariation>
  error: string | null
  generateVariations: (params: GenerationParams) => Promise<Record<string, QuestionVariation>>
  saveToExam: (examId: string, selectedVariations: Record<string, QuestionVariation>) => Promise<void>
  reset: () => void
  retryGeneration: () => Promise<void>
  isSaving: boolean
}

export const useQuestionGenerator = (): UseQuestionGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedVariations, setGeneratedVariations] = useState<Record<string, QuestionVariation>>({})
  const [error, setError] = useState<string | null>(null)
  const [lastParams, setLastParams] = useState<GenerationParams | null>(null)

  const generateVariations = useCallback(async (params: GenerationParams) => {
    setIsGenerating(true)
    setError(null)
    setLastParams(params)
    
    try {
      // Use retry mechanism for better reliability
      const variations = await withRetry(
        () => QuestionGeneratorService.generateVariations(params),
        3, // max retries
        1000 // initial delay
      )
      
      setGeneratedVariations(variations)
      return variations
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate questions'
      setError(errorMessage)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const retryGeneration = useCallback(async () => {
    if (!lastParams) {
      setError('No previous generation parameters to retry')
      return
    }
    
    return generateVariations(lastParams)
  }, [lastParams, generateVariations])

  const saveToExam = useCallback(async (examId: string, selectedVariations: Record<string, QuestionVariation>) => {
    setIsSaving(true)
    setError(null)
    
    try {
      await withRetry(
        () => QuestionGeneratorService.saveToExam(examId, selectedVariations),
        2,
        500
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save questions'
      setError(errorMessage)
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [])

  const reset = useCallback(() => {
    setGeneratedVariations({})
    setError(null)
    setLastParams(null)
    setIsGenerating(false)
    setIsSaving(false)
  }, [])

  return {
    isGenerating,
    generatedVariations,
    error,
    generateVariations,
    saveToExam,
    reset,
    retryGeneration,
    isSaving
  }
}