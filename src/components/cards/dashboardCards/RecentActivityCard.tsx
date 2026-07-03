"use client";

import { FeedItem } from "@/lib/types";
import { getFeedIcon, getFeedMessage } from "@/lib/utils/convertFeedMessages";
import { Card } from "@heroui/react";

export default function RecentActivityCard({
  feed,
}: {
  feed: FeedItem[] | null;
}) {
  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-3 sm:p-5 w-full h-full flex flex-col">
      <Card.Header className="w-full border-b border-[#4d3d7a] pb-3">
        <Card.Title className="text-[#7c6fa0] text-sm sm:text-md font-semibold uppercase tracking-wide">
          Recent Activity
        </Card.Title>
      </Card.Header>

      <Card.Content className="flex-1 min-h-0 overflow-y-auto">
        {feed?.length === 0 || !feed ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-lg sm:text-2xl font-bold text-[#b8aed4]">
              No recent activity!
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {feed!.map((item, i) => {
              const Icon = getFeedIcon(item);

              return (
                <div key={i}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Avatar */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2d1d5e] flex items-center justify-center text-[#c4a8f5] text-xs font-medium shrink-0">
                      {item.user?.name?.[0] ?? "?"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-[#e8e4f0] wrap-break-word">
                        {getFeedMessage(item)}
                      </p>

                      <p className="text-xs sm:text-sm text-[#7c6fa0] mt-1">
                        {new Date(item.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" · "}
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Icon */}
                    <div className="h-6 w-6 sm:h-7 sm:w-7 flex justify-center items-center bg-[#2d1d5e] rounded-lg shrink-0">
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#ede8fb]" />
                    </div>
                  </div>

                  <div className="w-full border-t border-zinc-600 mt-3 sm:mt-4" />
                </div>
              );
            })}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
