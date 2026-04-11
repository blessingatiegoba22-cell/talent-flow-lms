import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Paperclip,
  Play,
  Send,
  Smile,
  Star,
  ThumbsUp,
  UsersRound,
} from "lucide-react";

import { ProgressOverview } from "@/components/dashboard/dashboard-widgets";
import { assignmentProgress } from "@/data/dashboard";
import { cn } from "@/lib/utils";

type LearnerCourse = {
  author?: string;
  cta: string;
  image: string;
  meta: string;
  progress: number;
  rating?: string;
  title: string;
};

type CourseSectionProps = {
  courses: LearnerCourse[];
  title: string;
};

export function CatalogCourseSection({ courses, title }: CourseSectionProps) {
  return (
    <section className="mt-9">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[25px] font-extrabold leading-tight text-black">{title}</h2>
        <Link
          href="#"
          className="cursor-pointer text-[16px] font-extrabold text-[var(--brand-blue-700)] transition-colors duration-300 ease-in-out hover:text-[var(--brand-blue-500)]"
        >
          See all
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => (
          <CatalogCourseCard key={`${title}-${course.title}`} course={course} />
        ))}
      </div>
    </section>
  );
}

function CatalogCourseCard({ course }: { course: LearnerCourse }) {
  return (
    <article className="bg-[#f4f4f4] p-4 shadow-[0_4px_7px_rgba(0,0,0,0.18)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(0,0,0,0.13)]">
      <div className="relative h-[148px] overflow-hidden bg-[#e8e8e8]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </div>
      <h3 className="mt-2 truncate text-[18px] font-extrabold leading-tight text-black">
        {course.title}
      </h3>
      <p className="mt-3 text-[15px] font-medium text-[#111]">{course.author}</p>
      <div className="mt-5 flex items-center gap-2 text-[15px] font-medium text-black">
        <Star className="h-5 w-5 fill-[#f7c42c] text-[#f7c42c]" aria-hidden="true" />
        <span>{course.rating}</span>
        <span>.</span>
        <span>{course.meta}</span>
      </div>
      <button
        type="button"
        className="mx-auto mt-7 flex h-[56px] w-full max-w-[188px] cursor-pointer items-center justify-center rounded-[5px] bg-[var(--brand-blue-500)] text-[16px] font-extrabold text-white shadow-[0_14px_24px_rgba(37,99,235,0.24)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-400)]"
      >
        {course.cta}
      </button>
    </article>
  );
}

type FilterBarProps = {
  filters: string[];
};

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <div className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-4 border border-[#c7c7c7] px-4 py-5">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className="inline-flex cursor-pointer items-center gap-3 text-[18px] font-extrabold text-black transition-colors duration-300 ease-in-out hover:text-[var(--brand-blue-500)]"
        >
          {filter}
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

type LearningCourseSectionProps = {
  courses: LearnerCourse[];
  title: string;
};

export function LearningCourseSection({
  courses,
  title,
}: LearningCourseSectionProps) {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-[25px] font-extrabold leading-tight text-black">
        {title}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {courses.map((course, index) => (
          <LearningCourseCard
            key={`${title}-${course.title}`}
            course={course}
            primary={index === 0 && course.cta === "Continue"}
          />
        ))}
      </div>
    </section>
  );
}

function LearningCourseCard({
  course,
  primary,
}: {
  course: LearnerCourse;
  primary?: boolean;
}) {
  return (
    <article className="bg-[#f4f4f4] p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.12)]">
      <div className="relative h-[105px] overflow-hidden bg-[#e8e8e8]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      <ProgressLine className="mt-4" progress={course.progress} />
      <h3 className="mt-5 text-[18px] font-extrabold leading-tight text-black">
        {course.title}
      </h3>
      <p className="mt-3 text-[15px] font-medium text-[#777]">{course.meta}</p>
      <button
        type="button"
        className={cn(
          "mx-auto mt-5 flex h-[54px] w-full max-w-[188px] cursor-pointer items-center justify-center gap-3 rounded-[5px] border text-[16px] font-extrabold transition-all duration-300 ease-in-out hover:-translate-y-0.5",
          primary
            ? "border-[var(--brand-blue-500)] bg-[var(--brand-blue-500)] text-white shadow-[0_14px_24px_rgba(37,99,235,0.25)] hover:bg-[var(--brand-blue-400)]"
            : "border-[#757575] bg-transparent text-[#4c4c4c] hover:border-[var(--brand-blue-500)] hover:text-[var(--brand-blue-500)]",
        )}
      >
        <Play className="h-5 w-5" aria-hidden="true" />
        {course.cta}
      </button>
    </article>
  );
}

