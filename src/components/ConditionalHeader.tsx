'use client'

import { usePathname } from 'next/navigation'
import ModernHeader from './ModernHeader'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Hide ModernHeader on dashboard pages to prevent layout conflicts
  if (pathname?.startsWith('/dashboard')) {
    return null
  }
  
  return <ModernHeader />
}