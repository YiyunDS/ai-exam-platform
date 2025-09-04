'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ChevronDown, PlayCircle } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-4xl font-bold text-navy-900">AI Exam Pro</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Exam Title</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Enter exam title..." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span>Folt Extans</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">A</Button>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span>Settings</span>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Types</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Question
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Settings & Preview */}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="difficulty-level">Difficulty Level</Label>
              <Switch id="difficulty-level" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="time-limit">Time Limit</Label>
              <Switch id="time-limit" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="num-questions">Number of Questions</Label>
              <Switch id="num-questions" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="multiple-choice">Multiple Choice</Label>
              <Switch id="multiple-choice" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="exam-style">Exam Style</Label>
              <div className="flex items-center gap-2">
                <span>Essay</span>
                <Switch id="exam-style" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Preview</span>
              <PlayCircle className="h-6 w-6 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold">Essay</h4>
              <p className="text-sm text-gray-600 mt-2">
                Minim cupidatat non deserunt est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
