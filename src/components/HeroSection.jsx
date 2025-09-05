// components/HeroSection.jsx
import React from 'react';
import { ArrowRight, Sparkles, Users, Brain, ChartBar } from 'lucide-react';
import '../styles/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Animated Background */}
      <div className="hero-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="mesh-gradient"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          {/* Badge */}
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Personalization</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="hero-title">
            Transform Your Exams with
            <span className="gradient-text"> AI Personalization</span>
          </h1>
          
          <p className="hero-description">
            Create contextually relevant exams tailored to each student's major and interests. 
            Maintain consistent learning objectives while maximizing engagement.
          </p>
          
          {/* CTA Buttons */}
          <div className="hero-cta">
            <button className="btn-primary">
              Get Started
              <ArrowRight size={20} />
            </button>
            <button className="btn-secondary">
              View Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="hero-stats">
            <div className="stat">
              <Users className="stat-icon" />
              <div>
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Students</span>
              </div>
            </div>
            <div className="stat">
              <Brain className="stat-icon" />
              <div>
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Questions Generated</span>
              </div>
            </div>
            <div className="stat">
              <ChartBar className="stat-icon" />
              <div>
                <span className="stat-number">94%</span>
                <span className="stat-label">Engagement Rate</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Interactive Demo Preview */}
        <div className="hero-visual">
          <div className="demo-window">
            <div className="window-header">
              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="window-title">AI Question Generator</span>
            </div>
            <div className="window-content">
              <div className="demo-preview">
                {/* Add your demo content here */}
                <img src="/api/placeholder/600/400" alt="Demo" />
              </div>
            </div>
          </div>
          
          {/* Floating Cards */}
          <div className="float-card card-1">
            <span className="card-emoji">🎯</span>
            <span>Same Learning Objective</span>
          </div>
          <div className="float-card card-2">
            <span className="card-emoji">✨</span>
            <span>Personalized Context</span>
          </div>
          <div className="float-card card-3">
            <span className="card-emoji">📊</span>
            <span>Better Engagement</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
