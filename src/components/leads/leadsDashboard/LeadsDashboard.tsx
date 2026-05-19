"use client";

import { Button, Pagination, Table } from "@heroui/react";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import AddLead from "../addLead/AddLead";

const columns = [
  { id: "name", name: "Name" },
  { id: "role", name: "Role" },
  { id: "status", name: "Status" },
  { id: "email", name: "Email" },
];

const users = [
  {
    email: "kate@acme.com",
    id: 1,
    name: "Kate Moore",
    role: "CEO",
    status: "Active",
  },
  {
    email: "john@acme.com",
    id: 2,
    name: "John Smith",
    role: "CTO",
    status: "Active",
  },
  {
    email: "sara@acme.com",
    id: 3,
    name: "Sara Johnson",
    role: "CMO",
    status: "On Leave",
  },
  {
    email: "michael@acme.com",
    id: 4,
    name: "Michael Brown",
    role: "CFO",
    status: "Active",
  },
  {
    email: "emily@acme.com",
    id: 5,
    name: "Emily Davis",
    role: "Product Manager",
    status: "Inactive",
  },
  {
    email: "davis@acme.com",
    id: 6,
    name: "Davis Wilson",
    role: "Lead Designer",
    status: "Active",
  },
  {
    email: "olivia@acme.com",
    id: 7,
    name: "Olivia Martinez",
    role: "Frontend Engineer",
    status: "Active",
  },
  {
    email: "james@acme.com",
    id: 8,
    name: "James Taylor",
    role: "Backend Engineer",
    status: "Active",
  },
];

const ROWS_PER_PAGE = 4;

export function LeadsDashboard({ org }: { org: any }) {
  const [openAddLead, setOpenAddLead] = useState(false);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;

    return users.slice(start, start + ROWS_PER_PAGE);
  }, [page]);

  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, users.length);

  return (
    <>
      <div>
        {/* Page Header */}
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-white/75 text-4xl p-2">Leads</span>
            <span className="text-white/55 text-lg m-2 ">
              Manage and nurture your primary business relationships
            </span>
          </div>
          <Button
            className="px-3 py-4 text-md font-medium flex items-center rounded-md"
            onClick={() => {
              setOpenAddLead(true);
            }}
          >
            <Plus />
            Add new lead
          </Button>
        </div>
        <Table className="p-0 border-none bg-transparent" variant="secondary">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Leads table"
              className="min-w-150 bg-[#0d0d0d] rounded-xl border border-[#1f1f1f]"
            >
              <Table.Header columns={columns}>
                {(column) => (
                  <Table.Column
                    isRowHeader={column.id === "name"}
                    className="bg-[#111111] text-zinc-400 text-lg font-semibold uppercase tracking-wider px-4 py-3 border-b border-[#1f1f1f]"
                  >
                    {column.name}
                  </Table.Column>
                )}
              </Table.Header>

              <Table.Body
                items={paginatedItems}
                className="divide-y divide-[#1f1f1f]"
              >
                {(user) => (
                  <Table.Row className="bg-[#0e0e0e]! hover:bg-[#0b0a0a] transition-colors border-b border-[#1f1f1f]">
                    <Table.Collection items={columns}>
                      {(column) => (
                        <Table.Cell className="px-4 py-3 text-md text-zinc-300">
                          {column.id === "status" ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "Active"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : user.status === "On Leave"
                                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                    : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                              }`}
                            >
                              {user.status}
                            </span>
                          ) : (
                            user[column.id as keyof typeof user]
                          )}
                        </Table.Cell>
                      )}
                    </Table.Collection>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>

          <Table.Footer className="flex items-center justify-between px-4 py-3 border-t border-[#1f1f1f] bg-[#0d0d0d] rounded-b-xl">
            <Pagination size="sm">
              <Pagination.Summary className="text-xs text-zinc-500">
                {start} to {end} of {users.length} results
              </Pagination.Summary>
              <Pagination.Content className="flex items-center gap-1">
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={page === 1}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-[#1a1a1a] rounded disabled:opacity-30 transition-colors"
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
                      className={`w-7 h-7 text-xs rounded flex items-center justify-center transition-colors ${
                        p === page
                          ? "bg-violet-600 text-white"
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
                    className="px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-[#1a1a1a] rounded disabled:opacity-30 transition-colors"
                  >
                    Next
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </Table.Footer>
        </Table>
      </div>

      <AddLead
        isOpen={openAddLead}
        onClose={() => setOpenAddLead(false)}
        organizationId={org.id}
      />
    </>
  );
}
