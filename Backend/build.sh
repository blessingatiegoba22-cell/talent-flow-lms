#!/usr/bin/env bash
# build.sh — Render build script
# Runs ONCE per deployment, before the server starts.
# Render calls this as the "Build Command" if you reference it,
# or you can paste the commands directly in the Render dashboard.
set -e  # Exit immediately on any error

echo "=========================================="
echo " TalentFlow LMS — Build Script"
echo "=========================================="

echo ""
echo "📦 Step 1/3 — Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "🗄️  Step 2/3 — Running database migrations..."
alembic upgrade head

echo ""
echo "👤 Step 3/3 — Seeding first admin account (skips if already exists)..."
python scripts/create_admin.py

echo ""
echo "✅ Build complete. Server starting..."
