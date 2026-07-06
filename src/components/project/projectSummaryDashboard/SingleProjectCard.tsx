"use client";

import { Select, Label, ListBox } from "@heroui/react";

import { CircleUser, ArrowRight, NotebookText, Zap } from "lucide-react";

import { useRouter } from "next/navigation";

type Props = {
  project: any;
  orgSlug: string;
  user: any;

  openOptions: string | null;
  setOpenOptions: React.Dispatch<React.SetStateAction<string | null>>;

  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onAddMember: (id: string) => void;
  onOpenMembers: (project: any) => void;
};

export default function SingleProjectCard({
  project,
  orgSlug,
  user,
  openOptions,
  setOpenOptions,
  onStatusChange,
  onDelete,
  onAddMember,
  onOpenMembers,
}: Props) {
  const router = useRouter();

  const STATUS_DISPLAY: Record<string, string> = {
    ACTIVE: "Active",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
  };

  const statusConfig = {
    ACTIVE: {
      color: "text-[#4ade80]",
      bg: "bg-[#14301e]",
      border: "border-[#4ade80]/20",
    },
    ON_HOLD: {
      color: "text-[#fb923c]",
      bg: "bg-[#3a1f07]",
      border: "border-[#fb923c]/20",
    },
    COMPLETED: {
      color: "text-[#8b5cf6]",
      bg: "bg-[#2d1d5e]",
      border: "border-[#8b5cf6]/20",
    },
  }[project.status as "ACTIVE" | "ON_HOLD" | "COMPLETED"] ?? {
    color: "text-[#7c6fa0]",
    bg: "bg-[#1a1232]",
    border: "border-[#2a2040]",
  };

  const isOwner = user.ownedOrganizations?.some(
    (org: any) =>
      org.id === project.organizationId || org === project.organizationId,
  );

  return (
    <>
      <div
        key={project.id}
        className="bg-[#110f1a] border border-[#2a2040] hover:border-[#3d2d6b] rounded-xl p-5 flex flex-col gap-4 transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-2">
          {isOwner ? (
            <Select
              value={project.status || "ACTIVE"}
              onChange={(key) => onStatusChange(project.id, key as string)}
            >
              <Select.Trigger
                className={`text-xs font-medium px-2.5 py-1 rounded-xl border cursor-pointer outline-none min-h-0 h-fit
      ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}
              >
                <Select.Value
                  className={`text-xs font-medium ${statusConfig.color} mr-4`}
                />
                <Select.Indicator className="text-white/50" />
              </Select.Trigger>
              <Select.Popover className="bg-[#0e0c17] rounded-xl border border-white/10">
                <ListBox>
                  <ListBox.Item
                    className=" w-full px-4 py-2.5 text-left hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                    id="ACTIVE"
                    textValue="Active"
                  >
                    <Label className="text-xs text-[#4ade80]">Active</Label>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item
                    id="ON_HOLD"
                    textValue="On Hold"
                    className="w-full px-4 py-2.5 text-left hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                  >
                    <Label className="text-xs text-[#fb923c] ">On Hold</Label>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item
                    className="w-full px-4 py-2.5 text-left hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                    id="COMPLETED"
                    textValue="Completed"
                  >
                    <Label className="text-xs text-[#8b5cf6] ">Completed</Label>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          ) : (
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}
            >
              {STATUS_DISPLAY[project.status] || "Status"}
            </span>
          )}

          <div className="relative">
            <button
              onClick={() =>
                setOpenOptions(openOptions === project.id ? null : project.id)
              }
              className="text-[#7c6fa0] hover:text-[#e8e4f0] w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2a2040] transition-colors text-lg font-bold"
            >
              ···
            </button>
            {openOptions === project.id && (
              <div className="absolute right-0 mt-1 w-44 bg-[#110f1a] border border-[#2a2040] rounded-xl shadow-xl z-20 overflow-hidden">
                <button
                  className="w-full px-4 py-2.5 text-left text-sm text-[#b8aed4] hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                  onClick={() => {
                    onAddMember(project.id);
                    setOpenOptions(null);
                    // setProjectId(project.id);
                  }}
                >
                  Add member
                </button>
                <button
                  className="w-full px-4 py-2.5 text-left text-sm text-[#b8aed4] hover:bg-[#1a1232] hover:text-[#e8e4f0] transition-colors"
                  onClick={() => setOpenOptions(null)}
                >
                  Remove member
                </button>
                <button
                  className="w-full px-4 py-2.5 text-left text-sm text-[#f87171] hover:bg-[#2d0f0f] transition-colors"
                  onClick={() => {
                    onDelete(project.id);
                    setOpenOptions(null);
                  }}
                >
                  Delete project
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[#e8e4f0] mb-1 wrap-break-word">
            {project.name}
          </h2>
          <p className="text-sm text-[#7c6fa0] leading-relaxed line-clamp-3 wrap-break-word">
            {project.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0e0c17] border border-[#2a2040] rounded-xl px-3 py-2.5 flex items-center gap-3">
            <Zap size={16} className={statusConfig.color} />
            <div>
              <p className="text-[11px] text-[#7c6fa0]">Sprints</p>
              <p className="text-base font-semibold text-[#e8e4f0]">
                {project?._count?.sprints || 0}
              </p>
            </div>
          </div>
          <div className="bg-[#0e0c17] border border-[#2a2040] rounded-xl px-3 py-2.5 flex items-center gap-3">
            <NotebookText size={16} className={statusConfig.color} />
            <div>
              <p className="text-[11px] text-[#7c6fa0]">Tasks</p>
              <p className="text-base font-semibold text-[#e8e4f0]">
                {project?._count?.tasks || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between pt-2 border-t border-[#2a2040]">
          <div className="flex items-center">
            <div className="flex items-center">
              {project?.projectUsers?.slice(0, 3).map((pu: any, i: number) => (
                <div
                  key={pu.user.id}
                  onClick={() => onOpenMembers(project)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2d1d5e] border-2 border-[#09080f] overflow-hidden flex items-center justify-center cursor-pointer ${
                    i !== 0 ? "-ml-2" : ""
                  }`}
                >
                  {pu?.user?.image ? (
                    <img
                      src={pu.user.image}
                      alt={pu.user.name ?? "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CircleUser
                      size={14}
                      className="sm:w-3.5 sm:h-3.5 text-[#c4a8f5]"
                    />
                  )}
                </div>
              ))}

              {project?._count?.projectUsers > 3 && (
                <button
                  onClick={() => onOpenMembers(project)}
                  className="w-6 h-6 sm:w-7 sm:h-7 -ml-2 rounded-full bg-[#1a1232] border-2 border-[#09080f] flex items-center justify-center text-[10px] font-semibold text-[#c4a8f5] hover:bg-[#2a2040] transition-colors cursor-pointer"
                >
                  +{project?._count?.projectUsers - 3}
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() =>
              router.push(`/organization/${orgSlug}/projects/${project?.slug}`)
            }
            className="flex items-center gap-1.5 text-sm text-[#8b5cf6] hover:text-[#c4a8f5] transition-colors font-medium cursor-pointer"
          >
            View Details
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
