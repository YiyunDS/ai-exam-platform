## 3. Comparison View Component

### Side-by-Side Comparison Feature
```jsx
// QuestionComparisonView.jsx
import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle, 
  AlertCircle,
  BarChart,
  Eye,
  Copy
} from 'lucide-react';

const QuestionComparisonView = ({ baselineQuestion, variations, studentGroups }) => {
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  
  return (
    <div className="comparison-container">
      {/* Baseline Question Display */}
      <div className="baseline-section">
        <div className="baseline-header">
          <GitBranch className="baseline-icon" />
          <h3>Original Baseline Question</h3>
        </div>
        <div className="baseline-content">
          <div className="baseline-question">
            {baselineQuestion}
          </div>
          <div className="baseline-meta">
            <div className="meta-item">
              <CheckCircle size={16} className="meta-icon success" />
              <span>Core Learning Objective Preserved</span>
            </div>
            <div className="meta-item">
              <BarChart size={16} className="meta-icon" />
              <span>Difficulty: Consistent Across All Versions</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comparison Grid */}
      <div className="comparison-grid">
        <div className="grid-header">
          <h3>Context-Adapted Variations</h3>
          <div className="grid-actions">
            <button className="compare-btn">
              <Eye size={16} />
              Preview All
            </button>
          </div>
        </div>
        
        <div className="variations-grid">
          {Object.entries(variations).map(([groupId, variation]) => {
            const group = studentGroups.find(g => g.id === groupId);
            return (
              <div 
                key={groupId} 
                className="variation-tile"
                style={{ '--tile-color': group.color }}
              >
                <div className="tile-header">
                  <span className="tile-icon">{group.icon}</span>
                  <h4>{group.name}</h4>
                  <span className="tile-badge">{group.students}</span>
                </div>
                
                <div className="tile-content">
                  <div className="question-preview">
                    {variation.question}
                  </div>
                  
                  <div className="adaptation-highlights">
                    <h5>Context Adaptations:</h5>
                    <ul className="adaptation-list">
                      <li>Industry-specific terminology</li>
                      <li>Relevant real-world scenario</li>
                      <li>Same mathematical concepts</li>
                    </ul>
                  </div>
                </div>
                
                <div className="tile-actions">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={selectedForComparison.includes(groupId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedForComparison([...selectedForComparison, groupId]);
                        } else {
                          setSelectedForComparison(selectedForComparison.filter(id => id !== groupId));
                        }
                      }}
                    />
                    <span>Select for detailed comparison</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Detailed Comparison Table */}
      {selectedForComparison.length >= 2 && (
        <div className="comparison-table-section">
          <h3>Detailed Comparison</h3>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Aspect</th>
                {selectedForComparison.map(groupId => {
                  const group = studentGroups.find(g => g.id === groupId);
                  return (
                    <th key={groupId}>
                      <span className="table-header-icon">{group.icon}</span>
                      {group.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="aspect-label">Context</td>
                {selectedForComparison.map(groupId => (
                  <td key={groupId}>{variations[groupId].context}</td>
                ))}
              </tr>
              <tr>
                <td className="aspect-label">Question Text</td>
                {selectedForComparison.map(groupId => (
                  <td key={groupId}>{variations[groupId].question}</td>
                ))}
              </tr>
              <tr>
                <td className="aspect-label">Learning Objective</td>
                {selectedForComparison.map(groupId => (
                  <td key={groupId}>
                    <CheckCircle className="check-icon" size={16} />
                    Same as baseline
                  </td>
                ))}
              </tr>
              <tr>
                <td className="aspect-label">Difficulty</td>
                {selectedForComparison.map(groupId => (
                  <td key={groupId}>
                    <span className={`difficulty-badge ${variations[groupId].difficulty}`}>
                      {variations[groupId].difficulty}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
```

