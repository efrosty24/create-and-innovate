"use client";

type SkeletonProps = {
  className?: string;
  /** Use "shimmer" (default) or "pulse" */
  variant?: "shimmer" | "pulse";
};

/** Base skeleton block; use className for dimensions (e.g. w-32 h-4 rounded) */
export function Skeleton({ className = "", variant = "shimmer" }: SkeletonProps) {
  return (
    <div
      className={`skeleton rounded ${variant === "pulse" ? "skeleton-pulse bg-white/10" : "bg-white/10"} ${className}`}
      aria-hidden
    />
  );
}

/** Single line of text skeleton; height matches typical text */
export function SkeletonText({ className = "", width = "full" }: { className?: string; width?: "full" | "sm" | "md" | "lg" }) {
  const w = width === "full" ? "w-full" : width === "sm" ? "w-1/4" : width === "md" ? "w-1/2" : "w-3/4";
  return <Skeleton className={`h-4 ${w} ${className}`} />;
}

/** Multi-line text block */
export function SkeletonParagraph({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 && lines > 1 ? "w-4/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/** Circle avatar skeleton */
export function SkeletonAvatar({ className = "" }: { className?: string }) {
  return <Skeleton className={`rounded-full aspect-square ${className}`} />;
}

/** Button-shaped skeleton */
export function SkeletonButton({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-10 rounded-full min-w-[100px] ${className}`} />;
}

/** Card / rectangle (e.g. map, image placeholder) */
export function SkeletonRect({ className = "" }: { className?: string }) {
  return <Skeleton className={`rounded-xl ${className}`} />;
}

/** List item row skeleton */
export function SkeletonListItem({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 ${className}`}>
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
