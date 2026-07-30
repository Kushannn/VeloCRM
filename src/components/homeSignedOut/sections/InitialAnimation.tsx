import React from "react";
import {
  Mail,
  Laptop,
  Smartphone,
  Globe,
  Database,
  type LucideIcon,
} from "lucide-react";

/**
 * AnimatedNetworkGraph
 * ---------------------------------------------------------------
 * A dark, dot-grid network diagram where lines animate outward
 * from "source" nodes (mail / laptop / phone / globe / database)
 * through hub dots and terminate at X ("endpoint") nodes.
 *
 * No GSAP / framer-motion dependency — everything is done with
 * native SVG (pathLength + stroke-dashoffset + animateMotion) and
 * CSS keyframes, so it drops straight into a Next.js + TS app.
 *
 * If you want it scroll-triggered instead of auto-looping, wrap
 * this in a GSAP ScrollTrigger that toggles a `.is-active` class
 * on the root <svg> and swap `animation-play-state` off that class
 * — happy to wire that up if you want it synced to your landing
 * page's existing ScrollTrigger setup.
 */

// ---- Types ---------------------------------------------------------

type SourceType = "mail" | "laptop" | "phone" | "globe" | "database";
type NodeType = SourceType | "dot" | "end";

interface GraphNode {
  x: number;
  y: number;
  type: NodeType;
}

type NodeId = string;
type NodeMap = Record<NodeId, GraphNode>;
type PathChain = NodeId[];

// ---- Layout data -----------------------------------------------------
// Edit coordinates here to reshape the graph. viewBox is 1483x410.

const NODES: NodeMap = {
  laptop: { x: 447, y: 14, type: "laptop" },
  mail1: { x: 251, y: 58, type: "mail" },
  mail2: { x: 941, y: 58, type: "mail" },
  phone: { x: 101, y: 205, type: "phone" },
  globe: { x: 1240, y: 20, type: "globe" },
  database: { x: 550, y: 205, type: "database" },

  n1: { x: 447, y: 58, type: "dot" },
  n2: { x: 200, y: 255, type: "dot" },
  n3: { x: 1089, y: 107, type: "dot" },
  n4: { x: 1385, y: 205, type: "dot" },
  n5: { x: 447, y: 304, type: "dot" },
  n6: { x: 645, y: 304, type: "dot" },
  n7: { x: 744, y: 304, type: "dot" },
  n8: { x: 299, y: 353, type: "dot" },
  n9: { x: 1385, y: 353, type: "dot" },
  n10: { x: 546, y: 396, type: "dot" },
  n11: { x: 1139, y: 396, type: "dot" },

  x1: { x: 645, y: 58, type: "end" },
  x2: { x: 1385, y: 58, type: "end" },
  x3: { x: 299, y: 205, type: "end" },
  x4: { x: 1287, y: 256, type: "end" },
  x5: { x: 991, y: 354, type: "end" },
};

// Each path is an ordered chain of node ids it travels through.
const PATHS: PathChain[] = [
  ["mail1", "n1"],
  ["laptop", "n1"],
  ["n1", "x1"],
  ["n1", "n8"],
  ["n8", "n10"],
  ["phone", "n2"],
  ["n2", "x3"],
  ["n2", "n8"],
  ["n5", "n6", "n7"],
  ["mail2", "x5"],
  ["n3", "x4"],
  ["n3", "n11"],
  ["n4", "x2"],
  ["n4", "n9"],
  ["n9", "x4"],
  ["globe", "n3"],
  ["globe", "n4"],
  ["database", "n5"],
  ["database", "n1"],
];

const ICONS: Partial<Record<NodeType, LucideIcon>> = {
  mail: Mail,
  laptop: Laptop,
  phone: Smartphone,
  globe: Globe,
  database: Database,
};

function pathToD(chain: PathChain): string {
  return chain
    .map((id, i) => {
      const node = NODES[id];
      if (!node) return "";
      return `${i === 0 ? "M" : "L"} ${node.x} ${node.y}`;
    })
    .join(" ");
}

