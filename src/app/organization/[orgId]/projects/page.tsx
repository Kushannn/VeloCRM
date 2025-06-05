"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Chip,
} from "@heroui/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useUserStore } from "@/stores/setUserStore";
import { CircleUser, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import CreateProject from "@/components/createProject/CreateProject";
import debounce from "lodash/debounce";

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const params = useParams() as { orgId: string };
  const orgId = params.orgId;
  const [projects, setProjects] = useState([]);

  const [openOptions, setOpenOptions] = useState<string | null>(null);

  useEffect(() => {
    const getProjects = async () => {
      if (!orgId) return;

      try {
        const res = await fetch(`/api/get-projects/${orgId}`);
        const data = await res.json();
        if (data.projects) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    getProjects();
  }, [orgId]);

  const debouncedStatusUpdate = useRef(
    debounce(async (projectId: string, newStatus: string) => {
      try {
        const res = await fetch(`/api/upate-project-status/${projectId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) {
          throw new Error("Failed to update project status");
        }
        const data = await res.json();
      } catch (err) {
        console.error("Debounced status update failed:", err);
      }
    }, 2000)
  ).current;

  const handleProjectStatusChange = (projectId: string, newStatus: string) => {
    debouncedStatusUpdate(projectId, newStatus);
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="p-8 space-y-6">
        <div className="flex flex-row gap-4">
          <div>
            <h1 className="text-4xl">Projects</h1>
            <p>Track all the projects here!</p>
          </div>
          <button
            className="flex cursor-pointer items-center gap-2 bg-[#0a2540cc] text-sky-300 hover:bg-black p-2 rounded-md font-bold"
            onClick={() => setOpenProjectModal(true)}
          >
            <Plus /> <span>Create New</span>
          </button>
        </div>

        <div className="flex flex-row gap-10 w-full">
          {[
            {
              label: "Active",
              color: "from-[#3a7bd5] to-[#3a6073]",
              text: "#dbeafe",
            },
            {
              label: "On Hold",
              color: "from-[#FF512F] to-[#F09819]",
              text: "#fef3c7",
            },
            {
              label: "Completed",
              color: "from-[#11998e] to-[#38ef7d]",
              text: "#bbf7d0",
            },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className={`w-[20vw] bg-gradient-to-br ${stat.color} text-[${stat.text}]`}
            >
              <CardBody className="flex gap-3">
                <div className="flex justify-evenly items-center w-full">
                  <div className="flex flex-col">
                    <p className="text-3xl">{stat.label}</p>
                    <p className="text-small">{stat.label} Projects</p>
                  </div>
                  <div className="text-2xl">12</div>
                </div>
              </CardBody>
              <Divider />
            </Card>
          ))}
        </div>

        <div>
          {projects.length === 0 ? (
            <p className="text-center text-gray-400">No projects found.</p>
          ) : (
            projects.map((project: any, index: number) => (
              <Card
                key={project.id || index}
                className={`w-[30vw] p-2 mb-6 ${
                  project.status === "ACTIVE"
                    ? "bg-gradient-to-br from-[#3a7bd5] to-[#3a6073] text-[#dbeafe]"
                    : project.status === "ON HOLD"
                    ? "bg-gradient-to-br from-[#FF512F] to-[#F09819] text-[#fef3c7]"
                    : project.status === "COMPLETED"
                    ? "bg-gradient-to-br from-[#11998e] to-[#38ef7d] text-[#bbf7d0]"
                    : "bg-gray-600 text-white"
                }`}
              >
                <CardHeader className="flex justify-between items-center">
                  {user.ownedOrganizations?.some(
                    (org: any) =>
                      org.id === project.organizationId ||
                      org === project.organizationId
                  ) ? (
                    <select
                      defaultValue={project.status || "ACTIVE"}
                      onChange={(e) =>
                        handleProjectStatusChange(project.id, e.target.value)
                      }
                      className="bg-gray-700 text-white rounded-md p-2 cursor-pointer"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="ON HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  ) : (
                    <Chip
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black text-white",
                      }}
                    >
                      {project.status || "Status"}
                    </Chip>
                  )}

                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      setOpenOptions(
                        openOptions === project.id ? null : project.id
                      )
                    }
                  >
                    ...
                    {openOptions === project.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white text-white shadow-lg rounded-md z-10 bg-gradient-to-br from-[#232526] to-[#414345]">
                        <button
                          className="block w-full px-4 py-2 text-left"
                          onClick={() => {
                            console.log("Edit clicked");
                            setOpenOptions(null);
                          }}
                        >
                          Add new member
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left"
                          onClick={() => {
                            console.log("Edit clicked");
                            setOpenOptions(null);
                          }}
                        >
                          Remove a member
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left"
                          onClick={() => {
                            console.log("Delete clicked");
                            setOpenOptions(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </span>
                </CardHeader>

                <CardBody>
                  <h1 className="text-white text-2xl font-bold">
                    {project.name}
                  </h1>
                  <p className="text-sm text-gray-300 pt-3">
                    {project.description}
                  </p>
                  <div className="flex flex-row gap-5 pt-5">
                    <Card className="w-[10vw] bg-gray-700">
                      <CardBody className="flex flex-row justify-evenly items-center">
                        Sprints <span>{project.sprints || 0}</span>
                      </CardBody>
                    </Card>
                    <Card className="w-[10vw] bg-gray-700">
                      <CardBody className="flex flex-row justify-evenly items-center">
                        Tasks <span>{project.tasks || 0}</span>
                      </CardBody>
                    </Card>
                  </div>
                </CardBody>

                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center">
                    {[...Array(3)].map((_, i) => (
                      <CircleUser
                        key={i}
                        width={32}
                        height={32}
                        className={`${i !== 0 ? "-ml-2" : ""}`}
                      />
                    ))}
                  </div>

                  <div className="cursor-pointer hover:bg-gray-800 px-4 py-2 rounded-md text-white font-bold">
                    View Details
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      <CreateProject
        isOpen={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
      />
    </>
  );
}
