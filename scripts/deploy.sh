#!/bin/bash
# Virtual Office OS — One-Click Deploy Script
# Deploy: Railway (API + PostgreSQL) + Vercel (Frontend)

set -e
export PATH="/usr/local/bin:$PATH"

cd "$(dirname "$0")/.."

echo "============================================"
echo "  Virtual Office OS — Deploy to Production"
echo "============================================"
echo ""

# ============================================================
# Step 1: Railway — Backend API + PostgreSQL
# ============================================================
echo "=== Step 1: Deploy Backend to Railway ==="
echo ""
echo "1. Go to https://railway.app and sign up/login"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "   OR use CLI: npx @railway/cli login"
echo ""

# Check if railway is logged in
if npx @railway/cli whoami 2>/dev/null; then
  echo "Railway: Logged in!"

  # Create project
  echo "Creating Railway project..."
  npx @railway/cli init --name virtual-office-os 2>/dev/null || true

  # Add PostgreSQL
  echo "Adding PostgreSQL service..."
  npx @railway/cli add --plugin postgresql 2>/dev/null || echo "Add PostgreSQL manually in Railway dashboard"

  # Deploy
  echo "Deploying API..."
  npx @railway/cli up --detach

  # Get URL
  API_URL=$(npx @railway/cli domain 2>/dev/null || echo "Check Railway dashboard for URL")
  echo ""
  echo "API deployed! URL: $API_URL"

  # Run seed
  echo "Running database seed..."
  npx @railway/cli run -- npx ts-node --compiler-options '{"module":"commonjs"}' packages/database/prisma/seed.ts 2>/dev/null || echo "Run seed manually via Railway shell"

else
  echo "Railway CLI not logged in."
  echo ""
  echo "Option A — Deploy via CLI:"
  echo "  npx @railway/cli login"
  echo "  npx @railway/cli init --name virtual-office-os"
  echo "  npx @railway/cli add --plugin postgresql"
  echo "  npx @railway/cli up"
  echo ""
  echo "Option B — Deploy via Dashboard:"
  echo "  1. Push code to GitHub first:"
  echo "     git remote add origin <your-github-repo-url>"
  echo "     git push -u origin main"
  echo "  2. Go to https://railway.app → New Project → Deploy from GitHub"
  echo "  3. Add PostgreSQL service"
  echo "  4. Set environment variables:"
  echo "     JWT_SECRET=your-production-secret-here"
  echo "     APP_PORT=3001"
  echo "     NODE_ENV=production"
  echo "  5. Railway will auto-detect Dockerfile and deploy"
fi

echo ""
echo ""

# ============================================================
# Step 2: Vercel — Frontend
# ============================================================
echo "=== Step 2: Deploy Frontend to Vercel ==="
echo ""

if npx vercel whoami 2>/dev/null; then
  echo "Vercel: Logged in!"

  cd apps/web
  echo "Deploying frontend..."
  npx vercel --prod --yes
  cd ../..

  echo "Frontend deployed!"
else
  echo "Vercel CLI not logged in."
  echo ""
  echo "Option A — Deploy via CLI:"
  echo "  npx vercel login"
  echo "  cd apps/web && npx vercel --prod"
  echo ""
  echo "Option B — Deploy via Dashboard:"
  echo "  1. Push code to GitHub"
  echo "  2. Go to https://vercel.com → Import Project → Select repo"
  echo "  3. Set Root Directory: apps/web"
  echo "  4. Set Environment Variable:"
  echo "     NEXT_PUBLIC_API_URL=https://<your-railway-api-url>"
  echo "  5. Deploy"
fi

echo ""
echo "============================================"
echo "  Deploy Complete!"
echo "============================================"
echo ""
echo "After deploy, update:"
echo "  1. Railway API → APP_URL = your Vercel frontend URL (for CORS)"
echo "  2. Vercel Frontend → NEXT_PUBLIC_API_URL = your Railway API URL"
echo ""
