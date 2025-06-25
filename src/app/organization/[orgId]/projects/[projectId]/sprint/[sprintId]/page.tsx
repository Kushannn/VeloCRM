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
import { ProjectType, SprintType } from "@/lib/types";
import {
  ArrowBigRight,
  Calendar,
  ClipboardList,
  Clock,
  Plus,
  Users,
} from "lucide-react";
import CreateSprint from "@/components/createSprint/CreateSprint";
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
  const [openSprintModal, setOpenSprintModal] = useState(false);
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

  useEffect(() => {
    console.log("sprint", sprint);
  });

  return (
    <>
      <div className="p-6">
        {/* Sprint Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-blue-500" />
            Sprint: {sprint?.title || "Untitled"}
          </h1>
          <p className="text-gray-400 mt-2">{sprint?.description}</p>
        </div>

        {/* Sprint Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#1E1E1E] hover:shadow-lg transition">
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

          <Card className="bg-[#1E1E1E] hover:shadow-lg transition">
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

          <Card className="bg-[#1E1E1E] hover:shadow-lg transition">
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

        <div>
          <Card className="bg-[#1E1E1E]">
            <CardHeader className="text-xl font-semibold text-white flex gap-5">
              Tasks
              <Button
                onClick={() => setOpenTaskModal(true)}
                color="primary"
                className="h-8"
              >
                + New Task
              </Button>
            </CardHeader>
            <CardBody className="grid gap-4">
              {sprint?.tasks?.length ? (
                sprint.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-700 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition w-56 h-40"
                  >
                    <h3 className="text-white font-medium text-lg">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-400">{task.description}</p>
                    <div className="text-sm mt-2 text-gray-300 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Status:</span>
                        <span className="bg-blue-600 px-2 py-0.5 rounded text-white text-xs">
                          {task.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Priority:</span>
                        <span
                          className={`px-2 py-0.5 rounded text-white text-xs ${
                            task.priority === "HIGH"
                              ? "bg-red-600"
                              : task.priority === "MEDIUM"
                              ? "bg-yellow-500"
                              : "bg-green-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        Assigned to:
                      </span>
                      {/* {task?.assignedToId?.map((user) => (
                        <img
                          key={user.id}
                          src={user.image || "/default-avatar.png"}
                          alt={user.name || "User"}
                          className="w-8 h-8 rounded-full border border-gray-600 object-cover"
                          title={user.name}
                        />
                      ))} */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tasks found for this sprint.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <CreateTask
        isOpen={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        sprintId={params.sprintId}
        sprint={sprint!}
        project={project!}
        onTaskCreated={() => {
          fetchSprint();
        }}
      />
    </>
  );
}
