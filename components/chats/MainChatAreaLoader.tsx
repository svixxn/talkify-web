import React from "react";
import { Skeleton } from "../ui/skeleton";

const MainChatAreaLoader = () => {
  return (
    <div className="flex flex-col items-center w-full gap-y-2">
      <div className="flex flex-row gap-x-2">
        <Skeleton className="h-4 w-4 rounded-xl" />
        <Skeleton className="h-4 w-4 rounded-xl" />
        <Skeleton className="h-4 w-4 rounded-xl" />
      </div>
      <div className="flex flex-row gap-x-2">
        <Skeleton className="h-4 w-4 rounded-xl" />
        <Skeleton className="h-4 w-4 rounded-xl" />
        <Skeleton className="h-4 w-4 rounded-xl" />
      </div>
      <div className="flex flex-row gap-x-2">
        <Skeleton className="h-4 w-4 rounded-xl" />
        <Skeleton className="h-4 w-4 rounded-xl" />
        <Skeleton className="h-4 w-4 rounded-xl" />
      </div>
    </div>
  );
};

export default MainChatAreaLoader;
