"use client";

import { Card, Input } from "@heroui/react";
import ProfileImageUpload from "./ProfileImage";
import { useState } from "react";
import { OrganizationType, UserType } from "@/lib/types";

type UserProfilePageProps = UserType & {
  createdAt: Date;
  designation: string;
};

export default function UserDetailsBasic({
  user,
  organization,
}: {
  user: UserProfilePageProps;
  organization: OrganizationType | null;
}) {
  const [userData, setUserData] = useState({
    name: user.name ?? "",
    role: user.role ?? "",
    email: user.email ?? "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name ?? "",
    role: user.role ?? "",
    email: user.email ?? "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/user/${user.id}/change-user-details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();

      setUserData({
        name: data.user.name,
        role: data.user.role,
        email: data.user.email,
      });

      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user.name ?? "",
      role: user.role ?? "",
      email: user.email ?? "",
    });
    setIsEditing(false);
  };
  return (
    <>
      <Card className="w-full rounded-2xl bg-[#110f1a]">
        <Card.Content>
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-10">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />
                <ProfileImageUpload />
              </div>

              <div className="shrink-0 flex flex-col justify-center gap-2 min-w-50">
                {isEditing ? (
                  <>
                    <Input
                      aria-label="Name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-52 bg-[#1a1232] text-white rounded-md"
                    />
                    <Input
                      aria-label="Designation"
                      placeholder="Enter your designation"
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="w-52 bg-[#1a1232] text-white"
                      // size="sm"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-[#e8e4f0] leading-tight">
                      {userData.name}
                    </h1>
                    <p className="text-[#b8aed4]">
                      {userData.role ?? "Team Member"}
                    </p>
                  </>
                )}
              </div>

              <div className="w-px h-10 bg-white/10 mx-1 shrink-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-2xl max-w-full">
                <div className="px-4 py-3 rounded-lg bg-[#1a1628] border border-[#2a2040]">
                  <p className="text-xs uppercase tracking-wide text-[#8b7db0]">
                    Organization
                  </p>
                  <p className="text-[#e8e4f0] font-medium wrap-break-word">
                    {organization?.name ?? "No Organization"}
                  </p>
                </div>

                <div className="px-4 py-3 rounded-lg bg-[#1a1628] border border-[#2a2040]">
                  <p className="text-xs uppercase tracking-wide text-[#8b7db0]">
                    Email
                  </p>
                  {isEditing ? (
                    <Input
                      aria-label="Email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      // size="sm"
                      className="bg-[#1a1232] text-white w-full"
                    />
                  ) : (
                    <p className="text-[#e8e4f0] break-all text-sm">
                      {userData.email}
                    </p>
                  )}
                </div>

                <div className="px-4 py-3 rounded-lg bg-[#1a1628] border border-[#2a2040]">
                  <p className="text-xs uppercase tracking-wide text-[#8b7db0]">
                    Role
                  </p>
                  <p className="text-[#e8e4f0] font-medium">
                    {user.designation}
                  </p>
                </div>

                <div className="px-4 py-3 rounded-lg bg-[#1a1628] border border-[#2a2040]">
                  <p className="text-xs uppercase tracking-wide text-[#8b7db0]">
                    Member Since
                  </p>
                  <p className="text-[#e8e4f0] text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-center flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1628] border border-[#2a2040] cursor-pointer text-[#b8aed4] text-sm font-medium transition-colors hover:bg-[#2a2040]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 cursor-pointer text-white text-sm font-medium transition-colors hover:bg-purple-500 disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d1d5e] cursor-pointer text-white text-sm font-medium transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </>
  );
}
