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
echo "📦 Step 1/4 — Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "🗄️  Step 2/4 — Running database migrations..."
alembic upgrade head

echo ""
echo "👤 Step 3/4 — Seeding first admin account (skips if already exists)..."
python scripts/create_admin.py

echo ""
echo "👤 Step 4/4 — Seeding sample courses (skips if already exists)..."
python scripts/create_sample_courses.py

echo ""
echo "✅ Build complete. Server starting..."
