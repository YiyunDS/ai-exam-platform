import jsPDF from 'jspdf'

interface ExamQuestion {
  orderIndex: number
  points: number
  customizedQuestion: {
    customizedText: string
    contextDescription: string
    question: {
      title: string
      questionType: string
      difficultyLevel: string
    }
  }
}

interface ExamData {
  title: string
  description: string
  instructions: string
  timeLimit: number
  totalPoints: number
  questions: ExamQuestion[]
  teacher: {
    name: string
    email: string
  }
  createdAt: string
}

export function generateExamPDF(examData: ExamData, includeAnswerKey: boolean = false) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let currentY = margin

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const fontSize = options.fontSize || 12
    const maxWidth = options.maxWidth || contentWidth
    const lineHeight = options.lineHeight || fontSize * 0.5
    
    pdf.setFontSize(fontSize)
    const lines = pdf.splitTextToSize(text, maxWidth)
    
    lines.forEach((line: string, index: number) => {
      if (y + (index * lineHeight) > pageHeight - margin) {
        pdf.addPage()
        y = margin
      }
      pdf.text(line, x, y + (index * lineHeight))
    })
    
    return y + (lines.length * lineHeight)
  }

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
    }
  }

  // Header
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  currentY = addText(examData.title, margin, currentY, { fontSize: 20 })
  currentY += 10

  // Exam metadata
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  
  const metadata = [
    `Time Limit: ${examData.timeLimit} minutes`,
    `Total Points: ${examData.totalPoints}`,
    `Number of Questions: ${examData.questions.length}`,
    `Date: ${new Date(examData.createdAt).toLocaleDateString()}`,
    `Instructor: ${examData.teacher.name}`
  ]

  metadata.forEach(item => {
    currentY = addText(item, margin, currentY)
    currentY += 2
  })

  currentY += 10

  // Instructions
  if (examData.instructions) {
    checkNewPage(30)
    pdf.setFont('helvetica', 'bold')
    currentY = addText('Instructions:', margin, currentY, { fontSize: 14 })
    currentY += 5
    
    pdf.setFont('helvetica', 'normal')
    currentY = addText(examData.instructions, margin, currentY)
    currentY += 15
  }

  // Student info section
  checkNewPage(40)
  pdf.setFont('helvetica', 'bold')
  currentY = addText('Student Information:', margin, currentY, { fontSize: 14 })
  currentY += 10

  pdf.setFont('helvetica', 'normal')
  const studentFields = [
    'Name: ________________________________',
    'Student ID: ___________________________',
    'Date: _________________________________'
  ]

  studentFields.forEach(field => {
    currentY = addText(field, margin, currentY)
    currentY += 8
  })

  currentY += 15

  // Add separator line
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.5)
  pdf.line(margin, currentY, pageWidth - margin, currentY)
  currentY += 15

  // Questions
  examData.questions
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach((examQuestion, index) => {
      const questionNumber = index + 1
      const question = examQuestion.customizedQuestion
      
      // Check if we need space for question header + some content
      checkNewPage(50)

      // Question header
      pdf.setFont('helvetica', 'bold')
      currentY = addText(
        `Question ${questionNumber} (${examQuestion.points} points)`,
        margin,
        currentY,
        { fontSize: 14 }
      )
      currentY += 8

      // Question type and difficulty
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      currentY = addText(
        `Type: ${question.question.questionType} | Difficulty: ${question.question.difficultyLevel}`,
        margin,
        currentY,
        { fontSize: 10 }
      )
      currentY += 8

      // Context if available
      if (question.contextDescription) {
        pdf.setFont('helvetica', 'italic')
        currentY = addText(
          `Context: ${question.contextDescription}`,
          margin,
          currentY,
          { fontSize: 10 }
        )
        currentY += 5
      }

      // Question text
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(12)
      currentY = addText(question.customizedText, margin, currentY)
      currentY += 10

      // Answer space based on question type
      const answerSpaceHeight = getAnswerSpaceHeight(question.question.questionType, examQuestion.points)
      
      if (question.question.questionType === 'Multiple Choice') {
        // Add answer choices placeholder
        const choices = ['A) _______________', 'B) _______________', 'C) _______________', 'D) _______________']
        choices.forEach(choice => {
          checkNewPage(15)
          currentY = addText(choice, margin + 10, currentY)
          currentY += 6
        })
      } else {
        // Add answer lines
        const numLines = Math.ceil(answerSpaceHeight / 8)
        for (let i = 0; i < numLines; i++) {
          checkNewPage(15)
          pdf.line(margin, currentY + 3, pageWidth - margin, currentY + 3)
          currentY += 8
        }
      }

      currentY += 15
    })

  // Footer on each page
  const totalPages = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    )
    pdf.text(
      examData.title,
      margin,
      pageHeight - 10
    )
  }

  return pdf
}

