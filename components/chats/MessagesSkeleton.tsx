"use client";

import { cn } from "@/lib/utils";

interface MessageSkeletonProps {
  isOwn?: boolean;
}

const MessageSkeleton = ({ isOwn = false }: MessageSkeletonProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[80%] w-fit animate-pulse",
        isOwn ? "ml-auto" : "mr-auto"
      )}
    >
      <div className="flex items-end gap-2">
        {!isOwn && (
          <div className="w-8 h-8 rounded-full bg-accent/50 animate-pulse" />
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2 space-y-2",
            isOwn ? "bg-primary/20 rounded-br-sm" : "bg-accent/50 rounded-bl-sm"
          )}
        >
          {!isOwn && (
            <div className="h-4 bg-gradient-to-r from-violet-400/30 to-fuchsia-400/30 rounded animate-pulse w-20" />
          )}

          <div className="space-y-2">
            <div
              className={cn(
                "h-4 rounded animate-pulse",
                isOwn ? "bg-primary-foreground/30" : "bg-accent-foreground/30",
                "w-32"
              )}
            />
            <div
              className={cn(
                "h-4 rounded animate-pulse",
                isOwn ? "bg-primary-foreground/30" : "bg-accent-foreground/30",
                "w-24"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface MessagesSkeletonProps {
  count?: number;
}

const MessagesSkeleton = ({ count = 10 }: MessagesSkeletonProps) => {
  const messagePattern = [
    { isOwn: false },
    { isOwn: false },
    { isOwn: true },
    { isOwn: false },
    { isOwn: true },
    { isOwn: true },
    { isOwn: false },
    { isOwn: true },
  ];
  return (
    <div className="space-y-4 p-4 w-full">
      <div className="flex flex-col items-center gap-2 my-8 px-4">
        <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
        <div className="relative max-w-md mx-auto">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
            <div className="h-4 bg-primary/30 rounded animate-pulse w-48 mx-auto mb-2" />
            <div className="h-3 bg-primary/20 rounded animate-pulse w-16 mx-auto" />
          </div>
        </div>
      </div>

      {Array.from({ length: count }).map((_, index) => {
        const pattern = messagePattern[index % messagePattern.length];

        return (
          <div key={index} className="space-y-2">
            <MessageSkeleton isOwn={pattern.isOwn} />
          </div>
        );
      })}
    </div>
  );
};

export default MessagesSkeleton;
