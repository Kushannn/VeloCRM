"use client";

import { Button, Pagination, Table } from "@heroui/react";
import { Leads } from "@/lib/types";
import { useMemo, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import styles from "./LeadsTable.module.css";

const columns = [
  { id: "name", name: "Name" },
  { id: "company", name: "Company" },
  { id: "status", name: "Status" },
  { id: "email", name: "Email" },
  { id: "source", name: "Source" },
  { id: "actions", name: "Actions" },
];

const statusStyles: Record<string, string> = {
  NEW: "bg-[#60a5fa]/10 text-[#60a5fa] border border-[#60a5fa]/20",
  CONTACTED: "bg-[#4c2d9e]/15 text-[#c4a8f5] border border-[#4c2d9e]",
  QUALIFIED: "bg-[#8b5cf6]/15 text-[#c4a8f5] border border-[#8b5cf6]/20",
  PROPOSAL_SENT: "bg-[#fb923c]/10 text-[#fb923c] border border-[#fb923c]/20",
  NEGOTIATION: "bg-[#6c3fc4]/15 text-[#c4a8f5] border border-[#6c3fc4]/20",
  WON: "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20",
  LOST: "bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20",
};

const ROWS_PER_PAGE = 5;

export default function LeadsTable({
  filteredLeads,
  onEditLead,
}: {
  filteredLeads: Leads[];
  onEditLead: (lead: Leads) => void;
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filteredLeads.length / ROWS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredLeads.slice(start, start + ROWS_PER_PAGE);
  }, [page, filteredLeads]);

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, filteredLeads.length);

  return (
    <Table
      className="p-0 border-none bg-transparent h-full flex flex-col"
      variant="secondary"
    >
      <Table.ScrollContainer className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <div className="h-full bg-[#110f1a] rounded-xl border border-[#2a2040] overflow-x-auto">
          <Table.Content aria-label="Leads table" className="min-w-150">
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column
                  isRowHeader={column.id === "name"}
                  className="bg-[#0e0c17] text-[#c4a8f5] text-sm font-semibold uppercase tracking-wider px-4 py-3 border-b border-[#2a2040] whitespace-nowrap"
                >
                  {column.name}
                </Table.Column>
              )}
            </Table.Header>

            <Table.Body
              items={paginatedItems}
              className="divide-y divide-[#2a2040]"
              renderEmptyState={() => (
                <div className="text-center py-12 text-[#c4a8f5]/60 text-sm">
                  No leads found. Try adjusting your filters.
                </div>
              )}
            >
              {(lead) => (
                <Table.Row
                  className={`${styles.row} bg-[#110f1a]! hover:bg-[#1a1232]! data-[hover=true]:bg-[#1a1232]!`}
                >
                  <Table.Collection items={columns}>
                    {(column) => (
                      <Table.Cell className="px-4 py-3 text-md text-[#ede8fb] border-b border-[#2a2040] whitespace-nowrap">
                        {column.id === "actions" ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="min-w-8 w-8 h-8 bg-[#0e0c17] border border-[#2a2040] hover:border-[#3d2d6b] hover:bg-[#1a1232] text-[#c4a8f5]"
                              onPress={() => onEditLead(lead)}
                            >
                              <Pencil className=" text-white" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="min-w-8 w-8 h-8 bg-[#0e0c17] border border-[#2a2040] hover:border-[#f87171] hover:bg-[#f87171]/10 text-[#f87171]"
                            >
                              <Trash />
                            </Button>
                          </div>
                        ) : column.id === "status" ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              statusStyles[lead.status]
                            }`}
                          >
                            {lead.status.replaceAll("_", " ")}
                          </span>
                        ) : (
                          String(lead[column.id as keyof typeof lead] ?? "")
                        )}
                      </Table.Cell>
                    )}
                  </Table.Collection>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </div>
      </Table.ScrollContainer>

      <Table.Footer className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 px-4 py-3 border-t border-[#2a2040] bg-[#110f1a] rounded-b-xl">
        <Pagination size="sm">
          <Pagination.Summary className="text-xs text-[#c4a8f5]/60 text-center sm:text-left">
            {start} to {end} of {filteredLeads.length} results
          </Pagination.Summary>
          <Pagination.Content className="flex items-center gap-1 flex-wrap justify-center overflow-x-auto max-w-full">
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-[#1a1a1a] rounded disabled:opacity-30 transition-colors whitespace-nowrap"
              >
                <Pagination.PreviousIcon />
                Prev
              </Pagination.Previous>
            </Pagination.Item>

            {pages.map((p) => (
              <Pagination.Item key={p}>
                <Pagination.Link
                  isActive={p === page}
                  onPress={() => setPage(p)}
                  className={`w-7 h-7 text-xs rounded flex items-center justify-center transition-colors shrink-0 ${
                    p === page
                      ? "bg-[#6c3fc4] border border-[#8b5cf6] text-white"
                      : "text-zinc-400 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                >
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ))}

            <Pagination.Item>
              <Pagination.Next
                isDisabled={page === totalPages}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 text-xs text-zinc-400 hover:text-[#ede8fb] hover:bg-[#1a1232] rounded disabled:opacity-30 transition-colors whitespace-nowrap"
              >
                Next
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </Table.Footer>
    </Table>
  );
}
