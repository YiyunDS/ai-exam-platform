-- AI Exam Customization Platform Database Schema
-- This script creates all tables, indexes, triggers, and RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS ai_usage_logs CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS exam_exports CASCADE;
DROP TABLE IF EXISTS exam_questions CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS customized_questions CASCADE;
DROP TABLE IF EXISTS question_templates CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS clustering_jobs CASCADE;
DROP TABLE IF EXISTS student_clusters CASCADE;
DROP TABLE IF EXISTS clusters CASCADE;
DROP TABLE IF EXISTS student_import_logs CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- System Settings Table (Global Configuration)
CREATE TABLE system_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Teachers Table (Auth users)
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Students Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    major VARCHAR(255) NOT NULL,
    academic_level VARCHAR(50) NOT NULL CHECK (academic_level IN ('Freshman', 'Sophomore', 'Junior', 'Senior')),
    gpa DECIMAL(3,2) CHECK (gpa >= 0 AND gpa <= 4),
    career_interests TEXT[] DEFAULT '{}',
    additional_info JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Import Logs
CREATE TABLE student_import_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    total_rows INTEGER NOT NULL,
    imported_count INTEGER NOT NULL,
    error_count INTEGER NOT NULL,
    errors JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Clusters Table
CREATE TABLE clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    characteristics JSONB DEFAULT '{}',
    clustering_criteria JSONB DEFAULT '{}',
    student_count INTEGER DEFAULT 0,
    is_auto_generated BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student Clusters Junction Table
CREATE TABLE student_clusters (
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by VARCHAR(50) DEFAULT 'auto', -- 'auto' or 'manual'
    PRIMARY KEY (student_id, cluster_id)
);

-- Clustering Jobs Table
CREATE TABLE clustering_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    criteria JSONB NOT NULL,
    result JSONB DEFAULT '{}',
    error_message TEXT,
    processing_time INTEGER, -- milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Questions Table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    baseline_question TEXT NOT NULL,
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
    subject VARCHAR(255),
    learning_objectives TEXT[] DEFAULT '{}',
    question_type VARCHAR(100) CHECK (question_type IN ('Multiple Choice', 'Short Answer', 'Essay', 'Problem Solving')),
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_template BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Question Templates Table
CREATE TABLE question_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL,
    category VARCHAR(100),
    usage_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customized Questions Table
CREATE TABLE customized_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
    customized_text TEXT NOT NULL,
    context VARCHAR(500),
    ai_model VARCHAR(100) DEFAULT 'gpt-4o-mini',
    generation_prompt TEXT,
    tokens_used INTEGER,
    generation_time INTEGER, -- milliseconds
    reviewed BOOLEAN DEFAULT false,
    approved BOOLEAN DEFAULT false,
    feedback TEXT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Ensure one customized version per question-cluster pair per version
    UNIQUE(question_id, cluster_id, version)
);

-- Exams Table
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    time_limit INTEGER, -- in minutes
    question_order JSONB DEFAULT '[]', -- array of question IDs with ordering
    settings JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Exam Questions Junction Table
CREATE TABLE exam_questions (
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    points INTEGER DEFAULT 1,
    settings JSONB DEFAULT '{}',
    PRIMARY KEY (exam_id, question_id)
);

-- Exam Exports Table
CREATE TABLE exam_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    format VARCHAR(50) NOT NULL, -- pdf, csv, docx
    cluster_id UUID REFERENCES clusters(id) ON DELETE SET NULL,
    file_path VARCHAR(500),
    file_size INTEGER,
    settings JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- AI Usage Logs Table
CREATE TABLE ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    operation_type VARCHAR(100) NOT NULL, -- question_customization, clustering, etc.
    model VARCHAR(100) NOT NULL,
    tokens_used INTEGER NOT NULL,
    cost_usd DECIMAL(10,4),
    processing_time INTEGER, -- milliseconds
    request_data JSONB,
    response_data JSONB,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activity Logs Table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Indexes for Performance
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_institution ON teachers(institution);

CREATE INDEX idx_students_teacher_id ON students(teacher_id);
CREATE INDEX idx_students_major_level ON students(major, academic_level);
CREATE INDEX idx_students_gpa ON students(gpa);
CREATE INDEX idx_students_active ON students(active);
CREATE INDEX idx_students_search ON students USING gin(to_tsvector('english', name || ' ' || COALESCE(email, '')));
CREATE UNIQUE INDEX idx_students_teacher_email ON students(teacher_id, email) WHERE email IS NOT NULL;

CREATE INDEX idx_import_logs_teacher ON student_import_logs(teacher_id);

CREATE INDEX idx_clusters_teacher_id ON clusters(teacher_id);
CREATE INDEX idx_clusters_auto_generated ON clusters(is_auto_generated);

