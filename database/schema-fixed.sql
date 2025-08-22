-- AI Exam Platform Database Schema
-- Fixed version for PostgreSQL compatibility

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teachers table
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  department VARCHAR(255),
  institution VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  student_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  major VARCHAR(255) NOT NULL,
  academic_level VARCHAR(50) NOT NULL CHECK (academic_level IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate')),
  gpa DECIMAL(3,2) CHECK (gpa >= 0.0 AND gpa <= 4.0),
  career_interests TEXT[], -- Array of career interests
  additional_info JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, student_id)
);

-- Clusters table
CREATE TABLE clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  algorithm_used VARCHAR(100) NOT NULL DEFAULT 'k-means',
  parameters JSONB DEFAULT '{}',
  characteristics JSONB DEFAULT '{}', -- Stores cluster summary stats
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student-Cluster relationships (many-to-many)
CREATE TABLE student_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  assignment_confidence DECIMAL(5,4) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, cluster_id)
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  baseline_question TEXT NOT NULL,
  difficulty_level VARCHAR(50) NOT NULL CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
  subject VARCHAR(255) NOT NULL,
  learning_objectives TEXT[] NOT NULL,
  question_type VARCHAR(100) NOT NULL CHECK (question_type IN ('Multiple Choice', 'Short Answer', 'Essay', 'Problem Solving')),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_template BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customized Questions table
CREATE TABLE customized_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  customized_text TEXT NOT NULL,
  context_description TEXT,
  customization_metadata JSONB DEFAULT '{}', -- AI parameters, cost, etc.
  status VARCHAR(50) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  review_feedback TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, cluster_id)
);

-- Exams table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL DEFAULT 'Read each question carefully and provide your best answer.',
  time_limit INTEGER NOT NULL DEFAULT 120, -- in minutes
  total_points INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam Questions (junction table with order and points)
CREATE TABLE exam_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  customized_question_id UUID NOT NULL REFERENCES customized_questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, customized_question_id),
  UNIQUE(exam_id, order_index)
);

-- Activity Logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Usage Tracking table
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  operation_type VARCHAR(100) NOT NULL,
  tokens_used INTEGER NOT NULL,
  cost_usd DECIMAL(10,6) NOT NULL,
  model_used VARCHAR(100) NOT NULL,
  processing_time INTEGER, -- in milliseconds
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_students_teacher_id ON students(teacher_id);
CREATE INDEX idx_students_major ON students(major);
CREATE INDEX idx_students_academic_level ON students(academic_level);
CREATE INDEX idx_students_active ON students(active);

CREATE INDEX idx_clusters_teacher_id ON clusters(teacher_id);
CREATE INDEX idx_clusters_status ON clusters(status);

CREATE INDEX idx_student_clusters_student_id ON student_clusters(student_id);
CREATE INDEX idx_student_clusters_cluster_id ON student_clusters(cluster_id);

CREATE INDEX idx_questions_teacher_id ON questions(teacher_id);
CREATE INDEX idx_questions_subject ON questions(subject);
CREATE INDEX idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX idx_questions_type ON questions(question_type);

CREATE INDEX idx_customized_questions_question_id ON customized_questions(question_id);
CREATE INDEX idx_customized_questions_cluster_id ON customized_questions(cluster_id);
CREATE INDEX idx_customized_questions_status ON customized_questions(status);

CREATE INDEX idx_exams_teacher_id ON exams(teacher_id);
CREATE INDEX idx_exams_status ON exams(status);

CREATE INDEX idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX idx_exam_questions_order ON exam_questions(order_index);

