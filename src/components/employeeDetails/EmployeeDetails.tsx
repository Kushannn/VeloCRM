"use client";

import { useMemo, useState } from "react";
import { TextField, Select, Input, ListBox, Label } from "@heroui/react";
import { Search, Users, Crown } from "lucide-react";
import EmployeeCard from "./EmployeeCard";

interface Member {
  id: string;
  role: string;
  user: {
    designation: string;
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string | null;
  };
}

interface Props {
  members: Member[];
  organization: { id: string; name: string; slug: string };
}

const ELEVATED = new Set(["ADMIN", "OWNER"]);

export function EmployeeDetails({ members, organization }: Props) {
  const [query, setQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("ALL");

  const designations = useMemo(() => {
    const unique = new Set(members.map((m) => m.user.designation));
    return ["ALL", ...Array.from(unique)];
  }, [members]);

  const adminCount = useMemo(
    () => members.filter((m) => ELEVATED.has(m.user.designation)).length,
    [members],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return members.filter((m) => {
      const text =
        `${m.user.name ?? ""} ${m.user.email} ${m.user.role ?? ""}`.toLowerCase();
      return (
        text.includes(q) &&
        (designationFilter === "ALL" ||
          m.user.designation === designationFilter)
      );
    });
  }, [members, query, designationFilter]);

  return (
    <div className="px-4 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-violet-400 mb-1">
            {organization.name} · Team
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Employees</h1>
        </div>

        <div className="flex gap-2">
          {[
            {
              icon: <Users size={11} />,
              label: "Members",
              value: members.length,
            },
            { icon: <Crown size={11} />, label: "Admins", value: adminCount },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-[#110f1a] border border-[#2a2040] px-4 py-3 min-w-24"
            >
              <p className="text-[11px] uppercase tracking-wide text-zinc-500 flex items-center gap-1">
                {icon} {label}
              </p>
              <p className="text-xl font-semibold text-white mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <TextField
          className="flex-1 min-w-55 relative rounded-lg text-[#7c6fa0]"
          value={query}
          onChange={setQuery}
        >
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c6fa0] pointer-events-none z-10"
          />
          <Input
            className="pl-9 bg-[#0e0c17] text-[#7c6fa0] border-2 border-[#2a2040]
              focus-visible:ring-0 focus-visible:border-[#533f92]
              data-[focus-visible=true]:ring-0 data-[focus-visible=true]:border-[#533f92]
              data-[focus-visible=true]:shadow-none text-"
            placeholder="Search by name, email, or title..."
          />
        </TextField>

        <Select
          className="min-w-40 bg-[#0e0c17] rounded-lg border-2 border-[#2a2040]"
          value={designationFilter}
          onChange={(value) => setDesignationFilter((value as string) ?? "ALL")}
        >
          <Select.Trigger className="bg-[#0e0c17] rounded-lg text-[#7c6fa0]">
            <Select.Value className="text-[#7c6fa0]" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover className="border-none outline-none shadow-none [&::before]:hidden [&::after]:hidden">
            <ListBox className="bg-[#0e0c17] border-none">
              {designations.map((d) => (
                <ListBox.Item
                  key={d}
                  id={d}
                  className="hover:bg-[#1a1232] transition-colors border-none"
                >
                  <Label className="text-[#7c6fa0]">
                    {d === "ALL" ? "All designations" : d}
                  </Label>
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#110f1a] border border-[#2a2040] py-16 flex flex-col items-center text-center gap-2">
          <Users className="w-7 h-7 text-zinc-600" />
          <p className="text-sm font-medium text-zinc-300">No members found</p>
          <p className="text-xs text-zinc-500">
            Try a different name, email, or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((member) => (
            <EmployeeCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
