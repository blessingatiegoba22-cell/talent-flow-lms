import { OptimizedImage as Image } from "@/components/shared/optimized-image";

import { DashboardPageHeader } from "@/components/dashboard/page-heading";
import type {
  DashboardNotification,
  DashboardNotificationSection,
  NotificationTone,
} from "@/data/dashboard";
import { cn } from "@/lib/utils";

type DashboardNotificationPageProps = {
  sections: readonly DashboardNotificationSection[];
};

const iconToneClassName: Record<NotificationTone, string> = {
  blue: "bg-[#0a4a86] text-[#042d5b]",
  brown: "bg-[#9a682d] text-[#f5d9a7]",
  softBlue: "bg-[#d9e9ff] text-[#7891b6]",
};

export function DashboardNotificationPage({
  sections,
}: DashboardNotificationPageProps) {
  return (
    <div className="mx-auto w-full max-w-[980px] animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Notification"
          titleClassName="text-[24px] sm:text-[28px]"
        />

        <button
          type="button"
          className="inline-flex h-11 w-fit cursor-pointer items-center justify-center rounded-[5px] bg-(--brand-blue-950) px-6 text-[13px] font-extrabold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-(--brand-blue-800) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(37,99,235,0.18)] sm:px-8"
        >
          Mark all as read
        </button>
      </div>

      <div className="mt-8 space-y-10 sm:mt-9 sm:space-y-12">
        {sections.map((section) => (
          <NotificationGroup key={section.label} section={section} />
        ))}
      </div>
    </div>
  );
}

function NotificationGroup({
  section,
}: {
  section: DashboardNotificationSection;
}) {
  const sectionId = `notification-section-${section.label
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
  const hasMutedItems = section.notifications.some(
    (notification) => notification.surface === "muted",
  );

  return (
    <section aria-labelledby={sectionId}>
      <div className="flex items-center gap-3">
        <h2
          id={sectionId}
          className="shrink-0 text-[11px] font-extrabold uppercase leading-none text-[#555]"
        >
          {section.label}
        </h2>
        <span className="h-px flex-1 bg-[#ededed]" aria-hidden="true" />
      </div>

      <div
        className={cn(
          "mt-5",
          hasMutedItems ? "space-y-4" : "space-y-8 sm:space-y-11",
        )}
      >
        {section.notifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </section>
  );
}

function NotificationRow({
  notification,
}: {
  notification: DashboardNotification;
}) {
  const isMuted = notification.surface === "muted";

  return (
    <article
      className={cn(
        "grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-[5px] sm:grid-cols-[40px_minmax(0,1fr)_86px_10px] sm:items-start",
        isMuted
          ? "bg-[#f7f7f7] px-4 py-5 sm:px-5 sm:py-6"
          : "px-0 py-2 sm:px-4",
      )}
    >
      <NotificationMedia notification={notification} />

      <div className="min-w-0">
        <div className="flex min-w-0 items-start justify-between gap-3 sm:block">
          <h3 className="min-w-0 text-[15px] font-extrabold leading-snug text-[#303030] sm:text-[16px]">
            {notification.title}
          </h3>

          <div className="flex shrink-0 items-center gap-2 pt-0.5 sm:hidden">
            <time className="text-[11px] font-medium text-[#8a8a8a]">
              {notification.time}
            </time>
            {notification.unread ? (
              <span
                className="h-2 w-2 rounded-full bg-[#003e7a]"
                aria-label="Unread notification"
              />
            ) : null}
          </div>
        </div>

        <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#676b73] sm:text-[14px]">
          {notification.message}
        </p>
      </div>

      <time className="hidden pt-1 text-right text-[11px] font-medium text-[#8a8a8a] sm:block">
        {notification.time}
      </time>

      <span
        className={cn(
          "hidden h-2 w-2 rounded-full bg-[#003e7a] sm:mt-1.5 sm:block",
          !notification.unread && "opacity-0",
        )}
        aria-label={notification.unread ? "Unread notification" : undefined}
        aria-hidden={!notification.unread}
      />
    </article>
  );
}

function NotificationMedia({
  notification,
}: {
  notification: DashboardNotification;
}) {
  const { media } = notification;

  if (media.kind === "image") {
    return (
      <span className="relative h-10 w-10 overflow-hidden rounded-[5px] bg-[#e8e8e8]">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="40px"
          className="object-cover"
        />
      </span>
    );
  }

  const Icon = media.icon;

  return (
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-[8px]",
        iconToneClassName[media.tone],
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
  );
}
