"use client";

import CreateSprint from "@/components/createSprint/CreateSprint";
import { ProjectType } from "@/lib/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Progress,
  Skeleton,
} from "@heroui/react";
import { ArrowBigRight, BookCheck, Calendar, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  project: ProjectType | null;
  orgSlug: string;
  projectSlug: string;
  user: any;
};

export default function SingleProjectDetails({
  project,
  orgSlug,
  projectSlug,
  user,
}: Props) {
  const router = useRouter();
  const [openSprintModal, setOpenSprintModal] = useState(false);

  function getProgress(startDate: Date, endDate: Date) {
    const currentDate = new Date();
    const totalDuration =
      new Date(endDate).getTime() - new Date(startDate).getTime();
    const timePassed = currentDate.getTime() - new Date(startDate).getTime();

    const percentage = Math.min(
      100,
      Math.max(0, (timePassed / totalDuration) * 100),
    );

    return percentage;
  }

  return (
    <div className="w-full px-4">
      <Card className="bg-gradient-to-br from-[#1d1d1e] to-[#1c1d1e]   w-full max-w-7xl mx-auto">
        <CardHeader className="flex flex-col items-start m-4">
          <>
            <div className="flex flex-wrap justify-start items-center gap-4">
              <h1 className="text-3xl sm:text-4xl font-semibold p-2">
                {project?.name}
              </h1>
              <div
                className={`rounded-lg px-4 py-2 text-center font-bold text-sm sm:text-lg ${
                  project?.status === "ACTIVE"
                    ? "bg-gradient-to-br from-[#3a7bd5] to-[#3a6073] text-[#dbeafe]"
                    : project?.status === "ON HOLD"
                      ? "bg-gradient-to-br from-[#FF512F] to-[#F09819] text-[#fef3c7]"
                      : project?.status === "COMPLETED"
                        ? "bg-gradient-to-br from-[#11998e] to-[#38ef7d] text-[#bbf7d0]"
                        : "bg-gray-600  "
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
        </CardHeader>

        <CardBody className="flex flex-col lg:flex-row items-start gap-6 px-4 pb-6">
          <Card className="w-full lg:w-1/2 relative bg-[#191919] p-[2px] rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#B33791_0%,#C562AF_25%,#DB8DD0_50%,#B33791_75%,#B33791_100%)] animate-[border-spin_3s_linear_infinite] group-hover:[animation-play-state:paused] [--border-angle:0deg]" />
            <div className="relative bg-[#191919] rounded-[calc(0.5rem-2px)]">
              <CardHeader>
                <div className="flex flex-col w-full">
                  <div className="flex flex-row items-center pl-2">
                    <Users className="text-[#8c75ff]" />
                    <h1 className="text-xl sm:text-2xl p-3 text-left">
                      Members
                    </h1>
                  </div>
                  <Divider className="w-full bg-gray-700" />
                </div>
              </CardHeader>
              <CardBody>
                {project?.projectUsers?.map((projectUser) => (
                  <>
                    <div
                      key={projectUser?.id}
                      className="flex items-center justify-between p-3 bg-[#262626] rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        {projectUser?.user?.image ? (
                          <img
                            src={projectUser?.user?.image}
                            alt={projectUser?.user?.name ?? "User"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-500   flex items-center justify-center">
                            {projectUser?.user?.name?.charAt(0).toUpperCase() ??
                              "U"}
                          </div>
                        )}
                        <div>
                          <p className="  font-semibold">
                            {projectUser?.user?.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {projectUser?.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </CardBody>
            </div>
          </Card>

          <Card className="w-full lg:w-1/2 relative bg-[#191919] p-[2px] rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-[conic-gradient(from_var(--border-angle),#B33791_0%,#C562AF_25%,#DB8DD0_50%,#B33791_75%,#B33791_100%)] animate-[border-spin_3s_linear_infinite] group-hover:[animation-play-state:paused] [--border-angle:0deg]" />
            <div className="relative bg-[#191919] rounded-[calc(0.5rem-2px)]">
              <CardHeader className="flex flex-col">
                <div className="flex justify-between items-center w-full px-3">
                  <div className="flex items-center">
                    <BookCheck className="text-[#4a2040]" />
                    <h1 className="text-xl sm:text-2xl p-3">Sprints</h1>
                  </div>
                  <Button
                    className="h-8 bg-gradient-to-r from-[#893168] to-purple-700 hover:from-purple-600 hover:to-purple-800   shadow-md shadow-purple-500/20"
                    onClick={() => setOpenSprintModal(true)}
                  >
                    <Plus /> <span>Create New</span>
                  </Button>
                </div>
                <Divider className="my-2 bg-gray-700" />
              </CardHeader>

              <CardBody>
                {project?.sprints?.map((sprint) => (
                  <div
                    key={sprint?.id}
                    className="flex flex-col items-start justify-between p-4 bg-[#262626] rounded-lg border border-gray-700 w-full"
                  >
                    <div className="flex flex-col gap-1 text-left w-full">
                      <p className="  font-semibold text-lg">{sprint?.title}</p>
                      <p className="text-sm text-gray-400">
                        {sprint?.description}
                      </p>
                    </div>

                    <div className="w-full mt-4">
                      <Progress
                        aria-label="Sprint Progress"
                        color="secondary"
                        className="w-full"
                        value={getProgress(sprint?.startDate, sprint?.endDate)}
                      />
                    </div>

                    <div className="font-medium text-gray-400 mt-5 flex justify-between items-center w-full">
                      <div className="flex gap-2">
                        <span>
                          {new Date(sprint?.startDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span>-</span>
                        <span>
                          {new Date(sprint?.endDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/organization/${orgSlug}/projects/${projectSlug}/sprint/${sprint?.slug}`,
                          )
                        }
                      >
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
        projectId={project?.id ? project?.id : ""}
        userId={user?.id ? user?.id : ""}
      />
    </div>
  );
}
