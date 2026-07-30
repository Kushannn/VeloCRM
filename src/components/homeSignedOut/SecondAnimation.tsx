import React from "react";
import {
  User,
  Smartphone,
  Tablet,
  Laptop,
  Mail,
  MessageCircle,
  Check,
  type LucideIcon,
} from "lucide-react";

/**
 * AnimatedJourneyRows
 * ---------------------------------------------------------------
 * Three horizontal "journeys": a person node on the left, a
 * zigzagging path of straight segments through device / channel
 * icons and plain waypoint dots, ending in a filled success
 * checkmark on the right.
 *
 * Segments are straight lines between consecutive nodes (matching
 * the reference), but the path as a whole is never flat — every
 * row alternates peaks and valleys, so no row is ever a straight
 * line end-to-end.
 *
 * No GSAP / framer-motion — pure SVG (pathLength + stroke-dashoffset
 * + animateMotion) and CSS keyframes.
 */

// ---- Types -----------------------------------------------------------

type NodeType =
  | "person"
  | "mobile"
  | "tablet"
  | "laptop"
  | "mail"
  | "message"
  | "dot"
  | "check";

interface RowNode {
  type: NodeType;
  dy: number; // vertical offset from the row's baseline
}

interface RowConfig {
  baselineY: number;
  nodes: RowNode[];
}

interface PositionedNode {
  type: NodeType;
  x: number;
  y: number;
}

// ---- Deterministic "random" zigzag generator ----------------------------
// Uses a seeded PRNG (mulberry32) rather than Math.random(): given the same
// seed it always produces the same sequence, so server-rendered and
// client-rendered output match exactly (avoids Next.js hydration mismatches
// that plain Math.random() would cause).

