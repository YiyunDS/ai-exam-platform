## 5. Responsive Design Implementation

### Mobile-First Breakpoints
```css
/* Breakpoint Variables */
:root {
  --screen-sm: 640px;
  --screen-md: 768px;
  --screen-lg: 1024px;
  --screen-xl: 1280px;
  --screen-2xl: 1536px;
}

/* Mobile Navigation */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    z-index: 999;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    display: none;
  }
  
  .mobile-menu-overlay.active {
    display: block;
  }
  
  .nav-desktop {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    color: var(--gray-700);
    cursor: pointer;
  }
  
  .hero-container {
    grid-template-columns: 1fr;
    padding: 40px 20px;
    text-align: center;
  }
  
  .hero-visual {
    display: none;
  }
  
  .hero-cta {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-hero-primary,
  .btn-hero-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .stat-divider {
    display: none;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .action-buttons .btn {
    flex: 1;
  }
}

/* Tablet Adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
  
  .hero-container {
    gap: 40px;
  }
  
  .hero-title {
    font-size: clamp(2rem, 4vw, 3rem);
  }
}

/* Desktop Enhancements */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
  
  .hero-container {
    gap: 100px;
  }
}
```

## 6. Animation Library

### Smooth Animations & Transitions
```css
/* Animation Utilities */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* Loading States */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary-teal);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Page Transitions */
.page-enter {
  animation: fadeIn 0.3s ease-out;
}

.page-exit {
  animation: fadeOut 0.3s ease-in;
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}

/* Hover Effects */
.hover-lift {
  transition: transform 0.3s, box-shadow 0.3s;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.hover-glow {
  transition: box-shadow 0.3s;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
}

/* Micro-interactions */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple:active::after {
  width: 300px;
  height: 300px;
}
```

## 7. Implementation Instructions for Claude Code

### Step-by-Step Guide

#### Step 1: Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── NavigationHeader.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── exam/
│   │   ├── ExamCreationForm.jsx
│   │   ├── QuestionEditor.jsx
│   │   └── ExamPreview.jsx
│   ├── dashboard/
│   │   ├── DashboardStats.jsx
│   │   ├── RecentExams.jsx
│   │   └── QuickActions.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       └── Modal.jsx
├── styles/
│   ├── globals.css
│   ├── variables.css
│   ├── components.css
│   └── animations.css
├── pages/
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── CreateExam.jsx
│   └── TakeExam.jsx
└── App.jsx
```

#### Step 2: Installation Commands
```bash
# Install required dependencies
npm install react lucide-react framer-motion react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Optional: For advanced features
npm install react-hook-form zod @hookform/resolvers
npm install react-hot-toast recharts
```

#### Step 3: Global Styles Setup
```css
/* globals.css - Import this in your main App.jsx */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--gray-900);
  background: var(--gray-50);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--gray-100);
}

::-webkit-scrollbar-thumb {
  background: var(--gray-400);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gray-500);
}

/* Selection Styles */
::selection {
  background: rgba(78, 205, 196, 0.2);
  color: var(--primary-dark-teal);
}

/* Focus Styles */
:focus-visible {
  outline: 2px solid var(--primary-teal);
  outline-offset: 2px;
}
```

#### Step 4: Key Implementation Notes

**1. State Management:**
```jsx
// Use React Context for global state
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <AppContext.Provider value={{
      user, setUser,
      theme, setTheme,
      sidebarOpen, setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};
```

**2. Form Validation:**
```jsx
// Use controlled components with validation
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  // Submit logic
};
```

**3. API Integration:**
```jsx
// Centralized API service
const API_BASE = process.env.REACT_APP_API_URL;

export const api = {# AI Exam Generator - Complete Design Implementation Guide

## 1. Design Foundation Setup

### Color Palette
```css
/* Define these CSS variables at the root level */
:root {
  /* Primary Colors - Based on your logo */
  --primary-teal: #4ECDC4;
  --primary-dark-teal: #3BA99F;
  --primary-light-teal: #7FE5DE;
  
  /* Navy Blue Shades */
  --navy-900: #1A2332;
  --navy-800: #2D3748;
  --navy-700: #3C4858;
  --navy-600: #4A5568;
  
  /* Accent Colors */
  --accent-blue: #5570F1;
  --accent-purple: #6366F1;
  --accent-green: #10B981;
  
  /* Neutral Colors */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Semantic Colors */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
}
```

### Typography System
```css
/* Typography Scale */
:root {
  /* Font Families */
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

## 2. Component Library

### Navigation Header Component
```jsx
// NavigationHeader.jsx
import React, { useState } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Settings } from 'lucide-react';

const NavigationHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  return (
    <header className="nav-header">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-logo">
          <img src="/logo.svg" alt="AI Exam Generator" className="logo-image" />
          <span className="logo-text">ExamGen AI</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About Us</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
        
        {/* User Profile Section */}
        <div className="nav-actions">
          <button className="notification-btn">
            <div className="notification-badge"></div>
            <Bell size={20} />
          </button>
          
          <div className="profile-dropdown">
            <button 
              className="profile-trigger"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img src="/avatar.jpg" alt="User" className="avatar" />
              <ChevronDown size={16} />
            </button>
            
            {isProfileOpen && (
              <div className="dropdown-menu">
                <a href="/profile" className="dropdown-item">
                  <User size={16} /> Profile
                </a>
                <a href="/settings" className="dropdown-item">
                  <Settings size={16} /> Settings
                </a>
                <hr className="dropdown-divider" />
                <button className="dropdown-item logout">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
```

### Navigation Header Styles
```css
/* Navigation Header Styles */
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  z-index: 1000;
  height: 72px;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.nav-logo:hover {
  transform: scale(1.02);
}

.logo-image {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  background: linear-gradient(135deg, var(--primary-teal), var(--accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-desktop {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-link {
  color: var(--gray-700);
  text-decoration: none;
  font-weight: var(--font-medium);
  position: relative;
  padding: 8px 0;
  transition: color 0.2s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-teal);
  transition: width 0.3s;
}

.nav-link:hover {
  color: var(--primary-teal);
}

.nav-link:hover::after {
  width: 100%;
}
```

### Sidebar Component
```jsx
// Sidebar.jsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Database, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { id: 'new-exam', icon: Plus, label: 'New Exam', badge: null },
    { id: 'my-exams', icon: FolderOpen, label: 'My Exams', badge: '12' },
    { id: 'question-bank', icon: Database, label: 'Question Bank', badge: '234' },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null }
  ];
  
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/logo.svg" alt="Logo" className="sidebar-logo-img" />
          {!isCollapsed && <span className="sidebar-title">AI Exam Pro</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => setActiveItem(item.id)}
          >
            <item.icon size={20} className="sidebar-icon" />
            {!isCollapsed && (
              <>
                <span className="sidebar-label">{item.label}</span>
                {item.badge && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>
      
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="storage-indicator">
            <div className="storage-header">
              <span className="storage-label">Storage Used</span>
              <span className="storage-value">45%</span>
            </div>
            <div className="storage-bar">
              <div className="storage-fill" style={{ width: '45%' }}></div>
            </div>
            <span className="storage-info">4.5 GB of 10 GB</span>
          </div>
        </div>
      )}
    </aside>
  );
};
```

### Sidebar Styles
```css
/* Sidebar Styles */
.sidebar {
  position: fixed;
  left: 0;
  top: 72px; /* Below header */
  bottom: 0;
  width: 280px;
  background: var(--navy-800);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-logo-img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.sidebar-title {
  color: white;
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  white-space: nowrap;
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  overflow-y: auto;
}

.sidebar-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  margin-bottom: 4px;
  background: transparent;
  border: none;
  border-radius: var(--radius-lg);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.sidebar-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--primary-teal);
  transform: translateX(-100%);
  transition: transform 0.2s;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.sidebar-item.active {
  background: linear-gradient(90deg, rgba(78, 205, 196, 0.15) 0%, transparent 100%);
  color: var(--primary-teal);
}

.sidebar-item.active::before {
  transform: translateX(0);
}

.sidebar-icon {
  flex-shrink: 0;
}

.sidebar-label {
  flex: 1;
  text-align: left;
  font-weight: var(--font-medium);
  white-space: nowrap;
}

.sidebar-badge {
  background: var(--primary-teal);
  color: white;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}
```

## 3. Main Content Area - Exam Creation Form

### Modern Form Component
```jsx
// ExamCreationForm.jsx
import React, { useState } from 'react';
import { 
  Save, 
  Eye, 
  Settings, 
  Clock, 
  Hash, 
  FileText,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react';

const ExamCreationForm = () => {
  const [examData, setExamData] = useState({
    title: '',
    instructions: '',
    difficulty: 'medium',
    timeLimit: true,
    duration: 60,
    questionCount: 10,
    questionTypes: {
      multipleChoice: true,
      essay: false,
      trueFalse: false,
      shortAnswer: false
    }
  });
  
  const [questions, setQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <div className="exam-creation-container">
      {/* Top Action Bar */}
      <div className="action-bar">
        <h1 className="page-title">Create New Exam</h1>
        <div className="action-buttons">
          <button className="btn btn-secondary">
            <Eye size={18} />
            Preview
          </button>
          <button className="btn btn-primary">
            <Save size={18} />
            Save Exam
          </button>
        </div>
      </div>
      
      <div className="form-grid">
        {/* Main Form Section */}
        <div className="form-main">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Exam Details</h2>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label required">Exam Title</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="Enter exam title..."
                  value={examData.title}
                  onChange={(e) => setExamData({...examData, title: e.target.value})}
                />
                <span className="form-hint">This will be displayed to students</span>
              </div>
              
              <div className="form-group">
                <label className="form-label">Instructions</label>
                <div className="rich-editor">
                  <div className="editor-toolbar">
                    <button className="editor-btn">B</button>
                    <button className="editor-btn">I</button>
                    <button className="editor-btn">U</button>
                    <div className="editor-divider"></div>
                    <button className="editor-btn">• List</button>
                    <button className="editor-btn">1. List</button>
                  </div>
                  <textarea 
                    className="form-textarea"
                    placeholder="Add exam instructions..."
                    rows="6"
                    value={examData.instructions}
                    onChange={(e) => setExamData({...examData, instructions: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Questions Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Questions</h2>
              <button className="btn btn-primary btn-sm">
                <Plus size={16} />
                Add Question
              </button>
            </div>
            <div className="card-body">
              {questions.length === 0 ? (
                <div className="empty-state">
                  <FileText size={48} className="empty-icon" />
                  <h3 className="empty-title">No questions yet</h3>
                  <p className="empty-text">Start by adding your first question</p>
                  <button className="btn btn-primary">
                    <Plus size={18} />
                    Add First Question
                  </button>
                </div>
              ) : (
                <div className="questions-list">
                  {/* Question items would go here */}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Settings Sidebar */}
        <div className="form-sidebar">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Settings size={18} />
                Settings
              </h2>
            </div>
            <div className="card-body">
              <div className="setting-group">
                <label className="form-label">Difficulty Level</label>
                <div className="difficulty-selector">
                  <button className="difficulty-btn easy">Easy</button>
                  <button className="difficulty-btn medium active">Medium</button>
                  <button className="difficulty-btn hard">Hard</button>
                </div>
              </div>
              
              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <Clock size={18} className="toggle-icon" />
                    <div>
                      <label className="form-label">Time Limit</label>
                      <span className="form-hint">Set exam duration</span>
                    </div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={examData.timeLimit} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                {examData.timeLimit && (
                  <div className="time-input">
                    <input 
                      type="number" 
                      className="form-input" 
                      value={examData.duration}
                      min="1"
                    />
                    <span className="input-addon">minutes</span>
                  </div>
                )}
              </div>
              
              <div className="setting-group">
                <label className="form-label">
                  <Hash size={18} className="inline-icon" />
                  Number of Questions
                </label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={examData.questionCount}
                  min="1"
                />
              </div>
              
              <div className="setting-group">
                <label className="form-label">Question Types</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={examData.questionTypes.multipleChoice} />
                    <span className="checkbox-text">Multiple Choice</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={examData.questionTypes.essay} />
                    <span className="checkbox-text">Essay</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={examData.questionTypes.trueFalse} />
                    <span className="checkbox-text">True/False</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={examData.questionTypes.shortAnswer} />
                    <span className="checkbox-text">Short Answer</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Live Preview Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Eye size={18} />
                Live Preview
              </h2>
              <label className="toggle toggle-sm">
                <input type="checkbox" checked={showPreview} onChange={(e) => setShowPreview(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            {showPreview && (
              <div className="card-body">
                <div className="preview-container">
                  <div className="preview-screen">
                    {/* Mini preview of exam */}
                    <div className="preview-content">
                      <h3>{examData.title || 'Untitled Exam'}</h3>
                      <p className="preview-meta">
                        {examData.questionCount} questions • {examData.duration} minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Form Styles
```css
/* Form Container Styles */
.exam-creation-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--gray-200);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--gray-900);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:active::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-teal), var(--primary-dark-teal));
  color: white;
  box-shadow: 0 4px 14px 0 rgba(78, 205, 196, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(78, 205, 196, 0.4);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
}

.btn-secondary:hover {
  background: var(--gray-200);
  transform: translateY(-1px);
}

/* Card Component */
.card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  margin-bottom: 24px;
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gray-50);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  padding: 24px;
}

/* Form Grid Layout */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-sidebar {
    order: -1;
  }
}

/* Form Elements */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: var(--font-medium);
  color: var(--gray-700);
  font-size: var(--text-sm);
}

.form-label.required::after {
  content: ' *';
  color: var(--error);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-teal);
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.form-input:hover {
  border-color: var(--gray-300);
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: var(--text-sm);
  color: var(--gray-500);
}

/* Rich Text Editor */
.rich-editor {
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.2s;
}

.rich-editor:focus-within {
  border-color: var(--primary-teal);
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}

.editor-btn {
  padding: 6px 12px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s;
}

.editor-btn:hover {
  background: var(--primary-teal);
  color: white;
  border-color: var(--primary-teal);
}

.editor-divider {
  width: 1px;
  background: var(--gray-300);
  margin: 0 8px;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: none;
  font-size: var(--text-base);
  resize: vertical;
  min-height: 120px;
}

/* Toggle Switch */
.toggle {
  position: