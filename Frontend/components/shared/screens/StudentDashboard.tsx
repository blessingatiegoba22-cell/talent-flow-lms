import { CONTINUE_LEARNING, ENROLLED_COURSES } from "@/constants/dashboard";
import { ChevronRight } from "lucide-react";
import CourseCard from "../cards/CourseCard";
import EnrolledCourseItem from "../tiles/EnrolledCourseItem";
import ProgressOverview from "../cards/ProgressOverview";
import QuickActions from "../cards/QuickActions";

const StudentDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 bg-background min-h-screen">
      <header className="mb-10">
        <h1 className="text-display-xs font-bold text-foreground">Welcome back, Samuel!</h1>
        <p className="text-ink-500 mt-2">Ready to continue your learning journey? Lets keep the momentum going.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Continue Learning</h2>
              <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline hover:cursor-pointer">
                View All My Courses <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONTINUE_LEARNING.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Enrolled Courses</h2>
              <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline hover:cursor-pointer">
                Browse Catalog <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {ENROLLED_COURSES.map((course) => (
                <EnrolledCourseItem key={course.id} course={course} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <ProgressOverview />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;    