CREATE INDEX idx_student_clusters_student ON student_clusters(student_id);
CREATE INDEX idx_student_clusters_cluster ON student_clusters(cluster_id);
CREATE INDEX idx_student_clusters_assigned ON student_clusters(assigned_at);

CREATE INDEX idx_clustering_jobs_teacher ON clustering_jobs(teacher_id);
CREATE INDEX idx_clustering_jobs_status ON clustering_jobs(status);

CREATE INDEX idx_questions_teacher_id ON questions(teacher_id);
CREATE INDEX idx_questions_subject ON questions(subject);
CREATE INDEX idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_template ON questions(is_template);
CREATE INDEX idx_questions_search ON questions USING gin(to_tsvector('english', title || ' ' || baseline_question));
CREATE INDEX idx_questions_tags ON questions USING gin(tags);

CREATE INDEX idx_question_templates_teacher ON question_templates(teacher_id);
CREATE INDEX idx_question_templates_category ON question_templates(category);
CREATE INDEX idx_question_templates_public ON question_templates(is_public);

CREATE INDEX idx_customized_questions_question ON customized_questions(question_id);
CREATE INDEX idx_customized_questions_cluster ON customized_questions(cluster_id);
CREATE INDEX idx_customized_questions_approved ON customized_questions(approved);
CREATE INDEX idx_customized_questions_reviewed ON customized_questions(reviewed);
CREATE INDEX idx_customized_questions_version ON customized_questions(question_id, version);

CREATE INDEX idx_exams_teacher_id ON exams(teacher_id);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_published ON exams(published_at);

CREATE INDEX idx_exam_questions_exam ON exam_questions(exam_id);
CREATE INDEX idx_exam_questions_question ON exam_questions(question_id);
CREATE INDEX idx_exam_questions_order ON exam_questions(exam_id, order_index);

CREATE INDEX idx_exam_exports_exam ON exam_exports(exam_id);
CREATE INDEX idx_exam_exports_teacher ON exam_exports(teacher_id);
CREATE INDEX idx_exam_exports_status ON exam_exports(status);

CREATE INDEX idx_ai_usage_teacher ON ai_usage_logs(teacher_id);
CREATE INDEX idx_ai_usage_operation ON ai_usage_logs(operation_type);
CREATE INDEX idx_ai_usage_date ON ai_usage_logs(created_at);
CREATE INDEX idx_ai_usage_cost ON ai_usage_logs(cost_usd);

