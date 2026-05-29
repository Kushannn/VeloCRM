import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HomeSignedOutWrapper from "@/components/HomeSignedOutWrapper";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main>
      <SignedOut>
        <HomeSignedOutWrapper />
      </SignedOut>
    </main>
  );
}
