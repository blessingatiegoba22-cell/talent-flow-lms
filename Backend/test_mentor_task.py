#!/usr/bin/env python3
"""
Test script to demonstrate mentor task creation
"""
import os
import sys
import psycopg2

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Password123!@localhost:5432/talent_flow_db")

def create_mentor_task():
    """Create a task for mentor"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Create a task
        cursor.execute("""
            INSERT INTO tasks (
                title, description, instructions, task_type, mentor_id, course_id, 
                max_score, due_date, estimated_hours, allow_file_submission, 
                max_file_size_mb, allowed_file_types, created_at, updated_at
            ) VALUES (
                'JavaScript ES6+ Assignment',
                'Implement modern JavaScript features and async patterns',
                'Create a JavaScript application that demonstrates ES6+ features including arrow functions, destructuring, promises, async/await, and modules. Include proper error handling and modern best practices.',
                'assignment',
                2,
                4,
                100,
                '2026-04-30T23:59:59',
                5,
                true,
                15,
                'js,html,css,pdf,zip',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            RETURNING id;
        """)
        
        task_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"Task created successfully with ID: {task_id}")
        return task_id
        
    except Exception as e:
        print(f"Error creating task: {e}")
        return None

def show_workflow_results():
    """Show the complete workflow results"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                c.id as course_id, 
                c.title as course_title,
                c.status as course_status,
                c.created_at as course_created,
                t.id as task_id,
                t.title as task_title,
                t.task_type,
                t.max_score,
                t.mentor_id,
                u.name as mentor_name,
                t.created_at as task_created
            FROM admin_courses c 
            LEFT JOIN tasks t ON c.id = t.course_id
            LEFT JOIN mentors m ON t.mentor_id = m.id
            LEFT JOIN users u ON m.user_id = u.id
            ORDER BY c.created_at DESC, t.created_at DESC
        """)
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        print("\nComplete Workflow Results:")
        print("=" * 80)
        print(f"{'Course ID':<10} {'Course Title':<30} {'Status':<10} {'Task ID':<8} {'Task Title':<30}")
        print("-" * 80)
        
        for row in results:
            course_id, course_title, course_status, course_created, task_id, task_title, task_type, max_score, mentor_id, mentor_name, task_created = row
            print(f"{course_id:<10} {course_title[:28]:<30} {course_status:<10} {task_id or 'N/A':<8} {(task_title or 'N/A')[:28]:<30}")
        
        print(f"\nTotal courses: {len([r for r in results if r[0]])}")
        print(f"Total tasks: {len([r for r in results if r[4]])}")
        
    except Exception as e:
        print(f"Error showing results: {e}")

if __name__ == "__main__":
    print("Creating mentor task...")
    task_id = create_mentor_task()
    
    if task_id:
        print(f"\nTask {task_id} created successfully!")
        show_workflow_results()
    else:
        print("\nFailed to create task")
