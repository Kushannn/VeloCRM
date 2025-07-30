"use client";

import { Card, CardBody, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { ProjectType, SprintType } from "@/lib/types";
import { Calendar, ClipboardList, Clock } from "lucide-react";
import CreateTask from "@/components/createTask/CreateTask";
import useFetchSingleProject from "@/hooks/useFetchSingleProject";
import SprintBoard from "@/components/sprint/SprintBoard";

export default function DashboardPage() {
  const selectedProject = useAppSelector(
    (state) => state.projects.selectedProject
  );
  const [sprint, setSprint] = useState<SprintType>();
  const params = useParams<{
    orgId: string;
    projectId: string;
    sprintId: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  // const [project, setProject] = useState<ProjectType>();

  const fetchSprint = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/project/${params.projectId}/sprint/${params.sprintId}/get-sprint`
      );
      const data = await res.json();
      if (data.success) {
        setSprint(data.sprint);
      }
    } catch (error) {
      console.log("Error getting the sprint");
    } finally {
      setLoading(false);
    }
  };

  useFetchSingleProject(selectedProject ? "" : params.projectId);

  useEffect(() => {
    fetchSprint();
  }, []);

  const calculateDaysRemaining = (
    startDate: string | Date,
    endDate: string | Date
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (today < start) {
      return Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
    } else if (today > end) {
      return 0;
    } else {
      return Math.ceil(
        (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
  };

  // const renderTasks = (status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
  //   const filtered = sprint?.tasks?.filter((t) => t.status === status) || [];

  //   if (!filtered.length) {
  //     return <p className="text-gray-500 italic">No tasks</p>;
  //   }

  //   return filtered.map((task) => (
  //     <Card
  //       key={task.id}
  //       className="bg-[#2a2a2a] border border-gray-700 hover:bg-[#333] transition"
  //     >
  //       <CardBody className="flex flex-col justify-between h-full">
  //         <div className="mb-3">
  //           <p className="text-white text-base font-semibold">{task.title}</p>
  //           <p className="text-sm text-gray-400">{task.description}</p>
  //           <p className="text-xs text-gray-500 mt-1">
  //             Priority: {task.priority}
  //           </p>
  //         </div>

  //         <div className="flex justify-end">
  //           <span
  //             className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md ${
  //               task.status === "PENDING"
  //                 ? "bg-yellow-100 text-yellow-800"
  //                 : task.status === "IN_PROGRESS"
  //                 ? "bg-blue-100 text-blue-800"
  //                 : "bg-green-100 text-green-800"
  //             }`}
  //           >
  //             {task.status.replace("_", " ")}
  //           </span>
  //         </div>
  //       </CardBody>
  //     </Card>
  //   ));
  // };

  return (
    <>
      <div className="px-3 min-h-screen space-y-6">
        <div className="w-full bg-gradient-to-br from-[#121213] to-[#1c1d1e] p-4 rounded-xl space-y-5">
          {/* Sprint title row */}
          <div className="flex items-center gap-2 flex-wrap">
            <ClipboardList className="w-10 ml-2 mr-2 h-10 text-blue-500" />
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              Sprint:{" "}
              <span className="text-gray-300 font-semibold md:text-4xl">
                {sprint?.title || "Untitled"}
              </span>
            </h1>
          </div>

          {/* Date and countdown row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white ml-1">
            <div className="flex items-center gap-2 text-base md:text-xl">
              <Calendar className="w-4 h-4" />
              <span>
                {sprint?.startDate
                  ? new Date(sprint.startDate).toLocaleDateString("en-GB")
                  : "N/A"}
              </span>
              <span> - </span>
              <span>
                {sprint?.endDate
                  ? new Date(sprint.endDate).toLocaleDateString("en-GB")
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-base md:text-xl">
              <Clock className="w-4 h-4" />
              <span>
                {sprint?.startDate && sprint?.endDate
                  ? `${calculateDaysRemaining(
                      sprint.startDate,
                      sprint.endDate
                    )} days left`
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Description row */}
          {sprint?.description && (
            <p className="text-gray-400 text-sm md:text-lg ml-1">
              {sprint.description}
            </p>
          )}
        </div>

        <SprintBoard sprint={sprint!} project={selectedProject!} />
      </div>

      {/* Task Header */}
      {/* <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Tasks</h2>
          <Button
            onClick={() => setOpenTaskModal(true)}
            className="h-8 bg-gradient-to-r from-[#893168] to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-md shadow-purple-500/20"
          >
            + New Task
          </Button>
        </div> */}

      {/* Tasks Columns */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1E1E1E] rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">To-Do</h3>
            {renderTasks("PENDING")}
          </div>
          <div className="bg-[#1E1E1E] rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">
              In Development
            </h3>
            {renderTasks("IN_PROGRESS")}
          </div>
          <div className="bg-[#1E1E1E] rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Completed</h3>
            {renderTasks("COMPLETED")}
          </div>
        </div>
      </div> */}

      {/* Task Creation Modal */}
      {/* <CreateTask
        isOpen={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        sprintId={params.sprintId}
        sprint={sprint!}
        project={selectedProject!}
        onTaskCreated={fetchSprint}
      /> */}
    </>
  );
}
