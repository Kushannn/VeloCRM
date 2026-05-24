import { SignedIn, SignedOut } from "@clerk/nextjs";
import HomeSignedOutWrapper from "@/components/HomeSignedOutWrapper";

export default function HomePage() {
  return (
    <main className="p-6">
      <SignedIn>
        <p className="text-gray-500">Redirecting to dashboard...</p>
      </SignedIn>
      <SignedOut>
        <HomeSignedOutWrapper />
      </SignedOut>
    </main>
  );
}
