import React from "react";
import baseImage from "../../public/baseImage1.jpg";
import taskImage from "../../public/task.webp";
import LightPillar from "./LightPillar";

import LogoLoop from "./LogoLoop";
import { Card, Link, Separator } from "@heroui/react";
import { Fan } from "lucide-react";

function HomeSignedOut() {
  return (
    <>
      <LightPillar
        topColor="#111111"
        bottomColor="#9333EA"
        intensity={1}
        rotationSpeed={0.3}
        glowAmount={0.003}
        pillarWidth={3}
        pillarHeight={0.4}
        noiseIntensity={0.5}
        pillarRotation={25}
        interactive={false}
        mixBlendMode="screen"
        quality="high"
        className="fixed"
      />
      <div className="relative min-h-screen overflow-hidden text-white ">
        {/* Main */}
        <div className="max-w-7xl mx-auto px-6 min-h-screen flex flex-col items-center justify-center text-center">
          <div className="space-y-6">
            {/* <div className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm">
              Built for modern teams & growing businesses
            </div> */}

            <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight">
              Manage Projects,
              <br />
              Leads & Teams
              <span className="bg-linear-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                {" "}
                Seamlessly
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-zinc-400 leading-relaxed">
              A modern CRM workspace to manage clients, track leads, organize
              sprints, and collaborate with your entire team in one powerful
              platform.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button className="px-6 py-3 rounded-xl border border-violet-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 font-medium">
                Get Started
              </button>

              <button className="px-6 py-3 rounded-xl border border-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300 font-medium">
                Live Demo
              </button>
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 blur-3xl rounded-full opacity-30 bg-violet-500/20" />

            <img
              src={baseImage.src}
              alt="CRM Dashboard"
              className="relative w-full max-w-5xl rounded-2xl border border-white/10 shadow-2xl shadow-violet-900/20"
            />
          </div>
        </div>

        {/* Second - Logo Loops  */}

        <div
          style={{ height: "200px", position: "relative", overflow: "hidden" }}
        >
          "For logo loops"
        </div>

        {/* Third */}
        <section className="flex flex-col gap-28 mb-14">
          <div className="text-center">
            <p className="text-violet-400 text-sm uppercase tracking-[0.3em] mb-4">
              Smart Workflow
            </p>

            <h2 className="text-6xl font-bold tracking-tight">
              Project strategy made simple
            </h2>

            <p className="text-zinc-400 text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
              Align your projects around a clear pipeline. Plan sprints, assign
              tasks, and track every milestone with real-time visibility.
            </p>
          </div>

          {/* left  and right container*/}
          <div className="flex justify-around">
            <div className="flex flex-col gap-16">
              <div>
                <p className="font-bold text-lg  mb-1">Smart Workflow</p>

                <p className="text-sm tracking-tight">
                  Project strategy made simple
                </p>
              </div>

              <img src={taskImage.src} alt="" className="h-72 w-72" />
            </div>

            <Separator orientation="vertical" className="bg-white/50" />

            <div className="flex flex-col gap-16">
              <div>
                <p className="font-bold text-lg  mb-1">Smart Workflow</p>

                <p className="text-sm tracking-tight">
                  Project strategy made simple
                </p>
              </div>

              <img src={taskImage.src} alt="" className="h-72 w-72" />
            </div>
          </div>
        </section>

        {/* Fourth */}
        <section>
          {/* feature cards */}
          <div className="flex gap-4">
            <Card className="w-95 bg-black/85 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md p-2">
              <Card.Header className="flex flex-col items-start gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/20">
                    <Fan size={20} className="text-violet-400" />
                  </div>

                  <Card.Title className="text-white text-xl font-semibold tracking-tight">
                    Pipelines
                  </Card.Title>
                </div>

                <Card.Description className="text-gray-400 text-sm leading-relaxed wrap-break-words">
                  Organize deals by stages and track progress at a glance.
                  Manage workflows efficiently and keep every milestone visible
                  across your team.
                </Card.Description>
              </Card.Header>
            </Card>

            <Card className="w-95 bg-black/85 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md p-2">
              <Card.Header className="flex flex-col items-start gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/20">
                    <Fan size={20} className="text-violet-400" />
                  </div>

                  <Card.Title className="text-white text-xl font-semibold tracking-tight">
                    Pipelines
                  </Card.Title>
                </div>

                <Card.Description className="text-gray-400 text-sm leading-relaxed wrap-break-words">
                  Organize deals by stages and track progress at a glance.
                  Manage workflows efficiently and keep every milestone visible
                  across your team.
                </Card.Description>
              </Card.Header>
            </Card>

            <Card className="w-95 bg-black/85 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md p-2">
              <Card.Header className="flex flex-col items-start gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/20">
                    <Fan size={20} className="text-violet-400" />
                  </div>

                  <Card.Title className="text-white text-xl font-semibold tracking-tight">
                    Pipelines
                  </Card.Title>
                </div>

                <Card.Description className="text-gray-400 text-sm leading-relaxed wrap-break-words">
                  Organize deals by stages and track progress at a glance.
                  Manage workflows efficiently and keep every milestone visible
                  across your team.
                </Card.Description>
              </Card.Header>
            </Card>

            <Card className="w-95 bg-black/85 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md p-2">
              <Card.Header className="flex flex-col items-start gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/20">
                    <Fan size={20} className="text-violet-400" />
                  </div>

                  <Card.Title className="text-white text-xl font-semibold tracking-tight">
                    Pipelines
                  </Card.Title>
                </div>

                <Card.Description className="text-gray-400 text-sm leading-relaxed wrap-break-words">
                  Organize deals by stages and track progress at a glance.
                  Manage workflows efficiently and keep every milestone visible
                  across your team.
                </Card.Description>
              </Card.Header>
            </Card>
          </div>
        </section>

        {/* Fifth */}

        <section className="flex justify-center items-center min-h-screen">
          <div>
            <p className="text-2xl font-bold text-white leading-tight text-center">
              Effortless client management <br />
              all in one place
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomeSignedOut;
