import { z } from 'zod'

export const academicLevels = ['Freshman', 'Sophomore', 'Junior', 'Senior'] as const

export const studentSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .trim(),
  
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  
  major: z.string()
    .min(1, 'Major is required')
    .max(255, 'Major must be less than 255 characters')
    .trim(),
  
  academicLevel: z.enum(academicLevels, {
    errorMap: () => ({ message: 'Please select a valid academic level' })
  }),
  
  gpa: z.number()
    .min(0, 'GPA must be between 0.0 and 4.0')
    .max(4, 'GPA must be between 0.0 and 4.0')
    .optional()
    .or(z.nan())
    .transform(val => isNaN(val) ? undefined : val),
  
  careerInterests: z.array(z.string().trim())
    .default([])
    .refine(interests => interests.every(interest => interest.length > 0), {
      message: 'Career interests cannot be empty'
    }),
  
  additionalInfo: z.record(z.any()).optional()
})

export type StudentFormData = z.infer<typeof studentSchema>

export const csvStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional().or(z.literal('')),
  major: z.string().min(1, 'Major is required'),
  academic_level: z.enum(academicLevels).or(z.enum(['freshman', 'sophomore', 'junior', 'senior']).transform(val => 
    val.charAt(0).toUpperCase() + val.slice(1) as typeof academicLevels[number]
  )),
  gpa: z.string()
    .optional()
    .transform(val => val ? parseFloat(val) : undefined)
    .refine(val => val === undefined || (val >= 0 && val <= 4), {
      message: 'GPA must be between 0.0 and 4.0'
    }),
  career_interests: z.string()
    .optional()
    .transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s.length > 0) : [])
})

export type CSVStudentData = z.infer<typeof csvStudentSchema>

// Common majors for autocomplete
export const commonMajors = [
  'Accounting',
  'Anthropology',
  'Art',
  'Biology',
  'Business Administration',
  'Chemistry',
  'Computer Science',
  'Economics',
  'Engineering',
  'English',
  'Finance',
  'History',
  'Marketing',
  'Mathematics',
  'Philosophy',
  'Physics',
  'Political Science',
  'Psychology',
  'Sociology',
  'Statistics'
]

// Common career interests for autocomplete
export const commonCareerInterests = [
  'Investment Banking',
  'Financial Analysis',
  'Portfolio Management',
  'Risk Assessment',
  'Corporate Finance',
  'Financial Planning',
  'Digital Marketing',
  'Brand Management',
  'Social Media Marketing',
  'Market Research',
  'Content Marketing',
  'Marketing Analytics',
  'Campaign Management',
  'Customer Analytics',
  'Brand Strategy',
  'Software Engineering',
  'Data Science',
  'Machine Learning',
  'Web Development',
  'AI Research',
  'Systems Architecture',
  'Economic Research',
  'Policy Analysis',
  'Economic Modeling',
  'Market Analysis',
  'Economic Consulting',
  'Operations Management',
  'Strategic Planning',
  'Project Management',
  'Business Analytics',
  'Management Consulting'
]

// Validation helper functions
export function validateStudentData(data: unknown): StudentFormData {
  return studentSchema.parse(data)
}

export function validateCSVStudentData(data: unknown): CSVStudentData {
  return csvStudentSchema.parse(data)
}

// Transform CSV data to student form data
export function transformCSVToStudent(csvData: CSVStudentData): Omit<StudentFormData, 'additionalInfo'> {
  return {
    name: csvData.name,
    email: csvData.email || undefined,
    major: csvData.major,
    academicLevel: csvData.academic_level,
    gpa: csvData.gpa,
    careerInterests: csvData.career_interests
  }
}