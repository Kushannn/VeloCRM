"use client";

import { SprintType } from "@/lib/types";
import { Card, Label, ProgressBar, Separator } from "@heroui/react";
import { ArrowRight, Calendar, CircleCheck, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectSprintCarousel({
  sprints,
}: {
  sprints?: SprintType[] | null;
}) {
  const currentUrl = window.location.href;

  const router = useRouter();

  function getProgress(startDate: Date, endDate: Date) {
    const now = new Date();
    const total = new Date(endDate).getTime() - new Date(startDate).getTime();
    const passed = now.getTime() - new Date(startDate).getTime();
    return Math.min(100, Math.max(0, (passed / total) * 100));
  }

  function formattedDates(date: Date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const today = new Date();

  return (
    <div className="flex gap-3">
      {sprints?.map((sprint, index) => {
        const completedTasks =
          sprint.tasks?.filter((task) => task.status === "COMPLETED").length ??
          0;
        const progress = getProgress(sprint.startDate, sprint.endDate);

        return (
          <Card
            key={sprint.id}
            onClick={() => router.push(`${currentUrl}/sprint/${sprint.slug}`)}
            className="
              bg-[#0d0d1a] border border-[#2a2040] w-86.25
              hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10
              transition-all duration-300 ease-out
              animate-fadein
              group cursor-pointer
            "
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <Card.Header>
              <Card.Title className="text-[#7c6fa0] text-xs flex items-center justify-between">
                SP-{String(index + 1).padStart(3, "0")}
                {sprint.startDate <= today && sprint.endDate >= today && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                )}
              </Card.Title>
            </Card.Header>

            <Card.Content>
              <div>
                <div className="flex flex-col gap-y-2">
                  <p className="text-white font-bold text-sm group-hover:text-purple-200 transition-colors duration-200">
                    {sprint.title}
                  </p>
                  <p className="text-[#6d5fa6] text-xs line-clamp-2">
                    {sprint.description}
                  </p>
                </div>

                <div className="mt-4">
                  <ProgressBar value={progress}>
                    <div className="flex items-center justify-between py-2">
                      <Label className="text-[#6d5fa6] text-xs">Progress</Label>
                      <ProgressBar.Output className="text-xs text-[#8461AE]" />
                    </div>
                    <ProgressBar.Track className="bg-[#13111f]">
                      <ProgressBar.Fill className="bg-linear-to-r from-violet-600 to-purple-500" />
                    </ProgressBar.Track>
                  </ProgressBar>
                </div>

                <div className="text-xs text-[#6d5fa6] flex mt-4 gap-2 items-center">
                  <Calendar className="w-4 h-4 text-[#a855f7]" />
                  <p>{formattedDates(sprint?.startDate)}</p>
                  <ArrowRight className="w-4 h-4 text-[#a855f7]" />
                  <p>{formattedDates(sprint?.endDate)}</p>
                </div>
              </div>
            </Card.Content>
            <Card.Footer className="group flex flex-col">
              <Separator className="bg-violet-500/10" />

              <div className="mt-2 flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleCheck className="h-3 w-3 text-green-700" />
                  <span className="text-xs">
                    {completedTasks} / {sprint.tasks?.length}
                  </span>
                </div>

                <MoveRight className="h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:text-[#6d5fa6]" />
              </div>
            </Card.Footer>
          </Card>
        );
      })}
    </div>
  );
}