type TeamCardData = {
  accent: string;
  members: string;
  name: string;
  skills: readonly string[];
};

export function TeamCard({ team }: { team: TeamCardData }) {
  const avatars = ["/user-icon-1.png", "/user-icon-2.png", "/user-icon-3.png", "/user-icon-1.png"];

  return (
    <article className="relative min-w-[320px] rounded-[18px] border border-[#bcbcbc] bg-white p-6 shadow-[0_4px_7px_rgba(0,0,0,0.14)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--brand-blue-300)] hover:shadow-[0_16px_28px_rgba(0,0,0,0.1)]">
      <span
        className="absolute right-6 top-6 h-4 w-4 rounded-full"
        style={{ backgroundColor: team.accent }}
      />
      <h2 className="text-[22px] font-medium text-black">{team.name}</h2>
      <div className="mt-9 flex items-center gap-6">
        <div className="flex -space-x-3">
          {avatars.map((avatar, index) => (
            <span
              key={`${team.name}-${avatar}-${index}`}
              className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-[#f1f1f1]"
            >
              <Image src={avatar} alt="" fill sizes="44px" className="object-cover" />
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[17px] font-medium text-[#333]">
          <UsersRound className="h-5 w-5" aria-hidden="true" />
          {team.members}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {team.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-[5px] bg-[#f7f7f7] px-4 py-3 text-[15px] font-extrabold text-black"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}

type TeamMember = {
  avatar: string;
  name: string;
  role: string;
  skill: string;
};

export function TeamMembersTable({ members }: { members: readonly TeamMember[] }) {
  return (
    <section className="mt-8 max-w-[940px]">
      <h2 className="text-[22px] font-medium text-black">My Team - Team Lima</h2>
      <p className="mt-3 text-[15px] font-medium text-[#8a8a8a]">
        Team members and roles
      </p>
      <div className="mt-7 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#9f9f9f] text-[17px] font-extrabold text-black">
              <th className="pb-5">Intern</th>
              <th className="pb-5">Skill</th>
              <th className="pb-5">Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={`${member.name}-${index}`}
                className="border-b border-[#9f9f9f] text-[16px] text-black"
              >
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[18px] font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="py-4 font-medium">{member.skill}</td>
                <td className="py-4">
                  <span className="rounded-[8px] bg-[#f6f6f6] px-3 py-2 font-medium">
                    {member.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type Assignment = {
  course: string;
  due: string;
  grade?: string;
  posted: string;
  status?: string;
  timeline: string;
  topic: string;
};

export function AssignmentCard({
  assignment,
  completed = false,
}: {
  assignment: Assignment;
  completed?: boolean;
}) {
  const rows = [
    { icon: BookOpen, label: "Course:", value: assignment.course },
    { icon: BookOpen, label: "Timeline:", value: assignment.timeline },
    { icon: UsersRound, label: "Topic:", value: assignment.topic },
    { icon: CalendarDays, label: "Posted:", value: assignment.posted },
    { icon: CalendarDays, label: "Due:", value: assignment.due },
    ...(completed
      ? [
          { icon: CheckCircle2, label: "Status:", value: assignment.status ?? "" },
          { icon: CheckCircle2, label: "Grade:", value: assignment.grade ?? "" },
        ]
      : []),
  ];

  return (
    <article
      className={cn(
        "rounded-[14px] p-3 shadow-[0_5px_8px_rgba(0,0,0,0.16)]",
        completed ? "bg-[#f8f8f8]" : "bg-[#ecf2ff]",
      )}
    >
      <div className="grid gap-1">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="grid gap-1 sm:grid-cols-[170px_1fr]">
            <div className="flex items-center gap-3 bg-white/45 px-3 py-3 text-[18px] font-extrabold text-black">
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </div>
            <div
              className={cn(
                "bg-white/38 px-3 py-3 text-[18px] font-extrabold text-black",
                value === assignment.course || value === assignment.timeline
                  ? "text-[var(--brand-blue-950)]"
                  : "",
              )}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="h-[56px] cursor-pointer rounded-[10px] bg-[var(--brand-blue-700)] text-[16px] font-extrabold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-500)]"
        >
          View
        </button>
        {!completed ? (
          <button
            type="button"
            className="h-[56px] cursor-pointer rounded-[10px] border border-black bg-transparent text-[16px] font-extrabold text-black transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-[var(--brand-blue-500)] hover:text-[var(--brand-blue-500)]"
          >
            Submit
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function AssignmentProgressCard() {
  return (
    <ProgressOverview
      role="learner"
      value={assignmentProgress.value}
      courses={assignmentProgress.total}
      completed={assignmentProgress.completed}
      learningTime={assignmentProgress.pending}
      labels={{
        completed: "Completed",
        courses: "Total Assignment",
        learningTime: "Pending",
      }}
    />
  );
}

type DiscussionPost = {
  avatar: string;
  badge: string;
  likes: string;
  name: string;
  replies: string;
  text: string;
  time: string;
};

export function DiscussionPostCard({ post }: { post: DiscussionPost }) {
  return (
    <article className="rounded-b-[18px] bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.18)]">
      <div className="grid gap-4 sm:grid-cols-[52px_1fr]">
        <div className="relative h-14 w-14 overflow-hidden rounded-full">
          <Image src={post.avatar} alt={post.name} fill sizes="56px" className="object-cover" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <h2 className="text-[21px] font-medium text-black">{post.name}</h2>
            <span className="rounded-[4px] bg-[#f1f4ff] px-4 py-2 text-[15px] font-medium text-[var(--brand-blue-600)]">
              {post.badge}
            </span>
            <span className="text-[16px] font-medium text-black">{post.time}</span>
          </div>
          <p className="mt-6 max-w-[640px] text-[17px] font-medium leading-[1.45] text-[#303030]">
            {post.text}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-6 text-[17px] font-medium text-[#2f2f2f]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fafafa] px-5 py-2">
              <ThumbsUp className="h-5 w-5 text-[#e3a319]" />
              {post.likes}
            </span>
            <span className="inline-flex items-center gap-2">
              <Smile className="h-5 w-5" />
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {post.replies}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

type Participant = {
  avatar: string;
  name: string;
  role: string;
  status: string;
};

export function ParticipantsPanel({
  participants,
}: {
  participants: readonly Participant[];
}) {
  const statusColor = {
    away: "#f0aa12",
    offline: "#9b9b9b",
    online: "#16e01f",
  } as const;

  return (
    <aside className="border-l border-[#d3d3d3] bg-white px-5 pb-8 lg:min-h-[calc(100vh-70px)]">
      <h2 className="text-[30px] font-extrabold leading-tight text-black">
        Participants
      </h2>
      <p className="mt-4 text-[14px] font-medium text-[#8b8b8b]">
        5 online - 8 total
      </p>
      <input
        type="search"
        placeholder="Search members..."
        className="mt-9 h-[56px] w-full rounded-[2px] border border-[#bfbfbf] bg-[#f7f7f7] px-12 text-[16px] font-semibold outline-none transition-all duration-300 ease-in-out placeholder:text-[#999] focus:border-[var(--brand-blue-400)] focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]"
      />
      <div className="mt-5 space-y-7">
        {participants.map((participant, index) => (
          <div key={`${participant.name}-${index}`} className="flex items-center gap-4">
            <div className="relative h-[58px] w-[58px] overflow-hidden rounded-full">
              <Image
                src={participant.avatar}
                alt={participant.name}
                fill
                sizes="58px"
                className="object-cover"
              />
              <span
                className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white"
                style={{
                  backgroundColor:
                    statusColor[participant.status as keyof typeof statusColor],
                }}
              />
            </div>
            <div>
              <p className="max-w-[160px] truncate text-[21px] font-medium text-black">
                {participant.name}
              </p>
              <p className="mt-1 text-[15px] font-medium text-[#777]">
                {participant.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function MessageComposer() {
  return (
    <div className="rounded-[24px] bg-[#f7f7f7] p-7">
      <textarea
        placeholder="Type your message here..."
        className="min-h-[110px] w-full resize-none bg-transparent text-[17px] font-medium outline-none placeholder:text-[#9a9a9a]"
      />
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Smile className="h-5 w-5" aria-hidden="true" />
          <Paperclip className="h-5 w-5" aria-hidden="true" />
        </div>
        <button
          type="button"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[var(--brand-blue-500)] text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--brand-blue-400)]"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function ProgressLine({
  className,
  progress,
}: {
  className?: string;
  progress: number;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-[3px] flex-1 bg-[#d8d8d8]">
        <div
          className="h-full bg-[var(--brand-blue-500)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[16px] font-medium text-[#9b9b9b]">
        {progress.toString().padStart(2, "0")}%
      </span>
    </div>
  );
}
