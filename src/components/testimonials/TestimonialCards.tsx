import AnimatedContent from "../ui/AnimatedContent";

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

export default function TestimonialCard({
  t,
}: {
  t: (typeof testimonials)[0];
}) {
  return (
    <AnimatedContent
      distance={100}
      direction="vertical"
      reverse={false}
      duration={0.8}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      scale={1}
      threshold={0.1}
      delay={0}
    >
      <div className="bg-black/60 border border-white/8 rounded-2xl p-5 flex flex-col justify-between gap-6 break-inside-avoid mb-4">
        {t.isCompanyCard && (
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            {/* replace with your logo if you have one */}
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
              ◎
            </div>
            {t.company}
          </div>
        )}

        <p className="text-zinc-100 text-sm leading-relaxed flex-1">
          {t.quote}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar placeholder — replace src with real image */}
            <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/20 flex items-center justify-center text-xs text-violet-300 font-semibold shrink-0">
              {t.name[0]}
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight mb-2">
                {t.name}
              </p>
              <p className="text-zinc-500 text-xs">{t.role}</p>
            </div>
          </div>

          {/* X / Twitter icon */}
          <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-colors cursor-pointer shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
}
