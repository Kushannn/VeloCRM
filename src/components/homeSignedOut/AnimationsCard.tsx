"use client";

import SecondAnimation from "./SecondAnimation";
// import AnimatedNetworkGraph from "./sections/InitialAnimation";
import InitialAnimation from "./sections/InitialAnimation";

export default function AnimationsCard() {
  return (
    <div className="mt-40">
      {/* ==================== Hero Text ==================== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-10">
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-36 items-start">
            {/* Left */}
            <div>
              <h2 className="text-[84px] leading-[0.92] tracking-[-0.05em] font-medium">
                <span className="block text-[#6f687f]">Work didn't</span>

                <span className="block text-[#6f687f]">get harder.</span>

                <span className="block text-[#ede8fb]">It got</span>

                <span className="block text-[#ede8fb]">scattered.</span>
              </h2>
            </div>

            {/* Right */}
            <div className="max-w-[620px] space-y-12">
              <p className="text-xl leading-[1.55] text-[#b3aec2]">
                Teams are buried in tools and status updates just to keep a
                project moving, only to lose the thread the second something
                changes. Meanwhile, work gets pushed through boards and
                pipelines built for last sprint's plan, not this moment's
                reality.
              </p>

              <p className="text-xl leading-[1.55] text-gray-300">
                VeloCRM syncs your organization's projects, sprints, and leads
                into one live workspace, updating the instant something moves —
                a task, a status, a lead. Work stops resetting. Momentum
                compounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-10 pb-2">
        <div className="mx-auto max-w-7xl px-8">
          <div className="rounded-[30px] border border-white/6 bg-gradient-to-b from-[#1c1a24] to-[#131217] backdrop-blur-sm p-14 shadow-[0_0_80px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]">
            <h3 className="text-3xl font-medium tracking-[-0.04em] text-[#ede8fb]">
              Your workflows are a <span className="text-[#7c6fa0]">mess.</span>
            </h3>

            {/* <div className="mt-12 rounded-2xl overflow-hidden bg-[#111116] border border-white/5 p-6">
              <div className="h-[560px]"> */}
            <div className="mt-12">
              <InitialAnimation />
            </div>
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="mx-auto max-w-7xl px-8">
          <div className="rounded-[30px] border border-white/10 bg-linear-to-b from-[#1c1a24] to-[#131217] backdrop-blur-sm p-14 shadow-[0_0_80px_rgba(0,0,0,0.25)]">
            <h3 className="text-3xl font-medium tracking-[-0.04em] text-[#ede8fb]">
              Clean them up with{" "}
              <span className="text-[#7c6fa0]">VeloCRM.</span>
            </h3>

            {/* <div className="mt-12 rounded-2xl overflow-hidden bg-[#111116] border border-white/5 p-6">
              <div className="h-[560px]"> */}
            <div className="mt-12">
              <SecondAnimation />
            </div>
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}
