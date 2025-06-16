"use client";

import HomeSignedOut from "@/components/HomeSignedOut";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { Router } from "next/router";

export default function HomePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <>
      <main className="p-6">
        <SignedIn>
          {/* While redirecting, we can show a placeholder */}
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </SignedIn>

        <SignedOut>
          <HomeSignedOut />
        </SignedOut>
      </main>
    </>
  );
}
