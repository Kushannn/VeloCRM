"use client";

import { useDroppable } from "@dnd-kit/core";
import { SprintType } from "@/lib/types";
import TaskCard from "./taskCard";

type TaskType = NonNullable<SprintType["tasks"]>[number];

type ColumnType = {
  key: "IN_PROGRESS" | "PENDING" | "COMPLETED";
  label: string;
  tasks: TaskType[];
  dot: string;
  badge: string;
  empty: string;
};

export default function TaskColumns({ col }: { col: ColumnType }) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.key, // MUST match status
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
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
        className={`bg-[#161617] border rounded-xl p-3 flex flex-col gap-3 min-h-75 transition
        ${isOver ? "border-blue-500 bg-[#1d1f24]" : "border-gray-800"} h-full min-h-[150]`}
      >
        {col.tasks.length > 0 ? (
          col.tasks.map((task) => <TaskCard key={task.id} task={task} />)
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
