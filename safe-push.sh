#!/bin/bash

echo "🔐 Safe GitHub Push Script"
echo "=========================="
echo ""

# Prompt for token securely
echo "Please enter your GitHub Personal Access Token:"
read -s GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

echo ""
echo "Setting remote URL..."
git remote set-url origin "https://YiyunDS:${GITHUB_TOKEN}@github.com/YiyunDS/ai-exam-platform.git"

echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Code pushed to GitHub!"
    echo "🌐 Repository: https://github.com/YiyunDS/ai-exam-platform"
    
    echo "Cleaning up remote URL..."
    git remote set-url origin "https://github.com/YiyunDS/ai-exam-platform.git"
    
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Click 'New Project'"
    echo "3. Import your GitHub repository"
    echo "4. Deploy!"
else
    echo "❌ Push failed. Please check your token and try again."
fi

# Clear the token from memory
unset GITHUB_TOKEN