"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  Divider,
  Progress,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { ProjectType, SprintType } from "@/lib/types";
import { ArrowBigRight, Calendar, Plus, Users } from "lucide-react";
import CreateSprint from "@/components/createSprint/CreateSprint";

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

  useEffect(() => {
    const fetchSprint = async () => {
      setLoading(true);
      try {
        // await new Promise((resolve) => setTimeout(resolve, 5000));

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

  useEffect(() => {
    console.log("sprint ", sprint);
  });

  return (
    <>
      <div>
        <div>
          <h1 className="m-3 p-3 font-bold text-3xl">
            Sprint : {sprint?.title}
          </h1>
        </div>
      </div>
    </>
  );
}
