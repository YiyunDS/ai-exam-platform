'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<any>
}

interface NavigationBreadcrumbProps {
  items?: BreadcrumbItem[]
  homeHref?: string
  maxItems?: number
  className?: string
}

// Default route mappings for automatic breadcrumb generation
const routeMap: Record<string, string> = {
  '': 'Home',
  'dashboard': 'Dashboard',
  'students': 'Students',
  'questions': 'Questions',
  'analytics': 'Analytics',
  'settings': 'Settings',
  'profile': 'Profile',
  'groups': 'Groups',
  'create': 'Create',
  'edit': 'Edit',
  'view': 'View',
  'import': 'Import',
  'export': 'Export'
}

export function NavigationBreadcrumb({ 
  items,
  homeHref = '/',
  maxItems = 3,
  className = ''
}: NavigationBreadcrumbProps) {
  const pathname = usePathname()
  
  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname, homeHref)
  
  // If we have too many items, show ellipsis
  const shouldShowEllipsis = breadcrumbItems.length > maxItems
  const visibleItems = shouldShowEllipsis 
    ? [breadcrumbItems[0], ...breadcrumbItems.slice(-2)]
    : breadcrumbItems
  const hiddenItems = shouldShowEllipsis 
    ? breadcrumbItems.slice(1, -2)
    : []

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbList>
          {visibleItems.map((item, index) => (
            <React.Fragment key={`${item.href}-${index}`}>
              {/* Show ellipsis after first item if needed */}
              {index === 1 && shouldShowEllipsis && hiddenItems.length > 0 && (
                <>
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1">
                        <BreadcrumbEllipsis className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {hiddenItems.map((hiddenItem, hiddenIndex) => (
                          <DropdownMenuItem key={`${hiddenItem.href}-${hiddenIndex}`}>
                            {hiddenItem.href ? (
                              <Link href={hiddenItem.href} className="flex items-center gap-2">
                                {hiddenItem.icon && <hiddenItem.icon className="h-4 w-4" />}
                                {hiddenItem.label}
                              </Link>
                            ) : (
                              <span className="flex items-center gap-2">
                                {hiddenItem.icon && <hiddenItem.icon className="h-4 w-4" />}
                                {hiddenItem.label}
                              </span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                </>
              )}

              <BreadcrumbItem>
                {item.href && index < visibleItems.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {/* Add separator except for last item */}
              {index < visibleItems.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  )
}

function generateBreadcrumbsFromPath(pathname: string, homeHref: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Add home breadcrumb
  breadcrumbs.push({
    label: 'Home',
    href: homeHref,
    icon: Home
  })

  // Build breadcrumbs from path segments
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Get human readable label
    const label = routeMap[segment] || formatSegmentLabel(segment)
    
    // Only add href if it's not the last segment (current page)
    const isLastSegment = index === pathSegments.length - 1
    
    breadcrumbs.push({
      label,
      href: isLastSegment ? undefined : currentPath
    })
  })

  return breadcrumbs
}

function formatSegmentLabel(segment: string): string {
  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Export a preset component for common dashboard navigation
export function DashboardBreadcrumb() {
  const pathname = usePathname()
  
  const customItems: BreadcrumbItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home
    }
  ]

  // Add specific items based on current path
  if (pathname.includes('/students')) {
    customItems.push({
      label: 'Students',
      href: pathname.includes('/create') ? '/dashboard/students' : undefined
    })
  }
  
  if (pathname.includes('/questions')) {
    customItems.push({
      label: 'Questions',
      href: pathname.includes('/create') ? '/dashboard/questions' : undefined
    })
  }

  if (pathname.includes('/create')) {
    customItems.push({
      label: 'Create',
    })
  }

  if (pathname.includes('/edit')) {
    customItems.push({
      label: 'Edit',
    })
  }

  return <NavigationBreadcrumb items={customItems} homeHref="/dashboard" />
}

export default NavigationBreadcrumb