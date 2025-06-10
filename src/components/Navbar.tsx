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
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const user = useUser();
  const { signOut } = useAuth();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    dispatch(logout());
  };

  useEffect(() => {
    console.log("user in navbar", reduxUser);
  }, [reduxUser]);

  return (
    <header className="bg-[#121212] border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            VeloCRM
          </Link>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center space-x-6">
            <SignedOut>
              <Link href="/" className="hover:text-blue-500">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-blue-500">
                About
              </Link>
              <Link href="/settings" className="hover:text-blue-500">
                Pricing
              </Link>
              <SignUpButton />
              <button onClick={() => redirect("/sign-in")}>Sign In</button>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                <img
                  src={user.user?.imageUrl}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <button onClick={handleLogout}>
                  <LogOut />
                </button>
              </div>
            </SignedIn>
          </nav>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-3">
          <SignedOut>
            <Link href="/" className="block hover:text-blue-500">
              Home
            </Link>
            <Link href="/dashboard" className="block hover:text-blue-500">
              About
            </Link>
            <Link href="/settings" className="block hover:text-blue-500">
              Pricing
            </Link>
            <SignUpButton />
            <button onClick={() => redirect("/sign-in")}>Sign In</button>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3">
              <img
                src={user.user?.imageUrl}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <button onClick={handleLogout}>
                <LogOut />
              </button>
            </div>
          </SignedIn>
        </div>
      )}
    </header>
  );
}
