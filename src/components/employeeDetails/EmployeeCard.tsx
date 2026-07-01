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
    role: string | null;
  };
}

interface EmployeeCardProps {
  member: Member;
}

const ELEVATED = new Set(["ADMIN", "OWNER"]);

export default function EmployeeCard({ member }: EmployeeCardProps) {
  const { user } = member;
  const elevated = ELEVATED.has(user.designation);

  return (
    <Card className="bg-[#110f1a] border border-[#2a2040] hover:border-[#3d2d6b] transition-colors">
      <Card.Content className="flex flex-col items-center gap-4 p-3 text-center">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name ?? "Unknown"}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-violet-900/30 border border-violet-700/20 flex items-center justify-center">
            <CircleUser size={28} className="text-violet-400" />
          </div>
        )}

        <div className="w-full space-y-0.5">
          <p className="text-white font-bold text-lg truncate">
            {user.name ?? "Unknown"}
          </p>

          <div className="flex items-center justify-center gap-1 text-zinc-500">
            <Mail size={12} className="shrink-0" />
            <p className="text-sm truncate">{user.email}</p>
          </div>

          {user.role && <p className="text-zinc-500 text-sm">{user.role}</p>}
        </div>

        <div className="w-full h-px bg-white/5" />

        <span
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            elevated
              ? "bg-violet-500/10 border border-violet-500/30 text-violet-400"
              : "bg-white/5 border border-white/10 text-zinc-400"
          }`}
        >
          <Shield size={9} />
          {user.designation}
        </span>
      </Card.Content>
    </Card>
  );
}
