import LeadPipelineChartSkeleton from "@/components/cards/Skeletons/LeadsPipelineChartSkeleton";
import MetricCardsSkeleton from "@/components/cards/Skeletons/MetricCardSkeleton";
import RecentActivityCardSkeleton from "@/components/cards/Skeletons/RecentActivityCardSkeleton";
import SprintDetailsCardSkeleton from "@/components/cards/Skeletons/SprintDetailsSkeleton";
import TasksDueSoonCardSkeleton from "@/components/cards/Skeletons/TasksDueSoonSkeleton";

export default function loading() {
  return (
    <>
      <div className="animate-pulse p-6">
        <div className="flex gap-4 flex-col">
          <div className="flex gap-2">
            <div className="h-8 w-xs bg-[#2a2040] rounded-full mb-4"></div>
            <div className="h-8 w-xs bg-[#2a2040] rounded-full mb-4"></div>
            {/* <div className="h-2.5 bg-green-500 rounded-full w-48 mb-4"></div> */}
          </div>

          <div className="flex gap-4 items-stretch">
            <div className="w-1/2 flex flex-col">
              <MetricCardsSkeleton />
            </div>
          </div>

          <div className="flex gap-4 items-stretch">
            <div className="w-1/2">
              <RecentActivityCardSkeleton />
            </div>
            <div className="w-1/2">
              <SprintDetailsCardSkeleton />
            </div>
          </div>

          <div className="flex gap-4 items-stretch">
            <div className="w-1/2">
              <TasksDueSoonCardSkeleton />
            </div>
            <div className="w-1/2">
              <LeadPipelineChartSkeleton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
