'use client'

import { useState } from 'react'
import HeroSection from '@/components/HeroSection'
import AuthModal from '@/components/AuthModal'
import { Brain, Users, Target, Sparkles, BarChart, Settings } from 'lucide-react'

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleGetStarted = () => {
    setIsAuthModalOpen(true)
  }

  return (
    <main className="relative">
      <HeroSection onGetStarted={handleGetStarted} />
      
      {/* Features Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background Orbs */}
        <div className="floating-orb floating-orb-1 opacity-30"></div>
        <div className="floating-orb floating-orb-2 opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose <span className="gradient-text">AI-Powered</span> Question Generation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your teaching with intelligent question adaptation that maintains learning objectives while maximizing student engagement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="modern-card text-center p-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#4F46E520' }}>
                  <Brain className="h-8 w-8" style={{ color: '#4F46E5' }} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">AI-Powered Personalization</h3>
              <p className="text-gray-600 leading-relaxed">Advanced algorithms analyze student groups and adapt questions to their specific interests and learning styles while preserving core educational objectives.</p>
            </div>
            
            <div className="modern-card text-center p-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#10B98120' }}>
                  <Users className="h-8 w-8" style={{ color: '#10B981' }} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Student Group Management</h3>
              <p className="text-gray-600 leading-relaxed">Organize students by major, interests, and learning preferences. Import from CSV or create custom groups with targeted keywords and themes.</p>
            </div>
            
            <div className="modern-card text-center p-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#F59E0B20' }}>
                  <Target className="h-8 w-8" style={{ color: '#F59E0B' }} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Learning Objective Preservation</h3>
              <p className="text-gray-600 leading-relaxed">Every generated question maintains your original learning objectives and difficulty level while adapting context and examples to student interests.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="modern-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">10,000+</div>
                  <div className="text-sm text-gray-600 mb-2">Students Served</div>
                  <div className="text-xs font-medium text-green-600">+15%</div>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#4F46E520' }}>
                  <Users className="h-6 w-6" style={{ color: '#4F46E5' }} />
                </div>
              </div>
            </div>
            
            <div className="modern-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">50,000+</div>
                  <div className="text-sm text-gray-600 mb-2">Questions Generated</div>
                  <div className="text-xs font-medium text-green-600">+23%</div>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#10B98120' }}>
                  <Brain className="h-6 w-6" style={{ color: '#10B981' }} />
                </div>
              </div>
            </div>
            
            <div className="modern-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">95%</div>
                  <div className="text-sm text-gray-600 mb-2">Learning Retention</div>
                  <div className="text-xs font-medium text-green-600">+8%</div>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#F59E0B20' }}>
                  <Target className="h-6 w-6" style={{ color: '#F59E0B' }} />
                </div>
              </div>
            </div>
            
            <div className="modern-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                  <div className="text-sm text-gray-600 mb-2">Educators</div>
                  <div className="text-xs font-medium text-green-600">+12%</div>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#EC489920' }}>
                  <Sparkles className="h-6 w-6" style={{ color: '#EC4899' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background Orbs */}
        <div className="floating-orb floating-orb-3 opacity-40"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of educators using AI to create more engaging, personalized learning experiences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-white/20">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Start Generating</h3>
              <p className="text-white/80 mb-6">Begin creating personalized questions for your student groups immediately.</p>
              <button onClick={handleGetStarted} className="btn-primary w-full">Get Started</button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-white/20">
                <BarChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">View Analytics</h3>
              <p className="text-white/80 mb-6">Analyze question effectiveness and student engagement metrics.</p>
              <button onClick={handleGetStarted} className="btn-primary w-full">View Demo</button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-white/20">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Manage Groups</h3>
              <p className="text-white/80 mb-6">Configure student groups and their learning preferences.</p>
              <button onClick={handleGetStarted} className="btn-primary w-full">Setup Groups</button>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  )
}