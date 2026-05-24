export function formatDueDate(dueDate: Date | null | string): {
  label: string;
  color: string;
} {
  if (!dueDate) return { label: "No due date", color: "#7c6fa0" };

  const due = new Date(dueDate);
  const now = new Date();

  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.ceil(
    (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff < 0) return { label: "Overdue", color: "#f87171" };
  if (diff === 0) return { label: "Today", color: "#f87171" };
  if (diff === 1) return { label: "Tomorrow", color: "#fb923c" };

  return {
    label: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    color: "#ede8fb",
  };
}
