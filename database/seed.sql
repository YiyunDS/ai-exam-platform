-- Sample data for development and testing
-- This script populates the database with realistic sample data

-- Insert sample teachers (for development only)
INSERT INTO teachers (id, email, name, institution) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'demo@university.edu', 'Dr. Demo Teacher', 'Demo University'),
('550e8400-e29b-41d4-a716-446655440001', 'jane.smith@college.edu', 'Dr. Jane Smith', 'Business College'),
('550e8400-e29b-41d4-a716-446655440002', 'john.doe@institute.edu', 'Prof. John Doe', 'Technical Institute');

-- Insert sample students for Demo Teacher (matching screenshots)
INSERT INTO students (teacher_id, name, email, major, academic_level, gpa, career_interests, student_id) VALUES
-- Screenshot Students - exact match to design guide
('550e8400-e29b-41d4-a716-446655440000', 'David Park', 'david.park@university.edu', 'Psychology', 'Senior', 3.70, ARRAY['Clinical Psychology', 'Research'], 'PSY2024004'),
('550e8400-e29b-41d4-a716-446655440000', 'Lisa Thompson', 'lisa.thompson@university.edu', 'Computer Science', 'Freshman', 3.50, ARRAY['Software Engineering', 'AI Development'], 'CS2024005'),
('550e8400-e29b-41d4-a716-446655440000', 'Emma Rodriguez', 'emma.rodriguez@university.edu', 'Computer Science', 'Junior', 3.80, ARRAY['Machine Learning', 'Data Science'], 'CS2024001'),
('550e8400-e29b-41d4-a716-446655440000', 'Michael Chen', 'michael.chen@university.edu', 'Business Administration', 'Senior', 3.60, ARRAY['Management Consulting', 'Strategy'], 'BUS2024002'),
('550e8400-e29b-41d4-a716-446655440000', 'Sarah Johnson', 'sarah.johnson@university.edu', 'Mechanical Engineering', 'Sophomore', 3.90, ARRAY['Automotive Engineering', 'Design'], 'ENG2024003'),

-- Additional students for diversity (can be removed in production)
('550e8400-e29b-41d4-a716-446655440000', 'Frank Miller', 'frank.m@student.edu', 'Marketing', 'Sophomore', 3.2, ARRAY['Digital Marketing', 'Brand Management'], 'MKT2024001'),
('550e8400-e29b-41d4-a716-446655440000', 'Kate Anderson', 'kate.a@student.edu', 'Computer Science', 'Freshman', 3.9, ARRAY['Software Engineering', 'Data Science'], 'CS2024002');

-- Create sample clusters for Demo Teacher
INSERT INTO clusters (teacher_id, name, description, characteristics, is_auto_generated) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Finance Juniors & Seniors', 'Advanced Finance students focusing on investment and banking', 
 '{"averageGPA": 3.6, "commonInterests": ["Investment Banking", "Financial Analysis"], "learningStyle": "Analytical", "majorDistribution": {"Finance": 5}}', true),
('550e8400-e29b-41d4-a716-446655440000', 'Marketing Undergrads', 'Marketing students from sophomore to senior level', 
 '{"averageGPA": 3.3, "commonInterests": ["Digital Marketing", "Brand Management"], "learningStyle": "Creative", "majorDistribution": {"Marketing": 5}}', true),
('550e8400-e29b-41d4-a716-446655440000', 'Computer Science Rising Stars', 'CS students with high academic performance', 
 '{"averageGPA": 3.75, "commonInterests": ["Software Engineering", "Data Science"], "learningStyle": "Technical", "majorDistribution": {"Computer Science": 4}}', true),
('550e8400-e29b-41d4-a716-446655440000', 'Business & Economics Mix', 'Mixed group of business-oriented students', 
 '{"averageGPA": 3.3, "commonInterests": ["Business Analytics", "Strategic Planning"], "learningStyle": "Strategic", "majorDistribution": {"Economics": 3, "Business Administration": 3}}', true);

-- Assign students to clusters
INSERT INTO student_clusters (student_id, cluster_id, assigned_by) 
SELECT s.id, c.id, 'auto'
FROM students s, clusters c
WHERE s.teacher_id = '550e8400-e29b-41d4-a716-446655440000'
AND c.teacher_id = '550e8400-e29b-41d4-a716-446655440000'
AND (
    (s.major = 'Finance' AND c.name = 'Finance Juniors & Seniors') OR
    (s.major = 'Marketing' AND c.name = 'Marketing Undergrads') OR
    (s.major = 'Computer Science' AND c.name = 'Computer Science Rising Stars') OR
    (s.major IN ('Economics', 'Business Administration') AND c.name = 'Business & Economics Mix')
);

-- Create sample questions
INSERT INTO questions (teacher_id, title, baseline_question, difficulty_level, subject, learning_objectives, question_type, tags) VALUES
('550e8400-e29b-41d4-a716-446655440000', 
 'Basic Statistics Problem', 
 'Calculate the mean and standard deviation for the following data set: 5, 20, 40, 65, 90',
 'Medium', 
 'Statistics',
 ARRAY['Calculate descriptive statistics', 'Interpret data variation'],
 'Problem Solving',
 ARRAY['statistics', 'mean', 'standard deviation']),

('550e8400-e29b-41d4-a716-446655440000',
 'Probability Calculation',
 'If you flip a fair coin 10 times, what is the probability of getting exactly 6 heads?',
 'Medium',
 'Probability',
 ARRAY['Apply binomial probability', 'Calculate exact probabilities'],
 'Problem Solving',
 ARRAY['probability', 'binomial', 'coin flip']),