### Comparison View Styles
```css
/* Comparison View Styles */
.comparison-container {
  padding: 24px;
}

.baseline-section {
  background: linear-gradient(135deg, var(--navy-800), var(--navy-900));
  border-radius: var(--radius-xl);
  padding: 24px;
  margin-bottom: 32px;
  color: white;
}

.baseline-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.baseline-icon {
  width: 32px;
  height: 32px;
  color: var(--primary-teal);
}

.baseline-header h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.baseline-content {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.baseline-question {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: 16px;
}

.baseline-meta {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.9);
}

.meta-icon {
  color: var(--primary-teal);
}

.meta-icon.success {
  color: var(--success);
}

/* Comparison Grid */
.comparison-grid {
  background: white;
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-lg);
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.grid-header h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
}

.compare-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s;
}

.compare-btn:hover {
  background: var(--primary-teal);
  color: white;
  border-color: var(--primary-teal);
}

.variations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.variation-tile {
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s;
  background: white;
  position: relative;
}

.variation-tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--tile-color);
}

.variation-tile:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.tile-header {
  padding: 16px;
  background: var(--gray-50);
  display: flex;
  align-items: center;
  gap: 12px;
}

.tile-icon {
  font-size: 24px;
}

.tile-header h4 {
  flex: 1;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
}

.tile-badge {
  padding: 4px 8px;
  background: var(--tile-color);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

.tile-content {
  padding: 16px;
}

.question-preview {
  background: var(--gray-50);
  padding: 12px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--gray-700);
  margin-bottom: 16px;
  min-height: 60px;
}

.adaptation-highlights h5 {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--gray-600);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.adaptation-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.adaptation-list li {
  font-size: var(--text-sm);
  color: var(--gray-600);
  padding-left: 20px;
  position: relative;
  margin-bottom: 4px;
}

.adaptation-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--success);
  font-weight: bold;
}

.tile-actions {
  padding: 12px 16px;
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-teal);
}

/* Comparison Table */
.comparison-table-section {
  margin-top: 32px;
  background: white;
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-lg);
}

.comparison-table-section h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin-bottom: 20px;
}

.comparison-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.comparison-table thead tr {
  background: var(--gray-50);
}

.comparison-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  border-bottom: 2px solid var(--gray-200);
}

.table-header-icon {
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
}

.comparison-table td {
  padding: 16px;
  border-bottom: 1px solid var(--gray-100);
  vertical-align: top;
}

.aspect-label {
  font-weight: var(--font-semibold);
  color: var(--gray-700);
  background: var(--gray-50);
}

.check-icon {
  color: var(--success);
  vertical-align: middle;
  margin-right: 8px;
}

## 4. Dashboard with Analytics

### Professor Dashboard Component
```jsx
// ProfessorDashboard.jsx
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Brain,
  Award,
  Activity,
  Calendar,
  ChevronRight
} from 'lucide-react';

