"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import TaskDetailsCard from "../taskDetails/TaskDetailsCard";
import { Modal } from "@heroui/react";

interface SprintTaskCardProps {
  task: TaskType;
}

export default function SprintTaskCard({ task }: SprintTaskCardProps) {
  const [openDetails, setOpenDetails] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  const handleClick = () => {
    console.log("handle click");
    if (!isDragging) setOpenDetails(true);
  };

  useEffect(() => {
    console.log("open Detaiols ", openDetails);
  });

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        tabIndex={0}
        style={style}
        onClick={() => handleClick()}
        className={`
        relative
        cursor-grab rounded-lg border border-[#28223e]/70
        bg-gradient-to-br from-[#201d25] to-[#2a2335]
        shadow-md transition-all duration-200
        px-4 py-4
        w-full
        min-h-[68px] sm:min-h-[80px]
        select-none
        group
        hover:shadow-xl hover:z-40
        `}
      >
        <div>
          <h3
            className="font-semibold text-neutral-50 text-base truncate"
            title={task.title}
          >
            {task.title}
          </h3>
          <p
            className="mt-1 text-sm text-neutral-400 line-clamp-2"
            title={task.description}
          >
            {task.description}
          </p>
        </div>
        <div className="flex justify-end mt-3">
          <span
            className={`
            inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md
            ${
              task.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : task.status === "IN_PROGRESS"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }
            `}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <TaskDetailsCard
        isOpen={openDetails}
        task={task}
        onClose={() => setOpenDetails(false)}
      />
    </>
  );
}
