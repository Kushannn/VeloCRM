"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const user = useUser();
  const { signOut } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await signOut();
    dispatch(logout());
  };

  useEffect(() => {
    console.log("user in navbar", reduxUser);
  });

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b h-16">
      <Link
        href={"/"}
        className="text-xl font-semibold tracking-wide cursor-pointer"
      >
        VeloCRM
      </Link>

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
          <img
            src={user.user?.imageUrl}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <button onClick={handleLogout} className="cursor-pointer">
            <LogOut />
          </button>
        </SignedIn>
      </div>
    </header>
  );
}
