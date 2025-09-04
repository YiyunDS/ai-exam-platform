'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, FileText, Users, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="relative z-10 bg-navy-800/90 backdrop-blur-sm border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="AI Exam Generator"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-white">ExamGen AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">
                Features
              </a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">
                About Us
              </a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </a>
              <Link href="/login">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center w-full py-20">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              ExamGen AI
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              Effortless Exam Creation, Powered by AI
            </p>
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
              Transform your existing exam questions into personalized assessments tailored to each student&apos;s major and interests
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-navy-900 font-semibold px-8 py-4 rounded-full text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your exam creation process with AI-powered personalization based on student majors and career interests
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-navy-600 to-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-navy-900 mb-4">
                Automated Question Generation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Transform your existing questions into personalized versions using AI, maintaining difficulty while adapting to student majors and interests
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-navy-900 mb-4">
                Customizable Exam Formats
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create exams in multiple formats with flexible question types, time limits, and difficulty levels tailored to your curriculum
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-navy-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-navy-900 mb-4">
                Secure Assessment Delivery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Export and deliver your customized exams securely, with built-in analytics to track question usage and effectiveness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to create personalized exams for your students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Upload Student Data</h3>
              <p className="text-gray-600">Add your students with their majors and optional career interests</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Create Base Questions</h3>
              <p className="text-gray-600">Input your existing exam questions as templates</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Generate & Export</h3>
              <p className="text-gray-600">AI creates personalized versions and you export customized exams</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-navy-900 to-navy-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Exam Creation?
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Join thousands of educators who are creating personalized assessments with AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-navy-900 font-semibold px-8 py-4 rounded-full text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Image
                src="/logo.png"
                alt="AI Exam Generator"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-lg font-semibold">ExamGen AI</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-white/60">
                © 2024 ExamGen AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}