"""
Script to create sample courses for testing
"""
import os
import sys

# Add the app directory to Python path
sys.path.append('/app')

from database import SessionLocal
from models.course import Course
from models.user import User

def create_sample_courses():
    """Create sample courses"""
    db = SessionLocal()
    
    try:
        # Get first user as instructor
        instructor = db.query(User).first()
        
        if not instructor:
            print("No users found. Please create a user first.")
            return
        
        sample_courses = [
            {
                "title": "Introduction to Python Programming",
                "description": "Learn the basics of Python programming from scratch",
                "category": "Programming",
                "level": "beginner",
                "duration_hours": 40,
                "price": 9999,  # $99.99 in cents
                "instructor_id": instructor.id,
                "is_published": True
            },
            {
                "title": "Advanced Web Development",
                "description": "Master modern web development with React and Node.js",
                "category": "Web Development",
                "level": "advanced",
                "duration_hours": 60,
                "price": 19999,  # $199.99 in cents
                "instructor_id": instructor.id,
                "is_published": True
            },
            {
                "title": "Database Design Fundamentals",
                "description": "Learn how to design and optimize databases",
                "category": "Database",
                "level": "intermediate",
                "duration_hours": 30,
                "price": 14999,  # $149.99 in cents
                "instructor_id": instructor.id,
                "is_published": True
            }
        ]
        
        for course_data in sample_courses:
            # Check if course already exists
            existing = db.query(Course).filter(Course.title == course_data["title"]).first()
            if existing:
                print(f"Course '{course_data['title']}' already exists")
                continue
            
            course = Course(**course_data)
            db.add(course)
            print(f"Created course: {course.title}")
        
        db.commit()
        print("Sample courses created successfully!")
        
    except Exception as e:
        print(f"Error creating courses: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_courses()
