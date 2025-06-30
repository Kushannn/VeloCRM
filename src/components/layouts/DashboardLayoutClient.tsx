"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative flex flex-col sm:flex-row min-h-screen bg-[#121212] text-white">
      <div className="flex items-center justify-between sm:hidden px-4 py-3 bg-[#1f1f1f] border-b border-gray-800">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <button onClick={() => setShowSidebar(!showSidebar)}>
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 sm:hidden z-40"
          onClick={() => setShowSidebar(false)}
          style={{ marginLeft: "16rem" }}
        />
      )}

      <main className="flex-1 p-4 sm:p-6 sm:ml-0">{children}</main>
    </div>
  );
}
