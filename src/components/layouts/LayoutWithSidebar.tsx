"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LayoutWithSidebar({
  children,
}: {
  children: ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();

  const noSidebarRoutes = ["/", "/sign-in", "/sign-up"];
  const isPublicRoute = noSidebarRoutes.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Navbar />

      {!isPublicRoute && (
        <div className="flex items-center justify-between sm:hidden px-4 py-3 bg-[#1f1f1f] border-b border-gray-800">
          <h1 className="text-lg font-bold">VeloCRM</h1>
          <button onClick={() => setShowSidebar(!showSidebar)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {!isPublicRoute && (
          <div
            className={`${
              showSidebar ? "block" : "hidden"
            } sm:block w-64 transition-all duration-300 z-50 sm:z-auto fixed sm:relative inset-y-0 left-0`}
          >
            <Sidebar />
          </div>
        )}

        {!isPublicRoute && showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 sm:hidden z-40"
            onClick={() => setShowSidebar(false)}
            style={{ marginLeft: "16rem" }}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 sm:ml-0">{children}</main>
      </div>
    </div>
  );
}
