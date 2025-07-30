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
        flex flex-col w-full sm:w-[26rem] lg:w-[30rem]
        min-h-[300px] sm:min-h-[480px]
        rounded-xl
        bg-gradient-to-b from-[#151519] to-[#1f1d22]
        p-5
        shadow-lg border border-neutral-800
        text-neutral-100
        select-none
        overflow-visible
        sm:flex-shrink-0
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
