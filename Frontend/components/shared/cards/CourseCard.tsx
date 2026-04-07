import { Course } from "@/types/course";
import React from "react";
import Image from "next/image";
import ActionButton from "../buttons/ActionButton";
import { FolderEdit } from "lucide-react";

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <div className="bg-card p-4 border border-border shadow-sm hover:shadow-md transition-shadow rounded-[4px]">
      <div className="relative h-32 w-full overflow-hidden mb-4 bg-neutral-400">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-400" />
        {course.image && (
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 bg-neutral-300 h-1.5 rounded-full mr-4">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className="text-xs text-ink-200 font-medium">
            {course.progress}%
          </span>
        </div>

        <div className="min-h-[50px]">
          <h3 className="font-bold text-foreground text-md line-clamp-2 leading-tight">
            {course.title}
          </h3>
          <p className="text-sm text-ink-200 mt-1">
            {course.lesson}. {course.duration}
          </p>
        </div>

        <ActionButton 
          icon={FolderEdit} 
          label={course.primaryAction ? "Manage Course" : "Manage Courses"} 
          variant={course.primaryAction ? "primary" : "outline"} 
        />
      </div>
    </div>
  );
};

export default CourseCard;