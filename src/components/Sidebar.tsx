"use client";

import React, { useEffect, useState } from "react";
import { Building, Home, BookCheck } from "lucide-react";
import CreateOrganization from "./createOrganization/CreateOrganization";
// import { UserType } from "@/lib/types";
import { useUserStore } from "@/stores/setUserStore";

function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [organizationName, setOrganizationName] = useState<string | null>(null);

  const user = useUserStore((state) => state.user);

  // const [user, setUser] = useState<UserType | null>(null);

  // useEffect(() => {
  //   const user = useUserStore((state) => state.user);
  //   setUser(user);
  // }, []);

  return (
    <>
      <div className="w-64 p-4 flex flex-col gap-4">
        <div
          className="h-14 cursor-pointer mt-4 font-bold text-lg p-2 hover:bg-[#171717] rounded-md text-white flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span>
            <Building />
          </span>
          <span>
            {user?.ownedOrganizations
              ? user.ownedOrganizations[0].name
              : "Create an organization"}
          </span>
        </div>
        <div className="flex h-14 rounded-md gap-4 items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2">
          <Home className="text-sky-300" />
          Home
        </div>
        <div className="flex gap-4 h-14 rounded-md items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2">
          <BookCheck className="text-sky-300" />
          Tasks
        </div>
        <div className="flex rounded-md gap-4 h-14 items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2">
          <Home className="text-sky-300" />
          Leads
        </div>
        <div className="flex gap-4 h-14 rounded-md items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2">
          <Home className="text-sky-300" />
          Dashboard
        </div>
        <div className="flex gap-4 h-14 rounded-md items-center font-bold bg-[#0a2540cc] text-sky-300 hover:bg-black p-2">
          <Home className="text-sky-300" />
          Home
        </div>
      </div>

      <CreateOrganization
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setOrganizationName={setOrganizationName}
      />
    </>
  );
}

export default Sidebar;
