'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  const routes = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Students', path: '/dashboard/students' },
    { name: 'Questions', path: '/dashboard/questions' },
    { name: 'Groups', path: '/dashboard/groups' },
    { name: 'Exams', path: '/dashboard/exams' },
    { name: 'Analytics', path: '/dashboard/analytics' },
    { name: 'Generator', path: '/dashboard/generator' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Debug - Dashboard Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              This is a debug page to test all dashboard routes. Click each button to test if the route works:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {routes.map((route) => (
                <Link key={route.path} href={route.path}>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center"
                  >
                    {route.name}
                  </Button>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Debug Info:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Middleware is temporarily disabled for testing</li>
                <li>• All routes should work without authentication</li>
                <li>• If you get 404s, the component or page file might have an error</li>
                <li>• Check the browser console for any JavaScript errors</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}