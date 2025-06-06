import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server"; // or your auth provider
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/"); // or to /sign-in
  }

  return (
    <>
      <div className="flex min-h-screen bg-[#121212] text-white">
        {/* Optional Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}
