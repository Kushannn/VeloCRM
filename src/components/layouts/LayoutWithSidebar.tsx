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
    <div className="min-h-screen flex flex-col bg-[#09080f]">
      <Navbar />

      <div className="flex flex-1">
        {!isPublicRoute && (
          <>
            {/* Desktop sidebar - fixed, visible sm+ */}
            <div
              className="hidden sm:block fixed top-16 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out"
              style={{ width: isSidebarExpanded ? "240px" : "64px" }}
            >
              <Sidebar onExpandChange={setIsSidebarExpanded} />
            </div>

            {/* Mobile sidebar - slide-in drawer */}
            <div
              className={`${showSidebar ? "translate-x-0" : "-translate-x-full"} sm:hidden fixed inset-y-0 left-0 w-64 z-50 transition-transform duration-300`}
            >
              <Sidebar onExpandChange={setIsSidebarExpanded} />
            </div>

            {/* Mobile backdrop */}
            {showSidebar && (
              <div
                className="fixed inset-0 bg-black/50 sm:hidden z-40"
                onClick={() => setShowSidebar(false)}
              />
            )}
          </>
        )}

        <main
          className="flex-1 min-w-0 overflow-x-hidden p-2 sm:p-6 transition-all duration-300 ease-in-out
             ml-0 sm:ml-(--sidebar-w)"
          style={
            {
              "--sidebar-w": isPublicRoute
                ? "0px"
                : isSidebarExpanded
                  ? "240px"
                  : "64px",
            } as React.CSSProperties
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
