import Image from "next/image";
import { FeedItem } from "@/lib/types";
import { useFetchProjectActivity } from "@/hooks/useFetchProjectActivity";
import { Activity } from "lucide-react";
import { getFeedIcon, getFeedMessage } from "@/lib/utils/convertFeedMessages";
import { STATUS_COLORS } from "@/lib/utils/formatActivityMessages";
import { usePusherChannel } from "@/hooks/pusher/usePusherChannel";
import { activityLogToFeedItem } from "@/lib/utils/activityLogsToFeedItem";

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function groupByDate(items: FeedItem[]) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return items.reduce(
    (acc, item) => {
      const d = new Date(item.createdAt).toDateString();
      const label =
        d === today ? "Today" : d === yesterday ? "Yesterday" : "Older";
      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    },
    {} as Record<string, FeedItem[]>,
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-md font-medium ${STATUS_COLORS[status] ?? "bg-slate-500/10 text-slate-400"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex flex-col divide-y divide-white/5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="w-7 h-7 rounded-lg bg-white/5 animate-pulse shrink-0" />
          <div className="flex-1 h-3.5 rounded-md bg-white/5 animate-pulse" />
          <div className="w-12 h-3 rounded-md bg-white/5 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function ProjectActivityLogs({
  projectId,
  refreshKey,
}: {
  projectId?: string;
  refreshKey: number;
  userId: string;
}) {
  const { items, loading, loadMore, hasMore, setItems } =
    useFetchProjectActivity(projectId, refreshKey);

  usePusherChannel<{ log: Parameters<typeof activityLogToFeedItem>[0] }>(
    projectId ? `project-${projectId}` : null,
    "activity:new",
    (data) => {
      const feedItem = activityLogToFeedItem(data.log);
      if (feedItem) setItems((prev) => [feedItem, ...prev]);
    },
  );

  return (
    <div className="h-180 rounded-xl border border-white/8 bg-[#110f1a] overflow-y-auto">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1f1f1f]">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Activity size={15} className="text-violet-400" />
        </div>
        <h2 className="text-base font-semibold text-white">Recent Activity</h2>
      </div>

      {loading && !items.length ? (
        <ActivitySkeleton />
      ) : !items.length ? (
        <p className="text-sm text-white/30 text-center py-10">
          No activity yet
        </p>
      ) : (
        <div className="flex flex-col">
          {Object.entries(groupByDate(items)).map(([label, logs]) => (
            <div key={label}>
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[11px] text-white/30 font-medium tracking-wide uppercase">
                  {label}
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              {logs.map((item, i) => {
                const Icon = getFeedIcon(item);
                return (
                  <div
                    key={`${item.kind}-${item.createdAt}-${i}`}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/3 transition-colors"
                  >
                    <span className="mt-0.5 p-2.5 rounded-lg shrink-0 bg-white/5">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#e8e4f0] leading-snug">
                        {getFeedMessage(item)}
                      </p>
                      {item.kind === "task" && item.transition && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <StatusBadge status={item.transition.from} />
                          <span className="text-white/20 text-xs">→</span>
                          <StatusBadge status={item.transition.to} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.user?.image && (
                        <Image
                          src={item.user.image}
                          alt={item.user.name ?? ""}
                          width={18}
                          height={18}
                          className="rounded-full opacity-80"
                        />
                      )}
                      <span className="text-xs text-white/30">
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full py-3 text-xs text-white/30 hover:text-white/50 transition-colors border-t border-white/5 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
