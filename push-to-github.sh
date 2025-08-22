#!/bin/bash

echo "🚀 AI Exam Platform - GitHub Push Setup"
echo "========================================"
echo ""

# Get user input
read -p "Enter your GitHub username: " USERNAME
read -p "Enter your GitHub repository URL (or press Enter to use default): " CUSTOM_URL

# Set repository URL
if [ -z "$CUSTOM_URL" ]; then
    REPO_URL="https://github.com/$USERNAME/ai-exam-platform.git"
else
    REPO_URL="$CUSTOM_URL"
fi

echo ""
echo "Repository URL: $REPO_URL"
echo ""

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add remote
echo "Adding remote origin..."
git remote add origin $REPO_URL

# Set main branch
echo "Setting main branch..."
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
echo "Note: You'll be prompted for your GitHub username and Personal Access Token"
echo "Use your Personal Access Token as the password (not your GitHub password)"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Your repository: https://github.com/$USERNAME/ai-exam-platform"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Click 'New Project'"
    echo "3. Import your GitHub repository"
    echo "4. Configure environment variables (see DEPLOYMENT.md)"
    echo "5. Deploy your app!"
    echo ""
    echo "📚 Don't forget to:"
    echo "- Set up Supabase database"
    echo "- Get OpenAI API key"
    echo "- Configure environment variables"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Repository exists on GitHub"
    echo "2. Personal Access Token is correct"
    echo "3. Token has 'repo' permissions"
fi