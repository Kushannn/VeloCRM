"use client";

export default function MetricCardsSkeleton() {
  return (
    <div className="flex gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 w-52 h-36 animate-pulse"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-[#2a2040]" />
          </div>

          {/* Content */}
          <div className="flex justify-between items-center mt-8">
            <div className="h-8 w-12 rounded bg-[#2a2040]" />

            <div className="bg-[#2d1d5e] rounded-lg h-10 w-10 flex items-center justify-center">
              <div className="h-5 w-5 rounded bg-[#43306d]" />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 h-3 w-20 rounded bg-[#1d3b2a]" />
        </div>
      ))}
    </div>
  );
}
