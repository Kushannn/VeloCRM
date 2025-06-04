"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useUser,
  Image,
  Divider,
  Link,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { UserType } from "@/lib/types";
import { useUserStore } from "@/stores/setUserStore";
import { Plus } from "lucide-react";
import { tr } from "framer-motion/client";
import CreateProject from "@/components/createProject/CreateProject";

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);
  const [openProjectModal, setOpenProjectModal] = useState(false);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="p-8 space-y-6">
        <div className="flex flex-row gap-4">
          <div>
            <h1 className="text-4xl">Projects</h1>
            <p>Track all the projects here!</p>
          </div>
          <div>
            <button
              className="flex cursor-pointer items-center gap-2 bg-[#0a2540cc] text-sky-300 hover:bg-black p-2 rounded-md font-bold"
              onClick={() => {
                setOpenProjectModal(true);
              }}
            >
              <Plus /> <span>Create New</span>
            </button>
          </div>
        </div>

        <div>
          <div>
            <Card className="max-w-[400px] bg-[#4b4646]">
              <CardBody className="flex gap-3">
                <div className="flex justify-evenly items-center w-full">
                  <div className="flex flex-col">
                    <p className="text-3xl">Active</p>
                    <p className="text-small text-default-500">
                      Currently Active Projects
                    </p>
                  </div>
                  <div className="text-2xl">12</div>
                </div>
              </CardBody>
              <Divider />
              <Divider />
            </Card>
          </div>
        </div>
      </div>

      <CreateProject
        isOpen={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
      />
    </>
  );
}
