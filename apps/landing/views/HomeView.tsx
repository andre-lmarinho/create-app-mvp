import { appUrl } from "@repo/lib/urls";

export function HomeView() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-primary-600">App</p>
      <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
        A starting point for your next app.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        A Turborepo bootstrap with two Next.js apps, tRPC, Prisma, and Better Auth. Replace this copy with
        your own.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={appUrl()}
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary-700 px-6 text-sm font-semibold text-white transition hover:bg-primary-800">
          Open app
        </a>
        <a
          href={appUrl("/signup")}
          className="inline-flex h-12 items-center justify-center rounded-md border border-neutral-gray bg-card px-6 text-sm font-semibold text-foreground transition hover:border-primary-300">
          Sign up
        </a>
      </div>
    </section>
  );
}