CREATE INDEX idx_activity_logs_teacher ON activity_logs(teacher_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX idx_activity_logs_date ON activity_logs(created_at);

-- Functions and Triggers

-- Function to update student count in clusters
CREATE OR REPLACE FUNCTION update_cluster_student_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update student count for affected clusters
  UPDATE clusters 
  SET student_count = (
    SELECT COUNT(*) 
    FROM student_clusters sc 
    JOIN students s ON sc.student_id = s.id 
    WHERE sc.cluster_id = COALESCE(NEW.cluster_id, OLD.cluster_id)
    AND s.active = true
  )
  WHERE id = COALESCE(NEW.cluster_id, OLD.cluster_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for cluster student count
CREATE TRIGGER trigger_update_cluster_count
  AFTER INSERT OR DELETE ON student_clusters
  FOR EACH ROW EXECUTE FUNCTION update_cluster_student_count();

-- Function to update question usage count
CREATE OR REPLACE FUNCTION update_question_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE questions 
  SET usage_count = (
    SELECT COUNT(*) 
    FROM exam_questions 
    WHERE question_id = NEW.question_id
  )
  WHERE id = NEW.question_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for question usage count
CREATE TRIGGER trigger_update_question_usage
  AFTER INSERT ON exam_questions
  FOR EACH ROW EXECUTE FUNCTION update_question_usage();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to all tables with updated_at column
CREATE TRIGGER update_teachers_updated_at 
  BEFORE UPDATE ON teachers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at 
  BEFORE UPDATE ON students 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clusters_updated_at 
  BEFORE UPDATE ON clusters 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at 
  BEFORE UPDATE ON questions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customized_questions_updated_at 
  BEFORE UPDATE ON customized_questions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at 
  BEFORE UPDATE ON exams 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for Analytics

-- Student Statistics View
CREATE VIEW student_statistics AS
SELECT 
  s.teacher_id,
  COUNT(*) as total_students,
  COUNT(DISTINCT s.major) as unique_majors,
  COUNT(DISTINCT s.academic_level) as academic_levels,
  AVG(s.gpa) as average_gpa,
  COUNT(CASE WHEN s.gpa >= 3.5 THEN 1 END) as high_performers,
  COUNT(CASE WHEN s.gpa < 2.5 THEN 1 END) as at_risk_students
FROM students s
WHERE s.active = true
GROUP BY s.teacher_id;

-- Cluster Analytics View
CREATE VIEW cluster_analytics AS
SELECT 
  c.teacher_id,
  c.id as cluster_id,
  c.name as cluster_name,
  COUNT(sc.student_id) as student_count,
  AVG(s.gpa) as average_gpa,
  MODE() WITHIN GROUP (ORDER BY s.major) as dominant_major,
  MODE() WITHIN GROUP (ORDER BY s.academic_level) as dominant_level,
  COUNT(DISTINCT s.major) as major_diversity,
  STRING_AGG(DISTINCT career_interest, ', ') as common_interests
FROM clusters c
LEFT JOIN student_clusters sc ON c.id = sc.cluster_id
LEFT JOIN students s ON sc.student_id = s.id
LEFT JOIN LATERAL unnest(s.career_interests) AS career_interest ON true
WHERE s.active = true OR s.id IS NULL
GROUP BY c.teacher_id, c.id, c.name;

-- Question Usage View
CREATE VIEW question_usage_analytics AS
SELECT 
  q.teacher_id,
  q.id as question_id,
  q.title,
  q.subject,
  q.difficulty_level,
  COUNT(cq.id) as customization_count,
  COUNT(CASE WHEN cq.approved = true THEN 1 END) as approved_customizations,
  COUNT(eq.exam_id) as exam_usage_count,
  AVG(cq.tokens_used) as avg_tokens_per_customization,
  MAX(cq.created_at) as last_customized
FROM questions q
LEFT JOIN customized_questions cq ON q.id = cq.question_id
LEFT JOIN exam_questions eq ON q.id = eq.question_id
GROUP BY q.teacher_id, q.id, q.title, q.subject, q.difficulty_level;

-- AI Usage Summary View
CREATE VIEW ai_usage_summary AS
SELECT 
  teacher_id,
  DATE_TRUNC('month', created_at) as month,
  operation_type,
  COUNT(*) as request_count,
  SUM(tokens_used) as total_tokens,
  SUM(cost_usd) as total_cost,
  AVG(processing_time) as avg_processing_time,
  COUNT(CASE WHEN success = false THEN 1 END) as error_count
FROM ai_usage_logs
GROUP BY teacher_id, DATE_TRUNC('month', created_at), operation_type;

-- Enable Row Level Security (RLS)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE clustering_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE customized_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Teachers can only access their own data)
CREATE POLICY "Teachers can manage their own profile" 
ON teachers FOR ALL 
USING (auth.uid() = id);

CREATE POLICY "Teachers can manage their students" 
ON students FOR ALL 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can view their import logs" 
ON student_import_logs FOR ALL 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage their clusters" 
ON clusters FOR ALL 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage student cluster assignments" 
ON student_clusters FOR ALL 
USING (EXISTS (
  SELECT 1 FROM students s 
  WHERE s.id = student_id AND s.teacher_id = auth.uid()
));

CREATE POLICY "Teachers can manage their clustering jobs" 
ON clustering_jobs FOR ALL 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage their questions" 
ON questions FOR ALL 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage their question templates" 
ON question_templates FOR ALL 
USING (teacher_id = auth.uid() OR is_public = true);

CREATE POLICY "Teachers can manage customized questions for their questions" 
ON customized_questions FOR ALL 
USING (EXISTS (
  SELECT 1 FROM questions q 
  WHERE q.id = question_id AND q.teacher_id = auth.uid()
));

CREATE POLICY "Teachers can manage their exams" 
ON exams FOR ALL 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage exam questions for their exams" 
ON exam_questions FOR ALL 
USING (EXISTS (
  SELECT 1 FROM exams e 
  WHERE e.id = exam_id AND e.teacher_id = auth.uid()
));

CREATE POLICY "Teachers can manage their exam exports" 
ON exam_exports FOR ALL 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can view their AI usage logs" 
ON ai_usage_logs FOR ALL 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can view their activity logs" 
ON activity_logs FOR ALL 
USING (teacher_id = auth.uid());

-- Insert Default System Settings
INSERT INTO system_settings (key, value, description) VALUES
('ai_models', '{"default": "gpt-4o-mini", "available": ["gpt-4o-mini", "gpt-4"]}', 'Available AI models'),
('rate_limits', '{"standard": 100, "ai_generation": 10, "file_upload": 5}', 'API rate limits per minute'),
('clustering_defaults', '{"max_cluster_size": 15, "min_cluster_size": 5}', 'Default clustering parameters'),
('default_clustering_criteria', '{"primary": "major_level", "secondary": "gpa_interests"}', 'Default clustering algorithm'),
('question_templates', '{"statistics": [], "finance": [], "marketing": []}', 'Default question templates'),
('ai_prompts', '{"customization": "Transform this question..."}', 'AI prompt templates');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;