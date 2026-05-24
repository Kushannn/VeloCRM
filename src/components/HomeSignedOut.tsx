"use client";

import React, { useEffect, useState } from "react";
import baseImage from "../../public/baseImage1.jpg";
// import taskImage from "../../public/task.webp";
import trackerImage from "../../public/tracking.jpg";
import temp1 from "../../public/temp1.jpg";
import temp2 from "../../public/temp2.jpg";
import dashboardView from "../../public/dashboardview.jpg";
import LightPillar from "./LightPillar";
import TestimonialCard from "./testimonials/TestimonialCards";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";

import { Box, ChartNoAxesColumn, Crosshair, Fan } from "lucide-react";
import ScrollFloat from "./ui/ScrollFloat";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const testimonials = [
  {
    name: "David Kim",
    role: "CEO at Spectrum",
    company: "Spectrum",
    isCompanyCard: true,
    quote:
      "The AI-powered tools save us countless hours by summarizing tasks and prioritizing what matters most. A must-have for any team looking to streamline workflows.",
  },
  {
    name: "James Parker",
    role: "Operations Lead",
    quote:
      "The collaboration tools have significantly improved our team's productivity across all projects.",
  },
  {
    name: "Liam Scott",
    role: "Operations Director",
    quote:
      "Bulk actions have simplified task management for our team, boosting overall efficiency.",
  },
  {
    name: "Maya Patel",
    role: "Product Designer",
    quote:
      "I love how the AI Summary saves time by giving instant insights from our complex workflows.",
  },
  {
    name: "Sarah Turner",
    role: "Project Manager",
    quote:
      "It transformed our project management process. Its intuitive features make organizing tasks incredibly easy.",
  },
  {
    name: "Carlos Rivera",
    role: "Global Project Manager",
    quote:
      "The 2-way translation has been a game-changer for our global team's seamless communication.",
  },
  {
    name: "Sophia Zhang",
    role: "CEO at Apex",
    company: "Apex",
    isCompanyCard: true,
    quote:
      "It has revolutionized how our team manages projects. Its intuitive features and seamless collaboration tools have enhanced our efficiency and ensured we never miss a deadline.",
  },
];

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
];