('550e8400-e29b-41d4-a716-446655440000',
 'Market Analysis Question',
 'Analyze the factors that would influence consumer demand for a new product in a competitive market.',
 'Hard',
 'Business',
 ARRAY['Analyze market dynamics', 'Evaluate competitive factors'],
 'Essay',
 ARRAY['market analysis', 'demand', 'competition']),

('550e8400-e29b-41d4-a716-446655440000',
 'Data Interpretation',
 'Given the following quarterly sales data, identify trends and make recommendations: Q1: $100K, Q2: $120K, Q3: $95K, Q4: $140K',
 'Medium',
 'Business Analytics',
 ARRAY['Interpret data trends', 'Make data-driven recommendations'],
 'Short Answer',
 ARRAY['data analysis', 'trends', 'recommendations']);

-- Create some customized questions
INSERT INTO customized_questions (question_id, cluster_id, customized_text, context, ai_model, reviewed, approved)
SELECT 
    q.id,
    c.id,
    CASE 
        WHEN c.name = 'Finance Juniors & Seniors' THEN 
            'A portfolio manager is analyzing monthly returns for a diversified investment fund. Calculate the mean return and standard deviation for the following monthly returns: 5%, 20%, 40%, 65%, 90%. This analysis will help determine the fund''s risk profile for potential investors.'
        WHEN c.name = 'Marketing Undergrads' THEN 
            'A digital marketing team is analyzing campaign conversion rates across different platforms. Calculate the mean conversion rate and standard deviation for: 5%, 20%, 40%, 65%, 90%. Use this analysis to evaluate campaign consistency and performance.'
        WHEN c.name = 'Computer Science Rising Stars' THEN 
            'A software performance engineer is analyzing system response times (in milliseconds): 5, 20, 40, 65, 90. Calculate the mean response time and standard deviation to assess system performance variability.'
        ELSE 
            'Calculate the mean and standard deviation for the business metrics: 5, 20, 40, 65, 90. Interpret these statistics in the context of business performance analysis.'
    END,
    CASE 
        WHEN c.name = 'Finance Juniors & Seniors' THEN 'Investment Portfolio Analysis'
        WHEN c.name = 'Marketing Undergrads' THEN 'Digital Marketing Campaign Analysis' 
        WHEN c.name = 'Computer Science Rising Stars' THEN 'System Performance Analysis'
        ELSE 'Business Metrics Analysis'
    END,
    'gpt-4o-mini',
    true,
    true
FROM questions q, clusters c
WHERE q.teacher_id = '550e8400-e29b-41d4-a716-446655440000'
AND c.teacher_id = '550e8400-e29b-41d4-a716-446655440000'
AND q.title = 'Basic Statistics Problem';

-- Create sample exams
INSERT INTO exams (teacher_id, title, description, instructions, time_limit, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 
 'Midterm Statistics Exam',
 'Comprehensive statistics exam covering descriptive statistics and basic probability',
 'Show all work. Calculators are allowed. You have 90 minutes to complete this exam.',
 90,
 'draft'),

('550e8400-e29b-41d4-a716-446655440000',
 'Business Analytics Quiz',
 'Quick assessment of data interpretation and analysis skills',
 'Answer all questions concisely. Focus on practical applications.',
 45,
 'published');

-- Add questions to exams
INSERT INTO exam_questions (exam_id, question_id, order_index, points)
SELECT e.id, q.id, 1, 25
FROM exams e, questions q
WHERE e.teacher_id = '550e8400-e29b-41d4-a716-446655440000'
AND q.teacher_id = '550e8400-e29b-41d4-a716-446655440000'
AND e.title = 'Midterm Statistics Exam'
AND q.title = 'Basic Statistics Problem';

INSERT INTO exam_questions (exam_id, question_id, order_index, points)
SELECT e.id, q.id, 2, 25
FROM exams e, questions q
WHERE e.teacher_id = '550e8400-e29b-41d4-a716-446655440000'
AND q.teacher_id = '550e8400-e29b-41d4-a716-446655440000'
AND e.title = 'Midterm Statistics Exam'
AND q.title = 'Probability Calculation';

-- Add some AI usage logs for analytics
INSERT INTO ai_usage_logs (teacher_id, operation_type, model, tokens_used, cost_usd, processing_time, success) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'question_customization', 'gpt-4o-mini', 150, 0.025, 2500, true),
('550e8400-e29b-41d4-a716-446655440000', 'question_customization', 'gpt-4o-mini', 180, 0.030, 3200, true),
('550e8400-e29b-41d4-a716-446655440000', 'clustering_analysis', 'gpt-4o-mini', 200, 0.035, 1800, true),
('550e8400-e29b-41d4-a716-446655440000', 'question_customization', 'gpt-4o-mini', 165, 0.028, 2800, true);

-- Add some activity logs
INSERT INTO activity_logs (teacher_id, action, resource_type, details) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'created', 'student', '{"student_name": "Alice Johnson", "method": "manual"}'),
('550e8400-e29b-41d4-a716-446655440000', 'generated', 'clusters', '{"cluster_count": 4, "method": "auto"}'),
('550e8400-e29b-41d4-a716-446655440000', 'customized', 'question', '{"question_title": "Basic Statistics Problem", "clusters": 4}'),
('550e8400-e29b-41d4-a716-446655440000', 'created', 'exam', '{"exam_title": "Midterm Statistics Exam", "questions": 2}');

-- Update cluster student counts (trigger should handle this, but let's ensure consistency)
UPDATE clusters SET student_count = (
    SELECT COUNT(*) 
    FROM student_clusters sc 
    JOIN students s ON sc.student_id = s.id 
    WHERE sc.cluster_id = clusters.id AND s.active = true
) WHERE teacher_id = '550e8400-e29b-41d4-a716-446655440000';