const ProfessorDashboard = () => {
  const stats = [
    { 
      icon: FileText, 
      value: '1,256', 
      label: 'Questions Generated', 
      change: '+12%',
      color: 'var(--primary-teal)' 
    },
    { 
      icon: Users, 
      value: '218', 
      label: 'Active Students', 
      change: '+5%',
      color: 'var(--group-finance)' 
    },
    { 
      icon: Brain, 
      value: '6', 
      label: 'Student Groups', 
      change: '0',
      color: 'var(--group-engineering)' 
    },
    { 
      icon: Award, 
      value: '94%', 
      label: 'Engagement Rate', 
      change: '+8%',
      color: 'var(--group-marketing)' 
    }
  ];
  
  const recentGenerations = [
    {
      id: 1,
      subject: 'Statistics',
      baseline: 'Calculate mean and standard deviation',
      groups: ['Finance', 'Marketing', 'Engineering'],
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      subject: 'Linear Algebra',
      baseline: 'Find eigenvalues of matrix',
      groups: ['Engineering', 'Medicine'],
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      subject: 'Probability',
      baseline: 'Calculate conditional probability',
      groups: ['Finance', 'Sports Science'],
      timestamp: 'Yesterday'
    }
  ];
  
  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, Professor Smith</h1>
          <p>Here's your personalized question generation overview</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <Calendar size={18} />
            Schedule Exam
          </button>
          <button className="btn-primary">
            <Brain size={18} />
            Generate Questions
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: stat.color }}>
              <stat.icon size={24} color="white" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'neutral'}`}>
                {stat.change !== '0' && <TrendingUp size={14} />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Generations */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Question Generations</h2>
            <button className="view-all-btn">
              View All
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="generations-list">
            {recentGenerations.map(generation => (
              <div key={generation.id} className="generation-item">
                <div className="generation-info">
                  <h3>{generation.subject}</h3>
                  <p>{generation.baseline}</p>
                  <div className="generation-groups">
                    {generation.groups.map(group => (
                      <span key={group} className="group-tag">{group}</span>
                    ))}
                  </div>
                </div>
                <div className="generation-meta">
                  <span className="timestamp">{generation.timestamp}</span>
                  <button className="action-icon">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Student Engagement Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Student Engagement by Group</h2>
            <Activity className="header-icon" />
          </div>
          <div className="engagement-chart">
            <div className="chart-bars">
              <div className="bar-group">
                <div className="bar" style={{ height: '85%', background: 'var(--group-finance)' }}></div>
                <span className="bar-label">FIN</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: '92%', background: 'var(--group-marketing)' }}></div>
                <span className="bar-label">MKT</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: '78%', background: 'var(--group-engineering)' }}></div>
                <span className="bar-label">ENG</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: '88%', background: 'var(--group-medicine)' }}></div>
                <span className="bar-label">MED</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: '75%', background: 'var(--group-arts)' }}></div>
                <span className="bar-label">ART</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: '95%', background: 'var(--group-sports)' }}></div>
                <span className="bar-label">SPT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Dashboard Styles
```css
/* Dashboard Styles */
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.welcome-section h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--gray-900);
  margin-bottom: 8px;
}

.welcome-section p {
  color: var(--gray-600);
  font-size: var(--text-base);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  border-color: var(--primary-teal);
  color: var(--primary-teal);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 20px;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--gray-900);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin: 4px 0;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.stat-change.positive {
  color: var(--success);
}

.stat-change.neutral {
  color: var(--gray-500);
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.dashboard-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--primary-teal);
  background: none;
  border: none;
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover {
  transform: translateX(4px);
}

/* Recent Generations List */
.generations-list {
  padding: 12px;
}

.generation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: var(--radius-lg);
  transition: all 0.2s;
  cursor: pointer;
}

.generation-item:hover {
  background: var(--gray-50);
}

.generation-info h3 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin-bottom: 4px;
}

.generation-info p {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin-bottom: 8px;
}

.generation-groups {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.group-tag {
  padding: 4px 8px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--gray-700);
  font-weight: var(--font-medium);
}

.generation-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timestamp {
  font-size: var(--text-sm);
  color: var(--gray-500);
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--gray-100);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s;
}

.action-icon:hover {
  background: var(--primary-teal);
  color: white;
}

/* Engagement Chart */
.engagement-chart {
  padding: 24px;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.bar {
  width: 40px;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  transition: all 0.3s;
  cursor: pointer;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.bar-label {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--gray-600);
}

## 5. Implementation Checklist for Your Specific Goals

### Core Features to Implement:

✅ **Personalized Question Generation**
- Baseline question input with rich text editor
- Learning objective specification
- Student group selection with visual indicators
- Real-time variation generation
- Context preservation validation

✅ **Student Group Management**
- Visual group cards with icons and colors
- Student count display
- Interest/background tags
- Group creation and editing
- Bulk import from CSV/Excel

✅ **Comparison & Analysis**
- Side-by-side variation comparison
- Difficulty consistency checker
- Learning objective alignment verification
- Export to different formats (PDF, Word, CSV)
- Preview mode for student view

✅ **Analytics Dashboard**
- Question generation statistics
- Student engagement metrics by group
- Most effective contextualizations
- Performance tracking over time
- Export reports for academic records

✅ **API Integration**
- LLM endpoint connection
- Request/response handling
- Error states and retry logic
- Loading animations during generation
- Caching for repeated questions

## 6. API Integration for LLM

### API Service Layer
```javascript
// services/questionGenerator.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const QuestionGeneratorService = {
  // Generate personalized questions
  async generateVariations(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          baseline_question: payload.baselineQuestion,
          learning_objective: payload.learningObjective,
          difficulty: payload.difficulty,
          student_groups: payload.selectedGroups,
          generation_params: {
            temperature: 0.7,
            max_tokens: 150,
            preserve_difficulty: true,
            maintain_objective: true
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Generation failed');
      }
      
      const data = await response.json();
      return data.variations;
    } catch (error) {
      console.error('Error generating variations:', error);
      throw error;
    }
  },
  
  // Get student groups
  async getStudentGroups(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/groups`);
      const data = await response.json();
      return data.groups;
    } catch (error) {
      console.error('Error fetching student groups:', error);
      throw error;
    }
  },
  
  // Save generated questions to exam
  async saveToExam(examId, questions) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/exams/${examId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ questions })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error saving questions:', error);
      throw error;
    }
  },
  
  // Analyze question effectiveness
  async analyzeEffectiveness(questionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}/analyze`);
      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Error analyzing question:', error);
      throw error;
    }
  }
};

// Helper function to get auth token
function getAuthToken() {
  return localStorage.getItem('auth_token');
}
```