CREATE INDEX idx_activity_logs_teacher_id ON activity_logs(teacher_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX idx_ai_usage_teacher_id ON ai_usage_logs(teacher_id);
CREATE INDEX idx_ai_usage_created_at ON ai_usage_logs(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customized_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teachers (users can only access their own data)
CREATE POLICY teachers_own_data ON teachers FOR ALL USING (auth.uid() = id);

CREATE POLICY students_own_data ON students FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY clusters_own_data ON clusters FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY student_clusters_own_data ON student_clusters FOR ALL USING (
  auth.uid() IN (
    SELECT teacher_id FROM students WHERE id = student_clusters.student_id
  )
);

CREATE POLICY questions_own_data ON questions FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY customized_questions_own_data ON customized_questions FOR ALL USING (
  auth.uid() IN (
    SELECT teacher_id FROM questions WHERE id = customized_questions.question_id
  )
);

CREATE POLICY exams_own_data ON exams FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY exam_questions_own_data ON exam_questions FOR ALL USING (
  auth.uid() IN (
    SELECT teacher_id FROM exams WHERE id = exam_questions.exam_id
  )
);

CREATE POLICY activity_logs_own_data ON activity_logs FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY ai_usage_logs_own_data ON ai_usage_logs FOR ALL USING (auth.uid() = teacher_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clusters_updated_at BEFORE UPDATE ON clusters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customized_questions_updated_at BEFORE UPDATE ON customized_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Analytics Views (FIXED VERSIONS)

-- Cluster Analytics View (Fixed unnest issue)
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
  -- Fixed: Use lateral join to unnest career_interests
  (
    SELECT STRING_AGG(DISTINCT interest, ', ')
    FROM (
      SELECT unnest(s.career_interests) as interest
      FROM students s2 
      JOIN student_clusters sc2 ON s2.id = sc2.student_id 
      WHERE sc2.cluster_id = c.id AND s2.active = true
    ) interests
  ) as common_interests
FROM clusters c
LEFT JOIN student_clusters sc ON c.id = sc.cluster_id
LEFT JOIN students s ON sc.student_id = s.id
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
  q.question_type,
  COUNT(cq.id) as customization_count,
  COUNT(CASE WHEN cq.status = 'approved' THEN 1 END) as approved_customizations,
  COUNT(eq.id) as exam_usage_count,
  q.usage_count,
  q.created_at
FROM questions q
LEFT JOIN customized_questions cq ON q.id = cq.question_id
LEFT JOIN exam_questions eq ON cq.id = eq.customized_question_id
GROUP BY q.teacher_id, q.id, q.title, q.subject, q.difficulty_level, q.question_type, q.usage_count, q.created_at;

-- Teacher Activity Summary View
CREATE VIEW teacher_activity_summary AS
SELECT 
  t.id as teacher_id,
  t.name,
  t.email,
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT c.id) as total_clusters,
  COUNT(DISTINCT q.id) as total_questions,
  COUNT(DISTINCT cq.id) as total_customizations,
  COUNT(DISTINCT e.id) as total_exams,
  SUM(aul.cost_usd) as total_ai_cost,
  t.last_login,
  t.created_at
FROM teachers t
LEFT JOIN students s ON t.id = s.teacher_id AND s.active = true
LEFT JOIN clusters c ON t.id = c.teacher_id AND c.status = 'active'
LEFT JOIN questions q ON t.id = q.teacher_id
LEFT JOIN customized_questions cq ON q.id = cq.question_id
LEFT JOIN exams e ON t.id = e.teacher_id
LEFT JOIN ai_usage_logs aul ON t.id = aul.teacher_id
GROUP BY t.id, t.name, t.email, t.last_login, t.created_at;

-- Functions for common operations

-- Function to calculate cluster characteristics
CREATE OR REPLACE FUNCTION update_cluster_characteristics(cluster_uuid UUID)
RETURNS VOID AS $$
DECLARE
  characteristics JSONB;
BEGIN
  SELECT jsonb_build_object(
    'studentCount', COUNT(sc.student_id),
    'averageGPA', ROUND(AVG(s.gpa)::numeric, 2),
    'dominantMajor', MODE() WITHIN GROUP (ORDER BY s.major),
    'dominantLevel', MODE() WITHIN GROUP (ORDER BY s.academic_level),
    'majorDiversity', COUNT(DISTINCT s.major),
    'commonInterests', (
      SELECT ARRAY_AGG(DISTINCT interest)
      FROM (
        SELECT unnest(s2.career_interests) as interest
        FROM students s2 
        JOIN student_clusters sc2 ON s2.id = sc2.student_id 
        WHERE sc2.cluster_id = cluster_uuid AND s2.active = true
      ) interests
    )
  ) INTO characteristics
  FROM student_clusters sc
  JOIN students s ON sc.student_id = s.id
  WHERE sc.cluster_id = cluster_uuid AND s.active = true;
  
  UPDATE clusters 
  SET characteristics = characteristics, updated_at = NOW()
  WHERE id = cluster_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to increment question usage
CREATE OR REPLACE FUNCTION increment_question_usage(question_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE questions 
  SET usage_count = usage_count + 1, updated_at = NOW()
  WHERE id = question_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to log AI usage
CREATE OR REPLACE FUNCTION log_ai_usage(
  teacher_uuid UUID,
  operation VARCHAR(100),
  tokens INTEGER,
  cost_amount DECIMAL(10,6),
  model VARCHAR(100),
  processing_ms INTEGER DEFAULT NULL,
  success_flag BOOLEAN DEFAULT true,
  error_msg TEXT DEFAULT NULL,
  metadata_json JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO ai_usage_logs (
    teacher_id, operation_type, tokens_used, cost_usd, model_used,
    processing_time, success, error_message, metadata
  ) VALUES (
    teacher_uuid, operation, tokens, cost_amount, model,
    processing_ms, success_flag, error_msg, metadata_json
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;