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

  return (
    <>
      <div className="px-3 min-h-screen flex gap-6">
        {/* Sprint Sidebar */}
        <div className="w-60 space-y-6 bg-gradient-to-br from-[#121213] to-[#1c1d1e] p-3 min-h-screen rounded-xl">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-500" />
              Sprint:{" "}
              <span className="text-gray-300 font-semibold">
                {sprint?.title || "Untitled"}
              </span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">{sprint?.description}</p>
          </div>

          <Card className="bg-[#1E1E1E] border border-gray-700">
            <CardBody className="text-center">
              <p className="text-sm text-gray-400">Start Date</p>
              <div className="flex justify-center items-center gap-2 text-white mt-2">
                <Calendar className="w-5 h-5" />
                {sprint?.startDate
                  ? new Date(sprint?.startDate).toLocaleDateString()
                  : "N/A"}
              </div>
            </CardBody>
          </Card>

          <Card className="bg-[#1E1E1E] border border-gray-700">
            <CardBody className="text-center">
              <p className="text-sm text-gray-400">End Date</p>
              <div className="flex justify-center items-center gap-2 text-white mt-2">
                <Calendar className="w-5 h-5" />
                {sprint?.endDate
                  ? new Date(sprint?.endDate).toLocaleDateString()
                  : "N/A"}
              </div>
            </CardBody>
          </Card>

          <Card className="bg-[#1E1E1E] border border-gray-700">
            <CardBody className="text-center">
              <p className="text-sm text-gray-400">Days Remaining</p>
              <div className="flex justify-center items-center gap-2 text-white mt-2">
                <Clock className="w-5 h-5" />
                {sprint?.startDate && sprint?.endDate
                  ? calculateDaysRemaining(sprint.startDate, sprint.endDate)
                  : "N/A"}{" "}
                days
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Tasks Section */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Tasks</h2>
            <Button
              onClick={() => setOpenTaskModal(true)}
              className="h-8 bg-gradient-to-r from-[#893168] to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-md shadow-purple-500/20"
            >
              + New Task
            </Button>
          </div>

          <Card className="bg-[#1E1E1E] border border-gray-700">
            <CardBody>
              {sprint?.tasks?.length ? (
                <div className="flex flex-col gap-4">
                  {sprint.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl px-6 py-4 flex items-center justify-between bg-[#2a2a2a] hover:bg-[#333] transition border border-gray-700"
                    >
                      <div className="flex-1 min-w-[150px]">
                        <p className="text-xs text-gray-400 uppercase">Task</p>
                        <p className="text-white font-medium text-base">
                          {task.title}
                        </p>
                      </div>

                      <div className="flex-1 min-w-[100px]">
                        <p className="text-xs text-gray-400 uppercase">
                          Estimate
                        </p>
                        <p className="text-white font-medium">2d 4h</p>
                      </div>

                      <div className="flex-1 min-w-[80px]">
                        <p className="text-xs text-gray-400 uppercase">
                          Assignee
                        </p>
                        <img
                          src="/avatar.jpg"
                          alt="User"
                          className="w-8 h-8 rounded-full border border-gray-600 mt-1"
                        />
                      </div>

                      <div className="flex-1 min-w-[60px]">
                        <p className="text-xs text-gray-400 uppercase">
                          Priority
                        </p>
                        <p
                          className={`flex items-center gap-1 font-semibold text-sm ${
                            task.priority === "HIGH"
                              ? "text-red-500"
                              : task.priority === "MEDIUM"
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          ↑ {task.priority}
                        </p>
                      </div>

                      <div className="min-w-[80px] pr-4">
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-lg">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center italic py-6">
                  💤 No tasks found for this sprint.
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal */}
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