function mulberry32(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds a per-row vertical offset pattern. First and last entries are
 * always 0 (person and checkmark sit on the row's baseline, as in the
 * reference). The interior points get random offsets within [minAbs, maxAbs],
 * with a random up/down sign each time, so every row zigzags differently.
 */
function randomDyPattern(
  seed: number,
  length: number,
  maxAbs: number,
  minAbs: number,
): number[] {
  const rand = mulberry32(seed);
  const pattern: number[] = [];
  for (let i = 0; i < length; i++) {
    if (i === 0 || i === length - 1) {
      pattern.push(0);
      continue;
    }
    const sign = rand() < 0.5 ? -1 : 1;
    const magnitude = minAbs + rand() * (maxAbs - minAbs);
    pattern.push(sign * magnitude);
  }
  return pattern;
}

// ---- Layout data -------------------------------------------------------
// viewBox is 1600x560. Nine columns per row. Each row's zigzag shape comes
// from its own seed, so no two rows trace the same path — only the icon
// sequence and general rhythm (peaks bounded to stay clear of neighboring
// rows) are shared.

const COLUMN_X = [50, 250, 450, 650, 850, 1050, 1250, 1420, 1550];

const ROW_DY = [
  randomDyPattern(11, 9, 70, 20), // row 1
  randomDyPattern(42, 9, 70, 20), // row 2
  randomDyPattern(97, 9, 70, 20), // row 3
];

const ROWS: RowConfig[] = [
  {
    baselineY: 100,
    nodes: [
      { type: "person", dy: ROW_DY[0][0] },
      { type: "mobile", dy: ROW_DY[0][1] },
      { type: "dot", dy: ROW_DY[0][2] },
      { type: "mail", dy: ROW_DY[0][3] },
      { type: "dot", dy: ROW_DY[0][4] },
      { type: "tablet", dy: ROW_DY[0][5] },
      { type: "dot", dy: ROW_DY[0][6] },
      { type: "message", dy: ROW_DY[0][7] },
      { type: "check", dy: ROW_DY[0][8] },
    ],
  },
  {
    baselineY: 280,
    nodes: [
      { type: "person", dy: ROW_DY[1][0] },
      { type: "dot", dy: ROW_DY[1][1] },
      { type: "tablet", dy: ROW_DY[1][2] },
      { type: "message", dy: ROW_DY[1][3] },
      { type: "dot", dy: ROW_DY[1][4] },
      { type: "mobile", dy: ROW_DY[1][5] },
      { type: "dot", dy: ROW_DY[1][6] },
      { type: "dot", dy: ROW_DY[1][7] },
      { type: "check", dy: ROW_DY[1][8] },
    ],
  },
  {
    baselineY: 460,
    nodes: [
      { type: "person", dy: ROW_DY[2][0] },
      { type: "laptop", dy: ROW_DY[2][1] },
      { type: "dot", dy: ROW_DY[2][2] },
      { type: "mail", dy: ROW_DY[2][3] },
      { type: "dot", dy: ROW_DY[2][4] },
      { type: "tablet", dy: ROW_DY[2][5] },
      { type: "mobile", dy: ROW_DY[2][6] },
      { type: "message", dy: ROW_DY[2][7] },
      { type: "check", dy: ROW_DY[2][8] },
    ],
  },
];

const ICONS: Partial<Record<NodeType, LucideIcon>> = {
  person: User,
  mobile: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  mail: Mail,
  message: MessageCircle,
};

function rowPoints(row: RowConfig): PositionedNode[] {
  return row.nodes.map((n, i) => ({
    type: n.type,
    x: COLUMN_X[i],
    y: row.baselineY + n.dy,
  }));
}

function pointsToD(points: PositionedNode[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

export default function SecondAnimation(): React.JSX.Element {
  const rows = ROWS.map((row) => ({ row, points: rowPoints(row) }));

  return (
    <div className="w-full bg-[#0e0c17] rounded-xl overflow-hidden">
      <style>{`
        @keyframes ajr-draw {
          0%   { stroke-dashoffset: 1; opacity: 0; }
          8%   { opacity: 1; }
          42%  { stroke-dashoffset: 0; opacity: 1; }
          64%  { stroke-dashoffset: 0; opacity: 1; }
          88%  { opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes ajr-pulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          50%  { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1);   opacity: 0; }
        }
        .ajr-line-fg {
          stroke-dasharray: 1;
          animation: ajr-draw 5s ease-in-out infinite;
        }
        .ajr-check-ring {
          transform-origin: center;
          transform-box: fill-box;
          animation: ajr-pulse 5s ease-in-out infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 1600 560"
        className="w-full h-auto block"
        role="img"
        aria-label="Customer journey diagram"
      >
        <defs>
          <pattern
            id="ajr-grid"
            width="42"
            height="42"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.6" fill="#2a2040" />
          </pattern>
          <radialGradient id="ajr-bg" cx="12%" cy="20%" r="95%">
            <stop offset="0%" stopColor="#1a1232" />
            <stop offset="100%" stopColor="#09080f" />
          </radialGradient>
          <filter id="ajr-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1600" height="560" fill="url(#ajr-bg)" />
        <rect width="1600" height="560" fill="url(#ajr-grid)" />

        {/* base (dim, always-visible) zigzag lines */}
        {rows.map(({ row, points }, i) => (
          <path
            key={`base-${i}`}
            d={pointsToD(points)}
            fill="none"
            stroke="#3d2d6b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* animated draw-in overlay + traveling pulse */}
        {rows.map(({ points }, i) => {
          const d = pointsToD(points);
          const delay = i * 0.9;
          return (
            <g key={`anim-${i}`}>
              <path
                d={d}
                pathLength={1}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ajr-line-fg"
                style={{ animationDelay: `${delay}s` }}
                filter="url(#ajr-glow)"
              />
              <circle r="4" fill="#c4a8f5" filter="url(#ajr-glow)">
                <animateMotion
                  path={d}
                  dur="5s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  keyPoints="0;1"
                  keyTimes="0;0.42"
                  calcMode="linear"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0;0"
                  keyTimes="0;0.08;0.4;0.44;1"
                  dur="5s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* plain waypoint dots */}
        {rows.flatMap(({ points }, ri) =>
          points
            .filter((p) => p.type === "dot")
            .map((p, i) => (
              <circle
                key={`dot-${ri}-${i}`}
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#ede8fb"
              />
            )),
        )}

        {/* success checkmark nodes */}
        {rows.map(({ points }, i) => {
          const end = points[points.length - 1];
          const delay = i * 0.9;
          return (
            <g key={`check-${i}`} transform={`translate(${end.x}, ${end.y})`}>
              <circle
                r="20"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                className="ajr-check-ring"
                style={{ animationDelay: `${delay + 2.1}s` }}
              />
              <circle r="15" fill="#22c55e" />
              <path
                d="M -6 0.5 L -1.5 5.5 L 7 -5.5"
                fill="none"
                stroke="#09080f"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* person + device / channel icon nodes */}
        {rows.flatMap(({ points }, ri) =>
          points
            .filter((p) => ICONS[p.type])
            .map((p, i) => {
              const Icon = ICONS[p.type];
              if (!Icon) return null;
              return (
                <foreignObject
                  key={`icon-${ri}-${i}`}
                  x={p.x - 15}
                  y={p.y - 15}
                  width={30}
                  height={30}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={22} color="#ede8fb" strokeWidth={1.75} />
                  </div>
                </foreignObject>
              );
            }),
        )}
      </svg>
    </div>
  );
}
