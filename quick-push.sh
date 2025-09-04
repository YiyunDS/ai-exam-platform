#!/bin/bash
echo "Enter your GitHub token:"
read -s TOKEN
git remote set-url origin "https://YiyunDS:${TOKEN}@github.com/YiyunDS/ai-exam-platform.git"
git push origin main
git remote set-url origin "https://github.com/YiyunDS/ai-exam-platform.git"
echo "✅ Pushed successfully!"