function getAnswerSpaceHeight(questionType: string, points: number): number {
  // Return answer space height in mm based on question type and points
  switch (questionType) {
    case 'Short Answer':
      return Math.min(points * 3, 30) // 3mm per point, max 30mm
    case 'Essay':
      return Math.min(points * 8, 100) // 8mm per point, max 100mm
    case 'Problem Solving':
      return Math.min(points * 5, 80) // 5mm per point, max 80mm
    case 'Multiple Choice':
      return 0 // Handled separately
    default:
      return 30
  }
}

export function generateAnswerKeyPDF(examData: ExamData, answers: any[] = []) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let currentY = margin

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const fontSize = options.fontSize || 12
    const maxWidth = options.maxWidth || contentWidth
    const lineHeight = options.lineHeight || fontSize * 0.5
    
    pdf.setFontSize(fontSize)
    const lines = pdf.splitTextToSize(text, maxWidth)
    
    lines.forEach((line: string, index: number) => {
      if (y + (index * lineHeight) > pageHeight - margin) {
        pdf.addPage()
        y = margin
      }
      pdf.text(line, x, y + (index * lineHeight))
    })
    
    return y + (lines.length * lineHeight)
  }

  // Header
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  currentY = addText(`${examData.title} - ANSWER KEY`, margin, currentY, { fontSize: 20 })
  currentY += 20

  // Grading rubric
  pdf.setFont('helvetica', 'bold')
  currentY = addText('Grading Information:', margin, currentY, { fontSize: 14 })
  currentY += 10

  pdf.setFont('helvetica', 'normal')
  const gradingInfo = [
    `Total Points: ${examData.totalPoints}`,
    `Number of Questions: ${examData.questions.length}`,
    `Average Points per Question: ${(examData.totalPoints / examData.questions.length).toFixed(1)}`
  ]

  gradingInfo.forEach(info => {
    currentY = addText(info, margin, currentY)
    currentY += 5
  })

  currentY += 15

  // Questions and answers
  examData.questions
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach((examQuestion, index) => {
      const questionNumber = index + 1
      const question = examQuestion.customizedQuestion

      // Question header
      pdf.setFont('helvetica', 'bold')
      currentY = addText(
        `Question ${questionNumber} (${examQuestion.points} points)`,
        margin,
        currentY,
        { fontSize: 14 }
      )
      currentY += 8

      // Question text (abbreviated)
      pdf.setFont('helvetica', 'normal')
      const questionPreview = question.customizedText.length > 100 
        ? question.customizedText.substring(0, 100) + '...'
        : question.customizedText
      currentY = addText(questionPreview, margin, currentY, { fontSize: 10 })
      currentY += 10

      // Answer/Rubric section
      pdf.setFont('helvetica', 'bold')
      currentY = addText('Answer/Rubric:', margin, currentY, { fontSize: 12 })
      currentY += 5

      pdf.setFont('helvetica', 'normal')
      const answerText = answers[index] || `[Answer key for ${question.question.questionType} question - ${examQuestion.points} points]`
      currentY = addText(answerText, margin, currentY)
      currentY += 15

      // Add separator line
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(0.2)
      pdf.line(margin, currentY, pageWidth - margin, currentY)
      currentY += 10
    })

  return pdf
}

export function downloadPDF(pdf: jsPDF, filename: string) {
  pdf.save(filename)
}

export function openPDFInNewTab(pdf: jsPDF) {
  const pdfBlob = pdf.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  window.open(pdfUrl, '_blank')
}