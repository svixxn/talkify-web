import { Skeleton } from "../ui/skeleton";

const ChatItemSkeleton = () => {
  return (
    <div className="flex items-center w-full space-x-4">
      <Skeleton className="h-12 w-14 rounded-full" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export default ChatItemSkeleton;
