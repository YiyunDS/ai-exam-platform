'use client'

import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </>
  )
}

// Utility functions for different types of toasts
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    })
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    })
  },
  
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    })
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    })
  },
  
  loading: (message: string) => {
    return toast.loading(message)
  },
  
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    })
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },

  custom: (jsx: React.ReactNode, options?: any) => {
    return toast.custom(jsx, options)
  }
}

export default ToastProvider