import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  AI Exam Platform
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:bg-gray-50 font-medium">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-black hover:bg-gray-800 text-white font-medium px-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-12">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            Powered by Advanced AI Technology
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-none tracking-tight">
            Transform Traditional Exams into{" "}
            <span className="text-gray-600">
              Personalized Assessments
            </span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            AI-powered platform that automatically customizes exam questions for each student group 
            while maintaining consistent difficulty and learning objectives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-black hover:bg-gray-800 px-8 py-4 text-lg font-medium">
                Start Creating Personalized Exams
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                Sign In to Continue
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">10x</div>
              <div className="text-gray-500 font-light">Faster Question Creation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-500 font-light">Student Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">50%</div>
              <div className="text-gray-500 font-light">Better Learning Outcomes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Why Teachers Love Our Platform
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Save 90% of your exam creation time while improving student engagement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Smart Student Clustering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500 leading-relaxed font-light">
                  AI automatically groups students by major, academic level, and career interests 
                  to create meaningful personalized question variations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  AI Question Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500 leading-relaxed font-light">
                  Transform generic questions into contextually relevant scenarios that match 
                  each student&apos;s career goals while preserving learning objectives.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Easy Export & Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500 leading-relaxed font-light">
                  Create complete exams and export to PDF or CSV formats. 
                  Manage question banks and reuse successful templates.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Example Section */}
      <div className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              See the Magic in Action
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Same learning objective, engaging context for each student group
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-0 bg-gray-50 rounded-2xl p-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-4">Original Question</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <p className="text-gray-700 font-light leading-relaxed">
                    &quot;Calculate the mean and standard deviation for: 5, 20, 40, 65, 90&quot;
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-0 bg-white rounded-2xl p-6 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-3">For Finance Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 font-light leading-relaxed">
                    &quot;A portfolio manager is analyzing monthly returns: 5%, 20%, 40%, 65%, 90%. 
                    Calculate the mean return and standard deviation to assess the fund&apos;s risk profile.&quot;
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white rounded-2xl p-6 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-3">For Marketing Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 font-light leading-relaxed">
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
      <div className="bg-gray-900 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-gray-300 mb-12 font-light">
            Join thousands of educators creating personalized assessments with AI
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Exam Platform</h3>
            <p className="text-gray-500 font-light">
              Transforming education through personalized AI-powered assessments
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