### React Hook for Question Generation
```jsx
// hooks/useQuestionGenerator.js
import { useState, useCallback } from 'react';
import { QuestionGeneratorService } from '../services/questionGenerator';
import toast from 'react-hot-toast';

export const useQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState({});
  const [error, setError] = useState(null);
  
  const generateVariations = useCallback(async (params) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Generating personalized questions...');
      
      // Call API
      const variations = await QuestionGeneratorService.generateVariations(params);
      
      // Update state
      setGeneratedVariations(variations);
      
      // Success notification
      toast.success(`Generated ${Object.keys(variations).length} variations!`, {
        id: loadingToast
      });
      
      return variations;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to generate questions. Please try again.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  const saveToExam = useCallback(async (examId, selectedVariations) => {
    try {
      const loadingToast = toast.loading('Saving questions to exam...');
      
      await QuestionGeneratorService.saveToExam(examId, selectedVariations);
      
      toast.success('Questions saved successfully!', {
        id: loadingToast
      });
    } catch (err) {
      toast.error('Failed to save questions');
      throw err;
    }
  }, []);
  
  const reset = useCallback(() => {
    setGeneratedVariations({});
    setError(null);
  }, []);
  
  return {
    isGenerating,
    generatedVariations,
    error,
    generateVariations,
    saveToExam,
    reset
  };
};
```

## 7. Student Group Configuration UI

