'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  className?: string;
}

interface StatsCardProps {
  value: string | number;
  label: string;
  change?: string;
  icon?: LucideIcon;
  color?: string;
  className?: string;
}

export const ModernCard: React.FC<ModernCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false 
}) => {
  return (
    <motion.div
      className={`modern-card ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''} ${className}`}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  color = 'var(--color-primary)',
  className = '' 
}) => {
  return (
    <ModernCard className={`text-center p-8 ${className}`}>
      <motion.div 
        className="mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
      </motion.div>
      
      <motion.h3 
        className="text-xl font-semibold mb-4 text-gray-900"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-gray-600 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {description}
      </motion.p>
    </ModernCard>
  );
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
  value, 
  label, 
  change, 
  icon: Icon,
  color = 'var(--color-primary)',
  className = '' 
}) => {
  const isPositive = change && change.startsWith('+');
  const isNegative = change && change.startsWith('-');
  
  return (
    <ModernCard className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.div 
            className="text-3xl font-bold text-gray-900 mb-1"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.div>
          
          <motion.div 
            className="text-sm text-gray-600 mb-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {label}
          </motion.div>
          
          {change && (
            <motion.div 
              className={`text-xs font-medium flex items-center gap-1 ${
                isPositive ? 'text-green-600' : 
                isNegative ? 'text-red-600' : 'text-gray-500'
              }`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {change}
            </motion.div>
          )}
        </div>
        
        {Icon && (
          <motion.div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${color}20` }}
            initial={{ opacity: 0, rotate: -180 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </motion.div>
        )}
      </div>
    </ModernCard>
  );
};

export const ActionCard: React.FC<{
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  href?: string;
  color?: string;
  className?: string;
}> = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onClick, 
  href,
  color = 'var(--color-primary)',
  className = '' 
}) => {
  const CardContent = () => (
    <ModernCard className={`p-8 text-center group cursor-pointer ${className}`}>
      <motion.div 
        className="mb-6"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-semibold mb-4 text-gray-900 group-hover:text-gray-800 transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      
      <button 
        className="btn-primary w-full"
        onClick={onClick}
      >
        {buttonText}
      </button>
    </ModernCard>
  );

  if (href) {
    return (
      <a href={href} className="block">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
};

export default ModernCard;