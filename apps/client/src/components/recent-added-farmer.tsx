import { Farmer } from "@/types/farmer.type";
import { memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  farmers?: Farmer[];
}

export function RecentAddedFarmer({ farmers }: Props) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-8 ">
        {farmers?.map((farmer) => (
          <div key={farmer._id} className="flex items-center">
            <div className="ml-4 space-y-1 capitalize">
              <p className="text-sm font-medium leading-none">
                {farmer.fullName}
              </p>
              <p className="text-sm text-muted-foreground">
                {farmer.fullAddress}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export const MemoizedRecentAddedFarmer = memo(RecentAddedFarmer);