### Student Group Manager Component
```jsx
// StudentGroupManager.jsx
import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Download,
  Users,
  Tag,
  Save
} from 'lucide-react';

const StudentGroupManager = () => {
  const [groups, setGroups] = useState([
    {
      id: 'finance',
      name: 'Finance',
      icon: '💰',
      color: '#4F46E5',
      students: [],
      interests: ['stocks', 'portfolio', 'investment', 'ROI', 'market analysis'],
      keywords: ['financial', 'monetary', 'economic', 'banking', 'trading']
    },
    // ... other groups
  ]);
  
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  
  return (
    <div className="group-manager">
      <div className="manager-header">
        <h2>
          <Users size={24} />
          Student Group Configuration
        </h2>
        <div className="header-actions">
          <button className="action-btn">
            <Upload size={18} />
            Import CSV
          </button>
          <button className="action-btn">
            <Download size={18} />
            Export
          </button>
          <button 
            className="action-btn primary"
            onClick={() => setIsAddingGroup(true)}
          >
            <Plus size={18} />
            Add Group
          </button>
        </div>
      </div>
      
      <div className="groups-table">
        <table>
          <thead>
            <tr>
              <th>Group</th>
              <th>Students</th>
              <th>Keywords/Interests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              <tr key={group.id}>
                <td>
                  <div className="group-cell">
                    <span className="group-icon">{group.icon}</span>
                    <div>
                      <strong>{group.name}</strong>
                      <div 
                        className="color-indicator" 
                        style={{ background: group.color }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="student-count">{group.students.length}</span>
                </td>
                <td>
                  <div className="tags-list">
                    {group.interests.slice(0, 3).map(interest => (
                      <span key={interest} className="interest-tag">
                        {interest}
                      </span>
                    ))}
                    {group.interests.length > 3 && (
                      <span className="more-tag">+{group.interests.length - 3}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="icon-btn"
                      onClick={() => setEditingGroup(group)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add/Edit Group Modal */}
      {(isAddingGroup || editingGroup) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingGroup ? 'Edit Group' : 'Add New Group'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setIsAddingGroup(false);
                  setEditingGroup(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Group Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Computer Science"
                  defaultValue={editingGroup?.name}
                />
              </div>
              
              <div className="form-group">
                <label>Icon</label>
                <div className="icon-selector">
                  {['💰', '📊', '⚙️', '🏥', '🎨', '🏃', '💻', '🔬'].map(icon => (
                    <button key={icon} className="icon-option">
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Color Theme</label>
                <div className="color-selector">
                  {['#4F46E5', '#EC4899', '#10B981', '#EF4444', '#A855F7', '#F59E0B'].map(color => (
                    <button 
                      key={color} 
                      className="color-option"
                      style={{ background: color }}
                    ></button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <Tag size={16} />
                  Keywords & Interests
                </label>
                <textarea 
                  placeholder="Enter comma-separated keywords...
e.g., programming, algorithms, software development, debugging"
                  rows="3"
                  defaultValue={editingGroup?.interests.join(', ')}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <Users size={16} />
                  Student Roster
                </label>
                <div className="upload-area">
                  <Upload size={32} />
                  <p>Drop CSV file or click to upload</p>
                  <span>Format: Name, Email, Student ID</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary">Cancel</button>
              <button className="btn-primary">
                <Save size={18} />
                Save Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

## 8. Mobile Responsive Design

### Mobile-Specific Styles
```css
/* Mobile Responsive Adjustments */
@media (max-width: 768px) {
  /* Generator Layout */
  .generator-layout {
    grid-template-columns: 1fr;
  }
  
  .input-panel,
  .output-panel {
    width: 100%;
  }
  
  /* Header Adjustments */
  .generator-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .header-stats {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  /* Groups Grid Mobile */
  .groups-grid {
    grid-template-columns: 1fr;
  }
  
  /* Comparison View Mobile */
  .variations-grid {
    grid-template-columns: 1fr;
  }
  
  .comparison-table {
    display: block;
    overflow-x: auto;
  }
  
  /* Dashboard Mobile */
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  /* Tab Navigation Mobile */
  .tab-nav {
    overflow-x: auto;
    white-space: nowrap;
  }
  
  /* Buttons Stack on Mobile */
  .hero-cta,
  .header-actions,
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-primary,
  .btn-secondary,
  .btn-outline {
    width: 100%;
    justify-content: center;
  }
}

/* Tablet Adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
  .generator-container {
    padding: 20px;
  }
  
  .variations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Touch-Friendly Interactions */
@media (hover: none) {
  .hover-lift:active {
    transform: translateY(-2px);
  }
  
  .group-card:active {
    transform: scale(0.98);
  }
  
  .btn-primary:active,
  .btn-secondary:active {
    transform: scale(0.95);
  }
}
```

## 9. Final Implementation Notes

### Key Technical Considerations:

1. **State Management**
   - Use React Context or Redux for global state
   - Implement optimistic updates for better UX
   - Cache generated questions locally

2. **Performance Optimization**
   - Lazy load heavy components
   - Implement virtual scrolling for large lists
   - Use React.memo for expensive renders

3. **Error Handling**
   - Implement retry logic for API failures
   - Show helpful error messages
   - Provide fallback UI states

4. **Accessibility**
   - ARIA labels for all interactive elements
   - Keyboard navigation support
   - Screen reader compatibility

5. **Security**
   - Implement proper authentication
   - Sanitize all user inputs
   - Use HTTPS for API calls

### Deployment Checklist:
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility checked
- [ ] Loading states implemented
- [ ] Error boundaries added
- [ ] Analytics tracking setup
- [ ] Performance monitoring enabled

This comprehensive design guide specifically tailored to your personalized question generation system will help Claude Code build a professional, user-friendly interface that highlights the unique value of context-aware exam questions while maintaining learning objectives across different student groups.# AI Exam Generator - Personalized Question Generation Design Guide

## Project Core Concept
**Purpose**: Enable professors to generate personalized exam questions through LLMs that maintain the same difficulty level and learning objectives while adapting context to student backgrounds and interests.

## 1. Design Foundation Setup

### Color Palette - Education-Focused Theme
```css
/* Define these CSS variables at the root level */
:root {
  /* Primary Colors - Professional Academic Theme */
  --primary-teal: #4ECDC4;
  --primary-dark-teal: #3BA99F;
  --primary-light-teal: #7FE5DE;
  
  /* Academic Navy */
  --navy-900: #1A2332;
  --navy-800: #2D3748;
  --navy-700: #3C4858;
  --navy-600: #4A5568;
  
  /* Student Group Colors (for visual differentiation) */
  --group-finance: #4F46E5;      /* Indigo */
  --group-marketing: #EC4899;    /* Pink */
  --group-engineering: #10B981;  /* Emerald */
  --group-medicine: #EF4444;     /* Red */
  --group-arts: #A855F7;         /* Purple */
  --group-sports: #F59E0B;       /* Amber */
  
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

## 2. Core Feature - Personalized Question Generator

### Main Question Generator Component
```jsx
// PersonalizedQuestionGenerator.jsx
import React, { useState } from 'react';
import { 
  Brain, 
  Users, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  BookOpen,
  Target,
  Lightbulb,
  RefreshCw,
  Settings,
  Info
} from 'lucide-react';

const PersonalizedQuestionGenerator = () => {
  const [baselineQuestion, setBaselineQuestion] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [generatedVariations, setGeneratedVariations] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  
  // Sample student groups (would come from API/database)
  const studentGroups = [
    { id: 'finance', name: 'Finance', icon: '💰', color: 'var(--group-finance)', students: 45 },
    { id: 'marketing', name: 'Marketing', icon: '📊', color: 'var(--group-marketing)', students: 38 },
    { id: 'engineering', name: 'Engineering', icon: '⚙️', color: 'var(--group-engineering)', students: 52 },
    { id: 'medicine', name: 'Medicine', icon: '🏥', color: 'var(--group-medicine)', students: 29 },
    { id: 'arts', name: 'Liberal Arts', icon: '🎨', color: 'var(--group-arts)', students: 33 },
    { id: 'sports', name: 'Sports Science', icon: '🏃', color: 'var(--group-sports)', students: 21 }
  ];
  
  const handleGenerateVariations = async () => {
    setIsGenerating(true);
    
    // Simulate API call to generate variations
    setTimeout(() => {
      const variations = {};
      selectedGroups.forEach(groupId => {
        const group = studentGroups.find(g => g.id === groupId);
        variations[groupId] = {
          question: generateContextualQuestion(baselineQuestion, group.name),
          context: `Adapted for ${group.name} students`,
          preservedObjective: learningObjective,
          difficulty: difficulty
        };
      });
      setGeneratedVariations(variations);
      setIsGenerating(false);
    }, 2000);
  };
  
  const generateContextualQuestion = (baseline, context) => {
    // This would be replaced by actual LLM API call
    const contextMap = {
      'Finance': 'Analyze portfolio returns:',
      'Marketing': 'Calculate campaign performance metrics:',
      'Engineering': 'Compute structural load variations:',
      'Medicine': 'Analyze patient recovery rates:',
      'Liberal Arts': 'Examine historical data trends:',
      'Sports Science': 'Evaluate athletic performance scores:'
    };
    
    return baseline.replace('Calculate the mean and standard deviation for:', contextMap[context] || 'Calculate:');
  };
  
  return (
    <div className="generator-container">
      {/* Header Section */}
      <div className="generator-header">
        <div className="header-content">
          <div className="header-title">
            <Brain className="header-icon" />
            <div>
              <h1>Personalized Question Generator</h1>
              <p className="header-subtitle">
                Create contextually relevant questions for different student groups while maintaining learning objectives
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-value">218</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">6</span>
              <span className="stat-label">Groups</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">1,256</span>
              <span className="stat-label">Questions Generated</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="generator-layout">
        {/* Left Panel - Input Section */}
        <div className="input-panel">
          <div className="panel-card">
            <div className="card-header">
              <h2>
                <BookOpen size={20} />
                Baseline Question
              </h2>
              <button className="info-btn">
                <Info size={16} />
              </button>
            </div>
            
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">
                  <Target size={16} />
                  Learning Objective
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Understanding statistical measures of central tendency"
                  value={learningObjective}
                  onChange={(e) => setLearningObjective(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <Lightbulb size={16} />
                  Original Question
                </label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="Enter your baseline question here...
Example: Calculate the mean and standard deviation for: 5, 20, 40, 65, 90"
                  value={baselineQuestion}
                  onChange={(e) => setBaselineQuestion(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <div className="difficulty-selector">
                  {['easy', 'medium', 'hard', 'expert'].map(level => (
                    <button
                      key={level}
                      className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                      onClick={() => setDifficulty(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <Users size={16} />
                  Select Student Groups
                </label>
                <div className="groups-grid">
                  {studentGroups.map(group => (
                    <label
                      key={group.id}
                      className={`group-card ${selectedGroups.includes(group.id) ? 'selected' : ''}`}
                      style={{ '--group-color': group.color }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGroups([...selectedGroups, group.id]);
                          } else {
                            setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                          }
                        }}
                      />
                      <div className="group-content">
                        <span className="group-icon">{group.icon}</span>
                        <div className="group-info">
                          <span className="group-name">{group.name}</span>
                          <span className="group-count">{group.students} students</span>
                        </div>
                      </div>
                      <div className="group-checkbox">
                        <Check size={16} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                className="generate-btn"
                onClick={handleGenerateVariations}
                disabled={!baselineQuestion || selectedGroups.length === 0 || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Generating Personalized Questions...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Variations
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Generated Variations */}
        <div className="output-panel">
          <div className="panel-card">
            <div className="card-header">
              <div className="tab-nav">
                <button
                  className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
                  onClick={() => setActiveTab('generate')}
                >
                  Generated Variations
                </button>
                <button
                  className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
                  onClick={() => setActiveTab('compare')}
                >
                  Compare
                </button>
                <button
                  className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  Preview
                </button>
              </div>
              {Object.keys(generatedVariations).length > 0 && (
                <button className="export-btn">
                  Export All
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
            
            <div className="card-body">
              {Object.keys(generatedVariations).length === 0 ? (
                <div className="empty-state">
                  <Sparkles className="empty-icon" />
                  <h3>No Variations Yet</h3>
                  <p>Select student groups and generate personalized questions</p>
                </div>
              ) : (
                <div className="variations-list">
                  {Object.entries(generatedVariations).map(([groupId, variation]) => {
                    const group = studentGroups.find(g => g.id === groupId);
                    return (
                      <div key={groupId} className="variation-card" style={{ '--group-color': group.color }}>
                        <div className="variation-header">
                          <div className="variation-group">
                            <span className="variation-icon">{group.icon}</span>
                            <div>
                              <h3>{group.name}</h3>
                              <span className="variation-meta">{group.students} students</span>
                            </div>
                          </div>
                          <div className="variation-actions">
                            <button className="action-btn">
                              <Copy size={16} />
                            </button>
                            <button className="action-btn">
                              <Settings size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="variation-content">
                          <div className="question-box">
                            <label className="question-label">Personalized Question:</label>
                            <p className="question-text">{variation.question}</p>
                          </div>
                          
                          <div className="metadata-row">
                            <div className="metadata-item">
                              <Target size={14} />
                              <span>Same Learning Objective</span>
                            </div>
                            <div className="metadata-item">
                              <span className={`difficulty-badge ${difficulty}`}>
                                {difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="variation-footer">
                          <button className="btn-secondary">
                            Preview for Students
                          </button>
                          <button className="btn-primary">
                            Add to Exam
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Generator Styles
```css
/* Personalized Question Generator Styles */
.generator-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.generator-header {
  background: linear-gradient(135deg, var(--navy-800), var(--navy-900));
  border-radius: var(--radius-xl);
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: var(--shadow-xl);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  gap: 20px;
  align-items: center;
}

.header-title h1 {
  color: white;
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: 8px;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--text-base);
}

.header-icon {
  width: 48px;
  height: 48px;
  color: var(--primary-teal);
  background: rgba(78, 205, 196, 0.2);
  padding: 12px;
  border-radius: var(--radius-lg);
}

.header-stats {
  display: flex;
  gap: 24px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-value {
  color: white;
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-sm);
}

/* Layout Grid */
.generator-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .generator-layout {
    grid-template-columns: 1fr;
  }
}