export default function InitialAnimation(): React.JSX.Element {
  const nodeEntries = Object.entries(NODES) as [NodeId, GraphNode][];
  const endNodes = nodeEntries.filter(([, n]) => n.type === "end");
  const dotNodes = nodeEntries.filter(([, n]) => n.type === "dot");
  const sourceNodes = nodeEntries.filter(([, n]) => ICONS[n.type]);

  return (
    <div className="w-full bg-[#0e0c17] rounded-xl overflow-hidden">
      <style>{`
        @keyframes ang-draw {
          0%   { stroke-dashoffset: 1; opacity: 0; }
          8%   { opacity: 1; }
          38%  { stroke-dashoffset: 0; opacity: 1; }
          62%  { stroke-dashoffset: 0; opacity: 1; }
          85%  { opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes ang-pulse {
          0%   { transform: scale(1);   opacity: 0.55; }
          50%  { transform: scale(1.9); opacity: 0; }
          100% { transform: scale(1);   opacity: 0; }
        }
        .ang-line-fg {
          stroke-dasharray: 1;
          animation: ang-draw 4.2s ease-in-out infinite;
        }
        .ang-x-ring {
          transform-origin: center;
          transform-box: fill-box;
          animation: ang-pulse 4.2s ease-in-out infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 1483 410"
        className="w-full h-auto block"
        role="img"
        aria-label="Network activity diagram"
      >
        <defs>
          <pattern
            id="ang-grid"
            width="42"
            height="42"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.6" fill="#2a2040" />
          </pattern>
          <radialGradient id="ang-bg" cx="15%" cy="30%" r="90%">
            <stop offset="0%" stopColor="#1a1232" />
            <stop offset="100%" stopColor="#09080f" />
          </radialGradient>
          <filter id="ang-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1483" height="410" fill="url(#ang-bg)" />
        <rect width="1483" height="410" fill="url(#ang-grid)" />

        {/* base (dim, always-visible) lines */}
        {PATHS.map((chain, i) => (
          <path
            key={`base-${i}`}
            d={pathToD(chain)}
            fill="none"
            stroke="#3d2d6b"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* animated draw-in overlay + traveling pulse */}
        {PATHS.map((chain, i) => {
          const d = pathToD(chain);
          const delay = (i % 8) * 0.5;
          return (
            <g key={`anim-${i}`}>
              <path
                d={d}
                pathLength={1}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="ang-line-fg"
                style={{ animationDelay: `${delay}s` }}
                filter="url(#ang-glow)"
              />
              <circle r="3.4" fill="#c4a8f5" filter="url(#ang-glow)">
                <animateMotion
                  path={d}
                  dur="4.2s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  keyPoints="0;1"
                  keyTimes="0;0.38"
                  calcMode="linear"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0;0"
                  keyTimes="0;0.08;0.36;0.4;1"
                  dur="4.2s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* end (X) nodes */}
        {endNodes.map(([id, n], i) => {
          const delay = (i % 8) * 0.5;
          return (
            <g key={id} transform={`translate(${n.x}, ${n.y})`}>
              <circle
                r="14"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                className="ang-x-ring"
                style={{ animationDelay: `${delay + 1.4}s` }}
              />
              <g stroke="#c4a8f5" strokeWidth="2.5" strokeLinecap="round">
                <line x1="-7" y1="-7" x2="7" y2="7" />
                <line x1="7" y1="-7" x2="-7" y2="7" />
              </g>
            </g>
          );
        })}

        {/* dot (hub) nodes */}
        {dotNodes.map(([id, n]) => (
          <circle key={id} cx={n.x} cy={n.y} r="4.5" fill="#ede8fb" />
        ))}

        {/* source icon nodes */}
        {sourceNodes.map(([id, n]) => {
          const Icon = ICONS[n.type];
          if (!Icon) return null;
          return (
            <foreignObject
              key={id}
              x={n.x - 14}
              y={n.y - 14}
              width={28}
              height={28}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} color="#ede8fb" strokeWidth={1.75} />
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}
