type LoadingScreenProps = {
  description?: string;
  title?: string;
};

export function LoadingScreen({
  description = "Preparing your courses, teams, assignments, and conversations.",
  title = "Loading your workspace",
}: LoadingScreenProps) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-120px)] w-full max-w-5xl place-items-center px-4 py-10 text-[#050505]">
      <div className="w-full max-w-160 text-center">
        <div className="relative mx-auto h-16 w-16">
          <span className="absolute inset-0 rounded-full border-4 border-(--brand-blue-100)" />
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-(--brand-blue-500)" />
          <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-md bg-(--brand-blue-500)" />
        </div>

        <h1 className="mt-6 text-[24px] font-extrabold leading-tight text-black">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-[460px] text-[14px] font-medium leading-relaxed text-[#6b6b6b]">
          {description}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-lg bg-[#f3f3f3]"
              style={{ animationDelay: `${index * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
