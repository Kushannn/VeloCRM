"use client";

import { Card, CardHeader, CardBody, Skeleton } from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { ProjectType, UserType } from "@/lib/types";
import { Calendar } from "lucide-react";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [project, setProject] = useState<ProjectType>();
  const params = useParams<{ orgId: string; projectId: string }>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProject = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const res = await fetch(`/api/project/get-project/${params.projectId}`);
        const data = await res.json();
        if (data.success) {
          setProject(data.project);
        }
      } catch (error) {
        console.log("Error getting the project", error);
      } finally {
        setLoading(false);
      }
    };

    getProject();
  }, []);

  useEffect(() => {
    console.log("project", loading);
  });

  return (
    <>
      <Card className="bg-[#191919] text-white w-[95vw] h-[70vh] m-6">
        <CardHeader className="flex flex-col items-start m-3">
          {loading ? (
            <>
              <div className="flex gap-10">
                <Skeleton className="h-8 w-[20vw] rounded-lg bg-gray-600" />
                <Skeleton className="h-[50px] w-[10vw] rounded-lg bg-gray-600" />
              </div>
              <Skeleton className="h-6 w-[10vw] rounded-lg bg-gray-600 mt-6" />
            </>
          ) : (
            <>
              <div className="flex justify-center items-center gap-2.5">
                <h1 className="text-5xl p-3">{project?.name}</h1>
                <div
                  className={`rounded-lg w-[10vw] h-[50px] p-2 font-bold text-xl  ${
                    project?.status === "ACTIVE"
                      ? "bg-gradient-to-br from-[#3a7bd5] to-[#3a6073] text-[#dbeafe]"
                      : project?.status === "ON HOLD"
                      ? "bg-gradient-to-br from-[#FF512F] to-[#F09819] text-[#fef3c7]"
                      : project?.status === "COMPLETED"
                      ? "bg-gradient-to-br from-[#11998e] to-[#38ef7d] text-[#bbf7d0]"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {project?.status}
                </div>
              </div>
              <div className="flex gap-2 p-3">
                Created At <Calendar />{" "}
                {project?.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </>
          )}
        </CardHeader>
        <CardBody className="flex flex-row gap-20">
          <Card className="w-[40%] relative bg-[#191919] h-full p-[2px] rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#ec4899_0%,#8b5cf6_25%,#3b82f6_50%,#8b5cf6_75%,#ec4899_100%)] animate-[border-spin_3s_linear_infinite] group-hover:[animation-play-state:paused] [--border-angle:0deg]" />

            <div className="relative bg-[#191919] h-full rounded-[calc(0.5rem-2px)]">
              <CardHeader>
                <h1 className="text-2xl p-3">Members</h1>
              </CardHeader>
            </div>
          </Card>

          <Card className="w-[40%] relative bg-[#191919] h-full p-[2px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#ec4899_0%,#8b5cf6_25%,#3b82f6_50%,#8b5cf6_75%,#ec4899_100%)] animate-[border-spin_3s_linear_infinite] [--border-angle:0deg]" />
            <div className="relative bg-[#191919] h-full rounded-[calc(0.5rem-2px)]">
              <CardHeader>
                <h1 className="text-2xl p-3">Sprints</h1>
              </CardHeader>
            </div>
          </Card>
        </CardBody>
      </Card>
    </>
  );
}
