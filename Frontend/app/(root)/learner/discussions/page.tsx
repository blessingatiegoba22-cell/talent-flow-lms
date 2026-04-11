import type { Metadata } from "next";

import {
  DiscussionPostCard,
  MessageComposer,
  ParticipantsPanel,
} from "@/components/dashboard/learner-widgets";
import { discussionParticipants, discussionPosts } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Discussions",
  description:
    "Join learner discussions, view participants, and share updates on Talent Flow LMS.",
};

export default function LearnerDiscussionsPage() {
  return (
    <div className="mx-auto grid max-w-[1120px] gap-8 animate-fade-up lg:grid-cols-[minmax(0,1fr)_382px]">
      <section>
        <h1 className="text-[32px] font-extrabold leading-tight text-black sm:text-[36px]">
          Discussion
        </h1>
        <p className="mt-4 text-[15px] font-medium text-[#8a8a8a]">
          Team discussions and updates
        </p>

        <div className="mt-14 space-y-14">
          {discussionPosts.map((post) => (
            <DiscussionPostCard key={`${post.name}-${post.time}`} post={post} />
          ))}
        </div>

        <div className="mt-32 lg:mt-36">
          <MessageComposer />
        </div>
      </section>

      <ParticipantsPanel participants={discussionParticipants} />
    </div>
  );
}
