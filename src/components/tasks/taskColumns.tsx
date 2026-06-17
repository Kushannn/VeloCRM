"use client";

import { useDroppable } from "@dnd-kit/core";
import { SprintType, TaskType } from "@/lib/types";
import TaskCard from "./taskCard";

type TaskTypeLocal = NonNullable<SprintType["tasks"]>[number];

type ColumnType = {
  key: "IN_PROGRESS" | "PENDING" | "COMPLETED";
  label: string;
  tasks: TaskTypeLocal[];
  dot: string;
  badge: string;
  empty: string;
};

export default function TaskColumns({
  col,
  onTaskClick,
}: {
  col: ColumnType;
  onTaskClick: (task: TaskType) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.key,
  });

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-1 md:pt-0 min-h-0">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${col.dot} animate-pulse`} />
          <span className="text-md font-semibold text-gray-200">
            {col.label}
          </span>
        </div>

        <span
          className={`text-sm font-semibold px-2 py-0.5 rounded-full ${col.badge}`}
        >
          {col.tasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1
          min-h-0
      overflow-y-auto
        bg-[#0e0c17]
          border
          rounded-xl
          p-3
          flex
          flex-col
          gap-3
          transition
          ${isOver ? "border-[#3d2d6b] bg-[#1a1232]" : "border-gray-800"}`}
      >
        {col.tasks.length > 0 ? (
          col.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-xs italic text-center">
              {col.empty}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
