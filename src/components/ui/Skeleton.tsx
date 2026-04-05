import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-terminal-surface/60",
        className
      )}
    />
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Terminal window skeleton */}
        <div className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 bg-terminal-bg border-b border-terminal-border">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]/40 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]/40 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]/40 animate-pulse" />
          </div>
          <div className="p-6 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        {/* Name skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        </div>
      </div>
    </section>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-surface p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-4 h-4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-56" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkillsSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, branchIdx) => (
            <div key={branchIdx} className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-28 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 bg-terminal-bg border-b border-terminal-border">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="w-3 h-3 rounded-full" />
          </div>
          <div className="p-6 space-y-5">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExperienceSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex flex-col items-center">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-0.5 h-24 mt-2" />
              </div>
              <div className="flex-1 space-y-3 pb-8">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
