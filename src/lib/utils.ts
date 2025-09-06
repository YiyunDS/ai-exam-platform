import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CSV parsing utility function
export function parseCSV(csvText: string): Array<Record<string, string>> {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''))
  const rows = lines.slice(1)

  return rows.map(row => {
    const values = row.split(',').map(value => value.trim().replace(/"/g, ''))
    const record: Record<string, string> = {}
    
    headers.forEach((header, index) => {
      record[header] = values[index] || ''
    })
    
    return record
  })
}
