'use client'

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Users, Target, Play, Star, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showCta?: boolean;
  onGetStarted?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Transform Education with AI-Powered Question Generation",
  subtitle = "Create personalized exam questions that adapt to each student group's interests and learning style. Powered by advanced AI to maintain learning objectives while maximizing engagement.",
  showCta = true,
  onGetStarted
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Floating particles system
    const particles: Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: `hsl(${220 + Math.random() * 60}, 70%, 70%)`
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections
        particles.forEach(otherParticle => {
          const distance = Math.sqrt(
            (particle.x - otherParticle.x) ** 2 + (particle.y - otherParticle.y) ** 2
          );
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <section className="premium-hero-section">
      {/* Animated Mesh Gradient Background */}
      <div className="mesh-gradient-bg">
        <div className="mesh-orb mesh-orb-1"></div>
        <div className="mesh-orb mesh-orb-2"></div>
        <div className="mesh-orb mesh-orb-3"></div>
        <div className="mesh-orb mesh-orb-4"></div>
      </div>

      {/* Floating Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="floating-particles-canvas"
      />

      {/* Background Pattern */}
      <div className="hero-pattern"></div>
      
      <div className="hero-content-premium">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="text-center relative z-10"
        >
          {/* Premium Badge */}
          <motion.div 
            variants={fadeInUp}
            className="hero-badge-premium"
          >
            <Star className="w-4 h-4" />
            <span>Trusted by 500+ Educators</span>
            <div className="badge-glow"></div>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="hero-title-premium"
          >
            Transform Education with
            <span className="gradient-text-premium"> AI-Powered</span>
            <br />
            Question Generation
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="hero-subtitle-premium"
          >
            {subtitle}
          </motion.p>
          
          {showCta && (
            <motion.div 
              variants={fadeInUp}
              className="hero-cta-premium"
            >
              <motion.button
                onClick={handleGetStarted}
                className="btn-primary-premium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="h-5 w-5" />
                <span>Start Generating Questions</span>
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                <div className="btn-glow"></div>
              </motion.button>
              
              <motion.button 
                className="btn-secondary-premium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="h-4 w-4" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>
          )}
          
          {/* Trust Indicators */}
          <motion.div 
            variants={fadeInUp}
            className="trust-indicators"
          >
            <div className="trust-item">
              <div className="trust-icon">
                <Users className="h-6 w-6" />
              </div>
              <div className="trust-content">
                <div className="trust-number">10,000+</div>
                <div className="trust-label">Students Served</div>
              </div>
            </div>
            
            <div className="trust-item">
              <div className="trust-icon">
                <Brain className="h-6 w-6" />
              </div>
              <div className="trust-content">
                <div className="trust-number">50,000+</div>
                <div className="trust-label">Questions Generated</div>
              </div>
            </div>
            
            <div className="trust-item">
              <div className="trust-icon">
                <Target className="h-6 w-6" />
              </div>
              <div className="trust-content">
                <div className="trust-number">95%</div>
                <div className="trust-label">Learning Retention</div>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="trust-content">
                <div className="trust-number">500+</div>
                <div className="trust-label">Educators</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;