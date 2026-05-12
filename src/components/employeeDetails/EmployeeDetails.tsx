"use client";

import { Card, CardBody } from "@heroui/react";
import { CircleUser, Mail, Shield } from "lucide-react";

interface Member {
  id: string;
  role: string;
  user: {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card
            key={member.id}
            className="bg-[#111111] border border-[#1f1f1f] hover:border-violet-500/30 transition-colors"
          >
            <CardBody className="flex flex-row items-center gap-4 p-4">
              {/* Avatar */}
              {member.user.image ? (
                <img
                  src={member.user.image}
                  alt={member.user.name ?? "Unknown"}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-violet-900/40 border border-violet-700/30 flex items-center justify-center flex-shrink-0">
                  <CircleUser size={24} className="text-violet-300" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {member.user.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Mail size={11} className="text-zinc-500" />
                  <p className="text-zinc-500 text-xs truncate">
                    {member.user.email}
                  </p>
                </div>
              </div>

              {/* Role badge */}
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                  member.role === "ADMIN"
                    ? "bg-violet-500/10 border border-violet-500/30 text-violet-400"
                    : "bg-white/5 border border-white/10 text-zinc-400"
                }`}
              >
                <Shield size={10} />
                {member.role}
              </div>
            </CardBody>
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
