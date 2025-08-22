#!/bin/bash

echo "🚀 Pushing AI Exam Platform to GitHub"
echo "======================================"
echo ""
echo "Repository: https://github.com/yiyunds/ai-exam-platform"
echo ""
echo "When prompted:"
echo "- Username: yiyunds"
echo "- Password: Use your Personal Access Token (NOT your GitHub password)"
echo ""
echo "Pushing now..."

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your AI Exam Platform is now on GitHub!"
    echo "🌐 Repository URL: https://github.com/yiyunds/ai-exam-platform"
    echo ""
    echo "🚀 Next: Deploy to Vercel"
    echo "1. Go to https://vercel.com"
    echo "2. Click 'New Project'"
    echo "3. Import your repository"
    echo "4. Add environment variables"
    echo "5. Deploy!"
else
    echo ""
    echo "❌ Push failed. Please:"
    echo "1. Make sure you created the repository on GitHub"
    echo "2. Use Personal Access Token (not password)"
    echo "3. Generate token at: https://github.com/settings/tokens"
fi