'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import NavigationBreadcrumb, { DashboardBreadcrumb } from './NavigationBreadcrumb'
import { LoginForm } from './LoginForm'
import ImprovedAuthModal from './ImprovedAuthModal'
import ImprovedProfessorDashboard from './ImprovedProfessorDashboard'
import { showToast } from './ToastProvider'
import { 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  Loader, 
  Star,
  Heart,
  Sparkles,
  Zap,
  Home,
  Settings
} from 'lucide-react'

const ShadcnShowcase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(33)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Demo data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Pending' },
  ]

  const handleToastDemo = (type: string) => {
    switch (type) {
      case 'success':
        showToast.success('Success!', 'Your action completed successfully')
        break
      case 'error':
        showToast.error('Error occurred', 'Something went wrong. Please try again.')
        break
      case 'warning':
        showToast.warning('Warning', 'Please check your input')
        break
      case 'info':
        showToast.info('Information', 'Here is some useful information')
        break
      case 'loading':
        const loadingToast = showToast.loading('Processing...')
        setTimeout(() => {
          showToast.dismiss(loadingToast)
          showToast.success('Done!', 'Processing completed')
        }, 2000)
        break
      case 'promise':
        const mockPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            Math.random() > 0.5 ? resolve('Success!') : reject('Failed!')
          }, 2000)
        })
        showToast.promise(mockPromise, {
          loading: 'Processing request...',
          success: 'Request completed successfully!',
          error: 'Request failed. Please try again.'
        })
        break
    }
  }

  const handleSkeletonDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  const handleProgressDemo = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Shadcn UI Showcase</h1>
          <p className="text-xl text-muted-foreground">
            Demonstrating all the improved components in your AI Exam Platform
          </p>
          
          {/* Breadcrumb Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation Breadcrumbs</CardTitle>
              <CardDescription>Smart breadcrumb navigation with ellipsis support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Dashboard Breadcrumb:</h4>
                <DashboardBreadcrumb />
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Custom Breadcrumb:</h4>
                <NavigationBreadcrumb 
                  items={[
                    { label: 'Home', href: '/', icon: Home },
                    { label: 'Settings', href: '/settings', icon: Settings },
                    { label: 'Profile', href: '/settings/profile' },
                    { label: 'Advanced Settings', href: '/settings/profile/advanced' },
                    { label: 'Security' }
                  ]}
                  maxItems={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="components" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                  <CardDescription>Status indicators and labels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="gap-1">
                      <Star className="h-3 w-3" />
                      Featured
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Heart className="h-3 w-3" />
                      Liked
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Zap className="h-3 w-3" />
                      Fast
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Indicators</CardTitle>
                  <CardDescription>Show completion status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  <Button onClick={handleProgressDemo}>
                    Animate Progress
                  </Button>
                </CardContent>
              </Card>

              {/* Skeleton Loading */}
              <Card>
                <CardHeader>
                  <CardTitle>Skeleton Loading</CardTitle>
                  <CardDescription>Loading placeholders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
                        <div>
                          <h4 className="font-medium">John Doe</h4>
                          <p className="text-sm text-muted-foreground">Software Engineer</p>
                        </div>
                      </div>
                      <p>This content loads after the skeleton animation.</p>
                    </div>
                  )}
                  <Button onClick={handleSkeletonDemo}>
                    {isLoading ? 'Loading...' : 'Show Skeleton Loading'}
                  </Button>
                </CardContent>
              </Card>

              {/* Tables */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Table</CardTitle>
                  <CardDescription>Structured data display</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.status === 'Active' ? 'default' : 
                                     user.status === 'Inactive' ? 'destructive' : 'secondary'}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Scroll Area Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Scroll Area</CardTitle>
                <CardDescription>Custom scrollable content</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 w-full border rounded-lg p-4">
                  <div className="space-y-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-2 rounded border">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">Item {i + 1}</h4>
                          <p className="text-sm text-muted-foreground">
                            Description for item {i + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Login Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Improved Login Form</CardTitle>
                  <CardDescription>Form with validation and better UX</CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm 
                    onSubmit={(data, mode) => {
                      showToast.success('Form Submitted!', `Mode: ${mode}`)
                    }}
                  />
                </CardContent>
              </Card>

              {/* Sheet Modal */}
              <Card>
                <CardHeader>
                  <CardTitle>Sheet Modal</CardTitle>
                  <CardDescription>Side panel for forms and content</CardDescription>
                </CardHeader>
                <CardContent>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button>Open Sheet</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Sheet Modal</SheetTitle>
                      </SheetHeader>
                      <div className="py-6">
                        <p>This is content in a sheet modal. Perfect for forms and side panels.</p>
                      </div>
                    </SheetContent>
                  </Sheet>
                  
                  <div className="mt-4">
                    <Button onClick={() => setAuthModalOpen(true)}>
                      Open Improved Auth Modal
                    </Button>
                    <ImprovedAuthModal
                      isOpen={authModalOpen}
                      onClose={() => setAuthModalOpen(false)}
                      onSubmit={(data, mode) => {
                        showToast.success('Authentication Success!', `Welcome ${mode === 'login' ? 'back' : 'to the platform'}!`)
                        setAuthModalOpen(false)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Professor Dashboard</CardTitle>
                <CardDescription>Complete dashboard with all new components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 space-y-4">
                  <p>The improved dashboard is displayed as a separate component.</p>
                  <Button asChild>
                    <a href="#dashboard-demo">View Dashboard Component</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Toast Notifications</CardTitle>
                <CardDescription>Sonner toast notifications with various types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button 
                    onClick={() => handleToastDemo('success')} 
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Success Toast
                  </Button>
                  <Button 
                    onClick={() => handleToastDemo('error')} 
                    variant="destructive"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Error Toast
                  </Button>
                  <Button 
                    onClick={() => handleToastDemo('warning')} 
                    variant="outline"
                    className="gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Warning Toast
                  </Button>
                  <Button 
                    onClick={() => handleToastDemo('info')} 
                    variant="secondary"
                    className="gap-2"
                  >
                    <Info className="h-4 w-4" />
                    Info Toast
                  </Button>
                  <Button 
                    onClick={() => handleToastDemo('loading')} 
                    className="gap-2"
                  >
                    <Loader className="h-4 w-4" />
                    Loading Toast
                  </Button>
                  <Button 
                    onClick={() => handleToastDemo('promise')} 
                    variant="outline"
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Promise Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dashboard Demo */}
        <div id="dashboard-demo">
          <ImprovedProfessorDashboard />
        </div>
      </div>
    </div>
  )
}

export default ShadcnShowcase