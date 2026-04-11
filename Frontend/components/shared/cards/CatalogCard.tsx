import Image from "next/image";
import { Star } from "lucide-react";
import { Course } from "@/types/course";

export default function CatalogCard({ course }: { course: Course }) {
  return (
    <div className="border border-border rounded-md shadow-sm hover:shadow-md transition p-3">
      
      {/* Image */}
      <div className="relative h-32 w-full mb-3">
        <Image
          src={course.image ?? ""}
          alt={course.title}
          fill
          className="object-cover rounded-sm"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
          {course.title}
        </h3>

        <p className="text-xs text-gray-500">
          By {course.author}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 text-sm">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span>{course.rating}</span>
          <span className="text-gray-400">· {course.duration}</span>
        </div>

        {/* Button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
          Enroll
        </button>
      </div>
    </div>
  );
}