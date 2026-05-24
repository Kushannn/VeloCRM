"use client";

import { FeedItem } from "@/lib/types";
import { getFeedIcon, getFeedMessage } from "@/lib/utils/convertFeedMessages";
import { Card } from "@heroui/react";

export default function RecentActivityCard({ feed }: { feed: FeedItem[] }) {
  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-full h-full">
      <Card.Header>
        <Card.Title className="text-[#7c6fa0] text-xs font-semibold uppercase tracking-wide">
          Recent Activity
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="space-y-5">
          {feed.map((item, i) => {
            const Icon = getFeedIcon(item);
            return (
              <div key={i}>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#2d1d5e] flex items-center justify-center text-[#c4a8f5] text-xs font-medium shrink-0">
                    {item.user?.name?.[0] ?? "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-md font-medium text-[#e8e4f0]">
                      {getFeedMessage(item)}
                    </p>
                    <p className="text-sm text-[#7c6fa0] mt-0.5">
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

                  {/* icon */}
                  <div className="h-7 w-7 flex justify-center items-center bg-[#2d1d5e] rounded-lg">
                    <Icon className="h-4 w-4 text-[#ede8fb]" />
                  </div>
                </div>

                <div className="w-full border-t border-zinc-600 mt-2"></div>
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
}
