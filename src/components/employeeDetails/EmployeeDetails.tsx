"use client";

import { Card } from "@heroui/react";
import { CircleUser, Mail, Shield } from "lucide-react";

interface Member {
  id: string;
  role: string;
  user: {
    designation: string;
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface Props {
  members: Member[];
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export function EmployeeDetails({ members, organization }: Props) {
  return (
    <div className="px-4 space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl">Employees</h1>
        <p className="text-sm text-zinc-400">Members of {organization.name}</p>
      </div>

      <div>
        <div></div>
        <div></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {members.map((member) => (
          <Card
            key={member.id}
            className="bg-[#111111] border border-[#1f1f1f] hover:border-violet-500/30 transition-colors"
          >
            <Card.Content className="flex flex-col items-center gap-4 p-6 text-center">
              {/* Avatar */}
              {member.user.image ? (
                <img
                  src={member.user.image}
                  alt={member.user.name ?? "Unknown"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-violet-900/40 border border-violet-700/30 flex items-center justify-center">
                  <CircleUser size={32} className="text-violet-300" />
                </div>
              )}

              {/* Info */}
              <div className="w-full space-y-1">
                <p className="text-white font-semibold truncate">
                  {member.user.name ?? "Unknown"}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <Mail size={11} className="text-zinc-500 shrink-0" />
                  <p className="text-zinc-500 text-xs truncate">
                    {member.user.email}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/5" />

              {/* Role badge */}
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  member.user.designation === "ADMIN"
                    ? "bg-violet-500/10 border border-violet-500/30 text-violet-400"
                    : "bg-white/5 border border-white/10 text-zinc-400"
                }`}
              >
                <Shield size={10} />
                {member.user.designation}
              </div>
            </Card.Content>
          </Card>
        ))}

        {members.length === 0 && (
          <p className="text-zinc-500 col-span-full text-center py-10">
            No members found.
          </p>
        )}
      </div>
    </div>
  );
}
