"use client";

import Image from "next/image";
import {
  Building2,
  Users,
  FolderKanban,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

import MultiOrgImage from "../../../../public/MultiOrg.png";

export default function MultiOrgCard() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-12">
        <div className="grid grid-cols-[0.9fr_1.1fr] items-center gap-20">
          {/* LEFT */}

          <div className="flex flex-col">
            <Building2
              className="mb-8 text-[#8b5cf6]"
              size={30}
              strokeWidth={2}
            />

            <h2 className="text-3xl font-semibold tracking-tighter text-[#ede8fb]">
              One Account - Multiple Orgs
            </h2>

            <p className="mt-8 text-lg leading-9 text-[#b8aed4]">
              Spin up separate organizations for different teams or clients,
              each with its own members, projects, and permissions — without
              stepping on each other's data.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-y-5 gap-x-10">
              <div className="flex items-center gap-3 text-[#b8aed4]">
                <Users size={18} />
                <span>Auto updated contacts</span>
              </div>

              <div className="flex items-center gap-3 text-[#b8aed4]">
                <FolderKanban size={18} />
                <span>Projects linked</span>
              </div>

              <div className="flex items-center gap-3 text-[#b8aed4]">
                <ShieldCheck size={18} />
                <span>Role permissions</span>
              </div>

              <div className="flex items-center gap-3 text-[#b8aed4]">
                <Briefcase size={18} />
                <span>Organization history</span>
              </div>
            </div>

            {/* <button
              className="
                mt-14
                w-fit
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-8
                py-4
                text-white
                transition
                hover:bg-white/10
              "
            >
              Learn More
            </button> */}
          </div>

          {/* RIGHT */}

          <div className="relative">
            <div className="absolute inset-0 rounded-[30px] bg-violet-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[24px] border border-white/10 h-[400px] w-[600px]">
              <Image
                src={MultiOrgImage}
                alt="CRM"
                className="w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
