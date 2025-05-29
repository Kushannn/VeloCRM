"use client";

import HomeSignedOut from "@/components/HomeSignedOut";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="p-6 h-[91vh]">
      <SignedIn>
        <h1 className="text-3xl font-bold mb-4">Welcome to VeloCRM 🚀</h1>
        <p className="text-lg text-gray-600">
          Manage your clients, leads, tasks, and more — all in one powerful CRM
          platform.
        </p>
      </SignedIn>

      <SignedOut>
        <HomeSignedOut />
      </SignedOut>
    </main>
  );
}
