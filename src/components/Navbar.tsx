"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b h-16">
      <div className="text-xl font-semibold tracking-wide">VeloCRM</div>

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

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
