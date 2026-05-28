import { formatDueDate } from "@/lib/utils/formatDatesForDashboardTask";
import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";

const TaskCard = ({
  task,
  onClick,
  isOverlay = false,
}: {
  task: any;
  onClick: () => void;
  isOverlay?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = isOverlay
    ? {
        boxShadow: "0 16px 40px rgba(108, 63, 196, 0.3)", // purple glow on ghost
        cursor: "grabbing",
      }
    : undefined;

  const priorityConfig = {
    HIGH: { color: "text-[#f87171]", bg: "bg-[#f8717115] border-[#f8717130]" },
    MEDIUM: {
      color: "text-[#fb923c]",
      bg: "bg-[#fb923c15] border-[#fb923c30]",
    },
    LOW: { color: "text-[#4ade80]", bg: "bg-[#4ade8015] border-[#4ade8030]" },
  };

  const priority = priorityConfig[task.priority as keyof typeof priorityConfig];
  const { label, color } = formatDueDate(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={style}
      className={`rounded-lg px-4 py-3 bg-[#161125] border border-[#2a2040] space-y-3 
        transition-all duration-150
        ${
          isDragging && !isOverlay
            ? "opacity-40 border-dashed border-[#3d2d6b]"
            : "hover:bg-[#1e1635] hover:border-[#3d2d6b] cursor-grab active:cursor-grabbing"
        }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priority.color} ${priority.bg}`}
        >
          {task.priority}
        </span>
        <span
          className="rounded-full border border-zinc-700 bg-[#2d1d5e] px-2.5 py-1 text-xs font-medium"
          style={{ color }}
        >
          {label}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-white font-medium text-sm">{task.title}</p>
        <img
          src={task.assignedTo.image}
          className="w-6 h-6 rounded-full border border-gray-600"
        />
      </div>
    </div>
  );
};

export default TaskCard;
