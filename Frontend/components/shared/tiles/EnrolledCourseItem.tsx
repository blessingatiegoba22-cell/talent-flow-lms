import { Course } from "@/types/course";
import Image from "next/image";

const EnrolledCourseItem = ({ course }: { course: Course }) => {
  return (
    <div
      className="flex items-center gap-4 bg-card p-4 rounded-[4px] border border-border shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-40 h-16 bg-neutral-200 flex-shrink-0 relative overflow-hidden">
        {course.image && (
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="160px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1">
        <h4 className="font-bold text-foreground text-md line-clamp-1">
          {course.title}
        </h4>
        <p className="text-xs text-ink-200">By {course.author}</p>
      </div>

      <div className="hidden md:flex items-center gap-3 w-40">
        <div className="flex-1 bg-neutral-300 h-1.5 rounded-full">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <span className="text-xs text-ink-200 font-medium">
          {course.progress}%
        </span>
      </div>
    </div>
  );
};

export default EnrolledCourseItem;