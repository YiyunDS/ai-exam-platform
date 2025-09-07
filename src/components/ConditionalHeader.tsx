'use client'

import { usePathname } from 'next/navigation'
import ModernHeader from './ModernHeader'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Don't show ModernHeader on dashboard pages - they have their own layout
  if (pathname?.startsWith('/dashboard')) {
    return null
  }
  
  return <ModernHeader />
}