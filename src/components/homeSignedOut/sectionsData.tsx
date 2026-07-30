import { ComponentType } from "react";
// import CTA from "./sections/KanbanIntro";
import KanbanIntroCard from "./sections/KanbanIntro";
import MultiOrgCard from "./sections/MultiOrgCard";
import ProjectSprintCard from "./sections/ProjectSprintCard";

export interface StackSection {
  id: string;
  Component: ComponentType<any>;
  props?: Record<string, any>;
  height?: string; // e.g. "h-[150vh]" for slower scroll
  bg?: string; // e.g. "bg-black" if a card needs a solid backdrop
}

export const stackSections: StackSection[] = [
  { id: "features-intro", Component: MultiOrgCard, height: "h-screen" },
  { id: "feature-cards", Component: ProjectSprintCard, height: "h-screen" },
  {
    id: "KanbanIntroCard",
    Component: KanbanIntroCard,
    height: "h-screen",
  },
  // {
  //   id: "Animation",
  //   Component: NetworkAnimation,
  //   height: "h-screen",
  // },
];
