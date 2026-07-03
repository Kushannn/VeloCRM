"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { clearOrganization } from "@/redux/slices/orgSlice";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const user = useUser();
  const { signOut } = useAuth();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const isOnboardingPage = pathName === "/onboarding";

  const handleLogout = async () => {
    await signOut();
    dispatch(logout());
    dispatch(clearOrganization());
  };

  return (
    <header
      className={`h-16 z-50 ${
        isOnboardingPage
          ? "absolute top-0 left-0 right-0 bg-transparent"
          : "sticky top-0 bg-[#09080f]"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            VeloCRM
          </Link>

          <div className="sm:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>

          <nav className="hidden sm:flex items-center space-x-6">
            <SignedOut>
              <Link href="/" className="hover:text-blue-500">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-blue-500">
                About
              </Link>
              {/* <Link href="/settings" className="hover:text-blue-500">
                Pricing
              </Link> */}
              <SignUpButton>
                <button className="cursor-pointer">Sign Up</button>
              </SignUpButton>
              <SignInButton>
                <button className="cursor-pointer hover:text-blue-500">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                <Link href="/profile">
                  <img
                    src={user.user?.imageUrl}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>

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
            <button className="cursor-pointer">
              <SignUpButton />
            </button>
            <button
              onClick={() => router.push("/sign-in")}
              className="cursor-pointer"
            >
              Sign In
            </button>
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
