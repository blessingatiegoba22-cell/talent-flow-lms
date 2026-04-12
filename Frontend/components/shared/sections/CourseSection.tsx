import CatalogCard from "../cards/CatalogCard";
import { Course } from "@/types/course";

export default function CourseSection({ 
  title, 
  courses 
}: { 
  title: string;
  courses: Course[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button className="text-blue-600 text-sm font-medium">
          See all
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {courses.map((course) => (
          <CatalogCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}