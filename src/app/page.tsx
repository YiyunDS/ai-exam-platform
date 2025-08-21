import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AI Exam Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Traditional Exams into{" "}
            <span className="text-blue-600">Personalized Assessments</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered platform that automatically customizes exam questions for each student group 
            while maintaining consistent difficulty and learning objectives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Creating Personalized Exams
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Teachers Love Our Platform
          </h2>
          <p className="text-lg text-gray-600">
            Save 90% of your exam creation time while improving student engagement
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  👥
                </div>
                Smart Student Clustering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI automatically groups students by major, academic level, and career interests 
                to create meaningful personalized question variations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  🤖
                </div>
                AI Question Customization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Transform generic questions into contextually relevant scenarios that match 
                each student&apos;s career goals while preserving learning objectives.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  📊
                </div>
                Easy Export & Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create complete exams and export to PDF or CSV formats. 
                Manage question banks and reuse successful templates.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Example Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See the Magic in Action
            </h2>
            <p className="text-lg text-gray-600">
              Same learning objective, engaging context for each student group
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-lg">Original Question</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    &quot;Calculate the mean and standard deviation for: 5, 20, 40, 65, 90&quot;
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="text-base text-blue-600">For Finance Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    &quot;A portfolio manager is analyzing monthly returns: 5%, 20%, 40%, 65%, 90%. 
                    Calculate the mean return and standard deviation to assess the fund&apos;s risk profile.&quot;
                  </p>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="text-base text-green-600">For Marketing Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    &quot;A digital marketing team tracked campaign conversion rates: 5%, 20%, 40%, 65%, 90%. 
                    Calculate the mean and standard deviation to evaluate campaign consistency.&quot;
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of educators creating personalized assessments with AI
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">AI Exam Platform</h3>
            <p className="text-gray-400">
              Transforming education through personalized AI-powered assessments
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
