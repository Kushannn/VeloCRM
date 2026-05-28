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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const pathname = usePathname();

  const noSidebarRoutes = ["/", "/sign-in", "/sign-up"];
  const isPublicRoute = noSidebarRoutes.includes(pathname);

  return (
    <div className="h-screen flex flex-col bg-[#09080f]">
      <Navbar />
      {!isPublicRoute && (
        <div className="flex items-center justify-between sm:hidden px-4 py-3 bg-[#111111] border-b border-[#1f1f1f]">
          <h1 className="text-lg font-bold">VeloCRM</h1>
          <button onClick={() => setShowSidebar(!showSidebar)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {!isPublicRoute && (
          <>
            <div
              className="hidden sm:block fixed top-16 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out"
              style={{ width: isSidebarExpanded ? "240px" : "64px" }}
            >
              <Sidebar onExpandChange={setIsSidebarExpanded} />
            </div>
            <div
              className={`${showSidebar ? "translate-x-0" : "-translate-x-full"} sm:hidden fixed inset-y-0 left-0 w-64 z-50 transition-transform duration-300`}
            >
              <Sidebar onExpandChange={setIsSidebarExpanded} />
            </div>
            {showSidebar && (
              <div
                className="fixed inset-0 bg-black/50 sm:hidden z-40"
                onClick={() => setShowSidebar(false)}
              />
            )}
          </>
        )}
        <main
          className="flex-1 p-2 sm:p-6 overflow-auto transition-all duration-300 ease-in-out"
          style={{
            marginLeft: isPublicRoute
              ? 0
              : isSidebarExpanded
                ? "240px"
                : "64px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
