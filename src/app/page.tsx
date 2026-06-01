import { SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HomeSignedOut from "@/components/HomeSignedOut";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main>
      <SignedOut>
        <HomeSignedOut />
      </SignedOut>
    </main>
  );
}
