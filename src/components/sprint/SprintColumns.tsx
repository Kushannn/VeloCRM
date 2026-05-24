"use client";

import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SprintTaskCard from "./SprintTasksCard";
import { TaskType } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";

interface SprintColumnsProps {
  id: string;
  title: string;
  tasks: TaskType[];
}

export default function SprintColumns({
  id,
  title,
  tasks,
}: SprintColumnsProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col w-full sm:w-104 lg:w-120
        min-h-75 sm:min-h-120
        rounded-xl
        bg-linear-to-b from-[#151519] to-[#1f1d22]
        p-5
        shadow-lg border border-neutral-800
        text-neutral-100
        select-none
        overflow-visible
        sm:shrink-0
      `}
    >
      <h2 className="mb-5 text-lg font-semibold tracking-wide text-neutral-200">
        {title}
      </h2>
      <SortableContext
        id={id}
        items={tasks?.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col space-y-3 overflow-visible">
          {tasks.map((task) => (
            <SprintTaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 ? (
            <>
              <div className="text-white">No tasks available!</div>
            </>
          ) : (
            ""
          )}
        </div>
      </SortableContext>
    </div>
  );
}
