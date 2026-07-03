"use client";

import { AlertDialog, Button, Card, Input, toast } from "@heroui/react";
import ProfileImageUpload from "./ProfileImage";
import { useState } from "react";
import { OrganizationType, UserType } from "@/lib/types";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

      if (res.ok) {
        router.push("/");
        toast("Deletion successfull , redirection to homepage");
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/user/${user.id}/delete-user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) toast("Could not delete user");

      setUserData({
        name: "",
        role: "",
        email: "",
      });

      if (res.ok) toast("User has been deleted , redirecting to homepage");
    } catch (error) {
      toast("Internal server error");
      console.log("Error");
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

              <div className="shrink-0 self-center flex flex-col gap-2">
                {isEditing ? (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center justify-center px-4 py-2 rounded-xl bg-[#1a1628] border border-[#2a2040] cursor-pointer text-[#b8aed4] text-sm font-medium transition-colors hover:bg-[#2a2040]"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center px-4 py-2 rounded-xl bg-purple-600 cursor-pointer text-white text-sm font-medium transition-colors hover:bg-purple-500 disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#2d1d5e] cursor-pointer text-white text-sm font-medium transition-colors hover:bg-[#3b2778]"
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

                    <AlertDialog>
                      <Button variant="danger">Delete Account</Button>
                      <AlertDialog.Backdrop
                        className="bg-[#09080f]/60"
                        variant="blur"
                      >
                        <AlertDialog.Container>
                          <AlertDialog.Dialog className="sm:max-w-100 bg-[#110f1a] border border-[#2a2040] text-[#b8aed4] rounded-xl shadow-2xl shadow-black/40">
                            <AlertDialog.CloseTrigger className="text-[#b8aed4] bg-[#110f1a] hover:bg-[#2b1e51] hover:text-[#e8e4f0] active:bg-[#2a2040] rounded-lg transition-colors" />
                            <AlertDialog.Header className="border-b border-[#2a2040] pb-4">
                              <AlertDialog.Icon status="danger" />
                              <AlertDialog.Heading className="text-[#e8e4f0] text-2xl font-semibold">
                                Delete account permanently?
                              </AlertDialog.Heading>
                            </AlertDialog.Header>
                            <AlertDialog.Body>
                              <p className="text-[#7c6fa0] text-sm w-full">
                                This will permanently delete your account and
                                all of its data. This action cannot be undone.
                              </p>
                            </AlertDialog.Body>
                            <AlertDialog.Footer className="border-t border-[#2a2040] pt-6">
                              <Button
                                slot="close"
                                variant="ghost"
                                className="text-[#7c6fa0] hover:text-[#e8e4f0] hover:bg-[#1a1232]"
                              >
                                Cancel
                              </Button>
                              <Button
                                slot="close"
                                variant="danger"
                                onClick={handleDelete}
                              >
                                Delete Account
                              </Button>
                            </AlertDialog.Footer>
                          </AlertDialog.Dialog>
                        </AlertDialog.Container>
                      </AlertDialog.Backdrop>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </>
  );
}
