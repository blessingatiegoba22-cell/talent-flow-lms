#!/bin/bash

# Migration script for Talent Flow LMS
echo "Running database migrations..."

# Set environment variables
export DB_USER=root
export DB_PASSWORD=password
export DB_HOST=talent_flow_db
export DB_PORT=3306
export DB_DATABASE=talent_flow_db_db

# Run migrations
cd /app && python -m alembic upgrade head

echo "Migrations completed!"
