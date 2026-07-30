import { FeedItem, UserType } from "@/lib/types";
import { activityLogToFeedItem } from "@/lib/utils/activityLogsToFeedItem";
import { useState, useEffect, useCallback } from "react";

export function useFetchProjectActivity(
  projectId?: string,
  refreshKey?: number,
) {
  const [items, setItems] = useState<FeedItem[]>([]);

  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = useCallback(
    async (cursor?: string) => {
      setLoading(true);
      const url = `/api/project/${projectId}/activity${cursor ? `?cursor=${cursor}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();

      const mapped: FeedItem[] = data.items
        .map(activityLogToFeedItem)
        .filter((item: FeedItem | null): item is FeedItem => item !== null);

      setItems((prev) => (cursor ? [...prev, ...mapped] : mapped));
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
      setLoading(false);
    },
    [projectId],
  );

  useEffect(() => {
    setCursor(null);
    fetchLogs();
  }, [projectId, refreshKey]);

  return {
    items,
    loading,
    hasMore,
    setItems,
    loadMore: () => cursor && fetchLogs(cursor),
    refetch: () => fetchLogs(),
  };
}
