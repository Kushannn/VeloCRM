"use client";

import Image from "next/image";
import {
  Building2,
  Users,
  FolderKanban,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

// import MultiOrgImage from "../../../../public/MultiOrg.png";
import DemoProject from "../../../../public/DemoProject.png";

export default function ProjectSprintCard() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-[#17171d]/80 backdrop-blur-xl p-12">
        <div className="grid grid-cols-[1.1fr_0.9fr] items-start gap-20">
          {/* LEFT */}
          <div className="relative">
            <div className="absolute -inset-8 bg-violet-500/5 blur-[120px]" />
            <div className="relative w-[110%] -ml-8 mt-8">
              <Image
                src={DemoProject}
                alt="Project Dashboard"
                className="w-full h-auto rounded-2xl"
                priority
              />
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex flex-col">
            <Building2
              className="mb-8 text-[#8b5cf6]"
              size={30}
              strokeWidth={2}
            />

            <h2 className="text-4xl font-semibold tracking-tighter text-[#ede8fb]">
              Plan work the way your team actually works.
            </h2>

            <p className="mt-10 max-w-130 text-lg leading-[1.7] text-[#b8aed4]">
              Break big goals into projects, and projects into sprints. Keep
              scope tight, deadlines visible, and everyone focused on what's
              next.
            </p>

            <div className="mt-14 grid max-w-130 grid-cols-2 gap-x-10 gap-y-7">
              <div className="flex items-center gap-3 text-[#b8aed4]">
                <Users size={20} />
                <span>Assign multiple members</span>
              </div>

              <div className="flex items-center gap-3 text-[#b8aed4]">
                <FolderKanban size={20} />
                <span>Create Multiple Sprints</span>
              </div>

              <div className="flex items-center gap-3 text-[#b8aed4]">
                <ShieldCheck size={20} />
                <span>Get Updates On Sprint Ends</span>
              </div>

              <div className="flex items-center gap-3 text-[#b8aed4]">
                <Briefcase size={20} />
                <span>Organization history</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
