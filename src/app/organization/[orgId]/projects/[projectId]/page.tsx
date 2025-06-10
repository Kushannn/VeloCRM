"use client";

import { Card, CardHeader, CardBody, Skeleton } from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { ProjectType } from "@/lib/types";
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

  return (
    <div className="w-full px-4 py-6">
      <Card className="bg-[#191919] text-white w-full max-w-7xl mx-auto">
        <CardHeader className="flex flex-col items-start m-4">
          {loading ? (
            <div className="w-full space-y-4">
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-8 w-full sm:w-1/2 rounded-lg bg-gray-600" />
                <Skeleton className="h-[50px] w-full sm:w-[150px] rounded-lg bg-gray-600" />
              </div>
              <Skeleton className="h-6 w-1/2 sm:w-[120px] rounded-lg bg-gray-600" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-start items-center gap-4">
                <h1 className="text-3xl sm:text-4xl p-2">{project?.name}</h1>
                <div
                  className={`rounded-lg px-4 py-2 text-center font-bold text-sm sm:text-lg ${
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
              <div className="flex items-center gap-2 mt-3 p-1 text-sm sm:text-base">
                Created At <Calendar className="w-4 h-4" />
                {project?.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </>
          )}
        </CardHeader>

        <CardBody className="flex flex-col lg:flex-row gap-6 px-4 pb-6">
          {/* Members Card */}
          <Card className="w-full lg:w-1/2 relative bg-[#191919] p-[2px] rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#ec4899_0%,#8b5cf6_25%,#3b82f6_50%,#8b5cf6_75%,#ec4899_100%)] animate-[border-spin_3s_linear_infinite] group-hover:[animation-play-state:paused] [--border-angle:0deg]" />
            <div className="relative bg-[#191919] rounded-[calc(0.5rem-2px)]">
              <CardHeader>
                <h1 className="text-xl sm:text-2xl p-3">Members</h1>
              </CardHeader>
            </div>
          </Card>

          {/* Sprints Card */}
          <Card className="w-full lg:w-1/2 relative bg-[#191919] p-[2px] rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#ec4899_0%,#8b5cf6_25%,#3b82f6_50%,#8b5cf6_75%,#ec4899_100%)] animate-[border-spin_3s_linear_infinite] group-hover:[animation-play-state:paused] [--border-angle:0deg]" />
            <div className="relative bg-[#191919] rounded-[calc(0.5rem-2px)]">
              <CardHeader>
                <h1 className="text-xl sm:text-2xl p-3">Sprints</h1>
              </CardHeader>
            </div>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
}
