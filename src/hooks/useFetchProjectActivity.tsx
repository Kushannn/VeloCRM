import { useState, useEffect } from "react";

export function useFetchProjectActivity(projectId?: string) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = async (cursor?: string) => {
    setLoading(true);
    const url = `/api/project/${projectId}/activity${cursor ? `?cursor=${cursor}` : ""}`;
    const res = await fetch(url);
    const data = await res.json();

    setItems((prev) => (cursor ? [...prev, ...data.items] : data.items));
    setCursor(data.nextCursor);
    setHasMore(!!data.nextCursor);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [projectId]);

  return {
    items,
    loading,
    hasMore,
    loadMore: () => cursor && fetchLogs(cursor),
  };
}
