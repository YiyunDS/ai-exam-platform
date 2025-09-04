import * as React from "react"
import { cn } from "@/lib/utils"

const LoadingSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
})
LoadingSkeleton.displayName = "LoadingSkeleton"

interface LoadingPageProps {
  title: string
  actionLabel?: string
  cardCount?: number
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  title, 
  actionLabel = "Loading...", 
  cardCount = 4 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
      </div>
      
      {/* Search/Filter Card */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex gap-4">
          <LoadingSkeleton className="h-10 flex-1" />
          <LoadingSkeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card">
            <div className="p-6">
              <LoadingSkeleton className="h-4 w-20 mb-2" />
              <LoadingSkeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Content Loading */}
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{actionLabel}</p>
      </div>
    </div>
  )
}

interface LoadingSpinnerProps {
  message?: string
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  className 
}) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  )
}

export { LoadingSkeleton, LoadingPage, LoadingSpinner }