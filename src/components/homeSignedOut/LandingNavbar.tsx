"use client";

import { useAppDispatch } from "@/redux/hooks";
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
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function LandingNavbar() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathName = usePathname();

  const isOnboardingPage = pathName === "/onboarding";

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHidden(currentScrollY > lastScrollY.current && currentScrollY > 80);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    dispatch(logout());
    dispatch(clearOrganization());
    closeMenu();
  };

  return (
    <header
      className={`z-50 transition-transform duration-300 ease-in-out ${
        isOnboardingPage
          ? "absolute top-0 left-0 right-0 bg-transparent"
          : "sticky top-0"
      } ${hidden ? "-translate-y-[calc(100%+1rem)]" : "translate-y-0"}`}
    >
      <div
        className="max-w-6xl rounded-3xl mt-2 mx-auto px-4 sm:px-6 lg:px-8
                   bg-[#110f1a]/60 backdrop-blur-md border border-[#3d2d6b]/40
                   shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
      >
        <div className="flex justify-between items-center h-14">
          <Link
            href="/"
            className="text-xl font-bold text-white"
            onClick={closeMenu}
          >
            VeloCRM
          </Link>

          <button
            className="sm:hidden text-white"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <nav className="hidden sm:flex items-center gap-6">
            <SignedOut>
              <Link
                href="/"
                className="text-white/80 hover:text-[#8b5cf6] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-white/80 hover:text-[#8b5cf6] transition-colors"
              >
                About
              </Link>
              {/* <Link href="/settings" className="text-white/80 hover:text-[#8b5cf6] transition-colors">
                Pricing
              </Link> */}
              <SignUpButton>
                <button className="cursor-pointer text-white/90 hover:text-white transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
              <SignInButton>
                <button className="cursor-pointer rounded-full bg-[#6c3fc4] hover:bg-[#4c2d9e] text-white px-4 py-1.5 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                <Link href="/profile">
                  <img
                    src={user?.imageUrl}
                    alt="User avatar"
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-[#3d2d6b]"
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-white/80 hover:text-[#8b5cf6] transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </SignedIn>
          </nav>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pb-4 space-y-3">
            <SignedOut>
              <Link
                href="/"
                className="block text-white/80 hover:text-[#8b5cf6] transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="block text-white/80 hover:text-[#8b5cf6] transition-colors"
                onClick={closeMenu}
              >
                About
              </Link>
              {/* <Link href="/settings" className="block text-white/80 hover:text-[#8b5cf6] transition-colors" onClick={closeMenu}>
                Pricing
              </Link> */}
              <div className="flex flex-col gap-2 pt-2">
                <SignUpButton>
                  <button
                    className="cursor-pointer text-left text-white/90 hover:text-white transition-colors"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </button>
                </SignUpButton>
                <SignInButton>
                  <button
                    className="cursor-pointer text-left rounded-full bg-[#6c3fc4] hover:bg-[#4c2d9e] text-white px-4 py-1.5 w-fit transition-colors"
                    onClick={closeMenu}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={user?.imageUrl}
                  alt="User avatar"
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-[#3d2d6b]"
                />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white/80 hover:text-[#8b5cf6] transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </button>
              </div>
            </SignedIn>
          </div>
        )}
      </div>
    </header>
  );
}
