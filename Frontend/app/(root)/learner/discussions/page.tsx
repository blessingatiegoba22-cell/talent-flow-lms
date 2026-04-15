import type { Metadata } from "next";

import {
  DiscussionPostCard,
  MessageComposer,
  ParticipantsPanel,
} from "@/components/dashboard/learner-discussion-widgets";
import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import { discussionParticipants, discussionPosts } from "@/data/dashboard";

export const metadata: Metadata = {
  title: "Discussions",
  description:
    "Join learner discussions, view participants, and share updates on Talent Flow LMS.",
};

export default function LearnerDiscussionsPage() {
  return (
    <div className="mx-auto grid max-w-280 gap-6 animate-fade-up lg:grid-cols-[minmax(0,1fr)_382px] lg:gap-8">
      <section>
        <DashboardPageHeader
          title="Discussion"
          description="Team discussions and updates"
        />

        <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8 lg:mt-14">
          {discussionPosts.map((post) => (
            <DiscussionPostCard key={`${post.name}-${post.time}`} post={post} />
          ))}
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-16">
          <MessageComposer />
        </div>
      </section>

      <ParticipantsPanel participants={discussionParticipants} />
    </div>
  );
}