/* Panel Cards */
.panel-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gray-50);
}

.card-header h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
}

.info-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: 1px solid var(--gray-200);
  background: white;
  color: var(--gray-500);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.info-btn:hover {
  background: var(--primary-teal);
  color: white;
  border-color: var(--primary-teal);
}

.card-body {
  padding: 24px;
}

/* Form Elements */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: var(--font-medium);
  color: var(--gray-700);
  font-size: var(--text-sm);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all 0.2s;
  font-family: var(--font-body);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-teal);
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Difficulty Selector */
.difficulty-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.difficulty-btn {
  padding: 10px 16px;
  border: 2px solid var(--gray-200);
  background: white;
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

.difficulty-btn:hover {
  border-color: var(--primary-teal);
  transform: translateY(-2px);
}

.difficulty-btn.active {
  background: linear-gradient(135deg, var(--primary-teal), var(--primary-dark-teal));
  color: white;
  border-color: transparent;
}

/* Student Groups Grid */
.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.group-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.group-card:hover {
  border-color: var(--group-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.group-card.selected {
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--group-color) 10%, white),
    white
  );
  border-color: var(--group-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--group-color) 20%, transparent);
}

.group-card input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.group-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.group-icon {
  font-size: 28px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
}

.group-info {
  display: flex;
  flex-direction: column;
}

