#!/bin/bash

# GitHub Repository Setup Script
# Replace 'your-username' with your actual GitHub username

echo "Setting up GitHub repository for AI Exam Platform..."

# Add your GitHub repository URL here
# REPO_URL="https://github.com/your-username/ai-exam-platform.git"

read -p "Enter your GitHub username: " USERNAME
REPO_URL="https://github.com/$USERNAME/ai-exam-platform.git"

echo "Adding remote origin: $REPO_URL"
git remote add origin $REPO_URL

echo "Setting main branch..."
git branch -M main

echo "Pushing to GitHub..."
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo "🌐 Your repository is available at: https://github.com/$USERNAME/ai-exam-platform"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Click 'New Project'"
echo "3. Import your GitHub repository"
echo "4. Configure environment variables"
echo "5. Deploy!"