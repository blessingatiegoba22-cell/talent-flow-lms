import Image from "next/image";
import {
  MessageCircle,
  Paperclip,
  Send,
  Smile,
  ThumbsUp,
} from "lucide-react";

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
    <article className="rounded-lg bg-white p-4 shadow-[0_4px_6px_rgba(0,0,0,0.18)] sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[52px_1fr]">
        <div className="relative h-12 w-12 overflow-hidden rounded-full sm:h-14 sm:w-14">
          <Image
            src={post.avatar}
            alt={post.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-5 sm:gap-y-3">
            <h2 className="text-[18px] font-medium text-black sm:text-[21px]">
              {post.name}
            </h2>
            <span className="rounded-sm bg-[#f1f4ff] px-3 py-1.5 text-[13px] font-medium text-(--brand-blue-600) sm:px-4 sm:py-2 sm:text-[15px]">
              {post.badge}
            </span>
            <span className="text-[13px] font-medium text-black sm:text-[16px]">
              {post.time}
            </span>
          </div>
          <p className="mt-4 max-w-160 text-[14px] font-medium leading-[1.5] text-[#303030] sm:mt-6 sm:text-[17px]">
            {post.text}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-[14px] font-medium text-[#2f2f2f] sm:mt-7 sm:gap-6 sm:text-[17px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fafafa] px-4 py-2 sm:px-5">
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
    <aside className="rounded-lg border border-[#d3d3d3] bg-white px-4 py-5 sm:px-5 lg:min-h-[calc(100vh-70px)] lg:rounded-none lg:border-y-0 lg:border-r-0 lg:py-0 lg:pb-8">
      <h2 className="text-[24px] font-extrabold leading-tight text-black sm:text-[30px]">
        Participants
      </h2>
      <p className="mt-4 text-[14px] font-medium text-[#8b8b8b]">
        5 online - 8 total
      </p>
      <input
        type="search"
        placeholder="Search members..."
        className="mt-6 h-12 w-full rounded-md border border-[#bfbfbf] bg-[#f7f7f7] px-4 text-[14px] font-semibold outline-none transition-all duration-300 ease-in-out placeholder:text-[#999] focus:border-(--brand-blue-400) focus:ring-4 focus:ring-[rgba(37,99,235,0.12)] sm:mt-9 sm:h-14 sm:px-5 sm:text-[16px]"
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:block lg:space-y-7">
        {participants.map((participant, index) => (
          <div
            key={`${participant.name}-${index}`}
            className="flex items-center gap-4"
          >
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
    <div className="rounded-lg bg-[#f7f7f7] p-4 sm:p-7">
      <textarea
        placeholder="Type your message here..."
        className="min-h-24 w-full resize-none bg-transparent text-[14px] font-medium outline-none placeholder:text-[#9a9a9a] sm:min-h-[110px] sm:text-[17px]"
      />
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Smile className="h-5 w-5" aria-hidden="true" />
          <Paperclip className="h-5 w-5" aria-hidden="true" />
        </div>
        <button
          type="button"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg bg-(--brand-blue-500) text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-(--brand-blue-400)"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
