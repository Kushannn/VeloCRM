"use client";

import { Card, CardBody, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { ProjectType, SprintType } from "@/lib/types";
import { Calendar, ClipboardList, Clock } from "lucide-react";
import CreateTask from "@/components/createTask/CreateTask";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [sprint, setSprint] = useState<SprintType>();
  const params = useParams<{
    orgId: string;
    projectId: string;
    sprintId: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [project, setProject] = useState<ProjectType>();

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

  useEffect(() => {
    fetchSprint();
    getProject();
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

  const renderTasks = (status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    const filtered = sprint?.tasks?.filter((t) => t.status === status) || [];

    if (!filtered.length) {
      return <p className="text-gray-500 italic">No tasks</p>;
    }

    return filtered.map((task) => (
      <Card
        key={task.id}
        className="bg-[#2a2a2a] border border-gray-700 hover:bg-[#333] transition"
      >
        <CardBody className="flex flex-col justify-between h-full">
          <div className="mb-3">
            <p className="text-white text-base font-semibold">{task.title}</p>
            <p className="text-sm text-gray-400">{task.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              Priority: {task.priority}
            </p>
          </div>

          <div className="flex justify-end">
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md ${
                task.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : task.status === "IN_PROGRESS"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>
        </CardBody>
      </Card>
    ));
  };

  return (
    <>
      <div className="px-3 min-h-screen space-y-6">
        {/* Sprint Info */}
        <div className="w-full bg-gradient-to-br from-[#121213] to-[#1c1d1e] p-4 rounded-xl">
          <div className="mb-4">
            <div className="flex items-center gap-5 flex-wrap">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-blue-500" />
                Sprint:
                <span className="text-gray-300 font-semibold">
                  {sprint?.title || "Untitled"}
                </span>
              </h1>

              <div className="flex items-center text-white">
                <Calendar />
                <span className="ml-2 mr-2">
                  {sprint?.startDate
                    ? new Date(sprint.startDate).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
                -
                <span className="ml-2">
                  {sprint?.endDate
                    ? new Date(sprint.endDate).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center text-white">
                <Clock className="ml-4" />
                <span className="ml-2">
                  {sprint?.startDate && sprint?.endDate
                    ? `${calculateDaysRemaining(
                        sprint.startDate,
                        sprint.endDate
                      )} days left`
                    : "N/A"}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-1">{sprint?.description}</p>
          </div>
        </div>

        {/* Task Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Tasks</h2>
          <Button
            onClick={() => setOpenTaskModal(true)}
            className="h-8 bg-gradient-to-r from-[#893168] to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-md shadow-purple-500/20"
          >
            + New Task
          </Button>
        </div>

        {/* Tasks Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Task Creation Modal */}
      <CreateTask
        isOpen={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        sprintId={params.sprintId}
        sprint={sprint!}
        project={project!}
        onTaskCreated={fetchSprint}
      />
    </>
  );
}
