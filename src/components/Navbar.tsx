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
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const user = useUser();
  const { signOut } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    dispatch(logout());
    setMobileMenuOpen(false);
    router.push("/"); // Redirect after logout
  };

  const handleSignIn = () => {
    setMobileMenuOpen(false);
    router.push("/sign-in");
  };

  return (
    <header className="text-white shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            VeloCRM
          </Link>

          {/* Desktop Navigation */}
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
              {/* Wrap SignUpButton with custom styling */}
              <SignUpButton>
                <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 transition">
                  Sign Up
                </button>
              </SignUpButton>
              <button
                onClick={handleSignIn}
                className="px-3 py-1 rounded border border-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                Sign In
              </button>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                <img
                  src={user.user?.imageUrl}
                  alt={user.user?.fullName || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="p-2 rounded hover:bg-red-600 transition"
                  title="Log out"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </SignedIn>
          </nav>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded hover:bg-gray-700 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <nav
        className={`sm:hidden px-4 pb-4 space-y-3 overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? "max-h-screen pt-2" : "max-h-0"
        }`}
        aria-label="Mobile Navigation"
      >
        <SignedOut>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            About
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Pricing
          </Link>
          <SignUpButton>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </SignUpButton>
          <button
            onClick={handleSignIn}
            className="w-full text-left px-3 py-2 rounded border border-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            Sign In
          </button>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-3 px-3 py-2">
            <img
              src={user.user?.imageUrl}
              alt={user.user?.fullName || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="p-2 rounded hover:bg-red-600 transition"
              title="Log out"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </SignedIn>
      </nav>
    </header>
  );
}
