"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  Divider,
  Progress,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { ProjectType } from "@/lib/types";
import { ArrowBigRight, BookCheck, Calendar, Plus, Users } from "lucide-react";
import CreateSprint from "@/components/createSprint/CreateSprint";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [project, setProject] = useState<ProjectType>();
  const params = useParams<{ orgId: string; projectId: string }>();
  const [loading, setLoading] = useState(false);
  const [openSprintModal, setOpenSprintModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getProject = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const res = await fetch(`/api/project/${params.projectId}/get-project`);
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
  }, [params.projectId]);

  function getProgress(startDate: Date, endDate: Date) {
    const currentDate = new Date();
    const totalDuration =
      new Date(endDate).getTime() - new Date(startDate).getTime();
    const timePassed = currentDate.getTime() - new Date(startDate).getTime();

    const percentage = Math.min(
      100,
      Math.max(0, (timePassed / totalDuration) * 100)
    );
    return percentage;
  }

  return (
    <div className="w-full px-4">
      <Card className="w-full mx-auto text-white bg-transparent">
        <CardHeader className="flex flex-col items-start space-y-2">
          {loading ? (
            <div className="w-full space-y-4">
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-8 w-full sm:w-1/2 rounded-lg bg-gray-700" />
                <Skeleton className="h-[50px] w-full sm:w-[150px] rounded-lg bg-gray-700" />
              </div>
              <Skeleton className="h-6 w-1/2 sm:w-[120px] rounded-lg bg-gray-700" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="p-2 text-4xl sm:text-5xl font-extrabold tracking-wide">
                  {project?.name}
                </h1>
                <div
                  className={`rounded-lg px-5 py-2 text-center font-semibold text-sm sm:text-lg tracking-wide ${
                    project?.status === "ACTIVE"
                      ? "bg-gradient-to-br from-[#3a7bd5] to-[#3a6073] text-[#dbeafe]"
                      : project?.status === "ON HOLD"
                      ? "bg-gradient-to-br from-[#FF512F] to-[#F09819] text-[#fef3c7]"
                      : project?.status === "COMPLETED"
                      ? "bg-gradient-to-br from-[#11998e] to-[#38ef7d] text-[#bbf7d0]"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {project?.status}
                </div>
              </div>
              <div className="flex items-center gap-2 p-1 text-sm sm:text-lg text-neutral-300">
                <Calendar className="w-5 h-5" />
                <span>
                  {project?.createdAt
                    ? "Created At :  " +
                      new Date(project.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </>
          )}
        </CardHeader>

        <CardBody className="flex flex-col lg:flex-row items-start gap-6 px-4 pb-6">
          {/* Members Card */}
          <Card className="w-full lg:w-1/2 relative rounded-lg p-[2px] overflow-hidden group bg-[#1f1a2e] border border-[#4a305c] shadow-lg shadow-[#3a2b63cc] self-start">
            <div
              className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#B33791_0%,#C562AF_25%,#DB8DD0_50%,#B33791_75%,#B33791_100%)] animate-[border-spin_3s_linear_infinite] group-hover:[animation-play-state:paused]"
              style={{ "--border-angle": "0deg" } as React.CSSProperties}
            />
            <div className="relative rounded-lg bg-[#1c172c] p-4">
              <CardHeader className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Users className="text-[#b58eff]" />
                  <h1 className="text-xl sm:text-2xl font-semibold">Members</h1>
                </div>
                <Divider className="my-2 border-gray-700" />
              </CardHeader>
              <CardBody className="space-y-3 max-h-[420px] overflow-auto">
                {project?.projectUsers?.map((projectUser) => (
                  <div
                    key={projectUser?.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-[#2a223f]"
                  >
                    <div className="flex items-center gap-4">
                      {projectUser?.user?.image ? (
                        <img
                          src={projectUser?.user?.image}
                          alt={projectUser?.user?.name}
                          className="w-10 h-10 rounded-full object-cover shadow-md"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white font-semibold text-lg shadow-md">
                          {projectUser?.user?.name?.charAt(0).toUpperCase() ??
                            "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white">
                          {projectUser?.user?.name}
                        </p>
                        <p className="text-sm text-gray-400 truncate max-w-[200px]">
                          {projectUser?.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </div>
          </Card>

          {/* Sprints Card */}
          <Card className="w-full lg:w-1/2 relative rounded-lg p-[2px] overflow-hidden group bg-[#1f1a2e] border border-[#4a305c] shadow-lg shadow-[#3a2b63cc] self-start">
            <div
              className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#B33791_0%,#C562AF_25%,#DB8DD0_50%,#B33791_75%,#B33791_100%)] animate-[border-spin_3s_linear_infinite] group-hover:[animation-play-state:paused]"
              style={{ "--border-angle": "0deg" } as React.CSSProperties}
            />
            <div className="relative rounded-lg bg-[#1c172c] p-4 flex flex-col">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookCheck className="text-[#b58eff]" />
                  <h1 className="text-xl sm:text-2xl font-semibold">Sprints</h1>
                </div>
                <Button
                  className="h-9 bg-gradient-to-r from-[#893168] to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-md shadow-purple-500/30"
                  onClick={() => setOpenSprintModal(true)}
                >
                  <Plus /> <span>Create New</span>
                </Button>
              </CardHeader>
              <Divider className="my-2 border-gray-700" />
              <CardBody className="space-y-4 max-h-[520px] overflow-auto">
                {project?.sprints?.map((sprint) => (
                  <div
                    key={sprint?.id}
                    className="flex flex-col justify-between gap-2 p-4 rounded-lg border border-gray-700 bg-[#2a223f] shadow-sm transition hover:shadow-md cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/organization/${params.orgId}/projects/${params.projectId}/sprint/${sprint?.id}`
                      )
                    }
                  >
                    <div className="w-full">
                      <p className="text-lg font-semibold text-white truncate">
                        {sprint?.title}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {sprint?.description}
                      </p>
                    </div>

                    <Progress
                      aria-label="Sprint Progress"
                      color="secondary"
                      className="w-full mt-3"
                      value={getProgress(sprint?.startDate, sprint?.endDate)}
                    />

                    <div className="mt-4 flex justify-between items-center text-gray-400 font-medium text-sm select-none">
                      <div className="flex gap-2 whitespace-nowrap">
                        <span>
                          {new Date(sprint?.startDate).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "long", year: "numeric" }
                          )}
                        </span>
                        <span>-</span>
                        <span>
                          {new Date(sprint?.endDate).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "long", year: "numeric" }
                          )}
                        </span>
                      </div>
                      <div className="cursor-pointer hover:text-purple-400">
                        <ArrowBigRight />
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </div>
          </Card>
        </CardBody>
      </Card>

      <CreateSprint
        isOpen={openSprintModal}
        onClose={() => setOpenSprintModal(false)}
        projectId={project?.id ?? ""}
        userId={user?.id ?? ""}
      />
    </div>
  );
}
