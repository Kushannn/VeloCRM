import { useDraggable } from "@dnd-kit/core";

const TaskCard = ({ task }: { task: any }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="rounded-xl px-4 py-3 bg-[#2a2a2a] hover:bg-[#313131] transition border border-gray-700/60 space-y-3 cursor-grab active:cursor-grabbing"
    >
      <p className="text-white font-medium text-sm">{task.title}</p>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{task.priority}</span>
        <img
          src="/avatar.jpg"
          className="w-6 h-6 rounded-full border border-gray-600"
        />
      </div>
    </div>
  );
};

export default TaskCard;
