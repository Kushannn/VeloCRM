"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const user = useUser();

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b h-16">
      <div
        className="text-xl font-semibold tracking-wide"
        onClick={() => redirect("/")}
      >
        VeloCRM
      </div>

      {!user.isSignedIn && (
        <div>
          <nav className="flex space-x-4">
            <a href="/" className="text-gray-200 hover:text-blue-600">
              Home
            </a>
            <a href="/dashboard" className="text-gray-200 hover:text-blue-600">
              About
            </a>
            <a href="/settings" className="text-gray-200 hover:text-blue-600">
              Pricing
            </a>
          </nav>
        </div>
      )}

      {user.isSignedIn && (
        <div>
          <div className="h-6 w-md rounded-lg bg-[#222222]"></div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignUpButton />
          <button onClick={() => redirect("/sign-in")}> Sign in</button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
