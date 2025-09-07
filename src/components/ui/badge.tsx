import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        error: "bg-red-100 text-red-800 border-red-200",
        info: "bg-blue-100 text-blue-800 border-blue-200",
        purple: "bg-purple-100 text-purple-800 border-purple-200",
        gray: "bg-slate-100 text-slate-800 border-slate-200",
        // Academic levels
        freshman: "bg-green-100 text-green-800 border-green-200",
        sophomore: "bg-blue-100 text-blue-800 border-blue-200",
        junior: "bg-purple-100 text-purple-800 border-purple-200",
        senior: "bg-orange-100 text-orange-800 border-orange-200",
        graduate: "bg-red-100 text-red-800 border-red-200",
        // Question difficulties
        beginner: "bg-green-100 text-green-800 border-green-200",
        intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
        advanced: "bg-red-100 text-red-800 border-red-200",
        // Question types
        "short-answer": "bg-blue-100 text-blue-800 border-blue-200",
        essay: "bg-amber-100 text-amber-800 border-amber-200",
        "problem-solving": "bg-green-100 text-green-800 border-green-200",
        "multiple-choice": "bg-purple-100 text-purple-800 border-purple-200",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }