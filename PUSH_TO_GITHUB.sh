#!/bin/bash

# Script to push Pravasi Jaalakam to GitHub
# Repository: https://github.com/Sabuanchuparayil/Pravasijalakam

echo "🚀 Setting up Git and pushing to GitHub..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Add remote (will update if exists)
echo "🔗 Setting up remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Sabuanchuparayil/Pravasijalakam.git

# Add all files
echo "📝 Adding files..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "Initial commit: Pravasi Jaalakam - Production-ready platform setup

- GraphQL API backend with Apollo Server
- Next.js 14 web application
- Flutter mobile app structure
- PostgreSQL database schema
- Clerk authentication integration
- Railway deployment ready"

# Push to main branch
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Done! Code pushed to GitHub."
echo ""
echo "Next steps:"
echo "1. Go to https://railway.app and create a new project"
echo "2. Connect your GitHub repository"
echo "3. Follow RAILWAY_SETUP.md for detailed deployment instructions"

