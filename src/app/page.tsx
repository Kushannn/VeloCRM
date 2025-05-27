"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="p-6">
      <SignedIn>
        <h1 className="text-3xl font-bold mb-4">Welcome to VeloCRM 🚀</h1>
        <p className="text-lg text-gray-600">
          Manage your clients, leads, tasks, and more — all in one powerful CRM
          platform.
        </p>
      </SignedIn>

      <SignedOut>
        <h1 className="text-3xl font-bold mb-4">Welcome to VeloCRM 👋</h1>
        <p className="text-lg text-gray-600 mb-4">
          Please sign in or sign up to start tracking your client interactions.
        </p>
      </SignedOut>
    </main>
  );
}
