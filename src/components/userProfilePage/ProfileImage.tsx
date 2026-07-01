"use client";

import { useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { Pencil, Loader2 } from "lucide-react";

export default function ProfileImageUpload() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      await user.setProfileImage({ file });
      await user.reload();

      await fetch(`/api/user/${user.id}/update-profile-picture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: user.imageUrl,
        }),
      });
    } catch (err) {
      console.error("Failed to update profile image:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-36 lg:w-36 z-10">
      <img
        src={user?.imageUrl}
        alt="Profile"
        className="h-full w-full rounded-full object-cover border border-[#2a2040]"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 rounded-full bg-[#8b5cf6] border-2 border-[#110f1a] text-white hover:bg-[#7c3aed] disabled:opacity-50 transition-colors cursor-pointer"
        aria-label="Change profile photo"
      >
        {uploading ? (
          <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 animate-spin" />
        ) : (
          <Pencil className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
