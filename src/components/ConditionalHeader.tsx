'use client'

import { usePathname } from 'next/navigation'
import ModernHeader from './ModernHeader'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // For debugging: Always show ModernHeader so navigation links are visible
  return <ModernHeader />
  
  // TODO: Later we can conditionally hide on dashboard pages
  // if (pathname?.startsWith('/dashboard')) {
  //   return null
  // }
}