#!/usr/bin/env python3
"""
Test script to demonstrate team management functionality
"""
import os
import sys
import psycopg2
from datetime import datetime

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Password123!@localhost:5432/talent_flow_db")

def create_test_teams():
    """Create test teams to demonstrate functionality"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Create teams table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS teams (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                max_members INTEGER DEFAULT 10,
                status VARCHAR(20) DEFAULT 'active',
                created_by INTEGER,
                team_lead_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create team_members table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS team_members (
                id SERIAL PRIMARY KEY,
                team_id INTEGER REFERENCES teams(id),
                user_id INTEGER REFERENCES users(id),
                role VARCHAR(20) DEFAULT 'member',
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                left_at TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create team_courses table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS team_courses (
                id SERIAL PRIMARY KEY,
                team_id INTEGER REFERENCES teams(id),
                course_id INTEGER REFERENCES admin_courses(id),
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Insert test teams
        teams_data = [
            ("Alpha Team", "First team for JavaScript course", 5, "active", 1),
            ("Beta Team", "Second team for Python course", 6, "active", 1),
            ("Gamma Team", "Third team for Web Development", 4, "active", 1)
        ]
        
        for name, description, max_members, status, created_by in teams_data:
            cursor.execute("""
                INSERT INTO teams (name, description, max_members, status, created_by)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
            """, (name, description, max_members, status, created_by))
            
            team_id = cursor.fetchone()[0]
            print(f"Created team: {name} (ID: {team_id})")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("Test teams created successfully!")
        return True
        
    except Exception as e:
        print(f"Error creating test teams: {e}")
        return False

def show_team_functionality():
    """Show the team management functionality"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("\n" + "="*60)
        print("TEAM MANAGEMENT FUNCTIONALITY DEMONSTRATION")
        print("="*60)
        
        # Show teams
        cursor.execute("""
            SELECT id, name, description, max_members, status, created_at
            FROM teams
            ORDER BY created_at DESC;
        """)
        
        teams = cursor.fetchall()
        print(f"\nTeams Created: {len(teams)}")
        print("-" * 40)
        for team in teams:
            team_id, name, description, max_members, status, created_at = team
            print(f"ID: {team_id}, Name: {name}, Max Members: {max_members}, Status: {status}")
        
        # Show available users
        cursor.execute("""
            SELECT id, name, email, role
            FROM users
            ORDER BY created_at DESC
            LIMIT 5;
        """)
        
        users = cursor.fetchall()
        print(f"\nAvailable Users: {len(users)}")
        print("-" * 40)
        for user in users:
            user_id, name, email, role = user
            print(f"ID: {user_id}, Name: {name}, Email: {email}, Role: {role}")
        
        # Show available courses
        cursor.execute("""
            SELECT id, title, status
            FROM admin_courses
            ORDER BY created_at DESC;
        """)
        
        courses = cursor.fetchall()
        print(f"\nAvailable Courses: {len(courses)}")
        print("-" * 40)
        for course in courses:
            course_id, title, status = course
            print(f"ID: {course_id}, Title: {title}, Status: {status}")
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        print("TEAM MANAGEMENT FEATURES AVAILABLE:")
        print("="*60)
        print("1. Admin can create teams")
        print("2. Admin can add/remove users from teams")
        print("3. Admin can assign courses to teams")
        print("4. Admin can manage team settings")
        print("5. Admin can view team details and members")
        print("6. Only Admin has access to team management")
        print("="*60)
        
        return True
        
    except Exception as e:
        print(f"Error showing functionality: {e}")
        return False

if __name__ == "__main__":
    print("Creating test teams...")
    if create_test_teams():
        print("\nTest teams created successfully!")
        show_team_functionality()
    else:
        print("\nFailed to create test teams")
