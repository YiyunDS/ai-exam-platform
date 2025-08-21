# AI-Driven Exam Customization Platform

Transform traditional "one-size-fits-all" exams into personalized assessments that match each student's academic background and interests.

## 🎯 Core Purpose

Your website transforms traditional exams into personalized assessments by:
- Automatically grouping students based on academic profiles
- Generating contextually relevant questions for each group
- Maintaining consistent difficulty across all versions
- Providing real-world scenarios matching career interests

## ✨ Key Features

### 👩‍🏫 For Teachers
- **Student Profile Management**: Upload via CSV or forms, manage student data
- **AI-Powered Clustering**: Automatic grouping by major + academic level
- **Question Customization**: Transform generic questions into personalized versions
- **Exam Creation & Export**: Build complete exams, export to PDF/CSV

### 📚 For Students
- **Engaging Content**: Questions relevant to their major and career goals
- **Real-World Context**: Professional scenarios they'll actually encounter
- **Better Outcomes**: Higher comprehension through relevant examples

## 🏗️ Technical Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **AI**: OpenAI GPT-4o Mini
- **Deployment**: Vercel
- **State Management**: Zustand
- **Forms**: React Hook Form

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd ai-exam-platform
npm install

# Set up environment
cp .env.example .env.local
# Add your API keys

# Run development server
npm run dev
```

## 📊 Example Use Case

**Baseline Question:**
"Calculate the mean and standard deviation for: 5, 20, 40, 65, 90"

**Generated Versions:**
- **Finance Students**: "Analyze portfolio returns: 5%, 20%, 40%, 65%, 90%"
- **Marketing Students**: "Calculate campaign performance metrics: 5%, 20%, 40%, 65%, 90%"

Same learning objective, engaging context for each student group.

## 🔒 Security & Privacy

- Row Level Security (RLS) with Supabase
- Teacher data isolation
- FERPA compliance considerations
- Encrypted student data

## 📈 Success Metrics

- 90% reduction in exam creation time
- Improved student engagement and test scores
- Consistent question difficulty across versions
- High teacher satisfaction rates

## 🛠️ Development

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for detailed setup and development guidelines.

## 📋 Project Status

This project is in active development. See [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) for current progress and roadmap.