.group-name {
  font-weight: var(--font-semibold);
  color: var(--gray-900);
}

.group-count {
  font-size: var(--text-sm);
  color: var(--gray-500);
}

.group-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.2s;
}

.group-checkbox svg {
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s;
  color: white;
}

.group-card.selected .group-checkbox {
  background: var(--group-color);
  border-color: var(--group-color);
}

.group-card.selected .group-checkbox svg {
  opacity: 1;
  transform: scale(1);
}

/* Generate Button */
.generate-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, var(--primary-teal), var(--primary-dark-teal));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(78, 205, 196, 0.3);
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Tab Navigation */
.tab-nav {
  display: flex;
  gap: 4px;
  background: var(--gray-100);
  padding: 4px;
  border-radius: var(--radius-lg);
}

.tab-btn {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.5);
}

.tab-btn.active {
  background: white;
  color: var(--gray-900);
  box-shadow: var(--shadow-sm);
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--primary-teal);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  background: var(--primary-dark-teal);
  transform: translateY(-1px);
}

/* Variations List */
.variations-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.variation-card {
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
}

.variation-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--group-color);
}

.variation-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.variation-header {
  padding: 16px 20px;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.variation-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.variation-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: var(--radius-lg);
}

.variation-group h3 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
}

.variation-meta {
  font-size: var(--text-sm);
  color: var(--gray-500);
}

.variation-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--gray-200);
  background: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--primary-teal);
  color: white;
  border-color: var(--primary-teal);
}

.variation-content {
  padding: 20px;
}

.question-box {
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 16px;
}

.question-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-600);
  margin-bottom: 8px;
}

.question-text {
  color: var(--gray-900);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

.metadata-row {
  display: flex;
  align-items: center;
  