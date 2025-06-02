"use client";

import { Card, CardHeader, CardBody, CardFooter, useUser } from "@heroui/react";
import { useEffect, useState } from "react";
import { UserType } from "@/lib/types";
import { useUserStore } from "@/stores/setUserStore";

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);

  const setUserGlobal = useUserStore((state) => state.setUser);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/get-user");
      const data = await res.json();
      setUser(data);
      setUserGlobal(data);
    }
    fetchUser();
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Welcome back, {user.name} 👋
        </h1>
        <p className="text-gray-400">Here’s your CRM dashboard overview</p>
      </div>

      <div className="flex flex-row gap-10">
        {/* Recent Activity */}
        <Card className="bg-[#141414] w-xl">
          <CardHeader className="border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">
              Recent Activity
            </h2>
          </CardHeader>
          <CardBody className="text-[#B0B0B0] space-y-2">
            <p>✅ You closed a deal with XYZ Corp.</p>
            <p>📞 Follow-up call with Emma completed.</p>
            <p>📩 Sent email to new lead: Ankit Patel.</p>
          </CardBody>
        </Card>

        {/* Task Overview */}
        <Card className="bg-[#141414] w-xl">
          <CardHeader className="border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Today's Tasks</h2>
          </CardHeader>
          <CardBody>
            <ul className="text-[#B0B0B0] list-disc pl-6 space-y-2">
              <li>Call lead: John Doe</li>
              <li>Prepare proposal for ACME Corp</li>
              <li>Email follow-up to Sam</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
