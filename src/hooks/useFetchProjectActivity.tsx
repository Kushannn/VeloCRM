import { useState, useEffect, useCallback } from "react";

export function useFetchProjectActivity(
  projectId?: string,
  refreshKey?: number,
) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = useCallback(
    async (cursor?: string) => {
      setLoading(true);
      const url = `/api/project/${projectId}/activity${cursor ? `?cursor=${cursor}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();

      setItems((prev) => (cursor ? [...prev, ...data.items] : data.items));
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
    loadMore: () => cursor && fetchLogs(cursor),
    refetch: () => fetchLogs(),
  };
}
