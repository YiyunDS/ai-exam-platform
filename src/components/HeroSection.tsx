'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Users, Target } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showCta?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Transform Education with AI-Powered Question Generation",
  subtitle = "Create personalized exam questions that adapt to each student group's interests and learning style. Powered by advanced AI to maintain learning objectives while maximizing engagement.",
  showCta = true
}) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="hero-section">
      {/* Floating Orb Animations */}
      <div className="floating-orb floating-orb-1"></div>
      <div className="floating-orb floating-orb-2"></div>
      <div className="floating-orb floating-orb-3"></div>
      
      <div className="hero-content">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <motion.h1 
            variants={fadeInUp}
            className="hero-title"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="hero-subtitle"
          >
            {subtitle}
          </motion.p>
          
          {showCta && (
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/dashboard" className="btn-primary btn-lg">
                <Brain className="h-5 w-5 mr-2" />
                Start Generating Questions
              </Link>
              <Link href="/demo" className="btn-secondary btn-lg">
                <Sparkles className="h-5 w-5 mr-2" />
                View Demo
              </Link>
            </motion.div>
          )}
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-8 justify-center items-center mt-16 opacity-80"
          >
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm opacity-80">Students Served</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-lg">
                <Brain className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">50,000+</div>
                <div className="text-sm opacity-80">Questions Generated</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-lg">
                <Target className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm opacity-80">Learning Retention</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </section>
  );
};

export default HeroSection;