function HomeSignedOut() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn]);
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
      <div className="relative min-h-screen overflow-hidden text-white">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 min-h-screen flex flex-col items-center justify-center text-center">
          <div className="space-y-6">
            {/* Badge */}

            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
            >
              <div className="inline-flex items-center rounded-full border border-violet-500/30 px-4 py-2 text-sm text-violet-300 backdrop-blur-sm">
                Built for modern teams & growing businesses
              </div>
            </ScrollFloat>

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
              <button className="px-6 py-3 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:scale-105 transition-all duration-300 font-medium">
                Get Started
              </button>
              <button className="px-6 py-3 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 hover:scale-105 transition-all duration-300 font-medium">
                Live Demo
              </button>
            </div>
          </div>

          <div className="mt-16 relative w-full max-w-5xl">
            <div className="absolute inset-0 blur-3xl rounded-full opacity-20 bg-violet-500/20" />
            <img
              src={baseImage.src}
              alt="CRM Dashboard"
              className="relative w-full rounded-2xl border border-white/10 shadow-2xl shadow-violet-900/20"
            />
          </div>
        </div>

        {/* Logo Loop */}
        <div className="flex justify-center w-full mt-16">
          <div>
            <p className="text-zinc-100 text-xl font-semibold my-16 text-center">
              Powering the worlds best product teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-16">
              {techLogos.map((logo) => (
                <a
                  key={logo.title}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-200 transition-colors duration-300"
                >
                  <div className="text-6xl">{logo.node}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Features intro */}
        <section className="py-24 px-6 text-center">
          <div>
            <p className="text-violet-400 text-xs uppercase tracking-[0.2em] mb-4">
              Smart Workflow
            </p>
            {/* <h2 className="text-5xl font-bold tracking-tight text-white"> */}
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              textClassName="text-5xl font-bold"
            >
              Project strategy made simple
            </ScrollFloat>
            {/* </h2> */}
            <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              Align your projects around a clear pipeline. Plan sprints, assign
              tasks, and track every milestone with real-time visibility.
            </p>
          </div>

          <div className="flex justify-around mt-20 gap-20">
            <div className="flex flex-col gap-6 flex-1">
              <div className="w-64 mx-auto">
                <p className="font-semibold text-base text-white mb-1">
                  Manage pipelines end to end
                </p>
                <p className="text-sm text-zinc-400 wrap-break-words">
                  Track leads, deals and follow-ups — all in one centralized,
                  customized pipeline view.
                </p>
              </div>

              <img
                src={temp2.src}
                alt=""
                className="h-72 w-md rounded-xl object-cover mx-auto"
              />
            </div>

            <div className="w-px bg-white/8" />

            <div className="flex flex-col gap-6 flex-1">
              <div className="w-64 mx-auto">
                <p className="font-semibold text-base text-white mb-1">
                  Details at a glance
                </p>
                <p className="text-sm text-zinc-400 wrap-break-words">
                  Always know the status of any company, deal or contract.
                </p>
              </div>

              <img
                src={temp1.src}
                alt=""
                className="h-72 w-md rounded-xl object-cover mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {[
              {
                icon: <Fan size={18} />,
                title: "Pipelines",
                desc: "Organize deals by stages and track progress at a glance. Manage workflows efficiently.",
              },
              {
                icon: <Box size={18} />,
                title: "Team Collaboration",
                desc: "Work together across departments to close deals faster",
              },
              {
                icon: <Crosshair size={18} />,
                title: "Deal Milestones",
                desc: "Define key phases from contact to close - and stay aligned.",
              },
              {
                icon: <ChartNoAxesColumn size={18} />,
                title: "Sales insights",
                desc: "Monitor activity , forecast revenue and analyze trends over time.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-black/60 border border-white/[0.07] rounded-2xl p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                  {card.icon}
                </div>
                <p className="text-white font-semibold text-sm mb-2">
                  {card.title}
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-violet-400 text-xs uppercase tracking-[0.2em] mb-4">
                Client Management
              </p>
              {/* <p className="text-3xl font-bold text-white leading-tight"> */}
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.04}
                textClassName="text-5xl font-bold"
              >
                Effortless client management
              </ScrollFloat>

              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.04}
                textClassName="text-5xl font-bold"
              >
                all in one place
              </ScrollFloat>

              {/* </p> */}
            </div>

            {/* Two Column Layout */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left — Text */}
              <div className="flex-1 flex flex-col gap-4">
                {[
                  {
                    num: "01",
                    title: "A workspace built for modern teams",
                    desc: "Give every client their own space while keeping your team aligned. Centralize communication, notes, files and project context without tab-hopping or tool-switching.",
                  },
                  {
                    num: "02",
                    title: "Streamlined client collaboration",
                    desc: "Keep conversations, approvals, and project updates organized in a single place so everyone stays informed.",
                  },
                  {
                    num: "03",
                    title: "Powerful project visibility",
                    desc: "Track progress, manage deliverables, and ensure deadlines are met with a clear overview of every project.",
                  },
                ].map((item, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <div
                      key={item.num}
                      className="flex gap-4 cursor-pointer"
                      onClick={() => setActiveIndex(index)}
                    >
                      <div className="flex gap-3 shrink-0">
                        <div
                          className={`w-0.75 rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-violet-500 h-8"
                              : "bg-transparent h-8"
                          }`}
                        />

                        <span
                          className={`text-lg font-mono mt-1 transition-colors ${
                            isActive ? "text-violet-500" : "text-violet-500/50"
                          }`}
                        >
                          {item.num}
                        </span>
                      </div>

                      <div className="max-w-md my-2">
                        <p
                          className={`font-bold text-lg transition-colors ${
                            isActive ? "text-white" : "text-white"
                          }`}
                        >
                          {item.title}
                        </p>

                        {isActive && (
                          <p className="text-zinc-400 text-sm leading-relaxed mt-2">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right — Image */}
              <div className="flex-1 w-full">
                <img
                  src={dashboardView.src}
                  alt="Client management dashboard"
                  className="w-full rounded-2xl border border-white/10 shadow-2xl shadow-violet-900/10 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-10">
              <p className="text-violet-400 text-xs uppercase tracking-[0.2em] mb-4">
                Client Management
              </p>
              {/* <p className="text-3xl font-bold text-white leading-tight"> */}
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.04}
                textClassName="text-5xl font-bold"
              >
                Track what matters the most
              </ScrollFloat>
              {/* </p> */}
            </div>

            <div className="mt-4 relative w-full max-w-4xl mx-auto">
              {/* <div className="absolute inset-0 blur-3xl rounded-full opacity-20 bg-violet-500/20" /> */}
              <img
                src={trackerImage.src}
                alt="CRM Dashboard"
                className="relative w-full rounded-2xl border border-white/10 shadow-2xl shadow-violet-900/20"
              />
            </div>

            <div className="mt-10 flex flex-wrap justify-center items-center">
              <div className="px-8 text-center">
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Increase in progress tracking
                </p>
              </div>

              <div className="h-12 w-px bg-white/10" />

              <div className="px-8 text-center">
                <p className="text-2xl font-bold text-white">10X</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Increase in productivity
                </p>
              </div>

              <div className="h-12 w-px bg-white/10" />

              <div className="px-8 text-center">
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Client satisfaction rate
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <p className="text-violet-400 text-xs uppercase tracking-[0.2em] mb-4">
                Testimonials
              </p>
              {/* <h2 className="text-4xl font-bold text-white tracking-tight"> */}
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.04}
                textClassName="text-5xl font-bold"
              >
                Loved by teams worldwide
              </ScrollFloat>
              {/* </h2> */}
              <p className="text-zinc-400 text-base mt-4 max-w-xl mx-auto">
                See what our customers say about managing their work with us.
              </p>
            </div>

            {/* Masonry grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomeSignedOut;
