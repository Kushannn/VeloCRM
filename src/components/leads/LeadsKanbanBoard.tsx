"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { Mail, Building2, MoreVertical, Check } from "lucide-react";
import { Leads } from "@/lib/types";

const STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

type Status = (typeof STATUSES)[number];

const columnMeta: Record<
  Status,
  { label: string; accent: string; header: string }
> = {
  NEW: {
    label: "New",
    accent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    header: "border-t-blue-500/40",
  },
  CONTACTED: {
    label: "Contacted",
    accent: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    header: "border-t-yellow-500/40",
  },
  QUALIFIED: {
    label: "Qualified",
    accent: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    header: "border-t-violet-500/40",
  },
  PROPOSAL_SENT: {
    label: "Proposal Sent",
    accent: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    header: "border-t-orange-500/40",
  },
  NEGOTIATION: {
    label: "Negotiation",
    accent: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    header: "border-t-pink-500/40",
  },
  WON: {
    label: "Won",
    accent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    header: "border-t-emerald-500/40",
  },
  LOST: {
    label: "Lost",
    accent: "bg-red-500/10 text-red-400 border-red-500/20",
    header: "border-t-red-500/40",
  },
};

function StatusMenu({
  currentStatus,
  onSelect,
}: {
  currentStatus: Status;
  onSelect: (status: Status) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Move to status"
      >
        <MoreVertical size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg border border-[#2a2040] bg-[#0e0c17] shadow-xl shadow-black/60 overflow-hidden"
          >
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  if (s !== currentStatus) onSelect(s);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:bg-[#1a1232] transition-colors text-left"
              >
                <span className={s === currentStatus ? "text-zinc-500" : ""}>
                  {columnMeta[s].label}
                </span>
                {s === currentStatus && (
                  <Check size={12} className="text-violet-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  isOverlay,
  onStatusSelect,
}: {
  lead: Leads;
  isOverlay?: boolean;
  onStatusSelect?: (leadId: string, status: Status) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: lead.id,
      data: { lead },
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-xl border border-[#2a2040] bg-[#161125] p-3 cursor-grab active:cursor-grabbing transition-opacity ${
        isDragging && !isOverlay ? "opacity-30" : ""
      } ${isOverlay ? "shadow-2xl shadow-black/60 rotate-1" : "hover:border-[#2a2040]"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-zinc-200 truncate">
          {lead.name}
        </p>
        {!isOverlay && onStatusSelect && (
          <StatusMenu
            currentStatus={(lead.status as Status) ?? "NEW"}
            onSelect={(status) => onStatusSelect(lead.id, status)}
          />
        )}
      </div>

      {lead.company && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <Building2 size={11} className="text-zinc-500 shrink-0" />
          <p className="text-xs text-zinc-500 truncate">{lead.company}</p>
        </div>
      )}

      {lead.email && (
        <div className="flex items-center gap-1.5 mt-1">
          <Mail size={11} className="text-zinc-500 shrink-0" />
          <p className="text-xs text-zinc-500 truncate">{lead.email}</p>
        </div>
      )}

      {lead.source && (
        <p className="text-[10px] uppercase tracking-wide text-zinc-600 mt-2">
          {String(lead.source).replace("_", " ")}
        </p>
      )}
    </div>
  );
}

function Column({
  status,
  leads,
  isDropTarget,
  onStatusSelect,
}: {
  status: Status;
  leads: Leads[];
  isDropTarget: boolean;
  onStatusSelect: (leadId: string, status: Status) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const meta = columnMeta[status];

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 min-w-[220px] h-[calc(100vh-280px)] rounded-xl bg-[#0e0c17] border border-[#1f1f1f] border-t-2 ${meta.header} transition-colors ${
        isOver ? "bg-[#13101c]" : ""
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#1f1f1f]">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${meta.accent}`}
        >
          {meta.label}
        </span>
        <span className="text-xs text-zinc-500">{leads.length}</span>
      </div>

      <div className="flex flex-col gap-2 p-2 flex-1 overflow-y-auto">
        {leads.length === 0 ? (
          <div className="text-center text-[11px] text-zinc-600 py-6">
            No leads
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatusSelect={onStatusSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function LeadsKanbanBoard({
  leads,
  onStatusChange,
}: {
  leads: Leads[];
  onStatusChange: (leadId: string, newStatus: Status) => Promise<void> | void;
}) {
  // Local optimistic copy so drags feel instant; reconciles when `leads` prop updates
  const [items, setItems] = useState(leads);
  const [activeLead, setActiveLead] = useState<Leads | null>(null);

  useEffect(() => {
    setItems(leads);
  }, [leads]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const grouped = useMemo(() => {
    const map: Record<Status, Leads[]> = {
      NEW: [],
      CONTACTED: [],
      QUALIFIED: [],
      PROPOSAL_SENT: [],
      NEGOTIATION: [],
      WON: [],
      LOST: [],
    };
    for (const lead of items) {
      const status = (lead.status as Status) ?? "NEW";
      if (map[status]) map[status].push(lead);
    }
    return map;
  }, [items]);

  function handleDragStart(event: DragStartEvent) {
    const lead = event.active.data.current?.lead as Leads | undefined;
    setActiveLead(lead ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as Status;
    const lead = items.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
    );

    try {
      await onStatusChange(leadId, newStatus);
    } catch {
      // Revert on failure
      setItems((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l)),
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STATUSES.map((status) => (
          <Column
            // key={status}
            status={status}
            leads={grouped[status]}
            isDropTarget={false}
            onStatusSelect={onStatusChange}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? <LeadCard lead={activeLead} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
