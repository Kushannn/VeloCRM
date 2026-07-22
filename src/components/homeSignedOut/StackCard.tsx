"use client";

import { motion, useTransform } from "framer-motion";
import { StackSection } from "./sectionsData";

interface StackCardProps {
  section: StackSection;
  index: number;
  progress: any;
  range: any;
  targetScale: any;
}

export default function StackCard({
  section,
  index,
  progress,
  range,
  targetScale,
}: StackCardProps) {
  const { Component, props, height = "h-screen", bg } = section;
  const scale = useTransform(progress, range, [1, targetScale]);
  return (
    <motion.div
      style={{ scale, y: index * 25, zIndex: index }}
      className="h-screen flex items-center justify-center sticky top-20"
    >
      <div className="flex flex-col relative origin-top w-full h-full">
        <Component {...props} />
      </div>
    </motion.div>
  );
}
