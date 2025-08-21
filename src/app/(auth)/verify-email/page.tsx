'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
        <CardDescription className="text-center">
          We&apos;ve sent you a confirmation link
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          <p className="font-medium">Almost there!</p>
          <p className="text-sm mt-1">
            We&apos;ve sent a confirmation email to{' '}
            <span className="font-medium">{email}</span>
          </p>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p>Please check your email and click the confirmation link to activate your account.</p>
          <p>If you don&apos;t see the email, check your spam folder.</p>
        </div>
        
        <div className="pt-4">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Return to Sign In
            </Button>
          </Link>
        </div>
        
        <div className="pt-2">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to homepage
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <Card className="w-full">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </CardContent>
      </Card>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}