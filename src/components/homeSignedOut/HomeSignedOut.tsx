"use client";

import React, { useEffect, useRef, useState } from "react";
// import baseImage from "../../public/baseImage1.jpg";
import baseImage from "../../../public/baseImage1.png";
import trackerImage from "../../../public/tracking.jpg";

import LightPillar from "../ui/LightPillar";
import TestimonialCard from "../testimonials/TestimonialCards";
1;
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPrisma,
  SiMongodb,
} from "react-icons/si";

import ScrollFloat from "../ui/ScrollFloat";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Cookies from "js-cookie";
import LogoLoop from "../ui/LogoLoop";
import { stackSections } from "./sectionsData";
import StackCard from "./StackCard";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimationsCard from "./AnimationsCard";
import SideRays from "../SideRays";

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
  {
    node: <SiPrisma />,
    title: "Prisma ORM",
    href: "https://www.prisma.io/",
  },
  {
    node: <SiMongodb />,
    title: "MongoDB",
    href: "https://www.mongodb.com/",
  },
];

function HomeSignedOut() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const orgSlug = Cookies.get("orgSlug");

  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const lastCardStart = (stackSections.length - 1) / stackSections.length;

  const headingOpacity = useTransform(
    scrollYProgress,
    [0, lastCardStart, 1],
    [1, 1, 0],
  );

  const headingY = useTransform(
    scrollYProgress,
    [lastCardStart, 1],
    [0, -100], // adjust distance to taste
  );

  useEffect(() => {
    if (isLoaded && isSignedIn && orgSlug) {
      router.replace(`/organization/${orgSlug}/dashboard`);
    }
  }, [isLoaded, isSignedIn]);
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden max-w-full">
        <SideRays
          speed={3.5}
          rayColor1="#6c3fc4"
          rayColor2="#8b5cf6"
          intensity={2.5}
          spread={2.5}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.75}
          falloff={1.6}
          opacity={1}
        />
      </div>

      <div className="flex flex-col gap-20 font-brand relative min-h-screen text-white">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 min-h-screen flex flex-col items-center justify-center text-center">
          <div className="space-y-6">
            {/* Badge */}

            <div className="inline-flex items-center rounded-full border border-violet-500/30 px-4 py-2 text-sm text-violet-300 backdrop-blur-sm mt-24">
              Built for modern teams & growing business
            </div>

            <h1 className="text-6xl md:text-5xl font-medium leading-tight tracking-tight">
              From lead to launch — manage it all in one place.
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
        <div className="flex justify-center w-full mt-16 overflow-hidden">
          <div>
            <p className="text-zinc-100 text-xl font-semibold my-16 text-center">
              Powering the worlds best product teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-16">
              <LogoLoop
                logos={techLogos}
                speed={100}
                direction="left"
                logoHeight={60}
                gap={60}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#0a0a1a"
                ariaLabel="Technology partners"
                width={"100%"}
              />
            </div>
          </div>
        </div>

        <AnimationsCard />

        <section className="mt-36 ">
          <motion.div
            className="sticky top-20 z-50 flex justify-center"
            style={{
              opacity: headingOpacity,
              y: headingY,
            }}
          >
            <h2 className="text-4xl font-medium tracking-[-0.04em] text-[#ede8fb] text-center">
              Everything your team needs, nothing it doesn't
            </h2>
          </motion.div>

          <div className="mt-[10vh] mb-[10vh]" ref={container}>
            {stackSections.map((section, i) => {
              const targetScale = 1 - (stackSections.length - i) * 0.05;

              return (
                <StackCard
                  key={i}
                  section={section}
                  index={i}
                  range={[(i + 1) * (1 / stackSections.length), 1]}
                  targetScale={targetScale}
                  progress={scrollYProgress}
                />
              );
            })}
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-10">
              <p className="text-violet-400 text-xs uppercase tracking-[0.2em] mb-4">
                Built In Collaborations
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
                Your team in sync automatically
              </ScrollFloat>

              <div className="text-lg text-[#b8aed4] mt-10">
                Real-time sync means the moment a teammate makes a change,
                everyone with access sees it — on the board, in the feed,
                wherever they're looking.
              </div>
              {/* </p> */}
            </div>

            <div className="mt-4 relative w-full max-w-4xl mx-auto flex gap-12">
              {/* <div className="absolute inset-0 blur-3xl rounded-full opacity-20 bg-violet-500/20" /> */}
              <video
                src="/KanbanBoards.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                preload="auto"
                className="w-full h-full object-contain rounded-[24px]"
              />

              <video
                src="/KanbanBoards.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                preload="auto"
                className="w-full h-full object-contain rounded-[24px]"
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
