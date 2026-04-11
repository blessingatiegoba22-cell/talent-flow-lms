import Image from "next/image";

export function LoadingScreen() {
  return (
    <main className="min-h-screen bg-white text-[#050505]">
      <div className="grid min-h-screen lg:grid-cols-[220px_1fr] xl:grid-cols-[274px_1fr]">
        <aside className="hidden bg-[var(--brand-blue-950)] px-5 py-7 lg:block">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Talent Flow icon"
              width={50}
              height={48}
              priority
              className="h-11 w-auto"
            />
            <Image
              src="/logo-text.png"
              alt="TalentFlow"
              width={177}
              height={48}
              priority
              className="h-8 w-auto"
            />
          </div>

          <div className="mt-12 space-y-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-[5px] bg-white/10"
              />
            ))}
          </div>
        </aside>

        <section className="flex min-h-screen flex-col">
          <div className="flex h-[70px] items-center justify-between border-b border-black/5 bg-[#f7f7f7] px-5">
            <div className="h-11 w-full max-w-[486px] animate-pulse rounded-[2px] bg-black/8" />
            <div className="ml-4 flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-black/8" />
              <div className="h-11 w-11 animate-pulse rounded-full bg-black/8" />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-12">
            <div className="w-full max-w-[560px] text-center">
              <div className="relative mx-auto h-16 w-16">
                <span className="absolute inset-0 rounded-full border-4 border-[var(--brand-blue-100)]" />
                <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[var(--brand-blue-500)]" />
                <Image
                  src="/logo.png"
                  alt=""
                  width={50}
                  height={48}
                  className="absolute left-1/2 top-1/2 h-8 w-auto -translate-x-1/2 -translate-y-1/2"
                />
              </div>

              <h1 className="mt-6 text-[24px] font-extrabold leading-tight text-black">
                Loading your workspace
              </h1>
              <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#6b6b6b]">
                Preparing your courses, teams, assignments, and conversations.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-[10px] bg-[#f3f3f3]"
                    style={{ animationDelay: `${index * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
